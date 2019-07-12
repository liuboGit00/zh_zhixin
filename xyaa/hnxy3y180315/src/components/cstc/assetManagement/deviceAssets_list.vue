<!--这个是资产管理-->
<template>
  <layout-tree v-if="show" :hasLeft="deActiveName != 'report'">
    <!-- 左侧目录树 -->
    <tree-menu v-if="show"  slot="left" @tree-click="treeClick" :treeOptions="leftTreeOpt.treeDefaults" :fromWhereTreeType="leftTreeOpt.fromWhereTree"
               @setCurrSltNodeId="setCurrSltNodeId" :shows="showss"></tree-menu>
    <!-- 右侧内容 -->
    <div slot="right" v-if="show"  id="content" ref="content" class="modal" style="padding:0;">
      <el-tabs v-model="deActiveName">
        <el-tab-pane label="基础信息" name="manage">
          <device-manage :showSelect="showSelect" v-if="deActiveName == 'manage'"
                         :contenHeight="contenHeight" :depId="deptId"
                         :depMes="deptMes"></device-manage>
        </el-tab-pane>
        <el-tab-pane label="在库" name="exist">
          <device-exist :showSelect="showSelect" v-if="deActiveName == 'exist'"
                         :contenHeight="contenHeight" :depId="deptId"
                         :depMes="deptMes"></device-exist>
        </el-tab-pane>
        <el-tab-pane label="入库" name="storage">
          <device-storage :showSelect="showSelect" v-if="deActiveName == 'storage'"
                          :contenHeight="contenHeight" :depId="deptId"
                          :depMes="deptMes"></device-storage>
        </el-tab-pane>
        <el-tab-pane label="借用" name="loan">
          <device-loan :showSelect="showSelect" v-if="deActiveName == 'loan'"
                       :contenHeight="contenHeight" :depId="deptId"
                       :depMes="deptMes"></device-loan>
        </el-tab-pane>
        <el-tab-pane label="维修" name="servicing">
          <device-servicing :showSelect="showSelect" v-if="deActiveName == 'servicing'"
                            :contenHeight="contenHeight" :depId="deptId"
                            :depMes="deptMes"></device-servicing>
        </el-tab-pane>
        <el-tab-pane label="报损" name="callBreak">
          <device-break :showSelect="showSelect" v-if="deActiveName == 'callBreak'"
                            :contenHeight="contenHeight" :depId="deptId"
                            :depMes="deptMes"></device-break>
        </el-tab-pane>
        <el-tab-pane label="报废" name="Scrap">
          <device-scrap :showSelect="showSelect" v-if="deActiveName == 'Scrap'"
                        :contenHeight="contenHeight" :depId="deptId"
                        :depMes="deptMes"></device-scrap>
        </el-tab-pane>
        <el-tab-pane label="转出" name="off">
          <device-out :showSelect="showSelect" v-if="deActiveName == 'off'" :contenHeight="contenHeight"
                      :depId="deptId" :depMes="deptMes"></device-out>
        </el-tab-pane>
        <el-tab-pane label="盘亏" name="loss">
          <device-loss :showSelect="showSelect" v-if="deActiveName == 'loss'"
                       :contenHeight="contenHeight" :depId="deptId"
                       :depMes="deptMes"></device-loss>
        </el-tab-pane>
        <el-tab-pane v-if="showSelect" :showSelect="showSelect" label="资产报告" name="report">
          <device-report :showSelect="showSelect" v-if="deActiveName == 'report'"
                         :contenHeight="contenHeight" :depId="deptId"
                         :depMes="deptMes"></device-report>
        </el-tab-pane>
      </el-tabs>
    </div>
  </layout-tree>
</template>

<script>
  import treeApi from './treeAssetsApi';

  // 左侧菜单树
  import layoutTree from '@/components/common/layoutTree'
  // 右侧内容
  import treeMenu from "./treeAssets/menu";
  // 管理
  import deviceManage from './assetsManage/assetManage_list'
  // 入库
  import deviceStorage from './assetsStorage/deviceStorage_list'
  // 借用记录
  import deviceLoan from './assetLoan/assetLoan_list'
  // 维修记录
  import deviceServicing from './assetServicing/assetServicing_list'
  //转出
  import deviceOut from './assetsOut/assetsOut_list.vue'
  import deviceExist from './assetsExist/assetsExist_list.vue'
  import deviceBreak from './assetCallBreak/assetServicing_list.vue'
  // 报废记录
  import deviceScrap from './assetsScrap/assetsScrap_list'
  // 盘亏
  import deviceLoss from './assetsLoss/assetsLoss_list'
  import deviceReport from './assetReport/assetReportList.vue'
  export default {
    data() {
      return {
        showSelect:true,
        // 内容高度
        contenHeight: 100,
        // 默认激活视图
        deActiveName: 'manage', // storage
        // 左侧菜单
        leftTreeOpt: {
          //tree默认项设置
          treeDefaults: {
            getTreeUrl: treeApi.tree.path, //目录树结构请求地址
            baseUrl: treeApi.baseUrl,
            // getDataUrl: '', //获取目录树叶子节点请求数据地址
            isShowSearch: false, // 隐藏搜索
            isShowMenus: true, // 隐藏操作菜单
          },
          fromWhereTree: "user", // 菜单类型
        },
        deptMes: {}, // 菜单选中id
        deptId:-1,
        showss: '',
        show:true,
        // isRoot:true,
      }
    },
    methods: {
      //---------------------------------- 左侧菜单树 ------------------------------------------//
      // 设置默认ID
      setCurrSltNodeId(id,opt) {
        console.log('----------', opt)
        // this.isRoot = opt.parentId<0 || typeof opt.parentId == "undefined"? true:false;
        if (this.deptId && this.deptId != id) {
          this.deptId=id
          this.deptMes = opt;
        }
//        this.deActiveName = 'manage'
      },
      // shows (res) {
      //   // this.showss = res
      //   this.showss = this.isRoot?1:res;
      //   console.log(res, 888)
      // },
      /*
       * 左侧目录树节点click调用父组件方法
       *
       * @param obj {} 当前选中节点的一级数据
       * @param node  {}  整个tree节点所有数据
       * @param  self  {}  当前tree vue实例
       *
       * */
      treeClick(obj, node, self) {
        // this.isRoot = obj.parentId<0 || typeof obj.parentId == "undefined"? true:false;
        this.deptId = obj.treeId;
        this.deptMes = obj;
//        this.show=false;
//        setTimeout(()=>{
//          this.show=true;
//        })
        // console.log(this.deptMes,this.deptId,888)
      },
      // 获取内容部分高度
      getContentHeight() {
        this.contenHeight = this.$refs.content.parentNode.offsetHeight;
      },
    },
    components: {
      layoutTree,
      treeMenu,
      deviceManage,
      deviceStorage,
      deviceLoan,
      deviceServicing,
      deviceOut,
      deviceScrap,
      deviceBreak,
      deviceLoss,
      deviceReport,
      deviceExist
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.getContentHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, "resize", this.getContentHeight);
      })
      this.showSelect=this.$route.path.indexOf('assetsManagementQuery')==-1?true:false;
    },
    watch:{
      '$route.path'() {
        console.log(this.showSelect)
        this.show=false;
        setTimeout(()=>{
          this.showSelect=this.$route.path.indexOf('assetsManagementQuery')==-1?true:false;
          this.leftTreeOpt.treeDefaults.isShowMenus=this.showSelect // 隐藏搜索
          this.show=true;

        })
        console.log(this.showSelect)
      }
    }
  }

</script>

<style lang="scss">
  .add-remove {
    margin-bottom: 20px;
  }

  .header {
    height: 30px;
    font-size: 18px;
    color: #ffffff;
  }

  .buttonList {
    &,
    .el-button--small {
      margin-bottom: 10px;
    }
  }
  /*.el-table__body-wrapper{*/
    /*overflow-x:hidden ;*/
  /*}*/
  #nosocomialSmall .el-table__empty-block{
    min-height: 0px;
  }
  .nosocomialSmallNoSmall tr td{
    height: 0;

  }
</style>
