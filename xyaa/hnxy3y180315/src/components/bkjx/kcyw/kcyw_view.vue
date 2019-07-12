<template>
  <div>
    <!-- 表格数据 -->
    <div id="deviceTable" ref="deviceTable" :model="tableData" v-for="item in tableData">
      <el-row align="center">
        <div style="width:100%;text-align: center;font-size:20px;display: inline-block"><strong>{{item.projectName}}</strong></div>
      </el-row>
      <el-table align="center" :context="self" :data="item.projectDetails" tooltip-effect="dark"
                class="tableShowMoreInfo"
                style="width: 100%">
        <el-table-column label="类型" prop="materielType" show-overflow-tooltip width="210">
          <template scope="scope">
            <span>{{converterStatus(scope.row.materielType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="耗材名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="数量" prop="num" show-overflow-tooltip></el-table-column>
        <el-table-column label="单次使用价格" prop="singlePrice" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
  import api from './api'; // api
  //当前组件引入全局的util
  let Util = null;
  export default {
    props:['itemNumsRow'],
    name: 'kcyw_view',
    data () {
      return {
        self: this,
        loading: false,
        dynamicHt: 100,
        tableData: [],
        techCourseId:'',
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.setTableData();
      },

      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData () {
        let listMessTitle = {
          ajaxSuccess: 'listDataSuccess',
          ajaxParams:{
            url: api.queryDetail.path,
            params: {
              techCourseId:this.itemNumsRow.id
            }
          },

        }

        this.ajax(listMessTitle)
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.tableData = res.data;
        this.tableData.map(Item=>{
          Item.projectDetails.map(item=>{
            item.singlePrice = item.singlePrice/100
          })
        })
      },
      //转换请假条状态
      converterStatus(materielType){
        switch (materielType){
          case '1' : materielType = '模型';
            break;
          case '2' : materielType = '耗材';
            break;
        }
        return materielType
      },

    },
    created () {
      this.init()
    }
  }
</script>

<style scoped>

</style>
