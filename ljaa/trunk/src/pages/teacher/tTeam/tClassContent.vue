<!----------------------------------
****--@name     tClassContent
****--@role     ${*}
****--@date     2018/5/7
****--@author   zzh
----------------------------------->
<template>
    <div class="tClassContent">
      <header-title>{{$route.query.name}}</header-title>
      <div class="stance"></div>
      <ul class="header">
        <li @click="open('tBook')" >
           <b :class="selectTab=='tBook'?'green':''"> 作业</b>
        </li>
        <li @click="open('tEvaluation')">
         <b :class="selectTab=='tEvaluation'?'green':''">
              测评
         </b>
        </li>
        <li @click="toMessage('theClassOf_name')"><span>i</span>群信息</li>
      </ul>
       <div class="tBookAdd" @click="makeWork('tHomework',$route.query.name)"><p style="font-size: 0.4rem;margin-top: -0.01rem;">+</p></div>
      <router-view/>

    </div>
</template>
<script>
/* 当前组件必要引入 */
import HeaderTitle from '../header'
// 当前组件引入全局的util
// let Util = null
export default {
  data () {
    return {
      selectTab: 'tBook',
    }
  },
  methods: {
    // 初始化请求列表数据
    init () {
        console.log(window.select)
      if(window.select=='test'){
          this.selectTab='tEvaluation';
          this.open('tEvaluation')
      }
    },
    toMessage (type) {
      this.$router.push({
        name: type,
        query: {groupsId: this.$route.query.groupsId, type: 'teacher', groupType: this.$route.query.type}
      })
    },
    open (type) {
      if (type == 'tBook') {
        this.selectTab = 'tBook'
      } else if (type = 'tEvaluation') {
        this.selectTab = 'tEvaluation'
      }
      this.$router.push({name: type, query: {groupsId: this.$route.query.groupsId, name: this.$route.query.name}})
    },
    makeWork (type,name) {
      this.$store.commit('papers/destroy')
      this.$router.push({
        name: type,
        query: {groupsId: this.$route.query.groupsId, type: this.selectTab == 'tBook' ? 'homework' : 'intelligent',name:name}
      })

    },
  },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {HeaderTitle},
    watch:{
      '$route'(to,from){
        console.log(this.$store.state.allowBack)
        if(to.name=='tEvaluation'){
          this.selectTab=to.name;
        }else {
          this.selectTab='tBook'
        }
      }

    }
}
</script>
<style lang="scss">
  @import "../../../tcss/tClassContent";
</style>
