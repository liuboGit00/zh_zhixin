<template>
  <!-- 评分 -->
  <div>
    <!-- 操作按钮 -->
    <el-row
      class="roomButtonList"
      ref="buttonList"
      style="margin-bottom: 10px"
    >
      <el-col :span="8">
        <el-button
          type="info"
          @click="derive"
        >导出</el-button>
      </el-col>
      <el-col
        :span="16"
        align="right"
      >
        <el-form
          :inline="true"
          :model="searchObj"
          ref="searchObj"
          label-width=""
          class="el-form-item-search"
        >
          <el-checkbox
            @change="removeDepIdx"
            v-model="searchObj.isProjectRelation"
          >用物关联为空</el-checkbox>
          <el-form-item prop="name">
            <el-input
              placeholder="请输入内容"
              v-model="searchObj.courseName"
            >
              <div slot="prepend">课程名称</div>
              <el-button
                @click="searchEvent"
                slot="append"
                icon="search"
              ></el-button>
            </el-input>
          </el-form-item>
          <el-button
            size="small"
            align="right"
            style="line-height: 18px;"
            :icon="searchMore ? 'arrow-down' : 'arrow-up'"
            @click="showSearchMore"
          >高级查询
          </el-button>
        </el-form>
      </el-col>
    </el-row>
    <!-- 数据搜索 -->
    <el-row v-show="searchMore">
      <el-form
        :inline="true"
        :model="searchObj"
        ref="searchObj"
        labelWidth="90px"
        align="right"
        class="el-form-item-search"
      >
        <el-form-item
          name="start"
          label="上课日期："
          class="feildFontweight pmStartDateBox"
          prop="startDate"
        >
          <el-date-picker
            v-model="searchObj.courseDateBegin"
            type="date"
            :editable="false"
            placeholder="选择日期"
            width="150"
            :picker-options="pickerOptions0"
            @change="handleStartTime"
          >
          </el-date-picker>
        </el-form-item>
        <span
          class="pmDateText"
          style="line-height: 36px;margin-right: 10px;"
        >至</span>
        <el-form-item
          name="end"
          labelWidth="10px"
          prop="sectionOrderStart"
          class="pmEndDateBox"
        >
          <el-date-picker
            v-model="searchObj.courseDateEnd"
            align="right"
            type="date"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions1"
            @change="handleEndTime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          name="start"
          label="节次:"
          class="feildFontweight pmStartDateBox"
          prop="startDate"
        >
          <el-input
            size="small"
            v-model="searchObj.sectionOrderStart"
            placeholder="请输入"
          ></el-input>
          <!--<el-date-picker v-model="searchObj.weekTimesStart" type="date" :editable="false" placeholder="选择日期" width="150"-->
          <!--:picker-options="pickerOptions0" @change="handleStartTime">-->
          <!--</el-date-picker>-->
        </el-form-item>
        <span
          class="pmDateText"
          style="line-height: 36px;margin-right: 10px;"
        >至</span>
        <el-form-item
          name="end"
          labelWidth="10px"
          prop="sectionOrderEnd"
          class="pmEndDateBox"
        >
          <el-input
            size="small"
            v-model="searchObj.sectionOrderEnd"
            placeholder="请输入"
          ></el-input>
          <!--<el-date-picker v-model="searchObj.weekTimesEnd" align="right" type="date" :editable="false"-->
          <!--placeholder="选择日期" :picker-options="pickerOptions1" @change="handleEndTime">-->
          <!--</el-date-picker>-->
        </el-form-item>
        <el-form-item
          prop="contacts"
          label="教师:"
        >
          <el-input
            placeholder="请输入"
            v-model="searchObj.teacherName"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="contacts"
          label="年级:"
        >
          <el-input
            placeholder="请输入"
            v-model="searchObj.grade"
          ></el-input>
        </el-form-item>
        <el-button
          type="info"
          @click="searchEvent"
        >查询</el-button>
      </el-form>
    </el-row>
    <!-- 表格数据 -->
    <div
      id="deviceTable"
      ref="deviceTable"
    >
      <el-table
        align="center"
        :height="dynamicHt"
        :context="self"
        :data="tableData"
        tooltip-effect="dark"
        class="tableShowMoreInfo"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="210"
        >
          <template scope="scope">
            <el-button
              size="small"
              type="info"
              @click="add(scope.row)"
            >用物关联</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="用物项目及数量"
          prop="itemNums"
          show-overflow-tooltip
          width="210"
        >
          <template scope="scope">
            <!--<a>-->
            <p
              v-for="(item,index) in scope.row.itemNums"
              @click="itemNumsClick(scope.row)"
              style="text-decoration:underline;color:#0000ff;"
            >
              {{item}}</p>
            <!--</a>-->

            <!--<span v-if="(addStatus !== 'add') && (multipleSelectionId !== (scope.$index))">{{scope.row.name}}</span>-->
            <!--<el-select v-model="scope.row.name" v-else filterable placeholder="请选择" @change="selectChange(scope.$index)">-->
            <!--<el-option-->
            <!--v-for="(item,index) in option"-->
            <!--:key="index"-->
            <!--:label="item.consumablesName"-->
            <!--:value="item.consumablesName">-->
            <!--</el-option>-->
            <!--</el-select>-->
          </template>
        </el-table-column>
        <el-table-column
          label="周次"
          prop="weekTimes"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="日期"
          prop="courseDate"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="星期"
          prop="weekDay"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="节次"
          prop="sectionOrder"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="学时"
          prop="classHour"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="年级"
          prop="grade"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="专业"
          prop="specialty"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="组别"
          prop="groupTeam"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="人数"
          prop="studentNum"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          label="课程内容"
          prop="courseContent"
          show-overflow-tooltip
          width="100"
        ></el-table-column>
        <el-table-column
          label="课程名称"
          prop="courseName"
          show-overflow-tooltip
          width="100"
        ></el-table-column>
        <el-table-column
          label="教师"
          prop="teacherName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="职称"
          prop="jobTitle"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="教研室"
          prop="jysName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="授课地点"
          prop="teachPlace"
          show-overflow-tooltip
          width="100"
        ></el-table-column>
        <el-table-column
          label="人时"
          prop="userHour"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="学年"
          prop="schoolYear"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="学期"
          prop="term"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination
        @size-change="changePageSize"
        @current-change="changePage"
        :current-page="myPages.currentPage"
        :page-sizes="myPages.pageSizes"
        :page-size="myPages.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>

    <!-- 模态框 增加（add） -->
    <Modal
      :mask-closable="false"
      v-model="addModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1010"
    >
      <modal-header
        slot="header"
        :content="button.addId"
      ></modal-header>
      <add
        v-if="addModal"
        @cancel="cancel"
        @add="subCallback"
        editType="add"
        :id="id"
      ></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（show） -->
    <Modal
      :mask-closable="false"
      v-model="showModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1010"
    >
      <modal-header
        slot="header"
        :content="button.showId"
      ></modal-header>
      <show
        v-if="showModal"
        @cancel="cancel"
        @show="subCallback"
        :itemNumsRow="itemNumsRow"
      ></show>
      <div slot="footer"></div>
    </Modal>

    <!-- 导出弹窗 -->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="deriveModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="500"
    >
      <modal-header
        slot="header"
        :content="button.deriveId"
      ></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col
            :span="10"
            :offset="14"
          >
            <a :href="excelExportUrl">
              <el-button
                @click="deriveModal=false"
                type="primary"
              >确定
              </el-button>
            </a>
            <el-button
              class="but-col"
              @click="deriveModal=false"
            >取消</el-button>
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

import api from "./api"; // api
// import add from './assessmentContentScore_input'; // 增加
import add from "./kcyw_add"; // 编辑  增加
// import copy from './assessmentContentScore_copy'; // 复制
import show from "./kcyw_view"; // 查看
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
      default: "1"
    },
    contenHeight: {
      // 接收父组件的高度
      type: Number,
      default: 860
    }
  },
  data() {
    return {
      api,
      id: "",
      self: this,
      url: "",
      loading: false,
      searchMore: false,
      dynamicHt: 100,
      totalCount: 0,
      tableData: [],
      itemNumsRow: {},
      editType: "", //判断添加和修改
      searchObj: {
        // 搜索数据集
        isProjectRelation: true,
        courseDateBegin: "", // 上课日期开始
        courseDateEnd: "", // 上课日期结束
        courseName: "", //课程名称
        teacherName: "", //教师
        sectionOrderStart: "", //节次开始时间
        sectionOrderEnd: "", //节次结束时间
        grade: "" ,//年级
        ids:'',//导出ids
      },
      leadinModal: false,
      deriveModal: false,
      showModal: false,
      operailityData: [],
      multipleSelection: [],
      //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
      excelExportUrl:'',
      excelExport: "/techCourse/relationList/export", //导出路径
      // 操作id
      todoId: {},
      //* 按钮 *//
      button: {
        addId: {
          id: "addId",
          title: "新增"
        },
        showId: {
          id: "showId",
          title: "查看"
        },
        deriveId: {
          id: "deriveId",
          title: "导出"
        }
      }
    };
  },
  methods: {
    //初始化请求列表数据
    init() {
      Util = this.$util;
      //ajax请求参数设置
      this.myPages = Util.pageInitPrams;

      this.queryQptions = {
        url: api.relationList.path,
        params: {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize
        }
      };
      this.searchObj.courseDateBegin = this.conductDate(
        new Date(),
        "yyyy-MM-dd"
      );
      this.searchObj.courseDateEnd = this.conductDate(new Date(), "yyyy-MM-dd");
      this.initTree();
      this.setTableData();
    },
    // 初始化树信息
    initTree() {
      this.todoId = {
        treeId: this.treeId,
        treeRoad: this.treeRoad,
        id: null
      };
    },
    removeDepIdx(event) {
      // if(event.target.checked ===false){
      //   this.searchObj.isProjectRelation = ''
      // }else{
      //   this.searchObj.isProjectRelation = '1'
      // }
      // console.log(this.searchObj.isProjectRelation,'isProjectRelation')
      this.setTableData();
    },

    itemNumsClick(row) {
      this.openModel("show");
      this.itemNumsRow = row;
    },
    //*--------------------------- 表格 -----------------------*//
    /*
     * checkbox 选择后触发事件
     * @param val Array 存在所有的选择每一个行数据
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /*
     * 设置表格数据
     * @param isLoading Boolean 是否加载
     */
    setTableData(isLoading) {
      this.formDate(
        this.searchObj,
        ["courseDateBegin", "courseDateEnd"],
        "yyyy-MM-dd"
      );
      Object.assign(this.queryQptions.params, this.searchObj, {
        treeId: this.treeId,
        treeRoad: this.treeRoad
      });

      this.ajax(
        {
          ajaxSuccess: "listDataSuccess",
          ajaxParams: this.queryQptions
        },
        isLoading
      );
    },
    // 数据请求成功回调
    listDataSuccess(res, m, loading) {
      this.totalCount = res.totalCount;
      this.tableData = res.data;
    },
    //设置表格及分页的位置
    setTableDynHeight() {
      let deviceTable = this.$refs.deviceTable;
      let paginationHt = 50 * 2;
      this.dynamicHt = this.contenHeight - deviceTable.offsetTop - paginationHt;
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
        this.showMess("只能操作一条数据!");
        flag = false;
      }
      return flag;
    },

    //搜索监听回调
    searchEvent(isLoading) {
      //        isLoading(true);
      let isSubmit = this.handleSubmit("searchObj");
      if (isSubmit) {
        this.setTableData();
      }
    },

    /*
     * 列表查询方法
     * @param string 查询from的id
     * */
    handleSubmit(name) {
      let flag = false;
      this.$refs[name].validate(valid => {
        if (valid) {
          flag = true;
        } else {
          this.$Message.error("表单验证失败!");
        }
      });
      return flag;
    },

    // 高级搜索按钮展开搜索表单并重新计算表格高度
    showSearchMore() {
      this.searchMore = !this.searchMore;
      this.$nextTick(function() {
        this.setTableDynHeight();
      });
    },

    // 重置搜索
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /************************************** 模态框处理 **************************************************/
    // 增加
    add(row) {
      this.id = row.id;
      this.openModel("add");
    },
    // 编辑
    edit(row) {
      this.todoId.id = row.id;
      this.openModel("edit");
    },

    derive() {
      let ids = []
      this.multipleSelection.map(item=>{
        ids.push(item.id)
      })
      this.searchObj.treeId = this.treeId
      this.searchObj.ids = ids.join(',')
      let params = Util.serializeParams(this.searchObj,"string");
      this.excelExportUrl = '/api'+this.excelExport+'?'+params;
      this.openModel("derive");
    },

    // 取消
    cancel(targer) {
      this[targer + "Modal"] = false;
    },
    // 删除
    /*--点击--删除--按钮--*/
    remove(row) {
      let flag = true;
      if (row.id) {
        this.operailityData = [
          {
            id: row.id
          }
        ];
      } else {
        this.operailityData = [];
        flag = this.isSelected();
        if (!flag) return;
        this.multipleSelection.map(item => {
          this.operailityData.push({
            id: item.id
          });
        });
      }
      flag && this.openModel("remove");
    },

    // 搜索
    search() {
      this.setTableData();
    },
    // 增加回调
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
      this[options + "Modal"] = true;
    }
  },
  components: {
    // add,
    add,
    show
    // show,
    // copy,
    // score,
    // move
  },
  mounted() {
    //页面dom稳定后调用
    this.$nextTick(function() {
      //初始表格高度及分页位置
      this.setTableDynHeight();
      //为窗体绑定改变大小事件
      let Event = Util.events;
      Event.addHandler(window, "resize", this.setTableDynHeight);
    });
  },
  watch: {
    contenHeight(val) {
      this.setTableDynHeight();
    },
    treeId(val) {
      this.initTree();
      this.resetForm("searchObj");
      this.setTableData();
    }
  },
  created() {
    this.init();
  }
};
</script>

<style>
</style>
