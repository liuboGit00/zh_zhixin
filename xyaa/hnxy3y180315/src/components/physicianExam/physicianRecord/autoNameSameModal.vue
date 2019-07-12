<template>
  <div class="info">
    <el-row>
      <!-- 表格 -->
    <div class="myTable"  id="myTable" ref="myTable">
      <el-table
      :data="operailityData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      >
      <el-table-column
      type="selection"
      width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="quasiExamNumber"
        label="准考证号"
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="idCard"
        label="身份证号"
        align="center"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="examinationDate"
        label="考试日期"
        align="center"
        >
        <template scope="scope">
          {{ scope.row.examinationDate | formatDate('yyyy-MM-dd') }}
        </template>
      </el-table-column>
    </el-table>
    </div>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="4" class="btnBox">
        <el-button @click="submit">确认</el-button>
      </el-col>
      <el-col :span="4" class="btnBox" :offset="2">
        <el-button @cancel="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: ['modalType','operailityData'],
  data(){
    return{
      id:'',
      selectData:[], //选中的数据
      tableData:[],
      listMessTitle: {
        ajaxSuccess: 'listSuccess',
        ajaxParams: {
          url: '/zy/examinee/nameRecord',
          method: 'get',
          params: {
            id:''
          }
        }
      },
    }
  },
  methods:{
    //选中
    handleSelectionChange(val){
      this.selectData = val
      let ids = []
      val.map(item=>{
        ids.push(item.id)
        this.id = ids.join(',')
      })
    },

    listSuccess(){
      this.successMess('保存成功')
      this.$emit('autoNameSame')
    },

    //保存
    submit(){
      if(this.selectData.length > 1){
        this.errorMess('只能选择一条数据！')
        return
      }
      this.listMessTitle.ajaxParams.params.id = this.id
      this.ajax(this.listMessTitle)
    },

    //取消
    cancel(){
      this.$emit('autoNameSame')
    }
  }
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
    .peopleInfo{
      font-size: 18px;
      >p{
        line-height: 35px;
      }
    }
  }

</style>
