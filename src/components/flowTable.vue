<template>
  <div class="bigTable">
    <el-table :data="tableData" style="width: 100%;border-left:none" border @sort-change="changeSort" v-loading.body="loading" stripe>
      <el-table-column width="80" fixed v-if="th.column === 'index'" :label="th.columnName" v-for="th in tableHeader" :key="th.index" :prop="th.column">
      </el-table-column>
      <el-table-column width="200" fixed v-if="th.column === 'appName'" :label="th.columnName" v-for="th in tableHeader" :key="th.index">
        <template slot-scope="scope">
          <div @click="linkDetail(scope.row)" class="link">
            <span class="logo"><img :src="scope.row.logo" alt=""></span>
            <span>{{ scope.row.appName }}</span>
            <el-button icon="view" type="text"></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" fixed v-if="th.column === 'categoryName'" :label="th.columnName" v-for="th in tableHeader" :key="th.index" :prop="th.column">
      </el-table-column>
      <el-table-column align="center" :sortable="true" v-if="th.column === 'date'" :label="th.columnName" v-for="th in tableHeader" :key="th.index">
        <el-table-column align="right" width="150" :label="sub.columnName" v-for="sub in th.children" :key="sub.column">
          <el-table-column align="right" width="150" :label="sub.columnName" v-for="sub in th.children" :key="sub.column">
            <template slot-scope="scope">
              <span> {{scope.row[sub.column] }}</span>
              </br>
              <span> {{(scope.row.date1ratio1*100).toFixed(2) + '%' }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>

    </el-table>
  </div>
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
