<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2018/4/24
****--@author   zzh
----------------------------------->
<template>
    <div id="allBook">
        <div style="height: 0.43rem"></div>
        <div ref="scroller">
        <scroller lock-x  @on-scroll-bottom="onScrollBottom" ref="scrollerBottom"
                  :scroll-bottom-offst="200" v-if="data.length">
            <div >
                <p class="message" v-if="!data.length">暂无数据</p>
            <div class="content" v-for="(item,index) in data" :key="index">
                <!--<div>-->
                <!--<img :src="item.icon"  src="../../../../sasmobile/img/1_07.jpg" />-->
                <!--</div>-->
                <section class="shopList" style="">
                    <!--<p class="title">-->
                    <!--订单编号:{{item.no}} </b>-->
                    <!--<span><el-button v-if="item.status ==0 && item.restTime > 0"-->
                    <!--@click="removeOrder(item.id)">取消订单</el-button></span>-->
                    <!--<span v-if="item.status == 0 && item.restTime > 0">剩余付款时间： <span></span> {{ timeArr[index] | formatHours-->
                    <!--}} </span>-->
                    <!--</p>-->
                    <div class="shop" v-for="(child,ind) in item.productList" :key="ind" style="height: 1.15rem">
                        <div><img class="img" :src="getStaticPath(child.icon)"
                                  onerror="javascript:this.src='../../../../sasmobile/img/1_07.jpg'"/>
                            <ul class="ul">
                                <li class="tag">{{child.title}}</li>
                                <li> 试卷<span>{{child.spec}}{{child.unit | unit}}</span></li>
                                <li> 订单编号：{{item.no}} </li>
                                <li class="price"><span v-if="child.productTypes == 0"
                                                        class="price">{{child.currentPrice | money}}</span>
                                    <span v-else class="price">{{child.currentPrice == null ? '0' : child.currentPrice
                                        }}积分</span></li>
                                <div style="float: left" class="btn">
                                    <dl v-if="item.status ==0 && item.restTime > 0">
                                        <!--<router-link style="color: #fff"-->
                                        <!--:to="{path:'/selfcenter/shopcar',query:{id:item.id}}">-->
                                        <button @click="PayClick(item)" class="green">去支付</button>
                                        <button v-if="item.status ==0 && item.restTime > 0"
                                                @click="removeOrder(item.id)" class="white">取消
                                        </button>
                                        <span class="last"
                                              v-if="item.status == 0 && item.restTime > 0">剩余时间： <span></span> {{ timeArr[index] | formatHours}} </span>
                                        <!--<dd style="color: #434343;line-height: 44px;cursor: pointer" >-->
                                        <!---->
                                        <!--</dd>-->
                                    </dl>
                                    <dl v-if="item.status ==1 && item.orderTypes == 0">
                                        <!--<dt><span class="close">{{child.currentPrice | money}}</span></dt>-->
                                        <button class="yellow">已完成</button>
                                        <!--<dd style="color: #fd7416;">支付成功</dd>-->
                                    </dl>
                                    <dl v-else-if="item.status == 2 || item.restTime < 0">
                                        <button style="width: 0.7rem">交易关闭 </button>
                                        <!--<dd><span style="color: #b5b5b5">交易关闭</span></dd>-->
                                    </dl>
                                    <dl v-else-if="item.orderTypes == 1">
                                        <dd>兑换成功</dd>
                                    </dl>
                                </div>
                            </ul>
                            　
                        </div>
                    </div>
                </section>
                <div style="clear: both"></div>
            </div>

                <load-more tip="加载更多" :show-loading="false" v-if="this.num*10<this.totalCount"></load-more>
            </div>
        </scroller>
        </div>
        <confirm v-model="showCancel"
                 title="提示"
                 @on-confirm="onConfirm">
            <p>确认取消订单吗？</p>
        </confirm>
        <alert title="成功" v-model="showSuccess">取消成功</alert>
    </div>
</template>
<script>
  /* 当前组件必要引入 */

  // 当前组件引入全局的util
  import Alert from '../../../../node_modules/vux/src/components/alert/index.vue'
  import { Badge, Group, Cell,Scroller, Divider, Spinner, XButton, LoadMore } from 'vux'
  let Util = null
  import api from './api'
  import ButtonTab from '../../../../node_modules/vux/src/components/button-tab/button-tab.vue'

  export default {
    data () {
      return {
        top:'0',
        data: [],
        resourceHttp: '',
        showCancel: false,
        showSuccess: false,
        num: 1,
        totalCount: 0,
        onFetching: false,
        temp: false,
        timeArr: [], //时间数组
      }
    },
    methods: {
      PayClick (data) {
        if (data.totalPrice <= 0) {
//          this.successMess('购买成功')
        } else {
          this.$router.push({name: 'buy', query: {productIds: data.id,no: data.no}})
        }

//        this.ajax({
//          ajaxSuccess: (data, res) => {
//            if (res.status.code == '0') {
//              this.pay(data.orderNo)
//
//            }
//          },
//          url: api.payment.path,
//          method: api.payment.method,
//          data: {
//            orderId: val,
//            payTypes: 1
//          }
//        })
      },
      onScrollBottom () {

        if (this.onFetching) {
          if (this.num * 10 < this.totalCount) {
            if (this.temp) {
              this.temp=false
              this.num++
              this.getOrderList()
            }
          } else {

          }

        } else {
          this.onFetching = true
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.scrollerBottom.reset()
            })
            this.onFetching = false
          }, 2000)
        }
      },
      // 初始化请求列表数据
      onConfirm () {
        let options = {
          url: api.cancelOrder.path,
          method: api.cancelOrder.method,
          data: {
            orderId: this.orderId
          },
          /**
           * 服务端返回的状态码检查,默认状态码检查前执行
           * @param {*} data  服务器端返回的实际数据结构,根据不同业务格式不同
           * @param {object} res 服务器端返回的response值 {data:'**',status:{conde:0,msg:'请求数据成功!'}}
           */
          ajaxSuccess: (data, res) => {
            this.showSuccess = true
            this.data=[];
            this.getOrderList()
          },
        }
        this.ajax(options)

      },
      removeOrder (val) {
        this.showCancel = true
        this.orderId = val
      },
      init () {
        this.getOrderList();
        this.data=[];
        console.log(1)
      },
      onScrollBottom () {

        if (this.onFetching) {
          if (this.num * 10 < this.totalCount) {
            if (this.temp) {
              this.num++
              this.getOrderList()
            }
          } else {

          }

        } else {
          this.onFetching = true
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.scrollerBottom.reset()
            })
            this.onFetching = false
          }, 2000)
        }
      },
      settimeFn (langtime) {//改变时间
        let that = this
        let arr = []
        this.data.map(item => {
          let ordertime = item.createTime + 1000 * 60 * 60 * 24
          let nowTime = new Date().getTime()
          let restTime = ordertime - nowTime
          if (restTime > 1000 * 60 * 60 * 24) {
            item.restTime = (1000 * 60 * 60 * 24 - langtime)
            if (item.restTime > 0) {
              arr.push(item.restTime)
            }
          } else {
            item.restTime = (restTime - langtime)
            if (item.restTime > 0) {
              arr.push(item.restTime)
            }
          }
        })
        this.timeArr = arr
      },
      countDown () {//倒计时
        let that = this
        this.settimeFn(1000)

        //先清除定时器
        clearInterval(that.times)
        that.times = null

        this.times = setInterval(function () {
          if (that.timeArr.length > 0) {
            let arr = []
            that.timeArr.map(item => {
              arr.push(item - 1000)
            })
            that.timeArr = arr
          } else {
            clearInterval(that.times)
            that.times = null
          }
        }, 1000)
      },
      open () {
        this.$router.push({name: 'allBook_content'})

      },
      getOrderList () {

        let options = {
          url: api.orderList.path,
          params: {
            orderTypes: this.$route.query.orderTypes,
            status: this.$route.query.status,
            curPage: this.num,
            pageSize: 10,
            studentId:this.$store.state.loginInfo.id,
          },
          /**
           * 服务端返回的状态码检查,默认状态码检查前执行
           * @param {*} data  服务器端返回的实际数据结构,根据不同业务格式不同
           * @param {object} res 服务器端返回的response值 {data:'**',status:{conde:0,msg:'请求数据成功!'}}
           */
          ajaxSuccess: (data, res) => {
            this.temp=true;
            this.data = this.data.concat(data.dataList);
            console.log(this.data)
            this.totalCount = data.totalCount
            this.countDown(this.data)
          },
        }
        this.ajax(options)

      },
    },
    created () {
      this.init()
    },
    mounted () {
      this.top=-this.$refs.scroller.offsetTop+''
    },
    watch: {
      $route (to, from) {
        this.data=[];
        this.num=1;
        this.getOrderList();

      }
    },
    beforeDestroy(){  
      console.log('退出了组件')
      clearInterval(this.times)
      this.times = null
    },
    components: {
      ButtonTab,
      Alert,Badge, Group, Cell,Scroller, Divider, Spinner, XButton, LoadMore}
  }
</script>
<style lang="scss">
    @import '../../../css/child/allBook';
</style>
