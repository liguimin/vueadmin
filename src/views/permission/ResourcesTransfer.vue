<style lang="scss" scoped>
  .resources-transfer {
  }

  .left-table {
    width: 400px;
    display: inline-block;
    vertical-align: middle;
  }

  .right-table {
    width: 400px;
    display: inline-block;
    vertical-align: top;
  }
  .transfer-action {
    display: inline-block;
    vertical-align: middle;
    padding: 15px;
  }
</style>
<template>
  <div class="resources-transfer">
    <div class="left-table">
      <div style="margin-bottom:5px">
        <Row type="flex" justify="start" class="code-row-bg" :gutter="10">
          <Col span="19"> <Input search enter-button placeholder="请输入资源标识" @on-search="onLeftSearch" /></Col>
          <Col span="5" style="text-align:right"><Button type="primary" @click="showAdd">添加</Button></Col>
        </Row>

      </div>

      <Table border :columns="columns" :data="left_data" :height="300" :loading="loading" size="small" @on-selection-change="leftSelect"></Table>
      <div style="margin-top:10px">
        <Page :total="count" show-elevator @on-change="pageChange" size="small" />
      </div>
    </div>
    <div class="transfer-action">
      <div>
        <Button size='small' :disabled="!canAddToright" :type="canAddToright?'primary':'default'" @click="addToRight">
          <Icon type="ios-arrow-forward" />
        </Button>
      </div>

      <div style="margin-top:1px">
        <Button size='small' :disabled="right_select_data.length==0" :type="right_select_data.length>0?'primary':'default'" @click="delRightData">
          <Icon type="ios-arrow-back" />
        </Button>
      </div>

    </div>
    <div class="right-table">
      <div style="margin-bottom:5px">
        <Input search enter-button placeholder="请输入资源标识" @on-search="onRightSearch" />
      </div>
      <Table border :columns="columns" :data="getRightData" :height="300" :max-height="300" :loading="loading" size="small" @on-selection-change="rightSelect"></Table>
    </div>

    <Modal v-model="show_add" title="添加" footer-hide>
      <Edit v-if="show_add" :on-success="onAddSucess" />
    </Modal>
  </div>
</template>

<script>
  import { Table, Page, Icon, Input, Row, Col } from 'iview';
  import { unionBy } from 'lodash'
  import Edit from '../resources/Edit'
  import Modal from '@/components/modal/Modal'
  export default {
    name: 'permission-resources-transfer',
    props: {
      permissionId: {
        type: [Number, String],
        default: ''
      }
    },
    components: {
      Table,
      Page,
      Icon,
      Input,
      Row,
      Col,
      Edit,
      Modal
    },

    data() {
      return {
        page: 1,
        page_size: 10,
        left_data: [],
        left_select_data: [],
        right_select_data: [],
        right_data: [],
        count: 0,
        loading: false,
        first_req: true,

        s_left_identify: '',
        s_right_identify: '',

        show_add: false,

        columns: [
          {
            type: 'selection',
            width: 50,
            align: 'center'
          },
          {
            title: '名称',
            key: 'name',
            width: 120
          },
          {
            title: '请求方法',
            key: 'method_name',
            width: 90
          },
          {
            title: '标识',
            key: 'identify'
          },
        ]
      }
    },

    watch: {
      //监听右侧数据变化，调用回调函数
      right_data() {
        //获取选中的key
        const target_keys = this.right_data.map(item => {
          return item.id;
        })
        this.$emit('on-change', target_keys);
      }
    },

    computed: {
      //是否可向右侧添加数据
      canAddToright() {
        if (this.left_select_data.length == 0) {
          return false
        }

        //判断所有选中项是否都是disabled状态
        let is_all_disabled = true;
        this.left_data.forEach(item => {
          const index = this.left_select_data.findIndex(select_item => {
            return select_item.id == item.id;
          });

          if (index != -1 && item._disabled !== true) {
            is_all_disabled = false;
          }
        });

        return !is_all_disabled;
      },

      //右侧数据
      getRightData() {
        if (this.s_right_identify !== '') {
          const result = this.right_data.filter(item => {
            return item.identify.indexOf(this.s_right_identify) !== -1;
          });

          return result;
        }

        return this.right_data;
      }

    },

    mounted() {
      this.getData();
    },

    methods: {
      //获取源数据
      getData() {
        this.loading = true;
        this.$_get('resource', {
          params: {
            page: this.page,
            page_size: this.page_size,
            identify: this.s_left_identify,
            permission_id: this.first_req ? this.$props.permissionId : 0
          }
        }).then(ret => {
          //清空选中项
          this.left_select_data = [];
          this.left_data = ret.data.data;
          this.count = ret.data.count;

          //给选中的数据添加禁止选中
          this.left_data = this.left_data.map((item) => {
            const index = this.right_data.findIndex(select_item => {
              return item.id == select_item.id;
            })

            if (index != -1) {
              item._disabled = true;
              item._checked = true;
            }
            return item;
          });

          //首次请求，初始化右侧数据
          if (this.first_req) {
            this.right_data = ret.data.h_data;
            this.first_req = false;
          }

        }).finally(() => {
          this.loading = false;
        });
      },

      //页码变化
      pageChange(page) {
        this.page = page;
        this.getData();
      },


      //监听左表的选中
      leftSelect(selection) {
        this.left_select_data = selection;
      },

      //点击往右表中添加选中数据
      addToRight() {
        //将左侧选中数据先移除disabled和checked属性
        const left_select_data = this.left_select_data.map(item => {
          delete item._disabled;
          delete item._checked;
          return item;
        })

        this.right_data = unionBy(this.right_data, left_select_data, 'id');
        //给选中的数据添加禁止选中
        this.left_data = this.left_data.map((item) => {
          const index = left_select_data.findIndex(select_item => {
            return item.id == select_item.id;
          })

          if (index != -1) {
            item._disabled = true;
            item._checked = true;
          }
          return item;
        });
      },

      //监听右表的选中
      rightSelect(selection) {
        this.right_select_data = selection;
        //将对应数据设置为选中
        this.right_data = this.right_data.map(item => {
          const index = this.right_select_data.findIndex(select_item => {
            return item.id == select_item.id
          });

          if (index != -1) {
            item._checked = true;
          } else {
            delete item._checked
          }
          return item;
        });
      },

      //点击删除右表中的数据
      delRightData() {
        const curr_right_select_data = this.right_select_data.concat([]);
        //将右侧选中的数据删除
        this.right_data = this.right_data.filter(item => {
          const index = curr_right_select_data.findIndex(select_item => {
            return item.id == select_item.id
          });
          return index == -1 ? true : false
        });

        //将左侧选中项移除
        this.left_select_data = this.left_select_data.filter(item => {
          const index = curr_right_select_data.findIndex(select_item => {
            return item.id == select_item.id
          });
          return index == -1 ? true : false
        });

        //将左侧数据对应项设置为未选中
        this.left_data = this.left_data.map(item => {
          const index = curr_right_select_data.findIndex(select_item => {
            return item.id == select_item.id
          })

          if (index != -1) {
            item._disabled = false;
            item._checked = false
          }
          return item;
        })

        //清空选择
        this.right_select_data = [];

      },

      //点击左侧搜索
      onLeftSearch(value) {
        this.s_left_identify = value;
        this.getData();
      },

      //点击右侧搜索
      onRightSearch(value) {
        this.s_right_identify = value;
      },


      //显示添加资源的弹窗
      showAdd() {
        this.show_add = true;
      },

      //添加成功回调
      onAddSucess() {
        this.show_add = false;
        this.getData();
      },
    }
  }
</script>