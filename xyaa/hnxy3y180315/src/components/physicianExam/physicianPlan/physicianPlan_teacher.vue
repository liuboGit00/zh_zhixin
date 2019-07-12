<!--
****--@file     physicianPlan_list
****--@date     2019-02-13 11:19
****--@author   YC
****--@describe 场次管理
-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" inline label-width="80px">
      <el-row style="margin-bottom:0">
        <!--搜索项-->
        <el-col :span="24" align="right">
          <el-form-item label="姓名">
            <el-input v-model="formValidate.name" style="width:140px;" placeholder="输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="专业">
            <el-select v-model="formValidate.major" placeholder="请选择专业" style="width:140px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="内科" value="NK"></el-option>
              <el-option label="外科" value="WK"></el-option>
              <el-option label="其他" value="QT"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职称">
            <el-select v-model="formValidate.position" placeholder="请选择职称" style="width:140px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="主任医师" value="ZRYS"></el-option>
              <el-option label="副主任医师" value="FZYS"></el-option>
              <el-option label="主治医师" value="ZZYS"></el-option>
              <el-option label="其他" value="QT"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位">
            <el-input v-model="formValidate.company" style="width:140px;" placeholder="输入单位"></el-input>
          </el-form-item>
          <el-form-item label="执考日期">
            <el-date-picker
              v-model="formValidate.invigilateStartDate"
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
              v-model="formValidate.invigilateEndDate"
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
      <div id="myTable">
        <el-table
          ref="myTable"
          border
          align="center"
          max-height="600"
          :data="tableData"
          stripe
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sex" label="性别" show-overflow-tooltip></el-table-column>
          <el-table-column prop="idCard" label="身份证号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="phone" label="联系方式" show-overflow-tooltip></el-table-column>
          <el-table-column prop="category" label="考官类别" show-overflow-tooltip>
            <template scope="scope">{{scope.row.category | physicianPlanSelect}}</template>
          </el-table-column>
          <el-table-column prop="major" label="专业" show-overflow-tooltip>
            <template scope="scope">{{scope.row.major | physicianPlanSelect}}</template>
          </el-table-column>
          <el-table-column prop="position" label="职称" show-overflow-tooltip>
            <template scope="scope">{{scope.row.position | physicianPlanSelect}}</template>
          </el-table-column>
          <el-table-column prop="company" label="单位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="invigilateDate" label="可执考日期" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
    <el-row style="margin-top:20px;">
      <el-col :span="23" align="right">
        <el-button type="danger" @click="closeBtn">关闭</el-button>
        <el-button type="primary" @click="saveBtn">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /* 当前组件必要引入 */
  // 当前组件引入全局的util
  let Util = null
  export default {
    name: '',
    props:['initTeacher','examInfo','otherTeachers','needNum'],
    data () {
      return {
        // 搜索的数据
        formValidate:{
          name:'', // 姓名
          major:'', //专业
          position:'', // 职称
          company:'', // 单位
          invigilateStartDate:'', // 开始日期
          invigilateEndDate:'', // 结束日期
        },
        dynamicHt:100, // 表格的高度
        tableData:[], // 表格的数据
        // 查询列表的接口
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '/zy/examiner/selectList',
            params: {}
          }
        },
        multipleSelection: [],
        loading: false,
        // 保存数据
        saveTitle:{
          ajaxSuccess:'saveDate',
          ajaxParams:{
            jsonString:true,
            url:'/zyExaminerArrage/addList',
            method: 'post',
            data: {},
          }
        },
        errorStr:[], // 存放错误信息
      }
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util;
        this.setTableData(); // 请求表格数据
      },

      /********************** 点击事件 ************************/
      // 点击--查询--按钮
      searchEvent(){
        this.setTableData();
      },
      // 点击--关闭--按钮
      closeBtn(){
        this.$emit('cancel','teacher');
      },
      // 点击--保存--按钮
      saveBtn(){
        if(!this.isSelected()) return;
        // 要求:数量;
        if(this.multipleSelection.length - this.needNum != 0){
          this.errorMess('本考室要求考官数量为' + this.needNum + '人，当前选择数量为' + this.multipleSelection.length  + '人！');
          return;
        }
        // 要求：老师不能监考同一场
        // 要求：来自不同单位；来自不同专业；搭配不同职称；搭配不同性别；
        let companyStr = []; // 选择数据的单位
        let majorStr = []; // 选择数据的专业
        let positionStr = []; // 选择数据的职称
        let sexStr = []; // 选择数据的性别
        let sameNameTitle = [];
        let errorStr = [];
        let temp = [];
        this.multipleSelection.map((item)=>{
          if(this.otherTeachers.length > 0){ // 其他房间在同一天选择的老师
            this.otherTeachers.map((list)=>{
              if(list.id == item.id){
                sameNameTitle.push(item.name);
              }
            });
          }
          temp.push({id:item.id,name:item.name,invigilateDate:item.invigilateDate});
          majorStr.push(item.major); // 专业
          positionStr.push(item.position); // 职称
          companyStr.push(item.company); // 公司
          sexStr.push(item.sex); // 性别
        });
        if(sameNameTitle.length > 0){  // 说明老师有重复
          this.errorMess(sameNameTitle.join(',') + '已经在其他考室监考，请重新选择！');
          return;
        }
        if(this.multipleSelection.length <= 4){
          if(this.multipleSelection.length <= 3){
            if(this.multipleSelection.length == 2){
              if(this.uniq(sexStr).length != this.multipleSelection.length){ // 性别有重复
                errorStr.push('性别有重复');
              }
            }
            if(this.uniq(majorStr).length != this.multipleSelection.length){ // 专业有重复 3
              errorStr.push('专业有重复');
            }
          }
          if(this.uniq(positionStr).length != this.multipleSelection.length){ // 职称有重复 4
            errorStr.push('职称有重复');
          }
        }else{
          if(this.uniq(sexStr).length != 2){ // 性别有重复
            errorStr.push('性别有重复');
          }
          if(this.uniq(majorStr).length != 3){ // 专业有重复 3
            errorStr.push('专业有重复');
          }
          if(this.uniq(positionStr).length != 4){ // 职称有重复 4
            errorStr.push('职称有重复');
          }
        }
        if(this.uniq(companyStr).length != this.multipleSelection.length){ // 单位有重复
          errorStr.push('单位有重复');
        }

        let tempArr = [];
        temp.map((item)=>{
          let flag = false;
          let info = Util._.defaultsDeep({}, this.examInfo);
          if(item.invigilateDate){
            let timesList = item.invigilateDate.split(',');
            for(let i = 0; i < timesList.length;i ++){
              if(info.invigilateDate == timesList[i]){
                flag = true;
              }
            }
          }
          if(!flag){
            errorStr.push(item.name + '不在可期望的可执考日期内');
          }
          info.examinerId = item.id;
          info.examinerName = item.name;
          tempArr.push(info);
        })

        if(errorStr.length > 0){
          this.errorStr = errorStr;
          this.showMess(errorStr.join(','));
        }
        this.saveTitle.ajaxParams.data = tempArr;
        setTimeout(() => {
          this.ajax(this.saveTitle);
        }, 10);
      },
      /*************************** end ****************************/
      // 获取表格数据
      setTableData(){
        let formValidate = Util._.defaultsDeep({}, this.formValidate);
        formValidate.invigilateStartDate = this.conductDate(formValidate.invigilateStartDate, 'yyyy-MM-dd');
        formValidate.invigilateEndDate = this.conductDate(formValidate.invigilateEndDate, 'yyyy-MM-dd');
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, formValidate);
        this.ajax(this.listMessTitle);
      },

      updateListData(responseData){
        let selected = []; // 存放已选择老师的id
        let data = responseData.data;
        if(this.initTeacher && this.initTeacher.length > 0){ // 已选择过老师
          this.initTeacher.map((item)=>{
            selected.push(item.examinerId);
            data.map((list,index)=>{
              if(item.examinerId == list.id){
                let temp = Util._.defaultsDeep({}, list);
                data.splice(index,1);
                data.unshift(temp);
              }
            });
          });
        }
        this.tableData = data;
        this.$nextTick(() => {
          if (selected.length) {
            let thisPageIds = [];
            let rowIndex;
            data.map(item => thisPageIds.push(item.id));
            for(let i = 0; i < selected.length; i ++){
              rowIndex = thisPageIds.indexOf(Number(selected[i]));
              if (rowIndex > -1) {
                this.$refs.myTable.toggleRowSelection(this.tableData[rowIndex]); // 选中数据
              }
            }
          }
        });
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
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
      // 保存数据
      saveDate(res){
        this.$emit('teacher',this.multipleSelection,this.errorStr);
      },
      // 判断数组里面是否有重复的数据 有重复返回true；否则返回false
      isHaveSameArr(arr){
        return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f"+arr.join("\x0f\x0f") +"\x0f");
      },

      // 对数组进行去重
      uniq(array){
        let temp = []; //一个新的临时数组
        for(let i = 0; i < array.length; i++){
          if(temp.indexOf(array[i]) == -1){
            temp.push(array[i]);
          }
        }
        return temp;
      },
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {}
  }

</script>

