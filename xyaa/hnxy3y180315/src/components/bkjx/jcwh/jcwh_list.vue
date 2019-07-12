<!--- 节次维护 --->
<template>
  <div>
    <!--表格数据-->
    <div
      id="jcwhTableStyle"
      ref="myTable"
    >
      <el-table
        align="center"
        :context="self"
        :data="tableData"
        style="width: 100%;height: 100%;line-height: 40px;">
        <el-table-column
          align="center"
          label="节次"
          prop="sectionOrder">
        </el-table-column>
        <el-table-column
          label="开始时间"
          align="center"
          prop="startTime">
          <template scope="scope">
            <span @click="focuStart(scope.row.index)" v-if="(state !== 'reset') && (scope.row.index !==number)" style="display: inline-block">{{scope.row.startTime}}</span>
            <el-time-select
              @change="changeStart"
              placeholder="起始时间"
              :key="scope.row.id"
              v-else
              v-model="scope.row.startTime"
              :picker-options="{
                start: '08:00',
                step: '00:10',
                end: '21:00'
              }">
            </el-time-select>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="结束时间"
          prop="endTime">
          <template scope="scope">
            <span  @click="focuClick(scope.row.index)" v-if="(state !== 'reset') && (scope.row.index !==numberEnd)" style="display: inline-block">{{scope.row.endTime}}</span>
            <el-time-select
              :key="scope.row.id"
              @change="changeEnd"
              v-else
              placeholder="结束时间"
              v-model="scope.row.endTime"
              :picker-options="{
                start: '08:00',
                step: '00:10',
                end: '21:00',
                minTime: formValidate.startTime
              }">
            </el-time-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--列表操作按钮-->
    <div style="margin: 20px 0;" align="right">
      <el-button type="primary" @click="reset">重置</el-button>
      <el-button type="danger" @click="add">新建</el-button>
    </div>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  import api from './api';
  // 引入--访问前缀--组件

  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        startVal:'',
        endVal:'',
        dynamicHt: 100,
        self: this,
        focus:[],
        focuEnd:[],
        isShow:false,
        number:0,
        numberEnd:0,
          loading: false,
        tableData: [],
        resetStartTime:'',// 重置后的开始时间
        resetEndTime:'',// 重置后的结束时间
        formValidate: {
          id:'',
          sectionOrder:'',
          startTime: '',//开始时间
          endTime: '',//结束时间
        },
        state:'',//重置时的状态
        listMessTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.list.path,
            params: {}
          }
        },
        addMessTitle: {
          successTitle:'新建成功!',
          errorTitle:'新建失败!',
          ajaxSuccess: 'addSuccess',
          ajaxParams: {
            jsonString:true,
            url: api.add.path,
            method:api.add.method,
            data:[]
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }
        this.setTableData();
      },

      reset(){
        this.state = 'reset'
        this.tableData.map((item,index)=>{
          item.startTime = ''
          item.endTime = ''

        });
      },

      focuStart(num){
        this.number = num
      },

      focuClick(num){
        this.numberEnd = num
      },

      addSuccess(){
        this.number = 0
        this.numberEnd = 0
        this.setTableData();
        this.successMess('新建成功')
        return
      },

      changeStart(val){
        if(val){
          this.startVal = val
        }

      },

      changeEnd(val){
        this.endVal = val.split(':')
      },

      add(){
        if(this.startVal){
          this.startVal.split(':')
          this.tableData.map(item=>{
            this.resetStartTime = item.startTime
            this.resetEndTime = item.endTime
          })

        }else{
          this.tableData.map(item=>{
            this.resetStartTime = item.startTime
            this.resetEndTime = item.endTime
          })
        }

        if(this.resetStartTime !=='' && this.resetEndTime !==''){
          this.state = ''
          let list = []
          list = Object.assign(this.addMessTitle.ajaxParams.data, this.queryQptions.params,this.tableData)
          this.addMessTitle.ajaxParams.data = list;
          this.ajax(this.addMessTitle);
        }else{
          this.errorMess('时间不能为空')
          return
        }

      },

      setTableData() {
        let params = this.queryQptions.params;
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params,this.formValidate);
        this.ajax(this.listMessTitle);
      },
      successGetList(res) {
        let data = res.data;
        data = this.addIndex(data);
        this.tableData = data;
        this.listTotal = res.totalCount;
      },


    },
    created() {
      this.init();
    },
    mounted() {},
    components: {}
  }
</script>

<style>
  #jcwhTableStyle .el-table th{
     background: #ffffff !important;
   }
  #jcwhTableStyle .el-table th>.cell{
    background: #ffffff !important;
  }
</style>
