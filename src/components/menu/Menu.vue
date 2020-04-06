<template>
  <Menu v-bind="$attrs" v-on="$listeners">
    <MenuItem :tree-data="treeData">
    <template v-slot:subText="{item}">
      <slot name="subText" :item="item"></slot>
    </template>
    </MenuItem>
  </Menu>
</template>

<script>
  import { Menu } from 'iview'
  import MenuItem from './MenuItem'
  export default {
    name: "menu-tree",
    inheritAttrs: false,
    props: {
      treeData: {
        type: Array,
        required: true
      }
    },
    components: {
      Menu,
      MenuItem
    }
  }
</script>