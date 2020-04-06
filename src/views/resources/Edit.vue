<template>
  <Form ref="form" :label-width="80" style="position:relative" :rules="ruleValidate" :model="form_data">
    <Spin fix v-if="loading"></Spin>
    <FormItem label="资源名称" prop="name">
      <Input placeholder="请输入资源名称" v-model="form_data.name"></Input>
    </FormItem>
    <FormItem label="资源标识" prop="identify">
      <Input placeholder="请输入排序" v-model="form_data.identify"></Input>
    </FormItem>
    <FormItem label="资源类型" prop="type">
      <RadioGroup v-model="form_data.type">
        <Radio label="1">API</Radio>
        <Radio label="2">路由</Radio>
        <Radio label="3">按钮</Radio>
        <Radio label="4">字段</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="请求方法" prop="method" v-if="form_data.type=='1'">
      <RadioGroup v-model="form_data.method">
        <Radio label="1">GET</Radio>
        <Radio label="2">POST</Radio>
        <Radio label="3">PUT</Radio>
        <Radio label="4">PATCH</Radio>
        <Radio label="5">DELETE</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="状态" prop="state">
      <RadioGroup v-model="form_data.state">
        <Radio label="1">启用</Radio>
        <Radio label="0">禁用</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="公有/私有" prop="is_public">
      <RadioGroup v-model="form_data.is_public">
        <Radio label="0">私有资源</Radio>
        <Radio label="1">公有资源</Radio>
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
          identify: '',
          type: '',
          method: '',
          state: '1',
          is_public: '0'
        },
        //表单验证规则
        ruleValidate: {
          name: [
            { required: true, message: '资源名称不能为空', trigger: 'change' }
          ],
          identify: [
            { required: true, message: '资源标识不能为空', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择资源类型', trigger: 'change' }
          ],
          method: [
            { required: true, message: '请选择请求方法', trigger: 'change' }
          ],
          state: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          is_public: [
            { required: true, message: '请选择公有/私有', trigger: 'change' }
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
          this.$_get(`resource/${this.$props.id}/edit`).then((ret) => {
            this.form_data = ret.data.data;
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
              this.$_post('resource', {
                data: this.form_data
              }).then(() => {
                Message.success('添加成功');
                this.onSuccess();
              }).finally(() => {
                this.submitting = false;
              })


            } else {//修改
              this.$_put(`resource/${this.$props.id}`, {
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