<template>
  <Upload :action="upload_url" :headers="headers" v-bind="$attrs" v-on="$listeners" >
    <slot></slot>
    <slot name="tips"></slot>
  </Upload>
</template>

<script>
  import { Upload } from 'iview'
  import Vue from 'vue'
  import store from '@/utils/store'
  export default {
    name: 'my-upload',
    components: {
      Upload
    },
    props: {
      action: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        upload_url: Vue.$_config.api.base_url + this.$props.action,
        headers: {
          Authorization: 'Bearer ' + store.get('token')
        }
      }
    }
  }
</script>