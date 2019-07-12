<!--
****--@file     yycx_list
****--@date     2019-04-04 9:38
****--@author   YC
****--@describe 预约查询
-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" inline label-width="90px">
      <el-row style="margin-bottom:0">
        <!--搜索项-->
        <el-col :span="24" align="right">
          <el-form-item label="预约名称" prop="name">
            <el-input v-model="formValidate.name" placeholder="预约名称"></el-input>
          </el-form-item>
          <el-form-item label="审批状态" prop="status">
            <el-select v-model="formValidate.status" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="主任审批" value="ZRSP"></el-option>
              <el-option label="管理员审批" value="GLYSP"></el-option>
              <el-option label="驳回" value="BH"></el-option>
              <el-option label="通过" value="TG"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请单位" prop="company">
            <el-input v-model="formValidate.company" placeholder="申请单位"></el-input>
          </el-form-item>
          <el-form-item label="申请人" prop="applicant">
            <el-input v-model="formValidate.applicant" placeholder="申请人"></el-input>
          </el-form-item>
          <el-form-item label="使用类型" prop="usetype">
            <el-select v-model="formValidate.usetype" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="其他" value="QT"></el-option>
              <el-option label="工作坊" value="GZF"></el-option>
              <el-option label="会议" value="HY"></el-option>
              <el-option label="考核" value="KH"></el-option>
              <el-option label="培训" value="PX"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间：" prop="startUseDate">
            <el-date-picker
              v-model="formValidate.startUseDate"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions0"
              @change="handleStartTime">
            </el-date-picker>
            到
            <el-date-picker
              v-model="formValidate.endUseDate"
              align="right"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions1"
              @change="handleEndTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="审批时间：" prop="projectCode">
            <el-date-picker
              v-model="formValidate.startApprovalDate"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions0"
              @change="handleStartTime">
            </el-date-picker>
            到
            <el-date-picker
              v-model="formValidate.endApprovalDate"
              align="right"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions1"
              @change="handleEndTime">
            </el-date-picker>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <div id="myTable" ref="myTable">
        <el-table
          align="center"
          :height="dynamicHt"
          :data="tableData"
          stripe
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%">
          <el-table-column label="序号" prop="index" width="65">
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template scope="scope">
              <el-button @click="showBtn(scope.row)" type="primary" size="small">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="预约名称" show-overflow-tooltip width="200">
          </el-table-column>
          <el-table-column prop="company" label="申请单位" show-overflow-tooltip width="220">
          </el-table-column>
          <el-table-column prop="department" label="申请部门" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="applicant" label="申请人" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="usetype" label="使用类型" show-overflow-tooltip>
            <template scope="scope">{{scope.row.usetype | yycxUserType}}</template>
          </el-table-column>
          <el-table-column prop="useDate" label="申请时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="approvalDate" label="审批时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="status" label="审批状态" show-overflow-tooltip>
            <template scope="scope">{{scope.row.status | yycxSHStatus}}</template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div style="margin: 10px;">
        <div style="float: right;">
          <el-pagination
            @size-change="changePageSize"
            @current-change="changePage"
            :current-page="myPages.currentPage"
            :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listTotal">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--查看弹窗-->
    <Modal
      width="1000"
      v-model="showModal"
      title="查看"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /* 当前组件必要引入 */
  // 查看
  import show from './yycx_show'
  // 当前组件引入全局的util
  let Util = null
  export default {
    name: '',
    data () {
      return {
        // 搜索的数据
        formValidate:{
          name:'', // 预约名称
          status:'', // 审批状态
          company:'', // 申请单位
          applicant:'', // 申请人
          usetype:'', // 使用类型
          startUseDate:(new Date()).getFullYear() + '-' + '01-01', // 使用开始时间
          endUseDate:new Date(), // 使用结束时间
          startApprovalDate:(new Date()).getFullYear() + '-' + '01-01', // 审批开始时间
          endApprovalDate:new Date(), // 审批结束时间
        },
        dynamicHt:100, // 表格的高度
        tableData:[], // 表格的数据
        listTotal: 0,
        // 查询列表的接口
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '/open/reserve/getList',
            params: {}
          }
        },
        operailityData:'',
        loading: false,
        // 查看
        showModal:false,
        showId:{
          id:'showId',
          title:'查看',
        },
      }
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util;
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1,pageSize: Util.pageInitPrams.pageSize
        }
        this.setTableData(); // 请求表格数据
      },

      /********************** 点击事件 ************************/
      // 点击--查询--按钮
      searchEvent(){
        this.setTableData();
      },
      // 点击--查看--按钮
      showBtn(row){
        this.operailityData = row;
        this.openModel('show');
      },
      /*
        * 监听子组件通讯的方法
        * @param udata boolean 默认false  是否不需要刷新当前表格数据
        * */
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
        this[options + 'Modal'] = true;
      },
      /*
      * 监听子组件通讯的方法
      * 作用:根据不同的参数关闭对应的模态
      * @param targer string example:"add"、"edit"
      * */
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },

      /*********************** end ********************************/
      // 获取表格数据
      setTableData(){
        let formValidate = this.handleData();
        this.listMessTitle.ajaxParams.params = Object.assign(this.queryQptions,formValidate);
        this.ajax(this.listMessTitle);
      },
      updateListData(responseData){
        let data = responseData.data || [];
        data = this.addIndex(data);
        this.tableData = data;
        this.listTotal = responseData.totalCount || 0;
      },
      // 处理时间
      handleData(){
        let formValidate = Util._.defaultsDeep({}, this.formValidate);
        formValidate = this.formDate(formValidate, ['startUseDate', 'endUseDate','startApprovalDate','endApprovalDate'], 'yyyy-MM-dd')
        return formValidate;
      },

      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },
    },
    created () {
      this.init()
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      })
    },
    components: {show},
  }

</script>


