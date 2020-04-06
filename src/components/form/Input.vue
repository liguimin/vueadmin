<template>
    <div class="form-item">
        <div class="input-block">
            <span class="prefix">
                <slot name="prefix"></slot>
            </span>
            <input :type="type" v-bind:value="value" v-on:input="$emit('input', $event.target.value)" v-bind="$attrs" class="input" :class="{
                'input-prefix':getSolt('prefix'),
                'input-err':show_err
                }" />
            <div class="err-tips" v-show="show_err" v-text="err_msg"></div>
        </div>
    </div>

</template>

<script>
    export default {
        name: 'Input',
        inheritAttrs: false,
        data() {
            return {

            }
        },
        props: {
            value: {
                default: ''
            },
            type: {
                type: String,
                default: 'text'
            },
            show_err: {
                type: Boolean,
                default: false
            },
            err_msg: {
                type: String,
                default: '不能为空'
            }
        },

        methods: {
            getSolt(key) {
                return Object.hasOwnProperty.call(this.$slots, key);
            }
        }
    }
</script>


<style lang="scss" scoped>
    .form-item {
      margin-bottom: 25px;
      width: 100%;
    }
    .input-block {
      width: 100%;
      @include common-box-sizing();
      position: relative;
    }

    .input {
      @include common-box-sizing();
      outline: 0;
      border: none;
      border-bottom: solid 1px $input-border-color-normal;
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 2px;
      padding-right: 3px;
      font-size: 14px;

      &:focus {
        border-color: $primary-color;
        border-width: 1px;
        @include box-shadow(0 1px 0 rgba(0, 0, 0, 0.07));
      }
    }

    .input-err {
      border-color: #ed4014;
    }

    .input-prefix {
      padding-left: 36px;
    }

    .prefix {
      @include common-box-sizing();
      position: absolute;
      left: 0;
      height: 100%;
      top: 0;
      width: 32px;
      line-height: 36px;
      text-align: center;
    }

    .err-tips {
      color: red;
      text-align: left;
      margin-top: 5px;
      font-size: 14px;
    }
</style>


