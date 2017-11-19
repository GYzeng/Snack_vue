<template>
  <div class="rating">
    <div class="rating-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect v-on:selected="selected" v-on:toogleContent="toogleContent"
                    :selectType="selectType" :onlyContent="onlyContent" :desc="desc"
                    :ratings="ratings"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" v-show="needShow(rating.rateType,rating.text)" class="rating-item">
            <div class="avtar">
              <img width="28" height="28" :src="rating.avatar" alt="">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime"></span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend.length && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span v-for="item in rating.recommend" class="item">{{item}}</span>
              </div>
              <div class="time">{{formatDate(rating.rateTime)}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BSscroll from 'better-scroll';
  import star from '../star/star.vue';
  import split from '../split/split.vue';
  import ratingselect from '../ratingselect/ratingselect.vue';
  import {formatDate} from '../../common/js/date.js';
  //  const POSITIVE = 0;
  //  const NEGATIVE = 1;
  const ALL = 2;
  const ERR_OK = 0;
  export default {
    name: 'ratings',
    data () {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      };
    },
    props: {
      seller: {
        type: Object
      }
    },
    methods: {
      selected (selectType) {
        this.selectType = selectType;
        this.$nextTick(() => {
          this.ratingScroll.refresh();
        });
      },
      toogleContent (onlyConten) {
        this.onlyContent = onlyConten;
        this.$nextTick(() => {
          this.ratingScroll.refresh();
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
      },
      // 初始化scroll
      _initScroll () {
        // 拿到左右列表
        var rating = document.getElementsByClassName('rating')[0];
        this.ratingScroll = new BSscroll(rating, {
          click: true
        });
      }
    },
    components: {
      'star': star,
      'split': split,
      'ratingselect': ratingselect
    },
    created () {
      this.$http.get('api/ratings').then((response) => {
        let body = response.body;
        if (body.errno === ERR_OK) {
          this.ratings = body.data;
          this.$nextTick(() => {
            this._initScroll();
          });
        }
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .rating {
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
  }

  .rating .rating-content {
  }

  .rating .rating-content .overview {
    display: flex;
    padding: 18px 0;

  }

  .rating .rating-content .overview .overview-left {
    fiex: 0 0 137px;
    padding: 6px 0;
    width: 134px;
    border-right: 1px solid rgba(7, 17, 27, 0.1);
    text-align: center;
  }

  @media only screen and (max-width: 320px) {
    .rating .rating-content .overview .overview-left {
      flex: 0 0 120px;
      width: 120px;
    }
  }

  .rating .rating-content .overview .overview-left .score {
    margin-bottom: 6px;
    line-height: 28px;
    font-size: 24px;
    color: rgb(255, 153, 0);
  }

  .rating .rating-content .overview .overview-left .title {
    margin-bottom: 8px;
    line-height: 12px;
    font-size: 12px;
    color: rgb(7, 17, 27);
  }

  .rating .rating-content .overview .overview-left .rank {

    line-height: 10px;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .rating .rating-content .overview .overview-right {
    flex: 1;
    padding-left: 20px;
  }

  @media only screen and (max-width: 320px) {
    .rating .rating-content .overview .overview-right {
      flex: 1;
      padding-left: 6px;
    }
  }

  .rating .rating-content .overview .overview-right .score-wrapper {
    margin-bottom: 9px;
    font-size: 0;
  }

  .rating .rating-content .overview .overview-right .score-wrapper .title {
    display: inline-block;
    line-height: 18px;
    vertical-align: top;
    font-size: 12px;
    color: rgb(7, 17, 27);
  }

  .rating .rating-content .overview .overview-right .score-wrapper .star {
    display: inline-block;
    margin: 0 10px;
    vertical-align: top;
  }

  .rating .rating-content .overview .overview-right .score-wrapper .score {
    display: inline-block;
    vertical-align: top;
    line-height: 18px;
    font-size: 12px;
    color: rgb(255, 153, 0);
  }

  .rating .rating-content .overview .overview-right .delivery-wrapper {
    font-size: 0;
  }

  .rating .rating-content .overview .overview-right .delivery-wrapper .title {
    line-height: 18px;
    font-size: 12px;
    color: rgb(7, 17, 27);
  }

  .rating .rating-content .overview .overview-right .delivery-wrapper .delivery {
    margin-left: 12px;
    font-size: 12px;
    color: rgb(147, 153, 159);
  }

  .rating .rating-content .rating-wrapper {
    padding: 0 18px;
  }

  .rating .rating-content .rating-wrapper .rating-item {
    display: flex;
    padding: 18px 0;
  border-1px(rgba(7, 17, 27, 0.1))
  }

  .rating .rating-content .rating-wrapper .rating-item .avtar {
    flex: 0 0 28px;
    width: 28px;
    margin-right: 12px;

  }

  .rating .rating-content .rating-wrapper .rating-item .avtar img {
    border-radius: 50%;
  }

  .rating .rating-content .rating-wrapper .rating-item .content {
    position: relative;
    flex: 1;
  }

  .rating .rating-content .rating-wrapper .rating-item .content .name {
    margin-bottom: 4px;
    line-height: 12px;
    font-size: 10px;
    color: rgb(7, 17, 27);
  }

  .rating .rating-content .rating-wrapper .rating-item .content .star-wrapper {
    margin-bottom: 6px;
    font-size: 0;
  }

  .rating .rating-content .rating-wrapper .rating-item .content .star-wrapper .star {
    display: inline-block;
    margin-right: 6px;
    vertical-align: top;
  }

  .rating .rating-content .rating-wrapper .rating-item .content .star-wrapper .delivery {
    display: inline-block;
    vertical-align: top;
    line-height: 12px;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .rating .rating-content .rating-wrapper .rating-item .content .text {
    margin-bottom: 8px;
    line-height: 18px;
    color: rgb(7, 17, 27);
    font-size: 12px;
  }

  .rating .rating-content .rating-wrapper .rating-item .content .recommend {
    line-height: 16px;
    font-size: 0;
  }

  .rating .rating-content .rating-wrapper .rating-item .content .recommend .icon-thumb_up, .rating .rating-content .rating-wrapper .rating-item .content .recommend .item {
    display: inline-block;
    margin: 0 8px 4px 0;
    font-size: 9px;
  }

  .rating .rating-content .rating-wrapper .rating-item .content .recommend .icon-thumb_up {
    color: rgb(0, 160, 220);
  }

  .rating .rating-content .rating-wrapper .rating-item .content .recommend .item {
    padding: 0 6px;
    border: 1px solid rgba(7, 17, 27, 0.1);
    border-radius: 1px;
    color: rgb(147,153,159);
    background: #fff;
  }
  .rating .rating-content .rating-wrapper .rating-item .content .time{
    position: absolute;
    top: 0;
    right: 0;

    font-size: 12px;
  }
</style>
