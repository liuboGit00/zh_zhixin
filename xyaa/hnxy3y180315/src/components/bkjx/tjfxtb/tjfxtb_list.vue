<!--
****--@file     tjfxtb_list
****--@date     2019-04-04 9:39
****--@author   YC
****--@describe 统计分析图表
-->
<template>
  <div style="overflow-y:auto;height:100%;" id="content" ref="content" class="modal">
    <el-form ref="formValidate" inline label-width="90px">
      <el-row style="margin-bottom:0">
        <!--搜索项-->
        <el-col :span="24" align="right">
          <el-form-item label="统计周期：" prop="projectCode">
            <el-date-picker
              v-model="formValidate.yearMonthStart"
              type="month"
              :editable="false"
              placeholder="选择日期"
              @change="handleStartTime">
            </el-date-picker>
            至
            <el-date-picker
              v-model="formValidate.yearMonthEnd"
              align="right"
              type="month"
              :editable="false"
              placeholder="选择日期"
              @change="handleEndTime">
            </el-date-picker>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <div id="myTable" ref="myTable" :height="dynamicHt">
        <el-row>
          <el-col :span="12">
            <!--课时统计-->
            <div id="classHour" style="width: 90%;" ref="classHourHeight"></div>
          </el-col>
          <el-col :span="12">
            <!--人时统计-->
            <div id="totalUserHour" style="width: 90%;" ref="totalUserHourHeight"></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <!--用物数统计-->
            <div id="projectCount" style="width: 90%;" ref="projectCountHeight"></div>
          </el-col>
          <el-col :span="12">
            <!--用物成本-->
            <div id="projectCost" style="width: 90%;" ref="projectCostHeight"></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <!--用物数统计-按培训项目-->
            <div id="projectSubstanceCount" style="width: 90%;" ref="projectSubstanceCountHeight"></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <!--用物成本统计-按培训项目-->
            <div id="projectSubstanceCost" style="width: 90%;" ref="projectSubstanceCostHeight"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  /* 当前组件必要引入 */
  import api from './api'; // 图表
  import echarts from 'echarts/lib/echarts'; // 图表
  require('echarts/lib/chart/bar')
  require('echarts/lib/component/grid')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/markLine') //axisLine
  require('echarts/lib/component/markPoint')
  require('echarts/lib/component/legend')
  // 当前组件引入全局的util
  let Util = null
  export default {
    name: '',
    data () {
      return {
        // 搜索的数据
        formValidate:{
          yearMonthStart:(new Date()).getFullYear() + '-' + '01', // 开始时间
          yearMonthEnd:(new Date()).getFullYear() + '-' + '12', // 结束时间
        },
        projectName:'',
        projectNameCost:'',
        dynamicHt:100, // 表格的高度
        tableData:{
          cost:[],
          reserve:[],
          substance:[],
        }, // 表格的数据
        // 查询列表的接口
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.queryChart.path,
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
        this.setTableData(); // 请求表格数据
      },

      /********************** 点击事件 ************************/
      // 点击--查询--按钮
      searchEvent(){
        this.setTableData();
      },
      /*********************** end ********************************/
      // 初始化图表
      initCharts() {
        this.tableData.projectSubstanceNum.map(item=>{
          this.projectName = item.projectName
          // console.log(item.projectName,'projectName')
        })
        this.tableData.projectSubstanceCost.map(item=>{
          this.projectNameCost = item.projectName
          // console.log(item.projectName,'projectNameCost')
        })
        this.$nextTick(() => {
          this.initChart('classHour', this.tableData.classHourStatistics, '课时统计','课时数')
          this.initChart('totalUserHour', this.tableData.userHourStatistics, '人时统计','人时数')
          this.initChart('projectCount', this.tableData.substanceNumStatistics, '用物数统计','用物数')
          this.initChart('projectCost', this.tableData.substanceCostStatistics, '用物成本统计','用物成本')
          this.initChart('projectSubstanceCount', this.tableData.projectSubstanceNum, '用物数统计-按培训项目',this.projectName)
          this.initChart('projectSubstanceCost', this.tableData.projectSubstanceCost, '用物成本统计-按培训项目',this.projectNameCost)
        })
      },
      /**
       * 配置图表
       * title 标题
       * */
      initChart(dom, oldData, title,legendTitle) {
        let xData = [];
        let yData = [];
        let legendData = [];
        legendData.push(legendTitle);
        // console.log(dom,'dom')
        // console.log(oldData,'oldData')
        oldData.map((item) => {
          xData.push(item.month ? (item.month.split('-')[1] + '月') : '')
          if(dom==='projectCost'){
            yData.push(item.num/100)
          }else if(dom==='projectSubstanceCost'){
            yData.push(item.num/100)
          }else{
            yData.push(item.num)
          }

          // console.log(yData,'yData  课时')
        })
        let myChart = echarts.init(document.getElementById(dom))
        myChart.setOption({
          title: {
            text: title, // 图表标题
            textStyle:{
              color:'#09c',
            },
          },
          color: ['#2ec7c9'],
          tooltip: {
            show: true,                  //---是否显示提示框,默认为true
            trigger: 'item',             //---数据项图形触发
            axisPointer: {               //---指示样式
              type: 'shadow',
              axis: 'auto',
            },
            padding: 5,
            textStyle: {                 //---提示框内容样式
              color: '#fff',
            },
          },
          legend:{
            orient:'vertical',
            right:'right',
            data:legendData,
            textStyle:{
              color:'#000',
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            show: true,
            type: 'category',
            data: xData,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#09c',
                width: 2,
                type: 'solid',
              },
            },
          },
          yAxis: [
            {
              type: 'value',
              min: 0,
              splitNumber: 3,
              axisTick: {
                show: false, // 不显示刻度
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#09c',
                  width: 2,
                  type: 'solid',
                },
              },
            },
          ],
          series: [
            {
              name: legendTitle,
              type: 'bar',
              barWidth: '30%',
              label: {
                normal: {
                  show: true,
                  position: 'top',
                },
              },
              markPoint : {
                data : [
                  {type : 'max', name: '最大值'},
                  {type : 'min', name: '最小值'}
                ]
              },
              markLine: {
                data : [
                  {type : 'average', name: '平均值'}
                ]
              },
              data: yData,
            }],
        })
      },
      // 获取表格数据
      setTableData(){
        let formValidate = this.handleData();
        this.listMessTitle.ajaxParams.params = formValidate;
        this.ajax(this.listMessTitle);
      },
      updateListData(responseData){
        let data = responseData.data || {};
        this.tableData = data;

        this.initCharts();
      },
      // 处理时间
      handleData(){
        let formValidate = Util._.defaultsDeep({}, this.formValidate);
        formValidate = this.formDate(formValidate, ['yearMonthStart', 'yearMonthEnd'], 'yyyy-MM')
        return formValidate;
      },

      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
        $(this.$refs.classHourHeight).css('height',(parHt - myTable.offsetTop - paginationHt)/3 - 40);
        $(this.$refs.totalUserHourHeight).css('height',(parHt - myTable.offsetTop - paginationHt)/3 -40);
        $(this.$refs.projectCountHeight).css('height',(parHt - myTable.offsetTop - paginationHt)/3 -40);
        $(this.$refs.projectCostHeight).css('height',(parHt - myTable.offsetTop - paginationHt)/3 - 40);
        $(this.$refs.projectSubstanceCountHeight).css('height',(parHt - myTable.offsetTop - paginationHt)/3 -40);
        $(this.$refs.projectSubstanceCostHeight).css('height',(parHt - myTable.offsetTop - paginationHt)/3 -40);
      },
    },
    created () {
      this.init()
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      })
    },
    components: {},
  }

</script>
<style>
  .task-btn-col{
    padding:10px 26px;
  }
  .task-btn-col-small{
    font-size:12px;
    padding:6px 10px;
  }
</style>


