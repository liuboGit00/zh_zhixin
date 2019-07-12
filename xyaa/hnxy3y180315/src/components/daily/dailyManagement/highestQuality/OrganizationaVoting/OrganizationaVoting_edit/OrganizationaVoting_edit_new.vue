<!--组织投票-->
<!-- 新建-->

<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <!--<el-col :span="14" :offset="2">-->
          <!--<el-form-item label="时间：" prop="startDate">-->
            <!--<el-date-picker v-model="formValidate.startDate" type="date" placeholder="选择日期"-->
                            <!--:editable="false"-->
                            <!--:picker-options="pickerOptions0" @change="handleStartTime">-->
            <!--</el-date-picker>-->
            <!--到-->
            <!--<el-date-picker v-model="formValidate.endDate" align="right" type="date" placeholder="选择日期"-->
                            <!--:editable="false"-->
                            <!--:picker-options="pickerOptions1" @change="handleEndTime">-->
            <!--</el-date-picker>-->
              <!---->
          <!--</el-form-item>-->
        <!--</el-col>-->
          <date-group :dateGroup="{text:'',startDate:formValidate.startDate,endDate:formValidate.endDate}" style="display:inline-block;margin-left: 75px">
          <el-form-item style="float: left"  label="时间：" prop="startDate">
          <el-date-picker name="start" v-model="formValidate.startDate" :editable="false" type="datetime" format="yyyy-MM-dd HH：mm" placeholder="选择日期" :picker-options="pickerOptions0" @change="handleStartTime"></el-date-picker>
          </el-form-item>
          <el-form-item style="float: left;" class="OrganizationaVoting-gang" label="-" prop="endDate">
          <el-date-picker name="end" v-model="formValidate.endDate" :editable="false" type="datetime" format="yyyy-MM-dd HH：mm"  placeholder="选择日期" :picker-options="pickerOptions1" @change="handleEndTime"></el-date-picker>
          </el-form-item>
          </date-group>
          <el-col :span="6" style="float: right;margin-right: 77px">
              <el-form-item label="票权：" prop="votePower">
                  <el-input v-model="formValidate.votePower" placeholder="请输入"></el-input>
              </el-form-item>
          </el-col>

      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="投票人：" prop="voterScope">
            <el-radio-group v-model="formValidate.voterScope" @change="changeVoterScope">
              <el-radio label="GROUP">本班</el-radio>
              <el-row>
                <el-col>
                  <div class="grid-content-ptop">
                    <el-radio label="DEP">科室</el-radio>
                    <keep-alive>
                      <el-select v-if="formValidate.voterScope == 'DEP'" filterable v-model="formValidate.depId"
                                 style="margin-left: 10px" filterable placeholder="请选择">
                        <select-option></select-option>
                      </el-select>
                    </keep-alive>
                  </div>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="规则：" prop="voteRule">
            <el-input v-model="formValidate.voteRule" type="textarea" :rows="5" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item v-model="formValidate.userIds" label="被投对象：" prop="userIds">
            {{ userName }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--<load-btn class="OrganizationaVoting" @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>-->
  </div>
</template>
<script>
  let Util = null;
  import {organizationaVotingRditNew as rules} from '../../../rules';

  export default {
    props: ['recommendPerson', 'selectProjectId', 'getData', 'voteId'],
    data() {
      return {
        rules,
        dep: false,
        //保存按钮基本信息
//        loadBtn: {
//          title: '完成',
//          callParEvent: 'listenSubEvent'
//        },
        userName: '',
        countDate: 0,
        //form表单bind数据

        formValidate: {
          appraisingId: '', //评优项目id
          title: '', //投票项目标题
          startDate: '', //开始时间
          endDate: '', //结束时间
          voterScope: 'GROUP', //投票人范围
          depId: '', //科室id
          userIds: '', //被投票人id字符串
          grade: '', //年级
          voteGroup: '', //班级
          voteRule: '', //规则
          votePower:'1',//票权
        },

        columnModal: false,
        columnId: {
          title: '提交',
          callParEvent: 'searchEvent'
        },

        api: {
          add: {
            path: 'appraising/vote/project/add',
            method: 'post'
          },
          edit: {
            path: 'appraising/vote/project/modify/',
            method: 'put'
          },
        },
        editType: 'add',
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //暂时没有初始化,预留初始化入口
      this.init();
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init() {
        if (this.voteId && this.getData) {
          this.editType = 'edit';
          this.getEditData()
        }
        this.initUser()
      },

      initUser() {
        let user = [];
        let userId = [];
        if (this.recommendPerson) {
          this.recommendPerson.map(item => {
            user.push(item.userName);
            userId.push(item.userId);
          })
        }
        this.userName = user.join('、')
        this.formValidate.userIds = userId.join(',')
          if(this.formValidate.depId==null){
              this.formValidate.depId=''
          }
      },

      getEditData() {
        for (let key in this.formValidate) {
          this.formValidate[key] = this.getData[key]
        }
      },

      changeVoterScope(val) {
        if (val == 'GROUP') {
          this.formValidate.depId = ''
        }
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent() {
        let isSubmit = this.submitForm("formValidate");
        let msg = {
          add: "添加",
          edit: "修改"
        };
        if (isSubmit) {
          let userIdArr = this.formValidate.userIds.split(',');
          if(+this.formValidate.votePower>userIdArr.length){
           this.errorMess('票权不能大于被投对象数');
            return;
          }
          let opt = {
            ajaxSuccess: () => this.$emit(this.editType),
            ajaxError: () => this.errorMess(msg[this.editType] + '失败'),
            ajaxParams: {
              url: this.api[this.editType].path + (this.editType === 'add' ? '' : this.voteId),
              method: this.api[this.editType].method,
              data: this.conductFormValidate(this.getFormData(this.formValidate))
            }
          };
          this.ajax(opt)
        }
        return isSubmit
      },


      //为提交处理数据
      conductFormValidate(data) {
        data = this.formDate(data, ['startDate', 'endDate'], 'yyyy-MM-dd HH:mm');
        data.appraisingId = this.selectProjectId;
//        data.userIds = this.conductUserIds(this.recommendPerson);
        data.grade = this.recommendPerson[0].grade;
        data.voteGroup = this.recommendPerson[0].group;
        return data;

      },

      conductUserIds(data) {
        if (typeof data != 'object' || typeof data.length == 'undefined') return;
        let ids = [];
        for (let i = 0; i < data.length; i++) {
          data[i].userId && ids.push(data[i].userId)
        }
        return ids.join(',')
      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * 注:当前为添加页面暂时未用到,属于预留
       * */
      oneDataSuccess(res) {

      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', this.addMessTitle.type);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },

      columnCallback() {

      },
      subCancel() {
        this.columnModal = false;
      },
    },
    watch: {
      recommendData() {
        this.initUser()
      },
    }
  }

</script>
<style>
    .OrganizationaVoting-gang  .el-form-item__label:before{
                display: none;
    }
    .OrganizationaVoting-gang  .el-form-item__label{
        width: 20px !important;
        padding: 5px 0px !important;
        line-height: 20px !important;
    }
    .OrganizationaVoting-gang  .el-form-item__content{
        margin-left: 30px !important;
    }
</style>
