<!----------------------------------
****--@name     member
****--@role     ${*}
****--@date     2018/5/2
****--@author   zzh
----------------------------------->
<template>
    <div class="member">
        <header-title>
            <slot>会员</slot>
        </header-title>
        <div class="stance"></div>
        <ul class="member_header">
            <li>会员权益</li>
            <li>开通会员后可免费使用平台所有专题库</li>
        </ul>

        <ul class="member_content" >
            <li :class="formValidate.deadline == item.deadline?'active':''" v-for="item in VipList" :key="item.id" @click="select(item)">
                <div>{{item.currentPrice | money}}</div>
                <div>{{item.remark}}</div>

            </li>
        </ul>
        <div class="manage-button" v-if="vipStatus !== 1">
            <x-button type="primary" @click.native="PayToVip('1')">办理会员</x-button>
        </div>
        <div class="manage-button"  v-else>
            <x-button type="primary" @click.native="PayToVip('1')">会员续订</x-button>
        </div>
        <!-- <alert v-model="messageShow" title="提示"> 业务办理成功</alert> -->
        <div v-transfer-dom>
          <loading :show="loadShowState" :text="loadShowText"></loading>
          <alert v-model="showAlertState" title="操作提示" @on-hide="backList">{{alertMsg}}</alert>
        </div>
    </div>
</template>
<script>
  /* 当前组件必要引入 */
  import HeaderTitle from '../header'
  import api from './api'
  import { Loading, TransferDomDirective as TransferDom, querystring, Alert, XButton } from 'vux';
  // 当前组件引入全局的util
  let Util = null
  export default {
    data () {
      return {
        appId: 'wx25c6967877bff1ec',
        openId: '',
        loadShowText: '',
        loadShowState: false,
        messageShow:false,
        showAlertState: false,
        alertMsg: '',
        wxConfig: '',
        vipStatus: '',
        vipExpireTime: '',
        VipList: [],
        formValidate: {
          payTypes: '1',
          deadline: ''
        },
        totalPrice:''
      }
    },
    methods: {
      // 初始化请求列表数据
      init () {
//        this.$wechat.onMenuShareTimeline({
//          title: 'hello VUX'
//        })
        // this.vipStatus = this.$store.state.loginInfo.vipStatus;
        
        //获取学生的vip状态
        this.getUserInfo()
        this.getVipList ();

        //是否是微信浏览器
        let {code, state} = this.$route.query;
        if (this.$util.isWeiXin()) {
          if (!code) {
            this.getCode();
          } else {
            this.urlQuery = querystring.parse(state);
            this.getOpenId(code);
          }
        }
      },
      //new
      //获取用户信息
      getUserInfo(){
        let obj = {
          ajaxSuccess: (data, res) => {
            this.vipStatus = data.vipStatus
          },
          url: '/student/getMyInfo',
          method: 'GET',
        }
        this.ajax(obj)
      },
      getCode () {
        let {host, search, protocol} = window.location;
        let params = {
          appid: this.appId,
          redirect_uri: protocol + '//' + host + '/sasmobile/student/commonality/member',
          response_type: 'code',
          scope: 'snsapi_base',
          state: search && search.slice(1) || 'none'
        };
        let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?' + querystring.stringify(params) + '#wechat_redirect';
        window.location = url;
      },
      getOpenId (code) {
        let options = {
          url: api.getOpenId.path,
          params: {code},
          ajaxSuccess: data => {
            if (!data) {
              this.toPayError('微信认证失败');
            } else {
              this.openId = data;
              this.initWxConfig();
            }
          }
        };
        this.ajax(options);
      },
      initWxConfig () {
        let _this = this;
        let url = window.location.href;
        let options = {
          url: api.getJsapiTicket1.path,
          method: api.getJsapiTicket1.method,
          data: {url},
          jsonString: true,
          ajaxSuccess: data => {
            if (data instanceof Object) {
              console.log('微信配置');
              this.wxConfig = data;
            } else {
              this.toPayError('微信支付环境异常');
            }
          }
        };
        this.ajax(options);
      },
      PayToVip (val) {
        // this.$router.push({name: 'member'});
        this.getUserInfo()
        let {wxConfig: {noncestr: nonceStr}} = this;
        this.ajax({
          ajaxSuccess: (data,res) => {
            if (data instanceof Object) {
              this.wxPay(data);
            } else {
              this.toPayError('发起支付失败');
            }
          },
          error: () => this.toPayError('发起支付失败'),
          params: {
            payTypes: 1,
            deadline: this.formValidate.deadline,
            openId: this.openId,
            nonceStr
          },
          url: api.getJsapiTicket.path,
          method: api.getJsapiTicket.method,
        })
      },
      wxPay (data) {
        let _this = this;
//        alert(JSON.stringify(data));
        let payConfig = {
          'appId': data.appid,     //公众号名称，由商户传入
          'timeStamp': data.timestamp,         //时间戳，自1970年以来的秒数
          'nonceStr': data.nonce_str, //随机串
          'package': data.prepay_id,
          'signType': 'MD5',         //微信签名方式：
          'paySign': data.sign //微信签名
        };
//        alert(JSON.stringify(payConfig));
        WeixinJSBridge.invoke('getBrandWCPayRequest', payConfig,
          function (res) {
//            alert(JSON.stringify(res));
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              // 支付成功
              _this.payRes('支付成功');
            } else if (res.err_msg == 'get_brand_wcpay_request：cancel') {
              // 支付过程中用户取消
              _this.payRes('支付取消');
            } else {
              // 支付失败
              _this.payRes('支付失败');
            }
          }
        );
      },
      payRes (msg) {
        this.showLoad(true, msg);
        setTimeout(() => this.backList(), 3000);
      },
      toPayError (msg) {
        this.payError = true;
        this.paying = false;
        this.showLoad();
        this.showAlert(true, msg);
      },
      showLoad (show = false, text = '') {
        this.loadShowText = text;
        this.loadShowState = show;
      },
      showAlert (show = false, msg) {
        this.showAlertState = show;
        this.alertMsg = msg;
      },
      select(item){
        console.log(item)
        this.totalPrice=item.currentPrice;
        this.formValidate.deadline = item.deadline;
      },
      backList () {
        //重新获取
        this.getUserInfo()
        this.showLoad(false);
        this.$router.push({name: 'member'});
      },
      // PayToVip (val) {
      //   console.log(this.formValidate.deadline )
      //   this.ajax({
      //     ajaxSuccess: (data,res) => {
      //       if(res.status.code == '0') {
      //         this.pay(data.orderNo)

      //       }
      //     },
      //       url: api.vipPayment.path,
      //       method: api.vipPayment.method,
      //       data: this.formValidate
      //   })
      // },
      // getUserIp(){
      //   $cip='unknown';
      //   if($_SERVER['REMOYE_ADDR']){
      //     $cip=$_SERVER['REMOYE_ADDR']
      //   }else if(getenv("REMOYE_ADDR")){
      //     $cip=getenv('REMOYE_ADDR')
      //   }
      //   return $ip
      // },
      // pay(val){
      //   this.http.get('https://api.mch.weixin.qq.com/pay/unifiedorder', ({data}) => {
      //     this.wechat.config({
      //       appid:"wx93ea84d052466851",
      //       mch_id:'1482677762',
      //       nonce_str:'',
      //       sign:"",
      //       body:'会员充值',
      //       out_trade_no:val,
      //       total_fee:this.totalPrice,
      //       spbill_create_ip:this.getUserIp(),
      //       notify_url:'http://218.241.184.2:9025/stu/pay/wechat/callback',
      //       trade_type:'MWEB',


      //     })
      //   })
      // },
      /*
           * 获取vip价格
           * */
      getVipList () {
        this.ajax({
          ajaxSuccess: (data,res) => {
            this.VipList = res.data;
            this.formValidate.deadline=this.VipList[0].deadline
          },
            url: api.vipConfigList.path
        })
      },

    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {HeaderTitle,Loading}
  }
</script>
<style lang="scss">
    .member {
        .manage-button{
            padding: 0 0.1rem;
            margin-top: 0.1rem;
        }
        .member_header {
            text-align: center;
            box-sizing: border-box;
            padding: 0.56rem 0 0.85rem 0;
            font-weight: bold;
            > li:nth-of-type(1) {
                font-size: 0.17rem;
                color: rgba(0, 0, 0, 0.8);
                margin-bottom: 0.13rem;
            }
            > li:nth-of-type(2) {
                font-size: 0.12rem;
                color: rgba(98, 98, 98, 0.7);
            }
        }
        .member_content {
            display: flex;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 0 0.15rem;
             li {
                border: 1px solid #11A640;
                border-radius: 0.05rem;
                 line-height: 0.3rem;
                height: 0.66rem;
                text-align: center;
                font-size: 0.15rem;
                color: #11A640;
                font-weight: bold;
                 padding: 0.02rem;
            }
            .active {
                background: #11A640;
                color: #D8EDDD;
            }
        }
    }

</style>
