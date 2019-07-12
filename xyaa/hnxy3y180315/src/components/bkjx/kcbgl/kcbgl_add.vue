<template>
  <div class="editForm">
    <el-form :model="formValidate" ref="formValidate" :rules="rules"
             label-width="100px">
      <el-row v-if="formValidate">
        <el-col :span="8" :offset="2">
          <el-form-item name="start" label="上课日期：" class="feildFontweight pmStartDateBox" prop="courseDate">
            <el-date-picker v-model="formValidate.courseDate" type="date" :editable="false" placeholder="选择日期" width="150"
                            :picker-options="pickerOptions0" @change="handleStartTime">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item name="start" label="周次：" class="feildFontweight pmStartDateBox" prop="weekTimes">
            <el-input placeholder="请输入" v-model="formValidate.weekTimes"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item name="start" label="节次：" class="feildFontweight pmStartDateBox" prop="sectionOrderStart">
            <el-input placeholder="请输入" v-model="formValidate.sectionOrderStart" @change="sectionChange"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <span class="pmDateText" style="line-height: 36px;margin-left: 20px;">至</span>
        </el-col>
        <el-col :span="6">
          <el-form-item name="end" labelWidth="10px" prop="sectionOrderEnd" class="pmEndDateBox">
            <el-input placeholder="请输入" v-model="formValidate.sectionOrderEnd" @change="sectionChange"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" name="start" :offset="2">
          <el-form-item  prop="weekDay" label="星期：">
            <span v-if="formValidate.courseDate">{{formValidate.weekDay}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="8" name="start">
          <el-form-item  prop="classHour" label="学时：">
            <span v-if="formValidate.sectionOrderStart && formValidate.sectionOrderEnd">{{formValidate.classHour}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2" name="start">
          <el-form-item  prop="grade" label="年级：">
            <el-input placeholder="请输入" v-model="formValidate.grade"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item  prop="specialty" label="专业：">
            <el-input placeholder="请输入" v-model="formValidate.specialty"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item  prop="groupTeam" label="组别：">
            <el-input placeholder="请输入" v-model="formValidate.groupTeam"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item  prop="studentNum" label="人数：">
            <el-input placeholder="请输入" v-model="formValidate.studentNum" @change="studentChange"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2" name="start">
          <el-form-item  prop="courseContent" label="课程内容：">
            <el-input placeholder="请输入" v-model="formValidate.courseContent"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="课程名称：" prop="courseName">
            <el-input placeholder="请输入" v-model="formValidate.courseName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2" name="start">
          <el-form-item  prop="courseCode" label="课程编号：">
            <el-input placeholder="请输入" v-model="formValidate.courseCode"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" name="start"jobTitle>
          <el-form-item  prop="teacherName" label="教师：">
            <el-input placeholder="多个教师需用、隔开" v-model="formValidate.teacherName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2" name="start">
          <el-form-item  prop="jobTitle" label="职称：">
            <el-input placeholder="多个职称需用、隔开" v-model="formValidate.jobTitle"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" name="start">
          <el-form-item  prop="jysName" label="教研室：">
            <el-input placeholder="请输入" v-model="formValidate.jysName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="授课地点：" prop="teachPlace">
            <el-input placeholder="多个授课地点需用、隔开" v-model="formValidate.teachPlace"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item  prop="userHour" label="人时：">
            <el-input placeholder="请输入" v-model="formValidate.userHour" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item  prop="schoolYear" label="学年：">
            <el-input placeholder="请输入" v-model="formValidate.schoolYear"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item  prop="term" label="学期：">
            <el-input placeholder="请输入" v-model="formValidate.term"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <el-row>
      <el-col :span="6" :offset="6" align="center">
        <load-btn @listenSubEvent="listenSubEvent"
                  :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="6" align="center">
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import api from './api'
  import {
    classManage as rules,
  } from '../rules' // 表单验证规则
  import selectDeviceApi from './api' // 选择设备API
  let submitTime=''
  //当前组件引入全局的util
  let Util = null
  export default {
    props: {
      todoId: {
        type: Object,
        default: () => ({
          id: '',
          treeId: 0,
          treeRoad: '0'
        })
      },
      editType: {
        type: String,
        default: 'add' // add增加、edit修改
      },
      urlParams: { // api对象
        type: Object,
      },
      isEdit: false,
    },
    data () {
      return {
        pickerOptions3: {
          disabledDate(time) {
            console.log(time.getTime() <submitTime- 8.64e7)
            return time.getTime() <submitTime- 8.64e7;
          }
        },
        rules,
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent',
        },
        //form表单bind数据
        formValidate: {
          treeId:-1,
          courseDate:'',//  日期
          teachPlace:'',//授课地点
          sectionOrder:'',//节次
          sectionOrderStart:'',//节次开始
          sectionOrderEnd:'',//节次结束
          classHour:'',//学时
          specialty:'',//专业
          groupTeam:'',//组别
          studentNum:'',//人数
          courseContent:'',//课程内容
          courseName:'',//课程名称
          courseCode:'',//课程编号
          teacherName:'',//教师
          grade:'',//年级
          jobTitle:'',//职称
          jysName:'',//教研室
          userHour:'',//人时
          schoolYear:'',//学年
          term:'',//学期
          weekDay:'',//星期
          weekTimes:'',//周次
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          error: 'submitError',
          allowError:false,
          ajaxParams: {
            jsonString: true,
            url: api.addMessTitle.path,
            method: api.addMessTitle.method,
          },
        },
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          error: 'submitError',
          allowError:false,
          ajaxParams: {
            jsonString: true,
            url: api.editMessTitle.path,
            method: api.editMessTitle.method,
          },
        },
        pickerOptions: {},



      }
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util
      this.init()
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init () {
        if(this.editType !=='add'){
          let getMessTitle = {
              ajaxSuccess: 'getMessSuccess',
              ajaxError: 'ajaxError',
              ajaxParams: {
              jsonString: true,
                url: api.getMessTitle.path + this.todoId.id,
                method: api.getMessTitle.method,
            },
          }
          this.ajax(getMessTitle)
        }

      },

      submitError(res){
        this.errorMess(res.status.msg)
        return
      },

      sectionChange(){
        if(Number(this.formValidate.sectionOrderEnd) > 0 && Number(this.formValidate.sectionOrderStart) > 0 && Number(this.formValidate.sectionOrderStart) <= Number(this.formValidate.sectionOrderEnd)){
          this.formValidate.classHour = Number(this.formValidate.sectionOrderEnd) - Number(this.formValidate.sectionOrderStart) +1
        }else{
          this.formValidate.classHour = ''
          // this.errorMess('请正确输入节次')
        }
        let temp = 0;
        if (!isNaN(this.formValidate.studentNum)) {
          temp += +(this.formValidate.studentNum * this.formValidate.classHour);
        }
        this.formValidate.userHour = temp;
      },

      handleStartTime(){
        this.formValidate.weekDay = this.getWeek(this.formValidate.courseDate)
      },
      //获取当前时间属于星期几
      getWeek(date){
        if(navigator.userAgent.indexOf("Firefox")>0){
//          date &&(date =date+'T09:00:00');
          date = date ? Date.parse(date) : new Date().getTime();
        }
        let week;
        let time = new Date(date);
        week = time.getDay();
        switch (week) {
          case 0 :
            week = '日';
            break;
          case 1 :
            week = '一';
            break;
          case 2 :
            week = '二';
            break;
          case 3 :
            week = '三';
            break;
          case 4 :
            week = '四';
            break;
          case 5 :
            week = '五';
            break;
          case 6 :
            week = '六';
            break;
        }
        return week;
      },

      //修改获取数据   回显
      getMessSuccess(res){
        this.formValidate = res.data
      },

      studentChange(){
        let temp = 0;
        if (!isNaN(this.formValidate.studentNum)) {
          temp += +(this.formValidate.studentNum * this.formValidate.classHour);
        }
        this.formValidate.userHour = temp;
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        this.formValidate.treeId = this.todoId.treeId
        this.formValidate.weekTimes = Number(this.formValidate.weekTimes)
        this.formValidate.sectionOrderStart = Number(this.formValidate.sectionOrderStart)
        this.formValidate.sectionOrderEnd = Number(this.formValidate.sectionOrderEnd)
        this.formValidate.classHour = Number(this.formValidate.classHour)
        this.formValidate.studentNum = Number(this.formValidate.studentNum)

        if(this.formValidate.studentNum === 0){
          this.errorMess('人数不能为0')
          return
        }
        if(this.formValidate.sectionOrderEnd < this.formValidate.sectionOrderStart){
          this.errorMess('结束节次必须大于开始节次')
          return
        }
        if(this.formValidate.sectionOrderEnd > 10 || this.formValidate.sectionOrderStart >10){
          this.errorMess('节次最多为10节')
          return
        }
        if((this.formValidate.sectionOrderStart <= 4) && (this.formValidate.sectionOrderEnd >= 5) && (this.formValidate.sectionOrderEnd <= 10) ){
          this.errorMess('上下午节次不能同时选')
          return
        }
        if(this.formValidate.teacherName.split('、').length !== this.formValidate.jobTitle.split('、').length){
          this.errorMess('职称应与教师对应')
          return
        }

        let isSubmit = this.submitForm('formValidate')
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {}
          isLoadingFun(true)

          this.formValidate.userHour = this.formValidate.classHour * this.formValidate.studentNum
          this.formValidate.sectionOrder = this.formValidate.sectionOrderStart + '-' +this.formValidate.sectionOrderEnd
          this.formDate(this.formValidate, ['courseDate'], 'yyyy-MM-dd');

          if (this.editType !=='add') {
            this.editMessTitle.ajaxParams.url = this.editMessTitle.ajaxParams.url +
              '/' + this.todoId.id
            this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate)
          } else {
            this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate)
          }
          if (this.editType !=='add') {
            this.ajax(this.editMessTitle, isLoadingFun)
          } else {
            this.ajax(this.addMessTitle, isLoadingFun)
          }
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true
          }
        })
        return flag
      },
      /*
       * 重置当前表单
       * */
      cancel () {
        if (this.editType !=='add') {
          this.$emit('cancel', 'edit')
        } else {
          this.$emit('cancel', 'add')
        }
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data)
        return myData
      },
    },
    components: {
    },
  }

</script>

<style lang="scss">
  .editForm {
    .el-date-editor.el-input {
      width: 100%;
    }
    .el-select {
      width: 100%;
    }
  }

</style>
