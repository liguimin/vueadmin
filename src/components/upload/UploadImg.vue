<style lang="scss" scoped>
  .my-upload {
    width: 80px;
    height: 80px;
    text-align: center;
    position: relative;
  }
</style>
<template>
  <Upload class="my-upload" :format="['jpg', 'jpeg', 'png']" type="drag" :disabled="loading" paste
          :show-upload-list="false" v-bind="$attrs" v-on="$listeners" :before-upload="beforeUpload"
          :on-success="onSuccess" :on-error="onError">
    <Spin fix v-if="loading"></Spin>
    <div style="width: 100%;height:58px;line-height: 58px;">
      <Icon type="ios-camera" size="20" v-if="!preview_url"></Icon>
      <img v-else :src="preview_url" style="height:100%;" />
    </div>
  </Upload>
</template>

<script>
  import { Icon, Spin } from 'iview'
  import Upload from './Upload'
  export default {
    name: 'my-upload-img',
    components: {
      Upload,
      Icon,
      Spin
    },
    props: {
      //服务端返回的预览字段名称
      preview_url_fields_name: {
        type: String,
        default: 'preview_url'
      },
    },
    data() {
      return {
        loading: false,
        preview_url: '',
      }
    },
    methods: {
      //上传前的钩子
      beforeUpload() {
        this.loading = true;
      },

      //上传成功的钩子
      onSuccess(response) {
        const { data } = response;
        this.loading = false;
        this.preview_url = data[this.preview_url_fields_name];
      },

      //上传失败的钩子
      onError(error) {
        console.log(error.response.status);
      }
    }
  }
</script>