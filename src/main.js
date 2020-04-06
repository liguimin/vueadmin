import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import appConfig from '@/config/app.js'
import Axios from '@/plugins/Axios'
import {Auth,AuthButton} from '@/components/auth';

import { Button } from 'iview'
import 'iview/dist/styles/iview.css'

Vue.config.productionTip = false;

//注册配置信息到全局
Vue.$_config = appConfig;

//注册ajax请求方法
Vue.use(Axios);

//注册全局组件
Vue.component('Button',Button);
Vue.component('Auth', Auth);
Vue.component('AuthButton',AuthButton);

//注册promise的finally方法
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
