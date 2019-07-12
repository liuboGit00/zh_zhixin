<template>
  <div class="page">
    <el-row class="header">
      <el-col :span="10" align="left">
        <el-button @click="fullScreen">全屏模式</el-button>
        <span style="paddingLeft:15px;">开始时间 {{urlType.executeDate}} {{decodeURIComponent(urlType.amStartTime)}}</span>
      </el-col>
      <el-col :span="13" align="right">
        <div>当前日期: {{date}} {{time}} {{week}}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <div id="myChart" style="height: 400px"></div>
      </el-col>
      <el-col :span="8">
        <div class="table" style="width:90%;">
          <div class="iconsTip">
            <span>
              <i class="complete"></i>已完成
            </span>
            <span>
              <i class="keep"></i>正在进行
            </span>
            <span>
              <i class="noComplete"></i>未进行
            </span>
          </div>
          <div class="con">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="name" label="姓名" align="center"></el-table-column>
              <el-table-column prop="quasiExamNumber" label="准考证号" align="center"></el-table-column>
              <el-table-column prop="complete" label="完成度" align="center">
                <template scope="scope">
                  <div class="stateGroup">
                    <span :class="handStatus(it)" v-for="(it,ind) in scope.row.zyTaskStationList" :key="ind"></span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="lineCon" v-if="lineData.length > 0">
      <el-col :span="24/lineData.length" v-for="(item,index) in lineData"  :key="index">
        <div :id="`lineFirst${index+1}`" style="height: 300px; paddingLeft: 10px">
        </div>
      </el-col>
    </el-row>
    <div class="noData" v-else>
      暂无候考人员
    </div>
  </div>
</template>
<script>
let Util = null;
import api from './api.js'
import echarts from "echarts";
export default {
  data() {
    return {
      urlType: {},   //路径信息
      tableData: [],
      lineData:[],   //线数据
      date: '', //年月日
      time: '',  //时间
      week: '', //星期几
    };
  },
  mounted() {
    
    this.init();
  },
  methods: {
    handStatus(it){
      let className = ''
      if(it.isYWC){
        className = 'complete'
      }else if(it.isJXZ){
        className = 'keep'
      }else if(it.isWKS){
        className = 'noComplete'
      }
      return className
    },
    init() {
      Util = this.$util;
      let url = this.initUrl(location.href)
      this.urlType = url
      this.initLocalTime();
      this.echartsTimer = setInterval(this.initData,3000);  //定时刷新
      // this.initData()
    },
    
    initData(){
      this.ajax({
        ajaxLoading: false,
        ajaxSuccess: 'ajaxSuccess',
        ajaxError: 'ajaxError',
        ajaxParams: {
          url: api.list.path + this.urlType.taskId,
          method: api.list.method,
        }
      });
    },
    ajaxSuccess(res){
      this.drawBar(res.data.stationCount)
      this.drawTable(res.data.examineeCount)
      this.drawLine(res.data.waitCount);
    },
    drawBar(data=[]){
      let dataArr = []
      data.forEach(elem => {
        dataArr.push({
          'product': `${elem.stationName} 平均考试时长${(elem.avgTime/60000).toFixed(2)}min`,
          '报考人数': elem.sum,
          '已签到人数': elem.signSum,
          '已考人数': elem.ykSum,
          '未考人数': elem.wkSum
        })
      });
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['product', '报考人数', '已签到人数', '已考人数','未考人数'],
          source: dataArr
        },
        xAxis: { type: "category" },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: "bar" }, { type: "bar" }, { type: "bar" },{ type: "bar" }]
      });
    },
    drawLine(data=[]) {
      let that = this
      that.lineData = data;
      this.$nextTick(()=>{
        data.map((item,index) => {
          // 绘制图表
          echarts.init(document.getElementById('lineFirst'+(index+1))).setOption({
            title: {
              left: 'center',
              text: item.stationName,
            },
            tooltip:{
              show: true,
              formatter: "{b} 候考 {c}" + '人'
            },
            xAxis: {
              type: "category",
              data: that.handleLineData(item.crowdingCount,'key')
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                data: that.handleLineData(item.crowdingCount,'val'),
                type: "line"
              }
            ]
          });
        })
      })
   
    },
    handleLineData(data=[],type){
      let arr = []
      if(type == 'key'){
         data.forEach((item,index) => {
          arr.push(this.formateTime(item.time))
        })
      }else if(type == 'val'){
         data.forEach((item,index) => {
          arr.push(item.sumNum)
        })
      }
      return arr
    },
    formateTime(time){
      let myDate = new Date(time);
      let h=myDate.getHours();
      let m=myDate.getMinutes();
      m=this.checktime(m);
      let times = h+' : '+m

      return times
    },
    drawTable(data=[]){
      console.log(data,'表格数据')
      data.forEach((item,index) => {
        
      })
      this.tableData = data
    },
    initLocalTime(){
      let myDate = new Date();
      let year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
      let month = myDate.getMonth() + 1; //获取当前月份(1-12)
      let day = myDate.getDate(); //获取当前日(1-31)
      //获取完整年月日
      let newDay = year + "-" + month + "-" + day;
      this.date = newDay
      let week = myDate.getDay();
      let text = "";
      switch (week) {
        case 0:
          text = "星期日";
          break;
        case 1:
          text = "星期一";
          break;
        case 2:
          text = "星期二";
          break;
        case 3:
          text = "星期三";
          break;
        case 4:
          text = "星期四";
          break;
        case 5:
          text = "星期五";
          break;
        case 6:
          text = "星期六";
          break;
      }
      this.week = text
      this.timeClock() 
    },
    timeClock(){
      let myDate = new Date();
      let h=myDate.getHours();
      let m=myDate.getMinutes();
      let s=myDate.getSeconds();
      m=this.checktime(m);
      s=this.checktime(s);
      let time = h+':'+m+':'+s
      this.time = time
      this.timer = setTimeout(this.timeClock,1000)
    },
    fullScreen() {
      var el = document.documentElement;
      var rfs =
        el.requestFullScreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullScreen;
      if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
      } else if (typeof window.ActiveXObject != "undefined") {
        //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
          wscript.SendKeys("{F11}");
        }
      }
    },
    initUrl(str) {
      var obj = {};
      var arr1 = str.split("?");
      var arr2 = arr1[1].split("&");
      for (var i = 0; i < arr2.length; i++) {
        var res = arr2[i].split("=");
        obj[res[0]] = res[1];
      }
      return obj;
    },
    checktime(i){
      if(i<10){
        i="0"+i;
      }
      return i;
    }
  },
  beforeDestroy(){
    clearTimeout(this.timer)
    clearInterval(this.echartsTimer)
    this.timer = null
    this.echartsTimer = null
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.page {
  .header {
    padding: 20px;
    background: blue;
    height: 80px;
    line-height: 40px;
    font-size: 18px;
    color: #ffffff;
    margin-bottom: 15px;
  }
  .lineCon{
    margin-top: 25px;
  }
  .noData{
    height: 300px;
    width: 100%;
    line-height: 300px;
    text-align: center;
    font-size: 16px;
    border: 1px solid #dddddd;
  }
  .table {
    .con {
      height: 400px;
      overflow-y: auto;
    }
    .stateGroup {
      font-size: 0;
      > span {
        display: inline-block;
        width: 28px;
        height: 15px;
        margin-right: 1px;
        border-radius: 3px;
        &.complete{
          background: green;
        }
        &.keep{
          background: yellow;
        }
        &.noComplete{
          background: #C23531;
        }
      }
    }
    .iconsTip {
      padding: 10px;
      text-align: right;
      span {
        margin: 5px;
        i {
          display: inline-block;
          width: 30px;
          height: 15px;
          border-radius: 3px;
          vertical-align: middle;
          margin-right: 2px;
          &.complete{
            background: green;
          }
          &.keep{
            background: yellow;
          }
          &.noComplete{
            background: #C23531;
          }
        }
      }
    }
  }
}
</style>
