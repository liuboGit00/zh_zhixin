<template>
  <!-- 设备维修 -->
  <div>
    <!-- 操作按钮 -->
    <el-row class="roomButtonList" ref="buttonList" style="margin-bottom: 20px">
      <el-col :span="10">
        <el-button v-if="showSelect" size="small" type="primary" @click="add">新建</el-button>
        <el-button v-if="showSelect" size="small" type="info" @click="edit">修改</el-button>
        <el-button type="primary" size="small" @click="toChannel">导出
        </el-button>
        <el-button v-if="showSelect" size="small" type="danger" @click="remove">删除</el-button>
      </el-col>
      <el-col :span="13" align="right">
        <el-button size="small" align="right"
                   :icon="searchMore ? 'arrow-down' : 'arrow-up'"
                   @click="showSearchMore">高级查询
        </el-button>
      </el-col>
    </el-row>
    <!-- 数据搜索 -->
    <el-row v-show="searchMore">
      <el-form :inline="true" :model="searchObj" ref="searchObj"
               label-width="86px" class="el-form-item-search">
        <el-row>
          <el-col :span="6">
            <el-form-item label="资产名称：" prop="assetName">
              <el-input v-model="searchObj.assetName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产编号：" prop="assetNumber">
              <el-input v-model="searchObj.assetNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="存放地点：" prop="storageLocation">
              <el-input v-model="searchObj.storageLocation"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="经费来源：" prop="fundsSource">
              <el-select v-model="searchObj.fundsSource" placeholder="请选择">
                <el-option v-for="item in JFLY" :key="item.code"
                           :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="单价>" prop="price">
              <el-input type="number" style="width: 50%" v-model="searchObj.price"></el-input>元
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合同号：" prop="contractNumber">
              <el-input v-model="searchObj.contractNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!--<el-form-item label="入库时间：" >-->
              <el-form-item label="入库时间：" prop="warehousingTime">
                <date-group :dateGroup="{text:'',startDate:searchObj.warehousingStartTime,endDate:searchObj.warehousingEndTime}">
                  <el-date-picker name="start" v-model="searchObj.warehousingStartTime" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions0"
                                  @change="handleStartTime"></el-date-picker>
                  <span>-</span>
                  <el-date-picker name="end" v-model="searchObj.warehousingEndTime" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions1"
                                  @change="handleEndTime"></el-date-picker>
                </date-group>
              </el-form-item>
            <!--</el-form-item>-->
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="使用年限：" prop="serviceLife">
              <el-input v-model="searchObj.serviceLife"
                        type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报损人：" prop="breakageUser">
              <el-input v-model="searchObj.breakageUser"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报损时间：" prop="startStartTime">
              <date-group
                :dateGroup="{text:'',startDate:searchObj.breakageTimeBegin,endDate:searchObj.breakageTimeEnd}">
                <el-date-picker name="start" v-model="searchObj.breakageTimeBegin"
                                :editable="false" type="date" placeholder="选择日期"
                                :picker-options="pickerOptions0"
                                @change="handleStartTime"></el-date-picker>
                <span>-</span>
                <el-date-picker name="end" v-model="searchObj.breakageTimeEnd"
                                :editable="false" type="date" placeholder="选择日期"
                                :picker-options="pickerOptions1"
                                @change="handleEndTime"></el-date-picker>
              </date-group>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <!--<el-col :span="6">-->
            <!--<el-form-item label="状态：" prop="repairingStatus">-->
              <!--<el-select v-model="searchObj.repairingStatus">-->
                <!--<el-option label="全部" value="">-->
                <!--</el-option>-->
                <!--<el-option label="维修结束" value="REPAIRINGEND">-->
                <!--</el-option>-->
                <!--<el-option label="维修中" value="REPAIRING">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="6">
            <el-form-item label="是否统计细分资产：" prop="isSubdivided">
              <el-checkbox v-model="searchObj.isSubdivided"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产类型：" prop="assetType">
              <el-select v-model="searchObj.assetType" placeholder="请选择">
                <el-option label="全部" value="">
                </el-option>
                <el-option label="固定资产" value="GDZC">
                </el-option>
                <el-option label="低值品" value="DZP">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>

              <el-button type="primary" size="small" @click="search">查询
              </el-button>
              <el-button type="primary" size="small" @click="initSelect">清空
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <!-- 数据表格 -->
    <div id="nosocomial" ref="tableData">
      <el-table v-if="Refresh" align="center" :context="self" :data="tableData"
                tooltip-effect="dark" :height="dynamicHt"
                @selection-change="handleSelectionChange"
                :default-expand-all="!!searchObj.isSubdivided">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column width="70" label="序号" type="index"></el-table-column>
        <el-table-column type="expand" v-if="hasSon">
          <template scope="scope">
            <div class="titleItem">
              <el-table   :context="self" :data="scope.row.childAssetsList"   id="nosocomialSmall" :class="{'nosocomialSmallNoSmall':(!scope.row.childAssetsList||!scope.row.childAssetsList.length)}"
                          tooltip-effect="dark" style="width: 100%" @select="selectSmall(scope.row,222)" @selection-change="handleSelectionChangeSmall">
                <!-- 选项 -->
                <!-- 选项 -->
                <el-table-column width="55" align="right"></el-table-column>
                <!-- 序号 -->
                <el-table-column align="center" label="序号" prop="index" width="80">
                </el-table-column>
                <el-table-column width="34"></el-table-column>
                <el-table-column label="操作" width="170" align="left">
                  <template scope="scope">
                    <el-button  v-if="scope.row.assetsBreakageId"   size="small" type="success" @click="show(scope.row)">查看
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column label="资产名称" prop="assetName"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="资产编号" prop="assetNumber"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="资产类型" prop="assetType">
                  <template scope="scope">
                    {{scope.row.assetType=='GDZC'?'固定资产':'低值品'}}
                  </template>
                </el-table-column>
                <el-table-column label="存放地点" prop="storageLocation"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="经费来源" prop="fundsSource"
                                 show-overflow-tooltip>
                  <template scope="scope">
                    {{ scope.row.fundsSource|assetJFLY}}
                  </template>
                </el-table-column>
                <el-table-column label="单价" prop="price"
                                 show-overflow-tooltip>
                  <template scope="scope">
                    {{ scope.row.price|| scope.row.childPrice}}
                  </template>
                </el-table-column>
                <el-table-column label="合同号" prop="contractNumber"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="入库时间" prop="warehousingTime"
                                 show-overflow-tooltip>
                  <template scope="scope">
                    {{ conductDate(scope.row.warehousingTime,'yyyy-MM-dd') }}
                  </template>

                </el-table-column>
                <el-table-column label="使用年限" prop="serviceLife"
                                 show-overflow-tooltip>
                  <template scope="scope">
                    <!--<p class="tagTime">-->
                    <!--<el-tag close-transition type="primary">开始：-->
                    <span v-if="scope.row.warehousingTime">
                        {{new Date().getFullYear() - (conductDate(scope.row.warehousingTime,'yyyy') )}}
                      <!--{{Number(new Date().getFullYear())-Number(scope.row.warehousingTime.split('-')[0])}}-->
            </span>

                  </template>
                </el-table-column>
                <el-table-column label="报损人" prop="breakageUser"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="报损说明" prop="breakaegRemarks"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="报损日期" prop="breakageTime" show-overflow-tooltip>
                  <template scope="scope">
                    {{ scope.row.breakageTime
                  | formatDate('yyyy-MM-dd') }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170" align="left">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="资产名称" prop="assetName"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="资产编号" prop="assetNumber"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="资产类型" prop="assetType"
                         show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.assetType=='GDZC'?'固定资产':'低值品'}}
          </template>
        </el-table-column>
        <el-table-column label="存放地点" prop="storageLocation"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="经费来源" prop="fundsSource"
                         show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.fundsSource|assetJFLY}}
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="price"
                         show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.price|| scope.row.childPrice}}
          </template>
        </el-table-column>
        <el-table-column label="合同号" prop="contractNumber"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="入库时间" prop="warehousingTime"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="使用年限" prop="serviceLife"
                         show-overflow-tooltip>
          <template scope="scope">
            <!--<p class="tagTime">-->
            <!--<el-tag close-transition type="primary">开始：-->
            <span v-if="scope.row.warehousingTime">
              {{new Date().getFullYear() - scope.row.warehousingTime.substr(0,4)}}
              <!--{{Number(new Date().getFullYear())-Number(scope.row.warehousingTime.split('-')[0])}}-->
            </span>

          </template>
        </el-table-column>
        <el-table-column label="报损人" prop="breakageUser"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="报损说明" prop="breakaegRemarks"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="报损日期" prop="breakageTime" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.breakageTime
          | formatDate('yyyy-MM-dd') }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div>
           <span
             style="font-size: 14px;font-weight: bold;line-height: 35px;position: absolute;z-index:100;">{{ small.num}}台/件，{{ small.money}}元</span>
      <!-- 分页按钮 -->
      <div style="float: right;margin-top:10px;">
        <el-pagination @size-change="changePageSize" @current-change="changePage"
                       :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes"
                       :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="totalCount"></el-pagination>
      </div>
    </div>

    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题"
           class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback"
           :operaility-data="operailityData" :depId="depId"
           :url-params="api.add"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题"
           class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <!--<edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :id="todoId" :depId="depId"-->
      <!--:url-params="api.modify" :get-url-params="api.get"></edit>-->
      <add v-if="editModal" @cancel="cancel" @edit="subCallback"
           :operaility-data="operailityData" :id="todoId" :depId="depId"
           :deptObj="multipleSelection[0]"
           :url-params="api.modify" :get-url-params="api.get"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题"
           class-name="vertical-center-modal" :loading="true"
           :width="900">
      <modal-header slot="header" :parent="self"
                    :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"
            :id="todoId" :url-params="api.get"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal"
           title="对话框标题" class-name="vertical-center-modal" :loading="loading"
           :width="500">
      <modal-header slot="header" :content="button.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback"
              @cancel="cancel" :operaility-data="operailityDataDelete"></remove>
      <div slot="footer"></div>
    </Modal>
    <!-- 导出弹窗 -->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200"
           v-model="deriveModal" title="对话框标题"
           class-name="vertical-center-modal"
           :width="500">
      <modal-header slot="header" :content="button.deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="outUrl">
              <el-button @click="deriveModal=false" type="primary">确定
              </el-button>
            </a>
            <el-button class="but-col" @click="deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>


  </div>
</template>

<script>
  let Util = null

  // api
  import api from './api'

  // 模态框
  import add from './assetServicing_add' // 新增
  import edit from './assetServicing_edit' // 编辑
  import show from './assetServicing_view' // 查看

  export default {
    props: {
      contenHeight: { // 接收父组件的高度
        type: Number,
        default: 860,
      },
      depId: { // 部门id
        type: [Number, String],
        default: '',
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
        makeSmall:null,
        api,
        Refresh: true,
        endModal:false,
        // 搜索
        searchObj: {
          assetType:'',
          treeRoad: this.depMes.treeRoad,//分类路径
          assetName: '', // 	资产名称
          assetNumber: '', // 	资产编号
          storageLocation: '', // 存放地点
          fundsSource: '', // 	经费来源
          price: '', // 	单价
          contractNumber: '', // 	合同编号
          warehousingEndTime: new Date(),
          warehousingStartTime: this.conductDate(new Date((new Date().getFullYear() + '-01-01'))),
          serviceLife: '', // 	使用年限
          isSubdivided: false, // 		是否统计细分资产 	1是,0否
          breakageUser: '', // 		维修人
          breakageTimeBegin:'',
          breakageTimeEnd:''
        },
        multipleSelection: [], // 选项
        operailityData: '', // 操作的数据
        self: this,
        small: {
          num: 0,
          money: 0,
        },
        big: {
          num: 0,
          money: 0,
        },
        shows: true,
        loading: false,
        dynamicHt: 100, // 表格高度
        // 操作id
        todoId: '',
        totalCount: 0,
        tableData: [], // 表格数据
        //* 按钮 *//
        button: {
          addId: {
            id: 'addId',
            title: '新增报损记录',
          },
          showId: {
            id: 'showId',
            title: '查看报损记录',
          },
          editId: {
            id: 'editId',
            title: '修改报损记录',
          },
          removeId: {
            id: 'removeId',
            title: '删除报损记录',
          },
          deriveId: {
            id: 'deriveId',
            title: '导出',
          },
          endId:{
            id:'endId',
            title:'结束资产'
          }
        },
        searchMore: false,
        operailityDataDelete: null,
        outUrl: 'javascript:void(0)',
        deriveModal: false,
        addModal: false,
        JFLY:[],
        assetsItem:{},
        fatherData: {},
      }
    },
    methods: {
      initSelect(){
        this.searchObj={
          assetType:'',
          treeRoad: this.depMes.treeRoad,//分类路径
          assetName: '', // 	资产名称
          assetNumber: '', // 	资产编号
          storageLocation: '', // 存放地点
          fundsSource: '', // 	经费来源
          price: '', // 	单价
          contractNumber: '', // 	合同编号
          warehousingEndTime: '',
          warehousingStartTime:'',
          serviceLife: '', // 	使用年限
          isSubdivided: false, // 		是否统计细分资产 	1是,0否
          breakageUser: '', // 		维修人
          breakageTimeBegin:'',
          breakageTimeEnd:''
        }
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
      init: function () {
        this.getOption('JFLY');
        Util = this.$util
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams

        this.queryQptions = {
          url: this.api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
          },
        }

        this.setTableData()
      },

      //*----------- 表格 ------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        // this.multipleSelection = val
        this.getSelectData(val, this.tableData,'big','')
      },
      handleSelectionChangeSmall (val) {
        // let temp = []
        // this.tableData.map((item) => {
        //   item.childAssetsList && item.childAssetsList.map((itemVal) => {
        //     val.map((retuenList) => {
        //       if (itemVal.assetsId == retuenList.assetsId) {
        //         temp = item
        //       }
        //     })
        //   })
        // })
        // console.log(temp, this.multipleSelection)
        // this.multipleSelection.map((item, index) => {
        //   temp.childAssetsList && temp.childAssetsList.map((item1) => {
        //     if (item.assetsId == item1.assetsId) {
        //       this.multipleSelection.splice(index, 1)
        //     }
        //   })
        // })
        // let multipleSelection = this.multipleSelection.concat(val)
        // console.log(multipleSelection)
        // this.multipleSelection = this.uniq(multipleSelection)
        setTimeout(()=>{
          val.map((item)=>{
            item.id=item.assetsId;
          })
          this.getSelectData(val, this.tableData,'small',this.fatherData)
        })
      },
      selectSmall(val){
        this.fatherData=val
      },
      getSelectData(val, valList,type,fatherData){
        let tempArr= Util._.defaultsDeep([],this.multipleSelection);
        if(type=='small') {
          let temp =fatherData;
          let smallArray=Util._.defaultsDeep([],this.multipleSelection)
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
          let tempArray=Util._.defaultsDeep([],this.multipleSelection);

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
        this.multipleSelection=tempArr
        // this.codeList=tempArr;
        console.log(this.multipleSelection)
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
      setTableData (isLoading) {
        //    startStartTime: '', // 	维修开始开始时间
        //startEndTime: '', // 	维修开始结束时间
        //   breakageTimeBegin:'',
       // breakageTimeEnd:''
        this.hasSon=this.searchObj.isSubdivided
        this.searchObj.warehousingStartTime=this.conductDate(this.searchObj.warehousingStartTime)
        this.searchObj.warehousingEndTime=this.conductDate(this.searchObj.warehousingEndTime)
        this.searchObj.breakageTimeBegin=this.conductDate(this.searchObj.breakageTimeBegin)
        this.searchObj.breakageTimeEnd=this.conductDate(this.searchObj.breakageTimeEnd)

        this.makeSmall=this.searchObj.isSubdivided?true:false;
        console.log(typeof this.searchObj.isSubdivided,
          typeof this.searchObj.isSubdivided == 'boolean')
        this.Refresh = false
        Object.assign(this.queryQptions.params, this.searchObj, {
          treeRoad: this.depMes.treeRoad,
        })
        let params = this.queryQptions.params
//        params.startStartTime = this.conductDate(params.startStartTime,
//          'yyyy-MM-dd')
//        params.startEndTime = this.conductDate(params.startEndTime,
//          'yyyy-MM-dd')
        params.isSubdivided = params.isSubdivided ? 1 : 0
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions,
        }, isLoading)
//        let getNum=Util._.defaultsDeep({}, this.queryQptions) ;
//        getNum.url='assetsRepairing/statistics'
//
//        this.ajax({
//          ajaxSuccess:(res)=>{
//            this.big.num = res.data.parentNumber
//            this.big.money =this.fmoney(res.data.parentPrice||0)
//            this.small.num =this.hasSon?((res.data.childNumber||0)+(res.data.parentChildNumber||0)):res.data.childNumber
//            this.small.money =this.hasSon?this.fmoney(((res.data.childPrice||0)+(res.data.parentChildPrice||0))):this.fmoney(res.data.childPrice||0)
//          },
//          ajaxParams: getNum,
//        })
        this.$nextTick(() => {
          this.Refresh = true
        })

      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount || 0
        this.small.num =res.data.assetsNum
        this.small.money =this.fmoney(((res.data.assetsTotalPrice||0)))
        this.tableData = res.data.list
        if (this.tableData.length > 0) {
          this.shows = 1
        } else {
          this.shows = 0
        }
        this.$emit('shows', this.shows)
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let tableData = this.$refs.tableData
        let paginationHt = 50 * 2
        this.dynamicHt = this.contenHeight - tableData.offsetTop - paginationHt
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 归还
      borrowThis (row) {
        this.assetsItem=row;
        this.endModal=true;

      },

      /*----------- 模态框 -------------*/
      // 增加
      add () {
        this.openModel('add')
      },
      // 编辑
      edit () {
        if (this.isSelected(true)) {
          this.todoId = this.multipleSelection[0].id
          this.openModel('edit')
        }
      },
      // 查看
      show (row) {
        console.log('show==', row)
        this.todoId = row.assetsBreakageId
        this.openModel('show')
      },
      // 取消
      cancel (targer) {
        console.log('editMessTitle', targer)
        this[targer + 'Modal'] = false
      },
      // 删除
      /*--点击--删除--按钮--*/
      remove () {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection
          this.operailityDataDelete = this.$util._.defaultsDeep([],
            this.multipleSelection)
          this.operailityDataDelete.map((item) => {
            item.id = item.assetsBreakageId
          })
          this.openModel('remove')
        }
      },
      // 搜索
      search () {
        this.setTableData()
      },
      // 增加回调
      subCallback (target, title, updata) {
        console.log('增加回调', target, title, updata)
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
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.multipleSelection.length
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
      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },
      toChannel () {
        let url = '/api/assetsBreakage/exportExcel?'
        if(this.multipleSelection.length>0){ //勾选导出
          let arr=[]
          this.multipleSelection.map(item=>{
            arr.push(item.assetsBreakageId)
          })
          if(arr.length>0){
            url=url+'assetsBreakageIds='+arr.toString()
          }
          if(this.searchObj.isSubdivided&&this.searchObj.isSubdivided!=0){
            url = url+'&isSubdivided=1'
          }else{
            url = url+'&isSubdivided=0'
          }
          this.outUrl = url
        }else{
          this.searchObj.warehousingStartTime=this.conductDate(this.searchObj.warehousingStartTime)
          this.searchObj.warehousingEndTime=this.conductDate(this.searchObj.warehousingEndTime)
          this.searchObj.startStartTime = this.conductDate(this.searchObj.startStartTime,
            'yyyy-MM-dd')
          this.searchObj.startEndTime = this.conductDate(this.searchObj.startEndTime,
            'yyyy-MM-dd')
          this.searchObj.isSubdivided=(this.searchObj.isSubdivided && this.searchObj.isSubdivided != '0') ? 1 : '0'
          for (let x in this.searchObj) {
            if (this.searchObj[x]) {
              url += x + '=' + this.searchObj[x] + '&'
            }
          }
          this.outUrl = url.substring(0, url.length - 1)
        }
        console.log('导出',url)
        this.openModel('derive')
      },
    },
    components: {
      add,
      edit,
      show,
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight()
        //为窗体绑定改变大小事件
        let Event = Util.events
        Event.addHandler(window, 'resize', this.setTableDynHeight)
      })
    },
    watch: {
      contenHeight (val) {
        this.setTableDynHeight()
      },
      depId (val) {
        this.searchObj.statrEndTime = ''
        this.resetForm('searchObj')
        this.setTableData()
      },
      tableData(){
        this.$nextTick(function () {
          $('.nosocomialSmallNoSmall').parent().parent().css({'height':'0px'})
          $('.nosocomialSmallNoSmall').parent().parent().parent().prev().children('.el-table__expand-column').css({'visibility':'hidden'})

        })
      },
    },
    created () {
      this.init()
    },
  }

</script>

<style>
  p.tagTime {
    margin: 4px 0;
  }
  #nosocomial .el-table__expanded-cell {
    padding: 0;
  }

  #nosocomial .titleItem .el-table__header-wrapper {
    display: none;
  }
</style>
