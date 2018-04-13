<template>
  <div class="wrapper">
    <div class="content" style="margin-top: 0px;">
      <div class="navname" style="margin-top: 25px;">渠道中APP{{ $route.meta.bread.name }}</div>
      <div class="detail-content-menu">
        <el-col :span="24">
          <selectType :data="typeList" v-model="bigType" @change-big-type="changeBigType" @change-small-type="changeSmallType"></selectType>
        </el-col>
        <el-col :span="24">
          <date-picker v-model="dateVal" :limit="dataLimitVal" :type="dateTypeVal" @change-date-type="changeDateType" @change-date-limit="changeDateLimit" @change-date="changeDate" @change-week-date="changeWeekDate" @change-month-date="changeMonthDate" :startDate="startDate" :endDate="endDate" :show-limit="false">
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
              <el-collapse-transition>
                <div v-show="switchVal" :class="flag === true ? ' chartsBox1 ' : ' chartsBox '">
                  <el-row :gutter="10">
                    <el-col :lg="12">
                      <div class="grid-content bg-purple">
                        <div style="text-align: right;position: absolute;right: 88px;top:50%;">
                          <span class="chart-date">
                            <span class="present">当前渠道</span>
                            <el-select v-model="appId" placeholder="请选择" @change="changeFunnel">
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
                          <funnel-charts :data="chartData" :funnelData="funnelData" :show="switchVal"></funnel-charts>
                        </div>
                      </div>
                    </el-col>
                  </el-row>

                </div>
              </el-collapse-transition>
            </div>
          </el-collapse-transition>
          <radioTrend :current="currentPage" :type="dateTypeVal" :tableData="tableData" :tableHeader="tableHeader" @link-page="linkDetail" @change-sort="changeSort" :checked="checked" @change-size="changeSize" @change-current="changeCurrent" :total="total"></radioTrend>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'
import funnelCharts from '@/components/funnelChart'
import selectType from '@/components/appTypeMenu'
import radioTrend from '@/components/radioTrend'
import datePicker from '@/components/datePicker'
import search from '@/components/search'
export default {
  name: 'funnelDetail',
  components: {
    funnelCharts,
    radioTrend,
    selectType,
    datePicker,
    search
  },
  data() {
    return {
      searchValue: '',
      searchData: [],
      searchId: null,
      searchType: null,
      searchLoading: false,
      // 类别选择
      bigType: 0,
      typeList: [],
      clicked: false,
      isShow: true,
      loading: false,
      searchValue: '',
      appTypeList: [],
      checkAll: false,
      checkedAppTypes: [],
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
      ascTableData: [],
      desTableData: [],
      dateVal: '',
      switchVal: false,
      currentPage: 1,
      pageSize: 10,
      orderColumn: '',
      orderType: 'descending',
      total: null,
      tableData: [],
      tableHeader: [],
      chartDateList: [],
      chartData: [],
      funnelData: {},
      channelData: {},
      checked: '',
      // 转化率
      conversionData: {},
      rankLoading: false,
      ascTableData: [],
      descTableData: [],
      appId: null,
      flag: false
    }
  },
  created() {
    this.fetchAppType();
    this.fetchDetail();
    this.fetchDate();
    this.fetchTop();
  },
  watch: {
    // 这里观察已选的id  并过滤table里对应id和已选id一样的
    checked(val) {
      this.echartsData = this.tableData.filter(item => {
        item.id === val

      })
    }
  },
  computed: {
    filterLimit() {
      if (this.dateTypeVal === 1) {
        return this.dataLimit
      } else {
        return this.dataLimit.slice(0, 6)
      }
    }
  },
  methods: {
    init() {
      this.flag = false;
    },
    querySearchAsync() {
      if (this.searchValue !== '') {
        this.searchLoading = true;
        const params = {
          query: this.searchValue,
          type: 0 // 0是商店  1是app
        }
        api.searchData(params).then(res => {
          this.searchData = res.data;

          this.searchLoading = false;
        })
      } else {
        this.searchData = [];
      }
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
    fetchTop() {
      const params = {
        channelId: parseInt(this.$route.params.storeId),
        date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
        dateType: this.dateTypeVal,
      }
      this.rankLoading = true;
      api.funnelRanks(params).then(res => {
        this.ascTableData = res.data.asc;
        this.descTableData = res.data.desc;
        this.rankLoading = false;
      })
    },
    changeFunnel(val) {
      this.appId = val
      //console.log(this.tableData[0].id);
      // this.fetchTop();
      this.fetchSelect();
    },
    fetchDetail() {
      const params = {
        date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
        dateType: this.dateTypeVal,
        channelId: parseInt(this.$route.params.storeId),
      }
      this.rankLoading = true;
      api.funnelRanksDetail(params).then(res => {
        this.channelData = res.data.tableData[0];
        this.rankLoading = false;
      })
    },
    fetchDate() {
      const params = {
        type: this.dateTypeVal
      }
      // api.date(params).then(res => {
      //   this.dateList = res.data;
      //   this.weekVal = res.data[0].value;
      //   this.monthVal = res.data[0].value;
      // })
      this.fetchTableData();
    },
    fetchAppType() {
      api.appType().then(res => {
        res.data.typeList.unshift({ categoryId: 0, label: '全部' });
        this.typeList = res.data.typeList;
      })
    },
    changeBigType(val) {
      this.bigType = val;
    },
    changeSmallType(data) {
      console.log(data)
      this.checkedType = data;
    },
    // 上升和下降前三名

    changeDateType(val) {
      this.dateTypeVal = val;
    },
    changeWeek(val) {
      this.dateVal = val
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
      this.weekDateVal = val.replace(/\-/g, '');
    },
    changeMonthDate(val) {
      this.monthDateVal = val.replace(/\-/g, '');
    },
    fetchDate() {
      api.date().then(res => {
        this.dateVal = res.data.end;
        this.startDate = res.data.start
        this.endDate = res.data.end
        this.fetchTableData();
      })
    },
    fetchTableData() {
      this.loading = true;
      const params = {
        date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
        dateType: this.dateTypeVal,
        type: this.$route.meta.type,
        subCategoryId: this.checkedType,
        categoryId: this.bigType === 0 ? null : this.bigType,
        limit: this.dataLimitVal,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderColumn,
        channelId: this.$route.params.storeId,
      }
      api.findChannelAppUse(params).then(res => {
        this.loading = false;
        this.count = true;
        if (res.data.tableHeader !== null) {
          this.tableHeader = res.data.tableHeader;
        } else {
          this.tableHeader = []
        }
        if (res.data.tableData !== null) {
          this.tableData = res.data.tableData;
          this.flag = false;
        } else {
          this.tableData = [];
        }
        this.total = res.data.tablePage.total;
        if (res.data.tableData && res.data.tableData.length) {
          this.appId = res.data.tableData[0].id
        }
        else {
          this.appId = null;
          this.flag = true;
        }
        const params = {
          channelId: parseInt(this.$route.params.storeId),
          type: this.$route.meta.type,
          date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
          dateType: this.dateTypeVal,
        }
        // this.fetchSelect();
      })
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
      var path = "http://113.200.91.81/mst/funnel/ExcelSecond?";
      var paras1 = "type=" + "this.$route.meta.type" + "&" +
        "date=" + (this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal) + "&" +
        "dateType=" + this.dateTypeVal + "&" +
        "limit=" + this.dataLimitVal + "&"
      var paras2 = "subCategoryId=" + this.checkedType + "&" +
        "categoryId=" + (this.bigType === 0 ? null : this.bigType) + "&"

      var paras3 = "pageNo=" + this.currentPage + "&" +
        "pageSize=" + this.pageSize + "&" +
        "orderType=" + this.orderType + "&" +
        "orderColumn=" + this.orderColumn + "&" +
        "channelId=" + parseInt(this.$route.params.storeId)
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
      // this.fetchTop();
      this.fetchSelect();
      console.log(this.flag);
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
    fetchSelect() {
      const params = {
        dateType: this.dateTypeVal,
        type: 'app',
        date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
        channelId: parseInt(this.$route.params.storeId),
        appId: this.appId,
      }
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
      })
    },
    linkDetail(row) {
      this.$router.push({
        path: `${this.$route.meta.bread.path}/appDetail/${this.$route.params.storeId}/${row.id}/${row.name}`
      })
    }
  }
}
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
        .el-radio:first-child {
          display: block;
        }
        .el-radio+.el-radio {
          margin: 5px 15px 5px 0;
        }
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
  .chart {
    // overflow: hidden;
  }
}

.conversion {
  position: absolute;
  right: 0px;
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

.present {
  padding: 6px 20px;
  border: 1px solid #E5E5E5;
  margin-right: -4px;
  border-right: none;
  vertical-align: middle;
  background: #F9F9F9;
  line-height: 29px;
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

.tableHeader {
  padding: 10px;
  border: 1px solid #E2E9F3;
  border-bottom: none;
  background: #F9F9F9;
  text-align: left;
}

.topTable {
  .is-leaf,
  td {
    text-align: center !important;
  }
  .el-table th.is-leaf,
  .el-table td {
    border: none;
    border-right: 1px solid #E1EAF3;
    height: 36px;
  }
  .el-table th>.cell {
    background: #ffffff;
    border-bottom: 1px solid #E2E9F3;
    color: #64748a;
  }
}

.chartsBox1 {
  //display: none; 
  visibility: hidden;
}

@media only screen and (min-width: 1366px) {
  .chartsBox {
    width: 1100px;
    margin: 0 auto;
  }
}
</style>
