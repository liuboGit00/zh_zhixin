<!--
****--@file     assetsExist_list
****--@date     2019/1/3 10:13
****--@author   WH
****--@describe   在库
-->
<template>
  <!-- 设备入库 -->
  <div id="nosocomial" ref="nosocomial">
    <!--<el-row>-->
    <ab-table-search :contenHeight="contenHeight-40" tableURL="assets/inLibrary/list"
                      url="assets/inLibrary/statistics"
                     @initSelect="initSelect"
                     :loadTableData="loadTableData"
                     :selectSon=true :makeSmall='searchObj.isSubdivided'
                     :searchObj="searchObj" @search="search"
                     :hasSon="hasSon"
                     @show="show" @edit="edit" @shows="shows" :depMes="depMes"
                     @selectionChange="handleSelectionChange">
      <!-- 操作按钮 -->
      <template slot="todoBtns">
        <el-button type="info" size="small" @click="print">打印二维码</el-button>
        <el-button type="info" size="small" @click="excelExport">导出</el-button>
      </template>
      <!-- 搜索部分 -->
      <template slot="search">
        <el-form-item label="资产名称：">
          <el-input v-model="searchObj.assetName"></el-input>
        </el-form-item>
        <el-form-item label="资产编号：">
          <el-input v-model="searchObj.assetNumber"></el-input>
        </el-form-item>
        <el-form-item label="资产类型：" >
          <el-select v-model="searchObj.assetType" placeholder="请选择">
            <el-option label="全部" value="">
            </el-option>
            <el-option label="固定资产" value="GDZC">
            </el-option>
            <el-option label="低值品" value="DZP">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="存放地点：">
          <el-input v-model="searchObj.storageLocation"></el-input>
        </el-form-item>
        <el-form-item label="经费来源：" prop="fundsSource">
          <el-select v-model="searchObj.fundsSource" placeholder="请选择">
            <el-option v-for="item in JFLY" :key="item.code"
                       :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="经费来源：">-->
        <!--<el-input v-model="searchObj.fundsSource"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="是否统计细分资产：">
          <el-checkbox v-model="searchObj.isSubdivided"></el-checkbox>
        </el-form-item>
        <el-form-item label="单价>">
          <el-input type="number" v-model="searchObj.price"></el-input>元
        </el-form-item>
        <el-form-item label="在库状态：">
          <el-select  v-model="searchObj.status" placeholder="请选择">
            <el-option  v-for="item in optionData" :key="item.val" :label="item.name" :value="item.val">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同号：" label-width="82px">
          <el-input v-model="searchObj.contractNumber"></el-input>
        </el-form-item>
        <!--<el-form-item label="入库时间：">-->
        <!---->
        <!--<el-input v-model="searchObj.warehousingTime"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="入库时间：" >
          <!--<el-date-picker v-model="searchObj.warehousingStartTime"-->
          <!--:editable="false" type="date"-->
          <!--placeholder="选择日期">-->
          <!--&lt;!&ndash;<template scope="scope">&ndash;&gt;-->
          <!--&lt;!&ndash;{{ conductDate(scope.row.warehousingTime,'yyyy-MM-dd') }}&ndash;&gt;-->
          <!--&lt;!&ndash;</template>&ndash;&gt;-->
          <!--</el-date-picker>-->
          <date-group :dateGroup="{text:'',startDate:searchObj.warehousingStartTime,endDate:searchObj.warehousingEndTime}">
            <el-date-picker name="start" v-model="searchObj.warehousingStartTime" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions0"
                            @change="handleStartTime"></el-date-picker>
            <span>-</span>
            <el-date-picker name="end" v-model="searchObj.warehousingEndTime" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions1"
                            @change="handleEndTime"></el-date-picker>
          </date-group>
        </el-form-item>
        <el-form-item label="使用年限：">
          <el-input placeholder="请输入正整数" type="number" @blur="searchObj.serviceLife=parseInt(searchObj.serviceLife)" v-model="searchObj.serviceLife"></el-input>
        </el-form-item>

      </template>
      <!-- 表格部分 -->
      <template slot="tableItem">
        <el-table-column label="操作" width="140">
          <template scope="props">
            <el-button size="small" @click="show(props.row.assetsId)">查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="资产名称" prop="assetName" show-overflow-tooltip
                         width="100"></el-table-column>
        <el-table-column label="资产编号" prop="assetNumber" show-overflow-tooltip
                         width="100"></el-table-column> <el-table-column label="资产分类" prop="treeName" show-overflow-tooltip
                                                                         width="100"></el-table-column>
        <el-table-column label="资产类型" prop="assetType" show-overflow-tooltip
                         width="100">
          <template scope="scope">
            {{scope.row.assetType=='GDZC'?'固定资产':'低值品'}}
          </template>
        </el-table-column>
        <el-table-column label="型号" prop="model" show-overflow-tooltip
                         width="100"></el-table-column>
        <el-table-column label="规格" prop="standard" show-overflow-tooltip
                         width="100"></el-table-column>
        <el-table-column label="单价（元）" prop="price" show-overflow-tooltip
                         width="110"></el-table-column>
        <el-table-column label="购置日期" prop="purchaseDate" show-overflow-tooltip
                         width="100"></el-table-column>
        <el-table-column label="入库时间" prop="warehousingTime"
                         show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="使用年限" prop="serviceLife"
                         show-overflow-tooltip>
          <template scope="scope">
            <span v-if="scope.row.warehousingTime">
               {{new Date().getFullYear() - scope.row.warehousingTime.substr(0,4)}}
              <!--{{Number(new Date().getFullYear())-Number(scope.row.warehousingTime.split('-')[0])}}-->
            </span>
          </template>
        </el-table-column>
        <el-table-column label="报废期限" prop="discardingTimeLimit"
                         show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="现状" prop="status" show-overflow-tooltip
                         width="100">
          <template scope="scope">
            {{ (scope.row.status||'WAREHOUSING') | statusOfAssets }}
          </template>
        </el-table-column>
        <el-table-column label="经费来源" prop="fundsSource" show-overflow-tooltip
                         width="100">
          <template scope="scope">
             <span v-for="(item,index) in JFLY" :key="index">
              <span v-if="item.code==scope.row.fundsSource">
                {{item.name}}
              </span>
             </span>
          </template>

        </el-table-column>
        <el-table-column label="合同号" prop="contractNumber" show-overflow-tooltip
                         width="100"></el-table-column>
        <el-table-column label="存放地点" prop="storageLocation"
                         show-overflow-tooltip width="100"></el-table-column>
        <!--<el-table-column label="购置日期" prop="purchaseDate" show-overflow-tooltip width="100">-->
        <!--<template scope="scope">-->
        <!--{{ scope.row.purchaseDate | formatDate('yyyy-MM-dd') }}-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="出厂编号" prop="factoryNumber" show-overflow-tooltip width="100"></el-table-column>-->
        <!--<el-table-column label="出厂日期" prop="manufactureDate" show-overflow-tooltip width="100">-->
        <!--<template scope="scope">-->
        <!--{{ scope.row.manufactureDate | formatDate('yyyy-MM-dd') }}-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="发票号" prop="invoiceNumber" show-overflow-tooltip width="100"></el-table-column>-->
        <!--<el-table-column label="购置来源" prop="purchaseSource" show-overflow-tooltip width="100"></el-table-column>-->
        <!--<el-table-column label="折旧方式" prop="depreciationMethod" show-overflow-tooltip width="100"></el-table-column>-->
        <!--<el-table-column label="备注" prop="describes" show-overflow-tooltip width="100"></el-table-column>-->
      </template>
      <!--<template slot="selectSon">-->
      <!--<span-->
      <!--style="font-size: 14px;font-weight: bold;line-height: 35px;position: absolute;z-index:100;">总计：{{ makeSmall? small.num:big.num }}台/件，{{ makeSmall? small.money/10000:big.num/10000 }}万元</span>-->
      <!--</template>-->
    </ab-table-search>
    <!--<el-col :xs="24" :md="14">-->
    <!--&lt;!&ndash; 操作按钮 &ndash;&gt;-->
    <!--<div class="buttonList">-->
    <!--<el-button size="small" type="warning" @click="storage">入库</el-button>-->
    <!--<el-button size="small" type="info" @click="leadin">导入</el-button>-->
    <!--<el-button size="small" type="info" @click="excelExport">导出</el-button>-->
    <!--<el-button size="small" type="info" @click="print">打印二维码</el-button>-->
    <!--</div>-->
    <!--</el-col>-->
    <!--<el-col :xs="5" :md="10" align="right">-->
    <!--&lt;!&ndash; 搜索 &ndash;&gt;-->
    <!--<el-form :inline="true" class="el-form-item-search">-->
    <!--<el-form-item label="设备名称：">-->
    <!--<el-input size="small" v-model="deviceTypeName"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item>-->
    <!--<el-button type="primary" size="small" @click="search">查询</el-button>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!-- 表格数据 -->
    <!--<div id="deviceTable" ref="deviceTable">-->
    <!--<el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"-->
    <!--class="tableShowMoreInfo" ref="multipleTable"-->
    <!--style="width: 100%" @selection-change="handleSelectionChange">-->
    <!--<el-table-column type="selection" width="55"></el-table-column>-->
    <!--<el-table-column label="序号" type="index" width="80" align="center"></el-table-column>-->
    <!--<el-table-column label="操作" prop="deviceTypeName" width="80">-->
    <!--<template scope="props">-->
    <!--<el-button size="small" @click="show(props.row.id)">查看</el-button>-->
    <!--</template>-->
    <!--</el-table-column>-->
    <!--<el-table-column label="存放地点" prop="storageLocation" show-overflow-tooltip width="100"></el-table-column>-->
    <!--<el-table-column label="设备名称" prop="deviceTypeName" show-overflow-tooltip width="100"></el-table-column>-->
    <!--<el-table-column label="设备编号" prop="deviceIdentifier" show-overflow-tooltip width="100"></el-table-column>-->
    <!--<el-table-column label="规格" prop="specifications" show-overflow-tooltip width="100"></el-table-column>-->
    <!--<el-table-column label="型号" prop="model" show-overflow-tooltip width="100"></el-table-column>-->
    <!--<el-table-column label="单价（元）" prop="price" show-overflow-tooltip width="110"></el-table-column>-->
    <!--<el-table-column label="供应商" prop="supplier" show-overflow-tooltip width="100"></el-table-column>-->
    <!--<el-table-column label="设备状态" prop="status" show-overflow-tooltip width="100">-->
    <!--<template scope="scope">-->
    <!--{{ scope.row.status | typeText }}-->
    <!--</template>-->
    <!--</el-table-column>-->
    <!--<el-table-column label="使用方向" prop="directionUse" show-overflow-tooltip width="100"></el-table-column>-->
    <!--<el-table-column label="使用部门" prop="useDepartment" show-overflow-tooltip width="100"></el-table-column>-->
    <!--<el-table-column label="责任人" prop="personLiable" show-overflow-tooltip width="100"></el-table-column>-->
    <!--<el-table-column label="购置日期" prop="purchaseDate" show-overflow-tooltip width="100">-->
    <!--<template scope="scope">-->
    <!--{{ scope.row.createTime | formatDate('yyyy-MM-dd') }}-->
    <!--</template>-->
    <!--</el-table-column>-->
    <!--<el-table-column label="出厂编号" prop="factoryNumber" show-overflow-tooltip width="100"></el-table-column>-->
    <!--<el-table-column label="出厂日期" prop="manufactureDate" show-overflow-tooltip width="100"></el-table-column>-->
    <!--<el-table-column label="发票号" prop="invoiceNumber" show-overflow-tooltip width="100"></el-table-column>-->
    <!--<el-table-column label="购置来源" prop="purchaseSource" show-overflow-tooltip width="100"></el-table-column>-->
    <!--<el-table-column label="折旧方式" prop="depreciationMethod" show-overflow-tooltip width="100"></el-table-column>-->
    <!--<el-table-column label="备注" prop="describe" show-overflow-tooltip width="100"></el-table-column>-->

    <!--&lt;!&ndash;<el-table-column label="数量" prop="deviceNum" show-overflow-tooltip>&ndash;&gt;-->
    <!--&lt;!&ndash;<template scope="scope">&ndash;&gt;-->
    <!--&lt;!&ndash;{{ scope.row.deviceNum || 0 }}&ndash;&gt;-->
    <!--&lt;!&ndash;</template>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
    <!--&lt;!&ndash;<el-table-column label="描述" prop="describes" show-overflow-tooltip></el-table-column>&ndash;&gt;-->
    <!--&lt;!&ndash;<el-table-column label="创建人" prop="createrName" show-overflow-tooltip></el-table-column>&ndash;&gt;-->
    <!--&lt;!&ndash;<el-table-column label="创建时间" prop="createTime" show-overflow-tooltip>&ndash;&gt;-->
    <!--&lt;!&ndash;<template scope="scope">&ndash;&gt;-->
    <!--&lt;!&ndash;{{ scope.row.createTime | formatDate('yyyy-MM-dd HH:mm:ss') }}&ndash;&gt;-->
    <!--&lt;!&ndash;</template>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
    <!--</el-table>-->
    <!--</div>-->
    <!--&lt;!&ndash; 分页 &ndash;&gt;-->
    <!--<div style="float: right;margin-top:10px;">-->
    <!--<el-pagination @size-change="changePageSize" @current-change="changePage"-->
    <!--:current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"-->
    <!--:page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper"-->
    <!--:total="totalCount"></el-pagination>-->
    <!--</div>-->
    <!-- 模态框 打印二维码（add） -->
    <Modal :mask-closable="false" v-model="printModal" height="200"
           title="对话框标题" class-name="vertical-center-modal"
           :width="800">
      <modal-header slot="header" :content="button.printId"></modal-header>
      <print v-if="printModal" @cancel="cancel" :codeList="codeList"
             @print="subCallback"></print>
      <div slot="footer"></div>
    </Modal>
    <!--&lt;!&ndash;模态框 删除（del） &ndash;&gt;-->
    <!--<Modal close-on-click-modal="false" height="200" v-model="removeModal"-->
           <!--title="对话框标题"-->
           <!--class-name="vertical-center-modal" :loading="loading"-->
           <!--:width="500">-->
      <!--<modal-header slot="header" :content="button.removeId"></modal-header>-->
      <!--<remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback"-->
              <!--@cancel="cancel"-->
              <!--:operaility-data="operailityData"></remove>-->
      <!--<div slot="footer"></div>-->
    <!--</Modal>-->
    <!--&lt;!&ndash;导出弹窗&ndash;&gt;-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200"
           v-model="deriveModal" title="对话框标题"
           class-name="vertical-center-modal"
           :width="500">
      <modal-header slot="header" :content="button.deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="derUrl">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click=" deriveModal=false">取消
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 设备入库（storage） -->
    <!--<Modal :mask-closable="false" v-model="storageModal" height="200"-->
           <!--title="对话框标题"-->
           <!--class-name="vertical-center-modal" :width="1100">-->
      <!--<modal-header slot="header" :content="button.storageId"></modal-header>-->
      <!--<storage v-if="storageModal" @cancel="cancel" @storage="subCallback"-->
               <!--:operaility-data="operailityData" :depId="depId" :depMes="depMes"-->
               <!--:url-params="api"></storage>-->
      <!--<div slot="footer"></div>-->
    <!--</Modal>-->
    <!--&lt;!&ndash; 模态框 编辑设备入库 &ndash;&gt;-->
    <!--<Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题"-->
           <!--class-name="vertical-center-modal" :width="1100">-->
      <!--<modal-header slot="header" :content="button.editId"></modal-header>-->
      <!--<storage v-if="editModal" @cancel="cancel" @edit="subCallback"-->
               <!--:operaility-data="operailityData" :depId="depId" :depMes="depMes"-->
               <!--:id="todoId" :url-params="api"></storage>-->
      <!--<div slot="footer"></div>-->
    <!--</Modal>-->
    <!--&lt;!&ndash; 模态框 导入设备（leadin） &ndash;&gt;-->
    <!--<Modal :mask-closable="false" v-model="leadinModal" height="200"-->
           <!--title="对话框标题"-->
           <!--class-name="vertical-center-modal" :width="800">-->
      <!--<modal-header slot="header" :content="button.leadinId"></modal-header>-->
      <!--<leadin v-if="leadinModal" :id="depId" :url="api" @cancel="cancel"-->
              <!--@toChannel="subCallback"-->
              <!--:operaility-data="operailityData"-->
              <!--:url-params="api.leadin"></leadin>-->
      <!--<div slot="footer"></div>-->
    <!--</Modal>-->
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题"
           class-name="vertical-center-modal"
           :width="1100">
      <modal-header slot="header" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"
            :id="todoId" :get-url-params="api.get" :url="api"></show>
      <div slot="footer"></div>
    </Modal>
    <!--&lt;!&ndash;模态框 删除（del） &ndash;&gt;-->
    <!--<Modal close-on-click-modal="false" height="200" v-model="removeModal"-->
           <!--title="对话框标题"-->
           <!--class-name="vertical-center-modal" :loading="loading" :width="500">-->
      <!--<modal-header slot="header" :content="button.removeId"></modal-header>-->
      <!--<remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback"-->
              <!--@cancel="cancel"-->
              <!--:operaility-data="operailityDataDelete"></remove>-->
      <!--<div slot="footer"></div>-->
    <!--</Modal>-->
  </div>
</template>

<script>
  //当前组件引入全局的util
  let Util = null

  // API
  import api from '../assetsStorage/api'
  import stateOption from '../assetsStorage/stateOption'

  import print from '../assetsStorage/deviceStorageMoreInfo/deviceStorage_printCode.vue'
  import show from '../assetsStorage/deviceStorageMoreInfo/deviceStorageMoreInfo_view'

  export default {
    props: {
      contenHeight: { // 接收父组件的高度
        type: Number,
        default: 860,
      },
      depId: { // 部门id
        type: [Number],
        default: -1,
      },
      depMes: {},
      showSelect:{
        type: Boolean,
        default: true,
      }
    },
    data () {
      return {
        hasSon:false,
        fileAssetList:[],
        numberOF:'',
        small: {
          num: 0,
          money: 0,
        },
        big: {
          num: 0,
          money: 0,
        },
        stateOption,
        printModal: false,
        makeSmall: false,
        tableAllIds: {}, // 记录表格中的所有id对应关系 id:{sid:[子id],index:所在行}
        tableDeviceListObj: {}, // 记录所有的设备供打印使用
        qrCodeIds: [],
        selectQrCodeItemParentId: '',

        codeList: [], // 需要打印二维码的数据

        self: this,
        api,
        // 表格数据
        totalCount: 0,
        tableData: [],
        searchObj: {
          assetType:'',
          status:'',
          treeRoad: '',
          assetName: '',
          assetNumber: '',
          storageLocation: '',
          fundsSource: '',
          price: '',
          contractNumber: '',
          warehousingEndTime: this.conductDate(new Date()),
          warehousingStartTime: this.conductDate(new Date((new Date().getFullYear() + '-01-01'))),
          serviceLife: '',
          isSubdivided: false,
        },
        multipleSelection: [], // 选项
        operailityData: '', // 操作的数据
        loading: false,
        dynamicHt: 100,
        listTotal: 0,
        // 按钮
        button: {
          addId: {
            id: 'addId',
            title: '新建资产',
          },
          showId: {
            id: 'editId',
            title: '查看资产信息',
          },
          removeId: {
            id: 'removeId',
            title: '删除资产信息',
          },
          storageId: {
            id: 'storageId',
            title: '资产入库',
          },
          editId: {
            id: 'editId',
            title: '编辑资产',
          },
          leadinId: {
            id: 'leadinId',
            title: '导入资产',
          },
          deriveId: {
            id: 'deriveId',
            title: '导出资产',
          },
          printId: {
            id: 'printId',
            title: '打印二维码',
          },

        },
        storageModal: false,
        leadinModal: false,
        deriveModal: false,
        // 操作id
        todoId: '',
        // 设备入库的部门id的
        addDepId: '',
        derUrl: '',

        // 新加属性
        tableURL: api.list,
        loadTableData: 0,
        operailityDataDelete: [],
        JFLY:[],
        selectAll:[],
        optionData:[{
            val:'',
            name:'全部'
          },
          {
            val:'WAREHOUSING',
            name:'可用'
          },{
            val:'BORROWING',
            name:'借用中'
          },{
            val:'REPAIRING',
            name:'维修中'
          },{
            val:'BREAKAGE',
            name:'报损'
          },
        ]
      }
    },
    methods: {

      initSelect(){
           this.searchObj={
             treeRoad: this.searchObj.treeRoad,
             assetName: '',
             assetNumber: '',
             storageLocation: '',
             fundsSource: '',
             price: '',
             contractNumber: '',
             warehousingEndTime: '',
             warehousingStartTime:'',
             serviceLife: '',
             isSubdivided: false,
             status:'',
             assetType:'',
           }

      },
      numberCheck(t){
        t=parseInt(t)
      },
      getOption (type) {
        let opt = {
          ajaxSuccess: (res) => {this[type]=[];this[type] = res.data.child;this[type].unshift({name:'全部',code:''})},
          ajaxParams: {
            url: '/dictionary/getByCode/CSTC_' + type,
            method: api.get.method,
            params: {},
          },
        }
        this.ajax(opt)
      },
      //初始化请求列表数据
      init () {
        console.log(new Date().getFullYear()+'-'+ Number(new Date().getMonth()+1)+'-'+'01')
        Util = this.$util
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams

        this.queryQptions = {
          url: 'assets/inLibrary/list',
          method: this.api.list.method,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
          },
        }
        this.getOption('JFLY');
        console.log(this.depMes)
//        this.setTableData();
      },
      changeGuaranteeDate (val) {
        this.searchObj.guaranteeDate = this.conductDate(val, 'yyyy-MM-dd') ||
          ''
      },
      //*--------------------------- 表格 -----------------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val, valList,type,fatherData) {
        let tempArr= Util._.defaultsDeep([],this.selectAll);
        if(type=='small') {
          let temp =fatherData;
          let smallArray=Util._.defaultsDeep([],this.selectAll)
          let m=tempArr.length-1
          for(var i=m;i>=0;i--) {//去掉列表中所有选中的子节点
            temp.childAssetsList.map(item => {
              if (item.id == tempArr[i].id) {
                smallArray.splice(i, 1)
                return
              }
            })
          }
          tempArr=smallArray.concat(val)//重新赋值
        }else {
          let tempArray=Util._.defaultsDeep([],this.selectAll);

          let m=tempArr.length-1
          for(var i=m;i>=0;i--){
            console.log(i)
            valList.map((item)=>{
              if(item.id==tempArr[i].id) {
                tempArray.splice(i,1)
                return
              }
            })
          }
          tempArr=tempArray.concat(val)
        }
        this.selectAll=tempArr
        this.codeList=tempArr;
        console.log(this.selectAll)
      },
      uniq (array) {
        var temp = [] //一个新的临时数组
        var arr = []
        for (var i = 0; i < array.length; i++) {
          if (arr.indexOf(array[i].id) == -1) {
            temp.push(array[i])
            arr.push(array[i].id)
          }
        }
        return temp
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData () {

        this.searchObj.warehousingStartTime=this.conductDate(this.searchObj.warehousingStartTime)
        this.searchObj.warehousingEndTime=this.conductDate(this.searchObj.warehousingEndTime)
        this.searchObj.depId = this.depId
        this.loadTableData++

//        this.tableData = [];
//        this.queryQptions.params.deviceTypeName = this.deviceTypeName || '';
//        this.ajax({
//          ajaxSuccess: 'listDataSuccess',
//          ajaxParams: this.queryQptions,
//        })
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        let tableAllIds = {}
        let tableDeviceListObj = {}
//        this.tableData.map(function (item, index) {
//          this.big.num++;
//          this.big.money+=item.price;
//          tableAllIds[item.baseId] = {sid: [], index, selAll: false};
//          let num=0;
//          let money=0;
//          if (item.childAssetsList) {
//            for (var i = 0; i < item.childAssetsList.length; i++) {
//              num++;
//              money+=item.price;
//              tableAllIds[item.baseId].sid.push(item.deviceList[i].baseId);
//              tableDeviceListObj[item.childAssetsList[i].baseId] = item.childAssetsList[i];
//            }
//          }
//          this.small.num+=num;
//          this.small.money+=money;
//
//        });
//        console.log(this.small,this.big);
//        console.log(tableDeviceListObj);
//        console.log(tableAllIds);
//        console.log('表格行与id对应关系：', tableAllIds);
        this.tableAllIds = tableAllIds
        this.tableDeviceListObj = tableDeviceListObj
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let deviceTable = this.$refs.deviceTable
        let paginationHt = 50 * 2
        this.dynamicHt = this.contenHeight - deviceTable.offsetTop -
          paginationHt
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.selectAll.length
        let flag = true
        if (len == 0) {
          this.showMess('请选择数据!')
          flag = false
        }
        if (len > 1 && isOnly) {
          this.showMess('只能修改一条数据!')
          flag = false
        }
        return flag
      },
      /************************************** 模态框处理 **************************************************/
      // 增加
      add () {
        this.openModel('add')
      },
      print () {
        console.log(this.multipleSelection)
        if (this.codeList.length == 0) {
          this.showMess('请选择需要打印的数据!')
          return false
        }

//        this.codeList = this.multipleSelection
        console.log(this.codeList)
        this.openModel('print')
      },
      // 编辑
      edit (id) {
        this.todoId = id
        this.openModel('edit')
      },
//      // 编辑
//      edit () {
//        if (this.isSelected(true)) {
//          this.todoId = this.multipleSelection[0].id;
//          this.openModel('edit');
//        }
//      },
      shows (res) {
        this.$emit('shows', res)
      },
      // 查看
      show (id) {
        this.todoId = id
        this.openModel('show')
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false
      },
      // 删除
      /*--点击--删除--按钮--*/
      remove () {
        if (this.isSelected()) {

          console.log(this.operailityDataDelete)
          this.openModel('remove')
        }
      },
      // 设备入库
      storage () {
//        if (this.isSelected(true)) {
//          this.todoId = this.multipleSelection[0].id;
//          this.addDepId = this.multipleSelection[0].depId || 1;
//          this.openModel('storage');
//        }
        this.openModel('storage')
      },
      // 导出设备
      excelExport () {
        if (this.isSelected()) {
        this.openModel('derive')
        let assetsIds = []
        for (let i = 0; i < this.selectAll.length; i++) {
          assetsIds.push(this.selectAll[i].id)
        }
        assetsIds=[...new Set(assetsIds)]
        assetsIds = assetsIds.join(',')
        let str = ''

//          this.searchObj.isSubdivided = this.searchObj.isSubdivided ? 1 : '0'
        if(typeof this.searchObj.warehousingStartTime=='object'){
          this.searchObj.warehousingStartTime = this.conductDate(this.searchObj.warehousingStartTime, 'yyyy-MM-dd') || ''
        }
        if(typeof this.searchObj.warehousingEndTime=='object'){
          this.searchObj.warehousingEndTime = this.conductDate(this.searchObj.warehousingEndTime, 'yyyy-MM-dd') || ''
        }
        let searchObj = Util._.defaultsDeep({},this.searchObj);
        if(this.searchObj.isSubdivided&&this.searchObj.isSubdivided!=0){
          searchObj.isSubdivided=1;
        }else{
          searchObj.isSubdivided=0;
        }
        console.log(searchObj,758)
        for (var i in searchObj) {
          str += (i + '=' + searchObj[i] + '&')
        }
          // let http = this.$store.getters.getEnvPath.http;
          this.derUrl = '/api/assets/exportExcel?' + str + 'assetsIds=' +
            assetsIds
          console.log(this.derUrl)
        }
      },
      // 导入设备
      leadin () {
        this.openModel('leadin')
      },
      // 搜索
      search () {
        this.hasSon=this.searchObj.isSubdivided
        this.queryQptions.params.curPage = 1 // 从第一页开始
        this.setTableData()
      },
      // 回调
      subCallback (target, title, updata) {
        this.cancel(target)
        if (title) {
          this.successMess(title)
        }
        if (!updata) {
          this.setTableData()
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true
      },

      //确定导出
      affirmDerive () {

        this.cancel('derive')
      },
    },
    components: {
      show,
      print
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
//        this.setTableDynHeight();
//        //为窗体绑定改变大小事件
//        let Event = Util.events;
//        Event.addHandler(window, 'resize', this.setTableDynHeight);
      })
    },
    created () {
      this.init()
    },
    watch: {
//      contenHeight (val) {
//        this.setTableDynHeight()
//      },
      depId (val) {
//        this.searchObj.deptId = val || '';
        this.searchObj.treeRoad = this.depMes.treeRoad
        //   this.depId = val;
//        this.deviceTypeName = '';
        this.setTableData()
      },
      totalCount (val) {
        alert(val, this.totalCount)
      },
      tableDatas (val) {
        alert(val)
      },
    },
  }

</script>

<style lang="scss">
  .tableShowMoreInfo {
    .el-table__expanded-cell {
      padding: 0;
    }
    .tsmiSonCheckBox {
      .el-checkbox__input {
        margin-right: 0;
      }
    }
  }

  #nosocomial .el-table__expanded-cell {
    padding: 0;
  }

  #nosocomial .titleItem .el-table__header-wrapper {
    display: none;
  }
</style>
