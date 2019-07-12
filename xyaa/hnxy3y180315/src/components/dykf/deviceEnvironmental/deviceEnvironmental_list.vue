<!--
****--@file     deviceEnvironmental_list
****--@date     2019/3/28 16:38
****--@author   于海源
****--@describe   预约申请
-->
<template>
  <!-- 预约申请 -->
  <div id="bespeakApply" ref="bespeakSetRoom">
    <el-row style="padding-bottom:20px;">
      <el-col :span="6">
        <!-- 操作按钮 -->
        <el-button type="primary" @click="add">新增</el-button>
        <el-button type="primary" @click="edit">编辑</el-button>
        <el-button type="danger" @click="remove">删除</el-button>
        <el-button type="primary" @click="report">提交</el-button>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="18" align="right">
        <el-form :inline="true">
          <!--<span>签署年份：</span>-->
          <el-form-item label="预约名称" prop="name">
            <el-input v-model="searchObj.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="合同名称" prop="contractName">
            <el-input v-model="searchObj.contractName"></el-input>
          </el-form-item>-->
          <el-form-item label="申请时间" prop="activityEndTime">
            <div class="block">
              <el-date-picker v-model="searchObj.startUseDate"
              @change="setYear"
              placeholder="开始时间"
            :picker-options="pickerOptions1"
              ></el-date-picker>
              至
              <el-date-picker v-model="searchObj.endUseDate"
              @change="setYear"
              placeholder="结束时间"
            :picker-options="pickerOptions1"
              ></el-date-picker>
            </div>
          </el-form-item>

          <el-button @click="search" type="info">查询</el-button>
          <!-- <el-button @click="initSelect" type="info">清空</el-button> -->
        </el-form>
      </el-col>
    </el-row>

    <!-- 表格数据 -->
    <div id="tableView" ref="tableView">
      <el-table
        align="center"
        :height="tableHeight"
        :context="self"
        :data="tableData"
        tooltip-effect="dark"
        class="tableShowMoreInfo"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <div>
              <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
              <!-- <el-button size="small" type="info" @click="edit(scope.row)">修改</el-button> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="预约名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请单位" prop="company" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请部门" prop="department" show-overflow-tooltip>
          <!--<template scope="scope">-->
          <!--{{ scope.row.reserveDate | formatDate('yyyy-MM-dd') + ' ' + scope.row.startTime }}-->
          <!--</template>-->
        </el-table-column>
        <el-table-column label="申请人" prop="applicant" show-overflow-tooltip></el-table-column>
        <el-table-column label="使用类型" prop="usetype" show-overflow-tooltip>
          <template scope="scope">{{reassign(scope.row.usetype)}}</template>
        </el-table-column>
        <el-table-column label="申请时间" prop="useDate" show-overflow-tooltip>
          <!--<template scope="scope">-->
          <!--{{ scope.row.applicantDate }}-->
          <!--</template>-->
        </el-table-column>
        <el-table-column label="审批状态" prop="status" show-overflow-tooltip>
          <template scope="scope">{{reassign(scope.row.status)}}</template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <p
      style="text-align: right;font-size: 14px;margin-right: 100px;font-weight: bold;line-height: 30px"
    >总计金额：￥{{totolPrice}}</p>-->
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination
        @size-change="changePageSize"
        @current-change="changePage"
        :current-page="myPages.currentPage"
        :page-sizes="myPages.pageSizes"
        :page-size="myPages.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>

    <!-- 增加 -->
    <Modal
      :mask-closable="false"
      v-model="addModal"
      height="200"
      class-name="vertical-center-modal"
      :width="1000"
    >
      <modal-header slot="header" :content="contentHeader.addId"></modal-header>
      <edit v-if="addModal" @cancel="cancel" @add="subCallback"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 查看 -->
    <Modal
      :mask-closable="false"
      v-model="showModal"
      height="200"
      class-name="vertical-center-modal"
      :width="1000"
    >
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :id="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 编辑 -->
    <Modal
      :mask-closable="false"
      v-model="editModal"
      height="200"
      class-name="vertical-center-modal"
      :width="1000"
    >
      <modal-header slot="header" :content="contentHeader.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operailityData="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 删除 -->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="removeModal"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500"
    >
      <modal-header slot="header" :content="contentHeader.removeId"></modal-header>
      <remove
        v-if="removeModal"
        :deleteUrl="api.remove.path"
        @remove="subCallback"
        @cancel="cancel"
        :operaility-data="operailityData"
      ></remove>
      <div slot="footer"></div>
    </Modal>
    <!--提交弹窗-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="reportedModal"
      class-name="vertical-center-modal"
      :width="450"
    >
      <modal-header slot="header" :content="contentHeader.reportId"></modal-header>
      <!-- operate 是公众提示框组件 -->
      <operate
      :operateData="operateData"
        v-if="reportedModal"
        @operate="subCallback"
        title="提交"
        type="reported"
        @cancel="cancel"
        :operaility-data="operailityData"
      ></operate>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
let Util = null;

import api from "./api"; // API
// import reassign from './reassign.js'
//  import statusOption from './statusOption'; // 预约状态类型
// import downloadVideo from '../bespeakClass/bespeakClass_downloadVideo.vue'; // 评价
// import myEvaluation from '../../common/myEvaluation/myEvaluation.vue'; // 评价
//  import add from './bespeakApply_add'; // 新建申请
import show from "./deviceEnvironmental_show.vue"; // 查看
import edit from "./deviceEnvironmental_input.vue"; // 新建申请

import report from "./modal_report" //提交
// import channel from "./channal.vue";
export default {
  data() {
    return {
      api,
      totolPrice: 0,
      totalCount: 0,
      self: this,
      tableHeight: 0,
      dynamicHt: 100, // 表格高度
      loading: false,
      value6: {},
      operailityData: [],
      multipleSelection: [], // 表格已选集
      operateData:{},
      searchObj: {
        // 搜索
        year: "",
        name: "",
        startUseDate:"",
        endUseDate:"",
        contractNumber: "",
        contractName: ""
      },
      reportedModal: false,
      status1:'',
      tableData: [],
      // 模态框提示
      contentHeader: {
        addId: {
          id: "addId",
          title: "新增"
        },
        showId: {
          id: "showId",
          title: "查看"
        },
        editId: {
          id: "editId",
          title: "修改"
        },
        removeId: {
          id: "removeId",
          title: "删除"
        },
        reportId:{
          id:"reportId",
          title:"修改状态"
        },
        toChannelId: {
          id: "toChannelId",
          title: "导入合同"
        }
      }
    };
  },
  methods: {
    initSelect() {
      this.searchObj = {
        // 搜索
        year: "",
        name:"",
        contractNumber: "",
        contractName: ""
      };
    },
    toChannel() {
      this.toChannelModal = true;
    },
    /************************** 基本逻辑 ******************************/
    //初始化请求列表数据
    init() {
      Util = this.$util;
      //ajax请求参数设置
      this.myPages = Util.pageInitPrams;
      console.log(this.myPages);
      this.queryQptions = {
        url: api.list.path,
        params: {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize
        }
      };
      this.setTableData();
    },
    reassign(e) {
      switch (e) {
        case "QT":
          return "其他";
          break;
        case "GZF":
          return "工作坊";
          break;
        case "HY":
          return "会议";
          break;
        case "KH":
          return "考核";
          break;
        case "PX":
          return "培训";
          break;
        case "ZRSP":
          return "主任审批";
          break;
        case "GLYSP":
          return "管理员审批";
          break;
        case "YSB":
          return "已上报";
          break;
        case "WSB":
          return "未上报";
          break;
        case "BH":
          return "驳回";
          break;
        case "TG":
          return "通过";
          break;
        default:
          break;
      }
    },
    /************************* 搜索逻辑 *********************************/
    search() {
      console.log(this.searchObj)
      this.setTableData();
    },
    setYear() {
      // console.log(value6)
      this.searchObj.year = this.conductDate(this.searchObj.year, "yyyy");
      this.searchObj.endUseDate = this.conductDate(this.searchObj.endUseDate, "yyyy-MM-dd");
      this.searchObj.startUseDate = this.conductDate(this.searchObj.startUseDate, "yyyy-MM-dd");

      console.log(this.searchObj)
    },
    // 获取筛选按钮图标
    getSearchBtnIcon() {
      return this.showMoreSearch ? "arrow-up" : "arrow-down";
    },
    // 显示更多筛选
    openMoreSearch() {
      this.showMoreSearch = !this.showMoreSearch;
      this.$nextTick(() => {
        if (this.showMoreSearch) {
          this.tableHeight =
            this.dynamicHt - this.$refs.showMoreSearch.offsetHeight;
        } else {
          this.tableHeight = this.dynamicHt;
        }
      });
    },
    /************************* 表格逻辑 *********************************/
    /*
     * checkbox 选择后触发事件
     * @param val Array 存在所有的选择每一个行数据
     */
    handleSelectionChange(val) {
      // console.log(val)
      // val.map(item => {
      //   item.id = item.contractId;
      // });
      this.multipleSelection = val;
    },
    /*
     * 设置表格数据
     * @param isLoading Boolean 是否加载
     */
    setTableData(isLoading) {
      let searchObj = this.formDate(
        this.$util._.defaultsDeep({}, this.searchObj),
        ["applicantStarDate", "applicantEndDate"]
      );
      console.log('______________')
      console.log(this.queryQptions.params)
      Object.assign(this.queryQptions.params, searchObj);
      this.ajax(
        {
          ajaxSuccess: "listDataSuccess",
          ajaxParams: this.queryQptions
        },
        isLoading
      );
    },
    // 数据请求成功回调
    listDataSuccess(res, m, loading) {
      this.totalCount = res.totalCount;
      this.tableData = res.data;
      console.log(this.tableData);
      this.totolPrice = 0;
      res.data.map(item => {
        this.totolPrice += item.price;
      });
    },
    //设置表格及分页的位置
    setTableDynHeight(otherHeight = 0) {
      // console.log(1);
      let contenHeight = this.$refs.bespeakSetRoom.parentNode.offsetHeight;
      let tableView = this.$refs.tableView;
      let rest = 0;
      let paginationHt = rest + otherHeight;
      this.dynamicHt = contenHeight - tableView.offsetTop - 70;
      this.tableHeight = this.dynamicHt;
    },
    /*
     * 列表数据只能选择一个
     * @param isOnly true  是否只选择一个
     */
    isSelected(isOnly) {
      let len = this.multipleSelection.length;
      let flag = true;
      if (len == 0) {
        this.showMess("请选择数据!");
        flag = false;
      }
      if (len > 1 && isOnly) {
        this.showMess("只能修改一条数据!");
        flag = false;
      }
      return flag;
    },
    /************************************** 按钮相关 **************************************************/
    // 新建申请
    add() {
      this.openModel("add");
    },
    // 查看
    show(row) {
      console.log(row)
      this.operailityData = row;
      this.openModel("show");
    },
    // 编辑
    edit() {
      if (this.isSelected(true)) {
        console.log(this.multipleSelection[0]);
        this.operailityData = this.multipleSelection[0];
        // this.openModel("edit");
        if(this.multipleSelection[0].status == 'GLYSP'){
          this.showMess('只能编辑未上报或者已驳回的数据')
        }else if (this.multipleSelection[0].status == 'TG') {
          this.showMess('只能编辑未上报或者已驳回的数据')
        }else if (this.multipleSelection[0].status == 'ZRSP') {
          this.showMess('只能编辑未上报或者已驳回的数据')
        }else{
          this.openModel("edit");
        }
      }
    },

    // 删除
    remove() {
      if (this.isSelected()) {
        console.log(this.multipleSelection);
        this.operailityData = this.multipleSelection;
        if(this.multipleSelection[0].status == 'GLYSP'){
          this.showMess('只能删除未上报的数据')
        }else if (this.multipleSelection[0].status == 'TG') {
          this.showMess('只能删除未上报的数据')
        }else if (this.multipleSelection[0].status == 'ZRSP') {
          this.showMess('只能删除未上报的数据')
        }else{
          this.openModel("remove");
        }
        
        
      }
    },
    // 提交
    report() {
      console.log('11111111111')
      // console.log(this.operailityData)
      if (this.isSelected(true)) {
        console.log(this.multipleSelection[0]);
        if (this.multipleSelection[0] && this.multipleSelection[0].status == 'WSB') {
          this.operateData = {
              url: api.report.path ,
              method: api.report.method,
              data:{
                status:'GLYSP'
              }
            }
       
          this.openModel("reported");
        }else if(this.multipleSelection[0] && this.multipleSelection[0].status == 'BH'){
          this.operateData = {
              url: api.report.path ,
              method: api.report.method,
              data:{
                status:'GLYSP'
              }
            }
       
          this.openModel("reported");
          
        }else{
          this.showMess('只能提交未上报的数据')
        }
        this.operailityData = this.multipleSelection;
        
      }
    },
    /*
     * 获取表单数据
     * @return string  格式:id=0&name=aa
     * */
    getFormData(data) {
      let myData = Util._.defaultsDeep({}, data);
      return myData;
    },
    /************************************** 模态框处理 **************************************************/
    // 取消
    cancel(targer) {
      this[targer + "Modal"] = false;
    },

    // 增加回调
    subCallback(target, title, updata) {
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
    openModel(options) {
      this[options + "Modal"] = true;
    }
  },
  components: {
    //      add,
    edit,
    // channel,
    show
    //      myEvaluation,
    //      downloadVideo
  },
  mounted() {
    //页面dom稳定后调用
    this.$nextTick(function() {
      //初始表格高度及分页位置
      this.setTableDynHeight();
      //为窗体绑定改变大小事件
      let Event = Util.events;
      Event.addHandler(window, "resize", this.setTableDynHeight);
    });
  },
  created() {
    Util = this.$util;
    this.init();
  }
};
</script>
<style lang="scss">
</style>
