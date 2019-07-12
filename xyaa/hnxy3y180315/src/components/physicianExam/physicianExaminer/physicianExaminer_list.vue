<template>
  <layout-tree>
    <tree-menu
      slot="left"
      @tree-click="treeClick"
      @setCurrSltNodeId="setCurrSltNodeId"
      :treeOptions="leftTreeOpt.treeDefaults"
      :fromWhereTreeType="leftTreeOpt.fromWhereTree"
    ></tree-menu>
    <!-- 右侧内容 -->
    <div slot="right" class="examineeManger" ref="examineeManger">
      <el-form :inline="true">
        <el-row>
          <el-col :span="3">
            <el-button type="primary" @click="openModal('add')">新增</el-button>
            <el-button type="info" @click="openModal('toChannel')">导入</el-button>
          </el-col>
          <el-col :span="21" align="right">
            <el-form-item label="姓名 :" prop="name">
              <el-input v-model="searchForm.name" placeholder="请输入姓名">
                <el-button @click="searchEvent" slot="append" icon="search"></el-button>
              </el-input>
            </el-form-item>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-col>
        </el-row>
        <div v-show="searchShow" ref="searchMore">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline"  align="right">
            <el-form-item label="专业 :">
              <el-select placeholder="请选择" v-model="searchForm.major" clearable>
                <el-option
                  v-for="item in major"
                  :key="item.code"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职称 :">
              <el-select placeholder="请选择" v-model="searchForm.position" clearable>
                <el-option
                  v-for="item in position"
                  :key="item.code"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单位 :">
              <el-input v-model="searchForm.company" placeholder="请选择"></el-input>
            </el-form-item>
            <el-button type="info" @click="searchEvent">查询</el-button>
          </el-form>
        </div>
      </el-form>
      <!-- 表格 -->
      <div class="myTable" id="myTable" ref="myTable">
        <el-table :data="tableData" style="width: 100%" :height="tabHeight">
          <el-table-column label="操作" align="center" width="150">
            <template scope="scope">
              <el-button
                size="small"
                class="signblueBtn"
                type="success"
                @click="openModal('edit',scope.row)"
              >编辑</el-button>
              <el-button
                size="small"
                class="signblueBtn"
                type="danger"
                @click="openModal('remove',scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sex" label="性别" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="idCard" label="身份证号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="phone" label="电话" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="category" label="考官类别" align="center" show-overflow-tooltip>
            <template scope="scope">
              {{ converterCategory(scope.row.category) }}
            </template>
          </el-table-column>
          <el-table-column prop="major" label="专业" align="center" show-overflow-tooltip>
            <template scope="scope">
              {{ converterMajor(scope.row.major) }}
            </template>
          </el-table-column>
          <el-table-column prop="position" label="职称" align="center" show-overflow-tooltip>
            <template scope="scope">
              {{ converterPosition(scope.row.position) }}
            </template>
          </el-table-column>
          <el-table-column prop="company" label="单位" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="invigilateDate" label="可监考日期" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div style="margin: 10px;">
        <div style="float: right;">
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
      </div>
      <!--删除弹窗-->
      <Modal
        close-on-click-modal="false"
        height="200"
        v-model="removeModal"
        class-name="vertical-center-modal"
        :loading="loading"
        :width="500"
      >
        <modal-header slot="header" :content="headerContent.removeId"></modal-header>
        <remove
          v-if="removeModal"
          :delete-url="deleteUrl"
          @remove="subCallback"
          @cancel="cancel"
          :operaility-data="operailityData"
        ></remove>
        <div slot="footer"></div>
      </Modal>
      <!--增加和编辑弹窗-->
      <Modal
        :mask-closable="false"
        v-model="addAndEditModal"
        height="200"
        class-name="vertical-center-modal"
        :width="960"
      >
        <modal-header
          slot="header"
          :content="modalType == 'add' ? headerContent.addId : (modalType == 'edit' ? headerContent.editId : '')"
        ></modal-header>
        <addAndEdit
          v-if="addAndEditModal"
          @cancel="cancel"
          @add="subCallback"
          :modalType="modalType"
          :treeRoad="treeRoad"
          :operaility-data="operailityData"
        ></addAndEdit>
        <div slot="footer"></div>
      </Modal>
      <!--导入弹窗-->
      <Modal
        :mask-closable="false"
        close-on-click-modal="false"
        height="200"
        v-model="toChannelModal"
        class-name="vertical-center-modal"
        :width="800"
      >
        <modal-header slot="header" :content="headerContent.toChannelId"></modal-header>
        <toChannel
          v-if="toChannelModal"
          @toChannel="subCallback"
          @cancel="cancel"
          :operaility-data="operailityData"
          :treeRoad="treeRoad"
        ></toChannel>
        <div slot="footer"></div>
      </Modal>
    </div>
  </layout-tree>
</template>
<script>
let Util = null;
import addAndEdit from "./physicianExaminer_addEdit.vue";
import toChannel from "./physicianExaminer_toChannel.vue";
import api from "./api";

//树布局
import layoutTree from "../../common/layoutTree";
//左侧
import treeMenu from "./tree/menu";

export default {
  data() {
    return {
      toChannelModal: false, //导入弹框
      removeModal: false, //删除弹框
      searchShow: false, //高级查询
      addAndEditModal: false, //增加弹框
      modalType: "", //增加弹框和编辑弹框的类型
      tabHeight: 0,
      dynamicHt: 100,
      totalCount: 0,
      operailityData: [{ a: 1 }],
      loading: false,
      searchMore: false,
      treeRoad: '', // 节点路径
      searchForm: {
        name: "",
        major: "", //专业
        position: "", //职称
        company: "" //单位
      },
      headerContent: {
        editId: {
          id: "editId",
          title: "编辑"
        },
        removeId: {
          id: "removeId",
          title: "删除"
        },
        addId: {
          id: "removeId",
          title: "增加"
        },
        toChannelId: {
          id: "toChannelId",
          title: "导入"
        }
      },

      deleteUrl:'',//删除
      major: [], //专业
      position: [], //职称
      company: [], //单位

      //专业
      majorMessTitle : {
        ajaxSuccess: 'majorData',
        ajaxParams: {
          url: api.dictionary.path + 'ZY_KGZY',
        }
      },

      //职称
      positionMessTitle: {
        ajaxSuccess: 'positionData',
        ajaxParams: {
          url: api.dictionary.path + 'ZY_KGZC',
        }
      },

      //单位
      companyMessTitle: {
        ajaxSuccess: 'companyData',
        ajaxParams: {
          url: api.dictionary.path + 'ZY_KGLB',
        }
      },

      tableData: []
    };
  },
  created() {
    this.init();
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
  methods: {
    init() {
      Util = this.$util;
      this.leftTreeOpt = {
        // 左侧菜单
        //tree默认项设置
        treeDefaults: {
          getTreeUrl: api.structure.path, //目录树结构请求地址
          baseUrl: "/zyTreeExaminer",
          // getDataUrl: api.structure.path,  //获取目录树叶子节点请求数据地址
          isShowSearch: false, // 隐藏搜索
          isShowMenus: true, // 隐藏操作菜单
          defaultProps: {
            label: "treeName",
            children: 'childList'
          },
          asyn: false
        },
        fromWhereTree: "custom" // 菜单类型
        //deptId: '1', // 菜单选中id
      };

      //ajax请求参数设置
      this.myPages = Util.pageInitPrams;
      this.queryQptions = {
        url: api.list.path,
        params: {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize
        }
      };
    },

    //专业
    majorData(res){
      this.major = res.data.child
    },

    //职称
    positionData(res){
      this.position = res.data.child
    },

    //单位
    companyData(res){
      this.company = res.data.child
    },

    //左侧树
    treeClick(obj, node, self) {
      // this.leftTreeOpt.deptId = obj.id;
      this.treeId = obj.id;
      // 获取节点路径
      this.treeRoad = obj.treeRoad;
      // this.getTreeRoadArr(node);
      this.setTableData();
    },

    // 设置节点默认id
    setCurrSltNodeId(id, data) {
      this.treeId = id;
      this.treeRoad = data.treeRoad;
      this.acActiveName = 'score';
      this.setTableData();
    },

    //默认请求
    setTableData(isLoading) {
      let treeRoad = {
        treeRoad: this.treeRoad
      }
      Object.assign(this.queryQptions.params, this.searchForm,treeRoad);
      this.ajax(
        {
          ajaxSuccess: "listDataSuccess",
          ajaxParams: this.queryQptions
        },
        isLoading
      );
      this.ajax(this.majorMessTitle) //专业
      this.ajax(this.positionMessTitle) //职称
      this.ajax(this.companyMessTitle) //单位
    },
    // 数据请求成功回调
    listDataSuccess(res, m, loading) {
      this.totalCount = res.totalCount || 0;
      this.tableData = res.data;
    },
    openModal(type,val) {
      if (type == "edit") {
        this.addAndEditModal = true;
        this.modalType = type;
        this.operailityData = val
      } else if (type == "remove") {
        this.operailityData = val
        this.deleteUrl = '/zy/examiner/removes/' + this.operailityData.id//删除
        this.removeModal = true;
      } else if (type == "add") {
        this.addAndEditModal = true;
        this.modalType = type;
      } else if (type == "toChannel") {
        this.toChannelModal = true;
      }
    },

    // 点击--查询--按钮
    searchEvent(){
      this.setTableData();
    },

    //高级查询
    showSearchMore() {
      this.searchShow = !this.searchShow;
      this.$nextTick(function() {
        if (this.searchShow) {
          this.tabHeight = this.dynamicHt - this.$refs.searchMore.offsetHeight;
        } else {
          this.tabHeight = this.dynamicHt;
        }
      });
    },

    //设置表格及分页的位置
    setTableDynHeight() {
      let contenHeight = this.$refs.examineeManger.parentNode.offsetHeight;
      let tableData = this.$refs.myTable;
      let paginationHt = 50;
      this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
      this.tabHeight = this.dynamicHt;
    },

    // 取消
    cancel(targer) {
      this[targer + "Modal"] = false;
    },

    // 弹窗回调
    subCallback(target, title, updata) {
      this.cancel(target);
      if (title) {
        this.successMess(title);
      }
      if (!updata) {
        this.setTableData();
      }
    },

    //转换类别
    converterCategory(category){
      switch (category){
        case 'LC' : category = '临床';
          break;
      }
      return category
    },

    //转换专业
    converterMajor(major){
      switch (major){
        case 'QT' : major = '其它';
          break;
        case 'WK' : major = '外科';
          break;
        case 'NK' : major = '内科';
          break;
      }
      return major
    },

    //转换专业
    converterPosition(position){
      switch (position){
        case 'QT' : position = '其它';
          break;
        case 'ZZYS' : position = '主治医师';
          break;
        case 'FZRYS' : position = '副主任医师';
          break;
        case 'ZRYS' : position = '主任医师';
          break;
      }
      return position
    },

  },
  components: {
    addAndEdit,
    toChannel,
    layoutTree,
    treeMenu
  }
};
</script>
<style lang="scss" scoped>
.examineeManger{
  margin-top: 5px;
}
</style>
