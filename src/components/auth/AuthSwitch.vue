<template>
  <Auth :auth="auth">
    <template v-slot:default>
      <ISwitch v-bind="$attrs" v-on="$listeners">
        <template v-slot:open>
          <slot name="open"></slot>
        </template>

        <template v-slot:close>
          <slot name="close"></slot>
        </template>
      </ISwitch>
    </template>

    <template v-slot:denied>
      <ISwitch v-bind="$attrs" v-on="$listeners" disabled>
        <template v-slot:open>
          <slot name="open"></slot>
        </template>

        <template v-slot:close>
          <slot name="close"></slot>
        </template>
      </ISwitch>
    </template>
  </Auth>
</template>

<script>
  import { Switch as ISwitch } from 'iview'
  import Auth from './Auth'
  export default {
    name: 'AuthSwitch',
    components: {
      ISwitch,
      Auth
    },
    props: {
      auth: {
        type: String,
        required: true
      }
    }
  }
</script>