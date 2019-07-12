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
              <el-col :span="10" :offset="2">
            <el-form-item label="预约名称" prop="name" >
              {{formValidate.name}}
            </el-form-item>
          </el-col>

          <el-col :span="10" :offset="2">
            <el-form-item label="申请单位" prop="contractNumber" >
              {{formValidate.company}}
            </el-form-item>
          </el-col>
          </el-row>
          
            <el-row>
                 <el-col :span="10" :offset="2">
            <el-form-item label="申请部门" prop="firstParty">
              {{formValidate.department}}
            </el-form-item>
          </el-col>

          <el-col :span="10" :offset="2">
            <el-form-item label="申请使用时间" prop="partyB">
              {{formValidate.useDate}}
            </el-form-item>
          </el-col>
            </el-row>
         <el-row>
             <el-col :span="10" :offset="2">
            <el-form-item label="使用类型">
               {{ reassign(formValidate.usetype)}}
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="预约对象" >
              {{formValidate.reception}}
            </el-form-item>
          </el-col>
         </el-row>
          <el-row>
              <el-col :span="24" :offset="2">
            <el-form-item label="预约事由" >
              {{formValidate.cause}}
            </el-form-item>
          </el-col>
          </el-row>
          <el-row>
              <el-col :span="10" :offset="2"  v-if="formValidate.usetype === 'KH'">
                <el-form-item label="预约项数" >
                  {{formValidate.reserveNum}}
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
            <el-form-item label="预约人数" >
              {{formValidate.userNum}}
            </el-form-item>
          </el-col>
          </el-row>
           <el-row>
             <el-col :span="10" :offset="2">
            <el-form-item label="分组数量">
               {{formValidate.group}}
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="每组人数" >
              {{formValidate.groupNumber}}
            </el-form-item>
          </el-col>
         </el-row>

         <el-row>
              <el-col :span="10" :offset="2">
            <el-form-item label="房间数量" >
              {{formValidate.roomNum}}
            </el-form-item>
          </el-col>
          </el-row>

            <el-row>
              <el-col :span="24" :offset="2">
            <el-form-item label="房间要求" >
              {{formValidate.roomRequire}}
            </el-form-item>
          </el-col>
          </el-row>
           <el-row>
              <el-col :span="24" :offset="2">
            <el-form-item label="需协助的具体事宜" >
              {{formValidate.coordinate}}
            </el-form-item>
          </el-col>
          </el-row>
           <el-row>
              <el-col :span="24" :offset="2">
            <el-form-item label="用物清单" >
              <!-- <div v-for="item in formValidate.fileList" :key="item.id">
                {{ item.oldName }}
              </div>  -->
              <upload-file v-if="formValidate.fileList && formValidate.fileList.length" :size="500*1024" :uploadFiles="formValidate.fileList||[]"
                         :show="true" style="width:250px;"></upload-file>
              <span v-else>暂无附件</span>
            </el-form-item>
          </el-col>
          </el-row>
          <el-row>
             <el-col :span="10" :offset="2">
            <el-form-item label="申请人">
               {{formValidate.applicant}}
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="联系电话" >
              {{formValidate.phone}}
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
             <el-col :span="24" :offset="2">
            <el-form-item label="备注">
               {{formValidate.remarks}}
            </el-form-item>
          </el-col>
         </el-row>
         <!-- <el-row>
             <hr/>
         </el-row>
         <el-row>
             <el-col :span="24" :offset="2">
            <el-form-item label="房间分配">
               {{formValidate.price}}
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
             <el-col :span="24" :offset="2">
            <el-form-item label="使用日期">
               {{formValidate.price}}
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
             <el-col :span="24" :offset="2">
            <el-form-item label="耗材分配">
               {{formValidate.price}}
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
             <hr/>
         </el-row>
         <el-row>
             <el-col :span="24" :offset="2">
                 <h2>申请/审核动作历史情况</h2>
             </el-col>   
         </el-row> -->
          <!-- <el-col :span="20" :offset="2">
            <el-col :span="2" :offset="2"><p><strong>附件:</strong></p></el-col>
            <el-col :span="17">
              <upload-file :show="true" :unSize="true" :uploadFiles="fileList"
                           @setUploadFiles="setFiles"></upload-file>
            </el-col>
          </el-col> -->
      </el-form>
      <!-- <el-row>
             <el-col :span="24" :offset="2">
            <el-button type="danger" @click="close">关闭</el-button>
          </el-col>
         </el-row> -->
      
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import api from './api';
    import uploadPhotoWall from '../../common/uploadPhotoWall';
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
            console.log(this.id)
            // this.formValidate = this.id;
            
            if(this.id){
              this.getData()
            }
          },
          getData(){
            let opt = {
              ajaxSuccess: "getShowDataSuccess",
              ajaxParams:{
                url:api.get.path + this.id.id,
                method: api.get.method
              }
            };
            this.ajax(opt)
          },
          getShowDataSuccess(res){
            console.log(res.data.fileList)
            res.data.fileList.map(i=>{
              i.name = i.oldName
            })
            this.formValidate=res.data;
            this.fileList=res.data.fileList
          },
          reassign(e) { 
            switch (e) {
                case "QT":
                return "其他";
                break;
                case "GZF":
                return "工作坊";
                break;
                case "HY":
                return "会议";
                break;
                case "KH":
                return "考核";
                break;
                case "PX":
                return "培训";
                break;
                case "ZRSP":
                return "主任审批";
                break;
                case "GLYSP":
                return "管理员审批";
                break;
                case "YSB":
                return "已上报";
                break;
                case "WSB":
                return "未上报";
                break;
                case "BH":
                return "驳回";
                break;
                case "TG":
                return "通过";
                break;
                default:
                break;
            }
        },
        setUploadFiles(a,b,c){
          console.log(a,b,c)
        },
          close(){
            // console.log(this.id)
            // this.showModal = false;
            this.cancel("show")
          },
          // 取消
          cancel(targer) {
            this[targer + "Modal"] = false;
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
