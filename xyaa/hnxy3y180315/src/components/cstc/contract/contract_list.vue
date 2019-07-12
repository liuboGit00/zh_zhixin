<!--
****--@file     contract_list
****--@date     2018/10/12 9:58
****--@author   WH
****--@describe   合同管理
-->
<template>
  <!-- 预约申请 -->
  <div id="bespeakApply" ref="bespeakSetRoom">
    <el-row style="padding-bottom:20px;">
      <el-col :span="5">
        <!-- 操作按钮 -->
        <el-button type="primary" @click="add">新增</el-button>
        <el-button type="primary" @click="toChannel">导入</el-button>
        <el-button type="danger" @click="remove">删除</el-button>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="19" align="right">
        <el-form :inline="true">
        <!--<span>签署年份：</span>-->
        <el-form-item label="签署年份" prop="activityEndTime" >
          <el-date-picker
            v-model="searchObj.year"
            align="right"
            @change="setYear"
            type="year"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
          <el-form-item label="合同编号" prop="contractNumber" >
            <el-input v-model="searchObj.contractNumber"></el-input>
          </el-form-item>
          <el-form-item label="合同名称" prop="contractName" >
            <el-input v-model="searchObj.contractName"></el-input>
          </el-form-item>
          <el-button @click="search" type="info">查询</el-button>
          <el-button @click="initSelect" type="info">清空</el-button>
        </el-form>


      </el-col>
    </el-row>
    <!--&lt;!&ndash; 多条件 &ndash;&gt;-->
    <!--<div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">-->
      <!--<el-form :inline="true">-->
        <!--&lt;!&ndash;<el-form-item label="项目名称:">&ndash;&gt;-->
        <!--&lt;!&ndash;<el-input v-model="searchObj.reservePojectName"></el-input>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
        <!--<el-form-item label="申请时间:">-->
          <!--<date-group :dateGroup="{text:'',startDate:searchObj.applicantStarDate,endDate:searchObj.applicantEndDate}">-->
            <!--<el-date-picker name="start" v-model="searchObj.applicantStarDate" :editable="false" type="date"-->
                            <!--placeholder="选择日期" :picker-options="pickerOptions0"-->
                            <!--@change="handleStartTime"></el-date-picker>-->
            <!--<span>-</span>-->
            <!--<el-date-picker name="end" v-model="searchObj.applicantEndDate" :editable="false" type="date"-->
                            <!--placeholder="选择日期" :picker-options="pickerOptions1"-->
                            <!--@change="handleEndTime"></el-date-picker>-->
          <!--</date-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="开放预约状态:">-->
          <!--<el-select v-model="searchObj.status" placeholder="请选择">-->
            <!--<el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item style="margin-right:0;" v-if="showMoreSearch">-->
          <!--<el-button @click="search" type="info">查询</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
    <!--</div>-->
    <!-- 表格数据 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="tableHeight" :context="self" :data="tableData" tooltip-effect="dark"
                class="tableShowMoreInfo" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <div>
              <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
              <el-button size="small" type="info" @click="edit(scope.row)">修改</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="合同编号" prop="contractNumber" show-overflow-tooltip></el-table-column>
        <el-table-column label="合同名称" prop="contractName" show-overflow-tooltip></el-table-column>
        <el-table-column label="甲方" prop="firstParty" show-overflow-tooltip>
          <!--<template scope="scope">-->
            <!--{{ scope.row.reserveDate | formatDate('yyyy-MM-dd') + ' ' + scope.row.startTime }}-->
          <!--</template>-->
        </el-table-column>
        <el-table-column label="乙方" prop="partyB" show-overflow-tooltip></el-table-column>
        <el-table-column label="合同金额(元)" prop="price" show-overflow-tooltip>
          <!--<template scope="scope">-->
            <!--{{ scope.row.status | typeText }}-->
          <!--</template>-->
        </el-table-column>
        <el-table-column label="签署时间" prop="signDate" show-overflow-tooltip>
          <!--<template scope="scope">-->
            <!--{{ scope.row.applicantDate }}-->
          <!--</template>-->
        </el-table-column>


      </el-table>

    </div>
    <p style="text-align: right;font-size: 14px;margin-right: 100px;font-weight: bold;line-height: 30px">总计金额：￥{{totolPrice}}</p>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 增加 -->
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="contentHeader.addId"></modal-header>
      <edit v-if="addModal" @cancel="cancel" @add="subCallback"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 查看 -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :id="operailityData.contractId"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 编辑 -->
    <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="contentHeader.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :id="operailityData.contractId"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 删除 -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" class-name="vertical-center-modal"
           :loading="loading" :width="500">
      <modal-header slot="header" :content="contentHeader.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.remove.path" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!--导入弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="toChannelModal"
           class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="contentHeader.toChannelId"></modal-header>
      <channel v-if="toChannelModal" @toChannel="subCallback" @cancel="cancel"></channel>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  let Util = null;

  import api from './api'; // API
//  import statusOption from './statusOption'; // 预约状态类型
 // import downloadVideo from '../bespeakClass/bespeakClass_downloadVideo.vue'; // 评价
 // import myEvaluation from '../../common/myEvaluation/myEvaluation.vue'; // 评价
  //  import add from './bespeakApply_add'; // 新建申请
  import show from './contract_view.vue'; // 新建申请
  import edit from './contract_input.vue'; // 新建申请
  import channel from './channal.vue'
  export default {
    data () {
      return {
        api,
        totolPrice:0,
        totalCount: 0,
        self: this,
        tableHeight: 0,
        dynamicHt: 100, // 表格高度
        loading: false,
        operailityData: [],
        multipleSelection: [], // 表格已选集
        searchObj: { // 搜索
          year:'',
          contractNumber:'',
          contractName:''
        },
        toChannelModal:false,
        tableData: [],
        // 模态框提示
        contentHeader: {
          addId: {
            id: 'addId',
            title: '新增合同'
          },
          showId: {
            id: 'showId',
            title: '查看合同'
          },
          editId: {
            id: 'editId',
            title: '编辑合同'
          },
          removeId: {
            id: 'removeId',
            title: '删除合同'
          },
          toChannelId: {
            id: 'toChannelId',
            title: '导入合同'
          }
        },
      };
    },
    methods: {
      initSelect(){
        this.searchObj={ // 搜索
          year:'',
            contractNumber:'',
            contractName:''
        }
      },
      toChannel(){
        this.toChannelModal=true;
      },
      /************************** 基本逻辑 ******************************/
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
        this.setTableData();
      },
      /************************* 搜索逻辑 *********************************/
      search () {
        this.setTableData();
      },
      setYear(){
        this.searchObj.year=this.conductDate(this.searchObj.year, 'yyyy')
      },
      // 获取筛选按钮图标
      getSearchBtnIcon () {
        return this.showMoreSearch ? 'arrow-up' : 'arrow-down';
      },
      // 显示更多筛选
      openMoreSearch () {
        this.showMoreSearch = !this.showMoreSearch;
        this.$nextTick(() => {
          if (this.showMoreSearch) {
            this.tableHeight = this.dynamicHt - this.$refs.showMoreSearch.offsetHeight;
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
      handleSelectionChange (val) {
        val.map((item)=>{
          item.id=item.contractId;
        })
        this.multipleSelection = val;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData (isLoading) {
        let searchObj = this.formDate(this.$util._.defaultsDeep({}, this.searchObj), ['applicantStarDate', 'applicantEndDate']);
        Object.assign(this.queryQptions.params, searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        console.log(res)
        this.totalCount = res.totalCount;
        this.tableData = res.data;
        this.totolPrice=0
        res.data.map((item)=>{
          this.totolPrice+=item.price;
        })
      },
      //设置表格及分页的位置
      setTableDynHeight (otherHeight = 0) {
        console.log(1)
        let contenHeight = this.$refs.bespeakSetRoom.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let rest = 0;
        let paginationHt = rest + otherHeight;
        this.dynamicHt = contenHeight - tableView.offsetTop -70;
        this.tableHeight = this.dynamicHt;
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
          this.showMess('只能修改一条数据!');
          flag = false;
        }
        return flag;
      },
      /************************************** 按钮相关 **************************************************/
      // 新建申请
      add () {
        this.openModel('add');
      },
      // 查看
      show (row) {
        this.operailityData = row;
        this.openModel('show');
      },
      // 编辑
      edit (row) {
        this.operailityData = row;
        this.openModel('edit');
      },
//      // 上报
//      report (row) {
//        this.operailityData = row;
//        this.openModel('report');
//      },
      // 已使用
//      user (row) {
//        this.operailityData = row;
//        this.openModel('user');
//      },
      // 删除
      remove () {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove');
        }
      },
//      //评价
//      evaluate (row, view) {
//        row.activityId = row.evaluateActivityId;
//        row.userId = row.reserveProjectId;
//        this.operailityData = row;
//        if (view) {
//          this.evaluationType = 'haveScoreList';
//        } else {
//          this.evaluationType = 'noScoreList';
//        }
//        this.openModel('evaluate');
//      },
//      //下载视频
//      video (row) {
//        this.operailityData = row;
//        this.openModel('video');
//      },
      /************************************** 模态框处理 **************************************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },

      // 增加回调
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

//      //评价提交数据前回调
//      submitBeforeFun (data) {
//        data.reserveId = this.operailityData.id;
//        return data;
//      },
//      //评分表回调
//      evaluateCallback (target, title, updata) {
//        this.cancel('evaluate');
//        this.subCallback('', title, updata);
//      }
    },
    components: {
//      add,
      edit,
      channel,
      show,
//      myEvaluation,
//      downloadVideo
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
      Util = this.$util;
      this.init();
    }
  };

</script>
<style lang="scss">


</style>
