<!----------------------------------
****--暂停轮转(pauseRotate)
****--@date     2017/7/3
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-form :model="formValidate" :rules="rules" ref="formValidate" label-width="140px">
      <el-form-item label="暂停时间：" prop="pauseTime">
        <el-date-picker
          v-model="formValidate.pauseTime"
          type="date"
          placeholder="选择日期"
          :editable="false"
          :picker-options="pickerOptions0"
          @change="handleStartTime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="恢复时间：" prop="restoreTime">
        <el-date-picker
          v-model="formValidate.restoreTime"
          align="right"
          type="date"
          :editable="false"
          placeholder="选择日期"
          :picker-options="pickerOptions1"
          @change="handleEndTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="暂停事由：" prop="stopMess">
        <el-input type="textarea" v-model="formValidate.stopMess"></el-input>
      </el-form-item>
    </el-form>
    <br />
    <el-row>
      <el-col :span="3">&nbsp;</el-col>
      <el-col :span="9" style="text-align: center;"><load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn></el-col>
      <el-col :span="9" style="text-align: center;"><el-button @click="cancel">取消</el-button></el-col>
      <el-col :span="3">&nbsp;</el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入当前组件字典api
  import api from "../api.js";
  import {pauseRotate as rules} from "../../rules.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        rules,
        //表单数据bind
        formValidate:{
          pauseTime:"",
          restoreTime:"",
          stopMess:"",
        },

        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},

        //保存
        saveMessTitle:{
          type:'pause',
          successTitle:'暂停设置成功!',
          errorTitle:'暂停设置失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.pauseRotary.path+"/"+this.operailityData["userId"],
            method: api.pauseRotary.method,
            params:{}
          },
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        //this.ajax(this.getGroupMessTitle);
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let option = Util._.defaultsDeep({},this.saveMessTitle);
          option.ajaxParams.url += "?"+Util.serializeParams(this.getFormData(this.formValidate));
          this.ajax(option, isLoadingFun);
        }
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


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        myData["pauseTime"] = this.conductDate(myData["pauseTime"]);
        myData["restoreTime"] = this.conductDate(myData["restoreTime"]);
        return myData;
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','pause');
      },

    },
    created(){
      Util = this.$util;
      this.init();
    },
    mounted(){
    },
    components: {}
  }
</script>
