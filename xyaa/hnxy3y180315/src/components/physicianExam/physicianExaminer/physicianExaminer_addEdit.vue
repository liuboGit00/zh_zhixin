<template>
  <div>
    <el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-phy-add" :rules="rules">
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="姓名" prop="name" width="100">
            <el-input v-model="searchForm.name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1" >
          <el-form-item label="性别" prop="sex" width="100">
            <el-select placeholder="请选择" v-model="searchForm.sex" clearable>
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="身份证号">
            <el-input v-model="searchForm.idCard" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="电话" prop="phone">
            <el-input v-model="searchForm.phone" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="考官类别" prop="category">
            <el-select placeholder="请选择" v-model="searchForm.category" clearable>
              <el-option
                v-for="item in category"
                :key="item.code"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="专业" prop="major">
            <el-select placeholder="请选择" v-model="searchForm.major" clearable>
              <el-option
                v-for="item in major"
                :key="item.code"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="职称" prop="position">
           <el-select placeholder="请选择" v-model="searchForm.position" clearable>
             <el-option
               v-for="item in position"
               :key="item.code"
               :label="item.name"
               :value="item.name">
             </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="单位" prop="company">
            <el-input  placeholder="请输入" v-model="searchForm.company"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="1">
          <el-form-item label="可监考日期" prop="invigilateDate">
            <el-tag type="gray" :closable="true"  @close="handleClose(index)" v-for="(item,index) in invigilateDate" :key="index" style="margin-right: 2px;">{{ item }}</el-tag>
            <el-tag type="success" style="cursor:pointer;" @click.native="addDate">+添加时间&nbsp;</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="4" class="btnBox">
        <el-button @click="submit">确认</el-button>
      </el-col>
      <el-col :span="4" class="btnBox" :offset="2">
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <!--选择时间-->
    <Modal width="890" v-model="selectDateModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectDateId"></modal-header>
      <select-date v-if="selectDateModal" @cancel="cancelDate" @selectDate="selectDate"></select-date>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import api from "./api";
  import selectDate from "./selectDate";
  import { physicianExaminer as rules } from '../rules'; // 验证规则
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData','modalType','treeRoad'],
    data(){
      return{
        rules,
        searchForm: {
          name: '',
          sex: '',
          idCard: '',
          phone: '',
          major: '',
          category: '',
          position: '',
          company: "湘雅三院",
          invigilateDate: "",
        },

        invigilateDate:[],
        selectDateModal: false,
        selectDateId:{
          id:'selectDateId',
          title:'时间'
        },
        date:'',

        category: [], //考官类别
        major: [], //专业
        position: [], //职称

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

        //类别
        categoryMessTitle: {
          ajaxSuccess: 'categoryData',
          ajaxParams: {
            url: api.dictionary.path + 'ZY_KGLB',
          }
        },

        //编辑回显
        getMessTitle: {
          ajaxSuccess: 'getData',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
          }
        },

        //添加
        addMessTitle: {
          type:'add',
          ajaxSuccess: 'addSuccess',
          ajaxParams: {
            url: api.add.path,
            method:api.add.method
          }
        },

        //修改
        editMessTitle: {
          type:'add',
          ajaxSuccess: 'editSuccess',
          ajaxParams: {
            url: api.edit.path + this.operailityData.id,
            method:api.edit.method
          }
        },
      }
    },
    methods:{
      init () {
        this.ajax(this.majorMessTitle) //专业
        this.ajax(this.positionMessTitle) //职称
        this.ajax(this.categoryMessTitle) //类别
        if(this.modalType === 'edit'){
          this.ajax(this.getMessTitle) //类别
        }
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
      categoryData(res){
        this.category = res.data.child
      },

      //编辑回显
      getData(res){
        this.searchForm = res.data
        this.invigilateDate = res.data.invigilateDate.split(',')
      },

      //添加时间
      addDate(){
        this.openModel('selectDate');
      },

      //时间可删除
      handleClose(index) {
        this.invigilateDate.splice(this.invigilateDate.indexOf(index), 1);
      },

      //提交
      submit(){
        if(this.searchForm.idCard){
          var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
          if(reg.test(this.searchForm.idCard) === false) {
            this.errorMess("身份证输入不合法");
            return false;
          }
        }
        this.searchForm.invigilateDate = this.invigilateDate.join(',')
        let treeRoad = {
          treeRoad: this.treeRoad
        }
        let isSubmit = this.submitForm("searchForm");
        if (isSubmit) {
          if(this.modalType === 'edit'){
            this.editMessTitle.ajaxParams.data = Object.assign(this.searchForm, treeRoad);
            this.ajax(this.editMessTitle)
          }else{
            this.addMessTitle.ajaxParams.data = Object.assign(this.searchForm, treeRoad);
            this.ajax(this.addMessTitle)
          }

        }
      },

      //添加成功
      addSuccess(){
        this.$emit('add', 'addAndEdit');
        this.successMess('添加成功')
      },

      //编辑成功
      editSuccess(){
        this.$emit('add', 'addAndEdit');
        this.successMess('编辑成功')
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },

      //取消
      cancel(){
        this.$emit('cancel', 'addAndEdit');
      },

      cancelDate(){
        this.selectDateModal = false
      },

      submitForm(formName) {
          let flag = false;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              flag = true;
            }
          });
          return flag;
        },

      // 弹窗回调
      selectDate(target, title, updata) {
        if(target === 'selectDate'){
          this.invigilateDate.push(title)
          this.selectDateModal = false
        }
      }
    },
    created() {
      Util = this.$util;
      this.init();
    },
    components: {
      selectDate,//选择时间
    },
  }
</script>
<style lang="scss">
  .demo-phy-add{
    .el-input__inner{
      width: 200px;
    }
    .el-form-item__label{
      width: 100px;
    }
    .el-date-editor--daterange{
      width: 300px;
      .el-input__inner{
        width: 300px;
      }
    }
  }
</style>
