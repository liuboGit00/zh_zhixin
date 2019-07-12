<!--
****--@file     physicianPlan_examPriview
****--@date     2019-02-13 11:19
****--@author   YC
****--@describe 排考预览
-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" inline label-width="80px">
      <el-row style="margin-bottom:0">
        <el-col :span="5">
          <el-button type="primary" @click="messageBtn">短信通知</el-button>
          <el-button type="primary" @click="importBtn">导出考官签到表</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="19" align="right">
          <el-form-item label="预约通知">
            <el-select v-model="formValidate.isNotice" placeholder="请选择" style="width:100px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="是" value="YES"></el-option>
              <el-option label="否" value="NO"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提醒通知">
            <el-select v-model="formValidate.isRemind" placeholder="请选择" style="width:100px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="是" value="YES"></el-option>
              <el-option label="否" value="NO"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="formValidate.examinerName" style="width:140px;" placeholder="输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="执考日期">
            <el-date-picker
              v-model="formValidate.invigilateDateBegin"
              type="date"
              :editable="false"
              placeholder="选择开始时间"
              :clearable="false"
              :picker-options="pickerOptions0"
              @change="handleStartTime"
              style="width: 130px"
            >
            </el-date-picker>至
            <el-date-picker
              v-model="formValidate.invigilateDateEnd"
              align="left"
              type="date"
              :clearable="false"
              :editable="false"
              placeholder="选择结束时间"
              style="width: 130px"
              :picker-options="pickerOptions1"
              @change="handleEndTime">
            </el-date-picker>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-row style="margin-bottom:12px;" v-for="(item,index) in tableData" :key="item">
        <el-col :span="24">
          <div class="el-form selectUserBox">
            <fieldset style="min-height:90px;">
              <legend style="font-size:16px">&nbsp;&nbsp;{{item.stationName}}&nbsp;</legend>
              <el-table
                border
                @row-click="rowclick(index)"
                align="center"
                :data="item.zyExaminerArrageList"
                stripe
                tooltip-effect="dark"
                highlight-current-row
                @selection-change="handleSelectionChange"
                style="width: 100%">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="stationRoomName" label="考室名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="roomNum" label="房间号"></el-table-column>
                <el-table-column prop="examinerName" label="姓名"></el-table-column>
                <el-table-column prop="major" label="专业">
                  <template scope="scope">{{scope.row.major | physicianPlanSelect}}</template>
                </el-table-column>
                <el-table-column prop="position" label="职称">
                  <template scope="scope">{{scope.row.position | physicianPlanSelect}}</template>
                </el-table-column>
                <el-table-column prop="company" label="单位" show-overflow-tooltip></el-table-column>
                <el-table-column prop="phone" label="联系方式"></el-table-column>
                <el-table-column prop="invigilateDate" label="执考日期">
                  <template scope="scope">{{yearMonthData(scope.row.invigilateDate)}}</template>
                </el-table-column>
                <el-table-column prop="isNotice" label="预约通知">
                  <template scope="scope">{{scope.row.isNotice == 'YES' ? '是' : '否'}}</template>
                </el-table-column>
                <el-table-column prop="isRemind" label="提醒通知">
                  <template scope="scope">{{scope.row.isRemind == 'YES' ? '是' : '否'}}</template>
                </el-table-column>
              </el-table>
            </fieldset>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row style="margin-top:20px;">
      <el-col :span="23" align="right">
        <el-button type="danger" @click="closeBtn">关闭</el-button>
      </el-col>
    </el-row>
    <!-- 短信通知 -->
    <Modal :mask-closable="false" v-model="messageModal" class-name="vertical-center-modal"
           :width="1000">
      <modal-header slot="header" :content="messageId"></modal-header>
      <message v-if="messageModal" @cancel="messageModal=false" :mess-data="messData" @message="subCallback"></message>
      <div slot="footer"></div>
    </Modal>
    <!--导出选择时间-->
    <Modal
      width="890"
      v-model="selectTimeModal"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectTimeId"></modal-header>
      <div v-if="selectTimeModal" style="padding-bottom:20px;">
        <el-row>
          <el-col :span="24">
            <el-date-picker
              v-model="selectTime"
              type="date"
              placeholder="选择时间">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px;">
          <el-col :span="24" align="center">
            <el-button type="primary" @click="confirmBtn">确定</el-button>
            <el-button type="primary" @click="cancelBtn">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题"
           class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <div v-if="deriveModal">
        <div class="remove">确认导出吗？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="deriveUrl">
              <el-button @click="deriveModal = false" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="deriveModal = false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /* 当前组件必要引入 */
  import message from './physicianPlan_message'
  // 当前组件引入全局的util
  let Util = null
  export default {
    name: 'exam-priview',
    props:['id'],
    data () {
      return {
        // 搜索的数据
        formValidate:{
          isNotice:'', //预约通知
          isRemind:'', //提醒通知
          examinerName:'', //姓名
          invigilateDateBegin:'', //执考日期
          invigilateDateEnd:'', //执考日期
        },
        dynamicHt:100, // 表格的高度
        tableData:[], // 表格的数据
        // 查询列表的接口
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '/zyExaminerArrage/preview/' + this.id,
            params: {}
          }
        },
        messData:'',
        multipleSelection: {},
        loading: false,
        // 短信通知
        messageModal:false,
        messageId:{
          id:'messageId',
          title:'短信通知',
        },
        currentIndex:0,
        // 导出选择时间
        selectTimeModal:false,
        selectTimeId:{
          id:'selectTimeId',
          title:'选择导出时间',
        },
        selectTime:'',
        // 导出
        deriveModal: false,
        deriveId: {id: 'deriveIdId', title: '导出'},
        deriveUrl:'',
        importData:[],
      }
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util;
        this.setTableData(); // 请求表格数据
      },

      /********************** 点击事件 ************************/
      rowclick(index){
        this.currentIndex = index;
      },
      // 点击--查询--按钮
      searchEvent(){
        this.setTableData();
      },
      // 点击--关闭--按钮
      closeBtn(){
        this.$emit('cancel','priview');
      },
      // 点击--保存--按钮
      saveBtn(){
        this.$emit('teacher');
      },
      // 点击--短信通知--按钮
      messageBtn(){
        this.messData = [];
        let flag = false;
        for(let i in this.multipleSelection){
          if(this.multipleSelection[i] && this.multipleSelection[i].length > 0){
            this.multipleSelection[i].map((item)=>{
              if(item.isRemind == 'YES'){
                flag = true;
              }
              this.messData.push(item);
            });
          }
        }
        // if(flag){
        //   this.errorMess('只能未提醒的用户进行短信通知');
        //   return;
        // }
        if(this.messData.length > 0){
          this.messageModal = true;
        }else{
          this.showMess('请选择数据');
        }
      },
      // 点击--导出--按钮
      importBtn(){
        let data = [];
        for(let i in this.multipleSelection){
          if(this.multipleSelection[i] && this.multipleSelection[i].length > 0){
            this.multipleSelection[i].map((item)=>{
              data.push(item);
            });
          }
        }
        this.importData = data;
        this.selectTimeModal = true;
        // if(data.length > 0){
          
        //   // if(data.length == 1){
        //   //   this.importData = data;
        //   //   this.selectTimeModal = true;
        //   // }else{
        //   //   this.showMess('只能导出一条数据');
        //   // }
        // }else{
        //   this.showMess('请选择数据');
        // }
      },
      // 点击--确定--按钮
      confirmBtn(){
        if(this.selectTime){
          let deriveParams = {
            invigilateDate:this.conductDate(this.selectTime,'yyyy-MM-dd'),
          }
          let temp = [];
          this.importData.map((item)=>{
            temp.push(item.planId);
          });
          // this.deriveUrl = '/api/zyExaminerArrage/exportExcel/'+ temp.join(',') +'?' + Util.serializeParams(deriveParams, 'string');
          this.deriveUrl = '/api/zyExaminerArrage/exportExcel/' + this.id +'?' + Util.serializeParams(deriveParams, 'string');
          this.deriveModal = true;
          this.selectTimeModal = false;
        }else{
          this.showMess('未选择时间');
        }
      },
      // 点击--取消--按钮
      cancelBtn(){
        this.selectTimeModal = false;
        this.selectTime = '';
      },
      /*************************** end ****************************/
      // 获取表格数据
      setTableData(){
        let formValidate = Util._.defaultsDeep({}, this.formValidate);
        formValidate.invigilateDateBegin = this.conductDate(formValidate.invigilateDateBegin, 'yyyy-MM-dd');
        formValidate.invigilateDateEnd = this.conductDate(formValidate.invigilateDateEnd, 'yyyy-MM-dd');
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, formValidate);
        this.ajax(this.listMessTitle);
      },

      updateListData(responseData){
        let data = responseData.data || [];
        this.tableData = data;
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection[this.currentIndex] = val;
      },
      /*
       * 监听子组件通讯的方法
       * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
       * */
      subCallback(target, title, updata) {
        this.messageModal = false;
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
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
          this.showMess('只能修改一条数据!')
          flag = false;
        }
        return flag;
      },
      // 将字符串转化成时间
      yearMonthData (date) {
        if(!date){
          return;
        }
        let datetime = new Date(date);
        let year = datetime.getFullYear();
        let month = datetime.getMonth() + 1;
        let D = datetime.getDate();
        if (month < 10) {
          month = '0' + month;
        }
        if (D < 10) {
          D = '0' + D;
        }
        return year + '-' + month + '-' + D;
      },
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {message,}
  }

</script>

