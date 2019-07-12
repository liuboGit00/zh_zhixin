<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2018/4/24
****--@author   zzh
----------------------------------->
<template>
    <div class="questionGradeContent">
        <div v-transfer-dom>
            <alert v-model="showNoDouble" title="提示"> 以下商品您已购买过，不能重复购买</alert>
        </div>
        <group>
            <alert title="提示" v-model="accessOrder" @on-hide="openRouter">
                <p>还有订单尚未支付？前往支付</p>
            </alert>
            <alert title="提示" v-model="message">
                <p>积分不足</p>
            </alert>
            <alert title="提示" v-model="message1">
                <p>您还未绑定学生！</p>
            </alert>
            <alert title="提示" v-model="jifenBuy" @on-hide="handleBuy">
                <p>此商品需{{needCoal}}积分，您当前{{myCoal}}积分，是否需要购买？</p>
            </alert>
        </group>
        <header-title>
            <slot>商品详情</slot>
        </header-title>
        <!--<div class="stance"></div>-->
        <div class="headerImg">
            <!--<img style="height: 2.68rem;width: 100%" src="../../../../sasmobile/img/30_02.jpg" alt="">-->
            <swiper :list="imgList" v-model="demo01_index"  style="width: 100%" height="4.8rem" @on-get-height="swiperHeight"
                    @on-index-change="onIndexChange"></swiper>
            <div class="headerImg_tab">
                <div class="priceLeft" style="font-size: 0.12rem"><span>价格：</span><span
                        v-if="studyProduct.productTypes == 0"
                        class="price">{{studyProduct.currentPrice | money}}</span>
                    <span v-else class="price">{{studyProduct.currentPrice == null ? '0' : studyProduct.currentPrice
                        }}积分</span></div>
                <div @click="collection(studyProduct.productTypes)"> 加入收藏</div>
                <div  class="active" v-if="studyProduct.productTypes == 1" @click="exchange(studyProduct.currentPrice)">立即兑换</div>
                <div v-else @click="open" class="active">立刻购买</div>

            </div>
            <div class="headerImg_content">
                <div>
                    <h3>商品介绍</h3>
                    <div>
                        {{studyProduct.remark}}
                    </div>
                </div>
                <div>
                    <h3>商品内容</h3>
                    <div>
                        {{studyProduct.content}}
                    </div>
                </div>
                <div>
                    <h3>商品目标</h3>
                    <div>
                        {{studyProduct.target}}
                    </div>
                </div>
                <div>
                    <h3>商品优势</h3>
                    <div>
                        {{studyProduct.advantage}}
                    </div>
                </div>
            </div>
        </div>
      <alert v-model="alertShow">{{messages}}</alert>
    </div>
</template>
<script>
  /* 当前组件必要引入 */
  import HeaderTitle from '../header'
  import api from './api'
  import Alert from '../../../../node_modules/vux/src/components/alert/index.vue'
import { fail } from 'assert';
  // 当前组件引入全局的util
  // let Util = null
  export default {
    data () {
      return {
        alertShow: false,
        messages: '',
        studyProduct: {currentPrice: ''},
        demo01_index: 0,
        imgList: [],
        showNoDouble: false,
        accessOrder: false,
        message: false,
        message1: false,
        //积分兑换
        myCoal: '',   //我的积分
        needCoal: '',  //需要的积分
        jifenBuy: false
      }
    },
    methods: {
      openRouter () {
        this.$router.push({name: 'allBook'})
      },
      // 初始化请求列表数据
      init () {
        this.getDetail()
      },
      onIndexChange (index) {
        console.log(index)
        this.demo01_index = index
      },
      swiperHeight(height){
        console.log(height)
      },
      getDetail () {
        console.log(3)
        let options = {
          url: api.productGet.path,
          params: {
            id: this.$route.query.id
          },
          /**
           * 服务端返回的状态码检查,默认状态码检查前执行
           * @param {*} data  服务器端返回的实际数据结构,根据不同业务格式不同
           * @param {object} res 服务器端返回的response值 {data:'**',status:{conde:0,msg:'请求数据成功!'}}
           */
          ajaxSuccess: (data, res) => {
            this.studyProduct = data
            console.log(res,'ppppppppppp')
            // this.studyProduct.imgs.split(',')
            // console.log(this.studyProduct.imgs.split(','))
            this.imgList = []
            // this.imgList = this.studyProduct.imgs.split(',')
            // this.imgList.push(this.getStaticPath(this.studyProduct.imgs))
            if (this.studyProduct.imgs) {
              this.studyProduct.imgs.split(',').map((item) => {
                this.imgList.push({img:this.getStaticPath(item)})
                console.log(this.getStaticPath(item))
              })
            }
            console.log(this.imgList)
          }
        }
        this.ajax(options)
      },
      change (type) {
        this.type = type
      },
      //积分兑换
      exchange(cen){
        if(this.$store.state.loginInfo.integral === 'undefined' || !this.$store.state.loginInfo || !this.$store.state.loginInfo.integral){
          this.message1 = true;
          return
        }
        if (cen && cen > this.$store.state.loginInfo.integral) {
          this.message=true;
        }else if(cen && cen <= this.$store.state.loginInfo.integral){
          this.myCoal = this.$store.state.loginInfo.integral;
          this.needCoal = cen
          this.jifenBuy=true;
        }
      },
      //加入收藏
      collection(res) {
        console.log(res)
        let options = {
          url: api.productFavorite.path,
          method: api.productFavorite.method,
          data: {
            productId: this.studyProduct.id,
            productTypes: res,
          },
          /**
           * 服务端返回的状态码检查,默认状态码检查前执行
           * @param {*} data  服务器端返回的实际数据结构,根据不同业务格式不同
           * @param {object} res 服务器端返回的response值 {data:'**',status:{conde:0,msg:'请求数据成功!'}}
           */
          ajaxSuccess: (data, res) => {
            console.log(res)
            if (res.status.code == '0') {
              console.log('回调执行')
              this.alertShow = true
              return this.messages = '收藏成功'
              console.log(this.studyProduct.currentPrice)
              // if (this.studyProduct.currentPrice <= 0) {
              //
              // } else {
              //   console.log(data.id)
              //   console.log(data.id)
              //   this.$router.push({name: 'buy', query: {productIds: data.id, no: data.no}})
              //   console.log(this.$router)
              // }

            } else {
              this.alertShow = true
              return this.messages = res.status.msg
            }
          },
//           beforeCheckCode: (data, res) => {
//             console.log(res)
//             if (res.status.code == '56') {
//               this.showNoDouble = true
//               console.log(this.accessOrder)
//             } else if (res.status.code == '55') {
//
//               this.accessOrder = true
//             }
// //            }
//           }
        }
        this.ajax(options)
      },
      handleBuy(){
        let options = {
          url: api.integralPay.path,
          method: api.integralPay.method,
          data: {
            productId: this.studyProduct.id,
            studentId: this.$store.state.loginInfo.id
          },
          ajaxSuccess: (data, res) => {
            if(res.status.code == '0'){
              this.alertShow = true
              return this.messages = '兑换成功！'
            }
          },
          beforeCheckCode: (data, res) => {
            if (res.status.code == '56') {
              this.alertShow = true
              return this.messages = res.status.msg
            } else if (res.status.code == '55') {
            }
          }
        }
        this.ajax(options)
      },
      open (cen) {
        let options = {
          url: api.toOrder.path,
          method: api.toOrder.method,
          data: {
            productIds: this.studyProduct.id,
            studentId:this.$route.query.studentId,
          },
          /**
           * 服务端返回的状态码检查,默认状态码检查前执行
           * @param {*} data  服务器端返回的实际数据结构,根据不同业务格式不同
           * @param {object} res 服务器端返回的response值 {data:'**',status:{conde:0,msg:'请求数据成功!'}}
           */
          ajaxSuccess: (data, res) => {
            console.log(res)
            if (res.status.code == '0') {
              console.log('回调执行')
              console.log(this.studyProduct.currentPrice)
              if (this.studyProduct.currentPrice <= 0) {
                console.log('执行购买成功')
                this.successMess('购买成功')
              } else {
                 console.log(data.id)
                  console.log(data.id)
                this.$router.push({name: 'buy', query: {productIds: data.id, no: data.no}})
                console.log(this.$router)
              }
            }
          },
          beforeCheckCode: (data, res) => {
            console.log(res)
            if (res.status.code == '56') {
              this.showNoDouble = true
              console.log(this.accessOrder)
            } else if (res.status.code == '55') {

              this.accessOrder = true
            }
            //             else if (res.status.code == '4') {
//              this.$util.setStore('loginGo', `/questionBankDetail?name=${id}`)
//            }
          }
        }
        this.ajax(options)

      }
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {
      Alert,
      HeaderTitle
    }
  }
</script>
<style lang="scss">
    @import '../../../css/question_child/questionGradeContent';
</style>

