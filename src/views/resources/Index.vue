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
        <Input placeholder="资源名称" v-model="search_data.name" />
        </Col>
        <Col :xs="6" :sm="10" :md="6" :lg="4">
        <Input placeholder="资源标识" v-model="search_data.identify" />
        </Col>
        <Col :xs="6" :sm="10" :md="6" :lg="4">
        <Select v-model="search_data.type" placeholder="请选择资源类型">
          <Option value="">所有</Option>
          <Option v-for="(item,key) in type_names" :value="key" :key="key">{{ item }}</Option>
        </Select>
        </Col>
        <Col :xs="6" :sm="10" :md="6" :lg="4">
        <Select v-model="search_data.method" placeholder="请选择方法类型">
          <Option value="">所有</Option>
          <Option v-for="(item,key) in method_names" :value="key" :key="key">{{ item }}</Option>
        </Select>
        </Col>
        <Col :xs="6" :sm="10" :md="6" :lg="4">
        <Select v-model="search_data.is_public" placeholder="是否公共资源">
          <Option value="">所有</Option>
          <Option v-for="(item,key) in is_public_names" :value="key" :key="key">{{ item }}</Option>
        </Select>
        </Col>
        <Col :xs="6" :sm="10" :md="6" :lg="4">
        <Button @click="onSearch" type="primary">搜索</Button>
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
  </Card>

</template>

<script>
  import { Table, Page, Input, Button, Card, Row, Col, Message, Icon, Poptip, Select, Option } from 'iview'
  import Edit from './Edit'
  import Modal from '@/components/modal/Modal'
  import { AuthSwitch, AuthButton } from '@/components/auth'
  import { METHOD_NAMES, STATES, STATE_NAMES, TYPE_NAMES, IS_PUBLIC_NAMES } from '@/common/constants/resources'
  export default {
    components: {
      Table,
      Page,
      Input,
      Button,
      Card,
      Row,
      Col,
      AuthSwitch,
      Icon,
      Modal,
      Edit,
      Poptip,
      AuthButton,
      Select,
      Option
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

        show_edit: false,
        edit_id: 0,

        type_names: TYPE_NAMES,
        method_names: METHOD_NAMES,
        is_public_names: IS_PUBLIC_NAMES,
        search_data: {
          name: '',
          identify: '',
          type: '',
          method: '',
          is_public:''
        },
        rel_search_data: {},

        columns: [
          {
            title: '序号',
            key: 'index',
            width: 80,
            fixed: 'left'
          },
          {
            title: '资源名称',
            key: 'name',
            width: 180
          },
          {
            title: '资源标识',
            key: 'identify',
            width: 240,
            render: (h, { row }) => {
              return (
                <span><span style={{ color: '#ed4014', marginRight: '5px' }}>{METHOD_NAMES[row.method]}</span>  <span>{row.identify}</span></span>
              );
            }
          },
          {
            title: '类型',
            key: 'type',
            width: 100,
            render: (h, { row }) => {
              return (
                <span>{TYPE_NAMES[row.type]}</span>
              );
            }
          },
          {
            title: '状态',
            key: 'state',
            width: 100,
            render: (h, { row, index }) => {
              return (
                <AuthSwitch auth="user_chstate_btn" before-change={() => this.changeState(row, index)} size="large" loading={this.change_state_loading.includes(row.id)} value={row.state == STATES.enabled}>
                  <span slot="open">{STATE_NAMES[STATES.enabled]}</span>
                  <span slot="close">{STATE_NAMES[STATES.disabled]}</span>
                </AuthSwitch>
              );
            }
          },
          {
            title: '是否公共资源',
            key: 'is_public',
            render: (h, { row }) => {
              return (
                <span>{IS_PUBLIC_NAMES[row.is_public]}</span>
              );
            }
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
                  <Poptip confirm title="确定删除这条记录吗？" vOn: on-ok={() => this.delete(row.id)} transfer={true}>
                    <AuthButton auth="user_del_btn" size="small" style="margin-left:5px" type="error">删除</AuthButton>
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
        this.$_get('resource', {
          params: {
            page: this.page,
            page_size: this.page_size,
            ...this.rel_search_data
          }
        }).then(ret => {
          this.data = ret.data.data;
          this.count = ret.data.count;
        }).finally(() => {
          this.loading = false;
        })
      },

      //点击搜索按钮
      onSearch() {
        this.rel_search_data = this.search_data;
        this.getList();
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
          this.$_put(`resource/${row.id}/state`, {
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
        this.$_delete(`resource/${id}`).then(() => {
          Message.success('删除成功');
          this.getList();
        });
      }
    }
  }
</script>