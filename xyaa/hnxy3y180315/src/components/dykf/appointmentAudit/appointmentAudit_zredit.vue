<template>
  <div>
    <el-form
      :model="datatable"
      ref=" datatable"
      class="demo-form-inline"
      label-width="110px"
    >
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="预约名称" prop="name" class="  ">
            <!-- <el-input v-model=" datatable.name" placeholder="请输入"></el-input> -->
            {{datatable.name}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="申请单位" prop="company" class="  ">
            <!-- <el-input v-model=" datatable.company" placeholder="请输入"></el-input> -->
            {{datatable.company}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="申请部门" prop="department" class="  ">
            <!-- <el-input v-model=" datatable.department" placeholder="请输入"></el-input> -->
            {{datatable.department}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item
            name="start"
            label="申请使用时间"
            labelWidth="110px"
            class="   pmStartDateBox"
            prop="useDate"
          >
            <!-- <el-date-picker v-model=" operailityData.useDate" type="date" :editable="false" placeholder="选择日期"
                              :picker-options="pickerOptions0" @change="handleStartTime">
            </el-date-picker>-->
            <!-- <el-date-picker v-model=" datatable.useDate" type="datetime" placeholder="选择日期时间"></el-date-picker> -->
            {{datatable.useDate}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="使用类型" prop="usetype" class="  ">
            {{datatable.usetype}}
            <!-- <el-input v-model=" operailityData.usetype" placeholder="请输入"></el-input> -->
            <!-- <el-select v-model=" datatable.usetype" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="预约对象" prop="reception" class="  ">
            <!-- <el-input v-model=" datatable.reception" placeholder="请输入"></el-input> -->
            {{datatable.reception}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="预约事由" prop="cause" class="  ">
            <!-- <el-input v-model=" datatable.cause" type="textarea" :rows="5" resize="none"></el-input> -->
            {{datatable.cause}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2" v-if="datatable.usetype === 'KH'">
          <el-form-item label="预约项数" prop="reserveNum" class="  ">
            <!-- <el-input v-model=" datatable.reserveNum" placeholder="请输入"></el-input> -->
            {{datatable.reserveNum}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="预约人数" prop="userNum" class="  ">
            <!-- <el-input v-model=" datatable.userNum" placeholder="请输入"></el-input> -->
            {{datatable.userNum}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="分组数量" prop="title" class="  ">
            <!-- <el-input v-model=" datatable.group" placeholder="请输入"></el-input> -->
            {{datatable.group}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="每组人数" prop="title" class="  ">
            <!-- <el-input v-model=" datatable.groupNumber" placeholder="请输入"></el-input> -->
            {{datatable.groupNumber}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="房间数量" prop="roomNum" class="  ">
            <!-- <el-input v-model=" datatable.roomNum" placeholder="请输入"></el-input> -->
            {{datatable.roomNum}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <!-- <el-form-item label="每组人数" prop="title" class="  ">
            <el-input placeholder="请输入"></el-input>
          </el-form-item>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="房间要求" prop="roomRequire" class="  ">
            <!-- <el-input v-model=" datatable.roomRequire" type="textarea" :rows="5" resize="none"></el-input> -->
            {{datatable.roomRequire}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="需协助具体事宜" prop="explains" class="  ">
            <!-- <el-input v-model=" datatable.coordinate" type="textarea" :rows="5" resize="none"></el-input> -->
            {{datatable.coordinate}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="用物清单" class="  ">
            <!-- <upload-file
              :size="500*1024"
              @setUploadFiles="setMultimediaFileIds"
              downServer="/server/"
            ></upload-file> -->
            <upload-file v-if="datatable.fileList && datatable.fileList.length" :size="500*1024" :uploadFiles="datatable.fileList||[]"
                         @setUploadFiles="setUploadFiles" :show="true" style="width:250px;"></upload-file>
            <span v-else>暂无附件</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="申请人" prop="applicant" class="  ">
            <!-- <el-input v-model=" datatable.applicant" placeholder="请输入"></el-input> -->
            {{datatable.applicant}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="联系电话" prop="phone" class="  ">
            <!-- <el-input v-model=" datatable.phone" placeholder="请输入"></el-input> -->
            {{datatable.phone}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="备注" prop="explains" class="  ">
            <!-- <el-input v-model=" datatable.remarks" type="textarea" :rows="5" resize="none"></el-input> -->
            {{datatable.remarks}}
          </el-form-item>
        </el-col>
      </el-row>
      <hr>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="审批状态" prop class="  ">
            <el-radio class="radio" v-model="radio" label="TG">通过</el-radio>
            <el-radio class="radio" v-model="radio" label="BH">驳回</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="审批意见" prop="" class="  " required>
            <el-input type="textarea" v-model="reviewMess" :rows="5" resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="房间分配" prop="" class="  ">
            <div v-for="a in roomLists"> {{a.roomNum}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="耗材分配" prop="" class="  ">
            <div v-for="a in datatable.consumablesList"> {{a.consumableName}}({{ a.consumableNumber}})</div>
          </el-form-item>
        </el-col>
      </el-row>
       <hr>
       <el-row>
        <el-col :span="24" :offset="3">
            <h2>申请/审核历史情况</h2>
          <!-- <el-form-item label="申请/审核历史情况" prop="" class="  ">
          </el-form-item> -->
        </el-col>
      </el-row>
      <el-row>
          <el-col :span="18" :offset="3">
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="createUserName"
                    label="申请人/审批人"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="type"
                    label="流程节点"
                    width="180">
                         <template scope="scope">{{reassign(scope.row.type)}}</template>
                    </el-table-column>
                    <el-table-column
                    prop="createTime"
                    label="申请/审批时间">
                     <template scope="scope">{{conductDate(scope.row.createTime)}}</template>
                    </el-table-column>
                    <el-table-column
                    prop="spState"
                    label="状态">
                        <template scope="scope">{{reassign(scope.row.spState)}}</template>
                    </el-table-column>
                </el-table>
          </el-col>
          
      </el-row>
    </el-form>
    <el-row>
        <el-col :span="5" :offset="20">
          <el-button :plain="true" type="info" @click="submission">保存</el-button>
        </el-col>
      </el-row>
    
  </div>
</template>
<script>
let Util = null;
import api from './api';
import {formatDate} from './date.js';
export default {
  props: ["operailityData"],
  data() {
    return {
      radio: "TG",
      checked: true,
      datatable:{},
      formValidate:{},
      editType: "edit",
      reviewMess:'',
      roomLists:[],
     tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
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
      addMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'editSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.zraudit.path + this.operailityData.id,
            method: api.zraudit.method
          }
        },
    };
  },
  methods: {
    init() {
      Util = this.$util;
      // console.log("页面加载");
    //   calendarSet.setCalData([]);
      // console.log(this.operailityData);
    //   console.log(this.querySee);
      this.ajax({
          ajaxSuccess: "listDataSuccess",
          ajaxParams:{
                url: api.see.path + this.operailityData.id,
                method: api.see.method
          }
      })
    },
    listDataSuccess(res){ 
        res.data.fileList.map(i=>{
          i.name = i.oldName
        })
        this.datatable = res.data
        let roomLists = [];
        res.data.roomList.map(ietm => {
            // console.log(ietm.roomNum)
            this.$util._.map(ietm.openTimeList, (items, key) => {
                // console.log(ietm.roomNum)
                // console.log(key , items)
                roomLists.push({
                    roomNum:ietm.roomNum + ' ('+items.date+' '+ items.startTime+'-'+items.endTime+')',
                })
            })
        })

        this.roomLists = roomLists;
        this.datatable = res.data
        this.tableData = res.data.userReviewList
        // this.tableData.map((em ,ke)=>{
        //     console.log(em,ke)
        //     // console.log(formatDate(new Date(this.tableData[ke].createTime), 'yyyy-MM-dd hh:mm'))
        //     this.tableData[ke].createTime = formatDate(new Date(this.tableData[ke].createTime), 'yyyy-MM-dd hh:mm')
        //     // this.tableData[ke].createTime
        // })
      //  console.log(this.tableData)
        // console.log( formatDate(new Date(1554262854002), 'yyyy-MM-dd hh:mm'))
    },
    //保存提交审核
    submission(){
        // console.log(this.reviewMess)
        // console.log(this.radio)
        // console.log(this.operailityData.id)
        this.formValidate.status = this.radio
        this.formValidate.id = this.operailityData.id
        this.formValidate.reviewMess = this.reviewMess
        // console.log('______________________')
        // console.log(this.formValidate)
        // console.log('______________________')
        if (this.formValidate.reviewMess == '') {
            this.errorMess('请填写审核意见');
            return false;
          }
        // this.ajax({
        //     ajaxSuccess: 'ajaxSuccess',
        //     ajaxError: 'ajaxError',
        //     ajaxParams:{
        //             url: api.zraudit.path,
        //             method: api.zraudit.method,
        //             data:{
        //                 id:this.operailityData.id,
        //                 status:'TG',
        //                 reviewMess:this.reviewMess
        //             }
        //     }
        // })
        this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
        // console.log(this.addMessTitle)
          this.ajax(this.addMessTitle)
          

    },
    editSuccess(res){
      // console.log(res)
      // console.log(this.operailityData.status)
      // this.datatable.status = 'TG'
      if (this.radio == 'BH') {
          this.datatable.status = 'BH'
          this.$emit("edit", this.editType);
        }else{
          this.datatable.status = 'TG'
          this.$emit("edit", this.editType);
        }
      // this.$emit("cancel", this.editType);
    },
    /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
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
                case "DWKFYYSB":
                return "上报";
                default:
                break;
            }
        },
    // 处理时间戳 转换为时间格式
    timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();
        return Y+M+D+h+m+s;
    }
  },
  components: {
  },
  created() {
    this.init();
  }
};
</script>

