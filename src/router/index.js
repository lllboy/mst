import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
Vue.use(Router)
const login = resolve => require(['@/pages/login'], resolve);
const index = resolve => require(['@/pages/index'], resolve);
//行为分析
const behaviorIndex = resolve => require(['@/pages/behavior/index'], resolve);
const behaviorStore = resolve => require(['@/pages/behavior/storeDetail'], resolve);
const behaviorApp = resolve => require(['@/pages/behavior/appDetail'], resolve);
const uninstall = resolve => require(['@/pages/behavior/uninstall'], resolve);
//质量分析
const qualityIndex = resolve => require(['@/pages/quality/index'], resolve);
const qualityStore = resolve => require(['@/pages/quality/storeDetail'], resolve);
const qualityApp = resolve => require(['@/pages/quality/appDetail'], resolve);
const quality = resolve => require(['@/pages/quality/quality'], resolve);
//质量分析
const flow = resolve => require(['@/pages/deep/index'], resolve);

// const keep = resolve => require(['@/pages/keepTrend'], resolve);
// const keepDetail = resolve => require(['@/pages/keepDetail'], resolve);
// const funnel = resolve => require(['@/pages/funnelTrend'], resolve);
// const funnelDetail = resolve => require(['@/pages/funnelDetail'], resolve);
// const funnelAppDetail = resolve => require(['@/pages/funnelAppDetail'], resolve);
// const flowTrend = resolve => require(['@/pages/flowTrend'], resolve);
// const duration = resolve => require(['@/pages/durationTrend'], resolve);
// const durationDetail = resolve => require(['@/pages/durationDetail'], resolve);
// const durationAppDetail = resolve => require(['@/pages/durationAppDetail'], resolve);
// const frequencyTrend = resolve => require(['@/pages/frequencyTrend'], resolve);
// const frequencyDetail = resolve => require(['@/pages/frequencyDetail'], resolve);
// const frequencyAppDetail = resolve => require(['@/pages/frequencyAppDetail'], resolve);


// Vue.use(Router)
// const $route = {};
const routes = [{
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/',
    name: 'index',
    component: index,
    redirect: '/downloadTrend',
    meta: {
      requireAuth: true,
    },
    children: [
      // 行为分析 --- 下载趋势
      {
        path: '/downloadTrend',
        name: 'download',
        component: behaviorIndex,
        meta: {
          type: 'download',
          bread: {
            name: '下载趋势',
            path: '/downloadTrend'
          }
        }
      },
      {
        path: '/downloadTrend/storeDetail/:storeId/:storeName',
        name: 'downloadStoreDetail',
        component: behaviorStore,
        meta: {
          type: 'download',
          bread: {
            name: '下载趋势',
            path: '/downloadTrend'
          }
        }
      },
      {
        path: '/downloadTrend/appDetail/:appId/:appName',
        name: 'downloadAppDetail',
        component: behaviorApp,
        meta: {
          type: 'download',
          bread: {
            name: '下载趋势',
            path: '/downloadTrend'
          }
        }
      },
      // 行为分析 --- 安装趋势
      {
        path: '/installTrend',
        name: 'install',
        component: behaviorIndex,
        meta: {
          type: 'install',
          bread: {
            name: '安装趋势',
            path: '/installTrend'
          }
        }
      },
      {
        path: '/installTrend/storeDetail/:storeId/:storeName',
        name: 'installStoreDetail',
        component: behaviorStore,
        meta: {
          type: 'install',
          bread: {
            name: '安装趋势',
            path: '/installTrend'
          }
        }
      },
      {
        path: '/installTrend/appDetail/:appId/:appName',
        name: 'installAppDetail',
        component: behaviorApp,
        meta: {
          type: 'install',
          bread: {
            name: '安装趋势',
            path: '/installTrend'
          }
        }
      },
      // 行为分析 --- 活跃趋势
      {
        path: '/activeTrend',
        name: 'active',
        component: behaviorIndex,
        meta: {
          type: 'active',
          bread: {
            name: '活跃趋势',
            path: '/activeTrend'
          }
        }
      },
      {
        path: '/activeTrend/storeDetail/:storeId/:storeName',
        name: 'activeStoreDetail',
        component: behaviorStore,
        meta: {
          type: 'active',
          bread: {
            name: '活跃趋势',
            path: '/activeTrend'
          }
        }
      },
      {
        path: '/activeTrend/appDetail/:appId/:appName',
        name: 'activeAppDetail',
        component: behaviorApp,
        meta: {
          type: 'active',
          bread: {
            name: '活跃趋势',
            path: '/activeTrend'
          }
        }
      },
       // 行为分析 --- 卸载趋势
      {
        path: '/unloadTrend',
        name: 'unload',
        component: uninstall,
        meta: {
          type: 'unload',
          bread: {
            name: '卸载趋势',
            path: '/unloadTrend'
          }
        }
      },
      // 质量分析 -- 漏斗趋势
      {
        path: '/funnelTrend',
        name: 'funnel',
        component: qualityIndex,
        meta: {
          type: 'funnel',
          bread: {
            name: '漏斗趋势',
            path: '/funnelTrend'
          }
        }
      },
      {
        path: '/funnelTrend/storeDetail/:storeId/:storeName',
        name: 'funnelStoreDetail',
        component: qualityStore,
        meta: {
          type: 'funnel',
          bread: {
            name: '漏斗趋势',
            path: '/funnelTrend'
          }
        }
      },
      {
        path: '/funnelTrend/appDetail/:storeId/:appId/:appName',
        name: 'funnelAppDetail',
        component: qualityApp,
        meta: {
          type: 'funnel',
          bread: {
            name: '漏斗趋势',
            path: '/funnelTrend'
          }
        }
      },
      // 质量分析 -- 频次趋势
      {
        path: '/frequencyTrend',
        name: 'frequency',
        component: quality,
        meta: {
          type: 'freq',
          bread: {
            name: '频次趋势',
            path: '/frequencyTrend'
          }
        }
      },
      // 质量分析 -- 时长趋势
      {
        path: '/durationTrend',
        name: 'duration',
        component: quality,
        meta: {
          type: 'time',
          bread: {
            name: '时长趋势',
            path: '/durationTrend'
          }
        }
      },
      {
        path: '/flowTrend',
        name: 'flowTrend',
        component: flow,
        meta: {
          type: 'flow',
          bread: {
            name: '流向分析',
            path: '/flowTrend'
          }
        }
      },
      {
        path: '/sameTrend',
        name: 'sameTrend',
        component: flow,
        meta: {
          type: 'simul',
          bread: {
            name: '同装分析',
            path: '/sameTrend'
          }
        }
      }
    ]
  },
]

const router = new Router({
  mode: 'history',
  base: '/web/',
  routes: routes
});

//路由拦截
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();

  // 路由拦截
  // if (to.matched.some(r => r.meta.requireAuth)) {
  //   if (localStorage.getItem('token')) {
  //     next();
  //   } else {
  //     window.location.href = 'http://irv.iresearch.com.cn/iResearchDataWeb/?m=user&a=jump&pro=46'
  //   }
  // } else {
  //   next();
  // }
});

router.afterEach(() => {
  NProgress.done();
});

export default router
