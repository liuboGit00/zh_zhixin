<template>
  <div>
    <el-form :rules="rules" :inline="true" :model="searchForm" ref="searchForm" >
      <el-form-item label="可监考日期 :" prop="date">
        <el-date-picker
          v-model="searchForm.date"
          type="date"
          @change="change"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
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
  import { physicianExaminer as rules } from '../rules'; // 验证规则
  export default {
    name: 'selectDate',
    data(){
      return {
        rules,
        searchForm:{
          date:'',
        },
        val:'',
      }
    },
    methods: {
      change(val){
        this.val = val
      },

      //保存
      submit(){
        let isSubmit = this.submitForm("searchForm");
        if (isSubmit) {
          this.$emit('selectDate','selectDate',this.val);
        }
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

      //取消
      cancel(){
        this.$emit('cancel', 'selectDate');
      },

    }
  }
</script>

<style scoped>

</style>
