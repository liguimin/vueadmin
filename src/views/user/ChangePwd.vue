<template>
  <Form ref="form" :label-width="80" :rules="ruleValidate" :model="form_data">
    <FormItem label="密码" prop="pwd">
      <Input type="password" placeholder="请输入密码" v-model="form_data.pwd"></Input>
    </FormItem>
    <FormItem label="确认密码" prop="repwd">
      <Input type="password" placeholder="请再次输入密码" v-model="form_data.repwd"></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit()" :loading="submitting">提交</Button>
      <Button @click="handleReset()" style="margin-left: 8px">重置</Button>
    </FormItem>
  </Form>
</template>

<script>
  import { Form, FormItem, Button, Input, Message } from 'iview'
  export default {
    name: 'user-change-pwd',
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
      Button,
      Input,
      Message
    },

    data() {
      return {
        //表单数据
        form_data: {
          pwd: '',
          repwd: '',
        },
        //表单验证规则
        ruleValidate: {
          pwd: [
            { required: true, message: '密码不能为空', trigger: 'change' }
          ],
          repwd: [
            { required: true, message: '密码确认不能为空', trigger: 'change' }
          ]
        },
        //提交按钮是否显示加载中
        submitting: false,
      }
    },

    methods: {
      //提交数据
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.submitting = true;
            this.$_put(`user/${this.$props.id}/pwd`, {
              data: this.form_data
            }).then(() => {
              Message.success('修改成功');
              this.onSuccess();
            }).finally(() => {
              this.submitting = false;
            })
          }
        })

      },

      //重置数据
      handleReset() {
        this.$refs.form.resetFields();
      },
    }

  }
</script>