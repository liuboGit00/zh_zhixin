<!--
****--@file     physicianPlan_create
****--@date     2019-02-15 9:41
****--@author   YC
****--@describe 新建
-->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" class="demo-form-inline" label-width="110px" :rules="rules.physicianPlanRules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="场次名称" prop="planName">
            <el-input v-model="formValidate.planName" placeholder="输入场次名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startDate">
            <el-date-picker
              v-model="formValidate.startDate"
              type="date"
              :editable="false"
              placeholder="选择开始时间"
              :clearable="true"
              :picker-options="pickerOptions0"
              @change="handleStartTime"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endDate">
            <el-date-picker
              v-model="formValidate.endDate"
              align="left"
              type="date"
              :clearable="true"
              :editable="false"
              placeholder="选择结束时间"
              :picker-options="pickerOptions1"
              @change="handleEndTime">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上午开考时间" prop="amStartTime">
            <el-time-picker
              format="HH:mm"
              v-model="formValidate.amStartTime"
              :picker-options="{
                selectableRange: '08:00:00 - 12:00:00'
              }"
              placeholder="选择上午时间">
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下午开考时间" prop="pmStartTime">
            <el-time-picker
              format="HH:mm"
              v-model="formValidate.pmStartTime"
              :picker-options="{
                selectableRange: '12:00:00 - 18:00:00'
              }"
              placeholder="选择下午时间">
            </el-time-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上午安检时间" prop="amCheckTime">
            <el-time-picker
              format="HH:mm"
              v-model="formValidate.amCheckTime"
              :picker-options = "{
                selectableRange: `00:00:00 - ${getMinuteSecond(formValidate.amStartTime) ? (getMinuteSecond(formValidate.amStartTime) + ':00') : '12:00:00'}`
              }"
              placeholder="选择上午时间">
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下午安检时间" prop="pmCheckTime">
            <el-time-picker
              format="HH:mm"
              v-model="formValidate.pmCheckTime"
              :picker-options = "{
                selectableRange: `00:00:00 - ${getMinuteSecond(formValidate.pmStartTime) ? (getMinuteSecond(formValidate.pmStartTime) + ':00') : '18:00:00'}`
              }"
              placeholder="选择下午时间">
            </el-time-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <div v-if="formValidate.zyPlanProcessList.length > 0">
            <el-tabs v-model="activeName" type="card" >
              <el-tab-pane v-for="(item,index) in formValidate.zyPlanProcessList" :key="item" :label="(conductDate(item.startDate, 'yyyy-MM-dd') + '~' + conductDate(item.endDate, 'yyyy-MM-dd'))" :name="'active' + index" ></el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" @click="addTime" size="small">添加</el-button>
        </el-col>
      </el-row>
      <el-row v-for="(item,firstIndex) in formValidate.zyPlanProcessList" :key="item" style="border:1px solid #ccc; padding:12px 10px; margin-top:12px;" v-if="activeName == ('active' + firstIndex )">
        <el-row>
          <el-col :span="20">
            <el-form :model="item" ref="zyPlanProcessList" :rules="rules.physicianRules">
              <el-form-item label="考试日期" prop="startDate" style="position:relative;">
                <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                <el-date-picker
                  v-model="item.startDate"
                  type="date"
                  placeholder="选择开始时间"
                  :clearable="true"
                  style="width: 130px"
                >
                </el-date-picker>至
                <el-date-picker
                  v-model="item.endDate"
                  align="left"
                  type="date"
                  :clearable="true"
                  placeholder="选择结束时间"
                  style="width: 130px"
                  >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" align="right">
            <el-button type="primary" @click="deleteFirst(firstIndex)" size="small">删除</el-button>
            <el-button type="primary" @click="addSecond(firstIndex)" size="small">添加</el-button>
          </el-col>
        </el-row>
        <el-row style="border:1px solid #ccc; padding:12px 0px; margin-top:12px;" v-for="(list,secondIndex) in item.zyPlanProcessStationList" :key="list">
          <el-row style="padding-left:10px;">
            <el-col :span="8">
              <el-form :model="item" ref="zyPlanProcessStationList" :rules="rules.physicianListRules">
                <el-form-item label="考站名称" prop="stationName" style="position:relative;">
                  <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                  <el-input v-model="list.stationName" placeholder="输入考站名称" style="width:120px;"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8">
              <el-form :model="item" ref="zyPlanProcessStationList" :rules="rules.physicianListRules">
                <el-form-item label="真实考站" prop="isStation" style="position:relative;">
                  <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                  <el-radio-group v-model="list.isStation">
                    <el-radio label="YES">是</el-radio>
                    <el-radio label="NO">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8">
              <el-button @click="deleteSecond(firstIndex,secondIndex)" type="primary" size="small">删除</el-button>
            </el-col>
          </el-row>
          <!--真实考站为否的时候，可以把 候考室、考试时长、考试形式这三个字段给隐藏掉-->
          <el-row style="padding-left:10px;" v-if="list.isStation == 'YES'">
            <el-col :span="8">
              <el-form :model="item" ref="zyPlanProcessStationList" :rules="rules.physicianListRules">
                <el-form-item label="候考室" style="position:relative;">
                  <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                  <div style="width:80%; height:auto; line-height:20px;"><span v-for="(waitList,waitIndex) in list.zyPlanProcessStationWaitList" :key="waitList">{{ waitIndex == list.zyPlanProcessStationWaitList.length - 1 ? waitList.roomNum : (waitList.roomNum + ',')}}</span></div>
                  <el-button type="primary" size="small" @click="openStationWait(firstIndex,secondIndex)">+</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8">
              <el-form :model="item" ref="zyPlanProcessStationList" :rules="rules.physicianListRules">
                <el-form-item label="考试时长" prop="timeLong" style="position:relative;">
                  <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                  <el-input v-model="list.timeLong" placeholder="考试时长" style="width:100px;"></el-input> min
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row style="padding-left:10px;">
            <el-col :span="8">
              <el-form :model="item" ref="zyPlanProcessStationList" :rules="rules.physicianListRules">
                <el-form-item label="需要考官" prop="isExaminer" style="position:relative;">
                  <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                  <el-radio-group v-model="list.isExaminer">
                    <el-radio label="YES">是</el-radio>
                    <el-radio label="NO">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8" v-if="list.isExaminer == 'YES'">
              <el-form :model="item" ref="zyPlanProcessStationList" :rules="rules.physicianListRules">
                <el-form-item label="每考室所需考官" prop="examinerNum" style="position:relative;">
                  <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                  <el-input v-model="list.examinerNum" placeholder="人数" style="width:100px;"></el-input> 人
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8" v-if="list.isStation == 'YES'">
              <el-form :model="item" ref="zyPlanProcessStationList" :rules="rules.physicianListRules">
                <el-form-item label="考试形式" prop="examForm" style="position:relative;">
                  <span style="position:absolute; left:-10px; top:1px; color:#ff4949">*</span>
                  <el-radio-group v-model="list.examForm" @change="selectExamForm(firstIndex,secondIndex)">
                    <el-radio label="PC">批次</el-radio>
                    <el-radio label="GR">个人</el-radio>
                  </el-radio-group>
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
              <el-table-column label="操作" align="center">
                <template scope="scope">
                  <el-button v-if="scope.$index == (list.zyPlanProcessStationWaitRoomList.length -1)" size="small" type="primary" @click="singleAdd(firstIndex,secondIndex)">新增</el-button>
                  <el-button size="small" type="primary" @click="singleDelete(firstIndex,secondIndex,scope.$index)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="year" label="考室名称" show-overflow-tooltip>
                <template scope="scope">
                  <el-form :model="scope.row" ref="datasLists">
                    <el-form-item prop="stationRoomName" style="margin-bottom:0px;">
                      <el-input v-model="scope.row.stationRoomName" placeholder="输入名称" @focus="getCurrentIndex(firstIndex,secondIndex,scope.$index)"></el-input>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="level" label="房间号" show-overflow-tooltip>
                <template scope="scope">
                  <el-form :model="scope.row" ref="datasLists">
                    <el-form-item prop="roomNum" style="margin-bottom:0px;">
                      <div style="width:100%; position:relative;">
                        <el-input readonly placeholder="选择房间号" v-model="scope.row.roomNum" style="width:90%"></el-input>
                        <el-button size="small" type="primary" style="position:absolute;right:-10px;top:3px;" @click="selectRoom(firstIndex,secondIndex,scope.$index)">+</el-button>
                      </div>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-row>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-col :span="24" align="center">
          <el-button class="but-col" type="primary" @click="saveBtn">保存</el-button>
          <el-button class="but-col" type="primary" @click="cancleBtn">取消</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 选择房间 -->
    <Modal :mask-closable="false" v-model="selectRoomModal" class-name="vertical-center-modal"
           :width="1000">
      <modal-header slot="header" :content="selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" @cancel="selectRoomModal=false" @select="selectRoomCall" :roomType="roomType" :select="selectRoomList" :selectFloor="selectFloor" :selectHoukao="selectHoukao"></select-room>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /* 当前组件必要引入 */
  import rules from './rules';
  import selectRoom from './physicianPlan_selectRoom';
  // 当前组件引入全局的util
  let Util = null
  export default {
    name: '',
    props:['type','operailityData'],
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
            startDate:'', // 开始日期
            endDate:'', // 结束日期
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
        currentIndexF:0,
        currentIndexS:0,
        currentIndexT:0,
        // 选择房间
        selectRoomModal: false,
        selectRoomId:{
          id:'selectRoomId',
          title:'选择房间',
        },
        // 保存数据的接口
        saveTitle:{
          ajaxSuccess:'saveDate',
          ajaxParams:{
            jsonString:true,
            url:'/zyPlan/add',
            method: 'post',
            data: {},
          }
        },
        // 获取数据
        dataTitle:{
          ajaxSuccess:'getData',
          ajaxParams:{
            url:'/zyPlan/get/',
          },
        },
        // 修改数据
        modifyTitle:{
          ajaxSuccess:'saveDate',
          ajaxParams:{
            jsonString:true,
            url:'/zyPlan/modify/' + (this.operailityData ? this.operailityData.planId : ''),
            method: 'put',
            data: {},
          }
        },
        roomType:'houkao', // 选择房间或者候考室
        selectRoomList:[],
        selectFloor:'', // 选择的楼层
        selectHoukao:[], // 选择的候考室
        activeName:'active0',
      }
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util;
        if(this.type == 'edit'){ // 编辑状态
          this.formValidate.planId = this.operailityData ? this.operailityData.planId : '';
          this.dataTitle.ajaxParams.url = '/zyPlan/get/' + (this.operailityData ? this.operailityData.planId : '');
          this.ajax(this.dataTitle);
        }
      },
      /********************* 点击事件 *********************/
      // 点击添加时间
      addTime(){
        this.formValidate.zyPlanProcessList.push({
          startDate:'', // 开始日期
          endDate:'', // 结束日期
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
        });
        this.currentIndexF = this.formValidate.zyPlanProcessList.length - 1;
        this.activeName = 'active' + this.currentIndexF;
      },
      // 第二层添加
      addSecond(firstIndex){
        this.currentIndexF = firstIndex;
        this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList.push({
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
        });
        this.currentIndexS = this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList.length - 1;
      },
      // 单个添加
      singleAdd(firstIndex,secondIndex){
        this.currentIndexF = firstIndex;
        this.currentIndexS = secondIndex;
        this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitRoomList.push({
          roomNum:'',
          roomId:"房间id",
          floor:"楼层",
          // processRoomId:'', // 考站id
          stationRoomName:'', // 考室名称
        });
        this.currentIndexT = this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitRoomList.length -1;
      },
      // 第一层删除
      deleteFirst(firstIndex){
        if(this.formValidate.zyPlanProcessList.length == 1){
          this.errorMess('必须要保留一条数据');
          return;
        }
        this.formValidate.zyPlanProcessList.splice(firstIndex,1);
        this.activeName = 'active' + (this.formValidate.zyPlanProcessList.length - 1);
      },
      // 第二层删除
      deleteSecond(firstIndex,secondIndex){
        this.formValidate.zyPlanProcessList[firstIndex].zyPlanProcessStationList.splice(secondIndex,1);

      },
      // 单个删除
      singleDelete(firstIndex,secondIndex,index){
        this.currentIndexF = firstIndex;
        this.currentIndexS = secondIndex;
        if(this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitRoomList.length == 1){
          this.errorMess('必须要保留一条数据');
          return;
        }
        this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitRoomList.splice(index,1);
      },
      // 获取当前的下标
      getCurrentIndex(firstIndex,secondIndex,index){
        this.currentIndexF = firstIndex;
        this.currentIndexS = secondIndex;
        this.currentIndexT = index;
      },
      // 选择考试形式
      selectExamForm(firstIndex,secondIndex){
        this.currentIndexF = firstIndex;
        this.currentIndexS = secondIndex;
        // 取之前所有的候考室
        let allRoomList = [];
        // 去所有的个人候考室
        let grRoomList = [];
        this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList.map((item,index)=>{
          if(this.currentIndexS != index){
            if(item.zyPlanProcessStationWaitList && item.zyPlanProcessStationWaitList.length > 0){
              item.zyPlanProcessStationWaitList.map((list)=>{
                allRoomList.push(list.roomId);
                if(item.examForm == 'GR'){
                  grRoomList.push(list.roomId);
                }
              });
            }
          }
        });
        allRoomList = this.uniq(allRoomList); // 去重完所有的候考室

        // 当前候考室有数据
        let currentRoomList = [];
        if(this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitList.length > 0){
          let currentRoomList = [];
          this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitList.map((currentList)=>{
            currentRoomList.push(currentList.roomId);
          });
          if(this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].examForm == 'GR'){ // 选择的是个人
            let temp = allRoomList.concat(currentRoomList);
            if((this.uniq(temp)).length != (allRoomList.length + currentRoomList.length)){ // 说明有相同
              this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitList = [];
            }
            this.selectHoukao = allRoomList;
          }else{ // 批次
            let temp = grRoomList.concat(currentRoomList);
            if((this.uniq(temp)).length != (grRoomList.length + currentRoomList.length)){ // 说明有相同
              this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitList = [];
            }
            this.selectHoukao = grRoomList;
          }
        }else{
          if(this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].examForm == 'GR'){ // 选择的是个人
            this.selectHoukao = allRoomList;
          }else{ // 批次
            this.selectHoukao = grRoomList;
          }
        }
      },
      // 选择候考室
      openStationWait(firstIndex,secondIndex){
        this.roomType = 'houkao';
        this.currentIndexF = firstIndex;
        this.currentIndexS = secondIndex;
        let selectHoukao = [];
        let selectRoomList = [];
        this.selectHoukao = [];
        // 取之前所有的候考室
        let allRoomList = [];
        // 去所有的个人候考室
        let grRoomList = [];
        let grRoomNum = []; // 获取考试形式是个人下面的房间号
        this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList.map((item,index)=>{
          if(this.currentIndexS != index){
            if(item.zyPlanProcessStationWaitList && item.zyPlanProcessStationWaitList.length > 0){
              item.zyPlanProcessStationWaitList.map((list)=>{
                allRoomList.push(list.roomId);
                if(item.examForm == 'GR'){
                  grRoomList.push(list.roomId);
                }
              });
            }
          }
          if(item.examForm == 'GR'){
            item.zyPlanProcessStationWaitRoomList.map((list)=>{
              if(list.roomId){
                grRoomNum.push(list.roomId);
              }
            });
          }
        });
        allRoomList = this.uniq(allRoomList); // 去重完所有的候考室
        // 当前候考室有数据
        let currentRoomList = [];
        if(this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitList.length > 0){
          let currentRoomList = [];
          this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitList.map((currentList)=>{
            currentRoomList.push(currentList.roomId);
          });
          if(this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].examForm == 'GR'){ // 选择的是个人
            let temp = allRoomList.concat(currentRoomList);
            if((this.uniq(temp)).length != (allRoomList.length + currentRoomList.length)){ // 说明有相同
              this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitList = [];
            }
            selectHoukao = allRoomList;
          }else{ // 批次
            let temp = grRoomList.concat(currentRoomList);
            if((this.uniq(temp)).length != (grRoomList.length + currentRoomList.length)){ // 说明有相同
              this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitList = [];
            }
            selectHoukao = grRoomList;
          }
        }else{
          if(this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].examForm == 'GR'){ // 选择的是个人
            selectHoukao = allRoomList;
          }else{ // 批次
            selectHoukao = grRoomList;
          }
        }
        if(this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitList.length > 0){
          let temp = [];
          this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitList.map((item)=>{
            temp.push(item.roomId);
          });
          selectRoomList =temp;
        }else{
          this.selectRoomList = [];
        }
        this.selectHoukao = selectHoukao.concat(grRoomNum);
        this.selectRoomList = selectRoomList;
        this.selectRoomId.title = '选择候考室';
        this.selectRoomModal = true;
      },
      // 选择房间号
      selectRoom(firstIndex,secondIndex,index){
        this.roomType = 'room';
        this.currentIndexF = firstIndex;
        this.currentIndexS = secondIndex;
        this.currentIndexT = index;
        this.selectFloor = '';
        this.selectRoomId.title = '选择房间';
        this.selectHoukao = [];
        let selectHoukao = [];
        let grRoomNum = []; // 获取考试形式是个人下面的房间号和候考室
        this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList.map((item,index)=>{
          if(this.currentIndexS != index){
            if(item.zyPlanProcessStationWaitList && item.zyPlanProcessStationWaitList.length > 0){
              item.zyPlanProcessStationWaitList.map((list)=>{
                if(item.examForm == 'GR'){
                  grRoomNum.push(list.roomId);
                }
              });
            }
          }
          if(item.examForm == 'GR'){
            item.zyPlanProcessStationWaitRoomList.map((list)=>{
              if(list.roomId){
                grRoomNum.push(list.roomId);
              }
            });
          }
        });

        if(this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].isStation == 'YES'){ // 是考站
          if(this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitList.length > 0){
            let temp = [];
            this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitList.map((item)=>{
              selectHoukao.push(item.roomId);
              temp.push(item.floor);
            });
            this.selectFloor =(this.uniq(temp)).join(',');
            if(this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitRoomList[this.currentIndexT].roomId){
              this.selectRoomList = [];
              this.selectRoomList.push(this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitRoomList[this.currentIndexT].roomId);
            }else{
              this.selectRoomList = [];
            }
            // 选择过的房间号要去掉
            this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitRoomList.map((selectedRoom,selectedIndex)=>{
              if(this.currentIndexT != selectedIndex){
                if(selectedRoom.roomId){
                  selectHoukao.push(selectedRoom.roomId);
                }
              }
            });
            this.selectHoukao = selectHoukao.concat(grRoomNum);
            this.selectRoomModal = true;
          }else{
            this.showMess('请先选择候考室')
          }
        }else{
          if(this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitRoomList[this.currentIndexT].roomId){
            this.selectRoomList = [];
            this.selectRoomList.push(this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitRoomList[this.currentIndexT].roomId);
          }else{
            this.selectRoomList = [];
          }
          // 选择过的房间号要去掉
          this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitRoomList.map((selectedRoom,selectedIndex)=>{
            if(this.currentIndexT != selectedIndex){
              if(selectedRoom.roomId){
                selectHoukao.push(selectedRoom.roomId);
              }
            }
          });
          this.selectHoukao = selectHoukao.concat(grRoomNum);
          this.selectRoomModal = true;
        }
      },
      // 点击--保存--按钮
      saveBtn(){
        let flag = true;
        let timesList = []; // 存储所有的考试时间
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          let formValidate = Util._.defaultsDeep({}, this.formValidate);
          formValidate = this.formDate(formValidate, ['startDate', 'endDate'], 'yyyy-MM-dd');
          formValidate = this.formDate(formValidate, ['amStartTime', 'pmStartTime','amCheckTime','pmCheckTime'], 'yyyy-MM-dd HH:mm');
          if(formValidate.amStartTime){
            formValidate.amStartTime = formValidate.amStartTime.split(' ')[1];
          }
          if(formValidate.pmStartTime){
            formValidate.pmStartTime = formValidate.pmStartTime.split(' ')[1];
          }
          if(formValidate.amCheckTime){
            formValidate.amCheckTime = formValidate.amCheckTime.split(' ')[1];
          }
          if(formValidate.pmCheckTime){
            formValidate.pmCheckTime = formValidate.pmCheckTime.split(' ')[1];
          }
          if(!formValidate.status){
            formValidate.status = 'UNPUBLISHED';
          }
          if(formValidate.zyPlanProcessList.length > 0){
            formValidate.zyPlanProcessList.map((item,index)=>{
              if(formValidate.planId){
                item.planId = formValidate.planId;
              }
              if(!(item.startDate && item.endDate)){
                flag = false;
                this.showMess('请完善第' + (index + 1) + '部分的考试时间');
                return;
              }
              item = this.formDate(item, ['startDate', 'endDate'], 'yyyy-MM-dd');
              timesList.push(item.startDate + '~' + item.endDate);
              if(item.zyPlanProcessStationList.length > 0){
                item.zyPlanProcessStationList.map((list,indexS)=>{
                  // 考站名称
                  if(!list.stationName){
                    flag = false;
                    this.errorMess('请完善第' + (index + 1) + '部分第' + (indexS + 1) + '个的考站名称');
                    return;
                  }
                  // 是否是真实考站
                  if(list.isStation == 'YES'){
                    // 候考室
                    if(list.zyPlanProcessStationWaitList.length == 0){
                      flag = false;
                      this.errorMess('请完善第' + (index + 1) + '部分第' + (indexS + 1) + '个的候考室');
                      return;
                    }
                    // 考试时长
                    if(!list.timeLong){
                      flag = false;
                      this.errorMess('请完善第' + (index + 1) + '部分第' + (indexS + 1) + '个的考试时长');
                      return;
                    }else{
                      if (!/^\+?[1-9]\d*$/.test(list.timeLong)) {
                        flag = false;
                        this.errorMess('第' + (index + 1) + '部分第' + (indexS + 1) + '个的考试时长必须正整数且大于零');
                      }
                    }
                    list.timeLong = list.timeLong * 60;  // 保存成秒
                  }
                  // 每考试需要考官
                  if(list.isExaminer == 'YES'){
                    if(!list.examinerNum){
                      flag = false;
                      this.errorMess('请完善第' + (index + 1) + '部分第' + (indexS + 1) + '个的每考试需要考官人数');
                      return;
                    }else{
                      if (!/^\+?[1-9]\d*$/.test(list.examinerNum)) {
                        flag = false;
                        this.errorMess('第' + (index + 1) + '部分第' + (indexS + 1) + '个每考室需要考官人数必须正整数且大于零');
                      }
                    }
                  }
                  // 具体考室名称
                  if(list.zyPlanProcessStationWaitRoomList.length > 0){
                    let stationRoomList = []; // 存储所有的考室名称
                    list.zyPlanProcessStationWaitRoomList.map((listT,indexT)=>{
                      // 考室名称
                      if(!listT.stationRoomName){
                        flag = false;
                        this.errorMess('请完善第' + (index + 1) + '部分第' + (indexS + 1) + '个第' + (indexT + 1) + '行的考室名称');
                        return;
                      }
                      // 房间号
                      if(!listT.roomNum){
                        flag = false;
                        this.errorMess('请完善第' + (index + 1) + '部分第' + (indexS + 1) + '个第' + (indexT + 1) + '行的房间号');
                        return;
                      }
                      stationRoomList.push(listT.stationRoomName);
                    });
                    if(this.isHaveSameArr(stationRoomList)){ // 考室名称是否有重复的
                      flag = false;
                      this.errorMess('第' + (index + 1) + '部分第' + (indexS + 1) + '个考室名称有重复的，请修改')
                      return;
                    }
                  }else{
                    flag = false;
                    this.errorMess('请完善第' + (index + 1) + '部分第' + (indexS + 1) + '个的具体考室信息');
                    return;
                  }
                });
              }else{
                flag = false;
                this.errorMess('请添加第' + (index + 1) + '部分具体的考场内容');
                return;
              }
            });
          }else{
            this.errorMess('请添加考场内容')
            return;
          }
          if(flag){
            if(this.compareDate(timesList,formValidate.startDate,formValidate.endDate)){ // 时间是否有重复的
              // if(!this.isHaveSameArr(stationRoomList)){ // 考室名称是否有重复的
                if(this.type == 'edit'){ // 修改
                  this.modifyTitle.ajaxParams.data = formValidate;
                  this.ajax(this.modifyTitle);
                }else{
                  this.saveTitle.ajaxParams.data = formValidate;
                  this.ajax(this.saveTitle);
                }
              // }else{
              //   this.errorMess('考室名称有重复的，请修改')
              //   return;
              // }
            }
          }
        }
      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
      },

      // 点击--取消--按钮
      cancleBtn(){
        if(this.type == 'edit'){
          this.$emit('cancel','edit');
        }else{
          this.$emit('cancel','create');
        }

      },
      // 选择房间
      selectRoomCall(data,type){
        if(type == 'houkao'){ // 候考室
          let temp = [];
          data.map((item)=>{
            temp.push({
              roomNum:item.roomNum,
              roomId:item.id,
              floor:item.floor
            });
          });
          this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitList = temp;
        }else{ // 房间
          this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitRoomList[this.currentIndexT].roomNum = data[0].roomNum;
          this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitRoomList[this.currentIndexT].roomId = data[0].id;
          this.formValidate.zyPlanProcessList[this.currentIndexF].zyPlanProcessStationList[this.currentIndexS].zyPlanProcessStationWaitRoomList[this.currentIndexT].floor = data[0].floor;
        }
        this.selectRoomModal = false;
      },
      /******************** end **************************/
      // 保存数据
      saveDate(res){
        if(this.type == 'edit'){
          this.$emit('create','edit','修改成功');
        }else{
          this.$emit('create','create','添加成功');
        }
      },
      // 获取编辑的数据
      getData(res){
        if(res.data){
          for(let i in this.formValidate){
            this.formValidate[i] = res.data[i];
          }
          if(this.formValidate.amStartTime){
            this.formValidate.amStartTime = '2019-05-10 ' + this.formValidate.amStartTime;
          }
          if(this.formValidate.pmStartTime){
            this.formValidate.pmStartTime = '2019-05-10 ' + this.formValidate.pmStartTime;
          }
          if(this.formValidate.amCheckTime){
            this.formValidate.amCheckTime = '2019-05-10 ' + this.formValidate.amCheckTime;
          }
          if(this.formValidate.pmCheckTime){
            this.formValidate.pmCheckTime = '2019-05-10 ' + this.formValidate.pmCheckTime;
          }
          if(this.formValidate.zyPlanProcessList.length > 0) {
            this.formValidate.zyPlanProcessList.map((item, index) => {
              if (item.zyPlanProcessStationList.length > 0) {
                item.zyPlanProcessStationList.map((list) => {
                  list.timeLong = parseInt(list.timeLong/60);  // 保存成秒
                });
              }
            })
          }
        }
      },

      // 判断时间是否连续
      compareDate (data,startDate,endDate) {
        let begin = [];
        let over = [];
        for(let i = 0; i < data.length; i ++){
          begin.push(data[i].split('~')[0]);
          over.push(data[i].split('~')[1]);
        }
        begin = begin.sort()
        over = over.sort()
        var flag = []
        if (begin.length > 1) {
          for (var i = 1; i < begin.length; i++) {
            if ((new Date(begin[i]) - new Date(over[i - 1])) /
              (1000 * 60 * 60 * 24) == 1 || over[i] == begin[i]) {
              flag.push('false')
            } else {
              flag.push('true')
            }
          }
        } else {
          flag.push('false')
        }
        var result = flag.some(function (value) {
          return value == 'true'
        })
        if (result == true) {
          this.errorMess('考试日期不连续或有重复时间,请重新选择时间!')
        }
        // 比较开始时间
        if ((new Date(begin[0])).getTime() < (new Date(startDate)).getTime()) {
          this.errorMess('设置的考试开始日期在设定开始日期之前，请重新选择！')
          result = true
        }
        // 比较结束时间
        if ((new Date(over[over.length - 1])).getTime() > (new Date(endDate)).getTime()) {
          this.errorMess('设置的考试结束日期在设定结束日期之后，请重新选择！')
          result = true
        }
        return !result
      },
      // 判断数组里面是否有重复的数据 有重复返回true；否则返回false
      isHaveSameArr(arr){
        return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f"+arr.join("\x0f\x0f") +"\x0f");
      },
      // 对数组进行去重
      uniq(array){
        let temp = []; //一个新的临时数组
        for(let i = 0; i < array.length; i++){
          if(temp.indexOf(array[i]) == -1){
            temp.push(array[i]);
          }
        }
        return temp;
      },
      // 获取时分秒
      getMinuteSecond(data){
        if(!data){
          return '';
        }
        let time = this.conductDate(data,'yyyy-MM-dd HH:mm');
        if(time){
          return time.split(' ')[1];
        }
      },
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {selectRoom,},
  }

</script>
