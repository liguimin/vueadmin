<style lang="scss" scoped>
  $side-width: 200px;
  $collapsed-side-width: 78px;
  $header-height: 55px;
  $tab-bar-height: 40px;
  $tag-btn-width: 28px;
  .layout {
    border: 1px solid #d7dde4;
    background: $primary-background;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 4px;
    overflow: hidden;
    height: 100%;

    ::v-deep .ivu-layout-sider-children {
      overflow-y: scroll;
      margin-right: -16px;
      height: 100%;
    }
  }
  .layout-header-bar {
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }

  .logo {
    background: #fff;
    text-align: center;
    line-height: 30px;
    height: 30px;
    font-size: 16px;
    //   background: rgba(0, 0, 0, 0.2);
    margin: 10px 20px;

    img {
      height: 100%;
    }
  }

  .toggle-icon {
    font-size: 25px;
    margin-right: 10px;
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
  }

  .toggle-icon i {
    line-height: $header-height;
    margin-bottom: 4px;
  }

  .menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width 0.2s ease 0.2s;
  }
  .menu-item i {
    transform: translateX(0px);
    transition: font-size 0.2s ease, transform 0.2s ease;
    vertical-align: middle;
    font-size: 16px;
  }

  .collapsed-menu span {
    width: 0px;
    transition: width 0.2s ease;
  }

  .collapsed-menu .ivu-menu-item {
    display: none;
  }
  .collapsed-menu i {
    transform: translateX(5px);
    transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
    vertical-align: middle;
    font-size: 22px;
  }
  .collapsed-menu ::v-deep .ivu-menu-submenu-title-icon {
    display: none !important;
  }

  .layout-content {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: $side-width;
    transition: left 0.2s ease;
  }

  .layout-content-collapsed {
    left: $collapsed-side-width;
    transition: left 0.3s ease;
  }

  .collapsed-menu-list {
    z-index: 999;
    left: $collapsed-side-width;

    ::v-deep .ivu-select-dropdown {
      position: fixed !important;
      left: $collapsed-side-width !important;
    }

    ::v-deep .ivu-dropdown {
      width: 100%;
      text-align: center;
      margin-left: 0 !important;
    }

    ::v-deep .ivu-select-dropdown {
      max-width: 150px;
      text-align: left;
    }

    .item {
      line-height: 40px;
    }
  }

  .header {
    background: #fff !important;
    padding: 0;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 3;
    height: auto;
    // @include border-bottom();

    .header-content {
      height: $header-height;
      line-height: $header-height;
      padding: 0 20px;
    }

    .header-breadcrumb {
      display: inline-block;
      line-height: $header-height;
      margin-left: 20px;
    }

    .header-breadcrumb-icon {
      font-size: 20px;
      display: inline-block;
      line-height: $header-height;
      margin-right: 2px;
    }

    .header-breadcrumb-title {
      display: inline-block;
      line-height: $header-height;
    }
  }

  .content-box {
    position: absolute;
    top: $header-height;
    left: 0;
    right: 0;
    bottom: 0;
    // overflow: auto;

    // .tab {
    //   height: 100%;
    //   position: relative;

    //   ::v-deep .ivu-tabs-bar{
    //       margin-bottom: 0;

    //       .ivu-tabs-nav-container{
    //           background: #f0f0f0;
    //           border-bottom: 1px solid #f0f0f0;
    //           padding: 4px;
    //           height: $tab-bar-height;

    //           .ivu-tabs-tab{
    //               @include border-radius(4px);
    //               @include common-box-sizing();
    //               border-bottom:1px solid #dcdee2
    //           }

    //           .ivu-tabs-tab-focused{
    //               border-color: $active-color!important;
    //           }
    //       }
    //   }

    //   ::v-deep .ivu-tabs-content {
    //     position: absolute;
    //     top: $tab-bar-height;
    //     left: 0;
    //     right: 0;
    //     bottom: 0;

    //     .ivu-tabs-tabpane {
    //       max-height: 100%;
    //       overflow: auto;
    //       padding: 10px;
    //     }
    //   }
    // }

    .tab-box {
      background: #f0f0f0;
      height: $tab-bar-height;
      padding: 1px 4px;
      @include common-box-sizing();
      overflow: hidden;
      position: relative;
      border-bottom: 1px solid #f0f0f0;
      border-top: 1px solid #f0f0f0;
      user-select: none;
      //   @include border-bottom();

      .tab-btn {
        position: absolute;
        top: 0;
        height: 100%;
        line-height: $tab-bar-height;
        background: #fff;
        width: $tag-btn-width;
        text-align: center;
        @include border();
        cursor: pointer;

        &:active {
          @include normal-bg();
        }
        &:hover {
          @include primary-font-color();
        }
      }
      .tab-left-btn {
        @extend .tab-btn;
        left: 0;
        border-left: 0;
      }

      .tab-right-btn {
        @extend .tab-btn;
        right: 0;
        border-right: 0;
      }

      .tag-box {
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        margin-left: $tag-btn-width;
        margin-right: $tag-btn-width;
      }
    }

    .content {
      position: absolute;
      top: $tab-bar-height;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 10px;
      overflow: auto;
    }
  }

  .header-right {
    float: right;
  }

  .userinfo-avatar {
    text-align: center;
  }

  .userinfo-username {
    text-align: center;
    margin-top: 15px;
    font-size: 18px;
    font-weight: 600;
  }
</style>
<template>
  <div class="layout">
    <Sider :style="{position: 'fixed', height: '100vh', left: 0,overflow:'hidden',zIndex:1}" :value="isCollapsed" collapsible :collapsed-width="78" hide-trigger>
      <div class="logo">
        logo
      </div>
      <div>
        <Menu :active-name="active_menu_id" theme="dark" width="auto" :class="menuitemClasses" v-show="!isCollapsed" :tree-data="menu_tree" @on-select="selectMenu" :open-names="op"></Menu>

        <div class="collapsed-menu-list" v-show="isCollapsed">
          <MyDropdown v-for="item in menu_tree" :tree-data="item.children" :key="'drop'+item.id" />
        </div>
      </div>

    </Sider>
    <Layout class="layout-content" :class="{'layout-content-collapsed':isCollapsed}">
      <Header class="header">
        <div class="header-content">
          <div class="toggle-icon">
            <Icon type="md-menu" @click="sideCollapse" />
          </div>

          <div class="header-breadcrumb">
            <Breadcrumb>
              <BreadcrumbItem to="/admin/home">
                <div class="header-breadcrumb-icon">
                  <Icon type="ios-home" style="padding-bottom:2px" />
                </div>

                <span class="header-breadcrumb-title">首页</span>
              </BreadcrumbItem>
              <BreadcrumbItem v-for="item in getBreadcrumb" :key="item.id">{{item.menu_name}}</BreadcrumbItem>
            </Breadcrumb>
          </div>

          <div class="header-right">
            <div class="avater">
              <Avatar :src="userinfo.avatar" />
              <Dropdown placement="bottom" @on-click="clickDropdownItem">
                <div style="">
                  <Icon type="md-arrow-dropdown" style="margin-left:2px;font-size:21px;cursor:pointer" />
                </div>
                <DropdownMenu slot="list" style="transform-origin: center bottom;">
                  <DropdownItem name="showUserinfo">
                    <Icon type="ios-information-circle" style="font-size:17px;margin-right:5px;" />个人信息
                  </DropdownItem>
                  <DropdownItem @click="logout" name="logout">
                    <Icon type="md-log-out" style="font-size:17px;margin-right:5px;" />退出登录
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

            </div>
          </div>
        </div>
      </Header>
      <Content class="content-box">
        <div class="tab-box">
          <div class="tab-left-btn" @click="scrollSmooth(-200,-15)">
            <Icon type="ios-arrow-back" style="font-size:18px" />
          </div>
          <div class="tag-box" ref="tag">
            <Tag type="dot" :closable="item.id!=-1" :color="active_menu_id==item.id?'primary':'default'" checkable v-for="item in tabs" :key="'tag'+item.id" :name="item.id" @on-change="tabChange" @on-close="closeTab">
              {{item.menu_name}}
            </Tag>
          </div>
          <div class="tab-right-btn">
            <Icon type="ios-arrow-forward" style="font-size:18px" @click="scrollSmooth(200,15)" />
          </div>
        </div>

        <div class="content">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </Content>
    </Layout>

    <Drawer :closable="false" v-model="show_userinfo" width="450">
      <div class="userinfo-avatar">
        <Avatar :src="userinfo.avatar" size="large" style="height:100px;width:100px;border-radius:50%" />
      </div>
      <div class="userinfo-username">{{userinfo.username}}</div>

      <Descriptions style="margin-top:20px">
        <DescriptionsItem label="用户名">
          {{userinfo.username}}
        </DescriptionsItem>
        <DescriptionsItem label="姓名">
          {{userinfo.name}}
        </DescriptionsItem>
        <DescriptionsItem label="生日">
          {{userinfo.birthday}}
        </DescriptionsItem>
        <DescriptionsItem label="手机号">
          {{userinfo.birthday}}
        </DescriptionsItem>
        <DescriptionsItem label="创建时间">
          {{userinfo.create_time}}
        </DescriptionsItem>
        </DescriptionsItem>
        <DescriptionsItem label="修改时间">
          {{userinfo.create_time}}
        </DescriptionsItem>
      </Descriptions>

      <Divider dashed />

      <div>
        <Tag color="primary">6666</Tag>
        <Tag color="primary">千年一遇</Tag>
        <Tag color="primary">天选之子</Tag>
        <Tag color="primary">前无古人，后无来者</Tag>
        <Tag color="primary">时代楷模</Tag>
        <Tag color="error">劳动模范</Tag>
        <Button icon="ios-add" type="dashed" size="small">添加标签</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import { Header, Sider, Content, Layout, Icon, Breadcrumb, BreadcrumbItem, Dropdown, DropdownMenu, DropdownItem, Avatar, Tag, Modal, Drawer, Upload, Divider, Button } from 'iview'
  import Menu from '@/components/menu/Menu'
  import MyDropdown from '@/components/dropdown/MyDropdown'
  import Vue from 'vue'
  import store from '@/utils/store'
  import Descriptions from '@/components/descriptions'

  const { DescriptionsItem } = Descriptions;
  export default {
    name: 'admin',
    components: {
      Header,
      Sider,
      Content,
      Breadcrumb,
      BreadcrumbItem,
      Layout,
      Icon,
      Dropdown,
      DropdownMenu,
      DropdownItem,
      Avatar,
      Tag,
      Menu,
      MyDropdown,
      Modal,
      Drawer,
      Descriptions,
      DescriptionsItem,
      Upload,
      Divider,
      Button
    },
    data() {
      return {
        isCollapsed: false,
        menu_list: [
          {
            id: -1,
            menu_name: '首页',
            route: '/admin/home',
            path: ''
          }
        ],
        menu_tree: [],
        tabs: [
          {
            id: -1,
            menu_name: '首页',
            route: '/admin/home',
            path: '',
            width: 109,
          }
        ],
        active_menu_id: -1,
        op: [],

        userinfo: {},
        show_userinfo: false,
      }
    },

    //路由进入前获取菜单数据
    beforeRouteEnter(to, from, next) {
      Vue.$_get('menu/userMenu').then((ret) => {
        next((vm) => {
          vm.menu_tree = ret.data.menu_tree;
          vm.menu_list = [...ret.data.menu_list, ...vm.menu_list];
          const active_menu = vm.menu_list.find((item) => {
            let { route } = item;
            route = route.search(/^\/.*/i) === -1 ? '/' + route : route;
            return to.path === route;
          });

          if (typeof active_menu != 'undefined') {
            vm.$nextTick(() => {
              vm.active_menu_id = active_menu.id;
              vm.addTab(active_menu);
            })
          }
        });
      })
    },

    watch: {
      //监听路由变化
      '$route'(val) {
        const { path } = val;
        const menu = this.menu_list.find((item) => {
          return this.getRoute(item.route) == path;
        });
        if (typeof menu != 'undefined') {
          this.active_menu_id = menu.id;
          this.scrollToTag(menu.id);
        }
      }
    },

    computed: {
      menuitemClasses: function () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      },

      getBreadcrumb() {
        if (this.active_menu_id == -1) {
          return [];
        }
        const active_menu = this.menu_list.find(item => {
          return item.id == this.active_menu_id
        });
        let result = [];
        if (typeof active_menu != 'undefined') {
          let path_ids = active_menu.path.split('>');
          path_ids.splice(0, 2);
          path_ids.splice(path_ids.length - 1, 1);
          path_ids.push(active_menu.id);
          path_ids.forEach(item => {
            const index = this.menu_list.findIndex(menu => {
              return item == menu.id;
            })
            if (index != -1) {
              result.push(this.menu_list[index]);
            }
          });
        }

        return result;
      }
    },

    mounted() {
      this.getUserInfo();
    },

    methods: {
      //获取用户信息
      getUserInfo() {
        this.$_get('user/userinfo').then((ret) => {
          this.userinfo = ret.data.userinfo;
        })
      },

      //控制侧边栏的展开和收起
      sideCollapse() {
        this.isCollapsed = !this.isCollapsed;
      },

      //选择菜单时的处理事件
      selectMenu(id) {
        const menu_index = this.menu_list.findIndex((item) => {
          return item.id == id;
        })

        const curr_menu = this.menu_list[menu_index];

        this.addTab({
          id: curr_menu.id,
          menu_name: curr_menu.menu_name,
          route: curr_menu.route
        });
      },

      //添加顶部tab
      addTab(data) {
        const index = this.tabs.findIndex((item) => {
          return item.id == data.id;
        })
        if (index == -1) {
          const font_count = data.menu_name.length;
          //计算tag总宽度，以操作滚动条
          const width = 12 * 2 + 20 + font_count * 12 + 26 + 15;
          this.tabs.push({ ...data, width });
        }

        //滚动到相应的元素处
        this.scrollToTag(data.id);
      },

      //关闭tab
      closeTab(e, id) {
        const index = this.tabs.findIndex(item => {
          return item.id == id;
        });
        if (index != -1) {
          this.tabs.splice(index, 1);
          //如果是当前活跃的id自动跳转到前一个路由
          if (this.active_menu_id == id) {
            this.tabChange(false, this.tabs[index - 1].id)
          }
        }
      },

      //滚动到相应的tagid位置
      scrollToTag(id) {
        this.$nextTick(() => {
          //计算所有tab的总宽度
          let total_width = 0;
          let total_width_left = 0;
          const { tabs } = this;
          for (let i = 0; i < tabs.length; i++) {
            total_width += tabs[i].width;
            if (tabs[i].id == id) {
              break;
            }
            total_width_left += tabs[i].width;
          }

          //获取tab容器的宽度
          const offset_width = this.$refs.tag.offsetWidth;

          //如果总宽度大于容器宽度，则滚动到相应的位置
          const scroll_left = this.$refs.tag.scrollLeft;

          //情况1滚动条位置未到需要滚动到的位置,则滚动条需要向右滚动
          const scroll_total_width = scroll_left + offset_width;
          if (scroll_total_width < total_width) {
            const scroll_diff = total_width - scroll_total_width;
            this.scrollSmooth(scroll_diff, 15);
          }
          //情况2滚动条位置已超过需要滚动到的位置，需要往回滚动
          else if (total_width_left < scroll_left) {
            const scroll_diff = scroll_left - total_width_left;
            this.scrollSmooth(-scroll_diff, -15);
          }
        })
      },


      //平滑滚动
      scrollSmooth(width, step_width, timeout = 5) {
        const abs_width = Math.abs(width);
        const abs_step_width = Math.abs(step_width);
        if (abs_width > abs_step_width) {
          this.$refs.tag.scrollLeft += step_width;
          setTimeout(() => {
            width -= step_width;
            this.scrollSmooth(width, step_width)
          }, timeout)
        } else {
          this.$refs.tag.scrollLeft += width;
        }
      },

      //获取格式好的路由，防止后台填写路由不完整
      getRoute(route) {
        return route.search(/^\/.*/i) === -1 ? '/' + route : route;
      },

      //点击顶部选项卡，切换路由
      tabChange(checked, id) {
        const index = this.tabs.findIndex((item) => {
          return item.id == id;
        })
        this.$router.push(this.getRoute(this.tabs[index].route));
        this.scrollToTag(id);
      },

      //点击右侧用户栏选项
      clickDropdownItem(name) {
        this[name]();
      },

      //显示用户信息
      showUserinfo() {
        this.show_userinfo = true;
      },

      //退出登录
      logout() {
        Modal.confirm({
          title: '退出登录',
          content: '确定要退出登录吗？',
          onOk: () => {
            this.$_delete('session').then((ret) => {
              if (ret) {
                store.delete('token');
                this.$router.push('/login');
              }
            });
          }
        });
      }
    }
  }
</script>


