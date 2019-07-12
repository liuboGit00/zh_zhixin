<template>
  <el-row class="deviceMoreInfoShow">
    <div class="qrImgs">
      <img :src="'/api/file/download/'+formValidate.qrcode"
           @error="e=>e.target.src='/static/image/qrImgLoadError.png'">
      <p>设备二维码</p>
    </div>
    <el-form :model="formValidate" ref="formValidate" label-width="124px">
      <el-col :span="9" :offset="2">
        <el-form-item label="资产名称：" prop="assetName">
          {{formValidate.assetName}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="资产编号：" prop="assetNumber">
          {{formValidate.assetNumber}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="资产分类：" prop="treeId">
          {{formValidate.assetNumber}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="型号：" prop="model">
          {{formValidate.model}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="规格：" prop="standard">
          {{formValidate.standard}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="单价（元）：" prop="price">
          <!--<el-input v-model="formValidate.price" @blur="formatRMB" placeholder="请输入单价"></el-input>-->
          {{formValidate.price}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="厂家：" prop="manufacturer">
          {{formValidate.manufacturer}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="供应商：" prop="supplier">
          {{formValidate.supplier}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="出厂时间：" prop="manufactureDate">
          {{formValidate.manufactureDate}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="购置日期：" prop="purchaseDate">
         {{formValidate.purchaseDate}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="保修截至时间：" prop="guaranteeDate">
          {{formValidate.guaranteeDate}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="报废期限：" prop="discardingTimeLimit">
          {{formValidate.discardingTimeLimit}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="折旧方式：" prop="depreciationMethod">
          <!--<el-select v-model="formValidate.depreciationMethod" placeholder="请选择">-->
            <!--<el-option v-for="item in stateOption" :key="item.value" :label="item.label" :value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="经费来源：" prop="fundsSource">
          <!--<el-select v-model="formValidate.fundsSource" placeholder="请选择">-->
            <!--<el-option v-for="item in stateOption" :key="item.value" :label="item.label" :value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="使用方向：" prop="directionUse">
          <!--<el-select v-model="formValidate.directionUse" placeholder="请选择">-->
            <!--<el-option v-for="item in stateOption" :key="item.value" :label="item.label" :value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="设备来源：" prop="purchaseSource">
          {{formValidate.purchaseSource}}
          <!--<el-select v-model="formValidate.purchaseSource" placeholder="请选择">-->
            <!--<el-option v-for="item in stateOption" :key="item.value" :label="item.label" :value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="经手人" prop="operator">
          {{formValidate.operator}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="记账人" prop="bookkeeper">
          {{formValidate.bookkeeper}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="合同编号" prop="contractNumber">
          {{formValidate.contractNumber}}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="存放地点：" prop="storageLocation" style="margin-bottom: 23px">
          {{formValidate.storageLocation}}
          <!--<el-input v-model="formValidate.storageLocation" placeholder="请选择或者输入" @input="inputStorageLocation">-->
            <!--<el-button slot="append" @click="selectRoom">选择房间</el-button>-->
          <!--</el-input>-->
        </el-form-item>
      </el-col>
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="购买时间：" prop="purchaseTime">-->
      <!--{{ formValidate.purchaseTime }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="使用次数：" prop="useTime">-->
      <!--{{ formValidate.useTime || '0' }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="单价：" prop="price">-->
      <!--{{ formValidate.price | money }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="维修电话：" prop="servicingPhone">-->
      <!--{{ formValidate.servicingPhone }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="厂商电话：" prop="manufacturerPhone">-->
      <!--{{ formValidate.manufacturerPhone }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="购买地址：" prop="buyAdderss">-->
      <!--{{ formValidate.buyAdderss }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="存放地点：" prop="storageLocation">-->
      <!--{{ formValidate.storageLocation }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="设备编号：" prop="deviceIdentifier">-->
      <!--{{ formValidate.deviceIdentifier }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="设备型号：" prop="model">-->
      <!--{{ formValidate.model }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="生产日期：" prop="manufactureDate">-->
      <!--{{ formValidate.manufactureDate }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="保修截止日期：" prop="guaranteeDate">-->
      <!--{{ formValidate.guaranteeDate }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="设备状态：" prop="status">-->
      <!--{{ formValidate.status | typeText }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <el-col :span="20" :offset="2">
        <el-form-item label="发票图片：">
          <upload-photo-wall type="picture" :show="true" :actionUrl="'/file/upload/static'" :fileList="fileList" ></upload-photo-wall>
        </el-form-item>
      </el-col>
      <el-col :span="20" :offset="2">
        <el-form-item label="合同复印件：">
          <upload-photo-wall type="picture" :show="true"  :actionUrl="'/file/upload/static'" :fileList="fileListOfCopy" ></upload-photo-wall>
        </el-form-item>
      </el-col>
      <el-col :span="20" :offset="2">
        {{ formValidate.remark}}
      </el-col>

    </el-form>
  </el-row>
</template>
<style lang="scss">
  .deviceMoreInfoShow {
    position: relative;
    .qrImgs {
      width: 200px;
      position: absolute;
      right: -16px;
      top: -16px;
      img {
        width: 100%;
      }
      p {
        margin-top: -12px;
        text-align: center;
      }
    }
  }
</style>
<script>
  import api from './api';
  import myVideo from '../../../../common/video.vue';
  import viewPPT from './viewPPT.vue';
  import uploadPhotoWall from '../../../../common/uploadPhotoWall';

  export default {
    props: {
      id: {
        type: [Number, String],
        require: true,
      },
      // urlParams: { // 编辑
      //   type: Object,
      //   require: true
      // }
      // operailityData: {
      //   type: Object,
      //   required: true
      // }
    },
    data () {
      return {
        // 表单数据
        formValidate: {
//          model: "-", // 设备型号
//          deviceTypeName: "-",
//          deviceIdentifier: "-", // 设备编号
//          price: "-", // 单价
//          useTime: 0, // 使用次数 无
//          purchaseTime: "-", // 购买时间
//          manufacturerPhone: "-", // 厂商电话
//          servicingPhone: "-", // 维修电话
//          storageLocation: "-", // 存放地点
//          buyAdderss: "-", // 购买地点
//          manufactureDate: "-", // 生产日期
//          guaranteeDate: "-", // 保修截止日期
//          status: "-", // 状态
//          imgList: [], // 状态
//          describes: "-" // 描述

//          "id":"1",
          'deviceTypeId': '',
          'deviceIdentifier': '',
          'price': '',
          'useTime': '',
          'status': '',
          'manufactureDate': '',
          'purchaseTime': '',
          'buyAdderss': '',
          'manufacturerPhone': '',
          'guaranteeDate': '',
          'storageLocation': '',
          'describe': '',
          'QRCode': '',
          'model': '',
          'specifications': '',
          'supplier': '',
          'directionUse': '',
          'factoryNumber': '',
          'purchaseSource': '',
          'invoiceNumber': '',
          'depreciationMethod': '',
          'purchaseDate': '',
          'useDepartment': '',
          'personLiable': '',
          'manufactor': '',
          'videoList': [
//            {
//              "fileName":"",
//              "path":""
//            }
          ],
          'invoicePictureList': [
//            {
//              "originalPath":"*/*.jpg",
//              "thumbnailPath":"*/*.jpg"
//            }
          ],
        },
        videoShow: false,
        file: {id: ''},
        fileList:[],
        fileListOfCopy:[],
        staticPath:"",
      }
    },
    methods: {
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer () {
        this.ajax({
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: api.get.path + this.id,
            method: api.get.method,
          },
        })
      },
      ajaxSuccess (res) {
        this.staticPath = this.$store.getters.getEnvPath.http;
        let fileList = [];
        let fileListCopy=[];
        if (res.data.assetsImageList && res.data.assetsImageList.length) {
          res.data.assetsImageList.map(item => fileList.push({
            name: '',
            url: this.staticPath + item.originalPath
          }));
        }
        if (res.data.assetsContractImage && res.data.assetsContractImage.length) {
          res.data.assetsContractImage.map(item => fileListCopy.push({
            name: '',
            url: this.staticPath + item.originalPath
          }));
        }
        this.fileList = fileList;
        this.fileListOfCopy=fileListCopy;
        this.formValidate = res.data; // 初始化编辑数据
      },
      /*
       * 组件初始化入口
       * */
      init () {
        // 获取编辑数据
        this.getDataForServer();
      },

      //切换视频
      changeIndex (item, i) {

        this.index = i;
        if (item) {
          if (this.file.id == item.id) {
            return;
          }

          let env = this.$store.getters.getEnvPath;
          let http = env['http'];
          let file = {};
          this.videoShow = false;
          file = item;
          file._path = http + file.path;
          let type = file._path.split('.');
          file.type = type[type.length - 1];
          this.file = file
        }
        //页面dom稳定后调用
        this.$nextTick(function () {
          this.videoShow = true;
        })
      },
    },
    created () {
      // this.formValidate = this.operailityData
      this.init();
    },
    components: {
      myVideo, viewPPT,uploadPhotoWall
    },
  }

</script>
