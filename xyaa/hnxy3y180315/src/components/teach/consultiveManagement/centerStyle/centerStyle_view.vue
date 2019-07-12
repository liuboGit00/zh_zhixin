<!----------------------------------
****--@name     中心风采
****--@role     ${*}
****--@date     2018/3/16
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="contentManagement" class="demo-form-inline"
             label-width="100px">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="标题:" class="feildFontweight">
            {{formValidate.title}}
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="作者:" class="feildFontweight">
            {{formValidate.authorName}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="图文匹配模式:" class="feildFontweight">
            {{formValidate.infoType === 'ONE' ? '一对一' : '一对多'}}
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="门户显示:" prop="isDisplay" class="feildFontweight">
            {{formValidate.isDisplay | typeText}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="标题图片:" prop="titlePicturePath" class="feildFontweight">
            <img v-if="formValidate.titlePicturePath" :src="http+formValidate.titlePicturePath" alt="" style="width: 180px;height: 180px;">
          </el-form-item>
        </el-col>

      </el-row>
      <!--<el-row>-->
        <!--<el-col :span="8" :offset="2">-->
          <!--<el-form-item label="标题图片文字描述:" prop="titlePictureName" class="feildFontweight">-->
            <!--{{formValidate.titlePictureName}}-->
          <!--</el-form-item>-->
        <!--</el-col>-->

      <!--</el-row>-->
    </el-form>
    <!--<div style="border: 1px solid #dfe6ec;width: 902px;overflow: auto;margin: 0 auto;margin-bottom: 20px"-->
         <!--class="el-table el-table&#45;&#45;fit el-table&#45;&#45;border el-table&#45;&#45;enable-row-hover el-table&#45;&#45;enable-row-transition">-->
      <!--<div class="el-table__body-wrapper" style="overflow-x: hidden;overflow-y: auto;">-->
        <!--<table width="100%">-->
          <!--<colgroup>-->
            <!--<col :width="300">-->
            <!--<col>-->
            <!--<col :width="200">-->
          <!--</colgroup>-->
          <!--<thead>-->
          <!--<tr>-->
            <!--<th class="cell" style="text-align: center;">标题图片文字描述</th>-->
            <!--<th class="cell" style="text-align: center;">标题图片</th>-->
          <!--</tr>-->
          <!--</thead>-->
        <!--</table>-->
      <!--</div>-->
      <!--<div class="el-table__body-wrapper" style="overflow-x: hidden;overflow-y: auto;width:100%">-->
        <!--<table width="100%">-->
          <!--<colgroup>-->
            <!--<col :width="300">-->
            <!--<col>-->
            <!--<col :width="200">-->
          <!--</colgroup>-->
          <!--<tbody>-->

          <!--<tr>-->
            <!--<td class="valiTableStyle"-->
                <!--:rowspan="1">-->
              <!--<el-input type="textarea" :rows="5" v-model="formValidate.titlePictureName" :disabled="true"-->
                        <!--placeholder="请输入"></el-input>-->
            <!--</td>-->
            <!--<td class="valiTableStyle" align="center" style="height:190px">-->
              <!--<img v-if="formValidate.titlePicturePath" :src="http+formValidate.titlePicturePath" alt="" style="width: 180px;height: 180px;">-->
            <!--</td>-->
          <!--</tr>-->
          <!--</tbody>-->
        <!--</table>-->
      <!--</div>-->
    <!--</div>-->

    <br>
    <div style="border: 1px solid #dfe6ec;width: 902px;overflow: auto;margin: 0 auto"
         class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
      <div class="el-table__body-wrapper" style="overflow-x: hidden;overflow-y: auto;">
        <table width="100%">
          <colgroup>
            <col>
            <col :width="200">
            <col :width="100">
          </colgroup>
          <thead>
          <tr>
            <th class="cell" style="text-align: center;">文字描述</th>
            <th class="cell" style="text-align: center;">图片</th>
            <th class="cell" style="text-align: center;">显示顺序</th>
          </tr>
          </thead>
        </table>
      </div>
      <div class="el-table__body-wrapper" style="overflow-x: hidden;overflow-y: auto;width:100%">
        <table width="100%">
          <colgroup>
            <col>
            <col :width="200">
            <col :width="100">
          </colgroup>
          <tbody>

          <tr v-for="(item,index) in infoDetailsList" :key="index">
            <td class="valiTableStyle" v-if="formValidate.infoType=='MANY'?index===0:true"
                :rowspan="formValidate.infoType=='MANY'&&index===0?infoDetailsList.length:1">
              <el-input type="textarea" readonly :rows="5" v-model="item.textDescription"
                        placeholder="请输入"></el-input>
            </td>
            <td class="valiTableStyle" align="center" style="height:190px">
              <img v-if="item.picurl" :src="http+item.picurl" alt="" style="width: 180px;height: 180px;">
            </td>
            <td class="valiTableStyle" align="center">
              {{item.displayOrder}}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</template>
<script>
  import {contentManagement} from '../rules'
  //引入当前注册的组件
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'url', 'moduleId','contentType'],
    data() {
      return {
        show: false,
        contentManagement,
        ueditorVal: {
          ud1: "",
        },  //
        idCount: 1,//记录id
        http: this.$store.getters.getEnvPath['http'],
        isIndeterminate: false,
        infoDetailsList: [
          {
            _id: 1,
            "textDescription": "",//文字描述
            "picurl": "",//图片地址
            "displayOrder": "1",//显示顺序
            "flieList": [],//显示顺序
          },
        ],
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        //form表单bind数据
        "formValidate": {
          "moduleId": this.moduleId,      //栏目id
          "title": "",                   //标题
          "authorName": "",                  //作者
          "infoType": "ONE",                   //ONE一对一 MANY一对多
          "isDisplay": "YES",                 //YES
          infoDetailsList: []
        },
        ///获取的数据
        data: {},

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: this.url[this.contentType === 'device' ? 'modleGet' : 'infoGet'].path + this.operailityData.infoId,
          }
        },
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //初始化
      this.init();
    },
    methods: {
      /*
      * 组件初始化入口
      * */
      init() {
        this.ajax(this.listMessTitle);
      },

      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData) {
        let data = responseData.data;
        this.data = data;
        this.infoDetailsList = data.infoDetailsList;
        (data.infoDetailsList || []).map((item) => {
          item.flieList = [{url: this.http + item.picurl, src: item.picurl}]
        })
        this.infoDetailsList = data.infoDetailsList && data.infoDetailsList.sort((a, b) => {
          return a.displayOrder - b.displayOrder
        }) || [];
        this.formValidate = data;
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },

      infoTypeChange(val) {
        if (val === 'MANY') {
          this.infoDetailsList.map((item, index) => {
            item.textDescription = this.infoDetailsList[0].textDescription;
          })
        }
      },
    },
    components: {}
  }
</script>
