<!--
****--畅言一下(chatteris)
****--@date     2017/8/7
****--@author   zyc<332533011@qq.com-->
<template>
  <div>
    <el-row>
      <el-input :autosize="{ minRows: 4, maxRows: 8}" type="textarea" v-model="formValidate.comments" placeholder="请填写讨论内容!"></el-input>
      <el-col :span="20">&nbsp;</el-col>
      <el-col :span="4">
        <div class="comment-subBtn">
          <load-btn @listenSubEvent="listenSubEvent" :type="'warning'" :btnData="loadBtn"></load-btn>
        </div>
      </el-col>
    </el-row>
    <div class="commentNum">共<em>{{listTotal}}</em>条讨论</div>
    <el-tabs v-model="activeName">
      <el-tab-pane name="first" label="讨论">
        <div class="comment-list" v-for="(item,index) in commentList" :key="index">
          <div class="comment-list-date">{{conductDate(item.createTime,'yyyy-MM-dd HH:mm:ss')}}</div>
          <div class="comment-list-header">
            <div class="uwUserInfo">
              <div class="userHeadPic"><img :src="http+item.userHeadImg"></div>
            </div>
          </div>
          <div class="comment-user-mess">
            {{item.userName}}
          </div>
          <div class="comment-list-content">
            {{item.comments}}
          </div>
          <div v-if="isShowDel" style="padding: 5px 10px;">
            <el-button @remove="remove(item.id)" type="text">删除</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div v-if="commentList.length>0" class="showMore">
      <el-button @click="queryMore" v-if="isHashMore" type="text">查看更多讨论>></el-button>
      <span v-if="!isHashMore">已经没有更多讨论可查看!</span>
    </div>
    <p style="text-align: center;padding: 50px;" v-else>还没有讨论!</p>
    <!--删除弹窗-->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题" class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "./api";
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      types: { //讨论资源类型
        type: String,
        default: "COURSE", //  教学视频  文档文献  典型病例  医学图谱  VIDEO LITERATURE CASES ATLAS
      },
      comments: { //讨论内容
        type: String,
        default: "",
      },
      isShowDel: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        deleteUrl: api.commentListPage.path,
        operailityData: '',
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },

        removeId: {
          id: 'remove',
          title: '删除'
        },
        loading: false,
        activeName: 'first',
        formValidate: {
          types: this.types,
          resourceId: '',
          comments: this.comments,
        },
        commentList: [],

        //讨论列表、及分页属性
        isHashMore: true,
        params: {
          curPage: 1,
          pageSize: 10
        },
        listTotal: 0,
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.commentListPage.path,
            method: api.commentListPage.method,
            params: {
              types: this.types,
              resourceId: this.$store.state.curriculum.look.course.id
            }
          }
        },

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'saveSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.commentAdd.path,
            method: api.commentAdd.method,
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.formValidate.resourceId = this.$store.state.curriculum.look.course.id;
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.params);
        this.ajax(this.listMessTitle);
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        if (this.formValidate.comments == "") {
          this.showMess("请填写讨论内容!");
          return;
        }
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true)
        this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
        this.formValidate.comments = "";
        this.ajax(this.addMessTitle, isLoadingFun)
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },


      //通过get请求列表数据
      updateListData(responseData) {
        let data = responseData.data;
        this.commentList = data //this.commentList.concat();
        if (this.commentList.length == responseData.totalCount) {
          this.isHashMore = false;
        }
        this.listTotal = responseData.totalCount || 0;
      },

      //删除讨论
      remove(id) {
        this.operailityData = [{
          id: id
        }];
        this.openModel('remove');
      },

      //讨论保存成功
      saveSuccess() {
        this.successMess("讨论成功!");
        this.init();
      },

      //讨论保存失败
      saveError() {
        this.successMess("讨论失败!")
      },

      //点击更多讨论
      queryMore() {
        let num = this.params.curPage;
        this.params = {
          curPage: ++num,
          pageSize: 10
        }

        //this.ajax(this.listMessTitle);
        //查看更多
        let showMoreTitle = {
          ajaxSuccess: (responseData) => {
            let data = responseData.data;
            if (this.commentList.length == responseData.totalCount) {
              this.isHashMore = false;
            }
            this.listTotal = responseData.totalCount || 0;
          },
          errorTitle: '加载更多失败!',
          ajaxParams: {
            url: api.commentListPage.path,
            method: 'get'
          }
        }
        showMoreTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.params);
        this.ajax(showMoreTitle);
      }

    },
    created() {
      Util = this.$util;
      this.init();
    },
    mounted() {},
    computed: {
      userInfo() {
        let info = this.$store.getters.getUserInfo || {};
        return info;
      },
      http() {
        let http = this.$store.state.envPath.http || "";
        return http;
      }
    },
    components: {}
  }

</script>
<style lang="scss">
  /* 用户资料 */

  @import "../../../../../assets/ambuf/css/workbench_v1.0/userInfo";
  @import "../../../../../assets/ambuf/css/videoStudy/default.css";

</style>
