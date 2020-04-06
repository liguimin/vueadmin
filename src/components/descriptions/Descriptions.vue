
<style lang="scss" scoped>
  .li-descriptions {
  }
</style>
<template>
  <div class="li-descriptions">
    <Row>
      <slot></slot>
    </Row>
  </div>
</template>


<script>
  import { Row } from 'iview'
  export default {
    name: "li-descriptions",
    components: {
      Row
    }
  }
</script>