<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="conten-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount}">
            <i class="icon-shopping_cart" :class="{'highlight':totalCount}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalCount}">${{totalPrice}}</div>
        <div class="desc">另需配送费${{deliveryPrice}}</div>
      </div>
      <div class="conten-right">
        <div class="pay" :class="payClass">
          {{ payDesc }}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <transition-group  v-on:before-enter="beforeEnter"
                         v-on:enter="enter"
                         v-on:after-enter="afterEnter" name="drop">
        <div v-for="(ball, index) in balls" :key="index"  v-show="ball.show" class="ball">
          <div class="inner"></div>
        </div>
      </transition-group>
    </div>
    <div class="shopcart-list" v-show="listShow">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty">清空</span>
      </div>
      <div class="list-content">
        <ul>
          <li class="food" v-for="food in selectFoods">
            <span class="name">{{food.name}}</span>
            <div class="price">
              <span>${{food.price*food.count}}</span>
            </div>
            <div class="cartontrol-wrapper">
              <cartcontrol :food="food"></cartcontrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  export default {
    name: 'shopcart',
    data () {
      return {
        // 小球数组
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        // 点击的小球数组
        dropBalls: [],
        fold: true
      };
    },
    props: {
      // 选中的商品
      selectFoods: {
        type: Array,
        default () {
          return [];
        }
      },
      // 配送费
      deliveryPrice: {
        type: Number,
        default: 0
      },
      // 还差多少钱配送
      minPrice: {
        type: Number,
        default: 0
      }
    },
    methods: {
      // 小球动画开始,这个方法主要由,父组件调用
      drop (el) {
        for (var i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      // 设置动画的初始状态,钩子动画函数
      beforeEnter: function (el) {
        // 获取小球总数
        let count = this.balls.length;
        // 循环 每个小球,如果show属性为true开始执行
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            // 获取点击元素的起始布局,并计算出位置,设置transform
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner')[0];
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
          }
        }
      },
      // 此回调函数是可选项的设置
      // 与 CSS 结合时使用
      enter: function (el, done) {
        // ...
        done();
        // 触发重绘html
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          // 让动画效果异步执行,提高性能
          el.style.webkitTransform = 'translate3d(0, 0, 0)';
          el.style.transform = 'translate3d(100, 0, 0)';
          // 处理内层动画
          // 使用inner-hook类来单纯被js操作
          let inner = el.getElementsByClassName('inner')[0];
          inner.style.webkitTransform = 'translate3d(0, 0, 0)';
          inner.style.transform = 'translate3d(0, 0, 0)';
        });
      },
      // 动画结束
      afterEnter: function (el) {
        // 动画执行完毕将第一个小球删除 并给删除的小球改变状态
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
//          el.style.display = 'none';
        }
      },
      toggleList () {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      }
    },
    computed: {
      // 计算金额,所有选中的商品数量*单价累加
      totalPrice () {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      // 获取选择商品个数
      totalCount () {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      // 结算文本的动态改变
      payDesc () {
        // 总价格为0,默认最低配送价格,不到配送价格显示差价,满额显示结算
        if (this.totalPrice === 0) {
          return '$' + `${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return '还差$' + `${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      // 结算文本样式
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow () {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        return show;
      }
    },
    components: {
      'cartcontrol': cartcontrol
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .shopcart {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    width: 100%;
    height: 48px;
  }

  .shopcart .content {
    display: flex;
    background: #141d27;
    font-size: 0px;
    color: rgba(255, 255, 255, 0.4);
  }

  .shopcart .content .conten-left {
    flex: 1;
  }

  .shopcart .content .conten-left .logo-wrapper {
    display: inline-block;
    position: relative;
    top: -10px;
    margin: 0 12px;
    padding: 6px;
    width: 56px;
    height: 56px;
    box-sizing: border-box;
    vertical-align: top;
    border-radius: 50%;
    background: #141d27;
  }

  .shopcart .content .conten-left .logo-wrapper .logo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #2b343c;
    text-align: center;
  }

  .shopcart .content .conten-left .logo-wrapper .logo.highlight {
    background: rgb(0, 160, 220);
  }

  .shopcart .content .conten-left .logo-wrapper .logo .icon-shopping_cart {
    line-height: 44px;
    font-size: 24px;
    color: #80858a;
  }

  .shopcart .content .conten-left .logo-wrapper .logo .icon-shopping_cart.highlight {
    color: #fff;
  }

  .shopcart .content .conten-left .logo-wrapper .num {
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 16px;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    background-color: rgb(240, 20, 20);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
  }

  .shopcart .content .conten-left .price {
    display: inline-block;
    margin-top: 12px;
    vertical-align: top;
    line-height: 24px;
    padding-right: 12px;
    font-size: 16px;
    font-weight: 700;
    box-sizing: border-box;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }

  .shopcart .content .conten-left .price.highlight {
    color: #fff;
  }

  .shopcart .content .conten-left .desc {
    display: inline-block;
    vertical-align: top;
    line-height: 24px;
    margin: 12px 0 0 12px;
    color: rgba(255, 255, 255, 0.4);
    font-size: 10px;
  }

  .shopcart .content .conten-right {
    flex: 0 0 105px;
    width: 105px;
  }

  .shopcart .content .conten-right .pay {
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    background: #2b333b;
  }

  .shopcart .content .conten-right .pay.ont-enough {
    background: #2b333b;
  }

  .shopcart .content .conten-right .pay.enough {
    background: #00b43c;
  }

  .shopcart .ball-container {
    /*transition: all .6s cubic-bezier(0.11, 0.92, 0.98, 0.75);*/
  }
  .shopcart .ball-container .ball {
    position: fixed;
    left: 32px;
    bottom: 22px;
    z-index: 200;
    transition: all 0.2s cubic-bezier(0.49,-0.29,0.75,0.41);
  }
  .shopcart .ball-container .ball .inner {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgb(0, 160, 220);
    transition: all 0.2s linear;
  }

</style>
