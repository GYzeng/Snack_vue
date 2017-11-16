<template>
  <transition name="move">
    <div class="food" v-show="showFlag">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div @click="hiddenFood" class="back">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{ food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">${{food.price}}</span>
            <span class="old" v-show="food.oldPrice">${{food.oldPrice}}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'food',
    data () {
      return {
        // 控制详情组件的开关
        showFlag: false
      };
    },
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      // 显示详情组件
      showFood () {
        this.showFlag = true;
      },
      // 关闭详情
      hiddenFood () {
        this.showFlag = false;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .food {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%;
    background: #fff;
  }
  .food.move-enter-active{
    transition: all .3s linear;
    transform: translate3D(0,0,0);
  }
  .food.move-enter, .food.move-leave-to{
    transition: all .3s linear;
    transform: translate3D(100%,0,0);
  }
  .food .food-content{}
  .food .food-content .image-header{
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
  }
  .food .food-content .image-header img{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .food .food-content .image-header .back{
    position: absolute;
    top: 10px;
    left: 0;
  }
  .food .food-content .image-header .back .icon-arrow_lift{
    display: block;
    padding: 10px;
    font-size: 20px;
    color: #fff;
  }
</style>
