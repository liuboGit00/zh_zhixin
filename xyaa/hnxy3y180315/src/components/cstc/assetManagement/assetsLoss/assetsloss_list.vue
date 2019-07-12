<template>
  <!-- 设备维修 -->
  <div>
    <template v-if="!showSmall">
    <!-- 操作按钮 -->
    <el-row class="roomButtonList" ref="buttonList" style="margin-bottom: 20px">
      <el-col :span="10">
        <el-button size="small" v-if="showSelect" type="primary" @click="add">新建</el-button>

        <el-button size="small" v-if="showSelect"  type="danger" @click="remove">删除</el-button>
        <el-button style="margin-left: 3px" type="primary" size="small" @click="toChannel">导出
        </el-button>
        <el-button size="small" type="info" @click="setShowSmall">盘亏明细</el-button>
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
            <el-form-item label="盘亏人：" prop="countOperator">
              <el-input v-model="searchObj.countOperator"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <date-group :dateGroup="{text:'',startDate:searchObj.countTimeBegin,endDate:searchObj.countTimeEnd}"
                        style="display: inline;">
              <el-form-item label="盘亏时间：" prop="scrapTimeBegin">
                <el-date-picker v-model="searchObj.countTimeBegin" :editable="false" type="date" placeholder="选择日期"
                                :picker-options="pickerOptions0"
                                @change="handleStartTime"></el-date-picker>
              </el-form-item>
              <el-form-item label-width="36px" label="至" prop="countTimeEnd">
                <el-date-picker v-model="searchObj.countTimeEnd" :editable="false" type="date" placeholder="选择日期"
                                :picker-options="pickerOptions1"
                                @change="handleEndTime"></el-date-picker>
              </el-form-item>
            </date-group>
          </el-col>
          <!--<el-col :span="22">-->
            <!--<el-form-item label="资产类型：" >-->
              <!--<el-select v-model="searchObj.assetType" placeholder="请选择">-->
                <!--<el-option label="全部" value="">-->
                <!--</el-option>-->
                <!--<el-option label="固定资产" value="GDZC">-->
                <!--</el-option>-->
                <!--<el-option label="低值品" value="DZP">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="2">
            <el-form-item>

              <el-button type="primary" size="small" @click="search">查询
              </el-button>
              <el-button style="margin-left: 2px" type="primary" size="small" @click="initSelect">清空
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <!-- 数据表格 -->
    <div id="nosocomial" ref="tableData">
      <el-table align="center" :context="self" :data="tableData"
                tooltip-effect="dark" :height="dynamicHt" style="width: 100%"
                @selection-change="handleSelectionChange" :default-expand-all=true>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column width="70" label="序号" type="index"></el-table-column>
        <el-table-column type="expand">
          <template scope="scope">
            <div class="titleItem">
              <el-table   :context="self" :data="scope.row.childAssetsList"   id="nosocomialSmall" :class="{'nosocomialSmallNoSmall':(!scope.row.childAssetsList||!scope.row.childAssetsList.length)}"
                          tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChangeSmall">
                <!-- 选项 -->
                <!-- 选项 -->
                <el-table-column width="55" align="right"></el-table-column>
                <!-- 序号 -->
                <el-table-column align="center" label="序号" prop="index" width="80">
                </el-table-column>
                <el-table-column width="34"></el-table-column>
                <el-table-column label="操作" width="100" align="left">
                  <template scope="scope">
                    <el-button size="small" type="success" @click="show(scope.row)">查看
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column label="资产名称" prop="assetName"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="预期数量" prop="expectNumber"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="实际数量" prop="realNumber"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="相差数量" prop="differNumber"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="盘亏时间" prop="countTime"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="盘亏人" prop="countOperator"
                                 show-overflow-tooltip></el-table-column>

                <!--<el-table-column label="入库时间" prop="startTime" show-overflow-tooltip-->
                <!--width="140">-->
                <!--<template scope="scope">-->
                <!--<p class="tagTime">-->
                <!--<el-tag close-transition type="primary">开始：{{ scope.row.scrapTime-->
                <!--| formatDate('yyyy-MM-dd') }}-->
                <!--</el-tag>-->
                <!--</p>-->
                <!--<p class="tagTime" v-if="scope.row.endTime">-->
                <!--<el-tag close-transition type="success">结束：{{ scope.row.endTime |-->
                <!--formatDate('yyyy-MM-dd') }}-->
                <!--</el-tag>-->
                <!--</p>-->
                <!--</template>-->
                <!--</el-table-column>-->

                <!--<el-table-column label="存放地点" prop="storageLocation"-->
                <!--show-overflow-tooltip></el-table-column>-->
                <!--<el-table-column label="报废日期" prop="scrapTime" width="200"-->
                <!--show-overflow-tooltip>-->
                <!--<template scope="scope">-->
                <!--<template v-if="scope.row.scrapTime">-->
                <!--{{ scope.row.scrapTime | formatDate('yyyy-MM-dd') }}-->
                <!--</template>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="记录人" prop="creater"
                                 show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="left">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="资产名称" prop="assetName"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="预期数量" prop="expectNumber"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="实际数量" prop="realNumber"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="相差数量" prop="differNumber"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="盘亏时间" prop="countTime"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="盘亏人" prop="countOperator"
                         show-overflow-tooltip></el-table-column>

        <!--<el-table-column label="入库时间" prop="startTime" show-overflow-tooltip-->
                         <!--width="140">-->
          <!--<template scope="scope">-->
            <!--<p class="tagTime">-->
              <!--<el-tag close-transition type="primary">开始：{{ scope.row.scrapTime-->
                <!--| formatDate('yyyy-MM-dd') }}-->
              <!--</el-tag>-->
            <!--</p>-->
            <!--<p class="tagTime" v-if="scope.row.endTime">-->
              <!--<el-tag close-transition type="success">结束：{{ scope.row.endTime |-->
                <!--formatDate('yyyy-MM-dd') }}-->
              <!--</el-tag>-->
            <!--</p>-->
          <!--</template>-->
        <!--</el-table-column>-->

        <!--<el-table-column label="存放地点" prop="storageLocation"-->
                         <!--show-overflow-tooltip></el-table-column>-->
        <!--<el-table-column label="报废日期" prop="scrapTime" width="200"-->
                         <!--show-overflow-tooltip>-->
          <!--<template scope="scope">-->
            <!--<template v-if="scope.row.scrapTime">-->
              <!--{{ scope.row.scrapTime | formatDate('yyyy-MM-dd') }}-->
            <!--</template>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="记录人" prop="creater"
                         show-overflow-tooltip></el-table-column>
      </el-table>
    </div>

    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage"
                     :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalCount"></el-pagination>
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
      <remove v-if="removeModal" idKey="assetsCountId" :deleteUrl="api.delete" @remove="subCallback"
              @cancel="cancel" :operaility-data="operailityDataDelete"></remove>
      <div slot="footer"></div>
    </Modal>
    <!--&lt;!&ndash; 导出弹窗 &ndash;&gt;-->
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
    </template>
    <template v-else>
      <el-col style="clear: both;">
        <el-button style="float: right" @click="returnSmall">返回</el-button>
      </el-col>
      <div style="clear: both"></div>
      <detail :contenHeight="contenHeight" :depMes="depMes" :depId="depId" ></detail>

    </template>
  </div>
</template>

<script>
  let Util = null

  // api
  import api from './api'
  import detail from './assetslossdetail_list.vue'
  // 模态框
  import add from './assetsLoss_add' // 新增
  import edit from './assetsLoss_edit' // 编辑
  import show from './assetsLoss_view' // 查看

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
      showSelect: {
        type: Boolean,
        default: true,
      },
    },
    data () {
      return {

        hasSon:false,
        api,
        // 搜索
        searchObj: {
          treeRoad: this.depMes.treeRoad,//分类路径
          assetName: '', // 	资产名称
   //       assetNumber: '', // 	资产编号
//          storageLocation: '', // 存放地点
//          fundsSource: '', // 	经费来源
//          price: '', // 	单价
//          contractNumber: '', // 	合同编号
//          warehousingTime: '', // 	入库时间
//          serviceLife: 0, // 	使用年限
//          isSubdivided: '', // 		是否统计细分资产 	1是,0否
//          repairer: '', // 		维修人
//          repairingStatus: '', // 		借出状态
          countTimeBegin: '', // 	盘亏时间开始时间
          countTimeEnd: '', // 	盘亏时间结束时间
          countOperator:''
        },
        multipleSelection: [], // 选项
        operailityData: '', // 操作的数据
        self: this,
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
            title: '新增盘亏',
          },
          showId: {
            id: 'showId',
            title: '查看盘亏',
          },
          editId: {
            id: 'editId',
            title: '修改报废',
          },
          removeId: {
            id: 'removeId',
            title: '删除盘亏',
          },
          deriveId: {
            id: 'deriveId',
            title: '导出',
          },
        },
        searchMore: false,
        operailityDataDelete: null,
        outUrl: 'javascript:void(0)',
        deriveModal: false,
        addModal: false,
        showSmall:false,
      }
    },
    methods: {
      initSelect(){
        this.searchObj={
          treeRoad: this.depMes.treeRoad,//分类路径
          assetName: '', // 	资产名称
          //       assetNumber: '', // 	资产编号
//          storageLocation: '', // 存放地点
//          fundsSource: '', // 	经费来源
//          price: '', // 	单价
//          contractNumber: '', // 	合同编号
//          warehousingTime: '', // 	入库时间
//          serviceLife: 0, // 	使用年限
//          isSubdivided: '', // 		是否统计细分资产 	1是,0否
//          repairer: '', // 		维修人
//          repairingStatus: '', // 		借出状态
          countTimeBegin: '', // 	盘亏时间开始时间
          countTimeEnd: '', // 	盘亏时间结束时间
          countOperator:''
        }
      },
      handleSelectionChangeSmall (val) {
        let temp = []
        this.tableData.map((item) => {
          item.childAssetsList && item.childAssetsList.map((itemVal) => {
            val.map((retuenList) => {
              if (itemVal.assetsId == retuenList.assetsId) {
                temp = item
              }
            })
          })
        })
        console.log(temp, this.multipleSelection)
        this.multipleSelection.map((item, index) => {
          temp.childAssetsList && temp.childAssetsList.map((item1) => {
            if (item.assetsId == item1.assetsId) {
              this.multipleSelection.splice(index, 1)
            }
          })
        })
        let multipleSelection = this.multipleSelection.concat(val)
        console.log(multipleSelection)
        this.multipleSelection = this.uniq(multipleSelection)
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
      returnSmall(){
        console.log(11)
        this.showSmall=false;this.init()
      },
      setShowSmall(){
        this.showSmall=true;

      },
      init: function () {
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
        this.multipleSelection = val
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData (isLoading) {
//        this.this.searchObj.isSubdivided
        Object.assign(this.queryQptions.params, this.searchObj, {
          treeRoad: this.depMes.treeRoad,
        })
        let params = this.queryQptions.params
        params.countTimeBegin = this.conductDate(params.countTimeBegin,
          'yyyy-MM-dd')
        params.countTimeEnd = this.conductDate(params.countTimeEnd,
          'yyyy-MM-dd')
//        params.isSubdivided = params.isSubdivided ? 1 : 0
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions,
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount || 0
        this.tableData = res.data
        console.log(this.tableData)
        if (this.tableData.length > 0) {
          this.shows = 1
        } else {
          this.shows = 0
        }
        this.$emit('shows', this.shows)
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        if(this.showSmall){
          return
        }
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
        this.ajax({
          ajaxSuccess: (res) => {
            this.successMess('结束成功!')
            this.setTableData()
          },
          ajaxError: () => this.errorMess('结束失败!'),
          ajaxParams: {
            url: api.modifyEndTime.path + row.assetsRepairingId,
            method: api.modifyEndTime.method,
            data: {
              id: row.assetsRepairingId,
              assetsId: row.assetsId,
            },
          },
        })
      },
      /*----------- 模态框 -------------*/
      // 增加
      add () {
        this.openModel('add')
      },
      // 编辑
      edit () {
        if (this.isSelected(true)) {
          this.todoId = this.multipleSelection[0].assetsCountId
          this.openModel('edit')
        }
      },
      // 查看
      show (row) {
        console.log('show==', row)
        this.todoId = row.assetsCountId
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
            item.id = item.assetsCountId
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
        //assetsCountIds
        let url = '/api/assetsCount/exportExcel?'
        if(this.multipleSelection.length>0){ //勾选导出
          let arr=[]
          this.multipleSelection.map(item=>{
            arr.push(item.assetsCountId)
          })
          if(arr.length>0){
            url=url+'assetsCountIds='+arr.toString()
          }
//          if(this.searchObj.isSubdivided){
//            url = url+'&isSubdivided=1'
//          }
          this.outUrl = url
        }else{
          this.searchObj.countTimeBegin = this.conductDate(this.searchObj.countTimeBegin,
            'yyyy-MM-dd')
          this.searchObj.countTimeEnd = this.conductDate(this.searchObj.countTimeEnd,
            'yyyy-MM-dd')
          this.searchObj.isSubdivided=(this.searchObj.isSubdivided && this.searchObj.isSubdivided != '0') ? 1 : '0'
          for (let x in this.searchObj) {
            if (this.searchObj[x]) {
              url += x + '=' + this.searchObj[x] + '&'
            }
          }
          this.outUrl = url.substring(0, url.length - 1)
        }
        this.openModel('derive')
      },
    },
    components: {
      add,
      edit,
      show,
      detail
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
        console.log(1)
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

</style>
