import NotFund from '../views/error/NotFund'
import Forbidden from '../views/error/Forbidden'
import Admin from '../views/admin/Index'

//需要登录
const requireLoginMeta = { requireLogin: true };

//需要访问权限
const requireAuthMeta = { requireAuth: true };

//路由表
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '../views/login/Login.vue')
    },

    {
        path: '/admin',
        name: 'admin',
        component: Admin,
        meta: { ...requireLoginMeta, ...requireAuthMeta },
        children: [

            {
                path: 'home',
                name: 'Home',
                meta: { ...requireLoginMeta, ...requireAuthMeta },
                component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
            },

            {
                path: 'user',
                name: 'user-index',
                meta: { ...requireLoginMeta, ...requireAuthMeta },
                component: () => import(/* webpackChunkName: "user" */ '../views/user/Index.vue')
            },


            {
                path: 'role',
                name: 'role-index',
                meta: { ...requireLoginMeta, ...requireAuthMeta },
                component: () => import(/* webpackChunkName: "role" */ '../views/role/Index.vue')
            },

            {
                path: 'permission',
                name: 'permission-index',
                meta: { ...requireLoginMeta, ...requireAuthMeta },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission/Index.vue')
            },

            {
                path: 'resources',
                name: 'resources-index',
                meta: { ...requireLoginMeta, ...requireAuthMeta },
                component: () => import(/* webpackChunkName: "permission" */ '../views/resources/Index.vue')
            },

            {
                path: 'menu',
                name: 'menu-index',
                meta: { ...requireLoginMeta, ...requireAuthMeta },
                component: () => import(/* webpackChunkName: "menu" */ '../views/menu/Index.vue')
            },

            {
                path: 'forbidden',
                name: 'Forbidden',
                component: Forbidden,
            },

            {
                path: '*',
                name: 'NotFund',
                component: NotFund,
            }

        ]
    },

    {
        path: '/forbidden',
        name: 'Forbidden',
        component: Forbidden,
    },

    {
        path: '*',
        name: 'NotFund',
        component: NotFund,
    }
]

export default routes;