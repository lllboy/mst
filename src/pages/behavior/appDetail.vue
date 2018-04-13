<template>
  <div class="wrapper">
    <div class="content" style="margin-top:0">
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
          <date-picker v-model="dateVal" :limit="dataLimitVal" :type="dateTypeVal" @change-date-type="changeDateType" @change-date-limit="changeDateLimit" @change-date="changeDate" @change-week-date="changeWeekDate" @change-month-date="changeMonthDate" :startDate="startDate" :endDate="endDate">
            <el-button type="success" @click="submitData">确定</el-button>
          </date-picker>
        </el-col>
        <!--<el-col :span="10">
            <div class="sub-btn">
              
            </div>
          </el-col>-->
      </div>
      <div class="table-content">
        <div class="table-content-header">
          <el-button :plain="true" type="primary" @click="downloadData" size="small" class='btn-download'>
            <i class="iconfont icon-download"></i>数据导出</el-button>
          <span>
            <span class="label">趋势图表：</span>
            <el-switch v-model="switchVal" on-text="" off-text="" on-color="#67C72B" off-color="#ccc">
            </el-switch>
          </span>

        </div>
        <div class="table-content-body appDetail" v-loading.body="loading">
          <el-collapse-transition>
            <trend-chart :show="switchVal" :data="chartData" :xAxis="chartXAxis"></trend-chart>
          </el-collapse-transition>
          <trend :current="currentPage" :type="dateTypeVal" :tableData="tableData" :tableHeader="tableHeader" @change-sort="changeSort" @change-size="handleSizeChange" @change-current="handleCurrentChange" :total="total"></trend>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入组件
import api from "@/api/api";
import trendChart from "@/components/trendChart";
import datePicker from "@/components/datePicker";
import search from "@/components/search";
import trend from "@/components/trend";
export default {
  name: "appDetail",
  components: {
    trend,
    datePicker,
    search,
    trendChart
  },
  data() {
    return {
      loading: false,
      dateTypeVal: "week",
      dataLimitVal: 4,
      startDate: null,
      endDate: null,
      searchValue: "",
      weekDateVal: "",
      monthDateVal: "",
      weekVal: null,
      monthVal: null,
      dateVal: "",
      switchVal: false,
      currentPage: 1,
      pageSize: 10,
      orderColumn: "",
      orderType: "descending",
      total: null,
      appData: {},
      appName:'',
      categoryName:'',
      weekTotal:'',
      monthTotal:'',
      appTag:'',
      tableData: [],
      tableHeader: [],
      chartXAxis: [],
      chartData: [],
      searchData: [],
      searchId: null,
      searchType: null,
      count: false
    };
  },
  created() {
    this.fetchAppType();
    this.fetchDate();
    this.fetchDetail();
  },
  watch: {
    $route(val) {
      this.fetchAppType();
      this.fetchDate();
      this.fetchDetail();
    }
  },
  computed: {
    filterLimit() {
      if (this.dateTypeVal === 1) {
        return this.dataLimit;
      } else {
        return this.dataLimit.slice(0, 6);
      }
    }
  },
  methods: {
    fetchDetail() {
      const params = {
        appId: parseInt(this.$route.params.appId),
        // date:
        // this.dateTypeVal === "week" ? this.weekDateVal : this.monthDateVal,
        dateType: this.dateTypeVal,
        type: this.$route.meta.type
      };
      api.channelAppTrend(params).then(res => {
        if (res.data.tableData.length) {
          this.appData = res.data.tableData;
          this.appName = res.data.tableData[0].appName;
          this.categoryName = res.data.tableData[0].categoryName;
          this.weekTotal = res.data.tableData[0].total;
          this.monthTotal = res.data.tableData[1].total;
          this.appTag = res.data.tableData[0].tag;
        }
        // console.log(this.appData)
      });
    },
    submitData() {
      this.currentPage = 1;
      this.count = false;
      this.fetchTableData();
    },
    changeDateType(val) {
      this.dateTypeVal = val;
      api.date(params).then(res => {
        this.options = res.data;
        this.dateVal = res.data[0].value;
      });
    },
    fetchAppType() {
      api.appType().then(res => {
        this.appTypeList = res.data;
      });
    },
    changeDateType(val) {
      this.dateTypeVal = val;
      const params = {
        type: this.dateTypeVal
      };
      api.date(params).then(res => {
        this.options = res.data;
        this.dateVal = res.data[0].value;
      });
    },
    changeDateLimit(val) {
      console.log(val);
    },
    changeDateType(val) {
      this.dateTypeVal = val;
    },
    changeWeek(val) {
      this.dateVal = val;
    },
    changeMonth(val) {
      this.dateVal = val;
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
    fetchTableData() {
      this.loading = true;
      const params = {
        date:
        this.dateTypeVal === "week" ? this.weekDateVal : this.monthDateVal,
        dateType: this.dateTypeVal,
        type: this.$route.meta.type,
        limit: this.dataLimitVal,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderColumn,
        queryType: this.queryType,
        queryId: this.searchId,
        queryType: this.searchType,
        appId: parseInt(this.$route.params.appId)
      };
      api.findAppChannelTrends(params).then(res => {
        this.count = true;
        this.loading = false;
        if (res.data.tableHeader !== null) {
          this.tableHeader = res.data.tableHeader;
        } else {
          this.tableHeader = [];
        }
        if (res.data.tableData !== null) {
          this.tableData = res.data.tableData;
        } else {
          this.tableData = [];
        }
        if (res.data.echarts.xAxis.length) {
          this.chartXAxis = res.data.echarts.xAxis;
        } else {
          this.chartXAxis = [];
        }
        if (res.data.echarts.xAxis.length) {
          this.chartData = res.data.echarts.line;
        } else {
          this.chartData = [];
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
      //   limit: this.dataLimitVal,
      //   pageNo: this.currentPage,
      //   pageSize: this.pageSize,
      //   orderType: this.orderType,
      //   orderColumn: this.orderColumn,
      //   queryId: this.searchId,
      //   queryType: this.searchType,
      //   channelId: parseInt(this.$route.params.appId)
      // }
      var path =
        "http://113.200.91.81/mst/behavior/exportAppChannelTrendExcel?";
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
        this.orderColumn +
        "&" +
        "appId=" +
        parseInt(this.$route.params.appId);

      window.location.href = path + paras;
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
      };
      
    },
    startSearch(item) {
      let type = "";
      if (item.type === "app") {
        type = "appDetail";
      } else {
        type = "storeDetail";
      }
      this.$router.push({
        path: `${this.$route.meta.bread.path}/${type}/${item.id}/${item.name}`
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.count === true) {
        this.fetchTableData();
      }
    },
    changeSort(sort) {
      sort.prop = sort.column ? sort.column.label : "";
      sort.order = sort.order ? sort.order : "descending";
      this.orderColumn = sort.prop;
      this.orderType = sort.order;
      this.fetchTableData();
    }
  }
};
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
      border-bottom: 1px solid #e2e9f3;
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
  .el-table {
    font-size: 12px;
  }
  .appDetail .el-table .link {
    cursor: default !important;
  }
}
</style>
