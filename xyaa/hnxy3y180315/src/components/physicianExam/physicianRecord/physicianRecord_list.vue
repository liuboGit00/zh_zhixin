<template>
  <div class="examineeManger" ref="examineeManger">
    <el-form :inline="true">
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="recordCall" style="marginRight: 50px;">检录</el-button>
          <span style="fontSize:18px;marginRight:8px;">应检录： {{recordCount.should_record}}</span>
          <span style="fontSize:18px;marginRight:8px;">已检录： {{recordCount.actual_record}}</span>
          <span style="fontSize:18px;marginRight:8px;">未检录： {{no_record}}</span>
        </el-col>
        <el-col :span="12" align="right">
          <el-form-item label="姓名 :">
            <el-input v-model="searchForm.name" placeholder="请输入姓名">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchShow ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>
      <div v-show="searchShow" ref="searchMore">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" align="right">
          <el-form-item label="身份证号 :">
            <el-input v-model="searchForm.idCard" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item label="准考证号 :">
            <el-input v-model="searchForm.quasiExamNumber" placeholder="请输入准考证号"></el-input>
          </el-form-item>
          <el-form-item label="考试日期 :">
            <el-date-picker
              :clearable='false'
              v-model="searchForm.examinationDate"
              type="date"
              placeholder="选择日期 :">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="考试时间 :">
            <el-select placeholder="请选择" v-model="searchForm.examinationTime" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="8:00" value="8:00"></el-option>
              <el-option label="13:00" value="13:00"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="检录状态 :">
            <el-select placeholder="请选择" v-model="searchForm.status" clearable>
              <el-option label="已检录" value="1"></el-option>
              <el-option label="未检录" value="未检录"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>
          </el-form>
      </div>
    </el-form>
    <!-- 表格 -->
    <div class="myTable"  id="myTable" ref="myTable">
      <el-table
      :data="tableData"
      style="width: 100%"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      :height="tabHeight">
      <el-table-column
      type="selection"
      :selectable="selectable"
      width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="idCard"
        label="身份证号"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="quasiExamNumber"
        label="准考证号"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="examinationDate"
        label="考试日期"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="examinationTime"
        label="考试时间"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="examinationType"
        label="考试类别"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="signTime"
        label="检录时间"
        align="center"
        show-overflow-tooltip>
        <template scope="scope">
          {{scope.row.signTime }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="检录状态"
        align="center"
        show-overflow-tooltip>
        <template scope="scope">
          {{ converterStatus(scope.row.status) }}
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 分页 -->
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                       :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!--手工检录弹框-->
    <Modal :mask-closable="false" v-model="handCallModal" height="200" class-name="vertical-center-modal" :width="600" >
      <modal-header slot="header" :content="headerContent.callId"></modal-header>
      <handRecoedModal v-if="handCallModal" @cancel="cancel" @add="subCallback" @handCall="subCallback" :operaility-data="operailityData"></handRecoedModal>
      <div slot="footer"></div>
    </Modal>
    <!--自动提示成功弹框-->
    <Modal :mask-closable="false" v-model="autoSuccessModal" height="200" class-name="vertical-center-modal" :width="600">
      <modal-header slot="header" :content="headerContent.callId"></modal-header>
      <autoSuccessModal v-if="autoSuccessModal" @autoHide='autoHide' :operaility-data="operailityData"></autoSuccessModal>
      <div slot="footer"></div>
    </Modal>
    <!--姓名重复弹框-->
    <Modal :mask-closable="false" v-model="autoNameSameModal" height="200" class-name="vertical-center-modal" :width="600" @on-cancel="autoNameSame">
      <modal-header slot="header" :content="headerContent.callId"></modal-header>
      <autoNameSameModal v-if="autoNameSameModal" :operaility-data="operailityData" @autoNameSame="autoNameSame" @cancel="cancel"></autoNameSameModal>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import handRecoedModal from './handRecoedModal.vue'
import autoSuccessModal from './autoSuccessModal.vue'
import autoNameSameModal from './autoNameSameModal.vue'
let Util = null;
import api from './api';
export default {
  data() {
    return {
      handCallModal: false,  //手工检录弹框
      autoSuccessModal: false, //自动成功弹窗
      autoNameSameModal: false, //自动姓名重复弹窗
      searchShow: false,  //高级查询
      modalType: 'auto', //  区别手动检录和自动检录
      tabHeight: 0,
      dynamicHt: 100,
      totalCount:0,
      operailityData:[],
      multipleSelection:[],
      multipleSelectionTemp: [], // 备用选项
      loading: false,
      searchForm: {
        name: '',
        idCard: '',
        quasiExamNumber: '431519210S',
        examinationDate: '',
        examinationTime: '',
        status: '',//'0'
      },

      //统计数
      recordCount:'',
      no_record:'',//未检录
      headerContent:{
        callId: {
          id: 'callId',
          title: '检录'
        }
      },
      tableData: [],
      checkTimer: null  //定时器
    }
  },
  created () {
    this.init();
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
  methods:{
    init(){
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
      this.searchForm.examinationDate = this.conductDate(new Date(), 'yyyy-MM-dd');

      this.setTableData()


      //自动检录
      let getSubNode = {
        ajaxLoading: false,
        ajaxSuccess: (res) => {
          let data = res.data;
          if(data && data.length === 1){
            this.operailityData = data
            this.autoSuccessModal = true
          }else if(data && data.length > 1){
            this.operailityData = data
            this.autoNameSameModal = true

            //关闭刷新数据请求
            clearInterval(this.checkTimer)
            this.checkTimer = null
          }
        },
        ajaxParams: {
          url: api.automaticList.path,
          params: {}
        }
      }
      this.checkTimer = setInterval(() => {
        this.setTableData()  //更新数据
        this.ajax(getSubNode);
      }, 2000)
    },

    /**elemengt 表格 单元格是否可以选中
     * @params {Object} row 当行数据
     * @params {Number} index 当前行数
     * @return {boolean}
     * */
    selectable(row,index){
      return  ['0'].includes(row.status) || !row.status
    },

    //选择
    handleSelectionChange(val){
      this.multipleSelection = val;
    },

    //转换状态
    converterStatus(status){
      switch (status){
        case '0' : status = '未检录';
          break;
        case '1' : status = '已检录';
          break;
      }
      return status
    },

    //自动提示成功
    autoHide(){
      this.autoSuccessModal = false
    },

    //姓名重复
    autoNameSame(){
      this.autoNameSameModal = false

      //重新检录
      this.checkTimer = setInterval(() => {
        this.setTableData()  //更新数据
        this.ajax(getSubNode);
      }, 2000)
    },

    recordCall(){ //手动检录
      if(!this.isSelected()) return;
      this.handCallModal = true
      this.operailityData = this.multipleSelection
    },

    //统计
    recordCountData(res){
      this.recordCount = res.data
      this.no_record = Number(this.recordCount.should_record) - Number(this.recordCount.actual_record)
    },

    // 点击--查询--按钮
    searchEvent(){
      this.setTableData();
    },

    setTableData (isLoading) {
        let searchForm = {
          name: this.searchForm.name,
          idCard: this.searchForm.idCard,
          quasiExamNumber: this.searchForm.quasiExamNumber == '431519210S' ? '' : this.searchForm.quasiExamNumber,
          examinationDate: this.conductDate(this.searchForm.examinationDate, 'yyyy-MM-dd'),
          examinationTime: this.searchForm.examinationTime,
          status: this.searchForm.status,//'0'
        }
        Object.assign(this.queryQptions.params, searchForm);
        this.ajax({
          ajaxLoading: false,
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);

        let recordCountMessTitle = {
          ajaxSuccess: 'recordCountData',
          ajaxLoading: false,
            ajaxParams: {
              url: '/zy/examinee/recordCount',
              params: {
              examinationDate : this.conductDate(this.searchForm.examinationDate, 'yyyy-MM-dd')
            }
          }
        }
        this.ajax(recordCountMessTitle)

    },
    // 数据请求成功回调
    listDataSuccess (res, m, loading) {

      this.multipleSelectionTemp = this.multipleSelection;//复制当前已选数据

      this.totalCount = res.totalCount || 0;
      this.tableData = res.data;

      this.$nextTick(() => {
        this.multipleSelection = this.multipleSelectionTemp//提前复制，防止当次点击时无值
        this.setSelectData(this.multipleSelectionTemp, res.data || [])
      })

    },
    setSelectData(multipleSelection, list) {
        //获取选中的id
      let pcIds = multipleSelection.reduce((arr, item) => {
        arr.push(item.id)
        return arr;
      }, [])
      if (pcIds.length === 0) return;
      list.forEach(item => {
        if (pcIds.includes(item.id)) {
          this.$refs.multipleTable.toggleRowSelection(item);
        }
      })
    },
    showSearchMore(){
      this.searchShow = !this.searchShow
      this.$nextTick(function () {
          if (this.searchShow) {
            this.tabHeight = this.dynamicHt - this.$refs.searchMore.offsetHeight;
          } else {
            this.tabHeight = this.dynamicHt;
          }
        });
    },
    //设置表格及分页的位置
    setTableDynHeight () {
      let contenHeight = this.$refs.examineeManger.parentNode.offsetHeight;
      let tableData = this.$refs.myTable;
      let paginationHt = 50;
      this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
      this.tabHeight = this.dynamicHt;
    },
    // 取消
    cancel (targer) {
      this[targer + 'Modal'] = false;
    },

    /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
    isSelected () {
      let len = this.multipleSelection.length;
      let flag = true;
      if (len == 0) {
        this.showMess('请选择数据!');
        flag = false;
      }
      if (len > 1) {
        this.showMess('只能修改一条数据!')
        flag = false;
      }
      return flag;
    },

    // 弹窗回调
    subCallback (target, title, updata) {
      this.multipleSelection = []

      this.cancel(target);
      if (title) {
        this.successMess(title);
      }
      if (!updata) {
        this.setTableData();
      }
    }
  },
  components:{
    handRecoedModal,
    autoSuccessModal,
    autoNameSameModal
  },
  destroyed(){
    clearInterval(this.checkTimer)
    this.checkTimer = null
  }
}
</script>
<style lang="scss" scoped>
  .myTable{
    // margin-top: 15px;
  }
</style>

