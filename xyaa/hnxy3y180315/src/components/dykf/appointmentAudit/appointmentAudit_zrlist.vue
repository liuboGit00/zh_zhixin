<!--
****--@file     deviceEnvironmental_list
****--@date     2019/3/28 16:38
****--@author   于海源
****--@describe   预约申请
-->
<template>
  <!-- 预约申请 -->
  <div id="bespeakApply" ref="bespeakSetRoom">
    <el-row style="padding-bottom:20px;">
      <el-form :inline="true">
      <!-- 搜索框 -->
      <el-col :span="24">
        
          <!--<span>签署年份：</span>-->
          <el-form-item label="预约名称" prop="contractNumber">
            <el-input v-model="searchObj.name" ></el-input>
          </el-form-item>
          <el-form-item label="审批状态" prop="status">
            <!-- <el-input v-model="searchObj.status" ></el-input> -->
            <el-select v-model="searchObj.status" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="主任审批" value="主任审批">主任审批</el-option>
              <el-option label="管理员审批" value="管理员审批">管理员审批</el-option>
              <el-option label="驳回" value="驳回"></el-option>
              <el-option label="通过" value="通过"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="合同名称" prop="contractName">
            <el-input v-model="searchObj.contractName"></el-input>
          </el-form-item>-->
          <el-form-item label="申请时间" prop="activityEndTime">
            <div class="block">
              <el-date-picker v-model="searchObj.startUseDate"
              @change="setYear"
              placeholder="申请时间"
            :picker-options="pickerOptions1"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="审核时间" prop="activityEndTime">
            <div class="block">
              <el-date-picker v-model="searchObj.startApprovalDate"
              @change="setYear"
              placeholder="审核时间"
            :picker-options="pickerOptions1"
              ></el-date-picker>
            </div>
          </el-form-item>

          <el-button @click="search" type="info">查询</el-button>
          <!-- <el-button @click="initSelect" type="info">清空</el-button> -->
        
      </el-col>
      </el-form>
    </el-row>
      <div id="tableView" ref="tableView">
      <el-table
        align="center"
        :height="tableHeight"
        :context="self"
        :data="tableData"
        tooltip-effect="dark"
        class="tableShowMoreInfo"
        style="width: 100%;"
        @selection-change="handleSelectionChange"

      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <div>
              <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
              <el-button size="small"  v-if="scope.row.status == 'ZRSP'"  type="info" @click="edit(scope.row)">审核</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="预约名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请单位" prop="company" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请部门" prop="department" show-overflow-tooltip>
          <!--<template scope="scope">-->
          <!--{{ scope.row.reserveDate | formatDate('yyyy-MM-dd') + ' ' + scope.row.startTime }}-->
          <!--</template>-->
        </el-table-column>
        <el-table-column label="申请人" prop="applicant" show-overflow-tooltip></el-table-column>
        <el-table-column label="使用类型" prop="usetype" show-overflow-tooltip>
          <template scope="scope">{{reassign(scope.row.usetype)}}</template>
        </el-table-column>
        <el-table-column label="申请时间" prop="useDate" show-overflow-tooltip>
          <!-- <template scope="scope">
          {{ scope.row.applicantDate }}
          </template> -->
        </el-table-column>
        <el-table-column label="审核时间" prop="" show-overflow-tooltip>
          <!--<template scope="scope">-->
          <!--{{ scope.row.applicantDate }}-->
          <!--</template>-->
        </el-table-column>
        <el-table-column label="预约入口" prop="applicant" show-overflow-tooltip></el-table-column>
        <el-table-column label="审批状态" prop="status" show-overflow-tooltip>
          <template scope="scope">{{reassign(scope.row.status)}}</template>
        </el-table-column>
      </el-table>
    </div>

   <!-- 审核 -->
    <Modal
      :mask-closable="false"
      v-model="editModal"
      height="200"
      class-name="vertical-center-modal"
      :width="1000"
    >
      <modal-header slot="header" :content="contentHeader.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback"  :operailityData="operailityData" ></edit>
      <div slot="footer"></div>
    </Modal>

     <!-- 查看 -->
    <Modal
      :mask-closable="false"
      v-model="showModal"
      height="200"
      class-name="vertical-center-modal"
      :width="1000"
    >
      <modal-header slot="header" :content="contentHeader.editId"></modal-header>
      <show v-if="showModal" @cancel="cancel"  :operailityData="operailityData" ></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
let Util = null;

import api from "./api"; // API
// import reassign from './reassign.js'
//  import statusOption from './statusOption'; // 预约状态类型
// import downloadVideo from '../bespeakClass/bespeakClass_downloadVideo.vue'; // 评价
// import myEvaluation from '../../common/myEvaluation/myEvaluation.vue'; // 评价
//  import add from './bespeakApply_add'; // 新建申请
import show from "./appointmentAudit_zrshow.vue"; // 查看 查看
import edit from "./appointmentAudit_zredit.vue"; // 新建审核
// import channel from "./channal.vue";
export default {
    data() {
        return {
            api,
            showModal:false,
            totolPrice: 0,
            totalCount: 0,
            self: this,
            tableHeight: 0,
            dynamicHt: 100, // 表格高度
            loading: false,
            value6: "",
            searchObj: {
                // 搜索
                year: "",
                startUseDate:"",
                endUseDate:"",
                startApprovalDate:"",
                endApprovalDate:"",
                contractNumber: "",
                contractName: "",
                status:'',
                auditType:"GL"
            },
            operailityData: [],
            multipleSelection: [], // 表格已选集
            operateData:{},
            searchObj: {
                // 搜索
                year: "",
                startUseDate:"",
                startApprovalDate:"",
                contractNumber: "",
                contractName: "",
                status:'',
                auditType:"ZR"
            },
            reportedModal: false,
            tableData: [],
             unreassign(e) {
                switch (e) {
                    case "主任审批":
                    return "ZRSP";
                    break;
                    case "管理员审批":
                    return "GLYSP";
                    break;
                    case "已上报":
                    return "YSB";
                    break;
                    case "未上报":
                    return "WSB";
                    break;
                    case "驳回":
                    return "BH";
                    break;
                    case "通过":
                    return "TG";
                    break;
                    default:
                    break;
                }
            },
            // 模态框提示
            contentHeader: {
                addId: {
                id: "addId",
                title: "新增"
                },
                showId: {
                id: "showId",
                title: "查看"
                },
                editId: {
                id: "editId",
                title: "审核"
                },
                removeId: {
                id: "removeId",
                title: "删除"
                },
                reportId:{
                id:"reportId",
                title:"修改状态"
                },
                toChannelId: {
                id: "toChannelId",
                title: "导入合同"
                }
            }
        }
    },
    methods:{
        init(){
            // console.log('111111')
            Util = this.$util;
            //ajax请求参数设置
            this.myPages = Util.pageInitPrams;
            // console.log(this.myPages);
            this.queryQptions = {
                    url: api.list.path,
                    params: {
                    curPage: 1,
                    pageSize: Util.pageInitPrams.pageSize
                }
            };
            this.setTableData();
        },
                show(e){ // 查看
            // console.log(e.id)
            // console.log(this.tableData)
            // this.operailityData = this.tableData[0]
            this.operailityData.id = e.id
            this.openModel("show");
        },
                /************************* 搜索逻辑 *********************************/
        search() {
          
            if (this.searchObj.status.length == '0') {
              this.setTableData();
              // console.log(this.searchObj)
            }else{
              
              // console.log(this.unreassign(this.searchObj.status))
              this.searchObj.status =  this.unreassign(this.searchObj.status)
              // console.log(this.searchObj)
              this.setTableData();
            }
          
          
        },
        setYear() {
          
          // this.searchObj.year = this.conductDate(this.searchObj.year, "yyyy");
          // this.searchObj.endUseDate = this.conductDate(this.searchObj.endUseDate, "yyyy-MM-dd");
          this.searchObj.startUseDate = this.conductDate(this.searchObj.startUseDate, "yyyy-MM-dd");
          this.searchObj.startApprovalDate = this.conductDate(this.searchObj.startApprovalDate, "yyyy-MM-dd");
          // this.searchObj.endApprovalDate = this.conductDate(this.searchObj.endApprovalDate, "yyyy-MM-dd");
          // console.log(this.searchObj)
        },
        setTableData(isLoading) {
            // console.log('_________________')
            // console.log(this.queryQptions)
        let searchObj = this.formDate(
            this.$util._.defaultsDeep({}, this.searchObj),
            ["applicantStarDate", "applicantEndDate"]
            );
            Object.assign(this.queryQptions.params, searchObj);
            this.ajax(
                {
                    ajaxSuccess: "listDataSuccess",
                    ajaxParams: this.queryQptions
                },
                    isLoading
            );
        },
        // 增加回调
        subCallback(target, title, updata) {
          // console.log('subCallback')
          this.cancel(target);
          if (title) {
            this.successMess(title);
          }
          if (!updata) {
            this.setTableData();
          }
        },
        // 数据请求成功回调
        listDataSuccess(res, m, loading) {
            this.totalCount = res.totalCount;
            this.tableData = res.data;
            // console.log(this.tableData);
            this.totolPrice = 0;
            res.data.map(item => {
                this.totolPrice += item.price;
            });
            if (this.searchObj.status == 'GLYSP') {
              this.searchObj.status= '管理员审核'
            }else if (this.searchObj.status == 'ZRSP') {
              this.searchObj.status= '主任审批'
            }else if (this.searchObj.status == 'BH') {
              this.searchObj.status= '驳回'
            }else if (this.searchObj.status == 'TG') {
              this.searchObj.status= '通过'
            }
        },
        handleSelectionChange(val) {
            // console.log(val)
            // val.map(item => {
            //   item.id = item.contractId;
            // });
            this.multipleSelection = val;
        },
        setTableDynHeight(otherHeight = 0) {
            // console.log(1);
            let contenHeight = this.$refs.bespeakSetRoom.parentNode.offsetHeight;
            let tableView = this.$refs.tableView;
            let rest = 0;
            let paginationHt = rest + otherHeight;
            this.dynamicHt = contenHeight - tableView.offsetTop - 70;
            this.tableHeight = this.dynamicHt;
        },
        edit(e){
            // console.log(e.id)
            // console.log(this.tableData[e.id])
            // this.operailityData = this.tableData[0]
            this.operailityData.id = e.id
            this.openModel("edit");
        },
        openModel(options) {
            this[options + "Modal"] = true;
        },
        cancel(targer) {
            this[targer + "Modal"] = false;
        },

        reassign(e) {
            switch (e) {
                case "QT":
                return "其他";
                break;
                case "GZF":
                return "工作坊";
                break;
                case "HY":
                return "会议";
                break;
                case "KH":
                return "考核";
                break;
                case "PX":
                return "培训";
                break;
                case "ZRSP":
                return "主任审批";
                break;
                case "GLYSP":
                return "管理员审批";
                break;
                case "YSB":
                return "已上报";
                break;
                case "WSB":
                return "未上报";
                break;
                case "BH":
                return "驳回";
                break;
                case "TG":
                return "通过";
                break;
                default:
                break;
            }
        },
    },
    components:{
        edit,
        show
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
    created() {
        // console.log('****************')
        Util = this.$util;
        this.init();
    }
};
</script>
<style lang="scss">
</style>
