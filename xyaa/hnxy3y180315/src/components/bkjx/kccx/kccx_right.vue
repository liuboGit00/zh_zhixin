<!--课程查询-->
<template>
  <div>
    <!-- 操作按钮 -->
    <el-row class="roomButtonList" ref="buttonList" style="margin-bottom: 10px">
      <el-col :span="8" >
        <el-button type="info" @click="derive">导出</el-button>
      </el-col>
      <el-col :span="16" align="right">
        <el-form :inline="true" :model="searchObj" ref="searchObj" label-width=""
                 class="el-form-item-search">
          <el-form-item  prop="name">
            <el-input placeholder="请输入内容" v-model="searchObj.courseName">
              <div slot="prepend">课程名称</div>
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button size="small" align="right" style="line-height: 18px;"
                     :icon="searchMore ? 'arrow-down' : 'arrow-up'"
                     @click="showSearchMore">高级查询
          </el-button>
        </el-form>
      </el-col>
    </el-row>
    <!-- 数据搜索 -->
    <el-row v-show="searchMore">
      <el-form :inline="true" :model="searchObj" ref="searchObj" labelWidth="90px" align="right"
               class="el-form-item-search">
        <el-form-item name="start" label="上课日期：" class="feildFontweight pmStartDateBox" prop="startDate">
          <el-date-picker v-model="searchObj.courseDateBegin" type="date" :editable="false" placeholder="选择日期" width="150"
                          :picker-options="pickerOptions0" @change="handleStartTime">
          </el-date-picker>
        </el-form-item>
        <span class="pmDateText" style="line-height: 36px;margin-right: 10px;">至</span>
        <el-form-item name="end" labelWidth="10px" prop="endDate" class="pmEndDateBox">
          <el-date-picker v-model="searchObj.courseDateEnd" align="right" type="date" :editable="false"
                          placeholder="选择日期" :picker-options="pickerOptions1" @change="handleEndTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item name="start" label="周次:" class="feildFontweight pmStartDateBox" prop="startDate">
          <el-input size="small" v-model="searchObj.weekTimesStart" placeholder="请输入"></el-input>
        </el-form-item>
        <span class="pmDateText" style="line-height: 36px;margin-right: 10px;">至</span>
        <el-form-item name="end" labelWidth="10px" prop="endDate" class="pmEndDateBox">
          <el-input size="small" v-model="searchObj.weekTimesEnd" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="授课地点：" prop="scoreTableName">
          <el-input size="small" v-model="searchObj.teachPlace" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item  prop="contacts" label="星期:">
          <el-input placeholder="请输入" v-model="searchObj.weekDay"></el-input>
        </el-form-item>
        <el-form-item  prop="contacts" label="专业:">
          <el-input placeholder="请输入" v-model="searchObj.specialty"></el-input>
        </el-form-item>
        <el-form-item  prop="contacts" label="组别:">
          <el-input placeholder="请输入" v-model="searchObj.groupTeam"></el-input>
        </el-form-item>
        <el-form-item  prop="contacts" label="课程内容:">
          <el-input placeholder="请输入" v-model="searchObj.courseContent"></el-input>
        </el-form-item>
        <el-form-item  prop="contacts" label="教师:">
          <el-input placeholder="请输入" v-model="searchObj.teacherName"></el-input>
        </el-form-item>
        <el-form-item  prop="contacts" label="年级:">
          <el-input placeholder="请输入" v-model="searchObj.grade"></el-input>
        </el-form-item>
        <el-form-item  prop="contacts" label="职称:">
          <el-input placeholder="请输入" v-model="searchObj.jobTitle"></el-input>
        </el-form-item>
        <el-form-item  prop="contacts" label="教研室:">
          <el-input placeholder="请输入" v-model="searchObj.jysName"></el-input>
        </el-form-item>
        <el-form-item  prop="contacts" label="人时:">
          <el-input placeholder="请输入" v-model="searchObj.userHour"></el-input>
        </el-form-item>
        <el-form-item  prop="contacts" label="学年:">
          <el-input placeholder="请输入" v-model="searchObj.schoolYear"></el-input>
        </el-form-item>
        <el-form-item  prop="contacts" label="学期:">
          <el-input placeholder="请输入" v-model="searchObj.term"></el-input>
        </el-form-item>
        <el-button type="info" @click="searchEvent">查询</el-button>
      </el-form>
    </el-row>
    <!-- 表格数据 -->
    <div id="deviceTable" ref="deviceTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                class="tableShowMoreInfo"
                style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="周次" prop="weekTimes" show-overflow-tooltip></el-table-column>
        <el-table-column label="日期" prop="courseDate" show-overflow-tooltip></el-table-column>
        <el-table-column label="星期" prop="weekDay" show-overflow-tooltip></el-table-column>
        <el-table-column label="节次" prop="sectionOrder" show-overflow-tooltip></el-table-column>
        <el-table-column label="学时" prop="classHour" show-overflow-tooltip></el-table-column>
        <el-table-column label="年级" prop="grade" show-overflow-tooltip></el-table-column>
        <el-table-column label="专业" prop="specialty" show-overflow-tooltip></el-table-column>
        <el-table-column label="组别" prop="groupTeam" show-overflow-tooltip></el-table-column>
        <el-table-column label="人数" prop="studentNum" show-overflow-tooltip></el-table-column>

        <el-table-column label="课程内容" prop="courseContent" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="课程名称" prop="courseName" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="课程编号" prop="courseCode" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="教师" prop="teacherName" show-overflow-tooltip></el-table-column>
        <el-table-column label="职称" prop="jobTitle" show-overflow-tooltip></el-table-column>
        <el-table-column label="教研室" prop="jysName" show-overflow-tooltip></el-table-column>
        <el-table-column label="授课地点" prop="teachPlace" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="人时" prop="userHour" show-overflow-tooltip></el-table-column>
        <el-table-column label="学年" prop="schoolYear" show-overflow-tooltip></el-table-column>
        <el-table-column label="学期" prop="term" show-overflow-tooltip></el-table-column>
      </el-table>
      <div><span>汇总统计：总学时：{{totalHours}}，总人次数：{{totalUserNumber}}，总人时数：{{totalUserHours}}，</span></div>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="totalCount"></el-pagination>
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
            <a :href="'/api/'+outUrl +'?treeId='+treeId">
              <el-button @click="deriveModal=false" type="primary">确定
              </el-button>
            </a>
            <el-button class="but-col" @click="deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  //当前组件引入全局的util
  let Util = null;
  let store = null;

  import api from './api'; // api

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
      contenHeight: { // 接收父组件的高度
        type: Number,
        default: 860
      }
    },
    data () {
      return {
        api,
        self: this,
        url: '',
        loading: false,
        searchMore: false,
        dynamicHt: 100,
        totalCount: 0,
        tableData: [],
        totalHours:0,//总学时
        totalUserNumber:0,//总人次数
        totalUserHours:0,//总人时数
        editType:'',//判断添加和修改
        searchObj: { // 搜索数据集
          courseDateBegin: '', // 上课日期开始
          courseDateEnd: '', // 上课日期结束
          courseName:'',//课程名称
          teachPlace:'',//授课地点
          weekTimesStart:'',//周次开始
          weekTimesEnd:'',//周次结束
          specialty:'',//专业
          groupTeam:'',//组别
          courseContent:'',//课程内容
          teacherName:'',//教师
          grade:'',//年级
          jobTitle:'',//职称
          jysName:'',//教研室
          userHour:'',//人时
          schoolYear:'',//学年
          term:'',//学期
          isDelete:0,//是否删除的标记
        },
        id:'',
        leadinModal: false,
        deriveModal:false,
        operailityData: [],
        multipleSelection: [],
        outUrl: 'techCourse/exportExcel',
        // 操作id
        todoId: {},
        //* 按钮 *//
        button: {
          addId: {
            id: 'addId',
            title: '新增'
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
        this.searchObj.courseDateBegin = this.conductDate(new Date(), 'yyyy-MM-dd');
        this.searchObj.courseDateEnd = this.conductDate(new Date(), 'yyyy-MM-dd');
        this.setTableData();
      },
      // 初始化树信息
      initTree () {
        this.todoId = {
          treeId: this.treeId,
          treeRoad: this.treeRoad,
          id: null
        }
      },
      //*--------------------------- 表格 -----------------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData (isLoading) {
        this.totalHours = 0//总学时
        this.totalUserNumber = 0//总人次数
        this.totalUserHours = 0//总人时数
        this.formDate(this.searchObj, ['courseDateBegin','courseDateEnd'], 'yyyy-MM-dd');
        Object.assign(this.queryQptions.params, this.searchObj,{
          treeId: this.treeId,
          treeRoad: this.treeRoad
        });

        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount;
        this.tableData = res.data;
        this.tableData.map(item=>{
          this.totalHours = Number(this.totalHours)
          this.totalUserNumber = Number(this.totalUserNumber)
          this.totalUserHours = Number(this.totalUserHours)

          this.totalHours += Number(item.classHour)  //总学时
          this.totalUserNumber += Number(item.studentNum)     //总人次数
          this.totalUserHours += Number(item.userHour) //总人时数
        })
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let deviceTable = this.$refs.deviceTable;
        let paginationHt = 50 * 2;
        this.dynamicHt = this.contenHeight - deviceTable.offsetTop - paginationHt;
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
        this.openModel('derive')
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
    },
    components: {},
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
    watch: {
      contenHeight (val) {
        this.setTableDynHeight();
      },
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
