<template>
  <div class="editForm">
    <el-form :model="formValidate" ref="formValidate" label-width="124px">
      <el-row>

        <el-col :span="8" :offset="2">
          <el-form-item label="资产名称：" prop="baseId">
            {{formValidate.assetName}}
          </el-form-item>
        </el-col>
        <!--<el-col :span="8" :offset="2">-->
        <!--<el-form-item label="资产编号：" required>-->

        <!--<el-select v-model="formValidate.assetNumber" filterable-->
        <!--:disabled="isEdit"-->
        <!--placeholder="请选择" @change="selectassetNumber">-->
        <!--<el-option v-for="item in baseAssetList" :key="item.assetNumber"-->
        <!--:label="item.assetNumber" :value="item.assetNumber">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <el-table style="margin: 10px 8.3%;width: 84%" align="center" :context="self" :data="formValidate.assetsCountInfoItemResultList"
                  tooltip-effect="dark"
        >
          <!--<el-table-column type="selection" width="55"></el-table-column>-->
          <el-table-column label="资产编号" prop="assetNumber"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="规格型号" prop="standard"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="单价" prop="price"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="入库时间" prop="warehousingTime" show-overflow-tooltip
                           width="200">
            <template scope="scope">
              {{ scope.row.warehousingTime | formatDate('yyyy-MM-dd') }}
            </template>
          </el-table-column>

          <el-table-column label="存放地点" prop="storageLocation"
                           show-overflow-tooltip></el-table-column>
        </el-table>


        <el-col :span="8" :offset="2">
          <el-form-item label="盘亏时间：" prop="countTime" required>
            {{formValidate.countTime|formatDate('yyyy-MM-dd') }}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="盘亏人：" prop="countOperator" required>
            {{formValidate.countOperator}}
          </el-form-item>
        </el-col>

        <el-col :span="18" :offset="2">
          <el-form-item label="盘亏说明：" prop="countRemark">
           {{formValidate.countRemark}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
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
        formValidate:{},
        self:this
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
        this.formValidate = res.data // 初始化编辑数据
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
