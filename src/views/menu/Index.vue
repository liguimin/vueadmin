<style lang="scss" scoped>
  .permission-box {
    padding: 0 25px 20px 25px;
  }

  .permission-item {
    &:not(:first-child) {
      margin-top: 40px;
    }

    .item-title {
      @include border-bottom();
      font-weight: bold;
      font-size: 16px;
      padding: 0 5px 8px 5px;
    }

    .item-checkbox {
      padding: 5px 5px 0 5px;

      .checkbox-item {
        margin-top: 10px;
      }

      .checkbox-item-name {
        padding-left: 5px;
        font-size: 14px;
      }
    }
  }

  .toolbar {
    background: $primary-background;
    padding: 10px;
    margin-bottom: 30px;
  }

  ::v-deep .li-del-icon {
    color: $danger-color;
    cursor: pointer;
    margin-left: 5px;
  }

  ::v-deep .li-edit-icon {
    color: $primary-color;
    margin-left: 10px;
    cursor: pointer;
  }

  ::v-deep .li-add-child {
    margin-left: 10px;
    font-size: $normal-font-size;
    color: $primary-color;
    font-weight: 500;
    cursor: pointer;
  }
</style>
<template>
  <Card>
    <Row>

      <Col :xs="7" :sm="7" :md="7" :lg="5">
      <RoleList ref="roleList" @on-before-check="beforeCheckRole" @on-after-check="aftercheckRole"></RoleList>
      </Col>

      <Col :xs="17" :sm="18" :md="17" :lg="19" style="position:relative">
      <Spin fix v-if="spinning"></Spin>
      <div class="permission-box">
        <div class="toolbar">
          <AuthButton auth="menu_add_btn" type="primary" @click="showAdd('')">
            <Icon type="md-add" />添加菜单
          </AuthButton>
        </div>

        <Spin fix v-if="spinning"></Spin>

        <div>
          <Tree :data="menu_tree" show-checkbox multiple @on-check-change="onCheckChange"></Tree>
        </div>
        <div style="margin-top:30px">
          <AuthButton auth="menu_save_btn" type="primary" @click="save">保存</AuthButton>
        </div>
      </div>
      </Col>

    </Row>

    <Modal v-model="show_add" title="添加" footer-hide>
      <Edit v-if="show_add" :on-success="onAddSucess" :pid="add_pid" />
    </Modal>

    <Modal v-model="show_edit" title="编辑" footer-hide>
      <Edit v-if="show_edit" :on-success="onEditSucess" :id="this.edit_id" />
    </Modal>
  </Card>
</template>

<script>
  import { Card, Row, Col, Button, Icon, Spin, Tree, Message, Poptip } from 'iview'
  import RoleList from '../role/RoleList'
  import Edit from './Edit'
  import Modal from '@/components/modal/Modal'
  import { AuthIcon } from '@/components/auth'
  export default {
    name: 'menu-index',
    components: {
      Card,
      Row,
      Col,
      Button,
      AuthIcon,
      RoleList,
      Icon,
      Spin,
      Tree,
      Message,
      Edit,
      Modal,
      Poptip
    },

    data() {
      return {
        role_id: '',
        spinning: false,

        menu_tree: [],
        role_menu_ids: [],
        re_role_menu_ids: [],


        show_add: false,
        add_pid: '',

        show_edit: false,
        edit_id: '',
      }
    },

    methods: {
      //选择角色前的回调
      beforeCheckRole() {
        this.spinning = true;
      },

      //选择角色后的回调
      aftercheckRole(id) {
        this.$_get(`role/${id}/menu`).then((ret) => {
          this.role_id = id;
          this.spinning = false;
          this.role_menu_ids = ret.data.role_menu_ids;
          this.re_role_menu_ids = ret.data.role_menu_ids;
          this.menu_tree = this.getTree(ret.data.menu_tree);
        });
      },

      //获取节点树数据
      getTree(menu_tree) {
        return menu_tree.map(item => {
          const index = this.role_menu_ids.findIndex(menu_id => {
            return item.id == menu_id
          });

          if (index != -1) {
            item.checked = true;
          }
          if (item.children.length > 0) {
            item.expand = true;
          }
          item.title = item.menu_name;
          item.children = this.getTree(item.children);

          item.render = (h, { data }) => {
            return (
              <span>
                <span>{data.title}</span>
                <span>
                  <AuthIcon auth="menu_edit_btn" type="md-create" class="li-edit-icon" vOn: click={() => this.showEdit(data.id)} />
                </span>
                <span vOn: click_stop_prevent={() => { }}>
                    <Poptip confirm title="确定删除这条记录吗？" vOn: on-ok={() => this.del(data.id)} transfer>
                        <AuthIcon auth="menu_del_btn" type="ios-trash" class="li-del-icon" />
                    </Poptip>
                </span >

              <span vOn: click_stop_prevent={() => { }}>
                <Auth auth='permission_add_btn'>
                  <span class="li-add-child" vOn: click={() => this.showAdd(data.id)}>
                        <Icon type="md-add" />添加子权限
                        </span>
                    </Auth>
                </span >
              </span >
            );
      };

      return item;
    });
  },

  //监听菜单选择
  onCheckChange(selection) {
    this.role_menu_ids = selection.map(item => {
      return item.id;
    });
  },

  //保存当前授权的菜单
  save() {
    this.spinning = true;
    this.$_put(`role/${this.role_id}/menu`, {
      data: {
        role_menu_ids: this.role_menu_ids,
        re_role_menu_ids: this.re_role_menu_ids
      }
    }).then(() => {
      Message.success('保存成功');
      this.$refs.roleList.checkRole(this.role_id);
    }).finally(() => {
      this.spinning = false;
    });
  },

  //打开添加页面
  showAdd(id) {
    this.add_pid = id;
    this.show_add = true;
  },

  //添加成功回调
  onAddSucess() {
    this.show_add = false;
    this.$refs.roleList.checkRole(this.role_id);
  },


  //显示修改界面
  showEdit(id) {
    this.edit_id = id;
    this.$nextTick(() => {
      this.show_edit = true;
    });
  },

  //编辑成功回调
  onEditSucess() {
    this.show_edit = false;
    this.$refs.roleList.checkRole(this.role_id);
  },

  //删除菜单
  del(id) {
    this.$_delete(`menu/${id}`).then(() => {
      Message.success('删除成功', 3);
      this.$refs.roleList.checkRole(this.role_id);
    });
  },
    }
  }
</script>