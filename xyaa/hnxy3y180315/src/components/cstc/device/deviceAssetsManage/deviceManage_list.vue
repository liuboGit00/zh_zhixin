<!--
****--@file     deviceManage_list
****--@date     2018/4/21 11:49
****--@author   YC
****--@describe 设备管理
-->
<template>
  <div id="nosocomial" ref="nosocomial">
    <el-row>
      <el-col :xs="24" :md="4">
        <!-- 操作按钮 -->
        <div class="buttonList">
          <el-button size="small" type="success" @click="add">{{ 'new' | sysLan }}</el-button>
          <el-button size="small" type="primary" @click="edit">{{ 'edit' | sysLan }}</el-button>
          <el-button size="small" type="danger" @click="remove">{{ 'delete' | sysLan }}</el-button>
        </div>
      </el-col>
      <el-col :xs="5" :md="20" align="right">
        <!-- 搜索 -->
        <el-form :inline="true" class="el-form-item-search" onsubmit="return false">
          <el-form-item label="资产编码：">
            <el-input size="small" v-model="searchObj.assetName"></el-input>
          </el-form-item>
          <el-form-item label="资产名称：">
            <el-input size="small" v-model="searchObj.assetNumber"></el-input>
          </el-form-item>
          <el-form-item label="是否统计细分资产：">
            <el-checkbox v-model="makeSmall"></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search">查询</el-button>
            <el-button type="primary" size="small" @click="toChannel">导出</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <div id="deviceTable" ref="deviceTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                class="tableShowMoreInfo" ref="multipleTable"
                style="width: 100%" @selection-change="SelectionChangeDevice">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
        <el-table-column label="操作" prop="deviceTypeName">
          <template scope="props">
            <el-button size="small" @click="show(props.row.baseId)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="资产编码" prop="assetNumber" show-overflow-tooltip></el-table-column>
        <el-table-column label="资产名称" prop="assetName" show-overflow-tooltip></el-table-column>
        <el-table-column label="数量" prop="deviceNum" show-overflow-tooltip>
          <template scope="scope">
            {{ (makeSmall? scope.row.childNumber:scope.row.parentNumber)||0 }}
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="describes" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建人" prop="creater" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.createTime | formatDate('yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="margin-top:10px;">
      <el-pagination style="float: right"  @size-change="changePageSize" @current-change="changePage"
                     :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="totalCount"></el-pagination>
      <span style="font-size: 14px;font-weight: bold;line-height: 35px">总计：{{ makeSmall? small.num:big.num }}台/件，{{ makeSmall? small.money/10000:big.num/10000 }}万元</span>
    </div>
    <!-- 模态框 新增（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :width="800">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :depMes="depMes"
           :url-params="api.add" :url="api"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :width="1100">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :id="todoId" :depMes="depMes"
            :url-params="api.modify" :get-url-params="api.get" :url="api"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :width="1100">
      <modal-header slot="header" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData" :id="todoId" :url-params="api.modify"
            :get-url-params="api.get" :url="api"></show>
      <div slot="footer"></div>
    </Modal>
    <!--模态框 删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题"
           class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="button.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!--&lt;!&ndash;导出弹窗&ndash;&gt;-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题" class-name="vertical-center-modal"
           :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="url">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
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
  //当前组件引入全局的util
  let Util = null;
  // API
  import api from './api';
  // 模态框
  import add from './deviceManage_add'; // 增加
  import edit from './deviceManage_edit'; // 删除
  import show from './deviceManage_view'; // 查看

  export default {
    props: {
      contenHeight: { // 接收父组件的高度
        type: Number,
        default: 860
      },
      treeOption:{
        type: Object,
      },
      depId: { // 部门id
        type: [Number],
        default: -1,
      },
      depMes:{
      }
    },
    data () {
      return {
        url:'',
        deriveId: {
          id: 'deriveId',
          title: '导出'
        },
        api,
        deriveModal:false,
        searchObj:{
          assetName:'',
          assetNumber:''
        },
        small:{
          num:0,
          money:0,
        },
        big:{
          num:0,
          money:0
        },
        makeSmall:false,
        self: this,
        // 表格数据
        totalCount: 0,
        tableData: [],
        deviceTypeName: '', // 搜索设备名称
        multipleSelection: '', // 选项
        operailityData: '', // 操作的数据
        loading: false,
        dynamicHt: 100,
        listTotal: 0,
        // 按钮
        button: {
          addId: {
            id: 'addId',
            title: '新建设备'
          },
          editId: {
            id: 'editId',
            title: '修改设备信息'
          },
          removeId: {
            id: 'removeId',
            title: '删除设备信息'
          },
          showId: {
            id: 'showId',
            title: '查看设备信息'
          }
        },
        // 操作id
        todoId: '',
        // 设备入库的部门id的
        addDepId: '',
        derUrl: ''
      };
    },
    methods: {
      toChannel(){
        this.url='/api/assetBase/exportExcel?assetName='+this.searchObj.assetName+'&assetNumber='+this.searchObj.assetNumber+'&isSubdivided='+(this.makeSmall?0:1);
        this.openModel('derive');
      },
      //确定导出
      affirmDerive() {
        //        let http = this.$store.getters.getEnvPath.http;
        //        window.open() ;
        this.deriveModal=false;
      },
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: this.api.list.path,
          method: this.api.list.method,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
        if(this.depId){
          this.setTableData();
        }
        //this.setTableData();
      },
      //*--------------------------- 表格 -----------------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      SelectionChangeDevice (val) {
        val.map((item)=>{
          item.id=item.baseId
        })
        this.multipleSelection = val;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData () {
        this.tableData = [];
        console.log(this.depId,this.depMes)
        if(this.depMes){
          this.searchObj.treeId=this.depMes.treeId;
          this.searchObj.treeRoad=this.depMes.treeRoad;
        }
//        this.queryQptions.params.depId = this.depId;
        this.queryQptions.params= Object.assign(this.queryQptions.params,this.searchObj)
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        });
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.big={
          num:0,
          money:0
        }
        this.small={
          num:0,
          money:0
        }
        res.data.map((item)=>{
          this.big.num+=item.parentNumber;
          this.big.money+=(item.parentPrice);
          this.small.num+=item.childNumber;
          this.small.money+=item.childPrice;
        })
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let deviceTable = this.$refs.deviceTable;
        let paginationHt = 50 * 2;
        this.dynamicHt = this.contenHeight - deviceTable.offsetTop - paginationHt;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess('请选择数据!');
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess('只能选择一条数据!');
          flag = false;
        }
        return flag;
      },
      /************************************** 模态框处理 **************************************************/
      // 增加
      add () {
        this.openModel('add');
      },
      // 编辑
      edit () {
        if (this.isSelected(true)) {
          this.todoId = this.multipleSelection[0].baseId;
          this.openModel('edit');
        }
      },
      // 查看
      show (id) {
        this.todoId = id;
        this.openModel('show');
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      // 删除
      /*--点击--删除--按钮--*/
      remove () {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove');
        }
      },
      // 搜索
      search () {
        this.queryQptions.params.curPage = 1; // 从第一页开始
        this.setTableData();
      },
      // 回调
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },

      //确定导出
      affirmDerive () {

        this.cancel('derive');
      }
    },
    components: {
      add,
      edit,
      show
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      });
    },
    created () {
      this.init();
    },
    watch: {
      contenHeight (val) {
        this.setTableDynHeight();
      },
      depId (val) {
        console.log(this.depMes)
        //   this.depId = val;
        this.setTableData();
      },
    }
  };

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

</style>
