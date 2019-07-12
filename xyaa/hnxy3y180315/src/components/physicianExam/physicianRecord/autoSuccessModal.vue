<template>
  <div class="info">
    <el-row>
      <el-col :span="12">
        <div class="picture">
          暂无头像
        </div>
      </el-col>
      <el-col :span="12">
        <div class="peopleInfo">
          <p>考生姓名： {{data.name}}</p>
          <p>准考证号： {{data.quasiExamNumber}}</p>
          <p>身份证号： {{data.idCard}}</p>
          <p>考试日期： {{data.examinationDate | formatDate('yyyy-MM-dd')}}</p>
        </div>
      </el-col>
    </el-row>
    <p class="tips">考生信息核对无误，检录成功！</p>
  </div>
</template>
<script>
export default {
  props: ['modalType','operailityData'],
  data(){
    return{
      data:'',
      listMessTitle: {
        ajaxSuccess: 'ajaxSuccess',
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
  mounted(){
    this.autoHide()
  },
  methods:{
    init(){
      this.data = this.operailityData[0]
    },
    autoHide(){
      let that = this
      that.timer = setTimeout(function(){
        that.ajax(that.listMessTitle)
        that.$emit('autoHide')
      },2000)
    }
  },
  beforeDestroy(){
    clearTimeout(this.timer)
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
      color: green;
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
