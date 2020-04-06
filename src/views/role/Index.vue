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
      <AuthButton auth="role_add_btn" type="primary" @click="showAdd">
        <Icon type="md-add" />添加
      </AuthButton>
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
  import { Table, Page, Card, Message, Icon, Poptip } from 'iview'
  import Edit from './Edit'
  import Modal from '@/components/modal/Modal'
  import AuthSwitch from '@/components/auth/AuthSwitch'
  export default {
    components: {
      Table,
      Page,
      Card,
      Icon,
      Modal,
      Edit,
      Poptip,
      AuthSwitch
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

        columns: [
          {
            title: '序号',
            key: 'index',
            width: 100,
            fixed: 'left'
          },
          {
            title: '名称',
            key: 'name',
            width: 100
          },
          {
            title: '状态',
            key: 'state',
            width: 100,
            render: (h, { row, index }) => {
              return (
                <AuthSwitch auth="role_setState_btn" before-change={() => this.changeState(row, index)} size="large" loading={this.change_state_loading.includes(row.id)} value={row.state == 1}>
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </AuthSwitch>
              );
            }
          },
          {
            title: '排序',
            key: 'sort_num',
            width: 100
          },
          {
            title: '创建时间',
            key: 'create_time',
            width: 180
          },
          {
            title: '更新时间',
            key: 'update_time',
            // width: 180
          },
          {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 130,
            render: (h, { row }) => {
              return (
                <div>
                  <AuthButton onClick={() => this.showEdit(row.id)} size="small" type="primary" auth="role_edit_btn">编辑</AuthButton>
                  <Poptip confirm title="确定删除这条记录吗？" vOn: on-ok={() => this.delete(row.id)} transfer={true}>
                    <AuthButton size="small" style="margin-left:5px" type="error" auth="role_del_btn">删除</AuthButton>
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
        this.$_get('role', {
          params: {
            page: this.page,
            page_size: this.page_size,
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
          this.$_put(`role/${row.id}/state`, {
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

      //删除
      delete(id) {
        this.$_delete(`role/${id}`).then(() => {
          Message.success('删除成功');
          this.getList();
        });
      }
    }
  }
</script>