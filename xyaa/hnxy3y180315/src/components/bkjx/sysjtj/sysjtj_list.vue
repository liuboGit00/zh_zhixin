<template>
  <div ref="content" id="content">
    <!-- 操作按钮 -->
    <el-row>
      <el-col :span="6" >
        <el-button type="info" @click="derive">导出</el-button>
      </el-col>
      <el-col :span="18" align="right">
        <el-form :inline="true" :model="searchObj" ref="searchObj" label-width=""
                 class="el-form-item-search">
          <el-form-item name="start" label="统计周期：" class="feildFontweight pmStartDateBox" prop="yearMonthStart">
            <el-date-picker v-model="searchObj.courseDateBegin" type="date" :editable="false" placeholder="选择日期" width="150"
                            :picker-options="pickerOptions0" @change="handleStartTime">
            </el-date-picker>
          </el-form-item>
          <span class="pmDateText" style="line-height: 36px;margin-right: 10px;">至</span>
          <el-form-item name="end" labelWidth="10px" prop="yearMonthEnd" class="pmEndDateBox">
            <el-date-picker v-model="searchObj.courseDateEnd" align="right" type="date" :editable="false"
                            placeholder="选择日期" :picker-options="pickerOptions1" @change="handleEndTime">
            </el-date-picker>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>
        </el-form>
      </el-col>
    </el-row>
    <div id="myTable" ref="myTable"
         style="overflow:auto;white-space: nowrap;">
      <table ref="body" class="thheightBody" style="border: solid 1px !important;line-height: 40px !important;text-align: center;" :height="dynamicHt">
        <tbody>
        <tr>
          <th colspan="19" style="font-size: 25px;">基表4-2：中南大学2019-2019学年本科生教学实验数据统计表</th>
        </tr>
        <tr><td colspan="19" style="font-size: 18px;">（统计对象：本科生，统计时段：{{searchObj.courseDateBegin}}-{{searchObj.courseDateEnd}})</td></tr>
        <tr>
          <td colspan="5">学院(盖章)：第三临床技能中心</td>
          <td colspan="5">填报人：{{userRole}}</td>
          <td colspan="4">联系电话：88618271</td>
          <td colspan="5">日期：{{date}}</td>
        </tr>
        <tr>
          <td rowspan="2">序号</td>
          <td rowspan="2">课程编号</td>
          <td rowspan="2">课程名称</td>
          <td rowspan="2">计划开出实验学时数</td>
          <td rowspan="2">实际开出实验学时数</td>
          <td colspan="2">实验项目情况</td>

          <td rowspan="2">实验学生班数</td>
          <td rowspan="2">实验学生人数</td>
          <td rowspan="2">实际完成实验总人时数</td>
          <td rowspan="2">实验总耗材费(元)</td>
          <td rowspan="2">生均耗材费(元/生)</td>
          <td colspan="6">参与实验指导人数情况(人)</td>
          <td rowspan="2">师均指导学生人数</td>
        </tr>
        <tr>
          <td>实验项目个数</td>
          <td>三性实验项目个数</td>
          <td>教授(正高)</td>
          <td>副教授(副高)</td>
          <td>讲师(中级)</td>
          <td>助教(初级)</td>
          <td>研究生助理</td>
          <td>小计</td>
        </tr>
        <tr v-for="(item,index) in tableData">
          <td>{{index+1}}</td>
          <td>{{item.courseCode}}</td>
          <td>{{item.courseName}}</td>
          <td>{{item.planHours}}</td>
          <td>{{item.actualHours}}</td>
          <td>{{item.projectCount}}</td>
          <td>{{item.threePropertieCount}}</td>
          <td>{{item.classCount}}</td>
          <td>{{item.studentNum}}</td>
          <td>{{item.actualTotoalHour}}</td>
          <td>{{item.experimentsCost}}</td>
          <td>{{item.avgCost}}</td>
          <td>{{item.professor}}</td>
          <td>{{item.associateProfessor}}</td>
          <td>{{item.lecturer}}</td>
          <td>{{item.assistant}}</td>
          <td>{{item.postgraduateAssistant}}</td>
          <td>{{item.total}}</td>
          <td>{{item.teacherAvgStudent}}</td>
        </tr>
        </tbody>
      </table>
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
  </div>
</template>

<script>
  import api from './api'; // api
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'syxmkcqktj_list',
    data () {
      return {
        tableData: [],
        dynamicHt: 100,
        totalCount: 0,
        searchObj: { // 搜索数据集
          courseDateBegin: '', // 上课日期开始
          courseDateEnd: '', // 上课日期结束
        },
        deriveModal:false,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        excelExportUrl: '/techStatistical/experimentalDataExport',//导出路径
        //* 按钮 *//
        button: {
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
        this.userRole = this.$store.state.userInfo.account.name;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }
        this.date = this.conductDate(new Date(), 'yyyy-MM-dd')
        this.searchObj.courseDateBegin = this.conductDate(new Date(), 'yyyy-MM-dd')
        this.searchObj.courseDateEnd = this.conductDate(new Date(), 'yyyy-MM-dd')
        this.setTableData();
      },

      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData (isLoading) {
        this.formDate(this.searchObj, ['courseDateBegin','courseDateEnd'], 'yyyy-MM-dd');
        Object.assign(this.queryQptions.params,this.searchObj);

        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.tableData = res.data;
      },

      //搜索监听回调
      searchEvent(){
        this.setTableData()
      },


      derive () {
        this.searchObj.userName = this.userRole
        this.excelExportUrl = '/api' + this.excelExportUrl + '?' + Util.serializeParams(this.searchObj)
        this.openModel('derive')

      },

      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.body;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

      /*
      * 打开指定的模态窗体
      * @param options string 当前指定的模态:"add"、"edit"
      * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },

      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
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
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
  }
</script>

<style scoped>
  .userDataTable {
    overflow: auto !important;
  }

  .table-th-css {
    /*background: #EFEFF4 !important;*/
    position: relative !important;
    text-align: center;
  }

  /*.thTop{*/
  /*display: none;*/
  /*}*/
  /*.thLeft{*/
  /*display: none;*/
  /*}*/
  .table-th-css td {
    /*margin: 0;*/
    /*padding: 0;*/
    /*background: #EFEFF4;*/
    /*border: 1px solid #000!important;*/
  }

  .section-scroll {
    height: 150px;
  }

  .thheight {
    table-layout: fixed;
    font-size: 13px !important;
  }

  .thheight th {
    padding: 0 5px;
    height: 40px !important;
  }

  .thheight td {
    padding: 0 5px;
    height: 40px !important;
  }

  table tbody {
    display: block;
    overflow-y: scroll;
  }

  table td {
    border: solid 1px;
    min-width: 150px;
    line-height: 40px !important;
  }

  table th {
    border: solid 1px;
    min-width: 150px;
    line-height: 40px !important;
  }

  .table-fixed-left-scroll {
    box-shadow: 6px 0 6px -4px rgba(0, 0, 0, .2);
  }

  .table-fixed-bottom-scroll {
    box-shadow: -6px -2px 7px 4px rgba(0, 0, 0, .2);
  }

  .left-bottom {
    box-shadow: 0px 1px 3px 2px rgba(0, 0, 0, .2);
  }
</style>
