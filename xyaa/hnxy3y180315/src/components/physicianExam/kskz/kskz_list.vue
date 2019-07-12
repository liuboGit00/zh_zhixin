<template>
  <div class="kskz">
    <div class="head title">考室控制</div>
    <div class="con">
      <div class="part part1" v-for="(item,index) in roomInfo" :key="index">
        <p class="title">{{item.stationName}}</p> 
        <ul class="list">
          <li @click="openRoomControl(it)" v-for="(it,i) in item.stationRoomList" :key="i">{{it.stationRoomName}}</li>
        </ul>
      </div>
    </div>
  </div>  
</template>
<script>
import api from './api.js'
export default {
  data(){
    return{
      date: '',  //当前时间
      roomInfo: [],  //房间信息
    }
  },
  mounted(){
    this.initLocalTime()
  },
  methods:{
    initListData(){
      let parmas = {
        now : this.date
      } 
      this.ajax({
        ajaxSuccess: 'ajaxSuccess',
        ajaxError: 'ajaxError',
        ajaxParams: {
          url: api.list.path,
          method: api.list.method,
          params: parmas
        }
      });
    },
    ajaxSuccess(){

    },
    initLocalTime(){
      let myDate = new Date();
      let year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
      let month = myDate.getMonth() + 1; //获取当前月份(1-12)
      let day = myDate.getDate(); //获取当前日(1-31)
      //获取完整年月日
      let newDay = year + "-" + this.checktime(month) + "-" + this.checktime(day);
      this.date = newDay

      this.initListData()
    },
    checktime(i){
      if(i<10){
        i="0"+i;
      }
      return i;
    },
    ajaxSuccess(res){
      console.log(res,'考站的数据')
      if(res.data){
        this.roomInfo = res.data
      }
    },
    openRoomControl(item){
      let path = `/exam/examControl?stationRoomId=${item.stationRoomId}&examForm=${item.examForm}&timeLong=${item.timeLong}&stationRoomName=${item.stationRoomName}&roomNum=${item.roomNum}&stationName=${item.stationName}`
      window.open(path,'_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
  .kskz{
    height: 800px;
    overflow-y: auto;
    .title{
      font-size: 20px;
    }
    .head{
      line-height: 50px;
      border-bottom: 1px solid #aaa;
    }
    .con{
      width: 95%;
      margin: auto;
      .part{
        margin-top: 15px;
        >p{
          line-height: 60px;
          border-bottom: 1px solid #aaa;
        }
        .list{
          margin-top: 20px;
          padding-left: 45px;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          li{
            // width: 110px;
            height: 42px;
            border-radius: 5px;
            text-align: center;
            line-height: 32px;
            margin: 10px;
            padding: 5px;
            background: #CCCCCC;
            cursor: pointer;
            font-size: 16px;
          }
        }
      }
    }
  }
</style>

