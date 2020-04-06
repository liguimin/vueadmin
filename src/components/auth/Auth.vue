<template>
  <span>
    <span v-show="hasAuth">
      <slot></slot>
    </span>
    <span v-show="!hasAuth">
      <slot name="denied"></slot>
    </span>
  </span>
</template>

<script>
  export default {
    name: 'li-auth',
    props: {
      auth: {
        type: String,
        required: true
      }
    },
    computed: {
      hasAuth() {
        return this.$store.getters['auth/checkBtn'](this.$props.auth)
      }
    }
  }
</script>