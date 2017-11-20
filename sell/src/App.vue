<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue';
  import {urlParse} from './common/js/tool.js';
  // 后台状态码
  const ERR_OK = 0;
  export default {
    name: 'app',
    data () {
      return {
        // 网络数据
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    components: {
      // 头部组件
      'v-header': header
    },
    created () {
      this.$http.get('/api/seller').then((response) => {
        if (response.body.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, response.body.data);
          console.log(this.seller);
        }
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

  @import "./common/stylus/mixin.styl";

  #app .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
  border-1px(rgba(7, 17, 27, 0.1))
  }

  #app .tab .tab-item {
    flex: 1;
    text-align: center;
  }

  #app .tab .tab-item a {
    display: block;
    font-size: 14px;
    color: rgb(77, 85, 93);
  }

  #app .tab .tab-item a.active {
    color: rgb(240, 20, 20);
  }
</style>
