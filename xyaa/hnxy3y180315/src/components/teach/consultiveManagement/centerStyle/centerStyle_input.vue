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
          <el-form-item label="标题:" prop="title" class="feildFontweight">
            <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="作者:" prop="authorName" class="feildFontweight">
            <el-input v-model="formValidate.authorName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="图文匹配模式:" prop="infoType" class="feildFontweight">
            <el-select v-model="formValidate.infoType" placeholder="请选择">
              <el-option label="一对一" value="ONE"></el-option>
              <el-option label="一对多" value="MANY"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="门户显示:" prop="isDisplay" class="feildFontweight">
            <el-select v-model="formValidate.isDisplay" placeholder="请选择">
              <el-option label="是" value="YES"></el-option>
              <el-option label="否" value="NO"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="标题图片:" prop="titlePicturePath" class="feildFontweight">
            <img v-if="formValidate.titlePicturePath" :src="http+formValidate.titlePicturePath" alt="" style="width: 180px;height: 180px;">
            <el-button type="primary" style="width: 80px" @click="upPicTitleModal=true">+</el-button>
          </el-form-item>
        </el-col>

      </el-row>
      <!--<el-row>-->
        <!--<el-col :span="8" :offset="2">-->
          <!--<el-form-item label="标题图片文字描述:" prop="titlePictureName" class="feildFontweight">-->
            <!--<el-input v-model="formValidate.titlePictureName" placeholder="请输入"></el-input>-->
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
            <!--<col :width="200">-->
          <!--</colgroup>-->
          <!--<thead>-->
          <!--<tr>-->
            <!--<th class="cell" style="text-align: center;">标题图片文字描述</th>-->
            <!--<th class="cell" style="text-align: center;">操作</th>-->
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
              <!--<col :width="200">-->
            <!--</colgroup>-->
            <!--<tbody>-->

            <!--<tr>-->
              <!--<td class="valiTableStyle"-->
                  <!--:rowspan="1">-->
                <!--<el-input type="textarea" :rows="5" v-model="formValidate.titlePictureName"-->
                          <!--placeholder="请输入"></el-input>-->
              <!--</td>-->
              <!--<td class="valiTableStyle" align="center">-->
                <!--<el-button type="primary" @click="upPicTitleModal=true">上传图片</el-button>-->
              <!--</td>-->
              <!--<td class="valiTableStyle" align="center" style="height:190px">-->
                <!--<img v-if="formValidate.titlePicturePath" :src="http+formValidate.titlePicturePath" alt="" style="width: 180px;height: 180px;">-->
              <!--</td>-->
            <!--</tr>-->
            <!--</tbody>-->
          <!--</table>-->
      <!--</div>-->
    <!--</div>-->
    <el-row>
      <el-col :span="20" :offset="2">
        <el-button type="primary" @click="add">新增</el-button>
        <el-button type="primary" @click="remove">删除</el-button>
      </el-col>
    </el-row>
    <br>
    <div style="border: 1px solid #dfe6ec;width: 902px;overflow: auto;margin: 0 auto"
         class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
      <div class="el-table__body-wrapper" style="overflow-x: hidden;overflow-y: auto;">
        <table width="100%">
          <colgroup>
            <col :width="100">
            <col>
            <col :width="150">
            <col :width="200">
            <col :width="100">
          </colgroup>
          <thead>
          <tr>
            <th class="cell" style="text-align: center;">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{''}}
              </el-checkbox>
            </th>
            <th class="cell" style="text-align: center;">文字描述</th>
            <th class="cell" style="text-align: center;">操作</th>
            <th class="cell" style="text-align: center;">图片</th>
            <th class="cell" style="text-align: center;">显示顺序</th>
          </tr>
          </thead>
        </table>
      </div>
      <div class="el-table__body-wrapper" style="overflow-x: hidden;overflow-y: auto;width:100%">
        <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
          <table width="100%">
            <colgroup>
              <col :width="100">
              <col>
              <col :width="150">
              <col :width="200">
              <col :width="100">
            </colgroup>
            <tbody>

            <tr v-for="(item,index) in infoDetailsList" :key="index">
              <td class="valiTableStyle" align="center">
                <el-checkbox :label="item._id">{{''}}</el-checkbox>
              </td>
              <td class="valiTableStyle" v-if="formValidate.infoType=='MANY'?index===0:true"
                  :rowspan="formValidate.infoType=='MANY'&&index===0?infoDetailsList.length:1">
                <el-input type="textarea" :rows="5" v-model="item.textDescription"
                          placeholder="请输入"></el-input>
              </td>
              <td class="valiTableStyle" align="center">
                <el-button type="primary" @click="upPick(item)">上传图片</el-button>
              </td>
              <td class="valiTableStyle" align="center" style="height:190px">
                <img v-if="item.picurl" :src="http+item.picurl" alt="" style="width: 180px;height: 180px;">
              </td>
              <td class="valiTableStyle">
                <el-input v-model.trim="item.displayOrder" @blur="displayOrder(item,index)"
                          placeholder="请输入"></el-input>
              </td>
            </tr>
            </tbody>
          </table>
        </el-checkbox-group>
      </div>
    </div>
    <br>
    <el-row>
      <el-col :span="24" style="text-align: center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      v-model="upPicModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="600"
    >
      <modal-header slot="header" :content="upPicId"></modal-header>
      <upPic v-if="upPicModal" @uploadSuccess="uploadSuccess" cancel="upPicModal=false" :fileList="saveFlies.flieList"
             :url="url"></upPic>
      <div slot="footer"></div>
    </Modal>
    <!--上传标题图片弹窗-->
    <Modal
      :mask-closable="false"
      v-model="upPicTitleModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="600"
    >
      <modal-header slot="header" :content="upPicId"></modal-header>
      <upload-photo-wall  actionUrl="/file/upload/static"  v-if="upPicTitleModal" onlyOnePic="true" @upladSuccess="uploadTitleSuccess" cancel="upPicTitleModal=false" :fileList="flieList"></upload-photo-wall>
      <div style="text-align: center">
      <el-button type="primary" @click="upPicTitleModal=false">确定</el-button>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>

</template>
<script>
  import uploadPhotoWall from '../../../common/uploadPhotoWall.vue'
  import upPic from './centerStyle_upPic.vue'
  import {contentManagement} from '../rules'
  //引入当前注册的组件
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'url', 'moduleId','contentType'],
    data() {
      return {
        flieList:[],
        upPicTitleModal:false,
        show: false,
        contentManagement,
        idCount: 1,//记录id
        checkAll: false,
        upPicModal: false,
        checkList: [],
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
          infoDetailsList: [],
          titlePictureName:'',
          titlePicturePath:'',
        },
        ///获取的数据
        data: {},
        columnModal: false,
        upPicId: {upPicId: '上传图片', id: 'columnId',},

        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功',
          errorTitle: '修改失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            jsonString: true,
            url: '',
            method: 'put',
          }
        },
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功',
          errorTitle: '添加失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            jsonString: true,
            url: this.url[this.contentType === 'device' ? 'modleAdd' : 'infoAdd'].path,
            method: 'post',
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: '',
          }
        },
        saveFlies: [],

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
        //修改
        this.distinguish(null, () => {
          this.editMessTitle.ajaxParams.url = this.url[this.contentType === 'device' ? 'modleModify' : 'infoModify'].path + this.operailityData.infoId;
          this.listMessTitle.ajaxParams.url = this.url[this.contentType === 'device' ? 'modleGet' : 'infoGet'].path + this.operailityData.infoId;
          this.ajax(this.listMessTitle);
        })
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun = () => {
      }) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          let data = this.covData(this.getFormData(this.formValidate), this.infoDetailsList); //如果通过并且处理数据成功会返回数据，或者失败返回false
          if (!data) return;
          isLoadingFun(true);
          this.distinguish(() => {
            this.addMessTitle.ajaxParams.data = data;
            this.ajax(this.addMessTitle, isLoadingFun)
          }, () => {
            this.editMessTitle.ajaxParams.data = data;
            this.ajax(this.editMessTitle, isLoadingFun)
          })
        }
      },

      //处理数据
      covData(formValidate, infoDetailsList) {
        if (this.validate()) return;
        if (formValidate.infoType === 'MANY') { //如果是一对多则每一个都和第一个一样
          infoDetailsList.map((item, index) => {
            item.textDescription = infoDetailsList[0].textDescription;
          })
        }
        formValidate.infoDetailsList = infoDetailsList;
        return formValidate;
      },

      //验证是否能通过
      validate() {
        if(!this.formValidate.titlePicturePath){
          this.errorMess('标题图片不能为空');
          return true;
        }
        if (this.infoDetailsList.length == 0) {
          this.errorMess('图片列表不能为空');
          return true;
        }
        for (let i = 0; i < this.infoDetailsList.length; i++) {
          let item = this.infoDetailsList[i];
          if (!item.picurl) {
            this.errorMess(`第${i + 1}行图片不能为空`);
            return true;
          }
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
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
        if(data.titlePicturePath){
          this.flieList=[{url: this.http + data.titlePicturePath, src: data.titlePicturePath}]
        }
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

      /**
       * 区分是添加还是修改
       *addFun {function|null} 添加执行的函数
       *editFun {function|null} 修改执行的函数
       * */
      distinguish(addFun, editFun) {
        if (!this.operailityData) {
          typeof addFun == 'function' && addFun()
        } else {
          typeof editFun == 'function' && editFun()
        }
      },

      //打开上传窗口
      upPick(item) {
        this.upPicModal = true;
        this.saveFlies = item;
      },

      cancel() {
        this.distinguish(() => {
          this.$emit('cancel', 'add');
        }, () => {
          this.$emit('cancel', 'edit');
        })
      },

      uploadSuccess({fileList, index, arr}) {
        console.log({fileList, index, arr})
        if (arr[0]) arr[0].src = fileList[0] && fileList[0].src || '';//为了和上传匹配
        this.saveFlies.flieList = arr;
        this.saveFlies.picurl = fileList[0] && fileList[0].src || '';
        this.upPicModal = false;
      },
      uploadTitleSuccess(res, index, arr){
        this.formValidate.titlePicturePath=res[0]&&res[0].src;
        this.flieList=arr;
      },

      //添加列表
      add() {
        this.infoDetailsList.push(this.gen());
        //添加则改变是否全选
        this.handleCheckedCitiesChange(this.checkList);
        this.infoTypeChange(this.formValidate.infoType);//是否给每一个添加的加上文字描述
      },

      //生成对象
      gen(item = {}) {
        return {
          _id: ++this.idCount,
          "textDescription": item.textDescription || '',//文字描述
          "picurl": item.picurl || '',//图片地址
          "displayOrder": item.displayOrder || this.infoDetailsList.length + 1 || '',//显示顺序
          flieList: item.flieList || [],
        }
      },

      //移除列表项
      remove() {
        let checkList = this.checkList;
        let infoDetailsList = this.infoDetailsList.reduce((arr, item) => {
          let index = checkList.indexOf(item._id);
          if (index > -1) {
            checkList.splice(index, 1);
          } else {
            arr.push(item)
          }
          return arr
        }, [])
        this.infoDetailsList = infoDetailsList;
        //移除则改变是否全选
        this.handleCheckedCitiesChange(this.checkList);
        this.useReduceOrder()
      },

      handleCheckAllChange() {
        this.checkList = this.checkAll ? this.getAllId() : [];
        this.isIndeterminate = false;
      },

      //返回目前所有的id
      getAllId() {
        return this.infoDetailsList.reduce((arr, item) => {
          arr.push(item._id)
          return arr
        }, [])
      },

      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        let length = this.getAllId().length
        if (length === 0) {
          this.checkAll = false;
        } else {
          this.checkAll = checkedCount === length;
        }
        this.isIndeterminate = checkedCount > 0 && checkedCount < length;
      },

      //排序
      displayOrder(item, index) {
        if (item.displayOrder == index + 1) return;//顺序不变
        let infoDetailsList = this.infoDetailsList
        if (/^\+?[1-9]\d*$/.test(item.displayOrder)) {
          infoDetailsList.splice(index, 1);
          infoDetailsList.splice(this.order(infoDetailsList.length, item.displayOrder), 0, item);
          this.useReduceOrder()
        } else {
          item.displayOrder = index + 1;
        }
      },

      //重新排序
      useReduceOrder() {
        this.infoDetailsList = this.infoDetailsList.reduce((arr, item, index) => {
          item.displayOrder = index + 1;
          arr.push(item);
          return arr
        }, [])
      },

      //插入数组的顺序
      order(length, index) {
        if (index < 0) {
          return 0;
        } else if (index <= length) {
          return index - 1;
        } else {
          return length;
        }
      },

      infoTypeChange(val) {
        if (val === 'MANY') {
          this.infoDetailsList.map((item, index) => {
            item.textDescription = this.infoDetailsList[0].textDescription;
          })
        }
      },
    },
    components: {
      upPic,uploadPhotoWall
    }
  }
</script>
