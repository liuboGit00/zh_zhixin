<template>
  <!--归还-->
  <div class="editForm">
    <el-form :model="formValidate" ref="formValidate" :rules="rules"
             label-width="100px">
      <el-row>

        <el-col :span="8" :offset="2">
          <el-form-item label="资产名称：" prop="assetName">
            <el-select v-model="formValidate.baseId" filterable disabled
                       placeholder="请选择" @change="selectDeviceTypeId">
              <el-option v-for="item in assetNameList" :key="item.baseId"
                         :label="item.assetName" :value="item.baseId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="资产编号：" required>
            <el-input v-model="formValidate.assetNumber" placeholder="请输入"
                      disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="借用人：" prop="borrower" required>
            <el-input v-model="formValidate.borrower" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2" name="start">
          <el-form-item label="借用时间：" prop="startTime" required>
            <el-date-picker v-model="formValidate.borrowTime" :editable="false"
                            disabled
                            type="date" placeholder="选择日期"
                            :picker-options="pickerOptions0"
                            @change="handleStartTime">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="18" :offset="2">
          <el-form-item label="用途：" prop="remark" required>
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}"
                      v-model="formValidate.purpose" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="18" :offset="2">
          <el-form-item label="配件：" prop="remark">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}"
                      v-model="formValidate.parts" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="归还人：" prop="restituer" required>
            <el-input v-model="formValidate.restituer"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2" name="start">
          <el-form-item label="归还时间：" prop="returnTime" required>
            <el-date-picker v-model="formValidate.returnTime" :editable="false"
                            type="date" placeholder="选择日期">
            </el-date-picker>
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
    deviceLoan as rules,
  } from '../../rules' // 表单验证规则
  import selectDeviceApi from '../api' // 选择设备API

  //当前组件引入全局的util
  let Util = null
  let submitTime='';
  export default {
    props: {
      depId: {
        type: [String, Number],
        required: true,
      },
      pickerOptions3: {
        disabledDate(time) {
          console.log(Date.now(),submitTime)
          return time.getTime() <submitTime- 8.64e7;
        }
      },
      id: {
        type: [Number, String],
        required: true,
      },
      urlParams: { // api对象
        type: Object,
        required: true,
      },

    },
    data () {
      return {
        rules,
        selectIndex: '', // 选中的设备名称索引
        selectTypeIndex: '', // 选中的设备类型索引
        selectObj: [], // 选择设备
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent',
        },
        countDate: 0,
        //form表单bind数据
        formValidate: {
          baseId: '', // 基础信息id
          assetsId: '', // 资产id
          assetName: '', // 资产名称
          treeId: '', // 资产分类id
          treeRoad: '', // 分类路径
          assetNumber: '', // 	资产编码
          price: '', // 	单价
          borrower: '', // 借用人
          borrowTime: '', // 借出时间
          parts: '', // 维修说明
          restituer: '', // 归还人
          returnTime: '', // 归还时间
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        backMessTitle: {
          type: 'back',
          successTitle: '归还成功!',
          errorTitle: '归还失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api.modifyReturn.path,
            method: api.modifyReturn.method,
          },
        },
        pickerOptions: {},
        assetNameList: null,
        activeObj: null,//当前选中的资产
        isEdit: this.activeObj,
        pickerOptions0: {
          disabledDate (time) {
            return time.getTime() < Date.now()
          },
        },
      }
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util
      this.init()
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
//        if (this.parseTimestamp(this.formValidate.returnTime) <
//          this.parseTimestamp(this.formValidate.borrowTime)) {
//          this.errorMess('归还时间不能小于借出时间!')
//          return
//        }
        let isSubmit = this.submitForm('formValidate')
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {}
          isLoadingFun(true)
          let data = {
            'assetsId': this.formValidate.assetsId,
            'restituer': this.formValidate.restituer,
            'returnTime': this.conductDate(this.formValidate.returnTime,
              'yyyy-MM-dd'),
          }
          this.backMessTitle.ajaxParams.url = this.backMessTitle.ajaxParams.url +
            '/' + this.formValidate.assetsBorrowId
          this.backMessTitle.ajaxParams.data = this.getFormData(
            data)

          this.ajax(this.backMessTitle, isLoadingFun)
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
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.selectIndex = '' // 选中的设备名称索引
        this.selectTypeIndex = '' // 选中的设备类型索引
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data)
        return myData
      },
      /**
       * 获取选择设备列表
       * */
      getSelectData () {
        this.ajax({
          ajaxSuccess: 'getSelectDataSuccess',
          ajaxParams: {
            url: selectDeviceApi.select.path,
            method: selectDeviceApi.select.method,
            params: {
              assetName: '',
              assetNumber: '',
            },
          },
        })
      },
      /**
       * 初始化选择列表
       * */
      getSelectDataSuccess (res) {
        this.assetNameList = res.data
      },
      // 设置设备编号id
      selectDeviceId (val) {
        this.assetNameList.map((item) => {
          if (item.baseId == this.formValidate.baseId) {
            this.activeObj = item
            this.formValidate.assetName = item.assetName
            this.formValidate.assetNumber = item.assetNumber
          }
        })
      },
      // 设置设备id
      selectDeviceTypeId (val) {
        this.assetNameList.map((item) => {
          if (item.baseId == this.formValidate.baseId) {
            this.activeObj = item
            this.formValidate.assetName = item.assetName
            this.formValidate.assetNumber = item.assetNumber
          }
        })
      },
      // 归还时间
      borrowTime (time) {
        let beginDateVal = this.formValidate.borrowTime
        if (beginDateVal) {
          return time.getTime() < beginDateVal
        }
        return true
      },
      /*
       * 组件初始化入口
       * */
      init () {
        this.getSelectData()
        if (this.id) { //传入了借用ID
          this.getDataForServer() //获取数据
        }
      },
      getDataForServer () {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: `${this.urlParams.path}/${this.id}`,
            method: this.urlParams.method,
            params: {
              // id: this.id,
            },
          },
        })
      },
      getDataSuccess (res) {
        this.formValidate = res.data // 初始化编辑数据
        submitTime=new Date(this.formValidate.borrowTime).getTime()
      },
      cancel () {
        this.$emit('cancel', 'back')
      },
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
