<template>
  <div>
    <el-row class="editForm">
      <el-form :model="formValidate" ref="formValidate" :rules="rules"
               label-width="124px">
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="设备名称：" prop="">-->
        <!--<el-select v-model="formValidate.deviceTypeId" filterable :disabled="!!id">-->
        <!--<el-option v-for="item in deviceOption" :key="item.id" :value="item.id" :label="item.deviceTypeName">{{ item.deviceTypeName }}</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--</el-col>assetBaseList-->

        <el-col>
          <el-col :span="9" :offset="2">
            <el-form-item label="父资产编号：" prop="parentAssetsNumber">
              <el-input :disabled="editType =='edit'" v-model="formValidate.parentAssetsNumber"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="资产分类：" prop="treeId">
            <!--<el-select v-model="formValidate.treeId" placeholder="请选择"-->
                       <!--@click="selectTreeModal=true">-->
              <!--<el-option v-for="item in assetBaseList" :key="item.treeId"-->
                         <!--:label="item.treeName" :value="item.treeId">-->
              <!--</el-option>-->
            <!--</el-select>-->
            <el-input v-model="formValidate.treeName"
                      placeholder="请选择" disabled @input="inputStorageLocation">
              <el-button  :disabled="editType =='edit'" slot="append" @click="selectTreeModal=true">选择资产分类</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="资产名称：" prop="assetName">
            <el-select :disabled="editType =='edit'" v-model="formValidate.baseId" placeholder="请选择"
                       @change="selectAssetBase">
              <el-option v-for="item in assetNameList" :key="item.baseId"
                         :label="item.assetName" :value="item.baseId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="资产类型：" prop="assetType" required>
            <el-select v-model="formValidate.assetType" placeholder="请选择">
              <!--<el-option label="全部" value="">-->
              <!--</el-option>-->
              <el-option label="固定资产" value="GDZC">
              </el-option>
              <el-option label="低值品" value="DZP">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="资产编号：" prop="assetNumber">
            <el-input :disabled="editType =='edit'" v-model="formValidate.assetNumber"
                      placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="9" :offset="2">
          <el-form-item label="型号：" prop="model">
            <el-input v-model="formValidate.model"
                      placeholder="请输入设备型号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="规格：" prop="standard">
            <el-input v-model="formValidate.standard"
                      placeholder="请输入设备规格"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="单价（元）：" prop="price" required>
            <!--<el-input v-model="formValidate.price" @blur="formatRMB" placeholder="请输入单价"></el-input>-->
            <el-input v-model="formValidate.price"
                      placeholder="请输入单价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="厂家：" prop="manufacturer">
            <el-input v-model="formValidate.manufacturer"
                      placeholder="请输入供应商"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="供应商：">
            <el-input v-model="formValidate.supplier"
                      placeholder="请输入供应商"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="出厂时间：" prop="manufactureDate">
            <el-date-picker v-model="formValidate.manufactureDate"
                            :picker-options="pickerOptions0"
                            :editable="false" type="date"
                            @change="handleStartTime"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="购置日期：" prop="purchaseDate" required>
            <el-date-picker v-model="formValidate.purchaseDate"
                            :picker-options="pickerOptions0"
                            :editable="false" type="date" placeholder="选择日期"
                            required></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="保修截至时间：" prop="guaranteeDate">
            <el-date-picker v-model="formValidate.guaranteeDate"
                            :picker-options="pickerOptions0"
                            :editable="false" type="date"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="报废期限：" prop="discardingTimeLimit" required>
            <el-input style="width: 80%"
                      v-model="formValidate.discardingTimeLimit"
                      placeholder="请输入"></el-input>
            年
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="折旧方式：" prop="depreciationMethod">
            <el-select v-model="formValidate.depreciationMethod"
                       placeholder="请选择">
              <el-option v-for="item in ZJFS" :key="item.code"
                         :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="经费来源：" prop="fundsSource" >
            <el-select v-model="formValidate.fundsSource" placeholder="请选择">
              <el-option v-for="item in JFLY" :key="item.code"
                         :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="使用方向：" prop="directionUse">
            <el-select v-model="formValidate.directionUse" placeholder="请选择">
              <el-option v-for="item in SYFX" :key="item.code"
                         :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="设备来源：" prop="purchaseSource">
            <el-select v-model="formValidate.purchaseSource" placeholder="请选择">
              <el-option v-for="item in SBLY" :key="item.code"
                         :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="经手人" prop="operator">
            <el-input v-model="formValidate.operator"
                      placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="记账人" prop="bookkeeper">
            <el-input v-model="formValidate.bookkeeper"
                      placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="合同编号" prop="contractId">
            <el-select v-model="formValidate.contractId" placeholder="请选择"
                       @change="selectContactId">
              <el-option v-for="item in contractList" :key="item.contractId"
                         :label="item.contractNumber" :value="item.contractId">
              </el-option>
            </el-select>
            <!---->
            <!--<el-input v-model="formValidate.contractNumber" placeholder="请输入使用次数"></el-input>-->
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="存放地点：" prop="storageLocation"
                        style="margin-bottom: 23px">
            <el-input v-model="formValidate.storageLocation"
                      placeholder="请选择" disabled @input="inputStorageLocation">
              <el-button slot="append" @click="selectRoom">选择房间</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="入库时间：" prop="warehousingTime"
                        style="margin-bottom: 23px">
            <!--<el-input v-model="formValidate.warehousingTime"-->
                      <!--placeholder="请选择" disabled @input="inputStorageLocation">-->
            <!--</el-input>-->
            <el-date-picker
              v-model="formValidate.warehousingTime"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions0">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="使用方向：" prop="directionUse">-->
        <!--<el-input v-model="formValidate.directionUse" placeholder="请输入使用方向"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="购置时间：" prop="purchaseDate">-->
        <!--<el-date-picker v-model="formValidate.purchaseDate" :editable="false" type="date" placeholder="选择日期"></el-date-picker>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="使用部门：" prop="useDepartment">-->
        <!--<el-input v-model="formValidate.useDepartment" placeholder="请输入使用部门"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="责任人：" prop="personLiable">-->
        <!--<el-input v-model="formValidate.personLiable" placeholder="请输入责任人"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="厂家：" prop="manufactor">-->
        <!--<el-input v-model="formValidate.manufactor" placeholder="请输入厂家"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="出厂编号：" prop="factoryNumber">-->
        <!--<el-input v-model="formValidate.factoryNumber" placeholder="请输入出厂编号"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="出厂日期：" prop="manufactureDate">-->
        <!--<el-date-picker v-model="formValidate.manufactureDate" :editable="false" type="date" placeholder="选择日期"></el-date-picker>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="购置来源：" prop="purchaseSource">-->
        <!--<el-input v-model="formValidate.purchaseSource" placeholder="请输入购置来源"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="保修截止日期：" prop="guaranteeDate">-->
        <!--<el-date-picker v-model="formValidate.guaranteeDate" :editable="false" type="date" placeholder="选择保修截止日期">-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="折旧方式：" prop="depreciationMethod">-->
        <!--&lt;!&ndash;<el-select v-model="formValidate.depreciationMethod" placeholder="请选择">&ndash;&gt;-->
        <!--&lt;!&ndash;<el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value">&ndash;&gt;-->
        <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
        <!--<el-input v-model="formValidate.depreciationMethod"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->

        <el-col :span="9" :offset="2">
        <el-form-item label="发票号：" prop="invoiceNumber">
        <el-input v-model="formValidate.invoiceNumber" placeholder="请输入发票号"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-form-item label="资产图片：">
            <upload-photo-wall type="picture" :actionUrl="'/file/upload/static'"
            :fileList="fileListOfCopy"
            @upladSuccess="upladSuccessOfCopy"></upload-photo-wall>
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-form-item label="发票图片：">
            <upload-photo-wall type="picture" :actionUrl="'/file/upload/static'"
                               :fileList="fileList"
                               @upladSuccess="upladSuccess"></upload-photo-wall>
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-form-item label="合同复印件：">
            <!--<upload-photo-wall type="picture" :actionUrl="'/file/upload/static'"-->
                               <!--:fileList="fileListOfCopy"-->
                               <!--@upladSuccess="upladSuccessOfCopy"></upload-photo-wall>-->
            <upload-file  :uploadFiles="formValidate.fileList"  @setUploadFiles="setfile"></upload-file>
          </el-form-item>
        </el-col>

        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="维修电话：" prop="servicingPhone">-->
        <!--<el-input v-model="formValidate.servicingPhone" placeholder="请输入维修电话"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="厂商电话：" prop="manufacturerPhone">-->
        <!--<el-input v-model="formValidate.manufacturerPhone" placeholder="请输入厂商电话"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="购买地址：" prop="buyAdderss">-->
        <!--<el-input v-model="formValidate.buyAdderss" placeholder="请输入购买地址"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->


        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="生产日期：" prop="manufactureDate" required>-->
        <!--<el-date-picker v-model="formValidate.manufactureDate" :editable="false" type="date" placeholder="选择生产日期">-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!--</el-col>-->


        <el-col :span="20" :offset="2">
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入内容" v-model="formValidate.remark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 按钮 -->
    <el-row type="flex" class="row-bg" justify="center" solt="footer">
      <el-col :span="4" class="btnBox" align="center">
        <load-btn @listenSubEvent="listenSubEvent"
                  :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="4" class="btnBox" :offset="2" align="center">
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <!--选择房间-->
    <Modal :mask-closable="false" v-model="selectRoomModal" height="200"
           class-name="vertical-center-modal" :width="960">
      <modal-header slot="header" :content="selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" @cancel="selectRoomModal=false"
                   :selectOne="true" @select="selectRoomCall"
                   :select="roomIds"></select-room>
      <div slot="footer"></div>
    </Modal>
    <!--选择房间-->
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
  let Util = null
  import api from './api'
  import selectTree from './selectTree.vue'
  import {
    AssetsStorageMoreInfo as rules,
  } from '../../../rules' // 表单验证规则

  import selectRoom from '../../../../common/selectRoom.vue'
  import uploadPhotoWall from '../../../../common/uploadPhotoWall'

  // 设备状态
  import stateOption from './stateOption'

  export default {
    props: {
      urlParams: { // 编辑
        type: Object,
        required: true,
      },
      id: { // 编辑时主键id
        type: Number,
        default: 0,
      },
      depId: { // 设备类型id
        type: [Number, String],
        required: true,
      },
      depMes: {},

    },
    data () {
      return {
        selectTreeModal:false,
        rules,
        //保存按钮基本信息
        loadBtn: {
          loading: false,
          title: '提交',
          callParEvent: 'listenSubEvent',
        },
        roomIds: [],
        deviceOption: [], // 设备
        stateOption, // 设备状态选择项
        // 表单数据
        formValidate: {
          warehousingTime:new Date(),
          assetType:'GDZC',
          invoiceNumber:'',
          fileIds:'',
          'parentAssetsNumber': '',
          'baseId': '',
          'assetName': '',
          'treeId': '',
          'treeRoad': '',
          'treeName': '',
          'assetNumber': '',
          'model': '',
          'standard': '',
          'price': '',
          'manufacturer': '',
          'supplier': '',
          'manufactureDate': '',
          'purchaseDate': '',
          'guaranteeDate': '',
          'discardingTimeLimit': '',
          'depreciationMethod': '',
          'fundsSource': '',
          'directionUse': '',
          'purchaseSource': '',
          'operator': '',
          'bookkeeper': '',
          'contractId': '',
          'contractNumber': '',
          'storageLocation': '',
          'remark': '',
          'assetsImageList': [
            {
              'originalPath': '',
              'thumbnailPath': '',
            },
          ],
          'assetsContractImage': [
            {
              'originalPath': '',
              'thumbnailPath': '',
            },
          ],
        },
        fileAssetList:[],
        //当前组件提交数据时,ajax处理的 基础信息设置
        selectRoomModal: false,
        selectRoomId: {
          id: 'selectRoomId',
          title: '选择房间',
        },
        selectTreeId: {
          id: 'selectTreeId',
          title: '选择资产',
        },
        editType: 'storage',
        fileList: [],
        fileListOfCopy: [],
        staticPath: '',
        assetBaseList: [],
        assetNameList: [],
        SBLY: [],
        SYFX: [],
        JFLY: [],
        ZJFS: [],
        contractList: [],
      }
    },
    methods: {
      init () {
        //给当前组件注入全局util
        Util = this.$util
        this.staticPath = this.$store.getters.getEnvPath.http
        if (!this.id) {
          this.formValidate.depId = this.depId
        } else {
          this.editType = 'edit'
          this.getDataForServer()
        }
        //this.getDeviceOption();

//        this.getselectListTree()
//        this.getContractList()
//        SBLYList:[],
//          SYFXList:[],
//          JFLYList:[],
        this.getOption('ZJFS')
        this.getOption('SBLY')
        this.getOption('SYFX')
        this.getOption('JFLY')
      },
      getOption (type) {
        let opt = {
          ajaxSuccess: (res) => {this[type] = res.data.child},
          ajaxParams: {
            url: '/dictionary/getByCode/CSTC_' + type,
            method: api.get.method,
            params: {},
          },
        }
        this.ajax(opt)
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
      getContractList () {
        let opt = {
          ajaxSuccess: (res) => {this.contractList = res.data},
          ajaxParams: {
            url: 'contract/selectList',
            method: api.get.method,
            params: {},
          },
        }
        this.ajax(opt)
      },
      selectContactId () {
        this.contractList.map((item) => {
          if (item.contractId == this.formValidate.contractId) {
            this.formValidate.contractNumber = item.contractNumber
          }
        })
      },
      /*
      * 获取表单数据
      * @return string  格式:id=0&name=aa
      * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data)
        return myData
      },
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer () {
        this.ajax({
          ajaxSuccess: 'getEditDataSuccess',
          ajaxParams: {
            url: api.get.path + this.id,
            method: api.get.method,
          },
        })
      },
      getDataSuccess (res) {

        this.formValidate = res.data // 初始化编辑数据

      },
      getAssetBaseList () {
        let opt = {
          ajaxSuccess: (res) => {this.assetNameList = res.data},
          ajaxParams: {
            url: 'assetBase/selectList',
            method: api.get.method,
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
      selectAssetBase () {
        console.log(this.assetNameList)
        this.assetNameList.map((item) => {
          if (item.baseId == this.formValidate.baseId) {
            this.formValidate.assetName = item.assetName
          }
        })
      },
      selectTreeId () {
        this.assetBaseList.map((item) => {
          if (item.treeId == this.formValidate.treeId) {
            this.formValidate.treeName = item.treeName
            this.formValidate.treeRoad = item.treeRoad
          }
        })

      },
//      getselectListTree () {
//        let opt = {
//          ajaxSuccess: (res) => {this.assetBaseList = res.data},
//          ajaxParams: {
//            url: 'assets/tree/selectList',
//            method: api.get.method,
//            params: {
//              treeName: this.depMes.treeName,
//            },
//          },
//        }
//        this.ajax(opt)
//      },
      getEditData () {
        let opt = {
          ajaxSuccess: 'getEditDataSuccess',
          ajaxParams: {
            url: api.get.path + this.id,
            method: api.get.method,
          },
        }
        this.ajax(opt)
      },
      getEditDataSuccess (res) {
        let fileList = []
        let fileListCopy = []
        if (res.data.assetsImageList && res.data.assetsImageList.length) {
          res.data.assetsImageList.map(item => fileList.push({
            name: '',
            url: this.staticPath + item.originalPath,
          }))
        }
        if (res.data.assetsContractImage &&
          res.data.assetsContractImage.length) {
          res.data.assetsContractImage.map(item => fileListCopy.push({
            name: '',
            url: this.staticPath + item.originalPath,
          }))
        }
        this.fileList = fileList
        this.fileListOfCopy = fileListCopy
        this.formValidate = res.data // 初始化编辑数据
        this.getAssetBaseList()
      },
      // 转换为保留两位小数
      formatRMB () {
        if (!isNaN(this.formValidate.price)) {
          this.formValidate.price = (+this.formValidate.price).toFixed(2)
        } else {
          this.formValidate.price = '0.00'
        }
      },
      // 获取设备
      getDeviceOption () {
        let opt = {
          ajaxSuccess: res => {
            this.deviceOption = res.data
            if (this.id) {
              this.getEditData()
            }
          },
          ajaxParams: {
            url: this.urlParams.selectDevice.path,
            params: {
//              depId: this.depId
              depId: -1,
            },
          },
        }
        this.ajax(opt)
      },
      // 图片上传
      upladSuccess (fileList, idx) {
        this.formValidate.assetsImageList = []
        for (var i = 0; i < fileList.length; i++) {
          let file = (fileList[i].src || '').match(/(static.*)(\..*)/)
          this.formValidate.assetsImageList.push({
            originalPath: file[0],
            thumbnailPath: file[1] + '_MINI' + file[2],
          })
        }
      },
      //资产图片上传

      upladSuccessOfCopy (fileList, idx) {
        console.log(fileList)
        this.formValidate.assetsContractImage = []
        for (var i = 0; i < fileList.length; i++) {
          let file = (fileList[i].src || '').match(/(static.*)(\..*)/)
          this.formValidate.assetsContractImage.push({
            originalPath: file[0],
            thumbnailPath: file[1] + '_MINI' + file[2],
          })
        }
      },
      setfile(ids){
        this.formValidate.fileIds = ids;
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        this.formValidate.warehousingTime=this.conductDate(this.formValidate.warehousingTime)
        let isSubmit = this.submitForm('formValidate')
        let msg = {edit: '编辑', storage: '添加'}
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {}
          isLoadingFun(true)
          let data = this.getFormData(this.formValidate)
          data.purchaseDate = this.conductDate(data.purchaseDate, 'yyyy-MM-dd')
          data.manufactureDate = this.conductDate(data.manufactureDate,
            'yyyy-MM-dd')
          data.guaranteeDate = this.conductDate(data.guaranteeDate,
            'yyyy-MM-dd')
          let opt = {
            type: this.editType,
            ajaxSuccess: (res)=>{
              if(res.data=='父资产不存在'){
                this.errorMess('父资产不存在')
              }else {
                this.$emit(this.editType,this.editType,msg[this.editType] + '成功!')
              }
            },
            ajaxParams: {
              jsonString: true,
              url: this.editType == 'storage'
                ? this.urlParams.storage.path
                : api.modify.path + this.id,
              method: this.editType == 'storage'
                ? this.urlParams.storage.method
                : api.modify.method,
              data,
            },
          }
          this.ajax(opt, isLoadingFun)
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', this.editType)
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data)
        return myData
      },

      // 选择房间
      selectRoom () {
        this.selectRoomModal = true
      },

      // 选择房间回调
      selectRoomCall (res) {
        this.roomIds[0] = res[0].id
        this.formValidate.roomId = res[0].id
        this.formValidate.storageLocation = res[0].roomNum
        this.selectRoomModal = false
      },

      // 输入存放地点
      inputStorageLocation () {
        this.formValidate.roomId = ''
        this.roomIds = []
      },
    },
    created () {
      this.init()
    },
    components: {
      selectRoom, uploadPhotoWall,selectTree
    },
  }

</script>

<style lang="scss">
  @import '../../../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
