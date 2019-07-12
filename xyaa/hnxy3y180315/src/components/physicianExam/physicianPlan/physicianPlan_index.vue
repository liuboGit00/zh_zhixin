<!--
****--@file     physicianPlan_list
****--@date     2019-02-13 11:19
****--@author   YC
****--@describe 场次管理
-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" inline label-width="90px">
      <el-row style="margin-bottom:0">
        <el-col :span="6">
          <el-button class="but-col task-btn-col" type="primary" @click="createBtn">新增</el-button>
          <el-button class="but-col task-btn-col" type="primary" @click="publishBtn">{{publishType}}</el-button>
          <!--<el-button class="but-col task-btn-col" type="primary" @click="unpublishBtn">撤销发布</el-button>-->
        </el-col>
        <!--搜索项-->
        <el-col :span="18" align="right">
          <el-form-item label="场次名称">
            <el-input v-model="formValidate.planName" style="width:140px;" placeholder="输入场次名称"></el-input>
          </el-form-item>
          <el-form-item label="考试时间">
            <el-date-picker
              v-model="formValidate.examDate"
              type="date"
              placeholder="选择考试时间">
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
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" prop="index" width="65">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="220">
            <template scope="scope">
              <el-button v-if="scope.row.status == 'PUBLISHED'" size="small" type="primary" @click="order(scope.row)">考官排考</el-button>
              <el-button v-if="scope.row.status == 'UNPUBLISHED'" size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status == 'UNPUBLISHED'" size="small" type="primary" @click="singleDelete(scope.row)">删除</el-button>
              <el-button size="small" type="primary" @click="show(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="planName" label="场次名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="startDate" label="开始日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="endDate" label="结束日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="amStartTime" label="上午开考时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pmStartTime" label="下午开考时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="状态" show-overflow-tooltip width="150">
            <template scope="scope">
              {{scope.row.status == 'PUBLISHED' ? '发布' : (scope.row.status == 'UNPUBLISHED' ? '未发布' :'')}}
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    <!--删除弹窗-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="removeModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :delete-url="deleteUrl" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!--新增-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="createModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="800">
      <modal-header slot="header" :content="createId"></modal-header>
      <create v-if="createModal" @cancel="cancel" @create="subCallback"></create>
      <div slot="footer"></div>
    </Modal>
    <!--发布-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="publishModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="800">
      <modal-header slot="header" :content="publishId"></modal-header>
      <operate v-if="publishModal" :type="'publish'"  :operateData="publishData" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!--撤销发布-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="unpublishModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="800">
      <modal-header slot="header" :content="unpublishId"></modal-header>
      <operate v-if="unpublishModal" :type="'unpublish'"  :operateData="unpublishData" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!--查看-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="viewModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="800">
      <modal-header slot="header" :content="viewId"></modal-header>
      <taskview v-if="viewModal" :operaility-data="operailityData"></taskview>
      <div slot="footer"></div>
    </Modal>
    <!--编辑-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="editModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="800">
      <modal-header slot="header" :content="editId"></modal-header>
      <create v-if="editModal" @cancel="cancel" @create="subCallback" type="edit" :operaility-data="operailityData"></create>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /* 当前组件必要引入 */
  // 新增
  import create from './physicianPlan_add';
  // 查看
  import taskview from './physicianPlan_view';
  // 当前组件引入全局的util
  let Util = null
  export default {
    name: '',
    data () {
      return {
        // 搜索的数据
        formValidate:{
          planName:'', // 场次名称
          examDate:'', //考试时间
        },
        dynamicHt:100, // 表格的高度
        tableData:[], // 表格的数据
        listTotal: 0,
        // 查询列表的接口
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '/zyPlan/list',
            params: {}
          }
        },
        multipleSelection: [],
        operailityData:'',
        loading: false,
        // 删除
        removeModal:false,
        removeId:{
          title:'删除',
          id:'removeId',
        },
        deleteUrl:'',
        // 新建任务
        createModal:false,
        createId:{
          title:'新建',
          id:'createId',
        },
        // 发布
        publishModal:false,
        publishId:{
          title:'发布',
          id:'publishId',
        },
        publishData:{
          url:'',
          data:{
            status:'PUBLISHED'
          }
        },
        //撤销发布
        unpublishModal:false,
        unpublishId:{
          title:'撤销发布',
          id:'unpublishId',
        },
        unpublishData:{
          url:'',
          data:{
            status:'UNPUBLISHED'
          }
        },
        //查看
        viewModal:false,
        viewId:{
          title:'查看',
          id:'viewId',
        },
        //编辑
        editModal:false,
        editId:{
          title:'编辑',
          id:'editId',
        },
        publishType:'发布'
      }
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }
        this.setTableData(); // 请求表格数据
      },

      /********************** 点击事件 ************************/
      // 点击--新建任务--按钮
      createBtn(){
        this.openModel('create');
      },
      // 点击--发布--按钮
      publishBtn(){
        if(!this.isSelected(true)) return;
        // for(let i=0 ;i<this.multipleSelection.length;i++){
        //   if(this.multipleSelection[i].status =='PUBLISHED'){
        //     this.showMess('只能对未发布的进行操作');
        //     return false;
        //   }
        // }
        let temp = [];
        this.multipleSelection.map((item)=>{
          temp.push(item.planId);
        });
        if(this.multipleSelection[0].status =='PUBLISHED'){  // 发布
          this.unpublishData.url = '/zyPlan/modify/status/' + temp.join(',');
          this.openModel('unpublish');
        }else{
          this.publishData.url = '/zyPlan/modify/status/' + temp.join(',');
          this.openModel('publish');
        }
      },

      // 点击--查询--按钮
      searchEvent(){
        this.setTableData();
      },

      // 点击--查看--按钮
      show(row){
        this.operailityData = row;
        this.openModel('view');
      },

      // 点击--编辑--按钮
      edit(row){
        this.operailityData = row;
        this.openModel('edit');
      },

      // 点击--单个删除--按钮
      singleDelete(row){
        this.deleteUrl = '/zyPlan/remove/' + row.planId;
        this.openModel('remove');
      },

      //点击--考官排考--按钮
      order(row){
        this.$emit('showPage','exam',row);
      },

      /*
       * 监听子组件通讯的方法
       * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
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

      /*************************** end ****************************/
      // 获取表格数据
      setTableData(){
        let formValidate = Util._.defaultsDeep({}, this.formValidate);
        formValidate.examDate = this.conductDate(formValidate.examDate, 'yyyy-MM-dd');
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, formValidate, this.queryQptions.params);
        this.ajax(this.listMessTitle);
      },

      updateListData(responseData){
        let data = responseData.data;
        data = this.addIndex(data);
        this.tableData = data;
        this.listTotal = responseData.totalCount || 0;

      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
        if(this.multipleSelection.length > 0 && this.multipleSelection[0].status == 'PUBLISHED'){
          this.publishType = '撤销发布';
        }else{
          this.publishType = '发布';
        }
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
          this.showMess('只能操作一条数据!')
          flag = false;
        }
        return flag;
      },

      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.parentNode.offsetHeight;
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
    components: {create,taskview}
  }

</script>

