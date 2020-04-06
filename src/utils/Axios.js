import axios from 'axios';

class Axios {
    //构造函数
    constructor({
        base_url,
        timeout,
        reqFuc,
        reqErrFuc,
        resFuc,
        resErrFuc,
        ...options
    }) {
        this.base_url = base_url;
        this.timeout = timeout;
        this.reqFuc = reqFuc;
        this.reqErrFuc = reqErrFuc;
        this.resFuc = resFuc;
        this.resErrFuc=resErrFuc;
        this.options = options;
        
        this.get=this.get.bind(this);
        this.post=this.post.bind(this);
        this.delete=this.delete.bind(this);
        this.put=this.put.bind(this);
        this.patch=this.patch.bind(this);
        this.getInstance=this.getInstance.bind(this);
    }

    //判断是否是函数
    isFunction(param) {
        return Object.prototype.toString.call(param) === 'objectFunction';
    }

    //获取axios句柄
    getInstance({
        msg = false,
        reqFuc = {},
        reqErrFuc = {},
        resFuc = {},
        resErrFuc = {},
        ...options
    } = {}) {
        const re_config = {
            baseURL: this.base_url,
            timeout: this.timeout,
            ...this.options
        };
        const config = Object.assign(re_config, options);
        let instance = axios.create(config);

        //请求拦截方法注册
        var reqHandleFuc = this.isFunction(reqFuc) ? reqFuc : this.reqFuc;//请求拦截方法
        var reqErrHandleFuc = this.isFunction(reqErrFuc) ? reqErrFuc : this.reqErrFuc;//请求错误方法
        instance.interceptors.request.use(function (config) {
            return reqHandleFuc(config, msg);
        }, function (error) {
            return reqErrHandleFuc(error);
        });

        //响应拦截方法注册
        var resHandleFuc = this.isFunction(resFuc) ? resFuc : this.resFuc;
        var resErrHandleFuc = this.isFunction(resErrFuc) ? resErrFuc : this.resErrFuc;
        instance.interceptors.response.use(function (response) {
            return resHandleFuc(response);
        }, function (error) {
            return resErrHandleFuc(error)
        });


        if (Object.prototype.hasOwnProperty.call(options,'url')) {//如果传入了url,则直接发起请求
            return instance.request(options);
        } else {
            return instance;
        }
    }

    //发起get请求
    get(url, { ...config } = {}) {
        return this.getInstance({
            method: 'get',
            url: url,
            ...config
        });
    }

    //发起post请求
    post(url, { ...config } = {}) {
        console.log(this);
        return this.getInstance({
            method: 'post',
            url: url,
            ...config
        });
    }

    //发起delete请求
    delete(url, { ...config } = {}) {
        return this.getInstance({
            method: 'delete',
            url: url,
            ...config
        });
    }

    //发起put请求
    put(url, { ...config } = {}) {
        return this.getInstance({
             method: 'put',
             url: url,
             ...config
         });
     }

     
    //发起patch请求
    patch(url, { ...config } = {}) {
        return this.getInstance({
             method: 'patch',
             url: url,
             ...config
         });
     }
}

export default Axios;