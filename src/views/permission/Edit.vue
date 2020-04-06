<template>
  <Form ref="form" :label-width="80" style="position:relative" :rules="ruleValidate" :model="form_data">
    <Spin fix v-if="loading"></Spin>
    <FormItem label="上级节点" prop="pid">
      <Cascader :data="tree_node" change-on-select trigger="hover" v-model="form_data.pid" filterable></Cascader>
      <!-- <Input placeholder="请输入角色名称" v-model="form_data.name"></Input> -->
    </FormItem>
    <FormItem label="权限名称" prop="name">
      <Input placeholder="请输入权限名称" v-model="form_data.name"></Input>
    </FormItem>
    <FormItem label="排序" prop="sort_num">
      <Input placeholder="请输入排序" v-model="form_data.sort_num"></Input>
    </FormItem>
    <FormItem label="状态" prop="state">
      <RadioGroup v-model="form_data.state">
        <Radio label="1">启用</Radio>
        <Radio label="0">禁用</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="是否节点" prop="is_node">
      <RadioGroup v-model="form_data.is_node">
        <Radio label="1">是</Radio>
        <Radio label="0">否</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="关联资源" prop="checked_resources" v-if="form_data.is_node==0">
      <ResourcesTransfer @on-change="onResourcesChange" :permission-id="id"></ResourcesTransfer>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit()" :loading="submitting">提交</Button>
    </FormItem>
  </Form>
</template>

<script>
  import { Form, FormItem, RadioGroup, Radio, Button, Input, Icon, Spin, Message, Cascader } from 'iview'
  import ResourcesTransfer from './ResourcesTransfer'
  export default {
    name: 'permission-edit',
    props: {
      id: {
        type: String,
        default: ''
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
      Cascader,
      ResourcesTransfer
    },
    computed: {
      hasId() {
        return this.$props.id !== '';
      }
    },
    data() {
      return {
        loading: false,//页面是否加载中

        //节点树
        tree_node: [],
        //表单数据
        form_data: {
          pid: [],
          name: '',
          sort_num: '',
          state: '1',
          is_node: '1',
          checked_resources: [],
          re_checked_resources: [],
        },
        //表单验证规则
        ruleValidate: {
          pid: [
            { type: 'array', required: true, message: '请选择上级节点', trigger: 'change' }
          ],
          name: [
            { required: true, message: '权限名称不能为空', trigger: 'change' }
          ],
          sort_num: [
            { required: true, message: '排序不能为空', trigger: 'change' }
          ],
          state: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          is_node: [
            { required: true, message: '请选择是否节点', trigger: 'change' }
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
        if (this.hasId) {//编辑初始化
          this.loading = true;
          this.$_get(`permission/${this.$props.id}/edit`).then((ret) => {
            let { treeNode, info, list, targetKeys } = ret.data;
            this.tree_node = treeNode;
            this.$nextTick(() => {
              //找到pid所属的路径
              const curr_p_data = list.find(item => {
                return item.id == info.pid;
              });
              let p_path_arr = curr_p_data.path.split('>');
              p_path_arr = p_path_arr.filter(item => {
                return item != '';
              });
              p_path_arr.push(info.pid);
              info.pid = p_path_arr;
              info.re_checked_resources = targetKeys;
              this.form_data = info;
            })
          }).finally(() => {
            this.loading = false;
          });
        } else {//添加初始化
          this.$_get('permission/treeNode').then((ret) => {
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
              this.$_post('permission', {
                data: form_data
              }).then(() => {
                Message.success('添加成功');
                this.onSuccess();
              }).finally(() => {
                this.submitting = false;
              })


            } else {//修改
              this.$_put(`permission/${this.$props.id}`, {
                data: form_data
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

      //监听资源选择变化
      onResourcesChange(checked_resources) {
        this.form_data.checked_resources = checked_resources;
      }
    },
  }
</script>