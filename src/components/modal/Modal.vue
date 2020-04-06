<style lang="scss">
.modal-wrap{
// background: rgba(55,55,55,.6);
}
</style>
<template>
  <div>
    <Modal class-name="modal-wrap" v-bind="$attrs" :styles="{top:'50px',bottom:'20px'}" v-on="$listeners">
      <slot></slot>
      <slot name="header"></slot>
      <slot name="footer"></slot>
      <slot name="close"></slot>
    </Modal>
  </div>
</template>

<script>
  import { Modal } from 'iview'
  export default {
    name: 'my-modal',
    components: {
      Modal
    }
  }
</script>