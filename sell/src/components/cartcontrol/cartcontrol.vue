<template>
  <div class="cartcontrol">
    <transition name="fade-roll">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0"
           @click.stop.prevent="decreaseCart"></div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{ food.count }}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>

  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  export default {
    name: 'cartcontrol',
    data () {
      return {};
    },
    props: {
      food: {
        type: Object
      }
    },
    created () {

    },
    methods: {
      // 增加一件商品
      addCart (event) {
        // event._constructed 主要针对pc
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          // 给 food这个对象 挂载一个叫count的属性 赋值1 并对这个属性进行监听
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        // 调用 绑定的的父组件事件 并把当前点击元素的dom传递
        this.$emit('cartAdd', event.target);
      },
      // 减少一件商品
      decreaseCart (event) {
        if (!event._constructed) {
          return;
        }
        this.food.count--;
        if (this.food.count < 0) {
          this.food.count = 0;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol {
    font-size: 0;
    transition: all .15s;
  }
  .cartcontrol .cart-decrease, .cartcontrol .cart-add {
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    color: rgb(0, 160, 220);
  }
  .cartcontrol .cart-decrease {

  }
  .cartcontrol .cart-count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }
  .cartcontrol .cart-add {
    display: inline-block;
  }
  .cartcontrol .cart-decrease.fade-roll-enter-active {
    opacity: 1;
    transform: translate3D(0, 0, 0) rotate(0deg);
    transition: all .5s ease;
  }
  .cartcontrol .cart-decrease.fade-roll-leave-active {
    transform: translate3D(0, 0, 0) rotate(0deg);
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .cartcontrol .cart-decrease.fade-roll-enter, .cartcontrol .cart-decrease.fade-roll-leave-to {
    transform: translate3D(24px, 0px, 0px) rotate(360deg);
    opacity: 0;
  }
</style>
