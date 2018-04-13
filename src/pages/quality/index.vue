<template>
  <div class="wrapper">
    <div class="content">
      <div class="navname">{{ $route.meta.bread.name }}</div>
      <div class="menu">
        <date-picker v-model="dateVal" :limit="dataLimitVal" :type="dateTypeVal" @change-date-type="changeDateType" @change-date-limit="changeDateLimit" @change-date="changeDate" @change-week-date="changeWeekDate" @change-month-date="changeMonthDate" :startDate="startDate" :endDate="endDate" :show-limit="false">
          <span>
            <el-button type="success" @click="submitData">确定</el-button>
          </span>
        </date-picker>
      </div>
      <div class="table-content">
        <div class="table-content-header">
          <el-button :plain="true" type="primary" @click="downloadData" size="small" class='btn-download'>
            <i class="iconfont icon-download"></i>数据导出</el-button>
          <span>
            <span class="label">图表：</span>
            <el-switch v-model="switchVal" :disabled="flag"  on-text="" off-text="" on-color="#67C72B" off-color="#ccc">
            </el-switch>
          </span>

        </div>
        <div class="table-content-body" v-loading.table-content-body="loading">
          <el-collapse-transition>
            <div v-show="switchVal" :class="flag === true ? 'chartsBox1' : 'chartsBox'">
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
          <radioTrend :current="currentPage" :type="dateTypeVal" :tableData="tableData" :tableHeader="tableHeader" @link-page="linkDetail" @change-sort="changeSort" :checked="checked" @change-size="changeSize" @change-current="changeCurrent" :total="total"></radioTrend>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import radioTrend from "@/components/radioTrend";
import funnelCharts from "@/components/funnelChart";
import datePicker from "@/components/datePicker";
import search from "@/components/search";
export default {
  name: "funnelTrend",
  components: {
    radioTrend,
    datePicker,
    search,
    funnelCharts
  },
  data() {
    return {
      loading: false,
      searchValue: "",
      searchData: [],
      searchId: null,
      searchType: null,
      searchLoading: false,
      dateTypeVal: "week",
      startDate: null,
      endDate: null,
      dataLimitVal: 4,
      dateList: [],
      dateVal: "",
      weekDateVal: "",
      monthDateVal: "",
      monthVal: null,
      switchVal: false,
      tableData: [],
      tableHeader: [],
      chartDateList: [],
      chartData: [],
      funnel: [],
      checked: "",
      total: null,
      currentPage: 1,
      pageSize: 10,
      orderColumn: "",
      orderType: "descending",
      channelId: null,
      funnelData: {},
      count: false,
      flag: false
    };
  },
  created() {
    this.fetchDate();
    //this.fetchSelect();
  },
  watch: {
    // 这里观察已选的id  并过滤table里对应id和已选id一样的
    checked(val) {
      if (val) {
        this.echartsData = this.tableData.filter(item => {
          item.id === val;
        });
      }
    },
    $route(val) {
      this.init();
    }
  },
  methods: {
    init() {
      this.count = false;
      this.switchVal = false;
      this.dateTypeVal = "week";
      this.dataLimitVal = 4;
      this.currentPage = 1;
      this.pageSize = 10;
      this.orderType = "descending";
      this.orderColumn = "";
      this.weekDateVal = "";
      this.monthDateVal = "";
      this.tableHeader = [];
      this.fetchDate();
      this.flag = false;
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
        this.startDate = res.data.start;
        this.endDate = res.data.end;
        this.fetchTableData();
      });
    },
    fetchSelect() {
      const params = {
        dateType: this.dateTypeVal,
        type: "funnel",
        date:
        this.dateTypeVal === "week" ? this.weekDateVal : this.monthDateVal,
        channelId: this.channelId
      };
      api.funnelCharts(params).then(res => {
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
        //this.funnelData = res.data.funnelCharts.rate;
      });
    },
    changeFunnel(val) {
      this.channelId = val;
      this.fetchSelect();
    },
    fetchTableData() {
      this.loading = true;
      const params = {
        date:
        this.dateTypeVal === "week" ? this.weekDateVal : this.monthDateVal,
        dateType: this.dateTypeVal,
        type: this.$route.meta.type,
        limit: 1,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderColumn
      };
      api.findChannelUse(params).then(res => {
        this.loading = false;
        this.count = true;
        if (res.data.tableHeader !== null) {
          this.tableHeader = res.data.tableHeader;
        } else {
          this.tableHeader = [];
        }
        if (res.data.tableData !== null) {
          this.tableData = res.data.tableData;
          this.flag = false;
        } else {
          this.tableData = [];
          this.flag = true;
        }
        if (res.data.tableData && res.data.tableData.length) {
          this.channelId = res.data.tableData[0].id;
        }
        this.total = res.data.tablePage.total;
      });
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
      var paras =
        "type=" +
        this.$route.meta.type +
        "&" +
        "date=" +
        (this.dateTypeVal === "week" ? this.weekDateVal : this.monthDateVal) +
        "&" +
        "dateType=" +
        this.dateTypeVal +
        "&" +
        "limit=" +
        this.dataLimitVal +
        "&" +
        "pageNo=" +
        this.currentPage +
        "&" +
        "pageSize=" +
        this.pageSize +
        "&" +
        "orderType=" +
        this.orderType +
        "&" +
        "orderColumn=" +
        this.orderColumn;

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
      };
      if (val !== "") {
        this.searchLoading = true;
        api.findSearchAppChannel(params).then(res => {
          this.searchLoading = false;
          // this.searchData = res.data;
          function checkName(item) {
            return item.name.indexOf(val.toLowerCase()) != -1;
          }
          var tempList = res.data;
          this.searchData = tempList.filter(checkName);
        });
      } else {
        this.searchData = [];
      }
    },
    // startSearch(item) {
    //   let type = '';
    //   if (item.type === 'app') {
    //     type = 'appDetail'
    //     this.$router.push({
    //       path: `${this.$route.meta.bread.path}/${type}/${this.$route.params.storeId}/${item.id}/${item.name}`
    //     })
    //   } else {
    //     type = 'storeDetail'
    //     this.$router.push({
    //       path: `${this.$route.meta.bread.path}/${type}/${item.id}/${item.name}`
    //     })
    //   }
    // },
    // changeDateType(val) {
    //   this.dateTypeVal = val;
    //   const params = {
    //     type: this.dateTypeVal
    //   }
    //   api.date(params).then(res => {
    //     this.dateVal = res.data[0].value;
    //   })
    // },

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
      sort.prop = sort.column ? sort.column.label : "";
      sort.order = sort.order ? sort.order : "descending";
      this.orderColumn = sort.prop;
      this.orderType = sort.order;
      this.fetchTableData();
    },
    linkDetail(row) {
      this.$router.push({
        path: `${this.$route.meta.bread.path}/storeDetail/${row.id}/${row.name}`
      });
    }
  }
};
</script>

<style lang="less">
.conversion {
  position: absolute;
  right: 0px;
  top: 37%;
  height: 110px;
  p {
    color: #b2d233;
  }
  p:last-child {
    position: absolute;
    bottom: 0;
    color: #b2d233;
  }
}

// .wrapper>.content .table-content .table-content-body .chart .chart-date {
//   position: absolute;
//   top: 38%;
//   right: 30px;
// }
.present {
  padding: 6px 20px;
  border: 1px solid #e5e5e5;
  margin-right: -4px;
  border-right: none;
  vertical-align: middle;
  background: #f9f9f9;
  line-height: 31px;
}

.chart-date {
  .el-input__icon+.el-input__inner {
    border-radius: 0px;
  }
}

.el-table .cell {
  white-space: nowrap;
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

.chartsBox1 {
  // display: none;
  visibility: hidden;
}

@media only screen and (min-width: 1366px) {
  .chartsBox {
    width: 1100px;
    margin: 0 auto;
  }
}
</style>
