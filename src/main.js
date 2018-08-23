import Vue from 'vue';
import shortid from 'shortid';
import VueClipboard from 'vue-clipboard2';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import VueMq from 'vue-mq';
import Transitions from 'vue2-transitions';
import VueTheMask from 'vue-the-mask';
import 'element-ui/lib/theme-chalk/display.css';
import '@/firebase';
import router from '@/router';
import App from './App.vue';
import store from './store';

const genkey = {};
genkey.install = () => {
  Vue.prototype.$genkey = shortid.generate;
};
Vue.use(require('vue-shortkey'));

Vue.use(VueTheMask);
Vue.use(ElementUI, { locale });
Vue.use(VueClipboard);
Vue.use(genkey);
Vue.use(Transitions);
Vue.use(VueMq, {
  breakpoints: {
    xs: 480,
    sm: 980,
    md: 1250,
    lg: 3000,
    xl: 5000,
  },
});

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
