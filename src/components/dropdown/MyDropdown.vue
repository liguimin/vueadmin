<style lang="scss">
  .item {
    line-height: 40px;
  }
</style>
<template>

  <div class="item">
    <Dropdown style="margin-left: 20px;z-index:9999;" placement="right">
      <div style="text-align:center;color:#fff;width:100%">
        <Icon type="ios-navigate" style="font-size:22px;cursor:pointer"></Icon>
      </div>
      <DropdownMenu slot="list">
        <DropdownItem v-for="item in treeData" :key="item.id">
          <span v-text="item.menu_name" v-if="item.children.length==0"></span>
          <MyDropdown v-else :tree-data="item.children" />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>

</template>

<script>
  import { Dropdown, DropdownMenu, DropdownItem,Icon } from 'iview'

  export default {
    name: 'MyDropdown',
    components: {
      Dropdown,
      DropdownMenu,
      DropdownItem,
      Icon
    },
    props: {
      treeData: {
        type: Array,
        required: true
      }
    }
  }
</script>