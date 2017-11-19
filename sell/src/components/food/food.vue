<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
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
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">${{food.price}}</span><span class="old" v-show="food.oldPrice">${{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol v-on:cartAdd="cartAdd" :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{ food.info }}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect v-on:selected="selected" v-on:toogleContent="toogleContent"
                        :selectType="selectType" :onlyContent="onlyContent" :desc="desc"
                        :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar" alt="">
                </div>
                <div class="time">{{formatDate(rating.rateTime)}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="nor-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import split from '../split/split.vue';
  import ratingselect from '../ratingselect/ratingselect.vue';
  import {formatDate} from '../../common/js/date.js';
  //  const POSITIVE = 0;
  //  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    name: 'food',
    data () {
      return {
        // 控制详情组件的开关
        showFlag: false,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
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
        this.selectType = ALL;
        this.onlyContent = false;
        this.$nextTick(() => {
          let food = this.$refs.food;
          if (!this.scroll) {
            this.scroll = new BScroll(food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      // 关闭详情
      hiddenFood () {
        this.showFlag = false;
      },
      addFirst (event) {
        // event._constructed 主要针对pc
        if (!event._constructed) {
          return;
        }
        Vue.set(this.food, 'count', 1);
        // 调用 绑定的的父组件事件 并把当前点击元素的dom传递
        this.$emit('cartAdd', event.target);
      },
      cartAdd (target) {
        this.$emit('cartAdd', target);
      },
      selected (selectType) {
        this.selectType = selectType;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toogleContent (onlyConten) {
        this.onlyContent = onlyConten;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      needShow (rateType, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return rateType === this.selectType;
        }
      },
      formatDate (time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      'cartcontrol': cartcontrol,
      'split': split,
      'ratingselect': ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .food {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%;
    background: #fff;
  }

  .food.move-enter-active {
    transition: all .3s linear;
    transform: translate3D(0, 0, 0);
  }

  .food.move-enter, .food.move-leave-to {
    transition: all .3s linear;
    transform: translate3D(100%, 0, 0);
  }

  .food .food-content {
  }

  .food .food-content .image-header {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
  }

  .food .food-content .image-header img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .food .food-content .image-header .back {
    position: absolute;
    top: 10px;
    left: 0;
  }

  .food .food-content .image-header .back .icon-arrow_lift {
    display: block;
    padding: 10px;
    font-size: 20px;
    color: #fff;
  }

  .food .food-content .content {
    padding: 18px;
    position: relative;
  }

  .food .food-content .content .title {
    line-height: 14px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 700;
    color: rgb(7, 17, 27);
  }

  .food .food-content .content .detail {
    margin-bottom: 18px;
    line-height: 10px;
    font-size: 0;
    height: 10px;
  }

  .food .food-content .content .detail .sell-count, .food .food-content .content .detail .rating {
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .food .food-content .content .detail .sell-count {
    margin-right: 12px;
  }

  .food .food-content .content .detail .rating {
  }

  .food .food-content .content .price {
    font-weight: 700;
    line-height: 24px;
  }

  .food .food-content .content .price .now {
    margin-right: 8px;
    font-size: 14px;
    color: rgb(240, 20, 20);
  }

  .food .food-content .content .price .old {
    text-decoration: line-through;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .food .food-content .content .cartcontrol-wrapper {
    position: absolute;
    right: 12px;
    bottom: 12px;
  }

  .food .food-content .content .buy {
    position: absolute;
    right: 18px;
    bottom: 18px;
    z-index: 10;
    height: 24px;
    line-height: 24px;
    padding: 0 12px;
    box-sizing: border-box;
    font-size: 10px;
    border-radius: 12px;
    color: #fff;
    background: rgb(0, 160, 220);
  }

  .food .food-content .content .buy.fade-enter-active, .food .food-content .content .buy.fade-leave-active {
    transition: all .2s;
    opacity: 1;
  }

  .food .food-content .content .buy.fade-enter, .food .food-content .content .buy.fade-leave-to {

    opacity: 0;

  }

  .food .food-content .info {
    padding: 18px;

  }

  .food .food-content .info .title {
    line-height: 14px;
    margin-bottom: 6px;
    font-size: 14px;
    color: rgb(7, 17, 27);
  }

  .food .food-content .info .text {
    padding: 0 8px;
    line-height: 24px;
    font-size: 12px;
    color: rgb(77, 85, 93);
  }

  .food .food-content .rating {
    padding-top: 18px;
  }

  .food .food-content .rating .title {
    line-height: 14px;
    margin-left: 18px;
    font-size: 14px;
    color: rgb(7, 17, 27);
  }

  .food .food-content .rating .rating-wrapper {
    padding: 0 18px;
  }

  .food .food-content .rating .rating-wrapper .rating-item {
    position: relative;
    padding: 16px 0;
  border-1px(rgba(7, 17, 27, 0.1))
  }

  .food .food-content .rating .rating-wrapper .rating-item .user {
    position: absolute;
    right: 0;
    top: 16px;
    line-height: 12px;
    font-size: 0;
  }

  .food .food-content .rating .rating-wrapper .rating-item .user .name {
    display: inline-block;
    vertical-align: top;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .food .food-content .rating .rating-wrapper .rating-item .time {
    margin-bottom: 6px;
    line-height: 12px;
    font-size: 10px;
    color: rgb(147,153,139);
  }
  .food .food-content .rating .rating-wrapper .rating-item .text {

    line-height: 16px;
    font-size: 12px;
    color: rgb(7,17,27);
  }

  .food .food-content .rating .rating-wrapper .rating-item .text .icom-thumb_up, .food .food-content .rating .rating-wrapper .rating-item .text .icon-thumb_down{
    margin-right: 4px;
    line-height: 16px;
    font-size: 12px;
  }
  .food .food-content .rating .rating-wrapper .rating-item .text .icom-thumb_up{
    color: rgb(0,160,220);
  }
  .food .food-content .rating .rating-wrapper .rating-item .text .icon-thumb_down{
    color: rgb(147,153,159);
  }
  .food .food-content .rating .rating-wrapper .nor-rating {
    padding: 16px 0;
    font-size: 12px;
    color: rgb(147,153,159);
  }
  .food .food-content .rating .rating-wrapper {
  }

  .food .food-content .rating .rating-wrapper {
  }

  .food .food-content .rating .rating-wrapper {
  }
</style>
