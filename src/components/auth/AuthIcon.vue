<template>
  <Auth :auth="auth">
    <template v-slot:default>
      <Icon v-bind="$attrs" v-on="$listeners">
        <slot></slot>
      </Icon>
    </template>
  </Auth>
</template>

<script>
  import Auth from './Auth'
  import { Icon } from 'iview'
  export default {
    name: 'li-auth-icon',
    components: {
      Auth,
      Icon
    },
    props: {
      auth: {
        type: String,
        required: true
      }
    }
  }
</script>