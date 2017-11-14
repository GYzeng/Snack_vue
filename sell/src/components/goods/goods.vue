<template>
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
            <li v-for="food in item.foods" class="food-item">
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
    <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>

</template>

<script type="text/ecmascript-6">
  import BSscroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart.vue';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  const ERR_OK = 0;
  export default {
    name: 'goods',
    data () {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0
      };
    },
    props: {
      seller: {
        type: Object
      }
    },
    computed: {
      currentIndex () {
        for (var i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
      },
      selectFoods () {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then((response) => {
        let body = response.body;
        if (body.errno === ERR_OK) {
          this.goods = body.data;
          this.$nextTick(() => {
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
      'cartcontrol': cartcontrol
    },
    methods: {
     cartAdd (target) {
       this.$nextTick(() => {
         this.$refs.shopcart.drop(target);
       });
     },
     selectMenu (index, event) {
       if (!event._constructed) {
         return;
       }
       let foodList = document.getElementsByClassName('food-list-hook');
       let el = foodList[index];
       // 第一个参数是滚动的Y点,第二个是动画执行的时间
       this.foodScroll.scrollToElement(el, 300);
     },
     _initScroll () {
       var meun = document.getElementsByClassName('menu-wrapper')[0];
       var foods = document.getElementsByClassName('foods-wrapper')[0];
        this.meunScroll = new BSscroll(meun, {
          click: true
        });
        this.foodScroll = new BSscroll(foods, {
          probeType: 3,
          click: true
        });
        this.foodScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight () {
        let foodList = document.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (var i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
        console.log(this.listHeight);
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
  .goods .menu-wrapper .menu-item.current{
    position: relative;
    z-index: 10;
    margin-top: -1px;
    background-color: #fff;
    font-weight: 700;
  }
  .goods .menu-wrapper .menu-item.current{

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