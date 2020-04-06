import { Modal, Message } from 'iview'
import Axios from '@/utils/Axios'
import appConfig from '@/config/app.js'
import store from '@/utils/store'

let closeMessage=false;
export default {
    //请求拦截处理方法
    reqHandle(config, msg) {
        if (msg !== false) {
            closeMessage = Message.loading({
                content: msg,
                duration: 0
            });
        }
        const token = store.get('token');
        token && (config.headers.Authorization = 'Bearer ' + token);
        return config;
    },

    //请求错误处理方法
    reqErrorHandle(error) {
        if (closeMessage !== false) {
            closeMessage();
        }
        // if (modal!==false){
        //     modal.destroy();
        // }

        Modal.error({
            title: '请求错误',
            content: '请求失败！',
        });
        return Promise.reject(error);
    },

    //响应成功处理方法
    resHandle(response) {
        if (closeMessage !== false) {
            closeMessage();
        }
        return response.data;
    },

    //响应失败处理默认方法
    resErrorHandle(error) {
        try {
            const { data, status } = error.response;
            let msg = Object.prototype.hasOwnProperty.call(data, 'msg') ? data.msg : '未知错误';
            switch (status) {
                case 401://鉴权失败
                    store.delete('token');//删除token
                    window.location.href = '/login';
                    break;
                case 404://资源未找到
                    msg = '接口地址不存在！';
                    break;
            }

            if (closeMessage !== false) {
                closeMessage();
            }

            if (status !== 401) {
                Modal.error({
                    title: '错误信息',
                    content: msg,
                });
            }

            return Promise.reject(error);
        } catch (err) {
            console.log(err);
            // window.location.href = '/error_page';
        }
    },


    //vue插件install方法
    install(Vue) {
        const axios = new Axios({
            timeout: appConfig.api.timeout * 1000,
            base_url: appConfig.api.base_url,
            reqFuc: this.reqHandle,
            reqErrFuc: this.reqErrorHandle,
            resFuc: this.resHandle,
            resErrFuc: this.resErrorHandle
        });

        //注册全局快捷方法
        Vue.$_ajax = axios.getInstance;
        Vue.$_get = axios.get;
        Vue.$_post = axios.post;
        Vue.$_delete = axios.delete;
        Vue.$_put = axios.put;
        Vue.$_patch = axios.patch;

        //注册实例快捷方法
        Vue.prototype.$_ajax = axios.getInstance;
        Vue.prototype.$_get = axios.get;
        Vue.prototype.$_post = axios.post;
        Vue.prototype.$_delete = axios.delete;
        Vue.prototype.$_put = axios.put;
        Vue.prototype.$_patch = axios.patch;
    }
}