<template>
  <div class="info">
    <el-row>
      <el-col :span="10">
        <div class="picture">
          暂无头像
        </div>
      </el-col>
      <el-col :span="14">
        <div class="peopleInfo">
          <p>考生姓名： {{data.name}}</p>
          <p>准考证号： {{data.quasiExamNumber}}</p>
          <p>身份证号： {{data.idCard}}</p>
          <p>考试日期： {{data.examinationDate}}</p>
        </div>
      </el-col>
    </el-row>
    <p class="tips">请仔细核对身份信息，确认执行检录操作？</p>
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
  let Util = null;
  export default {
    props: ['modalType','operailityData'],
    data(){
      return{
        listMessTitle: {
          ajaxSuccess: 'listData',
          ajaxParams: {
            url: '/zy/examinee/nameRecord',
            method: 'get',
            params: {
              id:this.operailityData[0].id
            }
          }
        },
      }
    },
    methods: {
      init(){
        this.data = this.operailityData[0]
        // this.setTableData()
      },
      // setTableData(){
      //   this.ajax(this.listMessTitle)
      // },

      //保存
      submit(){
        this.listMessTitle.ajaxParams.params.id = this.operailityData[0].id
        this.ajax(this.listMessTitle)
      },

      listData(){
        this.successMess('确认成功')
        this.$emit('handCall','handCall')
      },

      //取消
      cancel(){
        let clearMessTitle = {
          ajaxSuccess: 'clearData',
          ajaxParams: {
            url: '/zy/examinee/clear',
            method: 'get',
            params: {}
          }
        }
        this.ajax(clearMessTitle)
      },

      //取消成功
      clearData(){
        this.successMess('取消成功')
        this.$emit('cancel','handCall')
      }
    },
    created () {
      this.init();
    },
  }
</script>
<style lang="scss" scoped>
  .info{
    .picture{
      width: 150px;
      height: 150px;
      text-align: center;
      line-height: 150px;
      font-size: 20px;
      margin: auto;
      border: 1px solid #dddddd;
    }
    .tips{
      line-height: 65px;
      font-size: 22px;
      color: red;
      text-align: center;
    }
    .peopleInfo{
      font-size: 18px;
      >p{
        line-height: 35px;
      }
    }
  }

</style>
