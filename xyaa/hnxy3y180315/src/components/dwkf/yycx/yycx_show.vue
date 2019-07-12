<!--
****--@file     yycx_show
****--@date     2019-04-04 10:58
****--@author   YC
****--@describe 查看
-->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate"  class="demo-form-inline" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="预约名称：" prop="name" class="feildFontweight">
            {{formValidate.name}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请单位：" prop="company" class="feildFontweight">
            {{formValidate.company}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="申请部门：" prop="department" class="feildFontweight">
            {{formValidate.department}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请使用日期：" prop="useDate" class="feildFontweight">
            {{formValidate.useDate}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="使用类型：" prop="usetype" class="feildFontweight">
            {{formValidate.usetype | yycxUserType}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预约对象：" prop="disciplineTwoId" class="feildFontweight">
            {{formValidate.reception}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="预约事由：" class="feildFontweight">
            {{formValidate.cause}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="预约人数：" prop="userNum" class="feildFontweight">
            {{formValidate.userNum}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="分组数量" prop="group" class="feildFontweight">
            {{formValidate.group}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="每组人数" prop="groupNumber" class="feildFontweight">
            {{formValidate.groupNumber}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="房间数量：" prop="roomNum" class="feildFontweight">
            {{formValidate.roomNum}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="房间要求：" prop="roomRequire" class="feildFontweight">
            {{formValidate.roomRequire}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="需协助具体事宜：" prop="coordinate" class="feildFontweight">
            {{formValidate.coordinate}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="用物清单：" prop="fileList" class="feildFontweight">
            <upload-file :uploadFiles="formValidate.fileList" :show="true"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="申请人：" prop="applicant"  class="feildFontweight">
            {{formValidate.applicant}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话：" prop="phone" class="feildFontweight">
            {{formValidate.phone}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：" prop="remarks" class="feildFontweight">
            {{formValidate.remarks}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="房间分配："  class="feildFontweight">
            <div v-for="item in formValidate.roomList" :key="item">
              <p v-for="items in item.openTimeList" :key="items" style="line-height:30px;">
                {{item.roomNum + '(' + items.date +' ' + items.startTime + '-' + items.endTime +')'}}
              </p>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="耗材分配：" prop="consumablesList"  class="feildFontweight">
            <span v-for="item in formValidate.consumablesList" :key="item" style="margin-right: 10px;">{{item.consumableName + ' ('+ item.consumableNumber +')'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <span  class="feildFontweight">申请/审核历史情况</span>
        <el-col :span="24">
          <el-table
            align="center"
            :data="formValidate.userReviewList"
            stripe
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%">
            <el-table-column prop="createUserName" label="申请人/审批人" show-overflow-tooltip width="200">
            </el-table-column>
            <el-table-column prop="node" label="流程节点" show-overflow-tooltip width="220">
            </el-table-column>
            <el-table-column prop="createTime" label="申请/审批时间" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="reviewMess" label="审批意见" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="spState" label="状态" show-overflow-tooltip>
              <template scope="scope">{{scope.row.spState | yycxSHStatus}}</template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  /* 当前组件必要引入 */
  // import rules from '../rules';
  import uploadFile from '../../common/uploadFile'
  // 当前组件引入全局的util
  let Util = null
  export default {
    props:['operailityData'],
    name: '',
    data () {
      let userInfo = this.$store.getters.getUserInfo;
      return {
        // rules:rules,
        formValidate:{
          name:'', // 预约名称
          company:'', // 申请单位
          department:'', // 申请部门
          useDate:'', //申请使用日期
          usetype:'', // 使用类型
          reception:'',// 预约对象
          cause:'', // 预约事由
          userNum:'',// 预约人数
          group:'',// 分组数量
          groupNumber:'',// 每组人数
          roomNum:'',// 房间数量
          roomRequire:'',// 房间要求
          coordinate:'',// 需协助具体事宜
          fileList:[], //用物清单
          applicant:'', // 申请人
          phone:'', // 联系电话
          remarks:'', // 备注
          roomList:[],// 房间分配
          consumablesList:[],// 耗材分配
          userReviewList:[], // 申请/审核历史情况
        },
        // 获取数据
        dataTitle:{
          ajaxSuccess:'getData',
          ajaxParams:{
            url:'',
          },
        },
      }
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util
        this.dataTitle.ajaxParams.url = '/open/reserve/get/' + (this.operailityData ? this.operailityData.id : '');
        this.ajax(this.dataTitle);
      },

      /******************** 点击事件 ********************/

      /******************* end *************************/
      // 获取编辑的数据
      getData(res){
        (res.data.fileList || []).map((item => {
          item.name = item.oldName;
        }));
        for(let i in this.formValidate){
          this.formValidate[i] = res.data[i];
        }
      },

    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {uploadFile},
  }

</script>




