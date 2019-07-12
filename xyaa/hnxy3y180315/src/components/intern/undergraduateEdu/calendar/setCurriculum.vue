<!----------------------------------
****--课程设置(setCurriculum)
****--@date     2017/6/14
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <h2 style="text-align: center;padding: 10px 0;">{{operailityData.date}}课程设置</h2>
    <br/>
    <el-button @click="addCourse" type="primary">添加课程</el-button>
    <el-row>
      <el-col :span="12" v-if="course.length>0" v-for="(item,index) in course" :key="index" style="padding: 10px 0;">
        <el-col :span="1"><span style="font-size: 18px;padding: 2px">{{index+1}}.</span></el-col>
        <el-col :span="12">
        <timeQuantum :index="index"  :range="range" :data="item" ></timeQuantum>
        </el-col>
        <el-col :span="11">
        <el-select
          v-if="optionData.length>0"
          v-model="item.sltTimeId"
          :filterable="true"
          style="width:150px"
          placeholder="选择科室"
          @change="change">
          <el-option
            v-for="item in optionData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
          <el-button  size="small" type="danger" icon="minus" @click="removeCourse(index)"></el-button>
        </el-col>
      </el-col>
    </el-row >
    <br />
    <el-row >
      <el-col :span="24" style="text-align: center;">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入当前组件字典api
  import api from "../api.js";
  import timeQuantum from "../../../common/timeQuantum.vue";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["operailityData"],
    data() {
      return {
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        optionData:[{}],
        range:[],
        formValidate:{
          weekSetId:this.operailityData.weekSetId, //周历ID
          courseTime:this.operailityData.date,   //课程时间(yyyy-MM-dd)
          timeInfos:"",  //课程时间段(逗号分隔)  时间段ID
          teachRoomDepId:"",  //大科室ID(逗号分隔)
        },
        times:[
          /*{
            "timeId":"1",
            "courseTime":"08:00-08:50",
            "courseIndex":"1",
            "courseType":"0"
          }*/
        ],
        saveMess:{

        },
        //课程教研室设置ID
        dayCourse:[],
        course:[

        ],
        //获取时间段设置
        getTimesTitle:{
          ajaxSuccess:'getTimeData',
          ajaxParams:{
            url: api.teachCourseTime.path,
            params:{}
          }
        },
        //请求科室列表
        getDepTitle:{
          ajaxSuccess:'getDepData',
          ajaxParams:{
            url: api.depOption.path,
            params:{}
          }
        },
        //教研室设置时间添加
        saveCoursetimeTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.courseTime.path,
            method:api.courseTime.method,
          }
        },

        //根据教学周历ID和时间获取一天的教学安排
        getDayCourseSetTitle:{
          ajaxSuccess:'getDayCourseData',
          ajaxParams:{
            url: api.dayCourseSet.path+"/"+this.operailityData.weekSetId,
            params:{
              dateTime:this.operailityData.date
            }
          }
        },

        //教研室设置时间修改
        courseTimeModifyTitle:{
          type:'add',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.courseTimeModify.path,
            method:api.courseTimeModify.method,
            data:{
              recordIds:"",
              timeRecords:"",
              teachRoomDepId:"",
              weekSetId:this.operailityData.weekSetId,
              weekTime:this.operailityData.date,
            }
          }
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        console.log(this.operailityData);
        Util = this.$util;
        //获取科室option数据
        setTimeout(()=>{
          this.ajax(this.getDepTitle);
        },1);
        //获取时间课程设置时间
        setTimeout(()=>{
          this.ajax(this.getDayCourseSetTitle);
        },10)
      },


      //从server端获取当天是否已有课程设置
      getDayCourseData(responseData){
        let data = responseData.data;
        this.dayCourse = data;
        let course = []
        if(data.length>0){
          data.map((item)=>{
            item.time = item.timeInfo;
            item.sltTimeId = +item.courseTeachingResearchRoom;
            course.push( {
              id:item.id,
              start:'',
              end:'',
              time:item.timeInfo,
              sltTimeId:+item.courseTeachingResearchRoom
            })
          })
        }else {
          course = [{
            start:'',
              end:'',
            time:"",
            sltTimeId:''
          }]
        }
        this.course = course;
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let timeRecords = [];
        let teachRoomDepIds = [];
        let recordIds = [];
        if(this.course.length==0){
          this.showMess("至少要选择一个科室!");
          return;
        }
        let id='';
        //全没有id则返回true
        let noId = this.course.every((item)=>{
          return !item.id
        })

        if(this.dayCourse.length>0&&noId){
          this.course[0].id = this.dayCourse[0].id;
        }
        for(var i=0,item;i<this.course.length;i++){
          item = this.course[i];
          if(item._start && item._end && item.sltTimeId){
            teachRoomDepIds.push(item.sltTimeId);
            timeRecords.push(item._time);
            recordIds.push(item.id);
          }else {
            this.errorMess(`第${i+1}个课程数据不完整`);
            return;
          }
        }
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        if(this.dayCourse.length==0){
          this.formValidate = Object.assign(this.courseTimeModifyTitle.ajaxParams.data,this.formValidate,{timeRecords:timeRecords.join(','),teachRoomDepId:teachRoomDepIds.join(',')})
          this.saveCoursetimeTitle.ajaxParams.data = this.formValidate;
          this.ajax(this.saveCoursetimeTitle,isLoadingFun);
        }else{
          console.log(recordIds,recordIds.join(','));
          this.formValidate = Object.assign(this.courseTimeModifyTitle.ajaxParams.data,this.formValidate,{recordIds:recordIds.join(','),timeInfos:timeRecords.join(','),teachRoomDepId:teachRoomDepIds.join(',')})
          this.courseTimeModifyTitle.ajaxParams.data = this.formValidate;
          this.ajax(this.courseTimeModifyTitle,isLoadingFun);
        }
      },





      //获取server端返回的科室
      getDepData(responseData){
        let data = responseData.data;
        if(!data) return ;
        for(let i =0;i<data.length;i++){
          let item = data[i]
          if(item.id == -1){
            data.splice(i,1);
            i--;
          }
        }
        this.optionData = data;
      },


      /*  舍弃
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        let tempArr = [];
        let timeRecords = []
        for(var i=0,item;i<this.course.length;i++){
           item = this.course[i];
          tempArr.push(item.sltTimeId);
          if(item.sltTimeId!=""){
            timeRecords.push(i+1);
          }else{
            timeRecords.push(null);
          }
        }
        myData.timeRecords = timeRecords.join(",");
        myData.teachRoomDepId = tempArr.join(",");
        return myData;
      },


      //选中值发生变化时触发
      change(val){

      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','add');
      },

      //添加数据
      addCourse(){
        this.course.push({
          start:'',
          end:'',
          time:'',
          sltTimeId:''
        })
      },

      /**
       * 移除时间范围限制并且移除数据
       * */
      removeCourse(index){
        if(this.course.length<1 || this.course.length===1){
          this.showMess('只剩最后一个了！');
          return;
        }
        this.range.splice(index*2,2);
        this.course.splice(index,1);
      },

    },
    created(){
      this.init();
    },
    mounted(){
    },
    components: {timeQuantum}
  }
</script>

