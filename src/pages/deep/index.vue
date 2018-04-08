<template>
  <div class="wrapper">
    <div class="content">
      <div class="navname" style="margin-top: 25px;">{{ $route.meta.bread.name }}</div>
      <div class="detail-content-menu">
        <el-col :span="24">
          <selectType :data="typeList" v-model="bigType" @change-big-type="changeBigType" @change-small-type="changeSmallType"></selectType>
        </el-col>
        <el-col :span="24">
          <date-picker v-model="dateVal" :limit="dataLimitVal" :type="dateTypeVal" @change-date-type="changeDateType" @change-date-limit="changeDateLimit" @change-date="changeDate" @change-week-date="changeWeekDate" @change-month-date="changeMonthDate" :startDate="startDate" :endDate="endDate">
            <span>
              <el-button type="primary" @click="submitData">确定</el-button>
            </span>
          </date-picker>
        </el-col>
      </div>
      <div class="table-content flowTable">
        <div class="table-content-header">
          <el-button :plain="true" type="primary" @click="downloadData" size="small" class='btn-download'>
            <i class="iconfont icon-download"></i>数据导出</el-button>
        </div>
        <div class="table-content-body " v-loading.table-content-body="loading">
          <!--<trend :tableData="tableData" :tableHeader="tableHeader" @link-page="linkDetail" @change-sort="changeSort" :loading="loading"></trend>-->
          <el-table :data="tableData" style="width: 100%;border-left:none" border stripe>
            <el-table-column width="80" fixed v-if="th.column === 'index'" :label="th.columnName" v-for="th in tableHeader" :key="th.limit">
              <template slot-scope="scope">
                <span v-if="scope.row.index === 1" class="top1">{{ scope.row.index }}</span>
                <span v-if="scope.row.index === 2" class="top2">{{ scope.row.index }}</span>
                <span v-if="scope.row.index === 3" class="top3">{{ scope.row.index }}</span>
                <span v-if="scope.row.index !== 1&& scope.row.index !==2 && scope.row.index !==3" class="topNormal">{{ scope.row.index }}</span>
              </template>
            </el-table-column>
            <el-table-column fixed v-if="th.column === 'name'" :label="th.columnName" v-for="th in tableHeader" :key="th.limit" min-width="250">
              <template slot-scope="scope">
                <div class="link" @click="dialog2Table(scope.row.id)">
                  <span class="logo"><img :src="scope.row.logo" alt=""></span>
                  <span>{{ scope.row.fromAppName }}</span>
                  <i class="iconChart"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed v-if="th.column === 'subCategoryName'" :label="th.columnName" v-for="th in tableHeader" :key="th.limit" width="150">
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.categoryName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" v-if="th.column === 'date'" :label="th.columnName" v-for="th in tableHeader" :key="th.limit">
              <el-table-column header-align="center" :label="sub.columnName" v-for="sub in th.children" :key="sub.columnName" min-width="200">
                <template slot-scope="scope">
                  <span style="display:block;text-align:right">
                    {{ scope.row[sub.column1] }}
                  </span>
                  <span style="display:block;text-align:right">
                    {{ scope.row[sub.column2] !== null ? scope.row[sub.column2].toFixed(3) + '%' : '-' }}
                  </span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <el-dialog title="图表" :visible.sync="dialogTableVisible">
          <span class="chart-date">
            <el-select v-model="dateListVal" placeholder="请选择" @change="changeChart">
              <el-option v-for="item in dateList" :key="item.id" :value="item.id" :label="item.label">
              </el-option>
            </el-select>
          </span>
          <div class="chart-con" v-loading.chart-con="chartloading">
            <bar-chart :data="chartData" :xAxis="chartXAxis" :name="chartTitle"></bar-chart>
          </div>
        </el-dialog>
      </div>
    </div>
    <div :class="clicked? 'blue-class':'red-class'" @click="clicked = !clicked"></div>
  </div>
</template>

<script>
import api from "@/api/api";
import barChart from "@/components/barChart";
// import trend from '@/components/flow'
import selectType from "@/components/appTypeMenu";
import datePicker from "@/components/datePicker";
import search from "@/components/search";

export default {
  name: "detail",
  components: {
    selectType,
    datePicker,
    search,
    barChart
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
      startDate: null,
      endDate: null,
      dataLimitVal: 4,
      clicked: false,
      isShow: true,
      loading: false,
      appTypeList: [],
      checkAll: false,
      checkedAppTypes: [],
      dateList: [],
      ascTableData: [],
      descTableData: [],
      dateVal: "",
      switchVal: false,
      currentPage: 1,
      pageSize: 10,
      orderColumn: "",
      orderType: "descending",
      total: null,
      tableData: [],
      tableHeader: [],
      chartDateList: [],
      chartData: [],
      line: [],
      chartOption: {},
      TopTableDateList: [],
      TopTableDateValue: null,
      channelData: [],
      gridData: [],
      dialogTableVisible: false,
      appId: "",
      chartXAxis: [],
      chartTitle: null,
      chartloading: false,
      count: false,
      dateList: [],
      dateListVal: null
    };
  },
  created() {
    this.fetchAppType();
    this.fetchDate();
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
  watch: {
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
    },
    querySearchAsync() {
      if (this.searchValue !== "") {
        this.searchLoading = true;
        const params = {
          query: this.searchValue,
          type: 0 // 0是商店  1是app
        };
        api.findSearchAppChannel(params).then(res => {
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
    //打开图表框
    dialog2Table(val) {
      this.appId = val; //发送ID
      this.fetchChartsData();
      this.dialogTableVisible = true;
    },
    fetchChartsData() {
      this.chartloading = true;
      // 发送请求
      const params = {
        // 发送请求
        //date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
        date: this.dateListVal,
        appId: this.appId,
        dateType: this.dateTypeVal,
        type: this.$route.meta.type,
        subCategoryId: this.checkedType,
        categoryId: this.bigType === 0 ? null : this.bigType
      };
      api.flowCharts(params).then(res => {
        this.chartloading = false;
        this.chartXAxis = res.data.xAxis;
        this.chartData = res.data.ratios;
        this.chartTitle = res.data.fromAppName;
      });
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
        // 发送请求
        date:
          this.dateTypeVal === "week" ? this.weekDateVal : this.monthDateVal,
        dateType: this.dateTypeVal,
        // dateTimeType: this.dateTypeVal,
        type: this.$route.meta.type,
        limit: this.dataLimitVal,
        subCategoryId: this.checkedType,
        categoryId: this.bigType === 0 ? null : this.bigType,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderColumn
      };
      api.flowTable(params).then(res => {
        this.loading = false;
        this.count = true;
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
        if (res.data.dateTimes !== null) {
          this.dateList = res.data.dateTimes;
          this.dateListVal = res.data.dateTimes[0].id;
        } else {
          this.dateList = [];
          this.dateListVal = [];
        }
        this.total = res.data.tablePage.total;
      });
    },
    // 导出数据
    downloadData() {
      // const params = {
      //   // 发送请求
      //   type: this.$route.meta.type,
      //   date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
      //   dateType: this.dateTypeVal,
      //   limit: this.dataLimitVal,
      //   subCategoryId: this.checkedType,
      //   categoryId: this.bigType === 0 ? null : this.bigType,
      //   pageNo: this.currentPage,
      //   pageSize: this.pageSize,
      //   orderType: this.orderType,
      //   orderColumn: this.orderColumn,
      //   queryId: this.searchId,
      //   queryType: this.searchType
      // }

      var path = "http://113.200.91.81/mst/deep/exportAppDeepsExcel?";
      var paras1 =
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
    changeChart(val) {
      //console.log(val);
      this.dateListVal = val;
      this.fetchChartsData();
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
    startSearch(item) {
      this.searchId = item.id;
      this.searchType = item.type;
      this.searchData = [];
      // this.fetchTableData();
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
    // linkDetail(row) {
    //   this.$router.push({
    //     path: `/downloadTrend/appDetail/${row.id}/${row.name}`
    //   })
    // }
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
  .flowTable {
    .el-table th > .cell {
      border-right: 1px solid #ffffff;
    }
    tr:nth-child(1) > th:nth-child(3) > .cell {
      border-right: none !important;
    }
    tr td:nth-child(3) > .cell {
      text-align: right;
    }
    .el-table .cell {
      line-height: 28px;
    }
  }
}

.tableHeader {
  padding: 10px;
  border: 1px solid #e3ecdf;
  border-bottom: none;
  background: #f9f9f9;
  text-align: left;
}

.iconChart {
  width: 24px;
  height: 24px;
  display: inline-block;
  background: url(../../assets/iconChart.png) no-repeat;
  vertical-align: middle;
  margin: 0 5px;
  float: right;
}

.echarts {
  width: 100% !important;
}
</style>
