<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2018/4/26
****--@author   zzh
----------------------------------->
<template>
    <div class="theClassOf" ref="theClassOf">
        <header-title>
            <slot>班组群</slot>
        </header-title>
        <div class="stance"></div>
        <flexbox wrap="wrap" justify="space-between" :gutter=0 class="myTeam_header" v-for="(item,index) in showData"
                 :key="index" >
            <flexbox-item>
                <div>{{item.title}}</div>
                <div>
                    <span>创建人</span><span>{{item.managerName}}</span><span>创建时间</span><span>{{item.createTime | formatDate('yyyy-MM-dd HH:mm')}}</span>
                </div>
            </flexbox-item>
            <div class="right_box" @click="open1('theClassOf_content',item.no,item.title)"
                 style="align-items: center;display: flex;justify-content: right">
                <div>{{item.workPaperCount||0}}</div>
                <x-icon type="ios-arrow-forward" size="0.3rem"></x-icon>
            </div>
        </flexbox>
        <div style="color: #000;;box-sizing: border-box;padding: 0.19rem 0.15rem;" @click="open">
            +添加班组群
        </div>
        <!--<div v-transfer-dom>-->
        <!--<confirm v-model="show"-->
        <!--@on-cancel="onCancel"-->
        <!--@on-confirm="onConfirm"-->
        <!--@on-show="onShow"-->
        <!--class="aaa">-->
        <!--<div id="myTeam_inp" style="text-align:center;">-->
        <!--<div style="-->
        <!--font-size:0.18rem;-->
        <!--color:rgba(27,27,27,1);margin-bottom: 10px;-->
        <!--">请输入姓名</div>-->
        <!--<div style="margin-bottom: 10px;-->
        <!--font-size:0.15rem;-->
        <!--color:rgba(149,149,149,1);-->
        <!--">请使用真是姓名，以便教师审核。</div>-->
        <!--<input type="text" style="height: 0.4rem;width: 255px;border: 1px solid #D4D4D4;"/>-->
        <!--</div>-->
        <!--</confirm>-->
        <!--</div>-->
       <!-- <div v-transfer-dom>
            <confirm v-model="show"
                     @on-cancel="onCancel"
                     @on-confirm="onConfirm"
                     @on-show="onShow"
                     @on-hide="onHide" class="bbb">
                &lt;!&ndash; <div id="myTeam_inp1" style="text-align:center;">
                    <div style="font-size:0.18rem;
color:rgba(27,27,27,1);margin-bottom: 20px">请输入班级群号
                    </div>
                    <input type="text" v-model="groupNum"
                           style="height: 0.4rem;width: 2.55rem;border: 1px solid #D4D4D4;"/>
                </div> &ndash;&gt;
                <div style="font-size:0.15rem;color:rgba(27,27,27,1);margin-bottom: 20px">请输入班级群号</div>
                <textarea type="text" v-model="groupNum" class="input" style="height: 0.3rem;font-size:0.15rem;width: 1.3rem;border: 1px solid #D4D4D4;"/>
            </confirm>
        </div>-->
      <confirm v-model="show" title="请输入班级群号" @on-confirm="onConfirm">
        <input v-model="groupNum" @focus="focus" style="height: 0.4rem;width: 90%;border: 1px solid #C2C2C2;">
      </confirm>
        <alert v-model="messageShow" title="提示"> {{message}}</alert>
    </div>
</template>
<script>
/* 当前组件必要引入 */
import HeaderTitle from '../header'
import api from './api'
// 当前组件引入全局的util
let Util = null
export default {
  data () {
    return {
      show: false,
      showData: [],
      groupNum: '',
      messageShow: false,
      message: ''
    }
  },
  methods: {
    // 初始化请求列表数据
    init () {
      this.getQroupList()
    },
    getQroupList () {
      let options = {
        url: api.groupsList.path,
        params: {
          types: ''
        },
        /**
           * 服务端返回的状态码检查,默认状态码检查前执行
           * @param {*} data  服务器端返回的实际数据结构,根据不同业务格式不同
           * @param {object} res 服务器端返回的response值 {data:'**',status:{conde:0,msg:'请求数据成功!'}}
           */
        ajaxSuccess: (data, res) => {
          this.showData = data
        }
      }
      this.ajax(options)
    },
    open1 (type, val, title) {
      this.$router.push({name: type, query: { no: val, title: title}})
    },
    open () {
      this.show = true
    },
    focus () {
      $('html,body').animate({ scrollTop: 140 }, 100)// 点击按钮向下移动140px，时间为800毫秒
    },
    getGroups () {
      let options = {
        url: api.getByNo.path,
        params: {
          no: this.groupNum
        },
        /**
           * 服务端返回的状态码检查,默认状态码检查前执行
           * @param {*} data  服务器端返回的实际数据结构,根据不同业务格式不同
           * @param {object} res 服务器端返回的response值 {data:'**',status:{conde:0,msg:'请求数据成功!'}}
           */
        ajaxSuccess: (data, res) => {
          console.log(res.status)
          if (res.status.code != 0) {
            this.messageShow = true
            this.message = res.status.msg
            return
          }
          this.$router.push({name: 'myTeam', query: {no: this.groupNum}})
        },
        beforeCheckCode: (res, msg) => {
          //          this.message = msg.status.msg
          //          this.messageShow = true
        }
      }
      this.ajax(options)
    },
    shows () {
      this.$router.push({name: 'myTeam'})
    },
    onCancel () {
      console.log('on cancel')
    },
    onConfirm (msg) {
      console.log('on confirm')
      if (msg) {
        alert(msg)
      }
      this.getGroups()
    },
    onHide () {
      console.log('on hide')
    },
    onShow () {
      console.log('on show')
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  components: {HeaderTitle}
}
</script>
<style lang="scss">
    @import '../../../css/child/theClassOf';

    .aaa {
        .weui-dialog {
            top: -250px !important;
            border-radius: 20px;
        }
        .weui-mask {
            background: rgba(0, 0, 0, 0.2);
        }
    }

    .bbb {
        .weui-dialog {
            top: 210px !important;
            border-radius: 20px;
        }
        .weui-mask {
            background: rgba(0, 0, 0, 0.2);
        }
        .input{
          -webkit-appearance:none;
        }
    }
</style>
