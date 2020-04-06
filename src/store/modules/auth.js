import { AUTH as AUTH_MUTATIONS } from '../mutations'
import { AUTH as AUTH_ACTIONS } from '../actions'
import Vue from 'vue'

const state = {
    loading: false,//是否正在发起获取权限的请求
    is_request:false,//是否已经向后端发起过请求
    menus: [],   //菜单
    routes: [],  //路由
    btns: []     //按钮
}

const getters = {
    //检查路由是否有权限
    checkRoute: (state) => (route) => {
        return state.routes.findIndex(item => item.identify === route) !== -1;
    },

    //检查按钮是否有权限
    checkBtn: (state) => (btn) => {
        return state.btns.findIndex(item => item.identify === btn) !== -1;
    }
}

const mutations = {
    //修改加载状态
    [AUTH_MUTATIONS.SET_LOADING](state, loading) {
        state.loading = loading;
    },

    //修改请求状态
    [AUTH_MUTATIONS.SET_IS_REQUEST](state, is_request){
        state.is_request = is_request;
    },

    //修改路由列表
    [AUTH_MUTATIONS.SET_ROUTES](state, routes) {
        state.routes = routes;
    },

    //修改菜单列表
    [AUTH_MUTATIONS.SET_MENUS](state, menus) {
        state.menus = menus;
    },

    //修改按钮列表
    [AUTH_MUTATIONS.SET_BTNS](state, btns) {
        state.btns = btns;
    }
}

const actions = {
    [AUTH_ACTIONS.REQUEST_AUTH]({ commit }) {
        commit(AUTH_MUTATIONS.SET_LOADING, true);

        return new Promise((resolve,reject)=>{
            Vue.$_get('permission/userPermission').then((res) => {
                const { routePermissions, btnPermissions } = res.data.permissions;
                commit(AUTH_MUTATIONS.SET_ROUTES, routePermissions);
                commit(AUTH_MUTATIONS.SET_BTNS, btnPermissions);
                commit(AUTH_MUTATIONS.SET_LOADING, false);
                commit(AUTH_MUTATIONS.SET_IS_REQUEST, true);
                resolve(res);
            }).catch((e)=>{
                reject(e);
            }).finally(() => {
                commit(AUTH_MUTATIONS.SET_LOADING, false);
            })
        })
    }
}


export default {
    namespaced: true,
    getters,
    state,
    mutations,
    actions
}