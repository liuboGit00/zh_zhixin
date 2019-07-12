<template>
  <div>
    <el-form
      :model="tableData"
      ref="tableData"
      class="demo-form-inline"
      label-width="110px"
    >
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="预约名称:" prop="name" class=" ">
            <!-- <el-input v-model=" operailityData.name" placeholder="请输入"></el-input> -->
            <div>{{tableData.name}}</div>
            
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="申请单位:" prop="company" class=" ">
            <!-- <el-input v-model=" operailityData.company" placeholder="请输入"></el-input> -->
            <div>{{tableData.company}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="申请部门:" prop="department" class=" ">
            <div>{{tableData.department}}</div>
            <!-- <el-input v-model=" operailityData.department" placeholder="请输入"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item
            name="start"
            label="申请使用时间:"
            labelWidth="110px"
            class="  pmStartDateBox"
            prop="useDate"
          >
            <!-- <el-date-picker v-model=" operailityData.useDate" type="date" :editable="false" placeholder="选择日期"
                              :picker-options="pickerOptions0" @change="handleStartTime">
            </el-date-picker>-->
            <!-- <el-date-picker v-model=" operailityData.useDate" type="datetime" placeholder="选择日期时间"></el-date-picker> -->
            <div>{{tableData.useDate}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="使用类型:" prop="usetype" class=" ">
            <!-- <el-input v-model=" operailityData.usetype" placeholder="请输入"></el-input> -->
            <!-- <el-select v-model=" operailityData.usetype" placeholder="请选择"> -->
              <!-- <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option> -->
              <div>{{ reassign(tableData.usetype)}}</div>
            <!-- </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="预约对象:" prop="reception" class=" ">
            <!-- <el-input v-model=" operailityData.reception" placeholder="请输入"></el-input> -->
            <div>{{tableData.reception}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="预约事由:" prop="cause" class=" ">
            <!-- <el-input v-model=" operailityData.cause" type="textarea" :rows="5" resize="none"></el-input> -->
            <div>{{tableData.cause}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2" v-if="tableData.usetype === 'KH'">
          <el-form-item label="预约项数:" prop="reserveNum"  class=" ">
            <!-- <el-input v-model=" operailityData.reserveNum" placeholder="请输入"></el-input> -->
            <div>{{tableData.reserveNum}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="预约人数:" prop="userNum" class=" ">
            <!-- <el-input v-model=" operailityData.userNum" placeholder="请输入"></el-input> -->
            <div>{{tableData.userNum}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="分组数量:" prop="title" class=" ">
            <!-- <el-input v-model=" operailityData.group" placeholder="请输入"></el-input> -->
            <div>{{tableData.group}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="每组人数:" prop="title" class=" ">
            <!-- <el-input v-model=" operailityData.groupNumber" placeholder="请输入"></el-input> -->
            <div>{{tableData.groupNumber}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="房间数量:" prop="roomNum" class=" ">
            <!-- <el-input v-model=" operailityData.roomNum" placeholder="请输入"></el-input> -->
            <div>{{tableData.roomNum}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <!-- <el-form-item label="每组人数" prop="title" class=" ">
            <el-input placeholder="请输入"></el-input>
          </el-form-item>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="房间要求:" prop="roomRequire" class=" ">
            <!-- <el-input v-model=" operailityData.roomRequire" type="textarea" :rows="5" resize="none"></el-input> -->
            <div>{{tableData.roomRequire}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="需协助具体事宜:" prop="explains" class=" ">
            <!-- <el-input v-model=" operailityData.coordinate" type="textarea" :rows="5" resize="none"></el-input> -->
            <div>{{tableData.coordinate}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="17" :offset="2">
          
            <el-form-item label="用物清单:" >
              <upload-file v-if="tableData.fileList && tableData.fileList.length" :size="500*1024" :uploadFiles="tableData.fileList||[]"
                         @setUploadFiles="setUploadFiles" :show="true"></upload-file>
            <span v-else>暂无附件</span>
            </el-form-item>
         
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="申请人:" prop="applicant" class=" ">
            <!-- <el-input v-model=" operailityData.applicant" placeholder="请输入"></el-input> -->
            <div>{{tableData.applicant}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="联系电话:" prop="phone" class=" ">
            <!-- <el-input v-model=" operailityData.phone" placeholder="请输入"></el-input> -->
            <div>{{tableData.phone}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="备注:" prop="explains" class=" ">
            <!-- <el-input v-model=" operailityData.remarks" type="textarea" :rows="5" resize="none"></el-input> -->
            <div>{{tableData.remarks}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <hr>
     
      <el-row v-if="radio=='ZRSP'" style="margin-top:25px;">
        <el-col :span="18" :offset="2">
          <el-form-item label="使用房间：">
            <!-- <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
            <div style="margin: 15px 0;"></div> -->
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
            </el-checkbox-group>
            <el-tag class="affairsSelectRoom" type="primary" @click.native="selectRoom">+选择房间</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="radio=='ZRSP'">
         <el-col :span="18" :offset="2">
          <el-form-item label="设置开放时间：" class="bespeakSettingTimeSlot">
            <el-checkbox-group v-model="allDayTimeSlot" @change="handleCheckedCitiesChange1" style="display: inline;">
              <el-checkbox v-for="(item,index) in timeSlot" :key="item.timeId" :label="index"
                           class="roomTimeSlot">
                <timeQuantum :index="index" :range="range" :data="item"></timeQuantum>
              </el-checkbox>
            </el-checkbox-group>
            <el-button class="roomTimeSlotAddBtn" type="text" @click="addTimeSlot">添加时间段</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="radio=='ZRSP'">
          <!-- <full-calendar :events="fcEvents" @event-selected='eventClick'  @dayClick="dayClick"  lang="zh"></full-calendar> -->
          <full-calendar ref="newCalendar" class="test-fc" :tpl="calendarSet.tpl"
                         :itemLimit="calendarSet.itemLimit"
                         :events="calendarSet.fcEvents" first-day='1'
                         locale="zh-cn" @changeMonth="changeMonth" @eventClick="eventClick"
                         @dayClick="dayClick"
                         @moreClick="moreClick"
                         @goPrev="goPrev" @goNext="goNext">
            <template slot="fc-header-left" scope="p">
              <span style="font-size: 16px;">{{monthTitle}}</span>
            </template>
            <template slot="fc-header-center" scope="p">
              <span v-if="false">周-历</span>
            </template>
            <template slot="fc-header-right" scope="p">
              <div style="float: right">
                <el-button-group>
                  <el-button type="primary" icon="arrow-left" @click="goPrev"></el-button>
                  <el-button type="primary" icon="arrow-right" @click="goNext"></el-button>
                </el-button-group>
              </div>
            </template>
            <template slot="fc-event-card" scope="p">
              <p>{{ p.event.title }}</p>
            </template>
          </full-calendar>
      </el-row>
      
      <el-row v-if="radio=='ZRSP'">
        <el-col :span="18" :offset="2">
          <el-form-item label="耗材选择：">
            
            
              <el-tag type="success" v-for="city in Consumables" :label="city" :key="city">{{city.consumableName}}</el-tag type="success">
           
            <el-tag class="affairsSelectRoom" type="primary" @click.native="selectHaocai">+耗材选择</el-tag>
          </el-form-item>
        </el-col>
      </el-row>

       <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="审批状态" prop class=" ">
            <el-radio class="radio" v-model="radio" label="ZRSP">通过</el-radio>
            <el-radio class="radio" v-model="radio" label="BH">驳回</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="审批意见" prop="" class=" " required>
            <el-input v-model="auditData.reviewMess" type="textarea" :rows="5" resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
        <el-col :span="5" :offset="20">
          <el-button :plain="true" type="primary" @click="submission">保存</el-button>
        </el-col>
      </el-row>
    
    <!-- 房间选择 -->
    <Modal
      :mask-closable="false"
      v-model="selectRoomModal"
      height="200"
      class-name="vertical-center-modal"
      :width="960"
    >
      <modal-header slot="header" :content="headerContent.selectRoomId"></modal-header>
      <select-room
        v-if="selectRoomModal"
        @cancel="cancel"
        @select="selectRoomCallback"
        :select="roomIds"
      ></select-room>
      <div slot="footer"></div>
    </Modal>
     <!-- 耗材选择 -->
    <Modal
      :mask-closable="false"
      v-model="haocaiModal"
      height="200"
      class-name="vertical-center-modal"
      :width="600"
    >
      <modal-header slot="header" :content="headerContent.haocaiId"></modal-header>
      <haoCai
        v-if="haocaiModal"
        @cancel="cancel"
        v-on:monitorSave="monitorSave"
      ></haoCai>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
let Util = null;
import api from './api';
// import Room from './appointmentAudit_room'
import selectRoom from "../../common/selectRoom.vue"; // 选择房间
import haoCai from './haoCai.vue'; //选择耗材
// import fullcalendar from '../../../components/common/fullcalendar.vue';
// 时间段插件
import timeQuantum from '../../common/timeQuantum.vue';
import fullCalendar  from 'vue-ambuf-fullcalendar';
//引入日历相关的配置
  import calendarSet from './calendarSet';

  import uploadPhotoWall from '../../common/uploadPhotoWall';

export default {
  props: ["operailityData"],
  data() {
    return {
      radio: "ZRSP",
      checked: true,
      value3: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      tableData: {},
      selectRoomModal: false,
      haocaiModal:false,
      headerContent: {
        selectRoomId: {
          id: "selectRoomId",
          title: "选择房间"
        },
        haocaiId:{
            id: "haocaiId",
          title: "耗材选择"
        }
      },
      roomIds: [],
      roomId: [],
      roomNums: [],
      roomList: [], // 已选房间
      item: [{
          start: '',
          end: '',
          time: ''
        }],
      formValidate: {
        affairName: "", // 事务名称
        startTime: "", // 接待开始时间
        endTime: "", // 接待结束时间
        receptionObject: "", // 接待对象
        affairType: "", // 事务类型
        peopleNum: "", // 人数
        isRoom: "YES", // 是否使用房间 YES是|NO否
        roomIds: "", // 房间id字符串
        roomNums: "", // 房间号字符串 多个id以逗号分隔
        trainingContent: "", // 事务描述
        fileIds: "", // 附件id字符串
         roomLists: [
          //
          {
            // roomId: "1",
            // roomNum: "101"
          }
        ],
        
         
      },
      options: [
        {
          value: "PX",
          label: "培训"
        },
        {
          value: "KH",
          label: "考核"
        },
        {
          value: "HY",
          label: "会议"
        },
        {
          value: "GZF",
          label: "工作坊"
        },
        {
          value: "QT",
          label: "其他"
        }
      ],
      checkAll: true,
      checkedCities: [],
      cities: [],

        Consumables:[],//接收耗材
      isIndeterminate: true,
      roomListss: [// 提交后台的RoomList
          //
          // {
          //   roomId: "",
          //   bearingCapacity: "",
          //   openTimeList: [
          //     {
          //       reserveSetType: "",
          //       date: "",
          //       startTime: "",
          //       endTime: ""
          //     },
          //     {
          //       reserveSetType: "",
          //       date: "",
          //       startTime: "",
          //       endTime: ""
          //     }
          //   ]
          // }
        ],
      range: [],
      editType: "edit",
      allDayTimeSlot: [],// 全天开放时间段(只记录索引)
      timeSlot: [{
          start: '',
          end: '',
          time: ''
        }], // 时间段
        // 周历
        calendarSet,
        monthTitle:'',
        openTimeList: {}, // 开放时间列表
        TimeList:[],
            // {
            //   "reserveSetType": "ROOM", // 预约设置类型
            //   "date": "2017-01-02", // 日期
            //   "timeSetIds": "1,2,3" // 时间段id字符串
            // },

        auditData:{},//提交审核数据表
        addMessTitle: {
          type:'edit',
          ajaxSuccess: 'ajaxSuccessSub',
          ajaxError: 'ajaxErrorSub',
          ajaxParams: {
            jsonString: true,
            url: api.audit.path,
            method: api.audit.method
          }
        },
    };
  },
  methods: {
    init() {
      Util = this.$util;
      // console.log("页面加载");
      calendarSet.setCalData([]);
      // this.monthTitle = new Date();
      // console.log(this.operailityData);
      if(this.operailityData){
              this.getData()
            }
    },
          getData(){
            let opt = {
              ajaxSuccess: "getShowDataSuccess",
              ajaxParams:{
                url:api.get.path + this.operailityData.id,
                method: api.get.method
              }
            };
            this.ajax(opt)
          },
          getShowDataSuccess(res){
              // console.log(res.data)
            // this.formValidate=res.data;
            // this.fileList=this.formValidate.roomList
            // let roomListss = [];
            // res.data.roomList.map(ietm => {
            //     // console.log(ietm.roomNum)
            //     this.$util._.map(ietm.openTimeList, (items, key) => {
            //         console.log(ietm.roomNum)
            //         console.log(key , items)
            //         roomListss.push({
            //             roomNum:ietm.roomNum + ' ('+items.date+' '+ items.startTime+'-'+items.endTime+')',
            //         })
            //     })
            // })
            //  this.fileList = roomListss
            res.data.fileList.map(i=>{
              i.name = i.oldName
            })
             this.tableData = res.data
            //  this.tableData.map(ietm =>{
            //    console.log(ie)
            //  })
            //  console.log(this.tableData)
          },
    // 文件上传
    setMultimediaFileIds(ids) {
      this.operailityData.fileIds = ids || "";
    },

    setUploadFiles(e){
      console.log(e)
    },
    getFormData(data) {
      let myData = Util._.defaultsDeep({}, data);
      return myData;
    },
    // 添加时间
    selectDate(){
        // console.log('1111')
    },
    selectRoom(e) {
      // console.log(e);
      this.openModel("selectRoom");
    },
    // 选择耗材
    selectHaocai(e) {
      // console.log(e);
      this.openModel("haocai");
    },
    openModel(options) {
      this[options + "Modal"] = true;
    },
    // 取消
    cancel(targer) {
      this[targer + "Modal"] = false;
    },
    // 选择房间
    selectRoomCallback(res) {
      let numss = {};
      res.map(item => {
        numss = item;
      });

      if (this.roomIds.indexOf(numss.id) == "-1") {
        this.roomIds.push(numss.id);
        this.roomNums.push(numss.roomNum);
        this.cities.push(numss.roomNum);
        this.formValidate. roomLists.push({
          roomId: numss.id,
          roomNum: numss.roomNum
        });
      }
        this.roomList = res;
      // console.log(this.formValidate.roomLists);
      this.cancel("selectRoom");
    },
    // 房间全选
    // handleCheckAllChange(event) {
    //   console.log(event);
    //   this.checkedCities = event.target.checked ? this.cities : [];
    //   this.isIndeterminate = false;
    // },
    // 房间非全选
    handleCheckedCitiesChange(value) {
      // console.log(this.formValidate. roomLists);
      this.formValidate. roomLists.map(item => {
        // console.log(item);
      });
      // console.log(value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
        // if (this.checkAll) {
        //     console.log(this.checkAll)
        // }
        let Arra = []
        // console.log(this.formValidate.roomLists)
        this.formValidate.roomLists.map(items => {
              //   console.log(items.roomNum);
               
              //  console.log( value.indexOf(items.roomNum))
               if (value.indexOf(items.roomNum) > -1) {
                   Arra.push({
                       roomNums:items.roomNum,
                       roomId:items.roomId,
                   })
               
               }
            }
        )
        // console.log(Arra);
        if (Arra.length >0) {
            this.roomListss =Arra
        }else{
          // console.log('未选房间')
          this.errorMess('至少选择一个房间');
          this.roomListss = []
        }
        // console.log(this.roomListss.length)
    },
    // 时间非全选
    handleCheckedCitiesChange1(value){
        // console.log(value)
        if (value.length == 0) {
          this.errorMess('至少选择一个时间段');
        }
    },
    // 添加时间段
      addTimeSlot () {
          // console.log('tianjia')
        this.timeSlot.push( // 开放时间段
          {
            start: '',
            end: '',
            time: ''
          });
      },
      /*********************************************************** 周历 ***********************************************/
      goPrev () {
        this.$refs['newCalendar'].goPrev();
      },
      goNext () {
        this.$refs['newCalendar'].goNext();
      },
    //   changeMonth (start, end, current, foramatData) {
    //     this.monthTitle = foramatData(current, 'MMMM YYYY');
    //     this.currMonth = this.conductDate(current, 'yyyy-MM');
    //   },
    // 选择月份
      changeMonth (start, end, current,foramatData) {
        this.monthTitle = foramatData(current, 'MMMM YYYY');
        this.currMonth = this.conductDate(current, 'yyyy-MM');
        // this.getMonthCourseSet.ajaxParams.params.yearMonth = this.currMonth
        // this.ajax(this.getMonthCourseSet)
        // this.monthTitle = foramatData(current, 'MMMM YYYY');
      //  console.log('changeMonth', start.format(), end.format(), current.format())
      },
      // 点击事件
      eventClick (info) {
        console.log('eventClick', event, jsEvent, pos)
        // console.log('eventClick', event, jsEvent, pos)
      },
      // 点击当天
      dayClick (day, jsEvent) {

          // console.log(this.roomListss)
        let date = (this.conductDate(day, 'yyyy-MM-dd')).toString();
        let allDayTimeSlot = this.$util._.defaultsDeep([], this.allDayTimeSlot);
        // console.log('date allDayTimeSlot',date,allDayTimeSlot)
        // console.log(this.allDayTimeSlot.length)
        if (this.openTimeList[date] && !this.allDayTimeSlot.length) {
          // console.log('没有选择时间')
          delete this.openTimeList[date]; // 如果当前日期没有选择时间段则删除此日期
        } else if (this.allDayTimeSlot.length) {
          // console.log('选择时间')
          let item;
          let timeSlot = [];
          this.roomListss.map(emit=>{
              // console.log(emit.roomNums)
              allDayTimeSlot.sort((a, b) => a < b).map(i => {
                item = this.timeSlot[i];
                // console.log(item)
                // 只有开始和结束时间都设置了才能设置对应的日期
                item._start && item._end && timeSlot.push('('+emit.roomNums+')'+item._time); // 选中的时间段
              });
            })
          // console.log(allDayTimeSlot)
          
          // console.log(timeSlot)
         if (timeSlot.length > '0') {
            // console.log('选择了时间')
            this.roomListss.map(emit=>{
              // console.log(emit.roomNums)
            })
              this.openTimeList[date] = {
                date,
                timeSlot
              };
          } else {
            delete this.openTimeList[date]
            // console.log('没有选择时间')
          }
          
        }
        this.setAllDayTimeSlot();
         
        //  if (jsEvent.target.children[0].innerHTML =) {
             
        //  }
        // jsEvent.target.children[1].innerHTML = '哈哈哈' 
      },
      // 设置日期对应的时间段
      setAllDayTimeSlot () {
       let data = this.openTimeList;
      //  console.log('++++++++++++++++++')
      //  console.log(data)
      //  console.log('++++++++++++++++++')
        let showData = [];
        let TimeList = []
        this.$util._.map(data, (item, key) => {
            
      //       console.log(item)
      //  console.log('++++++++++++++++++')
          if (item.timeSlot.length) {
            item.timeSlot.map(tItem => {
              showData.push({
                title: tItem,
                start: item.date,
                end: item.date
              });
              TimeList.push({
                   reserveSetType:"OPENROOM",
                    date:item.date,
                    startTime:tItem.split('-')[0],
                    endTime:tItem.split('-')[1]
              })
            });
          } else {
            delete data[key];
          }
        });
        // console.log(showData)
        // console.log(TimeList)
        
        let datas;
       
        
        // console.log(this.TimeList)
        // this.openTimeList.map(Items=>{
        //     console.log(Items)
        // })
        if (TimeList.length > 0) {
          let dataNum = [];
           TimeList.map((i,ke)=>{
              
            //  dataNum = i.date;
              // console.log(i,ke)
              // if (i === dataNum) {
              //   console.log("相等")
              // }
              dataNum = i
              datas = i
              this.TimeList.push(datas)
          })
          // console.log(this.TimeList)

            // 由于TimeList中的数组因用户选择房间数量的不同 从而出现重复值，对重复值进行比较筛选
            let result = [];
            let result1 = this.TimeList;
            let obj = {};
            for(let i =0; i<result1.length; i++){
              console.log(!obj[result1[i].date] , !obj[result1[i].startTime])
              if(!obj[result1[i].date] || !obj[result1[i].startTime]){
                  result.push(result1[i]);
                  obj[result1[i].date] = true;
              }
            }
            // console.log(result)
            // this.TimeList = [];
            // if (condition) {
              
            // }
            this.TimeList = result
          calendarSet.setCalData(showData);
        }else{
          this.TimeList = []
        }
      },
      checkData () {
        if (!this.formValidate.roomList.length) {
          this.errorMess('至少选择一个房间');
          return false;
        }
       
        if (this.formValidate.timeModel === 'ALL' && !this.allDayTimeSlot.length) { // 全天候
          this.errorMess('开放时间不能为空');
          return false;
        }
        return true;
      },
    //   haocaiSelect(){
    //       console.log('xuanzehaocai')
    //   },
        // 接收耗材数据
      monitorSave(data){
          // console.log(data)
          
          
          if (data== '取消') {
              this.Consumables = []
              this.cancel("haocai")
              return false;
          }else{
            if (data.length > 0) {
            if (data[0].consumableNumber) {
               this.Consumables = data || []
              
              this.cancel("haocai")
            }else{
              this.errorMess('未选则耗材');
              this.Consumables = []
              return false;
            }
             
          }else{
            this.errorMess('未选则耗材');
              this.Consumables = []
              return false;
          }
          }
      },
      //保存提交审核
      submission(){
        let isSubmit = this.submitForm('tableData')
        if (isSubmit) {
               let Datas = this.getFormData({
                    reviewMess:this.auditData.reviewMess,
                    id: this.operailityData.id,
                    status:'BH'
                  })
            let opt = {
                  type: 'edit' ,
                  successTitle: "修改成功!",
                  errorTitle: "修改失败!",
                  ajaxSuccess: "ajaxSuccessSub",
                  ajaxError: "ajaxError",
                  ajaxParams: {
                      jsonString: true,
                      url: api.audit.path,
                      method: api.audit.method,
                      data:Datas
                  }
                };
        
     
        
        

          // 根据不同状态提交不同数据
          if (this.radio == 'BH') {
            this.ajax(opt)
          } else {
            //   console.log(this.operailityData)
        //   console.log(this.roomListss)
          
            if (this.roomListss.length==0) {
              this.errorMess('房间未选择');
              return false;
            }
            console.log(this.TimeList)

            this.TimeList.map(em =>{
              console.log(em.startTime.split(")")[1])
              em.startTime = em.startTime.split(")")[1]
              
            })
            // console.log(this.TimeList)
            let roomList_sub = []
            let openTimeLists = this.TimeList // 接收房间匹配的选择日期
            // 由于TimeList中的数组因用户选择房间数量的不同 从而出现重复值，对重复值进行比较筛选 二次去重
            let result = [];
            let result1 = openTimeLists;
            let obj = {};
            console.log(result1)
            for(let i =0; i < result1.length; i++){
              console.log(!obj[result1[i].date] , !obj[result1[i].startTime])
              if(!obj[result1[i].date] || !obj[result1[i].startTime] || !obj[result1[i].endTime]){
                  result.push(result1[i]);
                  obj[result1[i].date] = true;
                  obj[result1[i].startTime] = true;
                  obj[result1[i].endTime] = true;
              }
            }
            console.log(result)
            openTimeLists  =  result;
              this.$util._.map(this.roomListss, (item, key) => {
            //   console.log('*******************')
            // console.log(this.Consumables)
            // console.log(this.TimeList)
              // console.log(key)
              // console.log(item)
              this.auditData.id = this.operailityData.id
              this.auditData.status = this.radio
              this.auditData.consumablesList = this.Consumables
              roomList_sub.push({
                  roomId:item.roomId,
                  bearingCapacity:'5',
                  openTimeList:openTimeLists
              })
              
            });
            // console.log(roomList_sub)
            this.auditData.roomList=roomList_sub

            this.addMessTitle.successTitle = '成功!';
            this.addMessTitle.errorTitle = '失败!';
            this.addMessTitle.ajaxParams.url = api.audit.path;
            this.addMessTitle.ajaxParams.data = this.getFormData(this.auditData);
          //   this.auditData.id = this.operailityData.id
          //   this.auditData.status = 'ZRSP'
          //   this.auditData.consumablesList = this.Consumables
            // console.log(this.getFormData(this.auditData))
            console.log(this.roomListss)
            if (typeof(this.auditData.reviewMess)=='undefined') {
              this.errorMess('请填写审核意见');
              return false;
            }
            if (this.auditData.reviewMess == '') {
              this.errorMess('请填写审核意见');
              return false;
            }
            if (this.TimeList.length == 0) {
              this.errorMess('请设置开放时间');
              return false;
            }
            if (this.Consumables.length == '0') {
              this.errorMess('请选择耗材');
              return false;
            }
            if (this.Consumables == '取消') {
              this.errorMess('请选择耗材');
              return false;
            }
            // console.log(this.addMessTitle)
            this.ajax(this.addMessTitle)
          }

        }
          // this.ajax(this.addMessTitle)
          // console.log(this.addMessTitle)
          // this.cancel("editModal")

      },
      ajaxSuccessSub(res){
        // console.log(res)
        // console.log(this.operailityData)
        if (this.radio == 'BH') {
          this.operailityData.status = 'BH'
          this.$emit("edit", this.editType);
        }else{
          this.operailityData.status = 'ZRSP'
          this.$emit("edit", this.editType);
        }
        
        
      },
      ajaxErrorSub(err){
        // console.log(err)
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

    /*
      * 点击提交按钮 监听是否验证通过
      * @param formName string  form表单v-model数据对象名称
      * @return flag boolean   form表单验证是否通过
      * */
      submitForm (formName) {
        // console.log(formName,'formName')
        let flag = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true
          }
        })
        return flag
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      // 查看更多
      moreClick (day, events, jsEvent) {
        // console.log('moreCLick', day, events, jsEvent)
        
      },
  },
  components: {
    // Room
    selectRoom,
    // 'full-calendar': require('vue-fullcalendar')	
    fullCalendar,
    timeQuantum,
    haoCai
  },
  created() {
    this.init();
  }
};
</script>
<style lang="scss">
  /* 预约项目管理 - 增加 */

  .events-week{
    //  min-height: 90px;
    width: 100%;
    height: 90px;
     top:-10px;
  }

</style>
