<!--
****--@file     contract_input.vue
****--@date     2018/10/12 10:23
****--@author   WH
****--@describe   合同添加
-->
<template>
  <div class="editForm">
    <el-form :model="formValidate" ref="formValidate" label-width="124px" :rules="rules">
      <el-row>

        <el-col :span="8" :offset="2">
          <el-form-item label="合同名称：" prop="contractName" placeholder="请输入" required>
            <el-input v-model="formValidate.contractName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="合同编号：" prop="contractNumber" placeholder="请输入" required>
            <el-input v-model="formValidate.contractNumber"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="甲方：" prop="firstParty" placeholder="请输入" required>
            <el-input v-model="formValidate.firstParty"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="乙方：" prop="partyB" placeholder="请输入" required>
            <el-input v-model="formValidate.partyB"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="合同金额：" prop="price" placeholder="请输入" required>
            <el-input v-model="formValidate.price"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="签署日期：" prop="partyB" placeholder="请输入" required>
            <el-date-picker v-model="formValidate.signDate" :editable="false" placeholder="选择日期"
                            :picker-options="pickerOptions0" @change="setDay"
                            style="width:130px;">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-col :span="2" :offset="2"><p><strong>附件:</strong></p></el-col>
          <el-col :span="17">
            <upload-file :show="cannotInput" :unSize="true" :uploadFiles="fileList"
                         @setUploadFiles="setFiles"></upload-file>
          </el-col>
        </el-col>


      </el-row>
    </el-form>

    <el-row style="margin-top: 10px">
      <el-col :span="24" align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  let Util = null
  import api from './api'
  import {contract as rules} from '../rules'
  import channal from './channal.vue'
  export default {
    props:['id'],
    data () {
      return {
        rules,
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent',
        },
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path,
            method: api.add.method
          }
        },
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.edit.path+this.id,
            method: api.edit.method
          }
        },
        cannotInput: false,
        fileList: [],
        //form表单bind数据
        formValidate: {
          contractNumber:'',
          contractName:'',
          firstParty:"",
          partyB:"",
          price:"",
          signDate:"",
          fileIds:''
        },
      }
    },
    methods: {
      setDay(){
        this.formValidate.signDate=this.conductDate(this.formValidate.signDate ,'yyyy-MM-dd')
      },
      /*
  * 点击提交按钮 监听是否提交数据
  * @param isLoadingFun boolean  form表单验证是否通过
  * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate')
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {}
          isLoadingFun(true)
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate)
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate)
          this.ajax(this.id?this.editMessTitle:this.addMessTitle, isLoadingFun)
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
      * 获取表单数据
      * @return string  格式:id=0&name=aa
      * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      //初始化请求列表数据
      init () {
        Util = this.$util
        if(this.id){
          this.getData()
        }
      },
      getData(){
        let opt = {
          ajaxSuccess: "getShowDataSuccess",
          ajaxParams:{
            url:api.get.path + this.id,
            method: api.get.method
          }
        };
        this.ajax(opt)
      },
      getShowDataSuccess(res){
        this.formValidate=res.data;
        this.fileList=res.data.fileList
      },
      //附件
      setFiles (ids) {
        console.log(ids)
        this.formValidate.fileIds = ids||''
      },

    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {channal},
  }

</script>
<style lang="scss">

</style>
