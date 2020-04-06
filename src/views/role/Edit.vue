<template>
  <Form ref="form" :label-width="80" style="position:relative" :rules="ruleValidate" :model="form_data">
    <Spin fix v-if="loading"></Spin>
    <FormItem label="角色名称" prop="name" >
      <Input placeholder="请输入角色名称" v-model="form_data.name"></Input>
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
    <FormItem>
      <Button type="primary" @click="handleSubmit()" :loading="submitting">提交</Button>
      <Button @click="handleReset()" style="margin-left: 8px">重置</Button>
    </FormItem>
  </Form>
</template>

<script>
  import { Form, FormItem, RadioGroup, Radio, Button, Input, Icon, Spin, Message } from 'iview'
  export default {
    name: 'user-add',
    props: {
      id: {
        type: String,
        default: null
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
      Message
    },
    computed: {
      hasId() {
        return this.$props.id !== null;
      }
    },
    data() {
      return {
        loading: false,//页面是否加载中

        //表单数据
        form_data: {
          name: '',
          sort_num: '',
          state: '1',
        },
        //表单验证规则
        ruleValidate: {
          name: [
            { required: true, message: '角色名称不能为空', trigger: 'change' }
          ],
          sort_num: [
            { required: true, message: '排序不能为空', trigger: 'change' }
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
          this.$_get(`role/${this.$props.id}/edit`).then((ret) => {
            this.form_data = ret.data;
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
            if (!this.hasId) {//添加
              this.$_post('role', {
                data: this.form_data
              }).then(() => {
                Message.success('添加成功');
                this.onSuccess();
              }).finally(() => {
                this.submitting = false;
              })


            } else {//修改
              console.log(this.form_data);
              this.$_put(`role/${this.$props.id}`, {
                data: this.form_data
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