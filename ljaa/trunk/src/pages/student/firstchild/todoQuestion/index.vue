<!--
****--@file     startProblem
****--@date     2017/12/25 上午10:36
****--@author   jhd
****--@describe   自选测评-开始做题
-->
<template>
    <div class="startProblem-root adaptive-evaluation" ref="questionList">
      <!--<header-title>-->
      <!--<slot></slot>-->
      <!--</header-title>-->
        <div class="stance"></div>

      <div class="recentPractice_next_question" style="min-height: 6.25rem;">
            <topic-alert v-if="questionList.length" :questionList="questionList" :questionsId="questionData.id" ref="topicAlert" :typeTestHome="type"
                         @next="lookupQuestion" @questionNextList="questionNextList"></topic-alert>
        <div style="padding: 0 0.15rem;">

                <!--<p class="questionType">题型 <span class="yellowColor">{{questionData.questionsTypeName}}</span></p>-->
            <!--<div class="recentPractice_next_question" style="display: block">-->
                <div ref="scroller" v-if="reShow">
                  <scroller height="-150" :scrollbar-x=false ref="scrollerEvent" @on-scroll="getNext">
                  <!--<scroller :scrollbar-x=false :scrollbarY=true @on-scroll="getNext" :height="top" style="overflow: auto">-->
                    <div style="overflow: hidden;">
                      <div class="question_header">
                        <!--<p class="p"> {{viewData.studentName}}<span style="float: right">{{viewData.totalScore}}分</span></p>-->
                        <h3 class="question_header_num" style="">第{{questionsSeq}}题 <span class="question_header_have"
                                                                                          style="">还有<span
                          class="question_header_queNum" style="">{{questionConf.count-questionsSeq}}</span>题 </span>
                        </h3>
                        <p class="questionsTypeName">题型 <span class="questionsTypeNameSpan">{{questionData.questionsTypeName}}</span>
                        </p>
                      </div>
                      <question-show :show-data="questionData" v-if="(type==='homework')&&!$route.query.questionsSeq" ref="questionAnswer"
                                     :showInput="!questionConf.seq[questionsSeq].isAnswer&&!$route.query.questionsSeq"
                                     :showAnswer="questionConf.seq[questionsSeq].isAnswer||$route.query.questionsSeq"
                                     @answer="setAnswer"></question-show>
                      <question-show :show-data="questionData" v-else-if="(type==='homework'||type=='test')&&$route.query.questionsSeq"  ref="questionAnswer"
                                     :showInput="false"
                                     :showAnswer="questionData.studentAnswer"
                                     @answer="setAnswer"></question-show>
                      <question-show :show-data="questionData" v-else  ref="questionAnswer"
                                     :showInput="true"
                                     @answer="setAnswer"></question-show>

                      <template v-if="type === 'test'&&!$route.query.questionsSeq">
                        <!--{{questionConf.count}}-->
                        <!--{{questionAnswerArr.length}}-->
                        <!--<x-button style="margin-top: 0.2rem" class="questionSure"-->
                                  <!--v-if="questionAnswerArr.length >= questionConf.count-1 && !~questionAnswerArr.indexOf(questionsSeq)"-->
                                  <!--@click.native="submit">提交-->
                        <!--</x-button>-->
                        <template>
                          <!--<x-button  @click.native="saveAnswerAndNext">下一题</x-button>-->
                          <x-button class="questionSure" style="margin-top: 0.2rem" @click.native="stopDoTest">提交</x-button>
                        </template>
                      </template>
                      <!-- 老师布置的作业 -->
                      <template v-else-if="type !== 'test'&&!$route.query.questionsSeq">
                          <!--<x-button-->
                          <!--v-if="questionConf.seq[questionsSeq].isAnswer && questionAnswerArr.length <= questionConf.count-1"-->
                          <!--@click.native="next">下一题-->
                          <!--</x-button>-->
                        <x-button class="questionSure" style="margin-top: 0.1rem;line-height: 0.4rem;" v-if="!questionConf.seq[questionsSeq].isAnswer"
                                  @click.native="confirm">确定
                        </x-button>
                        <x-button class="questionSure" @click.native="stopDoHomework" style="margin-top: 0.1rem;line-height: 0.4rem">提交</x-button>
                      </template>
                    </div>
                  </scroller>
                </div>
            </div>
            <div v-transfer-dom>
                <confirm v-model="confirmItem"
                         title="确认退出？"
                         @on-confirm="onConfirm"
                         class="sAskedAlert">
                    <p style="text-align:center;">{{message}}</p>
                </confirm>
            </div>
        </div>
      <toast v-model="toastShow" type="warn">请选择试题</toast>
        <alert title="提示" v-model="show">{{message}}</alert>
        <alert title="提示" v-model="showSuccess" @on-hide="onHide">{{message}}</alert>
    </div>
</template>
<script>
/* 当前组件必要引入 */
import HeaderTitle from '../../header'
import api from './api'
import questionShow from '../../../../components/questionShow/show'
import topicAlert from '../../commonality/topicAlert.vue'
let thatItem = null
let Util = null
let answerType, answerPapersId
export default {
  data () {
    return {
      seq: 0,
      top: '0',
      loading: false,
      confirmItem: false,
      showSuccess: false,
      show: false,
      toastShow: false,
      message: '',
      questionsId: '', // 当前做题id
      questionsSeq: 0,
      answer: '',
      questionList: [],
      timerInt: null, // 时间计时器
      hour: 0, // 时
      minute: 0, // 分
      second: 0, // 秒
      reShow: true,
      type: null, // 类型
      papersId: null, // 试题id
      groupsId: null, // 群组id（作业使用）
      startAnswerTime: null, // 每道题答题开始时间
      // allHasDo: false, // 试题已经全部做过了

      questionAnswerArr: [], // 答题索引
      questionConf: { // 试题配置信息
        count: 0, // 试题总共数量
        type: { // 试题题型id对象
          // 1:[{该题型下的试题对象}]
        },
        seq: [{ // 试卷对应的序号集
          // 1:{该序号对应的数据集}
          isAnswer: false
        }]
      },
      isAnswer: '',
      questionsSeqArr: [], // 试题题号数组
      evaluationInfo: null, // 试卷信息（评测专用）
      questionData: {id: ''}, // 试题信息
      poition: 0,
      timer: null,
      temp: 0,
      tempTime: null,
      questionShowHeight: 0,
      maxLeft: 0,
      anserTime: 0,
      login:{}, //登录成功返回
    }
  },
  methods: {
    getNext (val) {
      // console.log(this.questionShowHeight, $('#questionShow').outerHeight(), 888888)
      // if (this.questionShowHeight != $('#questionShow').outerHeight()) {
      //   this.reset()
      //   this.questionShowHeight = $('#questionShow').outerHeight()
      // }
      this.reset()
      this.maxLeft = Math[val.left > 0 ? 'max' : 'min'](this.maxLeft, val.left)// 保存最大的左右偏移量
      if (val.left < 10 && (this.maxLeft > $('.adaptive-evaluation').width() / 6)) {
        this.maxLeft = 0
        this.poition = 1
        let value = Number(this.questionsSeq) + this.poition
        if (value < 1 || value > this.questionConf.count) {
          return
        }
        // console.log(this.$route.query.type, 'this.$route.query.type')
        if (this.answer === '') {
          this.show = true
          this.message = '请先选择或填写答案'
          return
        }
        if (this.$route.query.type == 4) {
          this.saveAnswerAndNext()
        }
        this.getAnswerQuestion(value)
      }
    },
    reset () {
      this.$refs.scrollerEvent && this.$refs.scrollerEvent.reset()
    },
    /** ********************************* 初始化 *****************************/
    // 初始化请求列表数据
    init () {
      thatItem = this
      Util = this.$util
      let {type = '', papersId = ''} = this.$route.params
      //        let {groupsId} = this.$route.query.groupsId||''
      //        console.log(groupsId,'llllll')
      if (!['test', 'homework'].includes(type) || isNaN(papersId)) {
        this.questionData = -1
        return
      }
      this.type = type
      this.papersId = papersId
      answerType = type
      answerPapersId = papersId
      this.groupsId = this.$route.query.groupsId || ''
      let opt = {// 时间
        ajaxSuccess: (res) => {
          let tempNum = 0
          if (res) {
            tempNum = parseInt(res.anserTime)
          }
          this.tempTime = setInterval(() => {
            this.anserTime = tempNum++
          }, 1000)
        },
        //          ajaxParams: {
        url: '/answerTime/getInfo',
        method: 'post',
        jsonString: true,
        data: {
          relateId: papersId,
          relateType: type == 'test' ? 1 : 2
        }
        //          }
      }
      this.login = this.$store.state.loginInfo
      // this.$store.dispatch('getLoginTokenByPost', obj)
      // userType 为2 是为家长端
      if( this.login.userType !== 2){
        this.ajax(opt)
      }
      if (this.type === 'test') {
        this.getMyEvaluationInfo()
      } else {
        this.queryQuestionList()
      }
    },
    /** ********************************* 数据获取 ****************************/
    // 获取试题基本信息
    getMyEvaluationInfo () {
      let opt = {
        ajaxSuccess: (data, res) => {
          this.evaluationInfo = res.data
          this.queryQuestionList()
        },
        url: api.getMyEvaluationInfo.path,
        method: api.getMyEvaluationInfo.method,
        params: {
          papersId: this.papersId,
          studentId: this.$route.query.id || this.$store.state.loginInfo.id
        }

      }
      this.ajax(opt)
    },

    // 获取试题编号
    queryQuestionList () {
      let ajaxParams = {
        test: {
          url: api.getQuestionsSeq.path,
          method: api.getQuestionsSeq.method,
          params: {
            papersId: this.papersId,
            studentId: this.$store.state.loginInfo.id
          }
        },
        homework: {
          url: api.getWorkQuestionsSeq.path,
          method: api.getWorkQuestionsSeq.method,
          params: {
            workId: this.papersId,
            groupsId: this.groupsId,
            studentId: this.$store.state.loginInfo.id
          }
        }
      }
      let opt = {
        ajaxSuccess: (data1, res) => {
          // if (this.type === 'test') {
          //   data1.map(item => {
          //     item.isAnswer = false
          //     item.answerResult = null
          //   })
          // }
          // this.questionList = data1
          // setTimeout(() => {
          //   this.$nextTick(() => {
              this.questionList = res.data
          //   })
          // }, 5)
          // this.questionList = res.data
          console.log(this.questionList,'this.questionList   3333')
          // return
          let data = res.data
          let questionConf = {
            count: 0,
            type: {},
            seq: {}
          }

          let defIndex = '' // 试题索引
          let doSomeOne = false // 已经做过试题
          let allHasDo = false // 试题已经全部做过了

          if (data instanceof Array && data.length) {
            questionConf.count = data.length
            // 是否已经做过
            doSomeOne = data.some(item => item.isAnswer)
            // 试题已经全部做完
            allHasDo = data.every(item => item.isAnswer)
            !allHasDo && data.map(item => {
              if (doSomeOne && item.isAnswer) { // 记录最后一次做题的索引
                defIndex = item.seq
                this.questionAnswerArr.push(item.seq)
              } else { // 默认第一题
                !defIndex && (defIndex = item.seq)
              }
              questionConf.seq[item.seq] = item
              //  题型记录
              if (!questionConf.type[item.questionsTypeId]) {
                questionConf.type[item.questionsTypeId] = {name: item.questionsTypeName, questions: []}
              }
              questionConf.type[item.questionsTypeId].questions.push(item)
            })
            if (this.$route.query.questionsSeq) {
              data.map(item => {
                if (doSomeOne && item.isAnswer) { // 记录最后一次做题的索引
                  defIndex = item.seq
                  this.questionAnswerArr.push(item.seq)
                } else { // 默认第一题
                  !defIndex && (defIndex = item.seq)
                }
                questionConf.seq[item.seq] = item
                //  题型记录
                if (!questionConf.type[item.questionsTypeId]) {
                  questionConf.type[item.questionsTypeId] = {name: item.questionsTypeName, questions: []}
                }
                questionConf.type[item.questionsTypeId].questions.push(item)
              })
            }
          }

          this.questionsSeq = defIndex
          this.questionConf = questionConf
          this.questionsSeqArr = data
          if (this.$route.query.questionsSeq) {
            this.getAnswerQuestion(this.$route.query.questionsSeq)
            return
          }
          if (allHasDo) { // 全部做完
            this.lookRes()
          } else if (doSomeOne) { // 已经做过题
            this.next()
          } else { // 没有做过题
            defIndex && this.jumpQuestionById(defIndex)
          }
        },
        url: ajaxParams[this.type].url,
        method: ajaxParams[this.type].method,
        params: ajaxParams[this.type].params

      }

      this.ajax(opt)
    },

    //题版返回
    questionNextList () {
      this.$nextTick(() => {
        let ajaxParams = {
          test: {
            url: api.getQuestionsSeq.path,
            method: api.getQuestionsSeq.method,
            params: {
              papersId: this.papersId,
              studentId: this.$store.state.loginInfo.id
            }
          },
          homework: {
            url: api.getWorkQuestionsSeq.path,
            method: api.getWorkQuestionsSeq.method,
            params: {
              workId: this.papersId,
              groupsId: this.groupsId,
              studentId: this.$store.state.loginInfo.id
            }
          }
        }
        let opt = {
          ajaxSuccess: (data1, res) => {
            // if (this.type === 'test') {
            //   data1.map(item => {
            //     item.isAnswer = false
            //     item.answerResult = null
            //   })
            // }
            this.questionList = res.data
            setTimeout(() => {
              this.$nextTick(() => {
                this.$refs.topicAlert.setData()
              })
            }, 1)
          },
          url: ajaxParams[this.type].url,
          method: ajaxParams[this.type].method,
          params: ajaxParams[this.type].params
        }

        this.ajax(opt)
      })

    },

    // 根据索引获取试题
    getQuestionsBySeq (seq) {
      clearInterval(this.timerInt)
      console.log('根据索引获取试题')
      let params = {
        test: {
          questionsId: this.questionConf.seq[seq].questionsId,
          papersId: this.papersId,
          studentId: this.$store.state.loginInfo.id
        },
        homework: {
          questionsId: this.questionConf.seq[seq].questionsId,
          workId: this.papersId,
          groupsId: this.groupsId,
          studentId: this.$store.state.loginInfo.id
        }
      }
      this.ajax({
        ajaxSuccess: (data, res) => this.getQuestionsSuccess(res),
        url: api[this.type === 'test' ? 'getQuestions' : 'getWorkQuestions'].path,
        method: api[this.type === 'test' ? 'getQuestions' : 'getWorkQuestions'].method,
        params: params[this.type]

      })
    },

    //查询试题，
    lookupQuestion(index) {
      if (!index) {
        this.toastShow = true;
        return this.message = '请选择试题！';
        return
      }
      if (this.$route.query.type == 4 && this.answer && this.$route.query.seeType !== 'parents') {
        this.saveAnswer(() => {
          this.getAnswerQuestion(index)
        })
      } else {
        this.getAnswerQuestion(index)
      }

    },

    // 根据索引试题答案
    getAnswerQuestion (index) {
      // console.log('mmm')
      // console.log(this.questionConf.seq[index].questionsId)
      // if (!this.questionConf.seq[index].questionsId){
      //   this.toastShow = true;
      //   return this.message='请选择试题！'
      // }else {
      //
      // }
      let params = {
        test: {
          questionsId: this.questionConf.seq[index].questionsId,
          papersId: this.papersId,
          studentId: this.$store.state.loginInfo.id
        },
        homework: {
          questionsId: this.questionConf.seq[index].questionsId,
          workId: this.papersId,
          groupsId: this.groupsId,
          studentId: this.$store.state.loginInfo.id
        }
      }
      let opt = {
        ajaxSuccess: (data, res) => { this.getQuestionsSuccess(res) },
        url: api[this.type === 'test' ? 'getQuestions' : 'getWorkQuestions'].path,
        method: api[this.type === 'test' ? 'getQuestions' : 'getWorkQuestions'].method,
        params: params[this.type]

      }
      this.questionsSeq = index
      this.answer = ''
      clearInterval(this.timerInt)
      this.ajax(opt)
    },

    // 获取试题成功回调
    getQuestionsSuccess (res) {
      console.log(res.data,'res.data   9999')
      // 重新计算高度
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.scrollerEvent.reset()

        })
      }, 50)
      if (res.data.answerResult !== null) {
        this.answer = res.data.answer
      } else {
        this.answer = ''
      }
      this.questionData = res.data
      this.startAnswerTime = res.data.startTime

      // 分题型记录数据
      if (res.data.childQuestionsList instanceof Array && res.data.childQuestionsList.length) {
        this.questionsId = res.data.childQuestionsList[0].id
        this.questionsSeq = res.data.childQuestionsList[0].seq
      } else {
        this.questionsId = res.data.id
        this.questionsSeq = res.data.seq
      }
      this.initTime()
    },

    // 获取当前类型
    getType () {
      return this.type.replace(/^\w/, s => s.toLocaleUpperCase())
    },

    /** ********************************* 试题公共操作 *************************/
    // 跳题
    jumpQuestionById (seq) {
      this.questionsSeq = seq
      this.getQuestionsBySeq(seq)
    },

    // 试题答案处理
    setAnswer (d) {
      console.log('setAnswer', d)
      // 重新计算高度
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.scrollerEvent.reset()
        })
      }, 50)

      this.answer = d.toString()
    },

    // 还剩余几道题
    surplusQuestion () {
      return this.questionConf.count - this.questionAnswerArr.length - (~this.questionAnswerArr.indexOf(this.questionsSeq) ? 0 : 1)
    },

    // 下一题
    next () {
      let params = {
        test: {
          papersId: this.papersId,
          studentId: this.$store.state.loginInfo.id
        },
        homework: {
          workId: this.papersId,
          groupsId: this.groupsId,
          studentId: this.$store.state.loginInfo.id
        }
      }
      let opt = {
        ajaxSuccess: (data, res) => this.getQuestionsSuccess(res),
        url: api[this.type === 'test' ? 'getNextQuestions' : 'getWorkNextQuestions'].path,
        method: api[this.type === 'test' ? 'getNextQuestions' : 'getWorkNextQuestions'].method,
        params: params[this.type]

      }
      this.ajax(opt)
    },

    // 保存答案
    saveAnswer(callFun, pushSeq = true, confirm) {
      //  this.next()



      clearInterval(this.timerInt)
      let data = {
        test: {
          papersId: this.papersId,
          startTime: this.startAnswerTime,
          answer: this.answer,
          questionsId: this.questionsId
        },
        homework: {
          workId: this.papersId,
          startTime: this.startAnswerTime,
          answer: this.answer,
          questionsId: this.questionsId,
          groupsId: this.groupsId
        }
      }
      let opt = {
        ajaxSuccess: res => {
          console.log(res,'答题成功')
          if(res){
            this.answer = res.answer.toString()
            // if(this.questionData.basicType){
            this.questionData.studentAnswer = res.answer.toString()
            this.questionData.answerResult = res.answerResult
          }

          // this.init()
          // }

          console.log(this.questionData,'this.questionData  答题成功')
          // console.log(this.answer, '答题成功 this.answer')
          // this.queryQuestionList()
          // this.getAnswerQuestion(this.$route.query.questionsSeq)
          this.$refs.questionAnswer.init()
          // return
          if (pushSeq && !this.questionAnswerArr.includes(this.questionsSeq)) {
            this.questionAnswerArr.push(this.questionsSeq)
          }
          if (this.type === 'test') {
            this.questionConf.seq[this.questionsSeq].isAnswer = false
          } else {
            this.questionConf.seq[this.questionsSeq].isAnswer = true
          }
          callFun && callFun.apply(this, res)

        },
        url: api[this.type === 'test' ? 'submitAnswer' : 'submitWorkAnswer'].path,
        method: api[this.type === 'test' ? 'submitAnswer' : 'submitWorkAnswer'].method,
        data: data[this.type],
        jsonString: true
      }
      this.ajax(opt)
    },

    // 计时器初始化
    initTime (useTime) {
      if (useTime) {
        this.hour = parseInt(useTime / 3600)
        this.minute = parseInt((useTime - 3600 * this.hour) / 60)
        this.second = parseInt(useTime - 3600 * this.hour - 60 * this.minute)
      }
      this.timerInt = setInterval(this.timer, 1000)
    },
    //
    //    // 计时
    //    timer () { // 计时
    //      this.second = this.second + 1
    //      if (this.second > 59) {
    //        this.second = 0
    //        this.minute = this.minute + 1
    //      }
    //
    //      if (this.minute > 59) {
    //        this.minute = 0
    //        this.hour = this.hour + 1
    //      }
    //    },

    // 试题做完提交
    submit () {
      this['submit' + this.getType()].apply(this)
    },

    // 停止继续做
    stopDo (fun) {
      // 有答案就提交,提交之后再进行询问(避免一个试题重复提交答案)
      if (this.answer && !this.questionAnswerArr.includes(this.questionsSeq)) {
        this.saveAnswer(() => {
          this.stopDo(fun)
        })
        return
      }
      if (!this.questionAnswerArr.length) {
        this.show = true
        this.message = '至少需要答一道题才能提交'
        return
      }
      fun && fun.apply(this)
    },

    // 查看结果
    lookRes () {
      console.log('查看结果', 'go' + this.getType() + 'Res')
      let data = {
        test: {papersId: this.papersId},
        homework: {workId: this.papersId, groupsId: this.groupsId}
      }
      let opt = {
        ajaxSuccess: () => this['go' + this.getType() + 'Res'].apply(this),
        url: api[this.type === 'test' ? 'submitPapers' : 'submitWork'].path,
        method: api[this.type === 'test' ? 'submitPapers' : 'submitWork'].method,
        data: data[this.type]

      }
      this.ajax(opt)
    },

    /** ********************************* 测评试题操作 *************************/
    // 保存答案并获取下一题
    saveAnswerAndNext () {
      this.saveAnswer(res => {

      })
    },

    // 停止做测评
    stopDoTest () {
      this.stopDo(() => {
        if (this.questionAnswerArr.length == this.questionConf.count - 1 && this.answer) {
          this.saveAnswerAndNext()
          this.alertTest()
        } else {

          this.confirmItem = true
          this.message = '当前测评还未完成，是否确认提交？'
        }
      })

      //        this.stopDo(() => this.$confirm('当前测评还未完成，是否确认提交？').then(_ => {
      //          this.alertTest()
      //        }).catch(() => {
      //        }))
    },

    // 测试提交答案弹出确认
    alertTest () {
      if (this.evaluationInfo.publishAnswerTime < new Date().getTime()) { // 当前还未到公布答案时间
        this.sendTime()
        setTimeout(() => {
          this.lookRes()
        })
      } else {
        this.showSuccess = true
        this.message = `测评结果将于${this.conductDate(this.evaluationInfo.publishAnswerTime, 'yyyy-MM-dd HH:mm')}时公布`
      }
    },
    onHide () {
      this.sendTime()
      setTimeout(() => {
        this.lookRes()
      })

    },

    // 评测提交
    submitTest () {
      if (this.answer === '') {
        this.show = true
        this.message = '请先选择或填写答案'
        return
      }
      this.saveAnswer(() => this.alertTest(), false)
    },

    // 查看测评结果
    goTestRes () {
      if (this.evaluationInfo.publishAnswerTime < new Date().getTime()) {
        // 立即公布
        this.$router.push({name: 'homeworkRes', params: {id: this.papersId, type: this.type}}) // 跳转到结果页面
      } else {
        // 延迟公布
        // this.$router.push({name: 'selfHomework', query: {view: 'my' + this.getType(), finish: 1}}) // 跳转到：我的作业-我的评测-已完成
        this.$router.go(-1)
      }
    },

    /** ********************************* 作业试题操作 *************************/
    // 保存答案并获取正确答案
    confirm () {
      if (this.answer === '') {
        this.show = true
        this.message = '请先选择或填写答案'
        return
      }
      this.saveAnswer(() => {//当确定的时候获取下一道试题
        let value = Number(this.questionsSeq) + 1
        if (!(value < 1 || value > this.questionConf.count)) {
          this.getAnswerQuestion(value)
        }
      })
    },
    onConfirm () {
      if (this.message == '当前作业还未完成，是否确认提交？') {
        let data = {
          test: {papersId: this.papersId},
          homework: {workId: this.papersId, groupsId: this.groupsId}
        }
        let opt = {
          ajaxSuccess: () => this['go' + this.getType() + 'Res'].apply(this),
          url: api[this.type === 'test' ? 'submitPapers' : 'submitWork'].path,
          method: api[this.type === 'test' ? 'submitPapers' : 'submitWork'].method,
          data: data[this.type]

        }
        this.ajax(opt)
        this.$router.go(-1)
        return
      }
      this.alertTest()
    },

    // 显示答案
    showAnswer () {
      this.questionConf.seq[this.questionsSeq].isAnswer = true
      this.answer = ''
      this.getQuestionsBySeq(this.questionsSeq)
    },

    // 查看测评结果
    goHomeworkRes () {
      this.$router.push({
        name: 'homeworkRes',
        params: {id: this.papersId, type: this.type},
        query: {groupsId: this.groupsId}
      }) // 跳转到结果页面
    },

    // 停止做作业
    stopDoHomework () {
      if (this.questionAnswerArr.length === this.questionConf.count) { // 全部做完
        this.showSuccess = true
        this.message = '恭喜你题目已经做完了，上交作业并查看详情吧'
      } else {
        this.stopDo(() => {
          if (this.answer != '') {
            this.showAnswer()
          }
          //            this.$confirm('当前作业还未完成，是否确认提交？').then(_ => {
          //              this.lookRes()
          //            }).catch(() => {
          //            })
          this.confirmItem = true
          this.message = '当前作业还未完成，是否确认提交？'
        })
      }
    },
    sendTime () {
      let opt = {
        ajaxSuccess: () => {},
        //          ajaxParams: {
        url: '/answerTime/update',
        method: 'post',
        jsonString: true,
        data: {
          relateId: answerPapersId,
          relateType: answerType == 'test' ? 1 : 2,
          anserTime: this.anserTime
        }
        //     }
      }
      this.ajax(opt)
    },
    //手机屏左右划禁用
    scrollWindow () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    },
    //手机屏左右划禁用
    destroyed () {
      // 离开取消监听滚动事件
      window.removeEventListener('scroll', this.scrollWindow)
    },
  },
  created () {
    this.init()
  },
  beforeDestroy () {
    clearInterval(this.timerInt)
    if( this.login.userType !== 2){
      this.sendTime()
    }

    window.a = 0
    console.log('清除计时')
    //手机屏左右划禁用
    this.destroyed()
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.scrollerEvent.reset()
      // 添加滚动事件
      window.addEventListener('scroll', this.scrollWindow)
    })
  },
  watch: {
    $route (to, from) {
      console.log(to, from,'to, from  index')
      this.type = to.name
      console.log(to.name,'to.name index')
    }
  },
  components: {
    questionShow, topicAlert, HeaderTitle
  }

}
window.onbeforeunload = function (e) {
  e = e || window.event
  if( this.login.userType !== 2){
    thatItem.sendTime()
  }
  // thatItem.sendTime()
  //阻止左右翻页
  var xStart, xEnd, yStart, yEnd;

  document.addEventListener("touchstart", function (evt) {
    xStart = evt.touches[0].pageX;
    yStart = evt.touches[0].pageY;
  }, false);

  document.addEventListener('touchmove', function (evt) {
    xEnd = evt.touches[0].pageX;
    yEnd = evt.touches[0].pageY;
    //左右滑动
    if(Math.abs(xStart - xEnd) > Math.abs(yStart - yEnd)){
      evt.preventDefault();
    }
  }, false);
  // 兼容IE8和Firefox 4之前的版本
  if (e) {
    e.returnValue = '关闭提示'
  }
  // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
  return '关闭提示'
}

</script>
<style lang="scss">
    @import '../../../../css/home/recentPractice_next/recentPractice_next_question';
    .startProblem-root {
        .questionSure{
            background: #fd7416;
            color: #fff;
        }
        .question_header{
            line-height: 0.36rem;
            height: 0.6rem;
        }
        .questionType {
            font-size: 0.12rem;
            line-height: 0.2rem;
            height: 0.3rem;
        }
        .yellowColor {
            color: #fd7416;
            font-size: 0.12rem;
            padding: 0 0.02rem
        }
        .startProblem {
            height: 950px;
            background-size: 100% 100%;
            /*background-image: url("../../../../assets/images/adaptiveEvaluation.jpg");*/
            .nodataTip {
                text-align: center;
                line-height: 440px;
                background-color: #fff;
            }
            .number {
                width: 240px;
                height: 440px;
                background: #f4f4f4;
                margin: 30px;
                padding: 20px;
                padding-right: 0;
                .scroll-box {
                    overflow: auto;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    width: 100%;
                    height: 100%;
                }
                .number-ul {
                    width: 200px;
                    &:first-child {
                        margin-top: 0;
                    }
                }
                .number-li {
                    float: left;
                    width: 40px;
                    text-align: center;
                    line-height: 30px;
                    background-color: #ffffff;
                    cursor: pointer;
                }
                .number-type {
                    margin-bottom: 10px;
                    margin-top: 10px;
                }
                .number-li-right {
                    background-color: #e5e5e5;
                }
                .number-li-active {
                    background: #fd7416;
                    color: #ffffff;
                }
            }
            .modal {
                .logo-wrap {
                    position: absolute;
                    top: 65px;
                    left: 0px;
                }
                position: relative;
                width: 1200px;
                margin: 0 auto;
                padding-top: 150px;
                .title {
                    font-size: 26px;
                    background-color: #ebede1;
                    font-weight: normal;
                    font-style: normal;
                    font-stretch: normal;
                    line-height: 1.54;
                    letter-spacing: 0.1px;
                    text-align: center;
                    color: #313131;
                    .tip {
                        float: right;
                        margin-right: 50px;
                        font-size: 16px;
                        line-height: 2.5;
                        letter-spacing: 0.1px;
                        text-align: left;
                        color: #313131;
                    }
                }
                .content {
                    background: #ffffff;
                    min-height: 500px;
                    position: relative;
                    .con-title {
                        font-size: 14px;
                        line-height: 3.57;
                        text-align: left;
                        .type {
                            color: #11a63f;
                        }
                    }
                    .con-main {
                        width: 880px;
                    }
                }
                .question-item {
                    margin-top: 20px;
                    min-height: 350px;
                    .question-content {
                        float: left;
                        width: 600px;
                    }
                }
                .btn-wrap {
                    width: 100%;
                    padding: 20px;
                    overflow: hidden;
                    .right-p {
                        width: 300px;
                        float: right;
                        .el-button {
                            background: #fd7416;
                            color: #ffffff;
                            border: 1px solid #fd7416;
                        }
                    }
                    .left-p {
                        .el-button {
                            border-radius: 30px;
                            background: #fff;
                            color: #313131;
                        }
                        .active {
                            background: #fd7416;
                            color: #ffffff;
                            border: 1px solid #fd7416;
                        }
                    }
                }
            }
        }
    }
</style>
