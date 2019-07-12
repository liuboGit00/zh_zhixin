<!--
****--@file     deviceEnvironmental_list
****--@date     2018/4/19 15:23
****--@author   YC
****--@describe 设备环境
-->
<template>
  <device-content contentType="device"></device-content>
</template>
<script>
  /*当前组件必要引入*/
  import deviceContent from '../centerStyle/centerStyle_list'
  //当前组件引入全局的util
  let Util = null
  export default {
    name: 'deviceEnvironmentalList',
    data () {
      return {}
    },
    methods: {
      //初始化请求列表数据
      init () {

      },

    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {deviceContent},
  }

</script>
