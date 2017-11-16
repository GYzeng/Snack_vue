<template>
  <div class="goods-wrapper">
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex === index}
        " @click="selectMenu(index, $event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{ item.name }}
          </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods " class="food-list food-list-hook">
            <h1 class="title">{{ item.name }}</h1>
            <ul>
              <li @click="selectFood(food, $event)" v-for="food in item.foods" class="food-item">
                <div class="icon">
                  <img width="57px" height="57px" :src="food.icon" alt="">
                </div>
                <div class="content">
                  <h2 class="name">{{ food.name }}</h2>
                  <p class="desc"> {{ food.description}} </p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">${{food.price}}</span>
                    <span v-show="food.oldPrice" class="old">${{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol v-on:cartAdd="cartAdd" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice"
                :min-price="seller.minPrice"></shopcart>
    </div>
    <food :food="selectedFood" ref="food"></food>
  </div>


</template>

<script type="text/ecmascript-6">
  // better-scoll 滚动插件
  import BSscroll from 'better-scroll';
  // 购物车组件
  import shopcart from '../shopcart/shopcart.vue';
  // 增加删除商品的组件
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  // 商品详情
  import food from '../food/food.vue';
  const ERR_OK = 0;
  export default {
    name: 'goods',
    data () {
      return {
        goods: [],
        // 关联2个滚动条高度的数组(记录的是右侧的)
        listHeight: [],
        // 当前的y值
        scrollY: 0,
        selectedFood: {}
      };
    },
    props: {
      seller: {
        type: Object
      }
    },
    computed: {
      // 根据右侧栏的滚动 来变动当前选中左侧栏的index
      currentIndex () {
        for (var i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          /*
            计算规则 当!height2 为真时,代表取值为空 当前i就在最后一个值了,
            而如果当前y点大于第一个值,并小于第二个值的时候证明当前滚动单在当前右侧子栏的位置
            直接返回对应的i
          */
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
      },
      // 给子组件传递的计算属性,主要是哪个商品选中了,选中了多少
      selectFoods () {
        let foods = [];
        this.goods.forEach((good) => {
          // 获取商品
          good.foods.forEach((food) => {
            // 如果这个商品有 count 属性并不等于0,就添加进数组
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created () {
      // 对应的图标样式数组
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then((response) => {
        let body = response.body;
        if (body.errno === ERR_OK) {
          this.goods = body.data;
          console.log(this.goods);
          this.$nextTick(() => {
            // 初始化scroll组件
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
    },
    mounted () {

    },
    components: {
      'shopcart': shopcart,
      'cartcontrol': cartcontrol,
      'food': food
    },
    methods: {
      // 当添加一件购物车商品时触发,主要对应绑定在子组件上
      cartAdd (target) {
        // 这样写为了是性能优化 不会一次性渲染太多动画
        this.$nextTick(() => {
          // 让shopcart组件执行函数
          this.$refs.shopcart.drop(target);
        });
      },
      // 左侧滑动栏按钮点击事件
      selectMenu (index, event) {
        if (!event._constructed) {
          return;
        }
        // 获取全部的子列表
        let foodList = document.getElementsByClassName('food-list-hook');
        // 拿到对应的dom
        let el = foodList[index];
        // 第一个参数是滚动的Y点,第二个是动画执行的时间
        this.foodScroll.scrollToElement(el, 300);
      },
      // 选中商品
      selectFood (food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.showFood();
      },
      // 初始化scroll
      _initScroll () {
        // 拿到左右列表
        var meun = document.getElementsByClassName('menu-wrapper')[0];
        var foods = document.getElementsByClassName('foods-wrapper')[0];
        this.meunScroll = new BSscroll(meun, {
          click: true
        });
        this.foodScroll = new BSscroll(foods, {
          // 1 滚动的时候会派发scroll事件，会截流。
          // 2滚动的时候实时派发scroll事件，不会截流。
          // 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
          probeType: 3,
          click: true
        });
        // 监听滚动
        this.foodScroll.on('scroll', (pos) => {
          // 取整加绝对值,放入监听的当前y值中
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      // 初始化右侧栏的子栏高度数组
      _calculateHeight () {
        // 获取全部子栏dom
        let foodList = document.getElementsByClassName('food-list-hook');
        // 高度初始化宾亮
        let height = 0;
        this.listHeight.push(height);
        for (var i = 0; i < foodList.length; i++) {
          // 将子组件dom依次取出 获取高度 累加 放入高度数组中
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .goods {
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
  }

  .goods .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background-color: #f3f3f7;
  }

  .goods .menu-wrapper .menu-item {
    display: table;
    padding: 0 12px;
    height: 54px;
    width: 56px;
    line-height: 14px;
  }

  .goods .menu-wrapper .menu-item.current {
    position: relative;
    z-index: 10;
    margin-top: -1px;
    background-color: #fff;
    font-weight: 700;
  }

  .goods .menu-wrapper .menu-item.current {

  }

  .goods .menu-wrapper .menu-item .icon {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    height: 12px;
    margin-right: 2px;
    background-size: 12px 12px;
    background-repeat: no-repeat;
  }

  .goods .menu-wrapper .menu-item .icon.decrease {
  bg-image('decrease_3')
  }

  .goods .menu-wrapper .menu-item .icon.discount {
  bg-image('discount_3')
  }

  .goods .menu-wrapper .menu-item .icon.guarantee {
  bg-image('guarantee_3')
  }

  .goods .menu-wrapper .menu-item .icon.invoice {
  bg-image('invoice_3')
  }

  .goods .menu-wrapper .menu-item .icon.special {
  bg-image('special_3')
  }

  .goods .menu-wrapper .menu-item .text {
    display: table-cell;
    width: 50px;
    vertical-align: middle;
    font-size: 12px;
  border-1px(rgba(7, 17, 27, 0.1));
  }

  .goods .foods-wrapper {
    flex: 1;
  }

  .goods .foods-wrapper .title {
    padding-left: 14px;
    height: 26px;
    line-height: 26px;
    border-left: 2px solid #d9dde1;
    font-size: 12px;
    color: rgb(147, 153, 159);
    background: #f3f5f7;

  }

  .goods .foods-wrapper .food-item {
    display: flex;
    padding-bottom: 18px;
    margin: 18px;
  border-1px(rgba(7, 17, 27, 0.1));
  }

  .goods .foods-wrapper .food-item:last-child {
    margin-bottom: 0px;
  border-none()
  }

  .goods .foods-wrapper .food-item .icon {
    flex: 0 0 57px;
    margin-right: 10px;
  }

  .goods .foods-wrapper .food-item .content {
    flex: 100
  }

  .goods .foods-wrapper .food-item .content .name {
    margin: 2px 0 8px 0;
    height: 14px;
    line-height: 14px;
    font-size: 14px;
    color: rgb(7, 17, 27);
  }

  .goods .foods-wrapper .food-item .content .desc, .extra {
    line-height: 10px;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .goods .foods-wrapper .food-item .content .desc {
    margin-bottom: 8px;
    line-height: 12px;
  }

  .goods .foods-wrapper .food-item .content .extra .count {
    margin-right: 12px;
  }

  .goods .foods-wrapper .food-item .content .price {
    font-weight: 700;
    line-height: 24px;
  }

  .goods .foods-wrapper .food-item .content .price .now {
    margin-right: 8px;
    font-size: 14px;
    color: rgb(240, 20, 20);
  }

  .goods .foods-wrapper .food-item .content .price .old {
    text-decoration: line-through;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .goods .foods-wrapper .food-item .content .cartcontrol-wrapper {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
</style>
