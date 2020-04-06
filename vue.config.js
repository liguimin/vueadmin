module.exports = {
    css: {
        loaderOptions: {
            scss: {
                //添加全局scss文件，不用在单个组件中分别引用
                prependData: `@import "~@/assets/scss/_common.scss";`
            },
        }
    },

    devServer: {
        proxy: {
            "/v1": {
                target: "http://47.107.50.5:8080",
                changeOrigin: true,
                secure: false
            }
        }
    },

    chainWebpack: config => {
        //添加iview loader
        // config.module
        //     .rule('vue')
        //     .use('iview-loader')
        //     .loader('iview-loader')
        //     .options({
        //         prefix: false
        //     })

        // config.module
        //     .rule()
        //     .test(/\.vue$/)
        //     .use()
        //     .loader('iview-loader')
        //     .options({
        //         prefix: false
        //     })
        //     .end()
    }
}