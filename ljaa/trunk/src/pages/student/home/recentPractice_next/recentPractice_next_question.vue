<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2018/4/24
****--@author   zzh
----------------------------------->
<template>
    <div class="adaptive-evaluation recentPractice_next_question">
        <topic-alert v-if="questionList.length>0&&showType" :questionList="questionList" :questionsId="questionData.id"
                     @next="setSeq"></topic-alert>
        <div style="  padding:0 0.15rem;">
            <div class="question_header">
                <!--<p class="p"> {{viewData.studentName}}<span style="float: right">{{viewData.totalScore}}分</span></p>-->
                <h3 class="question_header_num" style="">第{{seq}}题 <span class="question_header_have" style="">还有<span class="question_header_queNum" style="">{{(questionList.length-seq)}}</span>题 </span></h3>
                <!--<p class="questionsTypeName">题型  <span class="questionsTypeNameSpan">{{questionData.questionsTypeName}}</span></p>-->
            </div>
            <p class="questionType">题型 <span class="yellowColor">{{questionData.questionsTypeName}}</span></p>
            <!--<div class="recentPractice_next_question" style="display: block">-->
            <scroller  :scrollbar-x=false @on-scroll="getNext" ref="questionScroller" :height="top">
                <div id="questionShow">
                <div ref="scroller">
                    <questionShow :showData="questionData" :showInput="!questionList[seq-1].isAnswer"
                                  @answer="setAnswer" :showAnswer="questionList[seq-1].isAnswer"></questionShow>
                </div>
                <div class="con-btn" align="right">
                    <template v-if="surplusQuestion()||allQuestion==seq">
                        <x-button class="submit-active" v-if="!questionList[seq-1].isAnswer" @click.native="confirm">
                            确定
                        </x-button>
                    </template>
                </div>
                </div>
            </scroller>
        </div>
        <div v-transfer-dom>
            <confirm v-model="show1"
                     title="确认退出？"
                     @on-cancel="onCancel"
                     @on-confirm="onConfirm"
                     @on-show="onShow"
                     @on-hide="onHide" class="sAskedAlert">
                <p style="text-align:center;">题库里还有未完成的题目，是否确认
                    退出做题？</p>
            </confirm>
        </div>
        <alert v-model="msgShow" title="提示"> {{message}}</alert>
    </div>
</template>
<script>
/* 当前组件必要引入 */
import TopicAlert from '../../commonality/topicAlert'
import questionShow from '../../../../components/questionShow/show'
import { Scroller } from 'vux'
import api from '../api'
// 当前组件引入全局的util
let Util = null
export default {
  data: function () {
    return {
      top: '0',
      msgShow: false,
      message: '',
      show: 0,
      showType: true,
      show1: false,
      questionData: {},
      answerArr: [], // 已经答题的索引
      allQuestion: 0, // 总题数
      data: [],
      showQuestion: [],
      questionList: [{isAnswer: false}],
      answer: '',
      seq: 1,
      questionsId: '',
      poition: 0,
      timer: null,
      temp: 0,
      questionShowHeight: 0,
      maxLeft: 0
    }
  },
  methods: {
    getNext (val) {
      if (this.questionShowHeight != $('#questionShow').outerHeight()) {
        this.reset()
        this.questionShowHeight = $('#questionShow').outerHeight()
      }
      console.log('val.left ', val.left, this.maxLeft, $('.adaptive-evaluation').width() / 6, val.left === 0 && (this.maxLeft > $('.adaptive-evaluation').width() / 6))
      this.maxLeft = Math[val.left > 0 ? 'max' : 'min'](this.maxLeft, val.left)// 保存最大的左右偏移量
      if (val.left > -10 && (this.maxLeft < -($('.adaptive-evaluation').width() / 6))) {
        this.maxLeft = 0
        this.poition = -1
        let value = Number(this.seq) + this.poition
        if (value < 1) {
          this.value = 1
        } else if (value > this.allQuestion) {
          this.value = this.allQuestion
        }
        console.log(this.answerArr, value)
        if (value == 0) {
          this.msgShow = true
          this.message = '已经是第一题了'
          return
        }
        this.questionList.map((item) => {
          if (item.seq === value) {
            this.showType = false
            this.jumpQuestionById(item.id)
            this.seq = value
          }
        })
      } else if (val.left < 10 && (this.maxLeft > $('.adaptive-evaluation').width() / 6)) {
        this.maxLeft = 0
        if (!this.questionList[this.seq - 1].isAnswer) {
          this.msgShow = true
          this.message = '请先提交答案'
          return
        }
        this.poition = 1
        let value = Number(this.seq) + this.poition
        if (value < 1) {
          this.value = 1
        } else if (value > this.allQuestion) {
          this.value = this.allQuestion
        }
        console.log(this.answerArr, this.value)
        if (value > this.questionList.length) {
          this.msgShow = true
          this.message = '已经是最后一题了'
          return
        }
        this.questionList.map((item) => {
          if (item.seq === value) {
            this.showType = false
            this.jumpQuestionById(item.id)
            this.seq = value
          }
        })
      }
    },
    reset () {
      this.$refs.questionScroller && this.$refs.questionScroller.reset()
    },
    setSeq (val) {
      console.log(val, 'val')
      this.seq = val
      this.questionList.map((item) => {
        if (item.seq == val) {
          this.jumpQuestionById(item.id)
        }
      })
    },
    // 初始化请求列表数据
    init () {
      this.queryQuestionList()
    },
    // 还剩余几道题
    surplusQuestion () {
      return this.allQuestion - this.seq
    },
    next () {
      this.getNextQuestions((data) => {
        console.log('5252525', data)
        if (data instanceof Object) {
          this.questionData = data
          // 分题型记录数据
          if (data.childQuestionsList instanceof Array && data.childQuestionsList.length) {
            this.seq = data.childQuestionsList[0].seq
            this.questionsId = data.childQuestionsList[0].id
          } else {
            this.seq = data.seq
            this.questionsId = data.id
          }
          this.answer = ''
        } else {
          this.msgShow = true
          this.message = '您已完成练习，即将跳转到我的题库！'
          this.seq = this.allQuestion
          setTimeout(() => {
            this.$router.go(-1)
          }, 1000)
          this.successMess('您已完成练习，即将跳转到我的题库！')
        }
      })
    },
    getNextQuestions (call) {
      let opt = {
        ajaxSuccess: (data, res) => {
          call(data)
        },
        url: api.getNextQuestions.path,
        method: api.getNextQuestions.method,
        params: {
          papersId: this.$route.query.papersId,
          seq: this.seq,
          productId: this.$route.query.productId
        }

      }
      this.ajax(opt)
    },
    queryQuestionList () { // 获取题号
      let options = {
        url: api.queryQuestionList.path,
        params: {
          papersId: this.$route.query.papersId,
          productId: this.$route.query.productId,
          studentId: this.$route.query.studentId
        },

        /**
           * 服务端返回的状态码检查,默认状态码检查前执行
           * @param {*} data  服务器端返回的实际数据结构,根据不同业务格式不同
           * @param {object} res 服务器端返回的response值 {data:'**',status:{conde:0,msg:'请求数据成功!'}}
           */
        ajaxSuccess: (data, res) => {
          this.showType = false
          console.log(data, 'datadatasdsddata')
          this.questionList = data
          setTimeout(() => {
            this.showType = true
          })
          //            console.log(this.questionList)
          //            if (this.questionList.length != 0) {
          //              this.getQuestionsById(this.questionList[0].id)
          //            }
          let temp = {}
          let defIndex = [] // 试题索引
          let doSomeOne = false // 已经做过试题
          if (data instanceof Array && data.length) {
            // 是否已经做过

            doSomeOne = data.some(item => item.isAnswer)
            console.log(doSomeOne)
            this.allQuestion = data.length
            data.map(item => {
              if (doSomeOne && item.isAnswer == null) { // 记录最后一次做题的索引
                defIndex.push(item.seq)
              } else if (doSomeOne && item.isAnswer != null) {
                this.answerArr.push(item.seq)
              } else { // 默认第一题
                !defIndex.length && (defIndex.push(item.seq))
              }
              temp[item.seq] = item
            })
          }
          //            this.questionList = temp;
          console.log(this.questionList)
          if (doSomeOne) { // 已经做过题
            if (this.$route.query.seq) {
              this.seq = this.$route.query.seq
              this.questionList.map((item) => {
                if (item.seq == this.seq) {
                  this.jumpQuestionById(item.id)
                }
              })
              return
            }
            console.log(this.answerArr, 'defIndex[0]')
            this.seq = parseInt(defIndex[0]) - 1 + ''
            console.log(this.seq, 'this.seqsfsd')

            this.next()
          } else { // 没有做过题
            console.log(defIndex, ',,,')
            this.seq = 1
            this.questionList.map((item) => {
              if (item.seq == defIndex) {
                this.jumpQuestionById(item.id)
              }
            })
          }
          console.log(this.seq, this.questionList, 'this.seq')
        }
      }
      this.ajax(options)
    },
    setAnswer (d) {
      console.log(d)
      this.answer = d
    },
    /**
       * 提交答题（提交答案，获取正确情况）
       * **/
    confirm () {
      if (this.answer === '') {
        this.msgShow = true
        this.message = '请先选择或填写答案！'
        return false
      }

      let opt = {
        ajaxSuccess: res => {
          console.log(this.seq, this.seq - 1)
          this.questionList[this.seq - 1].isAnswer = true
          this.answerArr.push(this.seq)
          this.answer = ''
          this.getQuestionsById(this.questionsId)
        },
        url: api.submitAnswer.path,
        method: api.submitAnswer.method,
        data: {
          papersId: this.$route.query.papersId,
          seq: this.seq,
          productId: Number(this.$route.query.productId),
          myAnswer: this.answer,
          questionsId: this.questionsId
        }

      }
      this.ajax(opt)
    },
    /**
       * 跳题
       * **/
    jumpQuestionById (seq) {
      this.getQuestionsById(seq)
    },
    getQuestionsById (val) {
      this.questionsId = val
      let options = {
        url: api.getQuestionsById.path,
        params: {
          studentId: this.$route.query.studentId,
          papersId: this.$route.query.papersId,
          productId: this.$route.query.productId,
          questionsId: val
        },
        /**
           * 服务端返回的状态码检查,默认状态码检查前执行
           * @param {*} data  服务器端返回的实际数据结构,根据不同业务格式不同
           * @param {object} res 服务器端返回的response值 {data:'**',status:{conde:0,msg:'请求数据成功!'}}
           */
        ajaxSuccess: (data, res) => {
          this.questionData = data
          this.showType = true
          console.log(this.questionData, 'this.questionDatathis.questionDatathis.questionData')
          console.log(this.questionData, 'this.questionDatadsddsds')
          /* if (this.questionList[this.allQuestion - 1].isAnswer == true && !this.$route.query.seq) {
            this.msgShow = true
            this.message = '您已完成练习，即将跳转到我的题库！'
            this.seq = this.allQuestion
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          } */

          // if (this.seq + 1 > this.questionList.length && !this.$route.query.seq) {
          //   this.msgShow = true
          //   this.message = '您已完成练习，即将跳转到我的题库！'
          //   this.seq = this.allQuestion
          //   setTimeout(() => {
          //     this.$router.go(-1)
          //   }, 1000)
          // }
        }
      }
      console.log(options)
      this.ajax(options)
    },
    //      getQuestionDetail(){
    //
    //      },
    open () {
      this.show1 = true
    },
    onCancel () {
      console.log('on cancel')
    },
    onConfirm (msg) {
      console.log('on confirm')
      if (msg) {
        alert(msg)
      }
    },
    onHide () {
      console.log('on hide')
    },
    onShow () {
      console.log('on show')
    },
    change (index) {
      this.show = index
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.top = -this.$refs.scroller.offsetTop + ''
  },
  components: {TopicAlert, questionShow, Scroller}
}
</script>
<style lang="scss">
    @import '../../../../css/home/recentPractice_next/recentPractice_next_question';

    .agag > div.vux-indicator.vux-indicator-right > a > i {
        display: none;
    }
</style>
