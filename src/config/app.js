
export default {
    api: {
        //api地址
        base_url: process.env.NODE_ENV == 'development' ? `/v1/` : 'http://47.107.50.5:8080/v1/',
        
        //请求超时时间（单位S）
        timeout:30,
    }


}