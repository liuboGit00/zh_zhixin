<!----------------------------------
****--@name     确认招生
****--@role     导师
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal" style="position: absolute;top: 10px;left: 10px;right:10px;bottom: 10px">
    <confirm-ds :url="url" :peport="peport" v-if="typeView=='DS'" :view="view" style="height: 100%"></confirm-ds>
    <confirm-jys :url="url" :peport="peport" v-else-if="!peport && ['KEZR','JXMS'].includes(typeView)"
                 :view="view"></confirm-jys>
      <confirm-jyc :url="url" :peport="peport" v-else-if="typeView=='YJSGL'" :view="view"
                   style="height: 100%"></confirm-jyc>
    <div v-else style="font-size: 18px;text-align: center;line-height: 100px;">
      <strong>您没有此权限呦！</strong>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url from './api';
  //导师审核
  import confirmDs from './confirmAdmissions_DS.vue'
  //教研室审核
  import confirmJys from './confirmAdmissions_JYS.vue'
  //教育处审核
  import confirmJyc from './confirmAdmissions_JYC.vue'
  //当前组件引入全局的util
  let Util=null;
  export default{
    props:['api','view','peport'],
    data(){
      return {
        typeView:'',
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        if(this.api){
          this.url= this.api; // 开题报告填写
        }else {
          this.url = url;// 开题申请填写
        }
        let userInfo = this.$store.getters.getUserInfo;
        this.typeView = userInfo.roleList[0].identify;
        Util = this.$util;
      },
    },
    created(){
      this.init();
    },
    mounted(){
    },
    components:{
      //当前组件引入的子组件
      confirmDs, confirmJys, confirmJyc
    }
  }
</script>

