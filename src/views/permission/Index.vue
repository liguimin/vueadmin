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

    .del-icon {
      color: $danger-color;
      cursor: pointer;
    }

    .edit-icon {
      color: $primary-color;
      margin-left: 5px;
      cursor: pointer;
    }

    .add-child {
      margin-left: 10px;
      font-size: $normal-font-size;
      color: $primary-color;
      font-weight: 500;
      cursor: pointer;
    }
  }

  .toolbar {
    background: $primary-background;
    padding: 10px;
    margin-bottom: 30px;
  }
</style>
<template>
  <Card>
    <Row>
      <Col :xs="7" :sm="7" :md="7" :lg="5">
      <RoleList ref="roleList" @on-before-check="beforeCheckRole" @on-after-check="aftercheckRole"></RoleList>
      </Col>
      <Col :xs="17" :sm="18" :md="17" :lg="19" style="position:relative">
      <div class="permission-box">
        <Spin fix v-if="spinning"></Spin>

        <div class="toolbar">
          <Row>
            <Col span="12">
            <Input search enter-button placeholder="请输入要查找的节点名称" />
            </Col>
            <Col span="12" style="text-align:right">
            <Button type="primary" @click="showAdd('')">
              <Icon type="md-add" />添加权限</Button>
            </Col>
          </Row>
        </div>
        <CheckboxGroup v-model="rolePermission">
          <div class="permission-item" v-for="item in list" :key="item.id">
            <div class="item-title">
              {{item.name}}
              <AuthIcon auth="role_edit_btn" type="md-create" class="edit-icon" @click="showEdit(item.id)" />
              <span @click.stop="()=>{}">
                <Poptip confirm title="确定删除这条记录吗？" @on-ok="del(item.id)" transfer>
                  <AuthIcon style="margin-left:5px" auth="role_del_btn" type="ios-trash" class="del-icon" />
                </Poptip>
              </span>
              <Auth auth='permission_add_btn'>
                <span class="add-child" @click="showAdd(item.id)">
                  <Icon type="md-add" />添加子权限
                </span>
              </Auth>

            </div>
            <div class="item-checkbox">
              <Row>
                <Col :xs="24" :sm="8" :md="8" :lg="6" v-for="child in item.children" :key="child.id" class="checkbox-item">
                <Checkbox :label="child.id">
                  <span class="checkbox-item-name">{{child.name}}</span>
                </Checkbox>

                <AuthIcon auth="role_edit_btn" type="md-create" class="edit-icon" @click="showEdit(child.id)" />
                <Poptip confirm title="确定删除这条记录吗？" @on-ok="del(child.id)" transfer>
                  <AuthIcon style="margin-left:5px" auth="role_del_btn" type="ios-trash" class="del-icon" />
                </Poptip>

                </Col>
              </Row>
            </div>
          </div>
        </CheckboxGroup>

        <div>
          <Button type="primary" style="margin-top:30px" @click="savePermission">保存</Button>
        </div>
      </div>

      </Col>
    </Row>

    <Modal v-model="show_add" title="添加" footer-hide width="1100px">
      <Edit v-if="show_add" :on-success="onAddSucess" :pid="add_pid" />
    </Modal>

    <Modal v-model="show_edit" title="修改" footer-hide width="1100px">
      <Edit v-if="show_edit" :on-success="onEditSucess" :id="this.edit_id" />
    </Modal>
  </Card>

</template>

<script>
  import { Checkbox, CheckboxGroup, Card, Row, Col, Spin, Poptip, Message, Input, Icon } from 'iview'
  import RoleList from '../role/RoleList'
  import Edit from './Edit'
  import Modal from '@/components/modal/Modal'
  import { AuthIcon } from '@/components/auth'
  export default {
    name: 'pemission-index',
    components: {
      CheckboxGroup,
      Checkbox,
      Card,
      Row,
      Col,
      RoleList,
      Spin,
      AuthIcon,
      Poptip,
      Message,
      Input,
      Icon,
      Modal,
      Edit
    },

    data() {
      return {
        spinning: false,
        role_id: '',
        re_list: [],
        list: [],
        rolePermission: [],
        reRolePermission: [],

        show_add: false,
        add_pid: '',

        show_edit: false,
        edit_id: 0,
      }
    },

    methods: {
      //选择角色前的回调
      beforeCheckRole() {
        this.spinning = true;
      },


      //选择角色后的回调
      aftercheckRole(id) {
        this.$_get(`role/${id}/permission`).then((ret) => {
          this.role_id = id;
          this.spinning = false;
          this.re_list = ret.data.tree;
          this.list = ret.data.tree;
          this.rolePermission = ret.data.role_permission;
          this.reRolePermission = ret.data.role_permission;
        });
      },

      //保存权限
      savePermission() {
        this.spinning = true;
        const { role_id, rolePermission, reRolePermission } = this;
        this.$_put(`role/${role_id}/permission`, {
          data: {
            role_permission: rolePermission,
            re_role_permission: reRolePermission
          }
        }).then(() => {
          Message.success('保存成功！');
        }).finally(() => {
          this.spinning = false;
        });
      },

      //显示添加权限弹窗
      showAdd(pid) {
        this.add_pid = pid;
        this.$nextTick(() => {
          this.show_add = true;
        })
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

      //删除权限
      del(id) {
        this.$_delete(`permission/${id}`).then(() => {
          Message.success('删除成功', 3);
          this.$refs.roleList.checkRole(this.role_id);
        });
      },

    }
  }
</script>