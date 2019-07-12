<template>
  <div class="waitRoomInfo">
    <div class="con">
      <div class="head">
        <span style="float:left;">{{week}}</span>
        <span>{{urlType.stationName}} 候考室： {{urlType.roomNum}}</span>
        <div class="time">
          <p>{{time}}</p>
          <p>{{date}}</p>
        </div>
      </div>
      <p class="guide" v-for="(item,index) in dkList" :key="index">请  <span style="color:red;verticalAlign:top">{{item.userName}}</span>  到  <span style="color:red;verticalAlign:top">{{item.stationRoomName}}</span>  参加考试</p>
      <div class="table">
      <table border="1" class="myTable">
        <thead>
          <tr>
            <th>序号</th>
            <th>姓名</th>
            <th>准考证号</th>
            <th>状态</th>
            <th>考室名称</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in tableData" :key="index">
              <td>{{index+1}}</td>
              <td>{{item.userName}}</td>
              <td>{{item.quasiExamNumber}}</td>
              <td>{{formatStatus(item.status)}}</td>
              <td>{{item.stationRoomName}}</td>
            </tr>
        </tbody>
      </table>
      </div>
    </div>
  </div>
</template>
<script>
import api from './api.js'
export default {
  data(){
    return{
      urlType: {},  //url
      tableData: [],
      date: '', //年月日
      time: '',  //时间
      week: '', //星期几
      waitId: '',   //等待房间id
      examStatus:{
        'HK': '候考',
        'DK': '待考',
        'KHZ': '考核中',
      },
      dkList: [],  //待考人员列表
    }
  },
  mounted(){
    this.init()
  },
  methods:{
    init(){
      let url = this.initUrl(location.href)
      this.urlType = url
      this.waitId = url.waitId
      this.initLocalTime()
      this.initData()
      this.updateTimer = setInterval(this.initData,3000)   //获取数据
    },
    initData(){
      this.ajax({
        ajaxLoading: false,
        ajaxSuccess: 'ajaxSuccess',
        ajaxError: 'ajaxError',
        ajaxParams: {
          url: api.checkWaitInfo.path + '/' + this.waitId,
          method: api.checkWaitInfo.method,
        }
      })
    },
    ajaxSuccess(res){
      this.tableData = res.data

      //选择待考的人员
      let dkArr = []
      res.data && res.data.forEach(elem => {
        if(elem.status == 'DK'){
          dkArr.push(elem)
        }
      });
      this.dkList = dkArr
    },
    formatStatus(row){
      let status = ''
      switch(row){
        case 'HK':
          status =  '候考'
          break;
        case 'DK':
          status = '待考'
          break;
        case 'KHZ':
          status = '考核中'
          break;
        }
        return status
    },
    initUrl(str) {
      var obj = {};
      var arr1 = str.split("?");
      var arr2 = arr1[1].split("&");
      for (var i = 0; i < arr2.length; i++) {
        var res = arr2[i].split("=");
        obj[res[0]] = decodeURI(res[1]);
      }
      return obj;
    },
    initLocalTime(){
      let myDate = new Date();
      let year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
      let month = myDate.getMonth() + 1; //获取当前月份(1-12)
      let day = myDate.getDate(); //获取当前日(1-31)
      //获取完整年月日
      let newDay = year + "-" + this.checktime(month) + "-" + this.checktime(day);
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
    checktime(i){
      if(i<10){
        i="0"+i;
      }
      return i;
    }
  },
  beforeDestroy(){
    clearTimeout(this.timer)
    clearInterval(this.updateTimer)
  }
}
</script>
<style lang="scss" scoped>
  .waitRoomInfo{
    height: 100%;
    background: #006699;
    color: #ffffff;
    .con{
      text-align: center;
      width: 80%;
      margin:  auto;
      .head{
        position: relative;
        font-size: 28px;
        font-weight: bold;
        padding: 40px 0;
        .time{
          position: absolute;
          right: 20px;
          top: 23px;
          width: 190px;
          line-height: 28px;
          p{
            line-height: 31px;
          }
        }
      }
      .guide{
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 25px;
        background: #0066CC;
        border: 1px solid #797979;
        span{
          span{
            padding: 0 10px;
            vertical-align: middle;
          }
        }
      }
      .myTable{
        width: 100%;
        margin-top: 50px;
        text-align: center;
        border: 1px solid #797979;
        background: #0066CC;
        color: yellow;
        thead{
          font-size: 18px;
        }
        tbody{
          font-size: 16px;
        }
        tr{
          height: 50px;
        }
      }
    }
  }
</style>
