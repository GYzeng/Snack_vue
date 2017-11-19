<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="selected(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span
        class="count">{{ratings.length}}</span></span>
      <span @click="selected(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span
        class="count">{{positives.length}}</span></span>
      <span @click="selected(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span
        class="count">{{negatives.length}}</span></span>
      <span></span>
    </div>
    <div @click="toogleContent" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    name: 'ratingselect',
    props: {
      ratings: {
        type: Array,
        default () {
          return [];
        }
      },
      selectType: {
        type: Number,
        default () {
          return ALL;
        }
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    methods: {
      selected (selectType, event) {
        // event._constructed 主要针对pc
        if (!event._constructed) {
          return;
        }
        this.$emit('selected', selectType);
//        this.selectType = selectType;
      },
      toogleContent (event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('toogleContent', !this.onlyContent);
      }
    },
    computed: {
      positives () {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }

    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .ratingselect {
  }

  .ratingselect .rating-type {
    padding: 18px 0;
    margin: 0 18px;
  border-1px(rgba(7, 17, 27, 0.1));
    font-size: 0;

  }

  .ratingselect .rating-type .block {
    display: inline-block;
    padding: 8px 12px;
    margin-right: 8px;
    border-radius: 1px;
    color: rgb(77, 85, 93);
    line-height: 16px;
    font-size: 12px;
  }

  .ratingselect .rating-type .block.active {
    color: #fff;
  }

  .ratingselect .rating-type .block .count {
    font-size: 8px;
    margin-left: 2px;

  }

  .ratingselect .rating-type .block.positive {
    background: rgba(0, 160, 220, 0.2);
  }

  .ratingselect .rating-type .block.positive.active {
    background: rgb(0, 160, 220);
  }

  .ratingselect .rating-type .block.negative {
    background: rgba(77, 85, 93, 0.2);
  }

  .ratingselect .rating-type .block.negative.active {
    background: rgb(77, 85, 93);
  }

  .ratingselect .switch {
    padding: 12px 18px;
    line-height: 24px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    color: rgb(127, 153, 159);
    font-size: 0px;
  }

  .ratingselect .switch.on .icon-check_circle {
    color: #00c850;
  }

  .ratingselect .switch .icon-check_circle {
    display: inline-block;
    vertical-align: top;
    margin-right: 4px;
    font-size: 24px;
  }

  .ratingselect .switch .text {
    font-size: 12px;
  }
</style>
