<template>
  <el-table :data="tableData" style="width: 100%" border @sort-change="changeSort" v-loading.body="loading">
    <el-table-column width="80" fixed v-if="th.column === 'index'" :label="th.columnName" v-for="th in tableHeader" :key="th.index" :prop="th.column">
    </el-table-column>
    <el-table-column fixed v-if="th.column === 'name'" :label="th.columnName" v-for="th in tableHeader" :key="th.index" min-width="180">
      <template slot-scope="scope">
        <div class="link">
          <span>{{ scope.row.fromAppName }}</span>
          <i class="el-icon-caret-top" @click="dialogTableVisible = true"></i>
        </div>
      </template>
    </el-table-column>
    <el-table-column fixed v-if="th.column === 'subCategoryName'" :label="th.columnName" v-for="th in tableHeader" :key="th.index" min-width="180">
      <template slot-scope="scope">
        <div class="link">
          <span>{{ scope.row.categoryName }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column align="center" :sortable="true" v-if="th.column === 'date'" :label="th.columnName" v-for="th in tableHeader" :key="th.index">
      <el-table-column align="right" min-width="150" :label="sub.columnName" v-for="sub in th.children" :key="sub.column">
        <template slot-scope="scope">
          {{ sub.columnName === '环比(%)' ? (scope.row[sub.column]*100).toFixed(2) + '%' : scope.row[sub.column] }}
          <i class="status-arrow" v-show="sub.columnName !== '环比（%）'" :class="scope.row[sub.status] === 1 ? 'el-icon-caret-top red' : 'el-icon-caret-bottom green'"></i>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'trend-com',
  props: {
    tableData: Array,
    tableHeader: Array,
    loading: {
      default: false,
      type: Boolean
    }
  },
  watch: {
    tableHeader(data) {
      // 切换时间类型排序会保留的bug
      data.map(item => {
        item.limit = item.limit + this.type
      })
    }
  },
  methods: {
    changeSort(sort) {
      this.$emit('change-sort', sort);
    },
    linkDetail(item) {
      this.$emit('link-page', item);
    },

  }
}
</script>

<style>

</style>
