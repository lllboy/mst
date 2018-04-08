<template>
  <div class="table-content-body">
    <el-table :data="tableData" style="width: 100%" border @sort-change="changeSort" v-loading.body="loading">
      <!-- <el-table-column label="操作" width="50">
        <template scope="scope">
          <el-radio class="radio" v-model="radioVal" :label="scope.row.id"></el-radio>
        </template>
      </el-table-column> -->
      <el-table-column width="80" v-if="th.column === 'index'" :label="th.columnName" v-for="th in tableHeader" :key="th.index" :prop="th.column">
      </el-table-column>
      <el-table-column width="180" v-if="th.column === 'name'" :label="th.columnName" v-for="th in tableHeader" :key="th.index">
        <template slot-scope="scope">
          <div @click="linkDetail(scope.row)" class="link">
            <span class="logo"><img :src="scope.row.logo" alt=""></span>
            <span>{{ scope.row.channel_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  v-if="th.column === 'download'" :label="th.columnName" v-for="th in tableHeader" :key="th.index">
        <template slot-scope="scope">
          <div  class="link">
            <span>{{ scope.row.download_volume }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  v-if="th.column === 'percent1'" :label="th.columnName" v-for="th in tableHeader" :key="th.index">
        <template slot-scope="scope">
          <div  class="link">
            <span>{{ scope.row.ex }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  v-if="th.column === 'install'" :label="th.columnName" v-for="th in tableHeader" :key="th.index">
        <template slot-scope="scope">
          <div  class="link">
            <span>{{ scope.row.install_volume }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  v-if="th.column === 'percent2'" :label="th.columnName" v-for="th in tableHeader" :key="th.index">
        <template slot-scope="scope">
          <div  class="link">
            <span>{{ scope.row.ex1 }}</span>
          </div>
        </template>
      </el-table-column>
       <el-table-column  v-if="th.column === 'active'" :label="th.columnName" v-for="th in tableHeader" :key="th.index">
        <template slot-scope="scope">
          <div  class="link">
            <span>{{ scope.row.active_volume }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  v-if="th.column === 'percent3'" :label="th.columnName" v-for="th in tableHeader" :key="th.index">
        <template slot-scope="scope">
          <div  class="link">
            <span>{{ scope.row.ex2 }}</span>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column :sortable="true" v-if="th.column === 'date'" :label="th.columnName" v-for="th in tableHeader" :key="th.index">
        <template scope="scope">
          <span>{{ scope.row[th.columnData] }}</span>
        </template>
     </el-table-column>-->
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import option from '@/echarts/echartTooltip'
import { formatLegend } from '@/echarts/echartFormat'
import ECharts from 'vue-echarts/components/ECharts.vue'
import theme from '@/echarts/theme.json'
ECharts.registerTheme('irs', theme)
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/chart/funnel'
export default {
  name: 'radioTrend',
  components: {
    ECharts
  },
  props: {
    tableData: [Array],
    tableHeader: Array,
    loading: {
      default: false,
      type: Boolean
    },
    showChart: Boolean,
    total: Number,
    chartOption: Object,
    checked: [String, Number]
  },
  data() {
    return {
      radioVal: null,
      presentVal: null,
      currentPage: 1,
      pageSize: 10,
      orderColumn: '',
      orderType: 'descending'
    }
  },
  watch: {
    checked(val){
      this.radioVal = val;
    }
  },
  methods: {
    changeSort(sort) {
      this.$emit('change-sort', sort);
    },
    linkDetail(item) {
      this.$emit('link-page', item);
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.$emit('change-size', val);
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.$emit('change-current', val);
    },
    changeEchart(val){
      this.radioVal = val;
      this.$emit('change-echart', val);
    }
  }
}
</script>

<style>

</style>
