<!--实验项目开出情况统计-->
<template>
  <div style="height:100%;" ref="content" id="content">
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
         style="overflow:auto;white-space: nowrap;height:790px;">
      <table ref="body" style="border: solid 1px !important;line-height: 40px !important;text-align: center;" :height="dynamicHt">
        <tbody>
        <tr>
          <th colspan="26" style="font-size: 25px;">基表4-1：中南大学2019-2019学年本科生教学实验项目开出情况汇总表</th>
        </tr>
        <tr><td colspan="26" style="font-size: 18px;">（统计对象：本科生，统计时段：{{searchObj.courseDateBegin}}-{{searchObj.courseDateEnd}})</td></tr>
        <tr>
          <td colspan="4">学校名称(盖章)</td>
          <td colspan="3">第三临床技能中心</td>
          <td colspan="5">填报人：{{userRole}}</td>
          <td colspan="7">联系电话：88618271</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
       <tr>
         <td>项目名称</td>
         <td>学校代码</td>
         <td>实验编号</td>
         <td>实验名称</td>
         <td>课程编号</td>
         <td>课程名称</td>
         <td>设课方式</td>
         <td>实验类别</td>
         <td>实验类型</td>
         <td>实验所属学科</td>
         <td>实验要求</td>
         <td>实验者类别</td>
         <td>实验者人数</td>
         <td>每批人数</td>
         <td>每组人数</td>
         <td>计划学时数</td>
         <td>实际学时数</td>
         <td>实际人时数</td>
         <td>获奖等级</td>
         <td>变动情况</td>
         <td>材料消耗费</td>
         <td>指导人员姓名与职称</td>
         <td>实验室编号</td>
         <td>实验室名称</td>
         <td>实验室分室名称</td>
         <td>实验地点</td>
       </tr>
        <tr>
          <td>填写说明</td>
          <td>我校代号1053</td>
          <td>学校统一编制的实验编号(学院可不填)</td>
          <td>(在实验室进行的科研、生产项目、实验室开发项目不列入本表)</td>
          <td>该实验对应的理论课编号，对应多个编号时，之间用"，"号分隔</td>
          <td>该实验对应的课程名称</td>
          <td>1：独立设课 2：非独立设课</td>
          <td>1：基础2：专业基础 3：专业 4：其它</td>
          <td>1：演示性 2：验证性 3：综合性 4：设计研究   5：其他</td>
          <td>按照最新版《中国普通高等学校本科专业设置大全填写二级类代码(前4位)</td>
          <td>1：必修 2选项 3：其他</td>
          <td>1：博士生 2：硕士生 3：本科生 4：专科生 5：其他</td>
          <td>参加本实验项目的总人数</td>
          <td>该实验项目每批可容纳的学生人数</td>
          <td>每套仪器设备上同时完成本实验项目的人数</td>
          <td>完成该实验项目的计划学时数</td>
          <td>完成该实验项目的实际学时数</td>
          <td>实际人时数=实验者人数*实际学时数</td>
          <td>0：未获奖 1：国际级 2国家级 3省部级 4校级</td>
          <td>该实验项目0：未变动 1：有变更2：新增  3：未开出</td>
          <td>该项目所有实验者消耗的实验材料总费用（元）</td>
          <td>按“王xx,教授 张xx副教授...”格式填写</td>
          <td>按照资产所处所发中大资字(〔2014〕17号文件</td>
          <td>按照资产所处所发中大资字〔2014〕17号文件中规定的实验室名称填写</td>
          <td>按照资产处所发中大资字〔2014〕17号文件中规定的实验室分室名称填写</td>
          <td>实验开设地点（格式为：校区+楼栋名+实验室门牌号）</td>
        </tr>
        <tr v-for="(item,index) in tableData">
          <td>{{item.projectName}}</td>
          <td>{{item.schoolCode}}</td>
          <td>{{item.experimentNumber}}</td>
          <td>{{item.courseContent}}</td>
          <td>{{item.courseCode}}</td>
          <td>{{item.courseName}}</td>
          <td>{{item.courseMethod}}</td>
          <td>{{item.experimentCategory}}</td>
          <td>{{item.experimentType}}</td>
          <td>{{item.laboratorySubject}}</td>
          <td>{{item.experimentalRequirements}}</td>
          <td>{{item.experimentersCategory}}</td>
          <td>{{item.studentNum}}</td>
          <td>{{item.batchUserNum}}</td>
          <td>{{item.groupUserNum}}</td>
          <td>{{item.planHours}}</td>
          <td>{{item.actualHours}}</td>
          <td>{{item.actualUserHour}}</td>
          <td>{{item.awardLevel}}</td>

          <td>{{item.changeSituation}}</td>
          <td>{{item.consumablesCost}}</td>
          <td>{{item.teacherNameAndJonTitle}}</td>
          <td>{{item.laboratoryNumber}}</td>
          <td>{{item.laboratoryName}}</td>
          <td>{{item.compartmentName}}</td>
          <td>{{item.experimentalSite}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <!-- 分页 -->
    <div style="float: right;">
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
        excelExportUrl: '/techStatistical/openOutExportExcel',//导出路径
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
        this.totalCount = res.totalCount;
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
