<!--
****--@file     selectTree
****--@date     2018/12/19 14:35
****--@author   WH
****--@describe   选择树
-->
<template>
  <div style="height: 500px">
    <tree-menu slot="left" @tree-click="treeClick" :treeOptions="leftTreeOpt.treeDefaults" :fromWhereTreeType="leftTreeOpt.fromWhereTree"
               @setCurrSltNodeId="setCurrSltNodeId"></tree-menu>
    <el-col style="text-align: center">
         <el-button type="primary" @click="sure">确定</el-button>
      <el-button @click="$emit('cancel')">取消</el-button>
    </el-col>
  </div>
</template>
<script>
  import treeMenu from "../../treeAssets/menu";
  import treeApi from '../../treeAssetsApi';
    /*当前组件必要引入*/
    let Util = null
    export default {
        data () {
            return {
              resOpt:{},
              // 左侧菜单
              leftTreeOpt: {
                //tree默认项设置
                treeDefaults: {
                  getTreeUrl: treeApi.tree.path, //目录树结构请求地址
                  baseUrl: treeApi.baseUrl,
                  // getDataUrl: '', //获取目录树叶子节点请求数据地址
                  isShowSearch: false, // 隐藏搜索
                  isShowMenus: false, // 隐藏操作菜单
                },
                fromWhereTree: "user", // 菜单类型
              },
            }
        },
        methods: {
            //初始化请求列表数据
            init () {
                Util = this.$util
            },
          treeClick(res){
            console.log(res)
            this.resOpt=res

          },
          // 设置默认ID
          setCurrSltNodeId(id,opt) {
            console.log(opt)
//        this.deActiveName = 'manage'
          },
          sure(){
            if(!this.resOpt){
              this.errorMess('请选择资产')
              return
            }
            this.$emit('select',this.resOpt)
          }

        },
        created () {
            this.init();
        },
        mounted () {
        },
        components: {
          treeMenu
        }
    }

</script>
<style lang="scss">

</style>
