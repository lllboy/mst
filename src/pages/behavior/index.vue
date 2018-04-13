<template>
  <div class="wrapper">
    <div class="content">
      <div class="navname">{{ $route.meta.bread.name }}</div>
      <div class="menu">
        <date-picker v-model="dateVal" :limit="dataLimitVal" :type="dateTypeVal" @change-date-type="changeDateType" @change-date-limit="changeDateLimit" @change-date="changeDate" @change-week-date="changeWeekDate" @change-month-date="changeMonthDate" :startDate="startDate" :endDate="endDate">
          <span>
            <el-button type="success" @click="submitData">确定</el-button>
          </span>
        </date-picker>
      </div>
      <div class="table-content">
        <div class="table-content-body" v-loading.body="loading">
          <el-collapse-transition>
            <trend-chart :show="switchVal" :data="chartData" :xAxis="chartXAxis"></trend-chart>
          </el-collapse-transition>
          <trend :current="currentPage" :type="dateTypeVal" :tableData="tableData" :tableHeader="tableHeader" @link-page="linkDetail" @change-sort="changeSort" @change-size="handleSizeChange" @change-current="handleCurrentChange" :total="total"></trend>
          <div class="table-content-header">
          <el-button :plain="true" type="primary" @click="downloadData" size="small" class='btn-download'>
            <i class="iconfont icon-download"></i>数据导出
          </el-button>
          <!-- <span>
            <span class="label">趋势图表：</span>
            <el-switch v-model="switchVal" on-text="" off-text="" on-color="#67C72B" off-color="#ccc">
            </el-switch>
          </span> -->

        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'
import trend from '@/components/trend'
import datePicker from '@/components/datePicker'
import search from '@/components/search'
import trendChart from '@/components/trendChart'

export default {
  name: 'download',
  components: {
    trend,
    datePicker,
    search,
    trendChart
  },
  data() {
    return {
      loading: false,
      searchValue: '',
      dateTypeVal: 'week',
      startDate: null,
      endDate: null,
      dataLimitVal: 4,
      dateVal: '',
      weekDateVal: '',
      monthDateVal: '',
      switchVal: false,
      currentPage: 1,
      pageSize: 10,
      orderColumn: '',
      orderType: 'descending',
      total: null,
      tableData: [],
      tableHeader: [],
      chartData: [],
      chartXAxis: [],
      searchData: [],
      searchId: null,
      searchType: null,
      searchLoading: false,
      count: false,
    }
  },
  created() {

    this.fetchDate();

  },
  computed: {
    filterData() {
      const val = this.inputVal
      if (val) {
        return this.mediaList.filter(function(data) {
          return Object.keys(data).some(function(key) {
            return String(data[key]).toLowerCase().indexOf(val) > -1
          })
        })
      }
      return this.mediaList
    }
  },
  watch: {
    $route() {
      this.init();
    }
  },
  methods: {
    // 初始化数据
    init() {
      this.count = false;
      this.switchVal = false;
      this.dateTypeVal = 'week';
      this.dataLimitVal = 4;
      this.currentPage = 1;
      this.pageSize = 10;
      this.orderType = 'descending';
      this.orderColumn = '';
      this.weekDateVal = '';
      this.monthDateVal = '';
      this.tableHeader = [];
      this.fetchDate();
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

    // 获取日期数据
    fetchDate() {
      api.date().then(res => {
        this.dateVal = res.data.end;
        this.startDate = res.data.start
        this.endDate = res.data.end
        this.fetchTableData();
      })
    },
    // 获取表格数据
    fetchTableData() {
      this.loading = true;
      // 请求参数
      const params = {
        // 发送请求
        date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
        dateType: this.dateTypeVal,
        type: this.$route.meta.type,
        limit: this.dataLimitVal,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderColumn
      }
      api.downloadTrend(params).then(res => {
        this.loading = false;
        this.count = true;
        if (res.data.tableHeader !== null) {
          this.tableHeader = res.data.tableHeader;
        } else {
          this.tableHeader = []
        }
        if (res.data.tableData !== null) {
          this.tableData = res.data.tableData;
        } else {
          this.tableData = []
        }
        if (res.data.echarts.xAxis.length) {
          this.chartXAxis = res.data.echarts.xAxis;
        } else {
          this.chartXAxis = []
        }
        if (res.data.echarts.xAxis.length) {
          this.chartData = res.data.echarts.line;
        } else {
          this.chartData = []
        }
        this.total = res.data.tablePage.total;
      })
    },
    submitData() {
      this.count = false;
      this.currentPage = 1;
      this.fetchTableData();
    },
    // 导出数据
    downloadData() {
      var path = "http://113.200.91.81/mst/behavior/exportTrendExcel?";
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
    handleSearch(val) {
      if (val.length) {
        this.searchData.filter(item => {

        })
      }
     
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
      sort.order = (sort.order ? sort.order : 'descending');
      this.orderColumn = sort.prop;
      this.orderType = sort.order;
      this.fetchTableData();
    },
    linkDetail(row) {
      console.log(row)
      this.$router.push({
        path: `${this.$route.meta.bread.path}/storeDetail/${row.id}/${row.name}`
      })
    }
  }
}
</script>

<style lang="less">
   .el-radio-button__orig-radio:checked+.el-radio-button__inner{
     background: #67c23a;
   }
   .el-tabs--border-card>.el-tabs__header .el-tabs__item:hover {
    color: #67c23a;
}
.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
  color: #67c23a;
}
</style>
