<template>
  <div class="wrapper">
    <div class="content" style="margin-top: 0px;">
      <div class="navname" style="margin-top: 25px;">APP在各渠道中{{ $route.meta.bread.name }}</div>
      <div class="appDetail-content-menu">
        <div class="trendList" :data="appData">
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <div class="appBox" style="border-right:1px solid #D0D4DD">
                  <el-col :span="6">
                    <span class="appName"><img src="../../assets/logo.png" alt=""></span>
                  </el-col>
                  <el-col :span="18" style="text-align:left;">
                    <span class="spanApp">
                      <p>{{ appName }}</p>
                      <p>所属分类：
                        <span>{{ categoryName }}</span>
                      </p>
                    </span>
                  </el-col>

                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light">
                <div class="appBox" style="border-right:1px solid #D0D4DD">
                  <span>
                    <p style="font-weight: 700;font-size:14px">最新周{{appTag}}</p>
                    <p>{{weekTotal}}
                      <!--<span class="trend">
                                                <i class="el-icon-caret-top"></i>{{appData.totalDownloadRatio}}</span>-->
                    </p>
                  </span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light">
                <div class="appBox">
                  <span>
                    <p style="font-weight: 700;font-size:14px">最新月{{appTag}}</p>
                    <p>{{monthTotal}}
                      <!--<span class="trend">
                                                <i class="el-icon-caret-top"></i>{{appData.totalDownloadRatio}}</span>-->
                    </p>

                  </span>
                </div>
              </div>
            </el-col>

          </el-row>
        </div>
        <el-col :span="24">
          <date-picker v-model="dateVal" @change-date-type="changeDateType" @change-date-limit="changeDateLimit" @change-date="changeDate" @change-week-date="changeWeekDate" @change-month-date="changeMonthDate" :startDate="startDate" :endDate="endDate" :show-limit="false">
            <span>
              <el-button type="primary" @click="submitData">确定</el-button>
            </span>
          </date-picker>
        </el-col>
      </div>
      <div class="table-content">
        <div class="table-content-header">
          <el-button :plain="true" type="primary" @click="downloadData" size="small" class='btn-download'>
            <i class="iconfont icon-download"></i>数据导出</el-button>
          <span>
            <span class="label">图表：</span>
            <el-switch v-model="switchVal" :disabled="flag" on-text="" off-text="" on-color="#67C72B" off-color="#ccc">
            </el-switch>
          </span>

        </div>
        <div class="table-content-body appDetail" v-loading.table-content-body="loading">
          <el-collapse-transition>
            <div v-show="switchVal" :class="flag === true ? ' chartsBox1 ' : ' chartsBox '">
              <el-row :gutter="10">
                <el-col :lg="12">
                  <div class="grid-content bg-purple">
                    <div style="text-align: right;position: absolute;right: 88px;top:50%;">
                      <span class="chart-date">
                        <span class="present">当前渠道</span>
                        <el-select v-model="channelId" placeholder="请选择" @change="changeFunnel">
                          <el-option v-for="item in tableData" :key="item.id" :label="item.name" :value="item.id">
                          </el-option>
                        </el-select>
                      </span>
                    </div>
                  </div>
                </el-col>
                <el-col :lg="12">
                  <div class="grid-content bg-purple-light">
                    <div style="width: 600px;">
                      <funnel-charts :select="tableData" :data="chartData" :funnelData="funnelData" @change-channel="changeFunnel" :show="switchVal"></funnel-charts>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-collapse-transition>
          <radioTrend :current="currentPage" :type="dateTypeVal" :tableData="tableData" :tableHeader="tableHeader" @change-sort="changeSort" :loading="loading" :checked="channelId" @change-size="changeSize" @change-current="changeCurrent" :total="total"></radioTrend>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'
import radioTrend from '@/components/radioTrend'
import datePicker from '@/components/datePicker'
import search from '@/components/search'
import funnelCharts from '@/components/funnelChart'
export default {
  name: 'funnelAppDetail',
  components: {
    radioTrend,
    datePicker,
    search,
    funnelCharts
  },
  data() {
    return {
      loading: false,
      searchValue: '',
      searchData: [],
      searchId: null,
      searchType: null,
      dateTypeVal: 'week',
      date: [
        {
          label: '周',
          value: "week"
        },
        {
          label: '月',
          value: "month"
        }
      ],
      weekOption: {
        firstDayOfWeek: 1
      },
      startDate: null,
      endDate: null,
      dataLimitVal: 1,
      dateList: [],
      dateVal: '',
      weekDateVal: '',
      monthDateVal: '',
      monthVal: null,
      switchVal: false,
      tableData: [],
      tableHeader: [],
      chartDateList: [],
      chartData: [],
      funnel: [],
      chartOption: {},
      chartDateValue: null,
      checked: '',
      total: null,
      currentPage: 1,
      pageSize: 10,
      orderColumn: '',
      orderType: 'descending',
      // echarts的data
      echartsData: [],
      appData: {},
      appName: '',
      categoryName: '',
      weekTotal: '',
      monthTotal: '',
      appTag: '',
      ascTableData: [],
      descTableData: [],
      rankLoading: false,
      funnelData: {},
      channelId: null,
      flag:false
    }
  },
  created() {
    this.fetchDate();
    this.fetchDetail();
    // this.fetchSelect();
  },
  watch: {
    $route(val) {
      this.fetchDate();
      this.fetchDetail();
    }
  },
  methods: {
    fetchDetail() {
      const params = {
        appId: parseInt(this.$route.params.appId),
        // date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
        dateType: this.dateTypeVal,
      }
      api.findChannelAppUse(params).then(res => {
        if (res.data.tableData.length) {
          this.appData = res.data.tableData;
          this.appName = res.data.tableData[0].appName;
          this.categoryName = res.data.tableData[0].categoryName;
          this.weekTotal = res.data.tableData[0].total;
          this.monthTotal = res.data.tableData[1].total;
          this.appTag = res.data.tableData[0].tag;
        }
      })
    },
    changeDateType(val) {
      this.dateTypeVal = val;
    },
    changeDateLimit(val) {
      this.dataLimitVal = val;
    },
    changeDate(val) {
      this.dateVal = val;
    },
    changeWeekDate(val) {
      this.weekDateVal = val;
    },
    changeMonthDate(val) {
      this.monthDateVal = val;
    },
    fetchDate() {
      api.date().then(res => {
        this.dateVal = res.data.end;
        this.startDate = res.data.start
        this.endDate = res.data.end
        this.fetchTableData();
      })
    },
    fetchSelect() {
      const params = {
        dateType: this.dateTypeVal,
        type: 'funnel',
        date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
        channelId: this.channelId,
        appId: parseInt(this.$route.params.appId),
      }
      api.funnelAppCharts(params).then(res => {
        if (res.data.funnelCharts !== null) {
          this.chartData = res.data.funnelCharts.array;
          this.funnelData = res.data.funnelCharts.rate;
          this.flag = false;
        } else {
          this.chartData = [];
          this.funnelData = {};
          this.flag = true;
        }
        // this.chartData = res.data.funnelCharts.array;
        // this.funnelData = res.data.funnelCharts.rate;
      })
    },
    changeFunnel(val) {
      this.channelId = val;
      this.fetchSelect();
    },
    fetchTableData() {
      this.loading = true;
      const params = {
        date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
        dateType: this.dateTypeVal,
        type: this.$route.meta.type,
        limit: 1,
        channelId: this.channelId,
        id: parseInt(this.$route.params.appId),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderColumn,
      }
      api.findChannelAppUse(params).then(res => {
        this.loading = false;
        this.count = true;
        if (res.data.tableHeader !== null) {
          this.tableHeader = res.data.tableHeader;
        } else {
          this.flag = false;
          this.tableHeader = []
        }
        if (res.data.tableData !== null) {
          this.tableData = res.data.tableData;
        } else {
          this.tableData = [];
          this.flag = true;
        }
        this.total = res.data.tablePage.total;
        // this.channelId = res.data.tableData[0].id
        if (res.data.tableData && res.data.tableData.length) {
          this.channelId = res.data.tableData[0].id
        };

      })
    },
    // 导出数据
    downloadData() {
      // const params = {
      //   // 发送请求
      //   date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
      //   dateType: this.dateTypeVal,
      //   type: this.$route.meta.type,
      //   pageNo: this.currentPage,
      //   pageSize: this.pageSize,
      //   orderType: this.orderType,
      //   orderColumn: this.orderColumn
      // }
      var path = "http://113.200.91.81/mst/funnel/Excel?";
      var paras = "type=" + this.$route.meta.type + "&" +
        "date=" + (this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal) + "&" +
        "dateType=" + this.dateTypeVal + "&" +
        "limit=" + this.dataLimitVal + "&" +
        "pageNo=" + this.currentPage + "&" +
        "pageSize=" + this.pageSize + "&" +
        "orderType=" + this.orderType + "&" +
        "orderColumn=" + this.orderColumn

      window.location.href = path + paras;

    },
    submitData() {
      this.count = false;
      this.currentPage = 1;
      this.fetchTableData();
      this.fetchSelect();
    },
    handleSearch(val) {
      const params = {
        query: val
      }
      if (val !== '') {
        this.searchLoading = true;
        api.findSearchAppChannel(params).then(res => {
          this.searchLoading = false;
          // this.searchData = res.data;
          function checkName(item) {
            return item.name
              .indexOf(val.toLowerCase()) != -1;
          }
          var tempList = res.data;
          this.searchData = tempList.filter(checkName);
        })
      } else {
        this.searchData = [];
      }
    },
    startSearch(item) {
      let type = '';
      if (item.type === 'app') {
        type = 'appDetail'
        this.$router.push({
          path: `${this.$route.meta.bread.path}/${type}/${this.$route.params.storeId}/${item.id}/${item.name}`
        })
      } else {
        type = 'storeDetail'
        this.$router.push({
          path: `${this.$route.meta.bread.path}/${type}/${item.id}/${item.name}`
        })
      }

    },
    changeSize(val) {
      this.pageSize = val;
      this.fetchTableData();
    },
    changeCurrent(val) {
      this.currentPage = val;
      if (this.count === true) {
        this.fetchTableData();
      }
    },
    // changeRadio(val) {
    //   this.checked = val;
    // },
    changeSort(sort) {
      sort.prop = (sort.column ? sort.column.label : '');
      sort.order = (sort.order ? sort.order : 'descending');
      this.orderColumn = sort.prop;
      this.orderType = sort.order;
      this.fetchTableData();
    },
  }
}
</script>

<style lang="less">
.content {
  // margin-top: 20px;
  // padding: 0 15px;
  .appDetail-content-menu {
    border: 1px solid #ddd;
    background: #fff;
    overflow: hidden;
    width: 100%;
    .sub-btn {
      margin: 15px 0 0 0px;
    }
    .trendList {
      border-bottom: 1px solid #E2E9F3;
      padding-bottom: 17px;
    }
    .appBox {
      text-align: center;
      margin-top: 20px;
      overflow: hidden;
    }
    .appBox span {
      display: inline-block;
      line-height: 30px;
      text-align: left;
      p:first-child {
        font-size: 20px;
        font-weight: 700;
        text-align: left;
        color: #64748a;
      }
      .trend {
        font-weight: 300;
        font-size: 14px;
        text-align: left;
      }
    }
    .appName {
      float: left;
      margin-left: 20px;
    }
    .appName img {
      width: 60px;
      height: 60px;
      vertical-align: middle;
    }
    .select-list {
      &.top {
        border-bottom: 1px solid #ddd;
      }
      .left,
      .right {
        padding: 15px 15px;
        margin: 5px 0;
        >span {
          margin-right: 15px;
        }
        .limit {
          .el-select {
            width: 70px;
          }
        }
      }
      .left {
        width: 100px;
        float: left;
      }
      .right {
        overflow: hidden;
        .el-checkbox {
          margin: 5px 15px 5px 0;
        }
        .el-checkbox+.el-checkbox {
          margin: 5px 15px 5px 0;
        }
        .el-checkbox-group {
          display: inline;
        }
      }
    }
  }
}

.conversion {
  position: absolute;
  right: 4px;
  top: 37%;
  height: 110px;
  width: 158px;
  p {
    color: #B2D233
  }
  p:last-child {
    position: absolute;
    bottom: 0;
    color: #B2D233
  }
}

// .wrapper>.content .table-content .table-content-body .chart .chart-date {
//   position: absolute;
//   top: 38%;
//   right: 30px;
// }
.present {
  padding: 6px 20px;
  border: 1px solid #E5E5E5;
  margin-right: -4px;
  border-right: none;
  vertical-align: middle;
  background: #F9F9F9;
}

.chart-date {
  .el-input__icon+.el-input__inner {
    border-radius: 0px;
  }
}

.el-table {
  font-size: 12px;
}

.el-table .cell {
  white-space: nowrap;
}

.tableHeader {
  padding: 10px;
  border: 1px solid #E3ECDF;
  border-bottom: none;
  background: #F9F9F9;
}

.el-table th.is-leaf:nth-child(2),
.el-table td:nth-child(2) {
  text-align: left;
}

.el-table th.is-leaf:nth-child(1),
.el-table td:nth-child(1) {
  text-align: left;
}

.el-table th.is-leaf,
.el-table td {
  text-align: right;
}

.appDetail .el-table .link {
  cursor: default !important;
}
.chartsBox1{
  // display: none;
   visibility:hidden;
}
@media only screen and (min-width:1366px) {
  .chartsBox {
    width: 1100px;
    margin: 0 auto;
  }
}
</style>
