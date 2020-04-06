<template>
  <div class="main">
    <div class="login-page">
      <div class="login-page-content">
        <div class="login-box">
          <div class="login-box-left">
            <div class="login-title">后台管理系统</div>
            <div style="width:100%;padding:20px">
              <MyInput placeholder="请输入用户名" v-model="username" :show_err="show_username_tips" :err_msg="'请输入用户名'">
                <Icon type="ios-contact" slot="prefix" style="font-size:20px;color:rgba(0,0,0,0.5)" />
              </MyInput>
              <MyInput type="password" placeholder="请输入密码" v-model="pwd" :show_err="show_pwd_tips" :err_msg="'请输入密码'" @keyup.enter.native="commit">
                <Icon type="ios-lock" slot="prefix" style="font-size:20px;color:rgba(0,0,0,0.5)" />
              </MyInput>
              <Button type="primary" size="large" long style="margin-top:15px" @click="commit" :loading="loading" @keyup.enter.native="commit">
                <span v-show="loading">
                  正在登录...
                </span>
                <span v-show="!loading">
                  登录
                </span>
              </Button>
            </div>
          </div>
          <div class="login-box-right"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Button, Icon,Message } from "iview";
  import MyInput from '@/components/form/Input';
  import store from '@/utils/store'

  export default {
    name: "Login",
    components: {
      Button,
      Icon,
      MyInput
    },

    data() {
      return {
        username: '',
        show_username_tips: false,
        pwd: "",
        show_pwd_tips: false,
        loading: false
      }
    },

    mounted: () => {

    },

    watch: {
      username(val) {
        if (val) {
          this.show_username_tips = false;
        }
      },
      pwd(val) {
        if (val) {
          this.show_pwd_tips = false;
        }
      }
    },

    methods: {
      //登录
      commit() {
        if (!this.username) {
          this.show_username_tips = true;
        } else {
          this.show_username_tips = false;
        }

        if (!this.pwd) {
          this.show_pwd_tips = true;
        } else {
          this.show_pwd_tips = false;
        }

        if (this.show_pwd_tips || this.show_username_tips) {
          return false;
        }

        this.loading = true;

        //发起登录请求
        this.$_post('/session', {
          data: {
            username: this.username,
            pwd: this.pwd
          }
        }).then((res) => {
            store.set('token',res.data.token);
            this.$router.push('/admin/home');
            Message.success('登录成功');
        }).finally(() => {
          this.loading = false;
        })

      }
    }
  };
</script>

<style lang="scss" scoped>
  .main {
    display: block;

    .login-page {
      @include display-flex();
      @include common-box-sizing();
      @include flex-direction-column();
      width: 100%;
      height: 100vh;
      box-sizing: border-box;
      background: #b8e5f8;
      overflow: auto;

      .login-page-content {
        @include display-flex();
        @include common-box-sizing();
        @include flex-direction-column();
        @include align-items-center();
        @include justify-content-center();
        min-height: 600px;
        height: calc(100% - 40px);

        .login-box {
          @include display-flex();
          height: 450px;
          width: 800px;
          background: #fff;
          @include border-radius(10px);
          @include box-shadow(0 1px 3px rgba(0, 0, 0, 0.1));

          .login-box-left {
            width: 50%;
            @include common-box-sizing();
            @include display-flex();
            @include flex-direction-column();
            @include align-items-center();
            @include justify-content-center();
            padding: 50px;

            .login-title {
              font-size: 20px;
              margin-bottom: 35px;
              font-weight: bold;
              color: $font-color-light;
            }
          }

          .login-box-right {
            @extend .login-box-left;
            background-image: url("../../assets/images/login-bg.png");
            background-repeat: no-repeat;
            background-size: cover;
            @include border-radius(10px);
          }
        }
      }
    }
  }
</style>
