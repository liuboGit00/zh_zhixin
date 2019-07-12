<!--
****--@file     sysLog_list
****--@date     2018/8/16 14:08
****--@author   YC
****--@describe 操作日志
-->
<template>
  <div ref="content">
    <el-form :inline="true">
      <el-row>
        <el-col align="right">
          <el-form-item label="操作人名称：">
            <el-input v-model="searchObj.sqUserNowname" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="search" v-if="!searchMore">{{ 'query' | sysLan }}</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-form-item>
        </el-col>
        <div v-show="searchMore" style="clear:both;" align="right" ref="searchMore">
          <el-form-item label="操作账号：">
            <el-input v-model="searchObj.sqUserName" placeholder="请输入"></el-input>
          </el-form-item>

          <el-form-item label="操作人部门：">
            <el-input placeholder="请选择" v-model="searchObj.depName" @focus="selectDep" icon="circle-close"
                      :on-icon-click="clearDepSelect">
            </el-input>
          </el-form-item>
          <el-form-item label="模块：">
            <el-input v-model="searchObj.module" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="子模块：">
            <el-input v-model="searchObj.moduleSub" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="操作：">
            <el-input v-model="searchObj.action" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="search">{{ 'query' | sysLan }}</el-button>
          </el-form-item>
        </div>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="index" label="序号" align="center" width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sqUserName" label="操作人帐号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sqUserUnit" label="操作人单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sqUserDepName" label="操作人部门" show-overflow-tooltip></el-table-column>
        <el-table-column prop="module" label="模块" show-overflow-tooltip></el-table-column>
        <el-table-column prop="moduleSub" label="子模块" show-overflow-tooltip></el-table-column>
        <el-table-column prop="action" label="操作" show-overflow-tooltip></el-table-column>
        <el-table-column prop="objectName" label="操作对象" show-overflow-tooltip></el-table-column>
        <el-table-column prop="actionTime" label="操作时间	" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.actionTime | formatDate('yyyy-MM-dd HH:MM:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="ip地址" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                       :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>

    <!-- 选择部门 -->
    <select-dep-tree title="选择部门" getTreeUrl="/dept/tree" @selectTree="selectDepCall" ref="selectDepTree"></select-dep-tree>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import selectDepTree from '../../../common/selectTree';

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'sysLogList',
    data () {
      return {
        searchMore: false,
        searchObj: {
          sqUserName: '', // 操作账号
          sqUserNowname: '', // 操作人名称
          depName:'',
          sqUserDepId: '', // 操作人部门id
          module: '', // 模块
          moduleSub: '', // 子模块
          action: '' // 	操作
        },
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        loading: false,
        operailityData: [],
        multipleSelection: [],
        tableData: [], // 缺少 classhour
        totalCount: 0
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: 'sysLog/list',
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
        this.setTableData()
      },
      // 选择部门
      selectDep () {
        this.$refs.selectDepTree.openModal()
      },
      // 选择部门
      selectDepCall (depId, depName) {
        this.searchObj.sqUserDepId = depId || '';
        this.searchObj.depName = depName || '';
      },
      // 清除选择的部门
      clearDepSelect () {
        this.searchObj.depId = '';
        this.searchObj.depName = '';
      },
      /********************************* 按钮事件 *****************************/
      // 搜索
      search () {
        this.setTableData();
      },
      // 筛选
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          if (this.searchMore) {
            this.tabHeight = this.dynamicHt - this.$refs.searchMore.offsetHeight;
          } else {
            this.tabHeight = this.dynamicHt;
          }
        });
      },
      /********************************* 表格相关 *****************************/
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData (isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = this.addIndex(res.data || []);
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let contenHeight = this.$refs.content.parentNode.offsetHeight;
        let tableData = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
        this.tabHeight = this.dynamicHt;
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
    components: {selectDepTree}
  }

</script>
