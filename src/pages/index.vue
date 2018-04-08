<template>
  <div class="index">
    <div class="nav">
      <div class="nav_head">
        <h4>移动渠道市场监测</h4>
        <p>StoreTracker</p>
      </div>
      <el-menu mode="vertical" :default-active="splitUrl($route.path)" class="el-menu-vertical-demo" theme="dark" unique-opened>
        
          <el-menu-item-group  v-for="nav in navs" :key="nav.title">
             <template slot="title">
                <i class="iconfont" :class="nav.class"></i>{{ nav.title }}
             </template>
            
              <!-- <router-link tag="span" :to="{path: sub.link}">{{ sub.title }}</router-link> -->
              <el-submenu v-if="sub.children"  :index="sub.title+nav.title" v-for="sub in nav.children" :key="sub.title+nav.title">
                  <template slot="title">
                    {{ sub.title }}
                  </template>
                  <el-menu-item  :index="sub.title+subchild.link" v-for="subchild in sub.children" :key="subchild.title">
                    <router-link tag="span" :to="{path: subchild.link}">{{ subchild.title }}</router-link>
                  </el-menu-item>
               

              </el-submenu>
              <el-menu-item v-if="!sub.children" style="color: rgb(136,149,168);" :index="sub.title+nav.title" v-for="sub in nav.children" :key="sub.title+nav.title">
                      <router-link tag="span" :to="{path: sub.link}">{{ sub.title }}</router-link> 
              </el-menu-item>
              
            
          </el-menu-item-group>
        
      </el-menu>
      <div class="footer">
        <img src="../../dist/static/img/email.png">
        <img src="../../dist/static/img/tell.png">
        <img src="../../dist/static/img/help.png">
      </div>
    </div>
    <div class="content">
      <!-- <div class="breadcrumb">
        <i class="iconfont icon-dial"></i>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: $route.meta.bread.path }">
            {{ $route.meta.bread.name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.params.storeName">{{ $route.params.storeName }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.params.appName">{{ $route.params.appName }}</el-breadcrumb-item>
        </el-breadcrumb>
        <search v-model="searchVal" :data="searchData" @search="startSearch" v-show="showSearch"></search>
      </div> -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'
import search from '@/components/search'
export default {
  name: 'index',
  components: {
    search
  },
  data() {
    return {
      searchVal: '',
      searchData: [],
      active: '',
      navs:[

        // 渠道
        {
          title:'渠道',
          class:'icon-leftmenu-icon1',
          children: [
            // 行为分析
            {
              title: '行为分析',
              children: [
                {
                  title: '行为趋势',
                  link: '/downloadTrend'
                }
              ]

            },
            // 质量分析
            {
              title: '质量分析',
              children: [
                {
                  title: '新装人均次数',
                  link: '/funnelTrend'
                },
                {
                  title: '新装人均时长',
                  link: '/frequencyTrend'
                },
                {
                  title: '新装留存',
                  link: '//keepTrend'
                }
              ]
            },
            // 渠道画像
            {
              title: '渠道画像',
              link: '/'

            }
          ]
        },
        // APP
        {
          title: 'APP',
          class: 'icon-leftmenu-icon2',
          children: [
            // 行为分析
            {
              title: '行为分析',
              children: [
                {
                  title: '行为趋势',
                  link: '/appdownloadTrend'
                }
              ]

            },
            // 质量分析
            {
              title: '质量分析',
              children: [
                {
                  title: '新装人均次数',
                  link: '/funnelTrend'
                },
                {
                  title: '新装人均时长',
                  link: '/frequencyTrend'
                },
                {
                  title: '新装留存',
                  link: '//keepTrend'
                }
              ]
            },
            // APP画像
            {
              title: 'APP画像',
              link: '/app'

            },
            // 深度分析
            {
              title: '深度分析',
              children: [
                {
                  title: '流向分析',
                  link: '/flowTrend'
                },
                {
                  title: '同装分析',
                  link: '/sameTrend'
                }
              ]
            }
          ]
        }
      ]
      // navs: [
      //   {
      //     title: '行为分析',
      //     class: 'icon-leftmenu-icon2',
      //     children: [
      //       {
      //         title: '下载趋势',
      //         link: '/downloadTrend'
      //       },
      //       {
      //         title: '安装趋势',
      //         link: '/installTrend'
      //       },
      //       {
      //         title: '活跃趋势',
      //         link: '/activeTrend'
      //       },
      //       {
      //         title: '卸载趋势',
      //         link: '/unloadTrend'
      //       }
      //     ]
      //   },
      //   {
      //     title: '质量分析',
      //     class: 'icon-leftmenu-icon1',
      //     children: [
      //       {
      //         title: '漏斗趋势',
      //         link: '/funnelTrend'
      //       },
      //       // {
      //       //   title: '留存趋势',
      //       //   link: '/keepTrend'
      //       // },
      //       {
      //         title: '频次趋势',

      //         link: '/frequencyTrend'
      //       },
      //       {
      //         title: '时长趋势',
      //         link: '/durationTrend'
      //       }
      //     ]
      //   },
      //   {
      //     title: '深度分析',
      //     class: 'icon-leftmenu-icon',
      //     children: [
      //       {
      //         title: '流向分析',
      //         link: '/flowTrend'
      //       },
      //       {
      //         title: '同装分析',
      //         link: '/sameTrend'
      //       }
      //     ]
      //   }
      // ]
    }
  },
  computed: {
    showSearch() {
      if (this.$route.meta.type === 'unload' || this.$route.meta.type === 'time' || this.$route.meta.type === 'flow' || this.$route.meta.type === 'freq' || this.$route.meta.type === 'simul') {
        return false
      } else {
        return true
      }
    }
  },
  created() {
    this.fetchApp();
  },
  methods: {
    splitUrl(url) {
      return '/' + url.split('/')[1]
    },
    fetchApp() {
      const params = {
        query: ''
      }
      api.findSearchAppChannel(params).then(res => {
        this.searchData = res.data;
      })
    },
    startSearch(item) {
      let type = '';
      if (item.type === 'app') {
        if (this.$route.meta.type === 'funnel') {
          type = 'appDetail'
          this.$router.push({
            path: `${this.$route.meta.bread.path}/${type}/${this.$route.params.storeId}/${item.id}/${item.name}`
          })
        }
        else {
          type = 'appDetail'
          this.$router.push({
            path: `${this.$route.meta.bread.path}/${type}/${item.id}/${item.name}`
          })
        }
      }
      else {
        type = 'storeDetail'
        this.$router.push({
          path: `${this.$route.meta.bread.path}/${type}/${item.id}/${item.name}`
        })
      }

    }
  }
}
</script>

<style lang="less">
.index {
  >.nav {
    width: 200px;
    position: fixed;
    top: 30px;
    left: 0;
    height: 100%;
    overflow-y: auto;
    background-color: #323A45;
    .nav_head {
      text-align: center;
      padding-top: 40px;
      background: #232a32;
      width: 200px;
      padding-bottom: 40px;
      margin-bottom: 40px;
      h4:first-child {
        font-size: 20px;
        text-align: center;
        color: #fff;
        margin-bottom: 16px;
      }
      p:last-child {
        width: 140px;
        height: 25px;
        font-size: 13px;
        color: #69c72b;
        padding: 4px 10px;
        text-align: center;
        border: 1px solid #69c72b;
        border-radius: 15px;
        font-weight: 700;
        margin: 0 auto;
      }
    }
    .el-menu {
      background: none !important;
      border-right:none;
      
    }
    .el-menu-item-group {
      .el-menu-item-group__title {
        line-height: 45px;
        font-size: 14px;
        height: 45px;
        padding-left: 20px;
        color: rgb(136,149,168);
      }
      .el-menu-item {
        color: white;
        padding: 0;
        line-height: 45px;
        height: 45px;
        &:hover {
          background: #69c72b;
        }
        span {
          display: block;
          padding: 0px;
        }
      }
      .is-active {
        color: #fff;
        border-left: 1px solid#69c72b;
        background: #69c72b;
        position: relative;
        &:after {
          content: "";
          position: absolute;
          height: 100%;
          width: 3px;
          background: #69c72b;
          right: 0;
          top: 0;
        }
      }
    }
  }
  .el-submenu__title,
  .el-menu-item {
    padding-left: 60px !important;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    color: rgb(136,149,168);
    padding: 0 20px;
    cursor: pointer;
    position: relative;
    transition: border-color .3s, background-color .3s, color .3s;
    box-sizing: border-box;
    white-space: nowrap;
  }
  >.content {
    margin-left: 220px;
    background: #F7F7F7;
    >.breadcrumb {
      background: #fff;
      border-bottom: 1px solid #DBDEE3;
      .el-breadcrumb {
        display: inline-block;
        line-height: 40px;
        vertical-align: middle;
      }
      .el-breadcrumb__item__inner,
      .el-breadcrumb__item__inner a {
        color: #647589;
      }
      .icon-dial {
        font-size: 12px;
      }
    }
  }

  // footer

  .footer{
    display: flex;
    margin: 80px auto;
    text-align: center;
    justify-content: center;
    img{
      cursor: pointer;
      width: 20px;
      height: 20px;
      display:block;
      margin:0px 20px; 
      
     
    }
  }
}
</style>
