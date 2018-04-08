<template>
  <div class="funnelTable">
    <el-table :data="tableData" style="width: 100%;border-left:none" border @sort-change="changeSort" stripe>
      <el-table-column width="80" v-if="th.column === 'index'" :label="th.columnName" v-for="th in tableHeader" :key="th.limit">
        <template slot-scope="scope">
          <span v-if="scope.row.index === 1" class="top1">{{ scope.row.index }}</span>
          <span v-if="scope.row.index === 2" class="top2">{{ scope.row.index }}</span>
          <span v-if="scope.row.index === 3" class="top3">{{ scope.row.index }}</span>
          <span v-if="scope.row.index !== 1 && scope.row.index !==2 && scope.row.index !==3" class="topNormal">{{ scope.row.index }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" v-if="th.column === 'name'" :label="th.columnName" v-for="th in tableHeader" :key="th.limit">
        <template slot-scope="scope">
          <div @click="linkDetail(scope.row)" class="link">
            <span class="logo"><img :src="scope.row.logo" alt=""></span>
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="150" v-if="th.column !== 'name' && th.column !== 'index'" :label="th.columnName" v-for="th in tableHeader" :key="th.limit" :prop="th.column">
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!--<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"  layout="total,  prev, pager, next, jumper" :total="400">
        </el-pagination>-->
  </div>
</template>

<script>
export default {
  name: "radioTrend",
  props: {
    tableData: Array,
    tableHeader: Array,
    showChart: Boolean,
    total: Number,
    current: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: "week"
    }
  },
  data() {
    return {
      radioVal: null,
      currentPage: this.current,
      pageSize: 10,
      orderColumn: "",
      orderType: "descending"
    };
  },
  watch: {
    tableHeader(data) {
      // 切换时间类型排序会保留的bug
      data.map(item => {
        item.limit = item.limit + this.type;
        this.tableData.map(table => {
          if (
            item.columnName === "下载用户数(万)" ||
            item.columnName === "新装用户数(万)" ||
            item.columnName === "活跃用户数(万)"
          ) {
            if (table[item.column] !== null) {
              table[item.column] = table[item.column].toFixed(3);
            } else {
              table[item.column] = "-";
            }
          }
          if (item.columnName === "环比(%)") {
            if (table[item.column] !== null) {
              table[item.column] =
                Number(table[item.column] * 100).toFixed(3) + "%";
            } else {
              table[item.column] = "-";
            }
          }
        });
      });
    },
    current(val) {
      this.currentPage = val;
    }
  },
  methods: {
    changeSort(sort) {
      this.$emit("change-sort", sort);
    },
    linkDetail(item) {
      this.$emit("link-page", item);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit("change-size", val);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$emit("change-current", val);
    }
  }
};
</script>

<style>

</style>
