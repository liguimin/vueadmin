<style lang="scss" scoped>
  .desc-col {
    margin-top: 15px;
    font-size: 13px;
  }
  .label {
    // white-space: nowrap;
    display: inline-block;
    width: 70px;
    text-align: right;
    padding-right: 5px;
  }

  .content {
    white-space: nowrap;
    display: inline-block;
  }
</style>
<template>
  <div>
    <Col :span="span" class="desc-col">
    <span class="label">
      <slot name="label">{{label}}:</slot>
    </span>
    <span class="content">
      <slot></slot>
    </span>
    </Col>
  </div>

</template>

<script>
  import { Col } from 'iview'
  export default {
    name: 'li-descriptions-item',
    components: {
      Col
    },
    props: {
      label: {
        default: ''
      },
      span: {
        default: '12'
      }
    }
  }
</script>