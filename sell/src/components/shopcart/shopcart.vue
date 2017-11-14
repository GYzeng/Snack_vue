<template>
  <div class="shopcart">
    <div class="content">
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
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'shopcart',
    data () {
      return {
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
        dropBalls: []
      };
    },
    props: {
      selectFoods: {
        type: Array,
        default () {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    methods: {
      drop (el) {
        console.log(el);
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
      beforeEnter: function (el) {
        // ...

        let count = this.balls.length;
        console.log(this.balls);
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            console.log(el);
            let inner = el.getElementsByClassName('inner')[0];
            console.log(inner);
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
      afterEnter: function (el) {
        // ...
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
//          el.style.display = 'none';
        }
      }
    },
    computed: {
      totalPrice () {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount () {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return '$' + `${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return '还差$' + `${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      }
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
