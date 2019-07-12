<template>
  <div class="examineeManger" ref="examineeManger">
    <el-form :inline="true">
      <el-row>
        <el-col :span="23" align="right">
          <el-form-item label="场次名称：">
            <el-input v-model="searchForm.taskName"  style="width: 150px"></el-input>
          </el-form-item>
          <!-- <el-form-item label="考试类别">
            <el-select placeholder="请选择" v-model="searchForm.examType" clearable>
              <el-option label="1" value="1">1</el-option>
              <el-option label="2" value="2">2</el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="考试时间">
            <el-date-picker
              v-model="searchForm.executeDate"
              type="date"
              clearable
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-button type="info" @click="search">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <div class="myTable"  id="myTable" ref="myTable">
      <el-table
      :data="tableData"
      style="width: 100%"
      :height="tabHeight">
      <el-table-column
        label="操作"
        align="center"
        >
        <template scope="scope">
          <el-button size="small" class="signblueBtn" type="primary" @click="windowOpen(scope.row)" >考务监控
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="taskName"
        label="场次名称"
        align="center"
        >
      </el-table-column>
      <!-- <el-table-column
        prop="examType"
        label="考试类别"
        align="center"
        >
      </el-table-column> -->
      <el-table-column
        prop="executeDate"
        label="开始日期"
        align="center"
        >
      </el-table-column>
      <!-- <el-table-column
        prop="endDate"
        label="结束日期"
        align="center"
        >
      </el-table-column> -->
      <el-table-column
        prop="amStartTime"
        label="上午开考时间"
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="pmStartTime"
        label="下午开考时间"
        align="center"
        >
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
  </div>  
</template>
<script>
// 当前组件引入全局的util
let Util = null
import api from './api';
export default {
  data() {
    return {
      tabHeight: 0,
      dynamicHt: 100,
      totalCount:0,
      loading: false,
      searchForm: {
        taskName: '',
        // examType: '',
        executeDate: '',
      },
      // 查询列表的接口
      listMessTitle: {
        ajaxSuccess: 'listDataSuccess',
        ajaxParams: {
          url: 'zy/task/list',
          params: {}
        }
      },
      tableData: []  //表格数据
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
    windowOpen(row){
      let path = `/exam/physicianMonitor?taskId=${row.taskId}&executeDate=${row.executeDate}&amStartTime=${row.amStartTime}`
      window.open(path,'_blank')
    },
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
      this.setTableData()
    },
    search(){   //搜索条件查询
      console.log(this.searchForm)
      this.setTableData()
    },
    // 获取表格数据
    setTableData(){
      let searchForm = Util._.defaultsDeep({}, this.searchForm);
      searchForm.executeDate = this.conductDate(searchForm.executeDate, 'yyyy-MM-dd')
      this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, searchForm, this.queryQptions.params);
      this.ajax(this.listMessTitle);
    },

    // 数据请求成功回调
    listDataSuccess (res, m, loading) {
      this.totalCount = res.totalCount || 0;
      // this.tableData = res.data.filter(item => item.status == 'PUBLISHED');
      this.tableData = res.data
      console.log(res,'数据成功sss')
    },
    //设置表格及分页的位置
    setTableDynHeight () {
      let contenHeight = this.$refs.examineeManger.parentNode.offsetHeight;
      let tableData = this.$refs.myTable;
      let paginationHt = 50;
      this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
      this.tabHeight = this.dynamicHt;
    },
  },
  components:{
  }
}
</script>
<style lang="scss" scoped>
  .myTable{
    // margin-top: 15px;
  }
</style>
