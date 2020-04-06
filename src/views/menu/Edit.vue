<template>
  <Form ref="form" :label-width="80" style="position:relative" :rules="ruleValidate" :model="form_data">
    <Spin fix v-if="loading"></Spin>
    <FormItem label="上级节点" prop="pid">
      <Cascader :data="tree_node" change-on-select trigger="hover" v-model="form_data.pid" filterable></Cascader>
      <!-- <Input placeholder="请输入角色名称" v-model="form_data.name"></Input> -->
    </FormItem>
    <FormItem label="菜单名称" prop="menu_name">
      <Input placeholder="请输入菜单名称" v-model="form_data.menu_name"></Input>
    </FormItem>
    <FormItem label="是否节点" prop="is_node">
      <RadioGroup v-model="form_data.is_node">
        <Radio :label="key" v-for="(item,key) in is_node_names" :key="key">{{item}}</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="路由" prop="route" v-if="form_data.is_node==is_node.no">
      <Input placeholder="请输入路由" v-model="form_data.route"></Input>
    </FormItem>
    <FormItem label="排序" prop="sort_num">
      <Input placeholder="请输入排序" v-model="form_data.sort_num"></Input>
    </FormItem>
    <FormItem label="是否公共" prop="is_public">
      <RadioGroup v-model="form_data.is_public">
        <Radio :label="key" v-for="(item,key) in is_public_names" :key="key">{{item}}</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="状态" prop="state">
      <RadioGroup v-model="form_data.state">
        <Radio :label="key" v-for="(item,key) in state_names" :key="key">{{item}}</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit()" :loading="submitting">提交</Button>
      <Button @click="handleReset()" style="margin-left: 8px">重置</Button>
    </FormItem>
  </Form>
</template>

<script>
  import { Form, FormItem, RadioGroup, Radio, Button, Input, Icon, Spin, Message, Cascader } from 'iview'
  import { STATES, STATE_NAMES, IS_NODE, IS_NODE_NAMES, IS_PUBLIC_NAMES, IS_PUBLIC } from '@/common/constants/menu'
  export default {
    name: 'menu-edit',
    props: {
      id: {
        type: String,
        default: null
      },
      pid: {
        type: [String, Number],
        default: ''
      },
      onSuccess: {
        type: Function,
        required: true
      }
    },
    components: {
      Form,
      FormItem,
      RadioGroup,
      Radio,
      Button,
      Input,
      Icon,
      Spin,
      Message,
      Cascader
    },
    computed: {
      hasId() {
        return this.$props.id !== null;
      }
    },
    data() {
      return {
        loading: false,//页面是否加载中

        is_node: IS_NODE,
        is_node_names: IS_NODE_NAMES,
        state_names: STATE_NAMES,
        tree_node: [],
        is_public_names: IS_PUBLIC_NAMES,

        //表单数据
        form_data: {
          pid: [],
          menu_name: '',
          is_node: '',
          route: '',
          is_public: IS_PUBLIC.no,
          state: STATES.enabled
        },
        //表单验证规则
        ruleValidate: {
          pid: [
            { type: 'array', required: true, message: '请选择上级节点', trigger: 'change' }
          ],
          menu_name: [
            { required: true, message: '菜单名称不能为空', trigger: 'change' }
          ],
          is_node: [
            { required: true, message: '请选择是否节点', trigger: 'change' }
          ],
          route: [
            { required: true, message: '路由不能为空', trigger: 'change' }
          ],
          sort_num: [
            { required: true, message: '排序不能为空', trigger: 'change' }
          ],
          is_public: [
            { required: true, message: '请选择是否公共', trigger: 'change' }
          ],
          state: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ]
        },
        //提交按钮是否显示加载中
        submitting: false,
      }
    },

    mounted() {
      this.getData();
    },

    methods: {
      //获取数据
      getData() {
        if (this.hasId) {
          this.loading = true;
          this.$_get(`menu/${this.$props.id}/edit`).then((ret) => {
            let { tree_node, list, data } = ret.data;
            this.tree_node = tree_node;
            this.$nextTick(() => {
              //找到pid所属的路径
              const curr_p_data = list.find(item => {
                return item.id == data.pid;
              });
              let p_path_arr = curr_p_data.path.split('>');
              p_path_arr = p_path_arr.filter(item => {
                return item != '';
              });
              p_path_arr.push(data.pid);
              data.pid = p_path_arr;
              this.form_data = data;
            })
          }).finally(() => {
            this.loading = false;
          });
        } else {
          this.loading = true;
          this.$_get(`menu/create`).then((ret) => {
            const { list, tree_node } = ret.data;
            this.tree_node = tree_node;
            this.$nextTick(() => {
              if (this.$props.pid) {
                //找到pid所属的路径
                const curr_p_data = list.find(item => {
                  return item.id == this.$props.pid;
                });
                let p_path_arr = curr_p_data.path.split('>');
                p_path_arr = p_path_arr.filter(item => {
                  return item != '';
                });
                p_path_arr.push(this.$props.pid);
                this.form_data.pid = p_path_arr;
              }
            })
          }).finally(() => {
            this.loading = false;
          });
        }
      },

      //提交数据
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.submitting = true;
            let form_data = Object.assign({}, this.form_data);
            const pid_len = form_data.pid.length;
            form_data.pid = form_data.pid[pid_len - 1];
            if (!this.hasId) {//添加
              this.$_post('menu', {
                data: form_data
              }).then(() => {
                Message.success('添加成功');
                this.onSuccess();
              }).finally(() => {
                this.submitting = false;
              })


            } else {//修改
              this.$_put(`menu/${this.$props.id}`, {
                data:form_data
              }).then(() => {
                Message.success('修改成功');
                this.onSuccess();
              }).finally(() => {
                this.submitting = false;
              })
            }
          }
        })

      },

      //重置数据
      handleReset() {
        this.$refs.form.resetFields();
      },
    },
  }
</script>