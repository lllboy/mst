<template>
  <div class="wrapper">
    <div class="content" style="margin-top:0">
      <div class="navname" style="margin-top: 25px;">渠道中APP{{ $route.meta.bread.name }}</div>
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
        <div class="table-content-body" v-loading.table-content-body="loading">
          <el-collapse-transition>
            <div class="chart" v-show="switchVal">
              <div class="ir-border" :data="channelData" style="padding:15px;text-align:center;margin-bottom:20px">
                <el-row>
                  <el-col :span="8">
                    <span class="ir-span">本{{ dateTypeVal === "week" ? '周' : '月' }}
                      <em class="ir-green">{{channelData.channelName}} </em>
                      <em>
                        {{channelData.rankTrend === 1 ? '上升':'下降'}}
                        <i :class="channelData.rankTrend ===1? 'iconfont icon-shangsheng-shixin green':'iconfont icon-xiajiang-shixin red'"></i>
                      </em>
                    </span>
                  </el-col>
                  <el-col :span="8">
                    <span class="ir-span">本{{ dateTypeVal ==="week" ? '周' : '月' }}排名：
                      <em>{{channelData.thisWeekRank}}</em>
                    </span>
                  </el-col>
                  <el-col :span="8">
                    <span class="ir-span">上{{ dateTypeVal === "week" ? '周' : '月' }}排名：
                      <em>{{channelData.lastWeekRank}}</em>
                    </span>
                  </el-col>
                </el-row>
              </div>
              <el-col :span="24">
                <div style="position:relative;padding:20px 0;">
                  <trend-chart :show="switchVal" :data="chartData" :xAxis="chartXAxis"></trend-chart>
                </div>
              </el-col>
              <!--<el-col :span="10" style="padding: 0 0 0 20px; text-align: center" class="topTable">
                <div class="changeTime">
                  <span>时间选择：</span>
                  <span class="chart-date">
                    <el-select v-model="dateListVal" placeholder="请选择" @change="changeTop">
                      <el-option v-for="item in dateList" :key="item.id" :value="item.id" :label="item.label">
                      </el-option>
                    </el-select>
                  </span>
                </div>
                <div class="tableHeader">
                  <i class='iconfont icon-shangsheng-shixin red'></i>本{{ dateTypeVal === "week" ? '周' : '月' }}上升前三名</div>
                <el-table :data="rankTableData.asc" style="width: 100%;" v-loading.body="rankLoading">
                  <el-table-column label="APP名称">
                    <template slot-scope="scope">
                      {{ scope.row.name}}
                    </template>
                  </el-table-column>
                  <el-table-column label="本周指数">
                    <template slot-scope="scope">
                      {{ scope.row.thisIndex.toFixed(3)}}
                    </template>
                  </el-table-column>
                  <el-table-column label="上周指数">
                    <template slot-scope="scope">
                      {{ scope.row.lastIndex.toFixed(3)}}
                    </template>
                  </el-table-column>
                </el-table>
                <div class="tableHeader" style="border-top:none;">
                  <i class='iconfont icon-xiajiang-shixin green'></i>本{{ dateTypeVal === "week" ? '周' : '月' }}下降前三名</div>
                <el-table :data="rankTableData.desc" style="width: 100%;margin-bottom:20px" v-loading.body="rankLoading">
                  <el-table-column label="APP名称">
                    <template slot-scope="scope">
                      {{ scope.row.name}}
                    </template>
                  </el-table-column>
                  <el-table-column label="本周指数">
                    <template slot-scope="scope">
                      {{ scope.row.thisIndex.toFixed(3)}}
                    </template>
                  </el-table-column>
                  <el-table-column label="上周指数">
                    <template slot-scope="scope">
                      {{ scope.row.lastIndex.toFixed(3)}}
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>-->
            </div>
          </el-collapse-transition>
          <trend :current="currentPage" :type="dateTypeVal" :tableData="tableData" :tableHeader="tableHeader" @link-page="linkDetail" @change-sort="changeSort" @change-size="handleSizeChange" @change-current="handleCurrentChange" :total="total"></trend>
        </div>
      </div>
    </div>
    <div :class="clicked ? 'blue-class':'red-class'" @click="clicked = !clicked"></div>
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
      dateList: [],
      dateListVal: null,
      channelData: {},
      rankTableData: {},
      rankLoading: false,
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
  methods: {
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
    fetchDetail() {
      const params = {
        date:
          this.dateTypeVal === "week" ? this.weekDateVal : this.monthDateVal,
        dateType: this.dateTypeVal,
        type: this.$route.meta.type,
        channelId: parseInt(this.$route.params.storeId),
        limit: 2
      };
      api.getChannelTrend(params).then(res => {
        if (res.data.tableData && res.data.tableData.length) {
          this.channelData = res.data.tableData[0];
        }
      });
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
        subCategoryId: this.checkedType,
        categoryId: this.bigType === 0 ? null : this.bigType,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderColumn,
        queryId: this.searchId,
        queryType: this.searchType,
        channelId: parseInt(this.$route.params.storeId)
      };
      api.findChannelAppTrends(params).then(res => {
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
      //   queryType: this.searchType,
      //   channelId: parseInt(this.$route.params.storeId)
      // }
      var path =
        "http://113.200.91.81/mst/behavior/exportChannelAppTrendExcel?";
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
        this.orderColumn +
        "&" +
        "channelId=" +
        parseInt(this.$route.params.storeId);
      // "queryId=" + this.searchId + "&" +
      // "queryType=" + this.searchType;
      // window.location.href = path + paras1 + paras2 + paras3;

      if (this.bigType == 0) {
        window.location.href = path + paras1 + paras3;
      } else {
        window.location.href = path + paras1 + paras2 + paras3;
      }
    },
    fetchTop() {
      const params = {
        channelId: parseInt(this.$route.params.storeId),
        type: this.$route.meta.type,
        date: this.dateListVal,
        dateType: this.dateTypeVal
      };
      this.rankLoading = true;
      api.storeRank(params).then(res => {
        this.rankTableData = res.data;
        this.rankLoading = false;
      });
    },
    changeTop(val) {
      this.dateListVal = val;
      this.fetchTop();
    },
    submitData() {
      this.count = false;
      this.currentPage = 1;
      this.fetchTableData();
      this.fetchDetail();
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
    },
    linkDetail(row) {
      this.$router.push({
        path: `${this.$route.meta.bread.path}/appDetail/${row.id}/${row.name}`
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
    width: 100%;
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
  background: #f9f9f9; // margin-top: 20px;
  text-align: left;
}

.topTable {
  .is-leaf,
  td {
    text-align: center !important;
  }
  .el-table th.is-leaf {
    border-bottom: 1px solid #e1eaf3 !important;
  }
  .el-table th.is-leaf,
  .el-table td {
    border: none;
    border-right: 1px solid #e1eaf3;
    height: 36px;
    background: #ffffff;
  }
  .el-table th > .cell {
    background: #ffffff;
    color: #64748a;
  }
}

.changeTime {
  text-align: left;
  margin-bottom: 10px;
  .el-input__inner {
    border-radius: 0;
    border: none;
    width: 210px;
  }
}
</style>
