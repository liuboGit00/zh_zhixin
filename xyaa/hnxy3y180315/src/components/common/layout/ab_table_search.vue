<!--
****--@file     ab_table_search
****--@date     2018/3/18 21:34
****--@author   YC
****--@describe 搜索表格
-->
<template>
  <div>
    <!-- 顶部 -->
    <div ref="searchMore">
      <el-row>
        <el-col :span="hasSearch ? 20 : 24" align="left" class="abTableSeacrhBtnBox">
          <!-- 操作按钮 -->
          <slot name="todoBtns">
            <p>&nbsp;</p>
          </slot>
        </el-col>
        <el-col :span="4" align="right" class="abTableSeacrhBtnBox" v-if="hasSearch">
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">{{ 'query_more' | sysLan }}</el-button>
        </el-col>
        <el-col v-show="searchMore" style="clear:both;" align="right">
          <el-form :inline="true" class="abTableSeacrhForm">
            <!-- 搜索项 -->
            <slot name="search"></slot>
            <el-form-item label-width="0">

              <el-button type="info" size="small" @click="search">{{ 'query' |
                sysLan }}
              </el-button>
              <el-button v-if="url" type="info" size="small" @click="initSelect">清空
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <ab-table :showSelect="showSelect" :contenHeight="tableContentHeight" :loadTableData="loadTableData" :tableData="tableData" :makeSmall="makeSmall" :url="url"
              :tableURL="tableURL" :searchObj="searchObj" :hasSelect="hasSelect" :hasSon="hasSon"
              :hasPagination="hasPagination" :selectSon="selectSon" @show="show"
              @shows="shows" :depMes="depMes"
              @edit="edit"
              @selectionChange="selectionChange">
      <!-- 表格内容 -->
      <slot name="tableItem"></slot>
    </ab-table>
  </div>
</template>
<style lang="scss">
  .abTableSeacrhBtnBox {
    .el-button {
      margin-bottom: 22px;
    }
  }

  .abTableSeacrhForm {
    .el-input {
      &, &.el-date-editor {
        width: 160px
      }
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import abTable from './ab_table'
  //当前组件引入全局的util
  let Util = null
  export default {
    name: 'ab_table_search',
    props: {
      /******************* 表格 *******************/
      contenHeight: { // 接收父组件的高度
        type: Number,
        default: 860
      },
      url:{
        type: String,
        default: () => ''
      },
      tableData: { // 表格数据
        type: Array,
        default: () => []
      },
      tableURL: { // 根据url获取表格数据
        type: [String, Object],
        default: () => ''
      },
      hasSon:{
        type: Boolean,
        default: true
      },
      searchObj: { // 表格筛选条件（Url）
        type: Object,
        default: () => {}
      },
      loadTableData: { // 改变此数据将重新获取表格数据
        type: [String, Number],
        default: () => 0
      },
      hasSearch: { // 是否有搜索
        type: Boolean,
        default: true
      },
      hasSelect: { // 是否有复选框
        type: Boolean,
        default: true
      },
      hasPagination: { // 是否有分页
        type: Boolean,
        default: true
      },
      makeSmall:{
        type: Boolean,
        default: false,
      },
      selectSon:{
        type: Boolean,
        default: false,
      },
      depMes: {},
      showSelect: {
        type: Boolean,
        default: true,
      },
      /******************* 表格 *******************/

    },
    data () {
      return {
        searchMore: false,
        tableContentHeight: 800
      }
    },
    methods: {
      //初始化请求列表数据
      init () {

      },
      initSelect(){
        this.$emit('initSelect')
      },
      // 筛选
      showSearchMore () {
        this.searchMore = !this.searchMore
        // this.$nextTick(function () {
        // if (this.searchMore) {
        // this.tableContentHeight = this.contenHeight - this.$refs.searchMore.offsetHeight
        // } else {
        //   this.tableContentHeight = this.contenHeight
        // }
        // })
        this.setTableDynHeight()
      },
      setTableDynHeight () {
        this.$nextTick(function () {
          this.tableContentHeight = this.contenHeight - this.$refs.searchMore.offsetHeight
        })
      },
      /************************************* 方法 *********************************************/
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      selectionChange (val,valList,type,data) {
        this.$emit('selectionChange',val,valList,type,data)
      },
      // 搜索事件
      search () {
        this.$emit('search')
      },
      shows (res) {
        this.$emit('shows', res)
      },
      show(item){
        console.log(66)
        this.$emit('show',item);
      },
      edit(item){
        this.$emit('edit',item);
      }
    },
    created () {
      this.init()
    },
    mounted () {
      //页面dom稳定后调用
      this.setTableDynHeight()
      this.$nextTick(function () {
        //初始表格高度及分页位置
        // this.setTableDynHeight()
        //为窗体绑定改变大小事件
        this.$util.events.addHandler(window, 'resize', this.setTableDynHeight)
      })
    },
    watch: {
      contenHeight () {
        this.setTableDynHeight()
      }
    },
    components: {
      abTable
    }
  }

</script>
