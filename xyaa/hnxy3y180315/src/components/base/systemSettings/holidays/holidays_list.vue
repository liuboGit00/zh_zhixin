<!--系统设置-->
<!--节假日-->
<template>
  <div id="content"  ref="content"  class="modal">

    <div class="listUpAreaBox">
      <div class="listUpArea-menus">
        <!--表格数据操作按钮-->
        <div class="ivu-row">
          <div class="ivu-col ivu-col-span-24">
            <el-button  class="but-col"  @click="add"  type="primary">新 建</el-button>
            <el-button  @click="remove" type="danger">删除</el-button>
          </div>
        </div>
      </div>
      <div class="listUpArea-search">
        <div class="listUpArea-searchWrapper">
          <!--右侧查询-->
          <el-form ref="formValidate"  :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="60px" >
            <div class="listUpArea-searchLeft">
              <input class="hidden">
              <el-input placeholder="请输入内容" v-model="formValidate.holidayName">
                <div slot="prepend">节日名称</div>
                <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
              </el-input>
            </div>
            <!-- <div class="listUpArea-moreSearch">
              <el-button @click="showMoreSearch" type="text">高级查询</el-button>
            </div> -->
          </el-form>
        </div>
      </div>
    </div>
    <div v-if="isShowMoreSearch" class="listUpArea-moreSearchBox">

    </div>
    <br />
    <div>
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          align="center"
          :height="dynamicHt"
          :data="tableData1"

          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">

          <el-table-column
            label="序号"
            type="index"
            width="65">
          </el-table-column>
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column label="操作"  width="200" align="center">
            <template scope="scope">
              <el-button
                size="small"
                @click="show(scope.$index,scope.row)">查看</el-button>
              <el-button
                size="small"
                @click="edit(scope.$index, scope.row)">修改</el-button>
              <el-button v-if="scope.row.status==1" type="success" size="small" @click="forbidden(scope.$index, scope.row)">启 用</el-button>
              <el-button v-if="!scope.row.status" size="small" @click="startUsing(scope.$index, scope.row)" type="danger">禁 用</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="holidayName"
            label="节日名称"
            >
          </el-table-column>
          <el-table-column
            prop="startDate"
            label="开始时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="endDate"
            label="结束时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="120"
          >
            <template scope="scope">
              {{scope.row.status==1?`禁用`:`启用`}}
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
    <!--修改弹窗-->
    <Modal
      :mask-closable="false"
      v-model="editModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="700">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="editId"></modal-header>
      <edit v-if="editModal"   @cancel="cancel"  @edit="subCallback"  :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--增加弹窗-->
    <Modal
      :mask-closable="false"
      v-model="addModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="700">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal"  @cancel="cancel" @add="subCallback" ></add>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      v-model="showModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="700"
    >
      <modal-header slot="header" :content="showId"></modal-header>
      <show v-if="showModal"  @cancel="cancel"   :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--删除弹窗-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="removeModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!--启用弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="enableModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="forbiddenId"></modal-header>
      <operate v-if="enableModal" :type="'enable'" :operate-data="enableData" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!--禁用弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="disEnableModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="startUsingId"></modal-header>
      <operate v-if="disEnableModal" :type="'disEnable'" :operate-data="useingData" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script >
  /*当前组件必要引入*/
  //引入--审查--组件
  import edit from "./holidays_edit.vue";

  //引入--查看--组件
  import show from "./holidays_view.vue";
  //引入--添加--组件
  import add from "./holidays_add.vue";
  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        //查询表单
        deleteUrl:'/holidaySet/remove',
        formValidate: {
          holidayName: '',
        },
        /*--按钮button--*/
        addId:{
          id:'add',
          title:'添加'},
        removeId:{
          id:'remove',
          title:'删除'
        },
        editId:{
          id:'edit',
          title:'修改'
        },
        showId:{
          id:'auditId',
          title:'查看'
        },
        forbiddenId:{
          id:'forbidden',
          title:'禁用'
        },
        startUsingId:{
          id:'startUsing',
          title:'启用'
        },

        //启用
        enableModal:false,
        enableData:{
          url:'/holidaySet/modifyStatus',
          data:{
            status:'0'
          }
        },

        //禁用
        disEnableModal:false,
        useingData:{
          url:'/holidaySet/modifyStatus',
          data:{
            status:'1'
          }
        },

        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        tableData1: [],
        loading:false,
        listTotal:0,
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:'/holidaySet/list',
            params:{}
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
          params:{holidayName:"",roleId:"",status:""}
        }

        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight(){
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
        this.multipleSelection = val;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected(isOnly){
        let len = this.multipleSelection.length;
        let flag = true;
        if(len==0){
          this.showMess("请选择数据!");
          flag = false;
        }
        if(len>1 && isOnly){
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.tableData1=[];
        this.tableData1=data;
        this.listTotal = responseData.totalCount || 0;
      },
      setTableData(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions.params,this.formValidate);
        this.ajax(this.listMessTitle);
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name){
        this.setTableData();
      },
      /*--点击--添加--按钮--*/
      add(){
        this.openModel('add');
      },
      /*--点击--删除--按钮--*/
      remove(){
        if(!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove') ;
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(index){
        this.operailityData = this.tableData1[index];
        this.showModal = true;
      },


      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(index){
        if(typeof index == 'undefined'){
          if(!this.isSelected(true)) return;
          this.operailityData = this.multipleSelection[0];
          this.openModel('edit')
        }else {
          this.operailityData = this.tableData1[index];
          this.openModel('edit')
        }
      },
//      禁用
      forbidden(index){
        this.operailityData = this.tableData1[index];
        this.openModel("enable");
      },
//      启用
      startUsing(index){
        this.operailityData = this.tableData1[index];
        this.openModel("disEnable");
      },


      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer){
        this[targer+'Modal'] = false;
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
      subCallback(target,title,updata){
        this.cancel(target);
        if(title){
          this.successMess(title);
        }
        if(!updata){
          this.formValidate = this.setObjValEmpty(this.formValidate);
          this.setTableData();
        }
      },


      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options){
        this[options+'Modal'] = true;
      }
    },
    created(){
      this.init();
    },

    mounted(){
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components:{
      //当前组件引入的子组件
      edit,add,show
    }

  }
</script>
