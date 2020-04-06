<template>
  <div>
    <template v-for="(item,key) in treeData">
      <Submenu :name="item.id" class="sub-menu" v-if="item.children.length>0" :key="key">
        <template v-slot:title>
          <slot name="subText" :item="item">
            <Icon type="ios-navigate"></Icon>
            <span v-text="item.menu_name"></span>
          </slot>
        </template>

        <items :tree-data="item.children"></items>
      </Submenu>

      <MenuItem :name="item.id" v-if="item.children.length==0" :key="key" :to="getRoute(item.route)">
        <template v-slot:default>
            <!-- <Icon type="ios-navigate"></Icon> -->
            <span v-text="item.menu_name"></span>
        </template>
      </MenuItem>

    </template>
  </div>

</template>

<script>
  import { Submenu, MenuItem, Icon } from 'iview'

  export default {
    name: "items",
    props: {
      treeData: {
        type: Array,
        required: true
      }
    },
    components: {
      Submenu,
      MenuItem,
      Icon
    },
    methods:{
        getRoute(route){
            return route.search(/^\/.*/i)===-1?'/'+route:route;
        }
    }
  }
</script>