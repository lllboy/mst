<template>
  <div class="wrapper">
    <div class="content">
      <div class="navname">{{ $route.meta.bread.name }}</div>
      <div class="detail-content-menu">
        <el-col :span="24">
          <selectType :data="typeList" v-model="bigType" @change-big-type="changeBigType" @change-small-type="changeSmallType"></selectType>
        </el-col>
        <el-col :span="24">
          <date-picker v-model="dateVal" :limit="dataLimitVal" :type="dateTypeVal" @change-date-type="changeDateType" @change-date-limit="changeDateLimit" @change-date="changeDate" @change-week-date="changeWeekDate" @change-month-date="changeMonthDate" :startDate="startDate" :endDate="endDate">
            <span>
              <el-button type="primary" @click="submitData(1)">确定</el-button>
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
          <!-- <search @handle-search="handleSearch" :data="searchData" @search="startSearch"></search> -->
        </div>
        <div class="table-content-body appDetail" v-loading.table-content-body="loading">
          <el-collapse-transition>
            <trend-chart :show="switchVal" :data="chartData" :xAxis="chartXAxis"></trend-chart>
          </el-collapse-transition>
          <trend :current="currentPage" :type="dateTypeVal" :tableData="tableData" :tableHeader="tableHeader" @change-sort="changeSort"  @change-current="handleCurrentChange" @change-size="handleSizeChange" :total="total"></trend>
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
      // 类别选择
      bigType: 0,
      typeList: [],
      dateTypeVal: "week",
      weekDateVal: "",
      monthDateVal: "",
      startDate: null,
      endDate: null,
      dataLimitVal: 4,
      clicked: false,
      isShow: true,
      loading: false,
      appTypeList: [],
      checkAll: false,
      checkedType: "",
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
      channelData: [],
      count: false
    };
  },
  created() {
    this.fetchAppType();
    this.fetchDate();
  },
  methods: {
    fetchAppType() {
      api.appType().then(res => {
        res.data.typeList.unshift({ categoryId: 0, label: "全部" });
        this.typeList = res.data.typeList;
      });
    },
    changeBigType(val) {
      this.bigType = val;
    },
    changeSmallType(data) {
      this.checkedType = data;
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
      // 发送请求
      const params = {
        // 发送请求
        date:
          this.dateTypeVal === "week" ? this.weekDateVal : this.monthDateVal,
        dateType: this.dateTypeVal,
        limit: this.dataLimitVal,
        subCategoryId: this.checkedType,
        categoryId: this.bigType === 0 ? null : this.bigType,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderColumn,
        queryId: this.searchId,
        queryType: this.searchType
      };
      api.unloadTable(params).then(res => {
        this.count = true;
        this.loading = false;
        this.tableData = res.data.tableData;
        this.tableHeader = res.data.tableHeader;
        this.total = res.data.tablePage.total;
        this.chartXAxis = res.data.echarts.xAxis;
        this.chartData = res.data.echarts.line;
        const filter = this.tableHeader.filter(item => {
          return item.column === "date";
        });
        const dateList = filter.map(({ columnName }) => columnName);
        this.TopTableDateValue = dateList[0];
      });
    },
    // 导出数据
    downloadData() {
      // const params = {
      //   // 发送请求
      //   date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
      //   dateType: this.dateTypeVal,
      //   type: uninstall,
      //   limit: this.dataLimitVal,
      //   pageNo: this.currentPage,
      //   pageSize: this.pageSize,
      //   orderType: this.orderType,
      //   orderColumn: this.orderColumn
      // }
      var path = "http://113.200.91.81/mst/behavior/Excel?";
      var paras1 =
        "type=" +
        "uninstall" +
        "&" +
        "date=" +
        (this.dateTypeVal === "week" ? this.weekDateVal : this.monthDateVal) +
        "&" +
        "dateType=" +
        this.dateTypeVal +
        "&" +
        "limit=" +
        this.dataLimitVal +
        "&";
      var paras2 =
        "subCategoryId=" +
        this.checkedType +
        "&" +
        "categoryId=" +
        (this.bigType === 0 ? null : this.bigType) +
        "&";

      var paras3 =
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
      // "queryId=" + this.searchId + "&" +
      // "queryType=" + this.searchType;
      // window.location.href = path + paras1 + paras2 + paras3;

      if (this.bigType == 0) {
        window.location.href = path + paras1 + paras3;
      } else {
        window.location.href = path + paras1 + paras2 + paras3;
      }
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
        api.searchData(params).then(res => {
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
      sort.order = sort.order ? sort.order : "descending";
      this.orderColumn = sort.prop;
      this.orderType = sort.order;
      this.fetchTableData();
    },
    linkDetail(row) {
      this.$router.push({
        path: `/downloadTrend/appDetail/${this.$route.params.storeId}/${this
          .$route.params.storeName}/${row.id}/${row.name}`
      });
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

.appDetail .el-table .link {
  cursor: default !important;
}
</style>
