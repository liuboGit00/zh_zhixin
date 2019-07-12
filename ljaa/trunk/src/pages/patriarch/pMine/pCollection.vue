<template>
  <div class="all_content">
    <div class="tBook" style="background: #fff;" ref="scroller">
      <scroller lock-x @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :height="top">
        <div class="question_grade" style="margin-bottom: 0.7rem">

          <div class="content" style="height: 1.44rem" v-for="(item,index) in data" :key="index" @click="open(item.id)">
            <img :src="item.icon||'sa'" style="height: 0.9rem;" onerror="this.src='../../../../sasmobile/img/1_07.jpg'"/>
            <div class="homePage_book">
              <div>{{item.title}}</div>
              <div><span> 价格：</span><span v-if="item.productTypes == 0"
                                          class="price">{{item.currentPrice | money}}</span>
                <span v-else class="price">{{item.currentPrice == null ? '0' : item.currentPrice
                            }}积分</span></div>
              <div><span>试卷：</span><span>{{item.spec}}{{item.unit | unit }} </span></div>
              <div style="max-height: 0.4rem;overflow: hidden;display: block">
                <p>{{item.content}}</p>
              </div>
            </div>
          </div>
          <load-more tip="加载更多" :show-loading="false" v-if="this.num*10<this.totalCount"></load-more>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
  import api from './api'
  import {Scroller, LoadMore} from 'vux'

  let Util = null
  export default {
    name: "pCollection",
    data() {
      return {
        data: [],
        studyProduct: {currentPrice: ''},
        num: 1,
        totalCount: 0,
        top: '0',
        temp: false,
        onFetching: false,
      }
    },
    methods: {
      onScrollBottom() {
        if (this.onFetching) {
          if (this.num * 10 < this.totalCount) {
            console.log(this.num * 10, this.totalCount, 888)
            if (this.temp) {
              this.num++;
              this.temp = false
              this.setTableData()
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
      init() {
        this.info = this.$store.state.loginInfo
        this.setTableData()
      },
      setTableData() {
        let options = {
          url: api.myFavoriteList.path,
          method: api.myFavoriteList.method,
          params: {
            productTypes: '',
            curPage: this.num,
            pageSize: 10,
          },
          /**
           * 服务端返回的状态码检查,默认状态码检查前执行
           * @param {*} data  服务器端返回的实际数据结构,根据不同业务格式不同
           * @param {object} res 服务器端返回的response值 {data:'**',status:{conde:0,msg:'请求数据成功!'}}
           */
          ajaxSuccess: (data, res) => {
            this.data = this.data.concat(data['dataList'])
            this.totalCount = data.totalCount;
            this.data.map((item) => {
              item.icon = this.getStaticPath(item.icon)
            })
            this.temp = true;
          }
        }
        this.ajax(options)
      },
      open(id) {
        this.$router.push({name: 'questionGradeContents', query: {id: id, studentId: this.info.id}})
      },
    },
    created() {
      this.init()
    },
    mounted() {
      this.top = -(this.$refs.scroller.offsetTop) + '';
    },
    components: {
      Scroller, LoadMore
    }
  }
</script>

<style lang="scss">
  @import "../../../css/questionbank";
  @import '../../../css/question_child/question_grade';
</style>
