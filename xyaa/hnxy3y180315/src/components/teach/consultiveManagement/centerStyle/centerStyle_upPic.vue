<!----------------------------------
****--@name     中心风采
****--@role     ${*}
****--@date     2018/3/16
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-row>
      <el-col :span="20" :offset="4">
        <upload-photo-wall actionUrl="/file/upload/static" onlyOnePic="true" :fileList="fileList"
                           @upladSuccess="upladSuccess"></upload-photo-wall>
        <div align="center">
          <el-button type="primary" @click="success">确定</el-button>
        </div>
      </el-col>
    </el-row>
  </div>

</template>
<script>
  //引入当前注册的组件
  import uploadPhotoWall from '../../../common/uploadPhotoWall.vue'
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'url', 'moduleId', 'fileList'],
    data() {
      return {
        fileLists: {
          fileList: [
            {src: this.fileList[0] && this.fileList[0].src,}
          ],
          index: '',
          arr: this.fileList || [],
        },
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //初始化
//      this.init();
    },
    methods: {
      upladSuccess(fileList, index, arr) {
        this.fileLists = {fileList, index, arr}
      },

      success() {
        this.$emit('uploadSuccess', this.fileLists)
      }
    },
    components: {
      uploadPhotoWall
    }
  }
</script>
