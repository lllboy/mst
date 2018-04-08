import fetch from '@/utils/fetch'

const api = {
  login(data) {
    return fetch({
      url: '/login/login',
      method: 'POST',
      data: data
    });
  },
  // // 正式接口
  // 公共接口
  date(params) {
    return fetch({
      url: '/getDateTimeScale',
      method: 'GET',
      params: params
    });
  },
  appType() {
    return fetch({
      url: '/getAppCategories',
      method: 'GET'
    });
  },
  // 搜索接口
  findSearchAppChannel(params) {
    return fetch({
      url: '/findSearchAppChannel',
      method: 'GET',
      params: params
    });
  },
  // 行为分析
  // 下载趋势第一个页面接口
  // trend(params) {
  //   return fetch({
  //     url: '/behavior/findTrends',
  //     method: 'GET',
  //     params: params
  //   });
  // },
  // 质量分析中storeDetail页的渠道本周和上周排名
  getChannelTrend(params) {
    return fetch({
      url: '/findEachChannelAppTrend',
      method: 'GET',
      params: params
    })
  },
  //appDetail在最上方app在各个渠道下排名
  channelAppTrend(params) {
    return fetch({
      url: '/getAppTotal',
      method: 'GET',
      params: params
    })
  },
  // 最原始top3接口不知道弃用了没？
  findAppChannelRanks(params) {
    return fetch({
      url: '/findChannelAppTrendRanks',
      method: 'GET',
      params: params
    });
  },
  // storeDetail渠道中app的详情table接口（现在不好使）
  findChannelAppTrends(params) {
    return fetch({
      url: '/findChannelAppTrend',
      method: 'GET',
      params: params
    });
  },
  // appDetail在渠道中的详情table
  findAppChannelTrends(params) {
    return fetch({
      url: '/findEachChannelAppTrend',
      method: 'GET',
      params: params
    });
  },
  // 卸载趋势接口
  unloadTable(params) {
    return fetch({
      url: '/behavior/findUninstallAppList',
      method: 'GET',
      params: params
    });
  },
  // 渠道top3
  storeRank(params) {
    return fetch({
      url: '/behavior/findChannelAppRanks',
      method: 'GET',
      params: params
    });
  },

  // 质量分析接口
  // 漏斗echarts图表
  funnelCharts(params) {
    return fetch({
      url: 'funnel/funnelCharts',
      method: 'GET',
      params: params
    })
  },
  // 漏斗第三页echarts图表
  funnelAppCharts(params) {
    return fetch({
      url: 'funnel/funnelAppCharts',
      method: 'GET',
      params: params
    })
  },
  // 漏斗的第一页table图表
  radioTrend(params) {
    return fetch({
      url: 'funnel/findFunnel',
      method: 'GET',
      params: params
    })
  },
  // 漏斗趋势第三页最上面统计总数
  findAppDetails(params) {
    return fetch({
      url: '/funnel/findAppDetails',
      method: 'GET',
      params: params
    });
  },
  // 漏斗第三个页面table
  findFunnel(params) {
    return fetch({
      url: '/funnel/findFunnelApp',
      method: 'GET',
      params: params
    });
  },
  // 漏斗趋势第二页的table接口
  findAppFunnel(params) {
    return fetch({
      url: '/funnel/findAppFunnel',
      method: 'GET',
      params: params
    });
  },
  // 漏斗渠道top3
  funnelRanks(params) {
    return fetch({
      url: '/funnel/findFunnelRanks',
      method: 'GET',
      params: params
    });
  },
  // 漏斗渠道排名详情
  funnelRanksDetail(params) {
    return fetch({
      url: '/funnel/findAppRank',
      method: 'GET',
      params: params
    });
  },
  // 漏斗趋势第二页的渠道本周排名接口

  // 频次和时长分析表格接口（就一个页面）
  findChannelUse(params) {
    return fetch({
      url: 'findChannelUse',
      method: 'GET',
      params: params
    });
  },
  // 流向分析表格接口
  flowTable(params) {
    return fetch({
      url: '/deep/findAppDeeps',
      method: 'GET',
      params: params
    });
  },
  // 流向分析图表接口，技术不会定义，求hank帮助
  flowCharts(params) {
    return fetch({
      url: '/deep/getDeepChart',
      method: 'GET',
      params: params
    });
  },
  // 模拟接口
 //行为分析第一页下载趋势接口
 trend(params) {
  return fetch({
    url: '/getTrends',
    method: 'GET',
    params: params
  });
},

  // 行为分析第一页的导出接口
  // exportTrendExcel(params) {
  //   return fetch({
  //     url: '/behavior/exportTrendExcel',
  //     method: 'GET',
  //     params: params
  //   });
  // },
  // 行为分析第二页的导出接口
  // exportChannelAppTrendExcel(params) {
  //   return fetch({
  //     url: '/behavior/exportChannelAppTrendExcel',
  //     method: 'GET',
  //     params: params
  //   });
  // },
  // 行为分析第三页的导出接口
  // exportAppChannelTrendExcel(params) {
  //   return fetch({
  //     url: '/behavior/exportAppChannelTrendExcel',
  //     method: 'GET',
  //     params: params
  //   });
  // },
  // // 深度分析的导出接口
  // exportAppDeepsExcel(params) {
  //   return fetch({
  //     url: '/deep/exportAppDeepsExcel',
  //     method: 'GET',
  //     params: params
  //   });
  // },
  // 卸载的导出接口
  // excelUndownload(params) {
  //   return fetch({
  //     url: '/behavior/Excel',
  //     method: 'GET',
  //     params: params
  //   });
  // },
  // 漏斗的导出接口
  // excelFunnel(params) {
  //   return fetch({
  //     url: '/funnel/Excel',
  //     method: 'GET',
  //     params: params
  //   });
  // }
}

export default api;
