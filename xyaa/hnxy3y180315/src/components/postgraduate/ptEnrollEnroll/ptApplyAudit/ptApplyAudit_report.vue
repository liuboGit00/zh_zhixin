<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <yjs-show :operaility-data="showData"></yjs-show>
    <el-row style="margin-top: 16px">
      <el-col align="center">
        <el-button type="success" @click="getPrintData('AUDIT_SUCCESS')">通过</el-button>
        <el-button type="danger" @click="getPrintData('AUDIT_FAILURE')">驳回</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import yjsShow from '../yjsPersonnelManagement/yjsPersonnelManagement_view.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        showData: {
          id: this.operailityData.accountId
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init() {},
      getPrintData(accountStatus) {
        let msg = {
          AUDIT_SUCCESS: '通过',
          AUDIT_FAILURE: '驳回'
        };
        let opt = {
          ajaxSuccess: res => {
            this.$emit('report', 'report', `审核${msg[accountStatus]}操作成功`)
          },
          ajaxError: () => this.errorMess(`审核${msg[accountStatus]}操作失败`),
          ajaxParams: {
            url: api.audit.path + this.operailityData.id,
            method: api.audit.method,
            data: {
              ids: this.operailityData.id,
              accountStatus,
            }
          }
        };
        this.ajax(opt)
      }

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      yjsShow
    }
  }

</script>
