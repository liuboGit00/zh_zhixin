<!----------------------------------
****--@name     住宿确认
****--@role     ${*}
****--@date     2017/12/15
****--@author   gx
---------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10">
          <el-button type="primary" :disabled="disabled.confirm" @click="confirm">确认住宿</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14" align="right">
          <el-form-item label="姓名" prop="name">
            <el-input style="width:300px;" v-model="formValidate.name" placeholder="输入姓名搜索">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
          <!--<el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>-->
        </el-col>
      </el-row>
      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore">
        <el-form-item label="生源类型" prop="userType">
          <el-select filterable v-model="formValidate.userType" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="实习生" value="SXS"></el-option>
            <el-option label="研究生" value="YJS"></el-option>
            <el-option label="住院医" value="ZYY"></el-option>
            <el-option label="进修生" value="JXS"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="info" @click="searchEvent">查询</el-button>

      </div>
    </el-form>
    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="序号" prop="index" width="70"></el-table-column>
          <el-table-column prop="name" label="姓名" width="200"></el-table-column>
          <el-table-column prop="sex" label="性别" show-overflow-tooltip>
            <template scope="scope">{{scope.row.sex | typeText}}</template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
          <el-table-column prop="studentTypes" label="生源类型" show-overflow-tooltip>
            <template scope="scope">{{scope.row.studentTypes | participantSubject}}</template>
          </el-table-column>
          <el-table-column prop="isFreeSelect" label="是否自由选择" show-overflow-tooltip>
            <template scope="scope">{{scope.row.isFreeSelect | isFreeSelect}}</template>
          </el-table-column>
          <el-table-column prop="isArranged" label="是否已安排宿舍" show-overflow-tooltip>
            <template scope="scope">{{scope.row.isArranged | isArranged}}</template>
          </el-table-column>
          <el-table-column prop="isDormitory " label="是否需要住宿" show-overflow-tooltip>
            <template scope="scope">{{scope.row.isDormitory | isDormitory}}</template>
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
            :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--&lt;!&ndash;查看弹窗&ndash;&gt;-->
    <!--<Modal-->
    <!--:mask-closable="false"-->
    <!--width="1000"-->
    <!--v-model="showModal"-->
    <!--title="查看档案管理弹窗"-->
    <!--class-name="vertical-center-modal"-->
    <!--:loading="loading">-->
    <!--<modal-header slot="header" :content="viewId"></modal-header>-->
    <!--<show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData" :url="url"></show>-->
    <!--<div slot="footer"></div>-->
    <!--</Modal>-->
    <!--上报弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="confirmModal"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="confirmId"></modal-header>
      <operate v-if="confirmModal" :type="'confirm'" :messTitle="messTitle" :operateUrl="url.confirm"
               @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url from '../app.js'
  //引入--新建--组件
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        url: url,
        //查询表单
        formValidate: {
          name: '',       //大楼名称模糊检索
          sortby: '',//排序列
          order: ''     //升序、降序
        },
        disabled: {
          confirm: false,
        },
        messTitle: {
          title: '确定要确认住宿吗？',
          access: '确认住宿成功',
          error: '确认住宿失败'
        },

        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        searchMore:false,
        confirmModal: false,
        loading: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: url.userList,
            params: {},
          }
        },
        /*--按钮button--*/
        confirmId: {id: 'confirmId', title: '确认住宿'},
        editId: {id: 'editId', title: '修改'},
        removeId: {id: 'removeId', title: '删除'},
        viewId: {id: 'viewId', title: '查看'},

      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        }

        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        let disabled = {confirm: false,};
        val.map(item => {
          if (item.isDormitory == 1) {
            disabled.confirm = true;
          }
        })
        this.disabled = disabled;
        this.multipleSelection = val;
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

      //通过get请求列表数据
      updateListData(responseData) {
        if (!responseData.data) return;
        this.tableData = this.addIndex(responseData.data);
        if (!responseData.totalCount) return;
        this.totalCount = responseData.totalCount;
      },
      setTableData() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, this.formValidate);
        this.ajax(this.listMessTitle);
      },

      //搜索监听回调
      searchEvent(isLoading) {
        //        isLoading(true);
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
       * 点击--确认住宿--按钮
       * @param index string|number  当前行索引
       * */
      confirm() {
        if(!this.isSelected())return;
        this.operailityData = this.multipleSelection;
        this.openModel("confirm");
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data) {
        this.operailityData = data;
        this.openModel("show");
      },
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 监听子组件通讯的方法
       * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
       * @param targer string example:"add"、"edit"
       * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
       * 例如:errorTitle、errorTitle
       *addMessTitle:{
       *    type:'add',
       *    successTitle:'添加成功!',
       *    errorTitle:'添加失败!',
       *    ajaxSuccess:'ajaxSuccess',
       *    ajaxError:'ajaxError',
       *    ajaxParams:{
       *      url:'/role/add',
       *      method:'post'
       *    }
       *    }
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


      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },


    },
    created() {
      this.init();
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components: {
      //当前组件引入的子组件
    }
  }
</script>
