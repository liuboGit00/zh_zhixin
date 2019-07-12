<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名：">{{ viewData.userName }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="科室：">{{ viewData.depName }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="入科时间：">{{ viewData.rotaryBeginTime }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="报到时间：">{{ viewData.registerTime }}
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-form-item label="带教老师：">
            <span class="deptReported">{{ selectTeacherNames.concat(teacherNames).join('，') }}</span>
            <el-button type="success" size="mini" @click="selectUser">选择带教老师</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <div align="center" style="margin-top:10px;">
        <el-col :span="6" :offset="6">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
        <el-col :span="6">
          <el-button @click="cancel">取消</el-button>
        </el-col>
      </div>
    </el-row>
    <!--选择考场管理员-->
    <Modal :mask-closable="false" width="890" v-model="selectUserModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <!-- 此处人员还未对应 -->
      <select-user v-if="selectUserModal" @cancel="closeSltUser" @setUsers="setUsers" :initUser="initUser"
                   :treeOptions="treeDefaults" :selectOption="selectOption"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from './api';
  import selectUser from '../../../common/selectUser';

  export default {
    props: ['operailityData', 'signType'],
    data() {
      return {
        initUser: [],
        teacherIds: [],
        selectTeacherIds: [],
        teacherNames: [],
        selectTeacherNames: [],

        viewData: {},
        loadBtn: {
          title: '确定',
          callParEvent: 'listenSubEvent'
        },
        treeDefaults: {
          getTreeUrl: 'teacherType/tree?rootId=-101',
          getDataUrl: '',
          isShowMenus: true,
        },
        //搜索option
        selectOption: {
          url: '/archives/query/teachNoPage?typeId='
        },
        addMessTitle: {
          type: 'depSign',
          successTitle: '报到成功!',
          errorTitle: '报到失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.signDep.path + this.operailityData.podId,
            method: api.signDep.method
          }
        },
        editMessTitle: {
          type: 'depSign',
          successTitle: '更换成功!',
          errorTitle: '更换失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.modifyDjTeacher.path,
            method: api.modifyDjTeacher.method,
            data: {
              podId: this.operailityData.podId,
            }

          }
        },
        selectUserModal: false,
        selectUserId: {
          id: 'selectUserId',
          title: '选择带教老师'
        }
      }
    },
    methods: {
      getInfo() {
        let opt = {
          ajaxSuccess: res => {
            this.viewData = res.data;
            this.selectTeacherIds = res.data.teacherIds && res.data.teacherIds.split(',') || [];
            this.selectTeacherNames = res.data.teacherNames && res.data.teacherNames.split(',') || [];
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.podId,
            method: api.get.method,
          }
        }
        this.ajax(opt)
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        // 如果一开始没有选择带教老师，那么必须选择一位带教老师，否则可以直接提交
        if (!this.selectTeacherIds.length && !this.teacherIds.length) {
          this.errorMess('请选择带教老师！')
          return
        }
        if (!isLoadingFun) isLoadingFun = function () {
        };
        isLoadingFun(true);
        let teacherIds = this.teacherIds.join(',');
        let teacherNames = this.teacherNames.join(',');
        let messTitle = this.signType == 'modifyDjTeacher' ? this.editMessTitle : this.addMessTitle;
        messTitle.ajaxParams.data = {
          teacherIds,
          teacherNames,
          podId: this.operailityData.podId,
        };
        this.ajax(messTitle, isLoadingFun)
      },
      // 取消
      cancel() {
        this.$emit('cancel', this.addMessTitle.type)
      },
      // 取消选择带教老师
      closeSltUser() {
        this.selectUserModal = false
      },
      // 选择人员
      selectUser() {
        // let teacherIds = this.teacherIds;
        // let teacherNames = this.teacherNames;
        this.initUser.length = 0;
        // if (teacherIds.length) {
        //   teacherIds.map((key, index) => {
        //     this.initUser.push({
        //       key:+key,
        //       label: teacherNames[index],
        //       description: '人员id---' + key + '的描述信息',
        //       disabled: false
        //     })
        //   })
        // }
        // console.log(this.initUser);
        this.selectUserModal = true;
      },
      // 选择人员
      setUsers(res) {
        // this.teacherIds.length = 0;
        // this.teacherNames.length = 0;
        res.map(item => {
          if (!this.teacherIds.includes(item.key)) {
            this.teacherNames.push(item.label);
            this.teacherIds.push(item.key)
          }
        })
        this.closeSltUser()
      },
    },
    components: {
      selectUser
    },
    created() {
      this.getInfo()
    }
  }

</script>

<style lang="scss">
  .deptReported {
    margin-right: 10px;
    &:empty {
      margin-right: 0
    }
  }

</style>
