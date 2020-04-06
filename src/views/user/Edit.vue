<template>
  <Form ref="form" :label-width="80" style="position:relative" :rules="ruleValidate" :model="form_data">
    <Spin fix v-if="loading"></Spin>
    <FormItem label="用户名" prop="username" v-if="!hasId">
      <Input placeholder="请输入用户名" v-model="form_data.username"></Input>
    </FormItem>
    <FormItem label="密码" prop="pwd" v-if="!hasId">
      <Input type="password" placeholder="请输入密码" v-model="form_data.pwd"></Input>
    </FormItem>
    <FormItem label="确认密码" prop="repwd" v-if="!hasId">
      <Input type="password" placeholder="请再次输入密码" v-model="form_data.repwd"></Input>
    </FormItem>
    <FormItem label="状态" prop="state">
      <RadioGroup v-model="form_data.state">
        <Radio label="1">启用</Radio>
        <Radio label="0">禁用</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="头像" prop="avatar">
      <Upload action="whatever" :format="['jpg', 'jpeg', 'png']" type="drag" :disabled="uploading" paste :show-upload-list="false" :before-upload="beforeUpload" style="width:80px">
        <Spin fix v-if="uploading"></Spin>
        <div style="width: 100%;height:58px;line-height: 58px;">
          <div v-if="!preview_url">
            <Icon type="md-add" size="20" />
          </div>
          <img v-else :src="preview_url" style="height:100%;" />
        </div>
        <input type="hidden" v-model="form_data.avatar"></Input>
      </Upload>
    </FormItem>
    <FormItem label="角色" prop="checked_role">
      <Select multiple v-model="form_data.checked_role">
        <Option :value="item.id" v-for="item in role_list" :key="item.id">{{item.name}}</Option>
      </Select>
    </FormItem>
    <FormItem label="姓名">
      <Input placeholder="请输入姓名" v-model="form_data.name"></Input>
    </FormItem>
    <FormItem label="生日">
      <DatePicker placeholder="请选择生日" :value="form_data.birthday" :editable="false" @on-change="onBirthdayChange" />
    </FormItem>

    <FormItem label="手机号">
      <Input placeholder="请输入手机号" v-model="form_data.mobile"></Input>
    </FormItem>

    <FormItem label="备注">
      <Input type="textarea" :autosize="{minRows: 5,maxRows: 6}" placeholder="请输入备注" v-model="form_data.remarks"></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit()" :loading="submitting">提交</Button>
      <Button @click="handleReset()" style="margin-left: 8px">重置</Button>
    </FormItem>
  </Form>
</template>

<script>
  import { Form, FormItem, Select, Option, RadioGroup, Radio, Button, Input, Icon, Upload, Spin, DatePicker, Message, Modal } from 'iview'
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
      Select,
      Option,
      RadioGroup,
      Radio,
      Button,
      Input,
      Icon,
      Upload,
      Spin,
      DatePicker,
      Message,
      Modal
    },
    computed: {
      hasId() {
        return this.$props.id !== null;
      }
    },
    data() {
      return {
        role_list: [],//角色列表
        loading: false,//页面是否加载中

        //表单数据
        form_data: {
          username: '',
          pwd: '',
          repwd: '',
          state: '1',
          avatar: '',
          checked_role: [],
          name: '',
          birthday: '',
          mobile: ''
        },
        //表单验证规则
        ruleValidate: {
          username: [
            { required: true, message: '用户名不能为空', trigger: 'change' }
          ],
          pwd: [
            { required: true, message: '密码不能为空', trigger: 'change' }
          ],
          repwd: [
            { required: true, message: '密码确认不能为空', trigger: 'change' }
          ],
          state: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          avatar: [
            { required: true, message: '请上传头像', trigger: 'change' }
          ],
          checked_role: [
            { type: 'array', required: true, message: '请选择角色', trigger: 'change' }
          ]
        },
        //提交按钮是否显示加载中
        submitting: false,
        preview_url: '',//预览图片地址
        uploading: false//是否上传中

      }
    },

    mounted() {
      this.getData();
    },

    methods: {
      //获取数据
      getData() {
        this.loading = true;
        if (!this.hasId) {//添加初始化数据
          this.$_get('user/create').then((ret) => {
            this.role_list = ret.data.roleList
          }).finally(() => {
            this.loading = false;
          });
        } else {//修改初始化数据
          this.$_get(`user/${this.$props.id}/edit`).then((ret) => {
            const { data } = ret;
            this.role_list = data.roleList;
            this.form_data = data.data;
            this.preview_url = data.data.preview_url;
            this.form_data.checked_role = data.checkedRole;
            this.form_data.re_checked_role = data.checkedRole;
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
              this.$_post('user', {
                data: this.form_data
              }).then(() => {
                Message.success('添加成功');
                this.onSuccess();
              }).finally(() => {
                this.submitting = false;
              })


            } else {//修改
              console.log(this.form_data);
              this.$_put(`user/${this.$props.id}`, {
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

      //监听生日选择
      onBirthdayChange(date) {
        this.form_data.birthday = date;
      },

      //上传前的钩子
      beforeUpload(file) {
        this.uploading = true;
        //上传到服务器
        this.$_post('user/avatar', {
          transformRequest: [() => {
            // 对 data 进行任意转换处理
            let formData = new FormData();
            formData.append('avatar', file);
            return formData;
          }]
        }).then((ret) => {
          this.form_data.avatar = ret.data.img_url;
          this.preview_url = ret.data.preview_url;
        }).finally(() => {
          this.uploading = false;
        })

        return false;
      }
    },


  }
</script>