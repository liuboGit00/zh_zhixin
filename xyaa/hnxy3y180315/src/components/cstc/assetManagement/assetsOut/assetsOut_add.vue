<template>
  <div class="editForm">
    <el-form :model="formValidate" ref="formValidate" label-width="124px"
             :rules="rules">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="资产分类：" prop="treeId">
            <el-input v-model="formValidate.treeName"
                      placeholder="请选择" disabled @input="inputStorageLocation">
              <el-button slot="append" @click="selectTreeModal=true">选择资产分类</el-button>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="资产名称：" prop="baseId">
            <el-select v-model="formValidate.baseId" filterable
                       :disabled="isEdit"
                       placeholder="请选择" @change="selectDeviceTypeId">
              <el-option v-for="item in assetNameList" :key="item.baseId"
                         :label="item.assetName" :value="item.baseId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="资产编号：" prop="assetNumber" required>

            <el-select v-model="formValidate.assetNumber" filterable
                       :disabled="isEdit"
                       placeholder="请选择" @change="selectassetNumber">
              <el-option v-for="item in baseAssetList" :key="item.assetNumber"
                         :label="item.assetNumber" :value="item.assetNumber">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="经手人：" prop="outOperator" required>
            <el-input v-model="formValidate.outOperator"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2" name="outTime">
          <el-form-item label="转出时间：" prop="outTime" required>
            <el-date-picker v-model="formValidate.outTime" :editable="false"
                            type="date" placeholder="选择日期"
                            @change="handleStartTime">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="转出部门：" prop="outDepartment" required>
            <el-input v-model="formValidate.outDepartment"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="18" :offset="2">
          <el-form-item label="转出说明：" prop="outRemark">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}"
                      placeholder=""
                      v-model="formValidate.outRemark"></el-input>
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
        <el-button @click="resetForm('formValidate')">取消</el-button>
      </el-col>
    </el-row>

    <!--选择资产分类-->
    <Modal :mask-closable="false" v-model="selectTreeModal" height="200"
           class-name="vertical-center-modal" :width="400">
      <modal-header slot="header" :content="selectTreeId"></modal-header>
      <select-tree v-if="selectTreeModal" @cancel="selectTreeModal=false"
                   @select="selectTreeCall"
      ></select-tree>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import selectDeviceApi from '../api' // 选择设备API
  import selectTree from '../assetsStorage/deviceStorageMoreInfo/selectTree.vue'
  import {
    deviceOut as rules,
  } from '../../rules' // 表单验证规则
  //当前组件引入全局的util
  let Util = null
  let submitTime=''
  export default {
    props: {
      urlParams: { // api对象
        type: Object,
        required: true,
      },
      depId: {
        type: [String, Number],
        required: true,
      },
      getUrlParams: { // 获取维修记录
        type: Object,
      },
      deptObj: '',//傳過來的數據對象
    },
    data () {
      return {
        pickerOptions3: {
          disabledDate(time) {
            console.log(Date.now(),submitTime)
            return time.getTime() <submitTime- 8.64e7;
          }
        },
        rules,
        selectIndex: '', // 选中的设备名称索引
        selectTypeIndex: '', // 选中的设备类型索引
        assetNameList: [], // 选择设备
        //保存按钮基本信息
        loadBtn: {
          title: '保存',
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
          outOperator:'',
          outDepartment:'',
          outTime:'',
          outRemark:'',
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: this.urlParams.path,
            method: this.urlParams.method,
          },
        },
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: this.urlParams.path,
            method: this.urlParams.method,
          },
        },
        activeObj: null,//当前选中的资产
        isEdit: false,
        baseAssetList: [],
        selectTreeModal:false,
        selectTreeId: {
          id: 'selectTreeId',
          title: '选择资产',
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
        let isSubmit = this.submitForm('formValidate')
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {}
          isLoadingFun(true)
          let data
          this.formValidate.outTime = this.conductDate(this.formValidate.outTime, 'yyyy-MM-dd')
          if (this.deptObj) { //傳入了數據
//            data = {
//              'discarder': this.formValidate.discarder,
//              'scrapRemarks': this.formValidate.scrapRemarks,
//              'scrapTime': this.formValidate.scrapTime,
//            }
            this.editMessTitle.ajaxParams.url = this.editMessTitle.ajaxParams.url +
              '/' + this.deptObj.assetsOutId
            this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate)
          } else {
            this.addMessTitle.ajaxParams.data = this.getFormData(
              this.formValidate)
            data = this.addMessTitle.ajaxParams.data
          }


          if (this.deptObj) {
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
      resetForm (formName) {
        this.$refs[formName].resetFields()
        if (this.deptObj) {
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
      // 设置设备id
      selectDeviceTypeId (val) {
        // this.fetchBaseID(val) //获取assetID
        this.assetNameList.map((item) => {
          if (item.baseId == this.formValidate.baseId) {
            this.formValidate.assetName = item.assetName
            this.fetchBaseID(item.baseId)
          }
        })
      },
      selectassetNumber (val) {
        this.baseAssetList.map((item) => {
          if (item.assetNumber == this.formValidate.assetNumber) {
            this.activeObj = item
            this.formValidate.assetsId = item.assetsId
            this.formValidate.price = item.price
            this.formValidate.treeId = item.treeId
            this.formValidate.treeRoad = item.treeRoad
            submitTime=new Date(item.warehousingTime).getTime();
            this.formValidate.outTime='';
          }
        })
      },
      fetchBaseID (id) {
        this.ajax({
          ajaxSuccess: 'getByBaseIdSuccess',
          ajaxParams: {
            url: `${selectDeviceApi.baseAsset.path}/${id}`,
            method: selectDeviceApi.baseAsset.method,
            params: {},
          },
        })
      },
      getByBaseIdSuccess (res) {
        this.formValidate.assetNumber='';
        this.baseAssetList = res.data
      },
      /*
       * 组件初始化入口
       * */
      init () {
        // this.getSelectData()
        if (this.deptObj) {
          this.formValidate = this.deptObj
          this.isEdit = true
          this.getSelectData() //如果是借用
        }
      },
      selectTreeCall(res){
        this.assetNameList=[];
        this.formValidate.treeName=res.treeName;
        this.formValidate.treeId=res.treeId;
        this.formValidate.treeRoad=res.treeRoad;
        this.selectTreeModal=false;
        this.formValidate.assetName = ''
        this.formValidate.baseId = ''
        this.getAssetBaseList()

      },
      getAssetBaseList () {
        let opt = {
          ajaxSuccess: (res) => {this.assetNameList = res.data},
          ajaxParams: {
            url: 'assetBase/selectList',
            method: 'get',
            params: {
              curPage: 1,
              pageSize: 1000,
              assetName: '',
              assetNumber: '',
              treeId: this.formValidate.treeId,
              treeRoad: this.formValidate.treeRoad
            },
          },
        }
        this.ajax(opt)
      },
      // 输入存放地点
      inputStorageLocation () {
        this.formValidate.roomId = ''
        this.roomIds = []
      },
    },
    components: {
      selectTree
    },
  }

</script>

<style lang="scss">
  @import '../../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
