<!--
****--@file     physicianPlan_list
****--@date     2019-02-13 11:19
****--@author   YC
****--@describe 场次管理
-->
<template>
  <div v-model="active">
    <index v-if="active == 'index'" @showPage="show"></index>
    <exam v-if="active == 'exam'" @showPage="show" :operaility-data="operailityData"></exam>
  </div>
</template>
<script>
  /* 当前组件必要引入 */
  // 新增
  import index from './physicianPlan_index';
  // 查看
  import exam from './physicianPlan_arrangeExam';
  // 当前组件引入全局的util
  let Util = null
  export default {
    name: '',
    data () {
      return {
        active:'index',
        operailityData:'',
      }
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util;

      },
      show(page,data){
        this.active = page;
        if(data){
          this.operailityData = data;
        }
      },
    },
    created () {
      this.init()
    },
    mounted () {

    },
    components: {index,exam},
  }

</script>

