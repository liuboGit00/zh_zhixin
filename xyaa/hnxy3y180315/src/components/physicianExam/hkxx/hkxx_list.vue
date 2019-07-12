<template>
  <div class="hkxx">
    <div class="head title">候考信息</div>
    <div class="con">
      <div class="part part1" v-for="(item,index) in waitRoomList" :key="index">
        <p class="title">{{item.stationName}}</p>
        <ul class="list" >
          <li @click="openWaitRoom(it,item)" v-for="(it,ind) in item.stationRoomList" :key="ind">{{it.roomNum}}</li>
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
      date: '' ,  //当前时间
      waitRoomList: ''  //第二站等待的房间列表
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
    ajaxSuccess(res){
      console.log(res,'候考信息')
      this.waitRoomList = res.data
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
    openWaitRoom(item, station) {

      let path = `/exam/waitRoomInfo?waitId=${item.waitId}&roomNum=${item.roomNum}&stationName=${station.stationName}`
      window.open(path,'_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
  .hkxx{
    padding: 15px;
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
          line-height: 80px;
          border-bottom: 1px solid #aaa;
        }
        .list{
          margin-top: 20px;
          padding-left: 45px;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          li{
            width: 110px;
            height: 42px;
            border-radius: 5px;
            text-align: center;
            line-height: 42px;
            margin: 10px;
            font-size: 16px;
            background: #CCCCCC;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
