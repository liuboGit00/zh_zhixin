<!--
****--@file     physicianPlan_message
****--@date     2019-02-15 9:41
****--@author   YC
****--@describe 短信通知
-->
<template>
  <div style="max-height:1000px; overflow:auto;">
    <el-form :model="formValidate" ref="formValidate" class="demo-form-inline" label-width="110px">
      <el-row>
        <el-col :span="20">
          <el-form-item label="所选考官">
            <span v-for="(item,index) in messData" :key="item">{{index == (messData.length - 1) ? item.examinerName : (item.examinerName + ',')}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="短信类型" prop="sendType">
            <el-radio-group v-model="formValidate.sendType">
              <el-radio label="NOTICE">预约执考</el-radio>
              <el-radio label="REMIND">提醒考务</el-radio>
              <el-radio label="CUSTOM">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formValidate.sendType == 'CUSTOM'">
        <el-col :span="20">
          <el-form-item label="短信内容" prop="contents">
            <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="formValidate.contents">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="margin-top:20px;">
      <el-col :span="24" align="center">
        <el-button class="but-col" type="primary" @click="cancleBtn">取消</el-button>
        <el-button class="but-col" type="primary" @click="sendBtn">发送</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /* 当前组件必要引入 */
  // 当前组件引入全局的util
  let Util = null
  export default {
    name: '',
    props:['messData'],
    data () {
      return {
        formValidate:{
          sendType:'', // 类型
          contents:'', // 短信内容
        },
        // 发送短信
        dataTitle:{
          ajaxSuccess:'sendMessage',
          ajaxParams:{
            jsonString:true,
            url:'/zyExaminerArrage/sendMsg/',
            method: 'post',
            data: {},
          }
        },
      }
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util;
      },
      // 点击--取消--按钮
      cancleBtn(){
        this.$emit('cancel');
      },
      // 点击--发送--按钮
      sendBtn(){
        if(!this.formValidate.sendType){
          this.showMess('请选择短信发送类型');
          return;
        }
        if(this.formValidate.sendType == 'CUSTOM'){
          if(!this.formValidate.contents){
            this.showMess('请输入短信内容');
            return;
          }
        }else{
          this.formValidate.contents = '';
        }
        let temp = [];
        this.messData.map((item)=>{
          temp.push(item.examinerArrageId);
        });
        this.dataTitle.ajaxParams.url = '/zyExaminerArrage/sendMsg/' + temp.join(',') + '?sendType=' + this.formValidate.sendType +
        '&contents=' + this.formValidate.contents;
        this.ajax(this.dataTitle);
      },
      // 发送成功
      sendMessage(res){
        this.$emit('message','message','发送成功');
      },
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {},
  }

</script>
