import Vue from 'vue';
import Router from 'vue-router';
import VueResourse from 'vue-resource';
import goods from '@/components/goods/goods.vue';
import ratings from '@/components/ratings/ratings.vue';
import seller from '@/components/seller/seller.vue';
import '../common/stylus/index.styl';

Vue.use(Router);
Vue.use(VueResourse);

// let router = new Router();

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/goods'
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    }
  ],
  linkActiveClass: 'active'
});
// router.go('/goods');
