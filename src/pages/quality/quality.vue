<template>
  <div class="wrapper">
    <div class="content">
      <div class="navname">{{ $route.meta.bread.name }}</div>
      <div class="detail-content-menu">
        <el-col :span="24">
          <date-picker v-model="dateVal" :limit="dataLimitVal" :type="dateTypeVal" @change-date-type="changeDateType" @change-date-limit="changeDateLimit" @change-date="changeDate" @change-week-date="changeWeekDate" @change-month-date="changeMonthDate" :startDate="startDate" :endDate="endDate">
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
            <span class="label">趋势图表：</span>
            <el-switch v-model="switchVal" on-text="" off-text="" on-color="#67C72B" off-color="#ccc">
            </el-switch>
          </span>
          <!-- <search @handle-search="handleSearch" :data="searchData" :loading="searchLoading" @search="startSearch"></search> -->
        </div>
        <div class="table-content-body quality" v-loading.table-content-body="loading">
          <el-collapse-transition>
            <trend-chart :show="switchVal" :data="chartData" :xAxis="chartXAxis"></trend-chart>
          </el-collapse-transition>
          <trend :current="currentPage" :type="dateTypeVal" :tableData="tableData" :tableHeader="tableHeader" @change-sort="changeSort" @change-size="handleSizeChange" @change-current="handleCurrentChange" :total="total"></trend>
        </div>
      </div>
    </div>
    <div :class="clicked? 'blue-class':'red-class'" @click="clicked = !clicked"></div>
    <router-view></router-view>
  </div>
</template>

<script>
import api from "@/api/api";
import trendChart from "@/components/trendChart";
import trend from "@/components/trend";
import selectType from "@/components/appTypeMenu";
import datePicker from "@/components/datePicker";
import search from "@/components/search";
export default {
  name: "detail",
  components: {
    trend,
    selectType,
    datePicker,
    search,
    trendChart
  },
  data() {
    return {
      // 搜索
      searchValue: "",
      searchId: "",
      searchLoading: false,
      searchData: [],
      searchId: null,
      searchType: null,

      dateTypeVal: "week",
      weekDateVal: "",
      monthDateVal: "",
      startDate: null,
      endDate: null,
      dataLimitVal: 4,
      clicked: false,
      isShow: true,
      loading: false,
      dateVal: "",
      switchVal: false,
      currentPage: 1,
      pageSize: 10,
      orderColumn: "",
      orderType: "descending",
      total: null,
      tableData: [],
      tableHeader: [],
      chartXAxis: [],
      chartData: [],
      count: false
    };
  },
  created() {
    this.fetchAppType();
    this.init();
  },
  watch: {
    $route() {
      this.init();
    }
  },
  methods: {
    init() {
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
      this.count = false;
      this.fetchDate();
    },
    querySearchAsync() {
      if (this.searchValue !== "") {
        this.searchLoading = true;
        const params = {
          query: this.searchValue,
          type: 0 // 0是商店  1是app
        };
        api.searchData(params).then(res => {
          this.searchData = res.data;

          this.searchLoading = false;
        });
      } else {
        this.searchData = [];
      }
    },
    fetchAppType() {
      api.appType().then(res => {
        res.data.typeList.unshift({ categoryId: 0, label: "全部" });
        this.typeList = res.data.typeList;
      });
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
    fetchTableData() {
      this.loading = true;
      // 发送请求
      const params = {
        // 发送请求
        type: this.$route.meta.type,
        date:
          this.dateTypeVal === "week" ? this.weekDateVal : this.monthDateVal,
        dateType: this.dateTypeVal,
        limit: this.dataLimitVal,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderColumn
      };
      api.findChannelUse(params).then(res => {
        this.loading = false;
        this.count = true;
        this.tableData = res.data.tableData;
        this.tableHeader = res.data.tableHeader;
        this.total = res.data.tablePage.total;
        this.chartXAxis = res.data.echarts.xAxis;
        this.chartData = res.data.echarts.line;
      });
    },
    // 导出数据
    downloadData() {
      //   const params = {
      //   type: this.$route.meta.type,
      //   date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
      //   dateType: this.dateTypeVal,
      //   limit: this.dataLimitVal,
      //   pageNo: this.currentPage,
      //   pageSize: this.pageSize,
      //   orderType: this.orderType,
      //   orderColumn: this.orderColumn,
      // }
      var path =
        "http://113.200.91.81/mst/channelUse/exportChannelUseExcel?";
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
    },
    handleSearch(val) {
      const params = {
        query: val
      };
      if (val !== "") {
        api.findSearchAppChannel(params).then(res => {
          this.searchData = res.data;
        });
      } else {
        this.searchData = [];
      }
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
  .detail-content-menu {
    border: 1px solid #ddd;
    background: #fff;
    overflow: hidden;
    .sub-btn {
      margin: 15px 0 0 0px;
    }

    .select-list {
      &.top {
        border-bottom: 1px solid #ddd;
      }
      .left,
      .right {
        padding: 15px 15px;
        margin: 5px 0;
        > span {
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
        .el-radio:first-child {
          display: block;
        }
        .el-checkbox {
          margin: 5px 15px 5px 0;
        }
        .el-checkbox + .el-checkbox {
          margin: 5px 15px 5px 0;
        }
        .el-checkbox-group {
          display: inline;
          float: left;
        }
        .el-radio {
          margin: 5px 15px 5px 0;
        }
        .el-radio + .el-radio {
          margin: 5px 15px 5px 0;
        }
      }
    }
  }
  .chart-date {
    position: relative !important;
    bottom: 10px !important;
    right: 0px !important;
  }
}

.tableHeader {
  padding: 10px;
  border: 1px solid #e3ecdf;
  border-bottom: none;
  background: #f9f9f9;
}

.quality .el-table .link {
  cursor: default !important;
}
</style>
