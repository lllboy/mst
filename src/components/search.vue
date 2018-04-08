<template>
  <span class="search">
    <el-input v-model.trim="searchValue" placeholder="输入您要查找的渠道或APP名称......" icon="search" @change="changeSearch"></el-input>
    <transition name="el-zoom-in-top">
      <ul class="search-list" v-show="showMenu">
        <span v-if="filterData && filterData.length === 0" style="padding:0 10px">无匹配结果</span>
        <li v-for="item in filterData" :key="item.name" @click="selectItem(item)">{{ item.name }}</li>
      </ul>
    </transition>
  </span>
</template>

<script>
export default {
  name: 'search',
  props: {
    data: Array
  },
  data() {
    return {
      searchValue: '',
      showMenu: false
    }
  },
  computed: {
    filterData() {
      const val = this.searchValue;
      if (val) {
        return this.data.filter(item => {
          return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
        })
      }
      return this.data
    }
  },
  methods: {
    changeSearch(val) {
      if (val.length) {
        this.showMenu = true;
      } else {
        this.showMenu = false;
      }
    },
    selectItem(item) {
      // this.searchValue = 'item.name';
      this.searchValue = '';
      this.$emit('search', item);
      this.showMenu = false;
    }
  }
}
</script>

<style lang="less">
.search {
  position: relative;
  z-index: 1999;
  .search-list {
    max-height: 300px;
    position: absolute;
    padding: 5px 0;
    background: #fff;
    top: 35px;
    left: 0;
    width: 100%;
    border: 1px solid #eee;
    box-shadow: 0 2px 6px #ccc;
    overflow-y: auto;
    li {
      list-style-type: none;
      line-height: 30px;
      padding: 0 15px;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
