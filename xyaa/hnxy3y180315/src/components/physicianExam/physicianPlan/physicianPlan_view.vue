<!--
****--@file     physicianPlan_view
****--@date     2019-02-15 9:41
****--@author   YC
****--@describe 查看
-->
<template>
  <div style="max-height:1000px; overflow:auto;">
    <el-form :model="formValidate" ref="formValidate" class="demo-form-inline" label-width="110px" :rules="rules.physicianPlanRules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="场次名称" prop="planName">
            {{formValidate.planName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startDate">
            {{formValidate.startDate}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endDate">
            {{formValidate.endDate}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上午开考时间" prop="amStartTime">
            {{formValidate.amStartTime}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下午开考时间" prop="pmStartTime">
            {{formValidate.pmStartTime}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上午安检时间" prop="amCheckTime">
            {{formValidate.amCheckTime}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下午安检时间" prop="pmCheckTime">
            {{formValidate.pmCheckTime}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <div v-if="formValidate.zyPlanProcessList.length > 0">
            <el-tabs v-model="activeName" type="card" >
              <el-tab-pane v-for="(item,index) in formValidate.zyPlanProcessList" :key="item" :label="(conductDate(item.startItemDate, 'yyyy-MM-dd') + '~' + conductDate(item.endItemDate, 'yyyy-MM-dd'))" :name="'active' + index" ></el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
      <el-row v-for="(item,firstIndex) in formValidate.zyPlanProcessList" :key="item" style="border:1px solid #ccc; padding:12px 10px; margin-top:12px;" v-if="activeName == ('active' + firstIndex )">
        <el-row>
          <el-col :span="20">
            <el-form :model="item" ref="zyPlanProcessList" :rules="rules.physicianRules">
              <el-form-item label="考试日期" prop="startDate" style="position:relative;">
                <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                {{item.startItemDate}}至 {{item.endItemDate}}
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row style="border:1px solid #ccc; padding:12px 0px; margin-top:12px;" v-for="(list,secondIndex) in item.zyPlanProcessStationList" :key="list">
          <el-row style="padding-left:10px;">
            <el-col :span="8">
              <el-form :model="item" ref="zyPlanProcessStationList" :rules="rules.physicianListRules">
                <el-form-item label="考站名称" prop="stationName" style="position:relative;">
                  <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                  {{list.stationName}}
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8">
              <el-form :model="item" ref="zyPlanProcessStationList" :rules="rules.physicianListRules">
                <el-form-item label="真实考站" prop="isStation" style="position:relative;">
                  <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                  {{list.isStation == 'YES' ? '是' : '否'}}
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <!--真实考站为否的时候，可以把 候考室、考试时长、考试形式这三个字段给隐藏掉-->
          <el-row style="padding-left:10px;" v-if="list.isStation == 'YES'">
            <el-col :span="8">
              <el-form :model="item" ref="zyPlanProcessStationList" :rules="rules.physicianListRules">
                <el-form-item label="候考室" style="position:relative;">
                  <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                  <span v-for="(waitList,waitIndex) in list.zyPlanProcessStationWaitList" :key="waitList">{{ waitIndex == list.zyPlanProcessStationWaitList.length - 1 ? waitList.roomNum : (waitList.roomNum + ',')}}</span>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8">
              <el-form :model="item" ref="zyPlanProcessStationList" :rules="rules.physicianListRules" style="position:relative;">
                <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                <el-form-item label="考试时长" prop="timeLong">
                  {{list.timeLong}} min
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row style="padding-left:10px;">
            <el-col :span="8">
              <el-form :model="item" ref="zyPlanProcessStationList" :rules="rules.physicianListRules">
                <el-form-item label="需要考官" prop="isExaminer" style="position:relative;">
                  <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                  {{list.isExaminer == 'YES' ? '是' : '否'}}
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8" v-if="list.isExaminer == 'YES'">
              <el-form :model="item" ref="zyPlanProcessStationList" :rules="rules.physicianListRules">
                <el-form-item label="每考室所需考官" prop="examinerNum" style="position:relative;">
                  <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                  {{list.examinerNum}} 人
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8" v-if="list.isStation == 'YES'">
              <el-form :model="item" ref="zyPlanProcessStationList" :rules="rules.physicianListRules">
                <el-form-item label="考试形式" prop="examForm" style="position:relative;">
                  <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                  {{list.examForm == 'PC' ? '批次' : '个人'}}
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row>
            <el-table
              border
              align="center"
              :data="list.zyPlanProcessStationWaitRoomList"
              stripe
              tooltip-effect="dark"
              highlight-current-row
              style="width: 96%; margin-left:2%">
              <el-table-column prop="year" label="考室名称" show-overflow-tooltip>
                <template scope="scope">
                  <el-form :model="scope.row" ref="datasLists">
                    <el-form-item prop="stationRoomName" style="margin-bottom:0px;">
                      {{scope.row.stationRoomName}}
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="level" label="房间号" show-overflow-tooltip>
                <template scope="scope">
                  <el-form :model="scope.row" ref="datasLists">
                    <el-form-item prop="roomNum" style="margin-bottom:0px;">
                      {{scope.row.roomNum}}
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-row>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  /* 当前组件必要引入 */
  import rules from './rules';
  // 当前组件引入全局的util
  let Util = null
  export default {
    name: '',
    props:['operailityData'],
    data () {
      return {
        rules:rules,
        formValidate:{
          planName:'', // 考室名称
          startDate:'', // 开始时间
          endDate:'', // 结束时间
          amStartTime:'' , // 上午开考时间
          pmStartTime:'', // 下午开考时间
          amCheckTime:'', // 上午安检时间
          pmCheckTime:'', // 下午安检时间
          status:'', // 考核状态
          zyPlanProcessList:[{
            startItemDate:'', // 开始日期
            endItemDate:'', // 结束日期
            zyPlanProcessStationList:[{
              stationName:'', // 考站名称
              timeLong:'', // 考试时长
              isExaminer:'YES', // 是否需要考官
              examinerNum:'', // 考官人数
              examForm:'PC', // 考试形式
              isStation:'YES', // 是否考站
              zyPlanProcessStationWaitList:[],
              zyPlanProcessStationWaitRoomList:[{
                roomNum:'',
                roomId:"房间id",
                floor:"楼层",
                // processRoomId:'', // 考站id
                stationRoomName:'', // 考室名称
              }],
            }],
          }],
        },
        // 获取数据
        dataTitle:{
          ajaxSuccess:'getData',
          ajaxParams:{
            url:'/zyPlan/get/' + (this.operailityData ? this.operailityData.planId : ''),
          },
        },
        activeName:'active0'
      }
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util;
        this.ajax(this.dataTitle);
      },
      // 获取编辑的数据
      getData(res){
        if(res.data){
          for(let i in this.formValidate){
            this.formValidate[i] = res.data[i];
          }
          if(this.formValidate.zyPlanProcessList.length > 0) {
            this.formValidate.zyPlanProcessList.map((item, index) => {
              item.startItemDate = item.startDate;
              item.endItemDate = item.endDate;
              delete item.startDate;
              delete item.endDate;
              if (item.zyPlanProcessStationList.length > 0) {
                item.zyPlanProcessStationList.map((list) => {
                  list.timeLong = parseInt(list.timeLong/60);  // 保存成秒
                });
              }
            });
          }
        }
      },
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {},
  }

</script>
