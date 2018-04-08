<template>
  <div>
    <div class="select-list top">
      <div class="left">
        APP类别
      </div>
      <div class="right">
        <div>
          <el-radio-group v-model="bigType">
            <el-radio-button v-for="item in data" :label="item.categoryId" :value="item.categoryId" :key="item.categoryId">{{ item.label }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="select-list top" v-show="bigType !== 0">
      <div class="left">
        
      </div>
      <div class="right">
        <div>
          <el-checkbox-button v-model="checkAll" @change="selectAllType(checkAll)" style="float:left">全选</el-checkbox-button>
          <el-checkbox-group v-model="checkedType" @change="selectType">
            <el-checkbox-button v-for="item in smallTypeList" :label="item.subCategoryId" :value="item.subCategoryId" :key="item.subCategoryId">{{ item.label }}</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'select-app-type',
  props: {
    data: Array,
    value: [Number, String]
  },
  data() {
    return {
      bigType: this.value,
      checkedType: [],
      typeList: [],
      smallTypeList: [],
      checkAll: false,
    }
  },
  watch: {
    bigType(val) {
      if (val) {
        this.checkAll = false;
        this.checkedType = []
      }
      this.data.forEach((item, index, self) => {
        if (self[index].categoryId === val) {
          if (self[index].children && self[index].children.length) {
            this.smallTypeList = self[index].children
          } else {
            this.smallTypeList = []
          }
        }
      })
      this.$emit('change-big-type', val);
      this.$emit('change-small-type', this.checkedType.length ? this.checkedType.join(',') : '')

    },
    $route() {
      this.checkedType = '';
      this.bigType = 0;
    }
  },
  methods: {
    selectAllType(value) {
      if (value === true) {
        this.checkedType = this.smallTypeList.map(({ subCategoryId }) => subCategoryId);
      } else {
        this.checkedType = [];
      }
      this.$emit('change-small-type', this.checkedType.join(','));
    },
    selectType(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.smallTypeList.length;
      this.$emit('change-small-type', this.checkedType.join(','));
    }

  }
}
</script>

<style lang='less'>
.el-radio-button__inner {
    height: 30px;
    line-height: 10px;
    margin-right: 20px;
    margin-bottom: 20px;
    border:none !important;   
}
.el-checkbox-button {
    position: relative;
    display: inline-block;
    margin-right: 20px;
    
    
    
}

.el-checkbox-button__inner{
border: none !important;
background-color: rgb(240, 246, 238);
}
.el-checkbox-button:hover{
  background: white;
}
.el-checkbox-button.is-checked .el-checkbox-button__inner {
    color:#69c72b ;
    background-color: white;
    border: 1px solid #69c72b !important;
    box-shadow: -1px 0 0 0 #69c72b;
}
.content .detail-content-menu .select-list.top {
    border-bottom: none !important;
}
.content .detail-content-menu .select-list:nth-child(2) .right {
    overflow: hidden;
    background-color: rgb(240, 246, 238);
}
</style>