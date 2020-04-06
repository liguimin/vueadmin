<style lang="scss" scope>
  .toolbar {
    @include border-bottom();
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
</style>
<template>
  <Card>
    <div class="toolbar">
      <AuthButton auth="user_add_btn" type="primary" @click="showAdd">
        <Icon type="md-add" />添加
      </AuthButton>
    </div>
    <div style="margin-bottom:10px">
      <Row :gutter="16">

        <Col :xs="6" :sm="10" :md="6" :lg="4">
        <Input placeholder="用户名" v-model="search_data.username" />
        </Col>
        <Col :xs="6" :sm="10" :md="6" :lg="4">
        <Input placeholder="姓名" v-model="search_data.name" />
        </Col>
        <Col :xs="6" :sm="10" :md="6" :lg="4">
        <DatePicker placeholder="生日" v-model="search_data.birthday" clearable :editable="false" style="width:100%" />
        </Col>

        <Col :xs="6" :sm="10" :md="6" :lg="4">
        <Button @click="getList" type="primary">搜索</Button>
        </Col>
      </Row>
    </div>
    <Table border :columns="columns" :data="data" :max-height="500" :loading="loading"></Table>

    <div style="margin-top:10px;text-align:right">
      <Page :total="count" show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange" />
    </div>

    <Modal v-model="show_add" title="添加" footer-hide>
      <Edit v-if="show_add" :on-success="onAddSucess" />
    </Modal>

    <Modal v-model="show_edit" title="编辑" footer-hide>
      <Edit v-if="show_edit" :on-success="onEditSucess" :id="this.edit_id" />
    </Modal>

    <Modal v-model="show_change_pwd" title="修改密码" footer-hide>
      <ChangePwd v-if="show_change_pwd" :on-success="onChangePwdSuccess" :id="this.change_pwd_id" />
    </Modal>
  </Card>

</template>

<script>
  import { Table, Page, Input, Button, Card, Row, Col, Avatar, Message, DatePicker, Icon, Poptip } from 'iview'
  import Edit from './Edit'
  import ChangePwd from './ChangePwd'
  import Modal from '@/components/modal/Modal'
  import {AuthSwitch,AuthButton} from '@/components/auth'
  export default {
    components: {
      Table,
      Page,
      Input,
      Button,
      Card,
      Row,
      Col,
      Avatar,
      AuthSwitch,
      DatePicker,
      Icon,
      Modal,
      Edit,
      ChangePwd,
      Poptip,
      AuthButton
    },
    data() {
      return {
        data: [],
        count: 0,
        page: 1,
        page_size: 10,
        loading: false,
        change_state_loading: [],

        show_add: false,

        edit_btn_attrs: {
          type: 'primary',
          size: 'small'
        },
        show_edit: false,
        edit_id: 0,

        show_change_pwd: false,
        change_pwd_id: 0,

        search_data: {
          username: '',
          name: '',
          birthday: '',
          state: '',
          s_create_time: '',
          e_create_time: ''
        },
        columns: [
          {
            title: '序号',
            key: 'index',
            width: 100,
            fixed: 'left'
          },
          {
            title: '用户名',
            key: 'username',
            width: 100
          },
          {
            title: '姓名',
            key: 'name',
            width: 100
          },
          {
            title: '头像',
            key: 'avatar',
            width: 100,
            render: (h, { row }) => {
              return (
                <Avatar src={row.avatar} />
              );
            }
          },
          {
            title: '手机号',
            key: 'mobile',
            width: 100
          },
          {
            title: '状态',
            key: 'state',
            width: 100,
            render: (h, { row, index }) => {
              return (
                <AuthSwitch auth="user_chstate_btn" before-change={() => this.changeState(row, index)} size="large" loading={this.change_state_loading.includes(row.id)} value={row.state == 1}>
                  <span slot="open">启用</span>
                  <span slot="close">禁用</span>
                </AuthSwitch>
              );
            }
          },
          {
            title: '生日',
            key: 'birthday',
            width: 100
          },
          {
            title: '备注',
            key: 'remarks',
          },
          {
            title: '创建时间',
            key: 'create_time',
            width: 180
          },
          {
            title: '更新时间',
            key: 'update_time',
            width: 180
          },
          {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 200,
            render: (h, { row }) => {
              return (
                <div>
                  <AuthButton auth="user_edit_btn" onClick={() => this.showEdit(row.id)} size="small" type="primary">编辑</AuthButton>
                  <AuthButton auth="user_chpwd_btn" onClick={() => this.showChangePwd(row.id)} size="small" style="margin-left:5px" type="warning">修改密码</AuthButton>
                  <Poptip confirm title="确定删除这条记录吗？" vOn: on-ok={() => this.delete(row.id)} transfer={true}>
                    <AuthButton auth="user_del_btn"  size="small" style="margin-left:5px" type="error">删除</AuthButton>
                  </Poptip>
                </div >
              )
            }
          }
        ],
      }
    },

    mounted() {
      this.getList();
    },

    methods: {
      //获取数据
      getList() {
        this.loading = true
        this.$_get('user', {
          params: {
            page: this.page,
            page_size: this.page_size,
            ...this.search_data
          }
        }).then(ret => {
          this.data = ret.data.data;
          this.count = ret.data.count;
        }).finally(() => {
          this.loading = false;
        })
      },

      //页码改变
      pageChange(page) {
        this.page = page;
        this.getList();
      },

      //每页显示条数改变
      pageSizeChange(page_size) {
        this.page_size = page_size;
        this.getList();
      },

      //修改状态
      changeState(row, index) {
        this.change_state_loading.push(row.id);
        return new Promise((resolve, reject) => {
          this.$_put(`user/${row.id}/state`, {
            data: {
              id: row.id,
              state: row.state
            }
          }).then((ret) => {
            resolve();
            this.data[index].state = ret.data.state;
            Message.success('修改状态成功');
          }).catch(() => {
            reject();
          }).finally(() => {
            this.change_state_loading = this.change_state_loading.filter((item) => {
              return item != row.id;
            })
          })
        })
      },

      //弹出添加页面
      showAdd() {
        this.show_add = true;
      },

      //添加成功回调
      onAddSucess() {
        this.show_add = false;
        this.getList();
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
        this.getList();
      },

      //显示修改密码界面
      showChangePwd(id) {
        this.change_pwd_id = id;
        this.$nextTick(() => {
          this.show_change_pwd = true;
        });
      },

      //修改密码成功回调
      onChangePwdSuccess() {
        this.show_change_pwd = false;
      },


      //删除
      delete(id) {
        this.$_delete(`user/${id}`).then(() => {
          Message.success('删除成功');
          this.getList();
        });
      }
    }
  }
</script>