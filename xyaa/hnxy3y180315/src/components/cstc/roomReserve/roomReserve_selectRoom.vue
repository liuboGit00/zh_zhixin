<!--
****--@file     roomReserve_selectRoom
****--@date     2018/7/20 15:52
****--@author   YC
****--@describe 房间预约-选择房间
-->
<template>
  <div>

  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'roomReserveSelectRoom',
    data () {
      return {};
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
      }

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
