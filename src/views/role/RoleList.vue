<style lang="scss" scoped>
  .add-item {
    margin-top: 10px;
    text-align: left;
    padding: 0 24px;
    color: $primary-color;
    cursor: pointer;
  }

  .role-action {
    float: right;
  }

  .del-icon {
    color: $danger-color;
  }

  .edit-icon {
    color: $primary-color;
  }

  .role-box {
    @include border-right();
    height: 100%;
    overflow: auto;
  }
</style>
<template>
  <div class="role-box">
    <Menu :active-name="select_id" width="auto" @on-select="checkRole">
      <MenuItem :name="item.id" v-for="item in list" :key="item.id">
      <div @mouseover="showAction(item.id)" @mouseout="showAction('')">
        {{item.name}}
        <div style="float:right">
          <AuthIcon auth="role_edit_btn" type="md-create" @click.stop="showEdit(item.id)" class="edit-icon" />
          <span @click.stop="()=>{}">
            <Poptip confirm title="确定删除这条记录吗？" @on-ok="del(item.id)" transfer>
              <AuthIcon style="margin-left:5px" auth="role_del_btn" type="ios-trash" class="del-icon" />
            </Poptip>
          </span>
        </div>

      </div>
      </MenuItem>
    </Menu>

    <Auth auth="role_add_btn">
      <div class="add-item" @click="showAdd">
        <Icon type="md-add" />添加角色
      </div>
    </Auth>

    <Modal v-model="show_add" title="添加" footer-hide>
      <Edit v-if="show_add" :on-success="onAddSuccess" />
    </Modal>

    <Modal v-model="show_edit" title="编辑" footer-hide>
      <Edit v-if="show_edit" :on-success="onEditSucess" :id="this.edit_id" />
    </Modal>
  </div>
</template>

<script>
  import { MenuItem, Menu, Poptip, Message, Icon } from 'iview'
  import Modal from '@/components/modal/Modal'
  import Edit from './Edit'
  import { AuthIcon } from '@/components/auth'
  export default {
    name: 'role-list',

    components: {
      Menu,
      MenuItem,
      Icon,
      Modal,
      Edit,
      Poptip,
      AuthIcon
    },



    props: {
      id: {
        type: [String, Number],
        default: ''
      }
    },

    data() {
      return {
        spinning: false,
        list: [],
        select_id: '',
        show_action_id: '',

        show_add: false,

        show_edit: false,
        edit_id: '',

        del_id: ''
      }
    },

    mounted() {
      this.getList();
    },

    methods: {
      getList() {
        this.spinning = false;
        this.$_get('role').then((ret) => {
          this.list = ret.data.data;

          //如果未选中角色，则进行选中
          if (!this.select_id) {
            if (this.list.length > 0) {
              this.checkRole(this.list[0].id);
            }
          }
        }).finally(() => {
          this.spinning = false
        });
      },

      //选中某个角色
      checkRole(id) {
        //点击角色前的前置事件
        this.$emit('on-before-check');
        this.$nextTick(() => {
          this.select_id = id;
          this.$emit('on-after-check', id);
        })
      },

      //添加角色
      showAdd() {
        this.show_add = true;
      },

      //添加成功处理方法
      onAddSuccess() {
        this.show_add = false;
        this.getList();
      },

      //修改角色
      showEdit(id) {
        this.edit_id = id;
        this.$nextTick(() => {
          this.show_edit = true;
        })
      },

      //修改成功回调
      onEditSucess() {
        this.show_edit = false;
        this.getList();
      },

      //删除
      del(id) {
        this.$_delete(`role/${id}`).then(() => {
          Message.success('删除成功');
          this.getList();
        });
      },

      //显示删除确认
      showDel(id) {
        this.del_id = id;
      },

      //显示/隐藏操作栏
      showAction(id) {
        this.show_action_id = id;
      }
    }
  }
</script>