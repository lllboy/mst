<template>
  <el-table :data="tableData" style="width: 100%" border @sort-change="changeSort" v-loading.body="loading" class="bigTable">
    <el-table-column width="80" v-if="th.column === 'index'" :label="th.columnName" v-for="th in tableHeader" :key="th.index" :prop="th.column">
    </el-table-column>
    <el-table-column width="200" v-if="th.column === 'name'" :label="th.columnName" v-for="th in tableHeader" :key="th.index">
      <template slot-scope="scope">
        <div @click="linkDetail(scope.row)" class="link">
          <span class="logo"><img :src="scope.row.logo" alt=""></span>
          <span>{{ scope.row.name }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column :sortable="true" v-if="th.column === 'date'" :label="th.columnName" v-for="th in tableHeader" :key="th.index">
      <template slot-scope="scope">
        <span>{{ scope.row[th.columnData] }}</span>
        <i class="status-arrow" :class="scope.row[th.status] === 1 ? 'el-icon-caret-top red' : 'el-icon-caret-bottom green'"></i>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'simpleTrend',
  props: {
    tableData: [Array],
    tableHeader: Array,
    loading: {
      default: false,
      type: Boolean
    },

  },
  methods: {
    changeSort(sort) {
      this.$emit('change-sort', sort);
    },
    linkDetail(item) {
      this.$emit('link-page', item);
    },
    tableHeader(data) {
      // 切换时间类型排序会保留的bug
      data.map(item => {
        item.limit = item.limit + this.type
      })
    }
  }
}
</script>

<style>

</style>
