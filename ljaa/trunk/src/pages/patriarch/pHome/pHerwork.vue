<!----------------------------------
****--@name     pHerwork
****--@role     ${*}
****--@date     2018/5/2
****--@author   zzh
----------------------------------->
<template>
    <div class="pHerwork patriarch">
        <header-title>
            <slot>TA的<template v-if="$route.query.type=='homework'">作业</template><template v-else>测评</template></slot>
        </header-title>
        <div style="height: 0.01rem" ref="scroller"></div>

        <scroller lock-x  @on-scroll-bottom="onScrollBottom" ref="scrollerBottom"
                  :scroll-bottom-offst="200">

            <div >

                <div class="hello_img">
                    <img style="width: 0.7rem;height: 0.7rem"  :src="getStaticPath(info.icon)" onerror="this.src='../../../../sasmobile/img/03.jpg'" alt="">
                    <div>{{info.name}}</div>
                    <div class="school">
                        <!--<span style="width: 50%;text-align: right;display: inline-block;float: left;height: 0.12rem">{{info.school || '暂无'}} </span>-->
                        <span class="middle" >
                               |
                         <span class="left" style="">{{info.school || '暂无'}}</span>
                         <span class="right" style="">{{info.grade | grade(self)}}</span>
                     </span>
                        <!--<span style="width: 50%;display: inline-block;float: left;text-align: left">{{info.grade | grade(self)}}</span>-->
                    </div>
                </div>
                <div v-if="$route.query.type=='homework'" v-for="(item,index) in dataWorkList" :key='item.index'>
                    <div class="month topMonth">
                        {{item[0].num}}月
                    </div>
                    <div class="list-content" v-for='(item1,index1) in item' :key='item1.index1'>
                        <button @click="openWork('homework',item1)" v-if="item1.isFinished"  class="green" mini>已完成</button>
                        <button @click="openWork('homework',item1)" v-else class="red" mini>未完成</button>
                        <ul class="ul">
                            <li class="hTitle" style="margin-top: 0.16rem">{{item1.title}}  </li>
                            <li class="month">
                                <span>共 {{item1.totalQuestions}}小题 |</span>
                                <span>上交时间：{{item1.submitTime | formatDate('MM-dd HH:mm')}} |</span>
                                <span>{{item1.finishedNums}}人已上交 </span>
                            </li>
                            <li class="hTitle"><span class="month">发布者：</span><span
                                    class="name">{{item1.teacherName}}</span></li>
                            <li><span class="month">发布时间：</span><span class="name">{{item1.startTime| formatDate('MM月dd日 HH:mm')}}</span></li>
                        </ul>
                    </div>
                </div>
                <div  v-for="(item,index) in dataTestList" :key='item.index'>
                    <div class="month topMonth">
                        {{item[0].num}}月
                    </div>
                    <div class="list-content" v-for='(item1,index1) in item' :key='item1.index1'>
                        <button  v-if="item1.answerStatus !== 0" class="green" @click="openWork('test',item1)" mini>已完成</button>
                        <button v-else class="red" @click="openWork('test',item1)" mini>未完成</button>
                        <ul class="ul">
                            <li class="hTitle" style="margin-top: 0.16rem">{{item1.name}}  </li>
                            <li class="month">
                                <span>共 {{item1.questionsNums}}小题 |</span>
                                <span>上交时间：{{item1.endTime | formatDate('MM-dd HH:mm')}} |</span>
                                <span>{{item1.submitNum}}人已上交 </span>
                            </li>
                            <li class="hTitle"><span class="month">发布者：</span><span
                                    class="name">{{item1.operatorName}}</span></li>
                            <li><span class="month">发布时间：</span><span class="name">{{item1.releaseTime| formatDate('MM月dd日 HH:mm')}}</span></li>
                        </ul>
                    </div>
                </div>
              <!--<load-more tip="加载更多" :show-loading="false" v-if="this.num*10<this.totalCount"></load-more>-->
              <load-more tip="加载完毕" :show-loading="false" v-if="num*10>=totalCount"></load-more>
            </div>
        </scroller>
    </div>
</template>
<script>
  import HeaderTitle from '../header'
  import {Scroller, LoadMore} from 'vux'
  import api from './api'

  export default {
    data () {
      return {
        self: this,
        onFetching: false,
        temp: false,
        articles: [],
        type: 1,
        data: [],
        num: 1,
        dataWorkList: {},
        datalist: {},
        info: {id:''},
        totalCount: 0,
        dataTestList: {},
        top:'0'
      }
    },
    methods: {
      openWork (type, item) {
        this.$router.push({name: 'homeworkRes', params: {id: item.id, type: type, studentId: this.info.id}, query: {groupsId: item.groupsId, seeType: 'parents'}})
      },
      onScrollBottom () {
        console.log(this.totalCount)
        if (this.onFetching) {
          if (this.num * 10 < this.totalCount) {
            if (this.temp) {
              this.num++
              this.temp = false
              this.$route.query.type == 'homework' ? this.setWorkData() : this.setTestDate()
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
      open (type) {
        if (type === 3) {
          this.$router.push({name: 'pHerquestion'})
        }
      },
      init () {
        this.info = this.$store.state.loginInfo;
        this.$route.query.type == 'homework' ? this.setWorkData() : this.setTestDate()

        console.log(this.info)
      },
      setWorkData () {//获取作业

        console.log(this.info.id)
        this.ajax({
          ajaxSuccess: (data, res) => {this.getHistorySuccess(res)},
          url: api.historyWorkList.path,
          method: api.historyWorkList.method,
          params: {
            studentId: this.info.id,
            curPage: this.num,
            pageSize: 10
          },

        })
      },
      setTestDate () {//获取测评
        this.ajax({
          ajaxSuccess: (data, res) => {this.getHistoryTestSuccess(res)},
          url: api.historyTestList.path,
          method: api.historyTestList.method,
          params: {
            studentId: this.info.id,
            curPage: this.num,
            pageSize: 10
          },

        })
      },

      //获取作业成功
      getHistorySuccess (res) {
        this.temp = true
        this.totalCount = res.data.totalCount
        if (res.data) {

          res.data.dataList.reduce((obj, item, index) => {
            let month = this.conductDate(item.startTime, 'MM')
            item.num = month
            return obj

          }, {})
        }
        // let datalist = {}

        res.data.dataList.map(item => {
          if (this.datalist[item.num]) {
            this.datalist[item.num].push(item)
          } else {
            this.datalist[item.num] = [item]
          }
        })

        this.dataWorkList = Object.assign(this.dataWorkList, this.datalist)
      },

      //获取测评 成功
      getHistoryTestSuccess (res) {
        this.temp = true
        this.totalCount = res.data.totalCount
        if (res.data) {

          res.data.dataList.reduce((obj, item, index) => {
            let month = this.conductDate(item.releaseTime, 'MM')
            item.num = month
            return obj

          }, {})
        }
        // let datalist = {}
        res.data.dataList.map(item => {
          if (this.datalist[item.num]) {
            this.datalist[item.num].push(item)
          } else {
            this.datalist[item.num] = [item]
          }
        })
        this.dataTestList =  Object.assign(this.dataTestList, this.datalist)
        console.log(this.dataTestList,9999)
      },
    },
    created () {
      this.init()
    },
    mounted () {
      this.top = -this.$refs.scroller.offsetTop + ''
      console.log(this.top,'217')
    },
    components: {
      HeaderTitle,Scroller, LoadMore
    }
  }
</script>
<style lang="scss">
    @import '../../../pcss/patriarch/pHerwork';
    @import '../../../pcss/patriarch/home';
</style>
