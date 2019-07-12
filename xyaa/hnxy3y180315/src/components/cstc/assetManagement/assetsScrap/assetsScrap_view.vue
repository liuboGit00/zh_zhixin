<template>
  <el-row class="deviceMoreInfoShow">
    <div class="qrImgs" v-if="showData && showData.qrcode">
      <img :src="'/api/file/download/'+showData.qrcode"
           @error="e=>e.target.src='/static/image/qrImgLoadError.png'">
      <p>设备二维码</p>
    </div>
    <el-form label-width="122px">
      <p>报废信息</p>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="资产名称：">
            {{ showData.assetName }}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="资产编号：">
            {{ showData.assetNumber }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="报废人：">
            {{ showData.discarder }}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="报废时间：">
            {{ showData.scrapTime|formatDate('yyyy-MM-dd')  }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="报废说明：">
            {{ showData.scrapRemarks }}
          </el-form-item>
        </el-col>
      </el-row>

      <p>资产基础信息</p>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="资产名称：">
            {{ showData.assetName }}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="资产编号：">
            {{ showData.assetNumber }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="资产分类：">
            {{ showData.treeName }}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="型号：">
            {{ showData.model }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="规格：">
            {{ showData.standard }}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="单价：">
            {{ showData.price }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="厂家：">
            {{ showData.manufacturer }}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="供货商：">
            {{ showData.supplier }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="出厂日期：">
            {{ showData.manufactureDate|formatDate('yyyy-MM-dd')  }}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="购置日期：">
            {{ showData.purchaseDate |formatDate('yyyy-MM-dd') }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="保修日期：">
            {{ showData.guaranteeDate|formatDate('yyyy-MM-dd')  }}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="报废期限：">
            {{ showData.discardingTimeLimit }}年
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="折旧方式：">
            {{ showData.depreciationMethod|assetZJFS }}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="经费来源：">
            {{ showData.fundsSource|assetJFLY }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="使用方向：">
            {{ showData.directionUse|assetSYFX }}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="设备来源：">
            {{ showData.purchaseSource|assetSBLY }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="经手人：">
            {{ showData.operator }}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="记账人：">
            {{ showData.bookkeeper}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="合同编号：">
            {{ showData.contractNumber }}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="存放地点：">
            {{ showData.storageLocation }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="2">
          <el-form-item label="资产图片：">
            <upload-photo-wall type="picture" :show="true"
                               :actionUrl="'/file/upload/static'"
                               :fileList="fileListOfCopy"></upload-photo-wall>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="2">
          <el-form-item label="合同复印件：">
            <upload-file  :show="true" :uploadFiles="showData.fileList"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="备注：">
            {{ showData.remarks }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-col :span="24" align="center">
        <el-button @click="cancel">关闭</el-button>
      </el-col>
    </el-form>
  </el-row>
</template>

<script>
  //当前组件引入全局的util
  let Util = null
  export default {
    props: {
      id: {
        type: [Number, String],
        required: true,
      },
      urlParams: { // api对象
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        //form表单bind数据
        showData: {
          deviceTypeName: '-',
          deviceIdentifier: '-',
          startTime: '-',
          endTime: '-',
          cost: '-',
          remark: '-',
        },
        fileListOfCopy:[],
        fileList:[],
        staticPath:''
      }
    },
    methods: {
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer () {
        this.ajax({
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: `${this.urlParams.path}/${this.id}`,
            method: this.urlParams.method,
          },
        })
      },
      ajaxSuccess (res) {
        this.staticPath = this.$store.getters.getEnvPath.http
        let fileList = []
        let fileListCopy = []
        if (res.data.assetsImageList && res.data.assetsImageList.length) {
          res.data.assetsImageList.map(item => fileList.push({
            name: '',
            url: this.staticPath + item.originalPath,
          }))
        }
        if (res.data.assetsContractImage &&
          res.data.assetsContractImage.length) {
          res.data.assetsContractImage.map(item => fileListCopy.push({
            name: '',
            url: this.staticPath + item.originalPath,
          }))
        }
        this.fileList = fileList
        this.fileListOfCopy = fileListCopy
        this.showData = res.data // 初始化编辑数据
      },
      /*
       * 组件初始化入口
       * */
      init () {
        this.getDataForServer()
      },
      cancel () {
        this.$emit('cancel', 'show')
      },
    },
    created () {
      this.init()
    },
  }

</script>
