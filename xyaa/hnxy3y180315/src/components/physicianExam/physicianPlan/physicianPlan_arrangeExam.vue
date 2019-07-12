<!--
****--@file     physicianPlan_exam
****--@date     2019-02-15 9:41
****--@author   YC
****--@describe 排课
-->
<template>
  <div ref="examContent" style="overflow:auto; width:100%;">
    <el-row style="border-bottom:1px solid #ccc;">
      <el-col :span="22" align="center">
        <h2>{{operailityData.planName}}</h2>
      </el-col>
      <el-col :span="2" align="right">
        <el-button class="but-col" type="primary" @click="backBtn">返回</el-button>
      </el-col>
    </el-row>
    <el-row style="border-bottom:1px solid #ccc;">
      <el-col :span="24" align="left" style="padding:10px 0px">
        <el-button class="but-col" type="primary" @click="priviewBtn" size="small">排考预览</el-button>
        <el-button class="but-col" type="primary" @click="orderAutoBtn" size="small">考官排考</el-button>
        <el-button class="but-col" type="primary" @click="checkBtn" size="small">规则校验</el-button>
      </el-col>
    </el-row>
    <el-form ref="formValidate" class="demo-form-inline" label-width="110px">
      <el-row style="margin-top:12px;" v-for="(item,indexF) in formValidate" :key="item">
        <el-col :span="24">
          <div class="el-form selectUserBox">
            <fieldset style="min-height:90px;">
              <legend style="font-size:16px">&nbsp;&nbsp;{{item.stationName}}&nbsp;</legend>
              <el-table
                border
                align="center"
                :data="item.list"
                stripe
                tooltip-effect="dark"
                highlight-current-row>
                <el-table-column prop="stationRoomName" label="考室名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="roomNum" label="房间号"></el-table-column>
                <el-table-column>
                  <el-table-column v-for="list in item.timeList" :key="list" :label="list" width="200">
                    <template scope="scope">
                      <el-form :model="scope.row" ref="datasLists">
                        <el-form-item prop="teachName" style="margin-bottom:0px;">
                            <el-row v-if="item.isExaminer == 'YES'" style="width:170px;overflow:hidden;">
                              <el-col :span="20" align="left">
                                <p style="width:100%; line-height:28px;"><span v-for="(teacher,teacherList) in scope.row[list]" style="display:inline;" :class="orderFlag && teacher.isError ? 'checkBg' : ''">{{teacherList == scope.row[list].length - 1 ? teacher.examinerName : (teacher.examinerName + ',')}}</span></p>
                              </el-col>
                              <el-col :span="4" align="right" style="float:right">
                                <el-button size="small" type="primary" @click="selectTeacher(indexF,scope.$index,list)">+</el-button>
                              </el-col>
                            </el-row>
                          <!--</div>-->
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </fieldset>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!--选择监考老师-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="teacherModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1000">
      <modal-header slot="header" :content="teacherId"></modal-header>
      <teacher v-if="teacherModal" @cancel="cancel" @teacher="getTeacher" :initTeacher="teacherList" :examInfo="examInfo" :otherTeachers="otherTeachers" :needNum="needNum"></teacher>
      <div slot="footer"></div>
    </Modal>
    <!--排考预览-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="priviewModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1400">
      <modal-header slot="header" :content="priviewId"></modal-header>
      <exam-priview v-if="priviewModal" @cancel="cancel" :id="operailityData.planId"></exam-priview>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /* 当前组件必要引入 */
  // 排考预览
  import examPriview from './physicianPlan_examPriview'
  // 选择老师
  import teacher from './physicianPlan_teacher'
  // 当前组件引入全局的util
  let Util = null
  export default {
    name: '',
    props:['operailityData'],
    data () {
      return {
        formValidate:[],
        // 选择监考老师
        teacherModal:false,
        teacherId:{
          id:'teacherId',
          title:'候选考官'
        },
        // 排考预览
        priviewModal:false,
        priviewId:{
          id:'priviewId',
          title:'排考预览',
        },
        // 获取数据
        dataTitle:{
          ajaxSuccess:'getData',
          ajaxParams:{
            url:'/zyExaminerArrage/getInfo/' + (this.operailityData ? this.operailityData.planId : ''),
          },
        },
        // 考官排考
        orderTitle:{
          ajaxSuccess:'orderData',
          ajaxParams:{
            url:'/zyExaminerArrage/generate/' + (this.operailityData ? this.operailityData.planId : ''),
            jsonString:true,
            method: 'put',
            data: {},
          },
        },
        orderFlag:false,// 排考标志
        teacherList:[],
        currentIndexF:0, // 当前操作的第一层下标
        currentIndexS:0,// 当前操作的第二层下标
        currentType:'', // 当前操作的时间
        examInfo:'', // 保存需要的参数
        otherTeachers:[], // 存放该站下面相同日期选择的老师
        needNum:0, // 需要考官的数量
      }
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util;
        this.ajax(this.dataTitle); // 获取详情
      },

      /********************* 点击事件 *********************/
      // 点击--返回--按钮
      backBtn(){
        this.$emit('showPage','index');
      },
      // 点击--考官--排考
      orderAutoBtn(){
        this.orderFlag = false;
       this.ajax(this.orderTitle);
      },
      // 点击--校验规则
      checkBtn(){
        this.orderFlag = true;
      },
      // 选择监考老师
      selectTeacher(currentIndexF,currentIndexS,type){
        this.currentIndexF = currentIndexF;
        this.currentIndexS = currentIndexS;
        this.currentType = type;
        this.teacherList = this.formValidate[this.currentIndexF].list[this.currentIndexS][this.currentType];
        this.otherTeachers = [];
        this.needNum = this.formValidate[this.currentIndexF].examinerNum; // 许哟啊考官的数量
        // 存储其他房间在同一天选择的老师
        this.formValidate[this.currentIndexF].list.map((item,index)=>{
          if(index != this.currentIndexS){
            if(item[this.currentType] && item[this.currentType].length > 0){
              item[this.currentType].map((list)=>{
                this.otherTeachers.push(list);
              });
            }
          }
        });
        this.examInfo = {
          examinerId:'',
          planId:this.formValidate[this.currentIndexF].list[this.currentIndexS].planId,
          processId:this.formValidate[this.currentIndexF].list[this.currentIndexS].processId,
          processRoomId:this.formValidate[this.currentIndexF].list[this.currentIndexS].processRoomId,
          taskId:this.formValidate[this.currentIndexF].list[this.currentIndexS].taskId,
          stationId:this.formValidate[this.currentIndexF].list[this.currentIndexS].stationId,
          waitId:this.formValidate[this.currentIndexF].list[this.currentIndexS].waitId,
          stationRoomId:this.formValidate[this.currentIndexF].list[this.currentIndexS].stationRoomId,
          roomId:this.formValidate[this.currentIndexF].list[this.currentIndexS].roomId,
          roomNum:this.formValidate[this.currentIndexF].list[this.currentIndexS].roomNum,
          floor:this.formValidate[this.currentIndexF].list[this.currentIndexS].floor,
          invigilateDate:type
        }
        this.openModel('teacher');
      },
      // 选择老师回调
      getTeacher(data,isRight){
        let temp = [];
        if(data && data.length > 0){
          data.map((item)=>{
            temp.push({
              examinerId:item.id,
              examinerName:item.name,
              isError:isRight.length > 0 ? true : false,
            });
          });
        }
        this.formValidate[this.currentIndexF].list[this.currentIndexS][this.currentType] = temp;
        this.cancel('teacher');
      },
      // 点击--排考预览--按钮
      priviewBtn(){
        this.orderFlag = false;
        this.openModel('priview');
      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
      },

      /******************** end **************************/
      // 考官排考
      orderData(res){
        this.ajax(this.dataTitle); // 获取详情
      },
      // 获取编辑的数据
      getData(res){
        let tempArr = [];
        let data = res.data || [];
        data.map((item)=>{
          let allTeachersList = {};
          let temp = {
            stationName:item.stationName,
            isExaminer:item.isExaminer,
            examinerNum:item.examinerNum,
            timeLong:item.timeLong,
            planId:item.planId,
            isStation:item.isStation,
            examForm:item.examForm,
            timeList:[],
            list:[],
          }
          if(item.dateList && item.dateList.length > 0){
            item.dateList.map((time)=>{
              temp.timeList.push(time.executeDate);
              if(time.zyTaskStationWaitRoomList && time.zyTaskStationWaitRoomList.length > 0){
                time.zyTaskStationWaitRoomList.map((room)=>{
                  let flag = false;
                  temp.list.map((tempList)=>{
                    if(tempList.roomNum == room.roomNum){
                      flag = true;
                      if(!tempList[time.executeDate]){
                        tempList[time.executeDate] = [];
                      }
                    }
                  });
                  if(!flag){  // 说明之前没有该房间
                    let roomData = {
                      roomNum: room.roomNum,
                      roomId:room.roomId,
                      floor:room.floor,
                      stationRoomName:room.stationRoomName,
                      stationRoomId:room.stationRoomId,
                      planId:room.planId,
                      processId:room.processId,
                      processRoomId:room.processRoomId,
                      taskId:room.taskId,
                      stationId:room.stationId,
                      waitId:room.waitId,
                    };
                    roomData[time.executeDate] = [];
                    temp.list.push(roomData);
                  }
                });
              }
            });
          }
          // 存储老师
          if(item.zyPlanProcessStationWaitRoomList && item.zyPlanProcessStationWaitRoomList.length > 0){
            temp.list.map((stationList)=>{
              item.zyPlanProcessStationWaitRoomList.map((listroom)=>{
                if(stationList.roomNum == listroom.roomNum && stationList.roomId == listroom.roomId){ // 同一个房间
                  if(listroom.zyExaminerArrageList && listroom.zyExaminerArrageList.length > 0){
                    listroom.zyExaminerArrageList.map((listTeacher)=>{
                      let invigilateDate = this.yearMonthData(listTeacher.invigilateDate);
                      if(stationList[invigilateDate] && stationList.roomNum == listTeacher.roomNum){
                        stationList[invigilateDate].push(listTeacher);
                        if(allTeachersList[invigilateDate]){
                          allTeachersList[invigilateDate].push(listTeacher);
                        }else{
                          allTeachersList[invigilateDate] = [];
                          allTeachersList[invigilateDate].push(listTeacher);
                        }
                      }
                    });
                  }
                }
              });
            });
          }
          temp.list.map((jiaoyanList)=>{
            for(let i = 0; i < temp.timeList.length; i ++){ // 时间
              if(jiaoyanList[temp.timeList[i]] && jiaoyanList[temp.timeList[i]].length > 0){ // 该时间下有老师信息
                let flag = false;
                if(temp.examinerNum != jiaoyanList[temp.timeList[i]].length){
                  flag = true; // 数量不按要求
                }
                // 要求：老师不能监考同一场
                // 要求：来自不同单位；来自不同专业；搭配不同职称；搭配不同性别；
                let companyStr = []; // 选择数据的单位
                let majorStr = []; // 选择数据的专业
                let positionStr = []; // 选择数据的职称
                let sexStr = []; // 选择数据的性别
                let sameNameTitle = [];
                let errorStr = [];
                let tempTeacher = [];
                jiaoyanList[temp.timeList[i]].map((teachersInfo)=>{
                  let flagTime = false;
                  if(teachersInfo.invigilateDateList){
                    for(let i = 0; i < teachersInfo.invigilateDateList.length;i ++){
                      if(teachersInfo.invigilateDate == teachersInfo.invigilateDateList[i]){
                        flagTime = true;
                      }
                    }
                  }
                  if(!flagTime){  // 不在可期待的日期内
                    flag = true;
                  }
                  majorStr.push(teachersInfo.major); // 专业
                  positionStr.push(teachersInfo.position); // 职称
                  companyStr.push(teachersInfo.company); // 公司
                  sexStr.push(teachersInfo.sex); // 性别
                });
                if(jiaoyanList[temp.timeList[i]].length <= 4){
                  if(jiaoyanList[temp.timeList[i]].length <= 3){
                    if(jiaoyanList[temp.timeList[i]].length == 2){
                      if(this.uniq(sexStr).length != jiaoyanList[temp.timeList[i]].length){ // 性别有重复
                        flag = true;
                      }
                    }
                    if(this.uniq(majorStr).length != jiaoyanList[temp.timeList[i]].length){ // 专业有重复 3
                      flag = true;
                    }
                  }
                  if(this.uniq(positionStr).length != jiaoyanList[temp.timeList[i]].length){ // 职称有重复 4
                    flag = true;
                  }
                }else{
                  if(this.uniq(sexStr).length != 2){ // 性别有重复
                    flag = true;
                  }
                  if(this.uniq(majorStr).length != 3){ // 专业有重复 3
                    flag = true;
                  }
                  if(this.uniq(positionStr).length != 4){ // 职称有重复 4
                    flag = true;
                  }
                }
                if(this.uniq(companyStr).length != jiaoyanList[temp.timeList[i]].length){ // 单位有重复
                  flag = true;
                }
                if(flag){
                  jiaoyanList[temp.timeList[i]].map((teachersInfo)=>{
                    teachersInfo.isError = true;
                  });
                }
              }
            }
          });
          tempArr.push(temp);
        });
        this.$nextTick(() => {
          this.formValidate = tempArr;
        });
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.examContent;
        let parHt = content.parentNode.parentNode.offsetHeight;
        let paginationHt = 20;
        $(content).css('height',parHt - paginationHt)
      },
      /*
       * 打开指定的模态窗体
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      /*
      * 作用:根据不同的参数关闭对应的模态
      * */
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      // 将字符串转化成时间
      yearMonthData (date) {
        if(!date){
          return;
        }
        let datetime = new Date(date);
        let year = datetime.getFullYear();
        let month = datetime.getMonth() + 1;
        let D = datetime.getDate();
        if (month < 10) {
          month = '0' + month;
        }
        if (D < 10) {
          D = '0' + D;
        }
        return year + '-' + month + '-' + D;
      },
      // 对数组进行去重
      uniq(array){
        let temp = []; //一个新的临时数组
        for(let i = 0; i < array.length; i++){
          if(temp.indexOf(array[i]) == -1){
            temp.push(array[i]);
          }
        }
        return temp;
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
    components: {teacher,examPriview},
  }

</script>
<style>
  .selectUserBox .checkBg{
    color:#f30002;
  }
</style>
