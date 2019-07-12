<template>
  <div class="roomControl">
    <div class="head">
      <el-row type="flex" justify="space-between">
        <el-col :span="5"> {{date}}</el-col>
        <el-col :span="5">{{week}}</el-col>
        <el-col :span="5">{{time}}</el-col>
      </el-row>
    </div>
    <div class="oneSideCon" v-if="urlType.examForm == 'PC'">
      <p>{{decodeURIComponent(urlType.stationName)}}</p>
      <p>{{decodeURIComponent(urlType.stationRoomName)}}</p>
      <p>考试剩余时间</p>
      <p>{{showTime}}</p>
      <div class="btnControl">
        <el-button
          :type="isExam ? 'danger' : 'primary'"
          size="medium"
          @click="startExam"
        >{{isExam ? '结束考试' : '开始考试'}}</el-button>
        <el-button
          v-show="isExam"
          type="warning"
          size="medium"
          @click="pauseExam"
        >{{isPauseExam ? '恢复考试' : '暂停考试'}}</el-button>
      </div>
    </div>
    <div class="twoSideCon" v-if="urlType.examForm == 'GR'">
      <el-row type="flex">
        <el-col>
          <div class="left">
            <p>{{decodeURIComponent(urlType.stationName)}}</p>
            <p>{{decodeURIComponent(urlType.stationRoomName)}}</p>
            <p>考试剩余时间 {{showTime}}</p>
            <div class="btnControl-l">
              <el-button
                :type="isExam ? 'danger' : 'primary'"
                size="medium"
                @click="startExam"
              >{{isExam ? '结束考试' : '开始考试'}}</el-button>
              <el-button
                v-show="isExam"
                type="warning"
                size="medium"
                @click="pauseExam"
              >{{isPauseExam ? '恢复考试' : '暂停考试'}}</el-button>
            </div>
          </div>
        </el-col>
        <el-col>
          <div class="righta">
            <p><span>考生姓名：</span>{{peopleInfo.name}}</p>
            <p><span>准考证号：</span>{{peopleInfo.quasiExamNumber}}</p>
            <p><span>身份证号：</span>{{peopleInfo.idCard}}</p>
            <p><span>考试状态：</span>{{examStatus[peopleInfo.status]}}</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <audio id="myaudio" controls="controls" src="/static/audio/startExam.mp3" hidden="true"></audio>
  </div>
</template>
<script>
import api from './api.js'
export default {
  data() {
    return {
      urlType: {}, //房间信息  以及哪种类型
      showTime: "",
      isExam: false, //是否是考试状态
      isPauseExam: false, //是否为暂停状态
      runTime: '', //正在进行的考试时间
      totalTime: '', //考试总时长 秒 后台给
      date: '-- : -- : --', //年月日
      time: '-- : -- : --',  //时间
      week: '---', //星期几
      isStartExam: false,  //是否可以开始考试
      peopleInfo: '',      //人员信息
      batchIdOrArrangeId: '',  //批次或安排Id
      examStatus:{
        'DK' : '待考',
        'KHZ': '考核中',
        'ZT' : '暂停',
        'JS' : '结束'
       },
       flag: true,  //控制刷新人员信息
      status: '',//当前考试状态
      statusTransformation: {
        start: 'KSZ',
        pause: 'ZT',
        hu: 'HF',
        end: 'KX',
      }
    };
  },
  created(){
    this.initLocalTime();   //初始化时间
  },
  mounted() {
    let url = this.initUrl(location.href)
    this.urlType = url
    this.totalTime = url.timeLong
    this.showTime = this.checktime(Math.floor(url.timeLong / 3600)) + " : " + this.checktime(Math.floor((url.timeLong % 3600) / 60)) + " : " + this.checktime(Math.floor(url.timeLong % 60));
    this.runTime = url.timeLong
    //判断是否正在考试中
    this.judgeExam()
    this.judgeTimer = setInterval(this.judgeExam, 3000)
  },
  methods: {
    judgeExam(){
      let params = {
        stationRoomId: this.urlType.stationRoomId,
        examForm: this.urlType.examForm
      }
      this.ajax({
        ajaxLoading: false,
        ajaxSuccess: 'judgeExamAjaxSuccess',
        ajaxError: 'ajaxError',
        ajaxParams: {
          url: api.enterRoom.path,
          method: api.enterRoom.method,
          params: params
        }
      });
    },
    judgeExamAjaxSuccess(res){
      let status = this.status = res.data.stationStatus
      if(status == 'YAP'){
        clearInterval(this.judgeTimer)
        this.judgeTimer = null
        this.batchIdOrArrangeId = res.data.batchIdOrArrangeId
      }else if(status == 'KX'){
      }else if(status == 'KSZ'){
        clearInterval(this.showTimeTimer)
        clearInterval(this.checkTimer)
        //直接取后台数据展示
        this.fetchShowTime()

        clearInterval(this.judgeTimer)
        this.judgeTimer = null
        this.isExam = true;
        this.showTimeTimer = setInterval(this.fetchTime,1000)
        this.checkTimer = setInterval(this.cutDownTime, 20000)

        this.batchIdOrArrangeId = res.data.batchIdOrArrangeId
      }else if(status == 'ZT'){
        //直接取后台数据展示
        this.fetchShowTime()

        this.batchIdOrArrangeId = res.data.batchIdOrArrangeId
        clearInterval(this.judgeTimer)
        this.judgeTimer = null

        // this.fetchTime()
        this.isExam = true
        this.isPauseExam = true;
      }
      if(this.urlType.examForm == 'GR'){
        this.fetchPeopleInfos(res)
      }
    },
    fetchPeopleInfo(){
      let params = {
        stationRoomId: this.urlType.stationRoomId,
        examForm: this.urlType.examForm
      }
      this.ajax({
        ajaxLoading: false,
        ajaxSuccess: 'fetchPeopleInfos',
        ajaxError: 'ajaxError',
        ajaxParams: {
          url: api.enterRoom.path,
          method: api.enterRoom.method,
          params: params
        }
      });
    },
    fetchPeopleInfos(res){
      if(res.data.name){
        if(this.flag){
          this.peopleInfo = res.data
          this.flag = false
        }else{
          clearInterval(this.checkPeopleTimer)
          this.checkPeopleTimer = null
        }
      }else{
        this.peopleInfo = res.data
      }
    },
    checkStatus(){
      let params = {
        stationRoomId: this.urlType.stationRoomId,
        examForm: this.urlType.examForm
      }
      this.ajax({
        ajaxSuccess: 'checkStatusAjaxSuccess',
        ajaxError: 'ajaxError',
        ajaxParams: {
          url: api.enterRoom.path,
          method: api.enterRoom.method,
          params: params
        }
      });
    },
    checkStatusAjaxSuccess(res){
      if(res.data.batchIdOrArrangeId){
        this.isStartExam = true      //可以开始考试
        this.batchIdOrArrangeId = res.data.batchIdOrArrangeId
        this.ajaxExamStatus('start')   //考试状态 给后台
        // this.isExam = true;
      }else{
        this.isStartExam = false
        this.$message.warning('当前暂不可开始考试!');
      }
      if(this.urlType.examForm == 'GR'){
        this.peopleInfo = res.data
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
    startExam() {
      if (!this.isExam) {   //点击开始考试
         this.checkStatus()  //检查状态
      } else {   //点击结束考试
        this.ajaxExamStatus('end')   //考试状态 给后台
        // this.isExam = false;
        // this.isPauseExam = false;
      }
    },
    pauseExam() {
      if (!this.isPauseExam) {
        //点击暂停考试
        this.ajaxExamStatus('pause')   //考试状态 给后台
        // this.isPauseExam = true;
      } else {
        //点击恢复考试
        this.ajaxExamStatus('hu')   //考试状态 给后台
        // this.isPauseExam = false;
      }
    },
    ajaxExamStatus(status){
      let parmas = {}
      if(status == 'start'){
        let {stationRoomId,examForm} = this.urlType
        parmas = {
          stationRoomId,
          status: 'KSZ',   //房间状态   考试中
          examForm,        //考站形式
          batchIdOrArrangeId: this.batchIdOrArrangeId,
          arrageStatus: 'KHZ'
        }
      }else if(status == 'pause'){
        let {stationRoomId,examForm} = this.urlType
        parmas = {
          stationRoomId,
          status: 'ZT',   //房间状态   考试中
          examForm,        //考站形式
          batchIdOrArrangeId: this.batchIdOrArrangeId,
          arrageStatus: 'ZT'
        }
      }else if(status == 'hu'){
        let {stationRoomId,examForm} = this.urlType
        parmas = {
          stationRoomId,
          status: 'HF',   //房间状态   考试中
          examForm,        //考站形式
          batchIdOrArrangeId: this.batchIdOrArrangeId,
          arrageStatus: 'KHZ'
        }
      }else if(status == 'end'){
        let {stationRoomId,examForm} = this.urlType
        parmas = {
          stationRoomId,
          status: 'KX',   //房间状态   考试中
          examForm,        //考站形式
          batchIdOrArrangeId: this.batchIdOrArrangeId,
          arrageStatus: 'JS'
        }
      }

      this.ajax({
        ajaxSuccess: (res) => {
          this.status = status
          if(res && this.urlType.examForm == 'GR'){
            this.flag = true
            this.fetchPeopleInfo()  //重新加载考生信息
          }
          //从后台取时间
          if(status == 'start'){
            clearInterval(this.showTimeTimer)
            clearInterval(this.checkTimer)
            this.Speech('startExam.mp3')
            //修改按钮状态
            this.isExam = true;

            this.showTimeTimer = setInterval(this.fetchTime,1000)
            this.cutDownTime()
            //同时同步后台数据 10s 同步一次
            this.checkTimer = setInterval(this.cutDownTime, 20000)
          }else if(status == 'pause'){
            this.Speech('pauseExam.mp3')
            //修改按钮状态
            this.isPauseExam = true

            this.fetchTime()
            clearInterval(this.showTimeTimer)
            this.showTimeTimer = null

            //暂停同时同步后台数据 3s 同步一次
            clearInterval(this.checkTimer)
            this.checkTimer = null
          }else if(status == 'hu'){
            this.Speech('huExam.mp3')
            //修改按钮状态
            this.isPauseExam = false;

            this.showTimeTimer = setInterval(this.fetchTime,1000)
            this.cutDownTime()
            //同时同步后台数据 3s 同步一次
            this.checkTimer = setInterval(this.cutDownTime, 20000)
          }else if(status == 'end'){
            this.Speech('endExam.mp3')
            //修改按钮状态
            this.isExam = false;
            this.isPauseExam = false;


            clearInterval(this.showTimeTimer)
            this.showTimeTimer = null

            //结束同时同步后台数据 3s 同步一次
            clearInterval(this.checkTimer)
            this.checkTimer = null

             this.showTime =
              this.checktime(Math.floor(this.totalTime / 3600)) + ' : ' +
               this.checktime(Math.floor((this.totalTime % 3600) / 60)) +
              " : " +
              this.checktime(Math.floor(this.totalTime % 60)) ;

            //从新加载时间
            let url = this.initUrl(location.href)
            this.runTime = url.timeLong
            //重新刷人员
            this.flag = true
            this.judgeExam()
            this.judgeTimer = setInterval(this.judgeExam, 3000)
          }
        },
        ajaxError: () => {
          this.errorMess('网络异常')
        },
        ajaxParams: {
          url: api.updateExamStatus.path,
          method: api.updateExamStatus.method,
          params: parmas
        }
      });
    },
    //直接拿后台时间展示函数
    fetchShowTime(){
      let params = {
        stationRoomId: this.urlType.stationRoomId,
        timeLong: this.urlType.timeLong,
        status: this.statusTransformation[this.status] || this.status,
      }
      this.ajax({
        ajaxLoading: false,
        ajaxSuccess: (res) => {
          if(res.data <= 0 ){

            //考试时间结束
            // this.ajaxExamStatus('end')   //考试状态 给后台
            // clearInterval(this.showTimeTimer)
            // this.showTimeTimer = null
            this.isExam = false;
            this.isPauseExam = false;
            this.showTime =
              this.checktime(Math.floor(this.totalTime / 3600)) + ' : ' +
              this.checktime(Math.floor(this.totalTime / 60)) +
              " : " +
              this.checktime(Math.floor(this.totalTime % 60));
          }else{
            this.showTime = this.handleTime(Math.abs(res.data))
             this.runTime = Math.floor(res.data/1000)
          }
        },
        ajaxError: 'ajaxError',
        ajaxParams: {
          url: api.updateTime.path,
          method: api.updateTime.method,
          params
        }
      });
    },
    cutDownTime() {
      let params = {
        stationRoomId: this.urlType.stationRoomId,
        timeLong: this.urlType.timeLong,
        status: this.statusTransformation[this.status] || this.status,
      }
      this.ajax({
        ajaxLoading: false,
        ajaxSuccess: (res) => {
          // if(res.data <= 0 ){
          //   //考试时间结束
          //   this.ajaxExamStatus('end')   //考试状态 给后台
          //   clearInterval(this.showTimeTimer)
          //   this.showTimeTimer = null
          //   this.isExam = false;
          //   this.isPauseExam = false;
          //   this.showTime =
          //     this.checktime(Math.floor(this.totalTime / 3600)) + ' : ' +
          //     this.checktime(Math.floor(this.totalTime / 60)) +
          //     " : " +
          //     this.checktime(Math.floor(this.totalTime % 60));
          //   this.runTime = this.totalTime;
          // }else{
          //   this.showTime = this.handleTime(Math.abs(res.data))
          // }

          if(res.data){
            this.runTime = Math.floor(res.data/1000)
          }
        },
        ajaxError: 'ajaxError',
        ajaxParams: {
          url: api.updateTime.path,
          method: api.updateTime.method,
          params
        }
      });
    },
    fetchTime(){
      let maxtime = this.runTime; //考试时间
      if (maxtime >= 0) {
        let hours = this.checktime(Math.floor(maxtime / 3600));
        let minutes = this.checktime(Math.floor(maxtime / 60));
        let seconds = this.checktime(Math.floor(maxtime % 60));
        let msg = hours + ' : ' + minutes + " : " + seconds;
        this.showTime = msg;
        this.runTime = --maxtime;
      } else {
        //考试时间结束
        this.ajaxExamStatus('end')   //考试状态 给后台
        clearInterval(this.showTimeTimer)
        this.showTimeTimer = null

        // this.isExam = false;
        // this.isPauseExam = false;
        this.showTime = this.checktime(Math.floor(this.totalTime / 3600)) + ' : ' + this.checktime(Math.floor(this.totalTime / 60)) + " : " + this.checktime(Math.floor(this.totalTime % 60)) ;
        this.runTime = this.totalTime;
      }
    },
    handleTime(mss){
      let msg  = ''
      let hours = this.checktime(parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      let minutes = this.checktime(parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)));
      let seconds = this.checktime(Math.round(mss % (1000 * 60) / 1000));
      msg = hours + ' : ' + minutes + " : " + seconds;
      return msg
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
    checktime(i){
      if(i<10){
        i="0"+i;
      }
      return i;
    },
    //语音播报
    Speech(path) {
      var url = "/static/audio/" + path;        // baidu
      var myAuto = document.getElementById('myaudio');
      myAuto.src = url
      console.log(myAuto);

      myAuto.play();

    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.checkPeopleTimer)
    clearInterval(this.judgeTimer)
    clearInterval(this.showTimeTimer)
    clearInterval(this.checkTimer)
    this.checkTimer = null
    this.showTimeTimer = null
    this.timer = null
    this.checkPeopleTimer = null
    this.judgeTimer = null
  }
};
</script>
<style lang="scss" scoped>
.roomControl {
  width: 100%;
  height: 100%;
  background-color: #006699;
  .head {
    height: 100px;
    line-height: 100px;
    font-size: 40px;
    font-weight: bold;
    color: #ffffff;
    text-align: center;
    &::after {
      content: "";
      display: block;
      width: 90%;
      height: 3px;
      background: #ffffff;
      margin: auto;
    }
  }
  .oneSideCon {
    padding-top: 150px;
    > p {
      line-height: 100px;
      text-align: center;
      font-size: 60px;
      font-weight: bold;
      color: #ffffff;
    }
    .btnControl {
      display: flex;
      justify-content: center;
      padding: 30px;
      .el-button {
        margin: 0 75px;
        width: 130px;
        height: 60px;
        font-size: 19px;
      }
    }
  }
  .twoSideCon {
    .left {
      width: 100%;
      padding-top: 250px;
      position: relative;
      p {
        line-height: 100px;
        text-align: center;
        font-size: 50px;
        font-weight: bold;
        color: #ffffff;
      }
      .btnControl-l {
        display: flex;
        justify-content: center;
        padding: 30px;
        .el-button {
          margin: 0 75px;
          width: 130px;
          height: 60px;
          font-size: 19px;
        }
      }
      &::after {
        content: "";
        width: 2px;
        height: 650px;
        background: #ffffff;
        position: absolute;
        top: 70px;
        right: 0;
      }
    }
    .righta {
      padding-top: 250px;
      p {
        line-height: 80px;
        font-size: 40px;
        font-weight: bold;
        color: #ffffff;
        >span{
          display: inline-block;
          vertical-align: bottom;
          width: 250px;
          margin-left: 188px;
        }
      }
    }
  }

}

</style>
<style lang="scss">
.roomControl{
  .el-message-box__content{
    font-size: 20px;
  }
}
</style>

