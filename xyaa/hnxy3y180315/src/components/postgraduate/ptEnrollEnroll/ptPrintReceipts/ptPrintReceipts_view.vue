<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <div class="printBPMain" v-for="(item,index) in printDatas" :key="index">
      <div class="printBPItem">
        <div class="printMain">
          <p>财务处：</p>
          <div class="printCon">
            请收研究生<div>{{ item.name }}</div>工作服费，收费<div>{{ item.money }}</div>（{{ item.price }}元/天租赁）;
            导师签名<div></div>。课题编号：<div></div>，请收押金<div>{{ item.deposit }}</div>元整。（研究生自付）
          </div>
          <div class="signature">
            <p>教育处</p>
            <p>日期：</p>
          </div>
        </div>
        <div class="printBPItem">
          <div class="printMain">
            <p>物资组：</p>
            <div class="printCon">
              请给研究生：<div>{{ item.name }}</div>发放工作服，已收费<div>{{ item.money }}</div>。
              <br>
              工作服型号（男、女　L、  M、  S　）
            </div>
            <div class="signature">
              <p>教育处</p>
              <p>日期：</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../../../../assets/ambuf/css/common/print_charge";
</style>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        printDatas: [],
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getPrintData()
      },
      getPrintData() {
        let opt = {
          ajaxSuccess: res => {
            let data = [];
            if (res.data instanceof Object) {
              data = [res.data]
            }
            this.printDatas = data;
          },
          ajaxError: () => this.errorMess('获取打印数据失败'),
          ajaxParams: {
            url: api.printData.path + this.operailityData.id,
            method: api.printData.method
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
    components: {}
  }

</script>
