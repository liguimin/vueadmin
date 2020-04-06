import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { getValue } from '../utils/Fuc'
import store from '@/store/index'
import { AUTH } from '@/store/actions'
import local from '@/utils/store'
import { LoadingBar } from 'iview';

Vue.use(VueRouter)
Vue.use(LoadingBar)

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

//鉴权
router.beforeEach((to, from, next) => {
    const requireLogin = getValue(to.meta, 'requireLogin', false);
    const requireAuth = getValue(to.meta, 'requireAuth', false);

    //检查登录权限
    if (requireLogin) {
        const token = local.get('token');
        if (!token) {
            next({
                path: '/login'
            });
        }
    }

    //检查路由权限
    if (requireAuth) {
        //进度条
        LoadingBar.start();
        //如果未从后端获取权限，则先获取权限
        const { auth } = store.state;
        console.log(auth);
        if (!auth.is_request) {
                    console.log(to.path)
            store.dispatch(AUTH.NAMESPACE + '/' + AUTH.REQUEST_AUTH).then(() => {
                if (!store.getters['auth/checkRoute'](to.path)) {
                    next({
                        path: 'forbidden'
                    })
                }
            })
        } else {
            if (!store.getters['auth/checkRoute'](to.path)) {
                next({
                    path: 'forbidden'
                })
            }
        }
    }
    next();
});


router.afterEach(() => {
    LoadingBar.finish();
});

export default router
