<!--
****--@file     contract_view
****--@date     2018/10/12 10:47
****--@author   WH
****--@describe   合同查看
-->
  <template>
    <div class="editForm">
      <el-form :model="formValidate" ref="formValidate" label-width="124px">
        <el-row>

          <el-col :span="8" :offset="2">
            <el-form-item label="合同名称：" prop="contractName" >
              {{formValidate.contractName}}
            </el-form-item>
          </el-col>

          <el-col :span="8" :offset="2">
            <el-form-item label="参考单价：" prop="contractNumber" >
              {{formValidate.contractNumber}}
            </el-form-item>
          </el-col>

          <el-col :span="8" :offset="2">
            <el-form-item label="甲方：" prop="firstParty" placeholder="请输入" required>
              {{formValidate.firstParty}}
            </el-form-item>
          </el-col>

          <el-col :span="8" :offset="2">
            <el-form-item label="乙方：" prop="partyB" placeholder="请输入" required>
              {{formValidate.partyB}}
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="合同金额：">
              ￥{{formValidate.price}}
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="签署日期：" >
              {{formValidate.signDate}}
            </el-form-item>
          </el-col>

          <el-col :span="20" :offset="2">
            <el-col :span="2" :offset="2"><p><strong>附件:</strong></p></el-col>
            <el-col :span="17">
              <upload-file :show="true" :unSize="true" :uploadFiles="fileList"
                           @setUploadFiles="setFiles"></upload-file>
            </el-col>
          </el-col>


        </el-row>
      </el-form>

    </div>
</template>
<script>
    /*当前组件必要引入*/
    import api from './api'
    let Util = null
    export default {
       props:['id'],
        data () {
            return {
              formValidate:{},
              fileList:[],
            }
        },
        methods: {
          //初始化请求列表数据
          init () {
            Util = this.$util
            if(this.id){
              this.getData()
            }
          },
          getData(){
            let opt = {
              ajaxSuccess: "getShowDataSuccess",
              ajaxParams:{
                url:api.get.path + this.id,
                method: api.get.method
              }
            };
            this.ajax(opt)
          },
          getShowDataSuccess(res){
            this.formValidate=res.data;
            this.fileList=res.data.fileList
          },

        },
        created () {
            this.init();
        },
        mounted () {
        },
        components: {}
    }

</script>
<style lang="scss">

</style>
