<template>
  <Auth :auth="auth">
    <template v-slot:default>
      <Button v-bind="$attrs" v-on="$listeners">
        <slot></slot>
      </Button>
    </template>

    <template v-slot:denied>
      <Button v-bind="$attrs" v-on="$listeners" disabled>
        <slot></slot>
      </Button>
    </template>
  </Auth>
</template>

<script>
  import Auth from './Auth'
  import { Button } from 'iview'
  export default {
    name: 'li-auth-button',
    components: {
      Auth,
      Button
    },
    props: {
      auth: {
        type: String,
        required: true
      }
    }
  }
</script>