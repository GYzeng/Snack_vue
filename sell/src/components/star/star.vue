<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in intemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGHT = 5;          // 星星的数量
  const CLS_ON = 'on';       // 对应满星图片
  const CLS_HALF = 'half';   // 半星图片
  const CLS_OFF = 'off';     // 没星图片
  export default {
    name: 'star',
    props: {
      // 星星大小
      size: {
        type: Number
      },
      // 传递过来的分数
      score: {
        type: Number
      }
    },
    computed: {
      // 决定星星大小的计算属性
      starType () {
        return 'star-' + this.size;
      },
      intemClasses () {
        console.log(this.score);
        let result = [];
        // * 2 向下取整 / 2 为了保证数字不是整数就是.5
        let score = Math.floor(this.score * 2) / 2;
        // 判断是否有小数
        let hasDecimal = score % 1 !== 0;
        // 获取整分
        let integer = Math.floor(score);
        // 先遍历整分 放入对应的整星
        for (var i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        // 放入半星
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        // 如果 当前星星不满最高数,继续放入空星
        while (result.length < LENGHT) {
          result.push(CLS_OFF);
        }
        return result;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  .star{
    font-size: 0;
  }
  .star .star-item{
    display: inline-block;
    background-repeat: no-repeat;
  }
  .star.star-48 .star-item{
    width: 20px;
    height: 20px;
    margin-right: 22px;
    background-size: 20px 20px;
  }
  .star.star-48 .star-item:last-child{
    margin-right: 0;
  }
  .star.star-48 .star-item.on{
    bg-image('star48_on')
  }
  .star.star-48 .star-item.half{
    bg-image('star48_half')
  }
  .star.star-48 .star-item.off{
    bg-image('star48_off')
  }
  .star.star-36 .star-item{
    width: 15px;
    height: 15px;
    margin-right: 16px;
    background-size: 15px 15px;
  }
  .star.star-36 .star-item:last-child{
    margin-right: 0;
  }
  .star.star-36 .star-item.on{
    bg-image('star36_on')
  }
  .star.star-36 .star-item.half{
    bg-image('star36_half')
  }
  .star.star-36 .star-item.off{
    bg-image('star36_off')
  }
  .star.star-24 .star-item{
    width: 10px;
    height: 10px;
    margin-right: 16px;
    background-size: 10px 10px;
  }
  .star.star-24 .star-item:last-child{
    margin-right: 0;
  }
  .star.star-24 .star-item.on{
  bg-image('star24_on')
  }
  .star.star-24 .star-item.half{
  bg-image('star24_half')
  }
  .star.star-24 .star-item.off{
  bg-image('star24_off')
  }
</style>
