<!--
****--@file     tjfxlb_list
****--@date     2019-04-04 9:39
****--@author   YC
****--@describe 统计分析列表
-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" inline label-width="90px">
      <el-row style="margin-bottom:0">
        <el-col :span="9">
          <el-button class="but-col task-btn-col" type="primary" @click="deriveBtn">导出</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="15" align="right">
          <el-form-item label="统计周期：" prop="projectCode">
            <el-date-picker
              v-model="formValidate.startYear"
              type="month"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions0"
              @change="handleStartTime">
            </el-date-picker>
            至
            <el-date-picker
              v-model="formValidate.endYear"
              align="right"
              type="month"
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
          show-summary
          :summary-method="getSummaries"
          style="width: 100%">
          <el-table-column prop="date" label="日期" show-overflow-tooltip width="200" align="center">
          </el-table-column>
          <el-table-column prop="reserveNum" label="预约事项数量" show-overflow-tooltip width="220" align="center"> 
          </el-table-column>
          <el-table-column prop="reserveHour" label="房间使用总时长(小时)" show-overflow-tooltip align="center">
          </el-table-column>
          <el-table-column prop="number" label="用物数量" show-overflow-tooltip align="center">
          </el-table-column>
          <el-table-column prop="price" label="用物成本(元)" show-overflow-tooltip align="center">
          </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip align="center" >
            <template scope="scope">
              <el-button type="primary" @click="showBtn(scope.row)">用物详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题"
           class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <div v-if="deriveModal">
        <div class="remove">确认导出吗？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="deriveUrl">
              <el-button @click="cancel('derive')" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="cancel('derive')">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal
      width="600"
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
  import show from './tjfxlb_show';
  // 当前组件引入全局的util
  let Util = null
  export default {
    name: '',
    data () {
      return {
        // 搜索的数据
        formValidate:{
          startYear:'', // 开始时间
          endYear:'', // 结束时间
        },
        dynamicHt:100, // 表格的高度
        tableData:[], // 表格的数据
        listTotal: 0,
        // 查询列表的接口
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '/open/reserve/statisticsList',
            params: {}
          }
        },
        operailityData:'',
        loading: false,
        // 导出
        deriveModal: false,
        deriveId: {id: 'deriveIdId', title: '导出'},
        deriveUrl:'',
        // 查看
        showModal:false,
        showId:{
          id:'showId',
          title:'用物详情',
        },
      }
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util;
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }
        this.setTableData(); // 请求表格数据
      },

      /********************** 点击事件 ************************/
      // 点击--导出--按钮
      deriveBtn(){
        if(this.tableData.length == 0){
          this.showMess('没有数据，无法导出');
          return;
        }
        let opt = this.handleData();
        this.deriveUrl = '/api/open/reserve/statisticsListExcel?' + Util.serializeParams(opt,"string");
        this.openModel('derive');
      },
      // 点击--用物详情--按钮
      showBtn(row){
        this.operailityData = row;
        this.openModel('show');
      },

      // 点击--查询--按钮
      searchEvent(){
        this.setTableData();
      },
      getSummaries(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          if(index == 1 ){
            sums[index] = '';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          } else {
            sums[index] = '';
          }
        });

        return sums;
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
        this.listMessTitle.ajaxParams.params = formValidate;
        this.ajax(this.listMessTitle);
      },
      updateListData(responseData){
        let data = responseData.data || [];
        data = this.addIndex(data);
        this.tableData = data;
        this.setTableDynHeight (this.tableData.length);
      },
      // 处理时间
      handleData(){
        let formValidate = Util._.defaultsDeep({}, this.formValidate);
        formValidate = this.formDate(formValidate, ['startYear', 'endYear'], 'yyyy-MM')
        return formValidate;
      },

      //设置表格及分页的位置
      setTableDynHeight (val) {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        if(val){
          this.dynamicHt = parHt - myTable.offsetTop - paginationHt - 20;
        }else{
          this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
        }

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
<style>
  .task-btn-col{
    padding:10px 26px;
  }
  .task-btn-col-small{
    font-size:12px;
    padding:6px 10px;
  }
</style>


