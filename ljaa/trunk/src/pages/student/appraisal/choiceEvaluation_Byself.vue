<!--
****--@file     choiceEvaluation_Byself
****--@date     2017/12/19 下午2:05
****--@author   jhd
****--@describe   自适应测评
-->
<template>
    <div class="adaptive-evaluation choice-evaluation" style="min-height: 4.25rem">
        <div class="question_header">
            <!--<p class="p"> {{viewData.studentName}}<span style="float: right">{{viewData.totalScore}}分</span></p>-->
            <h3 class="question_header_num" style="">第{{questionsSeq}}题 <span class="question_header_have" style="">还有<span class="question_header_queNum" style="">{{(assessment.questionsCount-questionsSeq)}}</span>题 </span></h3>
            <p class="questionsTypeName">题型  <span v-if="questionData" class="questionsTypeNameSpan">{{questionData.questionsTypeName||''}}</span></p>
        </div>
        <!--<div class="recentPractice_next_question" style="display: block">-->
        <div ref="scroller">
          <div v-if="questionData instanceof Object">
            <scroller :height="top"  ref="questionScroller" @on-scroll="getNext" >
              <div id="questionShow">
              <questionShow :showData="questionData" :showInput="true" @answer="setAnswer"></questionShow>
              <x-button style="margin-top: 0.2rem;background-color: #fd7416;color: #fff" v-if="assessment.questionsCount - questionsSeq == 0&&questionData"
                        @click.native="submit">
                提交
              </x-button>
              <template v-else>
                <div v-if="questionData">
                  <!--<x-button  @click.native="next">下一题</x-button>-->
                  <x-button type="text" style="margin-top: 0.2rem;background-color: #fd7416;color: #fff" @click.native="cancel">提交</x-button>
                </div>
              </template>

              </div>
            </scroller>
          </div>
        <template v-else>
            <div class="content">
                <p v-if="questionData === null" class="nodataTip">
                    <span class="el-icon-loading"></span>
                    数据加载中
                </p>
                <!--<p v-else-if="questionData === false" class="nodataTip">谢谢，您已经参与过该任务！</p>-->
                <p v-else class="nodataTip" @click="$router.go(-1)">您所选择的科目，目前没有测评试题！
                    <a> 返回</a>
                </p>
                <!--<p v-else class="nodataTip">数据被篡改，环境异常！</p>-->
            </div>
        </template>
        </div>
        <!--<div class="modal">-->

        <!--<template v-if="questionData instanceof Object">-->
        <!--<p class="title">-->
        <!--<span>第 {{ questionsSeq }} 题</span>-->
        <!--<span class="tip">还有<b-->
        <!--style="color: #fd7416;">{{ assessment.questionsCount - questionsSeq }}</b>题</span>-->
        <!--</p>-->
        <!--<div class="content">-->
        <!--<p class="con-title">-->
        <!--<span class="type">题型：{{ questionData.questionsTypeName }}</span>-->
        <!--<span class="right">竞赛时长：{{ hour }} 时 {{ minute }} 分 {{ second }} 秒</span>-->
        <!--</p>-->
        <!--<div class="con-main">-->
        <!--<question-show :showData="questionData" :showInput="true"-->
        <!--@answer="setAnswer"></question-show>-->
        <!--</div>-->
        <!--<div class="con-btn" align="right">-->
        <!--<x-button v-if="assessment.questionsCount - questionsSeq == 0" :loading="loading"-->
        <!--@click="submit">-->
        <!--提交-->
        <!--</x-button>-->
        <!--<template v-else>-->
        <!--<x-button :loading="loading" @click="next">下一题</x-button>-->
        <!--<x-button type="text" @click="cancel">提交</x-button>-->
        <!--</template>-->
        <!--</div>-->
        <!--</div>-->
        <!--</template>-->
        <!--<template v-else>-->
        <!--<div class="content">-->
        <!--<p v-if="questionData === null" class="nodataTip">-->
        <!--<span class="el-icon-loading"></span>-->
        <!--数据加载中-->
        <!--</p>-->
        <!--&lt;!&ndash;<p v-else-if="questionData === false" class="nodataTip">谢谢，您已经参与过该任务！</p>&ndash;&gt;-->
        <!--<p v-else class="nodataTip">您所选择的科目，目前没有测评试题！-->
        <!--<router-link to="/selfCenter/selfCenterdetail">返回个人中心</router-link>-->
        <!--</p>-->
        <!--&lt;!&ndash;<p v-else class="nodataTip">数据被篡改，环境异常！</p>&ndash;&gt;-->
        <!--</div>-->
        <!--</template>-->
        <!--</div>-->
        <!--<div class="con-btn" align="right">-->
        <!--&lt;!&ndash;<x-button @click="submit">提交</x-button>&ndash;&gt;-->
        <!--<template v-if="surplusQuestion()||allQuestion==seq">-->
        <!--<x-button v-if="questionList[seq].isAnswer"  @click="next">下一题-->
        <!--</x-button>-->
        <!--<x-button class="submit-active"  @click.native="confirm">确定</x-button>-->
        <!--</template>-->
        <!--</div>-->

        <!--</scroller>-->
        <div v-transfer-dom>
            <confirm v-model="show1"
                     title="确认退出？"
                     @on-confirm="onConfirm"
                     class="sAskedAlert">
                <p style="text-align:center;">{{message}}</p>
            </confirm>
        </div>
        <alert v-model="messageShow" title="提示"> {{message}}</alert>
    </div>
</template>
<script>
/* 当前组件必要引入 */
import api from './api'

import questionShow from '../../../components/questionShow/show'
import { Scroller } from 'vux'
let Util = null

export default {
  data () {
    return {
      data: [],
      seq: '1',
      top: '0',
      show1: false,
      loading: false,
      message: '',
      messageShow: false,
      grade: '', // 年级
      subject: '', // 科目
      chapterId: '', // 章节id
      isFirstAssessment: '', // 是否首次测评
      textbookVersionId: '', // 测评教材版本
      poition: 0,
      seasonId: '',
      gamesAnswerId: '',
      answer: '',
      questionsSeq: '0',
      timer: null,
      hour: 0, // 时
      minute: 0, // 分
      second: 0, // 秒
      questionData: null,
      assessment: {
        'id': '', // 测评ID
        'createTime': '', // 首测时间
        'questionsCount': '' // 试题总数量
      },
      temp: 0,
      questionShowHeight: 0,
      maxLeft: 0
    }
  },

  methods: {
    // 初始化请求列表数据
    init () {
      Util = this.$util
      // 检测路由参数是否正确（防止手动篡改）
      let {grade = '', subject = '', isFirstAssessment = '', textbookVersionId = ''} = this.$route.params
      //                if(!grade || (grade && isNaN(grade)) || !isFirstAssessment || !~['1', '2'].indexOf(isFirstAssessment) || !subject || (subject && !/^[A-Z][a-z]+$/.test(subject)) || !textbookVersionId) {
      //                    this.questionData = -1;
      //                    return
      //                }
      this.grade = grade
      this.subject = subject
      this.isFirstAssessment = isFirstAssessment
      this.textbookVersionId = textbookVersionId
      this.chapterId = this.$route.query.chapterId || ''
      this.getAssessment()
    },
    getNext (val) {
      if (this.questionShowHeight != $('#questionShow').outerHeight()) {
        this.reset()
        this.questionShowHeight = $('#questionShow').outerHeight()
      }
      this.maxLeft = Math.max(this.maxLeft, val.left)// 保存最大的左右偏移量
      if (val.left  < 10 && (this.maxLeft > $('.adaptive-evaluation').width() / 6)) {
        this.maxLeft = 0
        if (this.questionsSeq >= this.assessment.questionsCount) {
          this.questionsSeq = this.assessment.questionsCount
          return
        }
        this.next()
      }
    },
    onConfirm () {
      this.$router.go(-1)
    },
    getAssessment () {
      console.log('1')
      let type = 'addAssessment'
      if (this.chapterId) {
        type = 'add'
      } else {
        if (this.isFirstAssessment == 1) {
          type = 'addFirstAssessment'
        }
      }
      let opt = {
        ajaxSuccess: (data, res) => {
          this.assessment = res.data
          this.next()
        },
        url: api[type].path,
        method: api[type].method,
        data: {
          grade: this.grade,
          subject: this.subject,
          chapterId: this.chapterId,
          textbookVersionId: this.textbookVersionId // 测评教材版本
        }

      }
      this.ajax(opt)
    },

    //      timer () {//计时
    //        this.second = this.second + 1
    //        if (this.second > 59) {
    //          this.second = 0
    //          this.minute = this.minute + 1
    //        }
    //
    //        if (this.minute > 59) {
    //          this.minute = 0
    //          this.hour = this.hour + 1
    //        }
    //      },
    setAnswer (d) {
      this.answer = d
    },
    next () {
      this.saveAnswer((data) => {
        console.log(data)
        if (data) {
          this.questionsSeq = +this.questionsSeq + 1
          this.questionData = data
        } else {
          if (this.questionsSeq > 1) {
            this.lookTestRes()
          } else {
            console.log(data)
            this.questionData = data
          }
        }
        console.log(this.questionData)
      })
    },
    submit () {
      if (this.answer === '') {
        this.message = '请先选择或填写答案！'
        this.messageShow = true
        return
      }
      let questionsId = ''
      if (this.questionData) {
        // 如果是组合题型则获取小题id
        if (this.questionData.childQuestionsList instanceof Array && this.questionData.childQuestionsList.length) {
          questionsId = this.questionData.childQuestionsList[0].id
        } else {
          questionsId = this.questionData.id
        }
      }
      let opt = {
        ajaxSuccess: () => this.lookTestRes(),
        url: api.submit.path,
        method: api.submit.method,
        data: {
          assessmentAutoId: this.assessment.id, // 自适应测评id
          questionsId, // 自适应测评id
          answer: this.answer // 自适应测评id
        }

      }
      this.ajax(opt)
    },
    saveAnswer (call) {
      console.log(286)
      if (this.questionData && this.answer === '') {
        this.message = '请先选择或填写答案！'
        this.messageShow = true
        return
      }
      let questionsId = ''
      if (this.questionData) {
        // 如果是组合题型则获取小题id
        if (this.questionData.childQuestionsList instanceof Array && this.questionData.childQuestionsList.length) {
          questionsId = this.questionData.childQuestionsList[0].id
        } else {
          questionsId = this.questionData.id
        }
      }
      console.log(this.assessment, 301)
      let data = {
        assessmentAutoId: this.assessment.id, // 自适应测评id
        questionsId, // 自适应测评id
        answer: this.answer, // 自适应测评id
        questionsSeq: this.questionsSeq // 第几题
      }
      if (!this.isLogin) {
        Object.assign(data, {
          grade: this.grade, // 年级
          subject: this.subject, // 科目
          textbookVersionId: this.textbookVersionId // 测评教材版本
        })
      }
      let opt = {
        ajaxSuccess: (data, res) => {
          this.loading = false
          this.answer = ''
          call(res.data)
        },
        url: api.getNextQuestions.path,
        method: api.getNextQuestions.method,
        data
      }
      this.loading = true
      this.ajax(opt)
    },
    lookTestRes () {
      this.$router.push({
        name: 'appraisal_math_open_start',
        query: {
          id: this.assessment.id,
          isFirst: this.isFirstAssessment,
          chapterId: this.$route.query.chapterId || '',
          grade: this.grade, // 年级
          subject: this.subject,
          textbookVersionId: this.textbookVersionId
        }
      })
    },
    reset () {
      this.$refs.questionScroller && this.$refs.questionScroller.reset()
    },
    cancel () {
      this.show1 = true
      this.message = '未完成指定自适应测评试卷，提前提交将不保存此次测评记录；确定提交？'
      //  this.$confirm('未完成指定自适应测评试卷，提前提交将不保存此次测评记录；确定提交？').then(_ => {
      //                    this.$router.push('/evaluationByself')
      //        })
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.top = -(this.$refs.scroller.offsetTop + $('.navigation').outerHeight() + 5) + ''
  },
  updated: function () {
    this.$nextTick(() => {
      this.questionShowHeight = $('#questionShow').outerHeight()
      this.reset()
    })
  },
  components: {
    questionShow, Scroller
  }
}

</script>
<style lang="scss">
    .choice-evaluation {
        background: #DEEAE1;
        box-sizing: border-box;
        padding: 0.15rem;
    }

    .question_header {
        //display: flex;
        //justify-content: space-between;
        height: 0.6rem;
        h3 {
            font-size: 0.15rem;
            color: #3E403F;

        }
        span {
            color: #8A8D8B !important;
            font-size: 0.11rem;
            span {
                color: rgb(253, 116, 22) !important;
                margin: 0 0.05rem;
            }
        }

    }

    /*@import "../../../src/assets/css/paper/question";*/

    /*.choice-evaluation {*/
    /*height: 950px;*/
    /*background-size: 100% 100%;*/
    /*!*background-image: url("../../assets/images/adaptiveEvaluation.jpg");*!*/
    /*.nodataTip {*/
    /*text-align: center;*/
    /*line-height: 500px;*/
    /*}*/
    /*.modal {*/
    /*.logo-wrap {*/
    /*position: absolute;*/
    /*top: 65px;*/
    /*left: 0px;*/
    /*}*/
    /*position: relative;*/
    /*width: 1200px;*/
    /*margin: 0 auto;*/
    /*padding-top: 150px;*/
    /*.title {*/
    /*font-size: 26px;*/
    /*background-color: #ebede1;*/
    /*font-weight: normal;*/
    /*font-style: normal;*/
    /*font-stretch: normal;*/
    /*line-height: 1.54;*/
    /*letter-spacing: 0.1px;*/
    /*text-align: center;*/
    /*color: #313131;*/
    /*.tip {*/
    /*float: right;*/
    /*margin-right: 50px;*/
    /*font-size: 16px;*/
    /*line-height: 2.5;*/
    /*letter-spacing: 0.1px;*/
    /*text-align: left;*/
    /*color: #313131;*/
    /*}*/
    /*}*/
    /*}*/
    /*.content {*/
    /*background: #ffffff;*/
    /*padding: 0 100px;*/
    /*min-height: 500px;*/
    /*position: relative;*/
    /*}*/
    /*.con-title {*/
    /*font-size: 14px;*/
    /*line-height: 3.57;*/
    /*text-align: left;*/
    /*.type {*/
    /*color: #11a63f;*/
    /*}*/
    /*}*/
    /*.con-main {*/
    /*min-height: 360px;*/
    /*max-height: 500px;*/
    /*overflow: auto;*/
    /*}*/
    /*.con-btn {*/
    /*padding: 20px 0;*/
    /*button {*/
    /*width: 140px;*/
    /*height: 46px;*/
    /*border-radius: 23px;*/
    /*line-height: 2.5;*/
    /*letter-spacing: 0.1px;*/
    /*color: #fefefe;*/
    /*background-color: #fd7416;*/
    /*border: none;*/
    /*cursor: pointer;*/
    /*}*/
    /*}*/
    /*}*/
</style>
