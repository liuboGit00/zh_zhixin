<!--
****--@file
****--@date
****--@author
****--@describe 培训项目维护
-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" inline label-width="150px">
      <el-row style="margin-bottom:0">
      <!--列表操作按钮-->
        <el-col :span="14" style="margin-bottom: 21px;">
          <el-button type="primary" @click="add">新增</el-button>
          <el-button type="primary" @click="edit">编辑</el-button>
          <el-button type="danger" @click="remove">删除</el-button>
        </el-col>
        <el-col :span="10" style="margin-bottom: 21px;" align="right">
          <el-form-item  prop="name" label="培训项目名称:">
            <el-input placeholder="请输入" v-model="formValidate.name"></el-input>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!--表格数据-->
    <div
      id="table"
      ref="myTable"
    >
      <el-table :data="tableData" style="width: 100%" highlight-current-row :height="dynamicHt"  @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          align="center"
          label="序号"
          prop="index"
          width="100">
          <template scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="Monday">
          <template scope="scope">
            <el-button type="info" size="small" @click="view(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="培训项目名称" prop="name">
        </el-table-column>
        <el-table-column label="项目描述" prop="projectDescription">
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div style="margin: 10px;">
    <div style="float: right;">
    <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
    :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
    layout="total, sizes, prev, pager, next, jumper" :total="listTotal">
    </el-pagination>
    </div>
    </div>

    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题"
           class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback"
           :operaility-data="operailityData" :depId="depId" :type-status="typeStatus"></add>
      <div slot="footer"></div>
    </Modal>

    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题"
           class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <add v-if="editModal" @cancel="cancel" @add="subCallback"
           :operaility-data="operailityData" :depId="depId" :typeStatus="typeStatus"></add>
      <div slot="footer"></div>
    </Modal>

    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题"
           class-name="vertical-center-modal"
           :width="800">
      <modal-header slot="header" :parent="self"
                    :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData" :typeStatus="typeStatus"
            :depId="depId"></show>
      <div slot="footer"></div>
    </Modal>

    <!-- 模态框 删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题"
           class-name="vertical-center-modal"
           :width="500">
      <modal-header slot="header" :content="button.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete+ids" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>
<script>
  /* 当前组件必要引入 */
  import api from './api'
  // 模态框
  import add from './pxxmwh_add' // 新增
  import show from './pxxmwh_add' // 新增
  // 当前组件引入全局的util
  let Util = null
  export default {
    name: '',
    data () {
      return {
        api,
        typeStatus:'',
        depId:'',
        ids:'',
        operailityData:'',
        multipleSelection:[],
        listTotal: 0,
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        formValidate:{
          name:''

        },
        button: {
          addId: {
            id: 'addId',
            title: '新增',
          },
          showId: {
            id: 'showId',
            title: '查看',
          },
          editId: {
            id: 'editId',
            title: '修改',
          },
          removeId: {
            id: 'removeId',
            title: '删除',
          },
        },
        tableTitle:{
          ajaxSuccess:'getTableData',
          ajaxParams:{
            url:api.list.path,
            method:api.list.method,
            params:{},
          }
        },

        tableTitleData:[],
        tableData:[],

      }
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }
        this.setTableData(); // 初始化表格数据
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
        this.ids = this.multipleSelection.map(item => item.id).join(',')
      },

      // 调用表格数据
      setTableData(){
        this.tableTitle.ajaxParams.params = Object.assign(this.tableTitle.ajaxParams.params,this.queryQptions.params,this.formValidate);
        this.ajax(this.tableTitle);
      },

      // 获取表格数据
      getTableData(responseData){
        this.listTotal = responseData.totalCount
        this.tableData = responseData.data
      },

      // 增加
      add () {
        this.typeStatus = 'add'
        this.openModel('add')
      },

      edit(){
        if(!this.isSelected()) return;
        this.typeStatus = 'edit'
        this.depId = this.multipleSelection[0].id
        this.openModel('edit')
      },


      isSelected (isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess('请选择数据!');
          flag = false;
        }
        if (len > 1) {
          this.showMess('只能操作一条数据!')
          flag = false;
        }
        return flag;
      },


      view(row){
        this.typeStatus ='show'
        this.depId = row.id
        this.openModel('show')
      },

      remove(){
        this.openModel('remove')
      },

      // @param udata boolean 默认false  是否不需要刷新当前表格数据
      subCallback(target,title,updata){
        this.cancel(target);
        if(title){
          this.successMess(title);
        }
        if(!updata){
          this.setTableData();
        }
      },

      // 点击-搜索-按钮
      searchEvent() {
        this.formDate(this.formValidate, ['year'], 'yyyy');
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.setTableData()
        }
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        let flag = false
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
        return flag
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true
      },
      // 取消模块
      cancel(target){
        this[target + 'Modal'] = false;
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
        this.tabHeight = parHt - myTable.offsetTop - paginationHt;
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
    components: {
      add,show,
    },
  }

</script>
<style lang="scss">
  .name-wrapper .el-tag{
    background:#fff;
    color:#000;
    padding:0px 0px;
  }
  #table table tbody tr:hover > td .el-tag{
    background:#eef1f6;
  }
</style>
