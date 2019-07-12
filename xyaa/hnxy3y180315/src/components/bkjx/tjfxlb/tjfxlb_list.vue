<template>
  <!-- 评分 -->
  <div id="content" ref="content">
    <!-- 操作按钮 -->
    <el-row class="roomButtonList" ref="buttonList" style="margin-bottom: 10px">
      <el-col :span="8" >
        <el-button type="info" @click="derive">导出</el-button>
      </el-col>
      <el-col :span="16" align="right">
        <el-form :inline="true" :model="searchObj" ref="searchObj" label-width=""
                 class="el-form-item-search">
          <el-form-item name="start" label="统计周期：" class="feildFontweight pmStartDateBox" prop="yearMonthStart">
            <el-date-picker v-model="searchObj.yearMonthStart" type="month" :editable="false" placeholder="选择日期" width="150"
                            :picker-options="pickerOptions0" @change="handleStartTime">
            </el-date-picker>
          </el-form-item>
          <span class="pmDateText" style="line-height: 36px;margin-right: 10px;">至</span>
          <el-form-item name="end" labelWidth="10px" prop="yearMonthEnd" class="pmEndDateBox">
            <el-date-picker v-model="searchObj.yearMonthEnd" align="right" type="month" :editable="false"
                            placeholder="选择日期" :picker-options="pickerOptions1" @change="handleEndTime">
            </el-date-picker>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>
        </el-form>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <div id="myTable" ref="myTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                class="tableShowMoreInfo"
                style="width: 100%" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column label="日期" prop="courseDate" show-overflow-tooltip></el-table-column>
        <el-table-column label="房间是用总时长（小时）" prop="roomHour" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column label="课时数" prop="classHour" show-overflow-tooltip></el-table-column>
        <el-table-column label="总课时" prop="totalClassHour" show-overflow-tooltip></el-table-column>
        <el-table-column label="总人数" prop="totalStudentNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="人时数" prop="totalUserHour" show-overflow-tooltip></el-table-column>
        <el-table-column label="用物数量" prop="projectCount" show-overflow-tooltip></el-table-column>
        <el-table-column label="用物成本（元）" prop="projectCost" show-overflow-tooltip>
          <template scope="scope">
            <span @click="next(scope.row)" style="display:inline-block;text-decoration:underline;color:#0000ff;">{{scope.row.projectCost}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 导出弹窗 -->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200"
           v-model="deriveModal" title="对话框标题"
           class-name="vertical-center-modal"
           :width="500">
      <modal-header slot="header" :content="button.deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="excelExportUrl">
              <el-button @click="deriveModal=false" type="primary">确定
              </el-button>
            </a>
            <el-button class="but-col" @click="deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>

    <!-- 模态框 用物成本（next） -->
    <Modal :mask-closable="false" v-model="nextModal" title="对话框标题" class-name="vertical-center-modal"
           :width="900">
      <modal-header slot="header" :content="button.nextId"></modal-header>
      <next v-if="nextModal" @cancel="cancel" @add="subCallback" :rowData="rowData"></next>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  //当前组件引入全局的util
  let Util = null;
  let store = null;

  import api from './api'; // api
  import next from './tjfxlb_next'; // api

  // import add from './assessmentContentScore_input'; // 增加
  // import copy from './assessmentContentScore_copy'; // 复制
  // import show from './assessmentContentScore_view'; // 查看
  // import move from './assessmentContentScore_move'; // 移动
  // import score from './score_toChannel.vue'; // 导入设备

  export default {
    props: {
      treeId: {
        type: Number,
        default: 1
      },
      treeRoad: {
        type: String,
        default: '1'
      },
      // contenHeight: { // 接收父组件的高度
      //   type: Number,
      //   default: 860
      // }
    },
    data () {
      return {
        api,
        self: this,
        url: '',
        loading: false,
        searchMore: false,
        dynamicHt: 100,
        tableData: [],
        rowData:{},
        currMonth:'',
        editType:'',//判断添加和修改
        searchObj: { // 搜索数据集
          yearMonthStart: '', // 上课日期开始
          yearMonthEnd: '', // 上课日期结束
        },
        id:'',
        nextModal:false,
        deriveModal:false,
        operailityData: [],
        multipleSelection: [],
        excelExportUrl: '/api/techStatistical/exportExcel',//导出路径
        // 操作id
        todoId: {},
        //* 按钮 *//
        button: {
          nextId: {
            id: 'nextId',
            title: '用物成本'
          },
          deriveId: {
            id: 'deriveId',
            title: '导出',
          },
        }
      }
    },
    methods: {
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
        }
        this.searchObj.yearMonthStart = this.conductDate(new Date(), 'yyyy-MM');
        this.searchObj.yearMonthEnd = this.conductDate(new Date(), 'yyyy-MM');
        this.setTableData();
      },

      next(row){
        this.rowData = row
        this.openModel('next')
      },
      //*--------------------------- 表格 -----------------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
        console.log(val)
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData (isLoading) {
        this.formDate(this.searchObj, ['yearMonthStart','yearMonthEnd'], 'yyyy-MM');
        Object.assign(this.queryQptions.params, this.searchObj);

        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.tableData = res.data;
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

      //搜索监听回调
      searchEvent(isLoading){
        //        isLoading(true);
        let isSubmit = this.handleSubmit('searchObj');
        if(isSubmit){
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


      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },

      // 重置搜索
      resetForm (formName) {
        this.$refs[formName].resetFields();
      },
      /************************************** 模态框处理 **************************************************/
      // 编辑
      edit (row) {
        this.todoId.id = row.id;
        this.openModel('edit');
      },

      derive () {
        // console.log(this.excelExportUrl ,this.searchObj)
        // console.log( Util.serializeParams(this.searchObj))
        this.excelExportUrl = '/api/techStatistical/exportExcel'
        console.log(this.multipleSelection)
        // if (this.multipleSelection.length == 0) {
        //   this.$message('至少选择一条数据');
        // }else{
          console.log(Util.serializeParams(this.searchObj))
          this.excelExportUrl =this.excelExportUrl + '?' + Util.serializeParams(this.searchObj)

          console.log(this.excelExportUrl)
          this.openModel('derive');
        // }
        
      },

      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      // 删除
      /*--点击--删除--按钮--*/
      remove (row) {
        let flag = true;
        if (row.id) {
          this.operailityData = [{
            id: row.id
          }];
        } else {
          this.operailityData = [];
          flag = this.isSelected();
          if (!flag) return;
          this.multipleSelection.map(item => {
            this.operailityData.push({
              id: item.id
            })
          })
        }
        flag && this.openModel('remove')
      },

      // 搜索
      search () {
        this.setTableData();
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
      /**************** 导出 *****************************/
      // 导出
      // exportFile (type) {
      //   let idsArr = [];
      //   if (!this.multipleSelection.length) {
      //     this.errorMess('请选择需要导出的数据！')
      //     return
      //   }
      //   this.multipleSelection.map(item => {
      //     idsArr.push(item.id);
      //     // console.log(item);
      //   });
      //   this.url = `/api/${api[type + 'Export'].path}?treeId=${this.treeId}&treeRoad=${this.treeRoad}&ids=${idsArr.join(',')}`;
      //   this.openModel(type)
      //   /*this.ajax({
      //     successTitle: `导出${type}成功!`,
      //     errorTitle: `导出${type}失败!`,
      //     ajaxParams: {
      //       url: api[type + 'Export'].path,
      //       method: api[type + 'Export'].method,
      //       params: {
      //         treeId: this.treeId,
      //         treeRoad: this.treeRoad,
      //         ids: idsArr.join(',')
      //       }
      //     }
      //   })*/
      // }
    },
    components: {
      next,//用物成本
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    watch: {
      treeId (val) {
        this.initTree();
        this.resetForm('searchObj');
        this.setTableData();
      }
    },
    created () {
      this.init()
    }
  }

</script>

<style>


</style>
