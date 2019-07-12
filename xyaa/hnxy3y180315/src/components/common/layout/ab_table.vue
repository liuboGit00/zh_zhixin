<!--
****--@file     ab_table
****--@date     2018/3/17 12:16
****--@author   YC
****--@describe 自定义表格布局组件
-->
<template>
  <div >
    <!-- 表格 -->
    <div  ref="myTable" style="position: relative">
      <el-table v-if="Refresh" ref="multipleTable" align="center"
                :height="dynamicHt" :context="self" :data="tableDatas"
                tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange"
                :default-expand-all="searchObj.isSubdivided">
        <!-- 选项 -->
        <el-table-column type="selection" width="55" v-if="hasSelect"></el-table-column>
        <!-- 序号 -->
        <el-table-column align="center" label="序号" prop="index" width="80"></el-table-column>
        <el-table-column type="expand" v-if="hasSon">
          <template scope="scope">
            <div class="titleItem">
              <!--<button @click="alert(1)">11</button>-->
              <el-table :name="'titleItem'+scope.$index"  :ref="'titleItem'+scope.$index"  :context="self" :data="scope.row.childAssetsList" id="nosocomialSmall" :class="{'nosocomialSmallNoSmall':(!scope.row.childAssetsList||!scope.row.childAssetsList.length)}"
                        tooltip-effect="dark" style="width: 100%" @select="selectSmall(scope.row,222)" @selection-change="handleSelectionChangeSmall">
                <!-- 选项 -->
                <template v-if="selectSon">
                  <el-table-column type="selection" width="55" align="right"></el-table-column>
                  <!-- 序号 -->
                  <el-table-column align="center" label="序号" prop="index" width="80">
                  </el-table-column>
                  <el-table-column width="47"></el-table-column>
                  <el-table-column label="操作" width="140">
                    <template scope="props">
                      <el-button size="small" @click="show(props.row.assetsId)">查看
                      </el-button>
                      <el-button size="small" type="success" v-if="url=='assets/statistics'&&showSelect"
                                 @click="edit(props.row.assetsId)">编辑
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="资产名称" prop="assetName" show-overflow-tooltip
                                   width="100"></el-table-column>
                  <el-table-column label="资产编号" prop="assetNumber" show-overflow-tooltip
                                   width="100"></el-table-column>
                  <el-table-column label="资产分类" prop="treeName" show-overflow-tooltip
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
                 {{Number(new Date().getFullYear())-Number( new Date(scope.row.warehousingTime).getFullYear())}}
            </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="报废期限" prop="discardingTimeLimit"
                                   show-overflow-tooltip width="100"></el-table-column>
                  <el-table-column label="现状" prop="status" show-overflow-tooltip
                                   width="100">
                    <template scope="scope">
                    <span v-if="url!='assets/statistics'">
                      {{(scope.row.status||'WAREHOUSING') | statusOfAssets}}
                    </span>
                      <span v-else>
                      {{(scope.row.status||'WAREHOUSING') | statusOfAssetsIfExist }}
                    </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="经费来源" prop="fundsSource" show-overflow-tooltip
                                   width="100">
                    <template scope="scope">
                       {{scope.row.fundsSource|assetJFLY}}
                    </template>

                  </el-table-column>
                  <el-table-column label="合同号" prop="contractNumber" show-overflow-tooltip
                                   width="100"></el-table-column>
                  <el-table-column label="存放地点" prop="storageLocation"
                                   show-overflow-tooltip width="100"></el-table-column>
                </template>
                <template v-else>
                <el-table-column type="selection" width="55" align="right"></el-table-column>
                <!-- 序号 -->
                <el-table-column align="center" label="序号" prop="index" width="80">
                </el-table-column>
                <el-table-column width="47"></el-table-column>
                <el-table-column label="操作" width="140">
                  <template scope="props">
                    <el-button size="small" @click="show(props.row.assetsId)">查看</el-button>
                    <el-button size="small" type="success"  @click="edit(props.row.assetsId)">编辑</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="资产名称" prop="assetName" show-overflow-tooltip width="100"></el-table-column>
                <el-table-column label="资产编号" prop="assetNumber" show-overflow-tooltip width="100"></el-table-column>
                  <el-table-column label="资产类型" prop="assetType" show-overflow-tooltip
                                   width="100">
                    <template scope="scope">
                      {{scope.row.assetType=='GDZC'?'固定资产':'低值品'}}
                    </template>
                  </el-table-column>
                <el-table-column label="型号" prop="model" show-overflow-tooltip width="100"></el-table-column>
                <el-table-column label="规格" prop="standard" show-overflow-tooltip width="100"></el-table-column>
                <el-table-column label="单价（元）" prop="price" show-overflow-tooltip width="110"></el-table-column>
                <el-table-column label="购置日期" prop="purchaseDate" show-overflow-tooltip width="100">

                </el-table-column>
                <el-table-column label="入库时间" prop="warehousingTime" show-overflow-tooltip width="100"></el-table-column>
                  <el-table-column label="使用年限" prop="serviceLife"
                                   show-overflow-tooltip>
                    <template scope="scope">
            <span v-if="scope.row.warehousingTime">
                 {{Number(new Date().getFullYear())-Number( new Date(scope.row.warehousingTime).getFullYear())}}
            </span>
                    </template>
                  </el-table-column>
                <el-table-column label="报废期限" prop="discardingTimeLimit" show-overflow-tooltip width="100"></el-table-column>
                <el-table-column label="现状" prop="status" show-overflow-tooltip width="100">
                  <template scope="scope">
                    <span v-if="url!='assets/statistics'">
                      {{(scope.row.status||'WAREHOUSING') | statusOfAssets}}
                    </span>
                    <span v-else>
                      {{(scope.row.status||'WAREHOUSING') | statusOfAssetsIfExist }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="经费来源" prop="fundsSource" show-overflow-tooltip width="100">
                  <template scope="scope">
                    {{scope.row.fundsSource|assetJFLY}}
                  </template>
                </el-table-column>
                <el-table-column label="合同号" prop="contractNumber" show-overflow-tooltip width="100"></el-table-column>
                <el-table-column label="存放地点" prop="	storageLocation" show-overflow-tooltip width="100"></el-table-column>
                </template>
              </el-table>
              <!-- 更多数据 -->
              <!--<consumables-manage-info :rowData="props.row.storageList" @edit="subCallback"></consumables-manage-info>-->
            </div>
            <!--<p v-else style="line-height:40px;text-align:center;">暂无数据</p>-->
          </template>
        </el-table-column>
        <slot></slot>
      </el-table>
    </div>
    <span v-if="selectSon" style="font-size: 14px;font-weight: bold;line-height: 35px;float: left">{{ makeSmall? small.num:big.num }}台/件，{{ makeSmall? small.money:big.money}}元</span>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;" v-if="hasPagination">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes" :total="totalCount"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null
  export default {
    name: 'ab_table',
    props: {
      url:{
        type: String,
        default: () => ''
      },
      contenHeight: { // 接收父组件的高度
        type: Number,
        default: 860
      },
      selectSon:{
        type: Boolean,
        default: false,
      }//资产管理
      ,
      tableData: { // 表格数据
        type: Array,
        default: () => []
      },
      tableURL: { // 根据url获取表格数据
        type: [String, Object],
        default: () => ''
      },
      searchObj: { // 表格筛选条件（Url）
        type: Object,
        default: () => {}
      },
      loadTableData: { // 改变此数据将重新获取表格数据
        type: [String, Number],
        default: () => 0
      },
      hasSelect: { // 是否有复选框
        type: Boolean,
        default: true
      },
      hasSon:{
        type: Boolean,
        default: true
      },
      hasPagination: { // 是否有分页
        type: Boolean,
        default: true
      },
      depMes: {},
      showSelect: {
        type: Boolean,
        default: true,
      },
    },
    data () {
      return {
        self: this,
        loading: false,
        dynamicHt: 100,
        totalCount: 0,
        shows: 1,
        tableDatas: [],
        small:{
          num:0,
          money:0
        },
        Refresh: true,//刷新表格判断条件
        big:{
          num:0,
          money:0
        },
        makeSmall:0,
        fatherData:{}
      }
    },
    methods: {
      show(item){
        console.log(66)
        this.$emit('show',item);
      },
      edit(item){
        this.$emit('edit',item);
      },
      //初始化请求列表数据
      init () {
        console.log(this.selectSon)
        Util = this.$util
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          params: {}
        }
        this.queryQptions.params = this.hasPagination ? {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize
        } : {};

        this.setTableData();
      },
      // 获取表格数据
      setTableData () {
        if (this.searchObj.isSubdivided != null) {
          this.Refresh = false
        }
        console.log('0')
        switch (typeof this.tableURL) {
          case 'string':
            this.getTableDataByURL(this.tableURL)
            break
          case 'object':
            this.getTableDataByURL(this.tableURL.path, this.tableURL.method)
            break
          default:
            this.tableDatas = this.addIndex(this.tableData)
            break
        }
        this.$nextTick(() => {
          this.Refresh = true
        })

      },
      // 根据api获取接口
      getTableDataByURL (url, method = 'get') {
        let ajaxParams = {
          url,
          method
        }
        switch (method) {
          case 'post':
          case 'put':
            if (this.depMes) {
              this.searchObj.treeId = this.depMes.treeId
              this.searchObj.treeRoad = this.depMes.treeRoad
            }
            ajaxParams.data = Util._.defaultsDeep({}, this.searchObj)
            break
          default:
            if (this.depMes) {
              this.searchObj.treeId = this.depMes.treeId
              this.searchObj.treeRoad = this.depMes.treeRoad
            }
            ajaxParams.params = Util._.defaultsDeep({}, this.searchObj)
            break
        }

        ajaxParams.params = Util._.defaultsDeep({}, ajaxParams.params || {}, this.queryQptions.params)
        ajaxParams.params.isSubdivided = ajaxParams.params.isSubdivided ? 1 : '0'

        console.log(ajaxParams.params)
        let opt = {
          ajaxSuccess: res => {
            this.tableDatas = this.addIndex(res.data || [])
            this.tableDatas.map((item)=>{
              if(item.assetsId){
                item.id=item.assetsId;
                if(item.childAssetsList){
                  item.childAssetsList.map((item1)=>{
                    item1.id=item1.assetsId
                  })
                }
              }
            })
            if (this.tableDatas.length > 0) {
              this.shows = 1
            } else {
              this.shows = 0
            }
            this.$emit('shows', this.shows)
            this.totalCount = res.totalCount || 0;
              console.log(this.small,this.big,ajaxParams.params.isSubdivided)
            if(ajaxParams.params.isSubdivided==1){
              this.makeSmall=true;
            }else {
              this.makeSmall=false;
            }
//            }

          },
          ajaxParams
        }
        this.ajax(opt)
        let getNum=Util._.defaultsDeep({}, ajaxParams) ;
        getNum.url = this.url || getNum.url;
        console.log('ajaxParams', ajaxParams, ajaxParams.params)
        this.ajax({
          ajaxSuccess:(res)=>{
            this.big.num = res.data.parentNumber
            this.big.money =this.fmoney(res.data.parentPrice||0)
            this.small.num =res.data.childNumber
            this.small.money =this.fmoney(res.data.childPrice||0)
          },
          ajaxParams: getNum,
        })
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        this.dynamicHt = this.contenHeight - (this.hasPagination ? 62 : 0);
        console.log(this.contenHeight)
      },
      /************************************* 方法 *********************************************/
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
            if(val.length==0){
              this.tableDatas.forEach((row,index)=>{
                if(row.childAssetsList){
                     row.childAssetsList.map((item)=>{
                        this.$refs['titleItem'+index].toggleRowSelection(item,false);
                       this.$emit('selectionChange', [],this.tableDatas,'small',row)
                      })
                }
              })
            }
            this.$nextTick(()=>{
              this.tableDatas.forEach((row,index)=>{
                if(row.childAssetsList){
                  val.map(item1=>{
                    if(item1.assetsId==row.assetsId) {
                        item1.childAssetsList.map((item)=>{
                            this.$refs['titleItem'+index].toggleRowSelection(item,true);
                        })
                        this.$emit('selectionChange', item1.childAssetsList,this.tableDatas,'small',item1)
                    }
                  })
                }
              })
            })
            this.$emit('selectionChange', val,this.tableDatas,'big')
      },
      handleSelectionChangeSmall(val){
        setTimeout(()=>{
        if(this.fatherData&&JSON.stringify(this.fatherData)!='{}'){
          this.$emit('selectionChange', val,this.tableDatas,'small',this.fatherData)
        }
        })


      },
      selectSmall(val){
        this.fatherData=val
      }
    },
    created () {
      this.init()
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight()
        //为窗体绑定改变大小事件
        Util.events.addHandler(window, 'resize', this.setTableDynHeight);

      })
    },
    watch: {
      contenHeight () {
        this.setTableDynHeight()
      },
      tableDatas(){
        this.$nextTick(function () {
          console.log($('.nosocomialSmallNoSmall'))
          $('.nosocomialSmallNoSmall').parent().parent().css({'height':'0px'})
          $('.nosocomialSmallNoSmall').parent().parent().parent().prev().children('.el-table__expand-column').css({'visibility':'hidden'})

        })
      },
      active: {
        handler(n,o){
          console.log(n,o)
          this.$nextTick(()=> {
//            if(n == '6'){
//              this.listPowerSupplyTabNew.forEach((ele,indexItem) => {
//                if(ele.type=='1'){
//                  this.$refs.listPowerSupplyTabRef.toggleRowSelection(ele);
//                }
//              })
//            }else if(n == '7'){
//              this.technicalInformationNew.forEach((ele,indexItem) => {
//                if(ele.type=='1'){
//                  this.$refs.technicalInformationNewRef.toggleRowSelection(ele);
//                }
//              })
//            }

          })
        },
        immediate: true,
        deep: true
      },
      url(){
        console.log(this.url)
        this.setTableData()
      },
      tableData () {
        this.setTableData()
      },
      tableURL () {
        this.setTableData()
      },
      loadTableData () {
        this.setTableData()
      },
    },
    components: {}
  }

</script>
<style>

</style>

