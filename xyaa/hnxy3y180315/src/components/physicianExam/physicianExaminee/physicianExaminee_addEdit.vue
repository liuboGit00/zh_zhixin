<template>
  <div>
    <el-form
      :inline="true"
      :model="searchForm"
      ref="searchForm"
      class="demo-phy-add"
      :rules="rules"
    >
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="searchForm.name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="性别" prop="sex">
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
          <el-form-item label="准考证号" prop="quasiExamNumber">
            <el-input v-model="searchForm.quasiExamNumber" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="考试日期" prop="examinationDate">
            <el-date-picker v-model="searchForm.examinationDate" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="考试时间" prop="examinationTime">
            <el-select placeholder="请选择" v-model="searchForm.examinationTime" clearable>
              <el-option label="8:00" value="8:00"></el-option>
              <el-option label="13:00" value="13:00"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="考试类别" prop="examinationType">
            <el-select placeholder="请选择" v-model="searchForm.examinationType" clearable>
              <el-option label="执业医师考试" value="执业医师考试"></el-option>
              <el-option label="助理医师考试" value="助理医师考试"></el-option>
            </el-select>
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
  </div>
</template>
<script>
  import api from "./api"; // 验证规则
  import { physicianExaminee as rules } from "../rules"; // 验证规则
  export default {
    props: ["operailityData", "modalType", "treeRoad"],
    data() {
      return {
        rules,
        searchForm: {
          name: "",
          sex: "",
          idCard: "",
          quasiExamNumber: "",
          examinationDate: "",
          examinationTime: "",
          examinationType: ""
        },

        //编辑回显
        getMessTitle: {
          ajaxSuccess: 'getData',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
          }
        },

        //修改
        editMessTitle: {
          ajaxSuccess: 'editSuccess',
          ajaxParams: {
            url: api.edit.path + this.operailityData.id,
            method:api.edit.method,
          }
        },
      };
    },
    created(){
      this.init()
    },
    methods: {
      init(){
        if(this.modalType === 'edit'){
          this.ajax(this.getMessTitle) //类别
        }
      },

      //编辑回显
      getData(res){
        this.searchForm = res.data
      },

      //提交
      submit() {
        if(this.searchForm.idCard){
          var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
          if(reg.test(this.searchForm.idCard) === false) {
            this.errorMess("身份证输入不合法");
            return false;
          }
        }
        let isSubmit = this.submitForm("searchForm");
        if (isSubmit) {
          let treeRoad = {
            treeRoad: this.treeRoad
          };
          let parmas = this.formDate(Object.assign({},this.searchForm,treeRoad),['examinationDate'],'yyyy-MM-dd')
          if(this.modalType === 'edit'){
            this.editMessTitle.ajaxParams.data = parmas
            this.ajax(this.editMessTitle)
          }else{
            this.ajax({
              ajaxSuccess: 'ajaxSuccess',
              ajaxError: 'ajaxError',
              ajaxParams: {
                url: '/zy/examinee/add',
                method: 'post',
                data: parmas
              }
            });
          }
        }
      },
      ajaxSuccess(res){
        this.$emit('add','addAndEdit')
        this.successMess('新增成功')
      },

      //编辑成功
      editSuccess(){
        this.$emit('add', 'addAndEdit');
        this.successMess('编辑成功')
      },

      cancel() {
        this.$emit('cancel','addAndEdit')
      },
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate(valid => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      }
    }
  };
</script>
<style lang="scss">
.demo-phy-add {
  .el-input__inner {
    width: 200px;
  }
  .el-form-item__label {
    width: 100px;
  }
}
</style>
