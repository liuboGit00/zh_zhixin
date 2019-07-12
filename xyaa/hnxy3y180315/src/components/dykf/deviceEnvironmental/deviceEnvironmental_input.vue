<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-form
      :model="formValidate"
      ref="formValidate"
      :rules="rules"
      class="demo-form-inline"
      label-width="110px"
    >
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="预约名称" prop="name" class="feildFontweight">
            <el-input v-model="formValidate.name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="申请单位" prop="company" class="feildFontweight">
            <el-input v-model="formValidate.company" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="申请部门" prop="department" class="feildFontweight">
            <el-input v-model="formValidate.department" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item
            name="start"
            label="申请使用时间"
            labelWidth="110px"
            class="feildFontweight pmStartDateBox"
            prop="useDate"
          >
            <!-- <el-date-picker v-model="formValidate.useDate" type="date" :editable="false" placeholder="选择日期"
                              :picker-options="pickerOptions0" @change="handleStartTime">
            </el-date-picker>-->
            <el-date-picker v-model="formValidate.useDate" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="使用类型" prop="usetype" class="feildFontweight">
            <!-- <el-input v-model="formValidate.usetype" placeholder="请输入"></el-input> -->
            <el-select v-model="formValidate.usetype" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="预约对象" prop="reception" class="feildFontweight">
            <el-input v-model="formValidate.reception" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="预约事由" prop="cause" class="feildFontweight">
            <el-input v-model="formValidate.cause" type="textarea" :rows="5" resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="预约项数" v-if="formValidate.usetype === 'KH'" prop="reserveNum" class="feildFontweight">
            <el-input v-model="formValidate.reserveNum" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="预约人数" prop="userNum" class="feildFontweight">
            <el-input v-model="formValidate.userNum" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="分组数量" prop="title" class="feildFontweight">
            <el-input v-model="formValidate.group" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="每组人数" prop="title" class="feildFontweight">
            <el-input v-model="formValidate.groupNumber" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="房间数量" prop="roomNum" class="feildFontweight">
            <el-input v-model="formValidate.roomNum" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <!-- <el-form-item label="每组人数" prop="title" class="feildFontweight">
            <el-input placeholder="请输入"></el-input>
          </el-form-item>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="房间要求" prop="roomRequire" class="feildFontweight">
            <el-input v-model="formValidate.roomRequire" type="textarea" :rows="5" resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="需协助具体事宜" prop="explains" class="feildFontweight">
            <el-input v-model="formValidate.coordinate" type="textarea" :rows="5" resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="用物清单" prop="fileIds" class="feildFontweight">
            <upload-file
              v-if="operailityData"
              :size="500*1024"
              :uploadFiles="formValidate.fileList||[]"
              @setUploadFiles="setMultimediaFileIds"
              downServer="/server/"
            ></upload-file>
            <upload-file
              v-else
              :size="500*1024"
              :file-list="formValidate.fileList||[]"
              @setUploadFiles="setMultimediaFileIds"
              downServer="/server/"
            ></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="申请人" prop="applicant" class="feildFontweight">
            <el-input v-model="formValidate.applicant" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="联系电话" prop="phone" class="feildFontweight">
            <el-input v-model="formValidate.phone" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="备注" prop="explains" class="feildFontweight">
            <el-input v-model="formValidate.remarks" type="textarea" :rows="5" resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="10" :offset="2">
        <div style="margin-left: 100px">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button @click="cancelEdit">取消</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss">
.pmStartDateBox {
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
.pmEndDateBox {
  .el-form-item__label:before {
    display: none;
  }
}
.pmDateText {
  line-height: 36px;
}
</style>
<script>
import api from "./api.js";
import { affairs as rules } from "../rules.js";
//当前组件引入全局的util
let Util = null;

export default {
  props: ["operailityData"],
  data() {
    return {
      rules,
      loadBtn: {
        title: "保存",
        callParEvent: "listenSubEvent"
      },
      formValidate: {
        id: "",
        name: "", //预约名称
        company: "湘雅三医院", //单位
        department: "",
        useDate: "",
        usetype: "",
        reception: "",
        cause: "",
        reserveNum: "0",
        userNum: "",
        group: "",
        groupNumber: "",
        roomNum: "",
        roomRequire: "",
        coordinate: "",
        applicant: "",
        phone: "",
        remarks: "",
        status: "WSB",
        fileIds: ""
      },
      editType: "add",
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
      ]
    };
  },
  methods: {
    init() {
      Util = this.$util;
      console.log(this.operailityData)
      // this.getDataForServer();
      // console.log(this.operailityData ,this.type);
      if (this.operailityData) {
        console.log("修改");
        console.log(this.operailityData)
        let opt = {
              ajaxSuccess: (res)=>{
                console.log(res)
                this.editType = 'edit'
                res.data.fileList.map(i=>{
                  i.name = i.oldName
                })
                this.formValidate=res.data;
              },
              ajaxParams:{
                url:api.get.path + this.operailityData.id,
                method: api.get.method
              }
            };
        this.ajax(opt)
        
        // this.formValidate = this.operailityData
      }else{
        console.log("添加");
      }
      
    },
    // getDataForServer () {
    //     this.ajax({
    //       ajaxSuccess: 'getDataSuccess',
    //       ajaxParams: {
    //         url: `${this.getUrlParams.path}/${this.id}`,
    //         method: this.getUrlParams.method
    //       }
    //     });
    //   },
    /*
     * 点击提交按钮 监听是否验证通过
     * @param formName string  form表单v-model数据对象名称
     * @return flag boolean   form表单验证是否通过
     * */
    submitForm(formName) {
      // console.log(this.$refs[formName]);
      let flag = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          flag = true;
        }
      });
      return flag;
    },
    listenSubEvent(isLoadingFun) {
      let isSubmit = this.submitForm("formValidate");
      console.log(isSubmit);
      if (!isSubmit) {
      } else {
        if (!isLoadingFun) isLoadingFun = function() {};
        isLoadingFun(true);
        if (this.checkTime(this.formValidate.useDate)) {
          console.log(this.editType ,'********************')
          let formValidate = this.getFormData(this.formValidate);
          if (this.editType == 'edit' ) {
            console.log(formValidate)
            let opt = {
              type: this.editType ,
              successTitle: "修改成功!",
              errorTitle: "修改失败!",
              ajaxSuccess: "ajaxSuccess",
              ajaxError: "ajaxError",
              ajaxParams: {
                url: api.edit.path +formValidate.id,
                method: api.edit.method,
                data: formValidate
              }
            };
            this.ajax(opt, isLoadingFun);
          }else{
            let opt = {
              type: this.editType ,
              successTitle: "添加成功!",
              errorTitle: "添加失败!",
              ajaxSuccess: "ajaxSuccess",
              ajaxError: "ajaxError",
              ajaxParams: {
                url: api.add.path,
                method: api.add.method,
                data: formValidate
              }
            };
            this.ajax(opt, isLoadingFun);
          }
          
          
          
        }
      }
    },
    /*
     * 时间格式转化
     * @return string  格式:YYYY-MM-dd hh：mm：ss
     * */
    checkTime(times) {
      let d = new Date(times);
      let Ys, Ds;
      if (d.getMonth() + 1 < 10) {
        Ys = "0" + (d.getMonth() + 1);
      } else {
        Ys = d.getMonth() + 1;
      }
      if (d.getDate() < 10) {
        Ds = "0" + d.getDate();
      } else {
        Ds = d.getDate();
      }
      let youWant = d.getFullYear() + "-" + Ys + "-" + Ds;
      this.formValidate.useDate = youWant;
      return true;
    },
    /*
     * 获取表单数据
     * @return string  格式:id=0&name=aa
     * */
    getFormData(data) {
      let myData = Util._.defaultsDeep({}, data);
      return myData;
    },
    cancelEdit() {
      this.$emit("cancel", this.editType);
    },
    cancel(type) {
      this[type + "Modal"] = false;
    },
    // 文件上传
    setMultimediaFileIds(ids) {
      this.formValidate.fileIds = ids || "";
      console.log(this.formValidate.fileIds)
      console.log(ids)
    }
  },
  created() {
    this.init();
  },
  watch: {
  datas: function (val) {
     this.chartsInit(val)
   }
 },
};
</script>
