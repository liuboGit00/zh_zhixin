<!--
****--@file     tjfxlb_list
****--@date     2019-04-04 9:39
****--@author   YC
****--@describe 统计分析列表
-->
<template>
  <div id="content" ref="content" class="modal">
    <div id="myTable" ref="myTable">
      <el-table
        align="center"
        :data="tableData"
        stripe
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%">
        <el-table-column prop="consumableName" label="用物名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="consumableNumber" label="用物数量" show-overflow-tooltip width="220">
        </el-table-column>
      </el-table>
    </div>
    <el-row style="margin-top:20px;">
      <el-col :span="22" align="right">
        <el-button type="primary" @click="cancelBtn">关闭</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /* 当前组件必要引入 */

  // 当前组件引入全局的util
  let Util = null
  export default {
    name: '',
    props:['operailityData'],
    data () {
      return {
        tableData:[], // 表格的数据
        // 查询列表的接口
        detailTitle: {
          ajaxSuccess: 'getDetailData',
          ajaxParams: {
            url: '/open/reserve/statistics/goods',
            params: {}
          }
        },
        loading: false,
      }
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util;
        this.detailTitle.ajaxParams.params.date = this.operailityData ? this.operailityData.date : '';
        this.ajax(this.detailTitle); // 获取详情
      },

      /********************** 点击事件 ************************/
      // 点击--关闭--按钮
      cancelBtn(){
        this.$emit('cancel','show');
      },
      /*********************** end ********************************/
      getDetailData(responseData){
        let data = responseData.data || [];
        this.tableData = data;
      },
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {},
  }

</script>

