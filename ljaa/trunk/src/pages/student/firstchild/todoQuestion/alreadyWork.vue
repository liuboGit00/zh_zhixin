<!--
****--@file     alreadyWork
****--@date     2018/5/30 11:08
****--@author   ${王恒}
****--@describe   已完成作业，测评查看详情
-->
<template>
    <div>
        <header-title>
            <slot>详情</slot>
        </header-title>
        <div class="stance"></div>

        <div class="recentPractice_next_question">

            <topic-alert  :questionList="questionList" :questionsId="questionData.id" @next="getAnswerQuestion"></topic-alert>
            <div class="question_header">
                <!--<p class="p"> {{viewData.studentName}}<span style="float: right">{{viewData.totalScore}}分</span></p>-->
                <h3 class="question_header_num" style="">第{{seq}}题 <span class="question_header_have" style="">还有<span class="question_header_queNum" style="">{{(data.length-seq)}}</span>题 </span></h3>
                <p class="questionsTypeName">题型  <span class="questionsTypeNameSpan">{{questionData.questionsTypeName}}</span></p>
            </div>
            <div ref="scroller">
            <scroller lock-y :scrollbar-x=false @on-scroll="getNext" :height="top" >
            <!--<div class="recentPractice_next_question" style="display: block">-->
             <div>
            <question-show :show-data="questionData" v-if="type==='homework'"
                           :showInput="!questionConf.seq[questionsSeq].isAnswer"
                           :showAnswer="questionConf.seq[questionsSeq].isAnswer"
                           @answer="setAnswer"></question-show>
            <!-- 老师布置的评测 -->
            <!--:showInput="!questionConf.seq[questionsSeq].isAnswer"-->
            <!--:showAnswer="questionConf.seq[questionsSeq].isAnswer"-->
            <question-show :show-data="questionData" v-else
                           :showInput="true"
                           @answer="setAnswer"></question-show>
                 <template v-if="type === 'test'">
                     <x-button
                             v-if="questionAnswerArr.length >= questionConf.count-1 && !~questionAnswerArr.indexOf(questionsSeq)"
                             @click.native="submit">提交
                     </x-button>
                     <template v-else>
                         <x-button  @click.native="saveAnswerAndNext">下一题</x-button>
                         <x-button @click.native="stopDoTest">提交</x-button>
                     </template>
                 </template>
                 <!-- 老师布置的作业 -->
                 <template v-else>
                     <x-button
                             v-if="questionConf.seq[questionsSeq].isAnswer && questionAnswerArr.length <= questionConf.count-1"
                             @click.native="next">下一题
                     </x-button>
                     <x-button v-if="!questionConf.seq[questionsSeq].isAnswer"
                               @click.native="confirm">确定
                     </x-button>
                     <x-button @click.native="stopDoHomework">提交</x-button>
                 </template>
             </div>
            </scroller>


            </div>
            <!--<swiper height="5.5rem" class="agag">-->
            <!--<swiper-item class="black" v-for="(item,index) in showQuestion" :key="index">-->
            <!--&lt;!&ndash;<div class="last_question">&ndash;&gt;-->

            <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--&lt;!&ndash;<div class="question_sidebar">&ndash;&gt;-->
            <!--&lt;!&ndash;<span>题型</span><span>单选题</span>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--&lt;!&ndash;<div class="question_content">&ndash;&gt;-->
            <!--&lt;!&ndash;李大伯有一片果林，共80棵果树，某日，李大伯&ndash;&gt;-->
            <!--&lt;!&ndash;开始采摘今年第一批成熟的果子，他随机选 取2&ndash;&gt;-->
            <!--&lt;!&ndash;棵果树共摘得果子，质量分别为（单位：kg）：&ndash;&gt;-->
            <!--&lt;!&ndash;0.28，0.26，0.24，0.23，0.25，0.24，0.26，&ndash;&gt;-->
            <!--&lt;!&ndash;0.26，0.25，0.23，以此计算，李大伯收获的这&ndash;&gt;-->
            <!--&lt;!&ndash;批果子的单个质量和总质量分别约为（ ）&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--&lt;!&ndash;<div>&ndash;&gt;-->
            <!--&lt;!&ndash;<div class="option" v-for="(item,index) in data" :key="index" @click="change(index)"&ndash;&gt;-->
            <!--&lt;!&ndash;:class="index==show ? 'active' : ''">&ndash;&gt;-->
            <!--&lt;!&ndash;<span>{{item.name}}</span>&ndash;&gt;-->
            <!--&lt;!&ndash;<span>{{item.number}}</span>&ndash;&gt;-->
            <!--&lt;!&ndash;<span>{{item.title}}</span>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--&lt;!&ndash;<x-button style="height: 0.4rem;font-size: 0.18rem" @click.native="open"&ndash;&gt;-->
            <!--&lt;!&ndash;:gradients="['#FF5E3A', '#FF9500']">确定&ndash;&gt;-->
            <!--&lt;!&ndash;</x-button>&ndash;&gt;-->
            <!--&lt;!&ndash;&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--</swiper-item>-->
            <!--</swiper>-->
            <!--</div>-->

            <div v-transfer-dom>
                <confirm v-model="confirmItem"
                         title="确认退出？"
                         @on-confirm="onConfirm"
                         class="sAskedAlert">
                    <p style="text-align:center;">{{message}}</p>
                </confirm>
            </div>
        </div>
        <alert title="提示" v-model="show">{{message}}</alert>
        <alert title="提示" v-model="showSuccess" @on-hide="onHide">{{message}}</alert>
    </div>
</template>
<script>
  /*当前组件必要引入*/
  let Util = null
  import HeaderTitle from '../../header'
  import api from './api'
  import questionShow from '../../../../components/questionShow/show'
  import topicAlert from '../../commonality/topicAlert.vue'
  export default {
    data () {
      return {
        top:'0',
        loading: false,
        confirmItem:false,
        showSuccess:false,
        show:false,
        message:'',
        questionsId: '', // 当前做题id
        questionsSeq: 0,
        answer: '',
        questionList:[],
        timerInt: null, // 时间计时器
        hour: 0,//时
        minute: 0,//分
        second: 0,//秒

        type: null, // 类型
        papersId: null, // 试题id
        groupsId: null, // 群组id（作业使用）
        startAnswerTime: null, // 每道题答题开始时间

        questionAnswerArr: [], // 答题索引
        questionConf: { // 试题配置信息
          count: 0, // 试题总共数量
          type: { // 试题题型id对象
            // 1:[{该题型下的试题对象}]
          },
          seq: { // 试卷对应的序号集
            // 1:{该序号对应的数据集}
          }
        },
        questionsSeqArr: [], // 试题题号数组
        evaluationInfo: null, // 试卷信息（评测专用）
        questionData: null // 试题信息
        timer:null,
        poition:0,
        temp:0,
      }
    },
    methods: {
      /*********************************** 初始化 *****************************/
      getNext(val){
        if(Math.abs(val.left)<Math.abs(val.top)){
          this.temp+=2;
          return
        }else if(Math.abs(val.left)>Math.abs(val.top)){
          this.temp=1;
        }
        if(val.left>0){
          this.poition=1
        }else if(val.left<0) {
          this.poition=-1
        }else if(this.temp==0||this.temp==1) {
          this.temp=0
          clearTimeout(this.timer)
          this.timer=setTimeout(()=>{
            let value=Number(this.questionsSeq)+this.poition;
            if(value<1||value==this.questionConf.count ){
              return
            }
            this.getAnswerQuestion(value)
          },500)

        }

      },
      //初始化请求列表数据
      init () {
        Util = this.$util
        let {type = '', papersId = ''} = this.$route.params
        let {groupsId} = this.$route.query
        if (!['test', 'homework'].includes(type) || isNaN(papersId)) {
          this.questionData = -1
          return
        }
        this.type = type
        this.papersId = papersId
        this.groupsId = groupsId

        if (this.type === 'test') {
          this.getMyEvaluationInfo()
        } else {
          this.queryQuestionList()
        }
      },

      /*********************************** 数据获取 ****************************/
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
            papersId: this.papersId
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
              papersId: this.papersId
            }
          },
          homework: {
            url: api.getWorkQuestionsSeq.path,
            method: api.getWorkQuestionsSeq.method,
            params: {
              workId: this.papersId,
              groupsId: this.groupsId
            }
          }
        }
        let opt = {
          ajaxSuccess: (data1, res) => {
            this.questionList = data1;
            console.log(this.questionList)
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
              console.log (2)
              doSomeOne = data.some(item => item.isAnswer)
              // 试题已经全部做完
              allHasDo = data.every(item => item.isAnswer)
              console.log(3)
              !allHasDo && data.map(item => {
                console.log(4)
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
              console.log(5)
            }

            this.questionsSeq = defIndex
            this.questionConf = questionConf
            this.questionsSeqArr = data

            if (allHasDo) { // 全部做完
              this.lookRes()
            } else if (doSomeOne) { // 已经做过题
              this.next()
            } else { // 没有做过题
              console.log(9)
              defIndex && this.jumpQuestionById(defIndex)
            }
          },
          url: ajaxParams[this.type].url,
          method: ajaxParams[this.type].method,
          params: ajaxParams[this.type].params

        }

        this.ajax(opt)
      },

      // 根据索引获取试题
      getQuestionsBySeq (seq) {
        clearInterval(this.timerInt)
        let params = {
          test: {
            questionsId: this.questionConf.seq[seq].questionsId,
            papersId: this.papersId
          },
          homework: {
            questionsId: this.questionConf.seq[seq].questionsId,
            workId: this.papersId,
            groupsId: this.groupsId
          }
        }
        this.ajax({
          ajaxSuccess:  (data, res) => this.getQuestionsSuccess(res),

          url: api[this.type === 'test' ? 'getQuestions' : 'getWorkQuestions'].path,
          method: api[this.type === 'test' ? 'getQuestions' : 'getWorkQuestions'].method,
          params: params[this.type]

        })
      },

      // 根据索引试题答案
      getAnswerQuestion (index) {
        let params = {
          test: {
            questionsId: this.questionConf.seq[index].questionsId,
            papersId: this.papersId
          },
          homework: {
            questionsId: this.questionConf.seq[index].questionsId,
            workId: this.papersId,
            groupsId: this.groupsId
          }
        }
        let opt = {
          ajaxSuccess: (data, res) => this.getQuestionsSuccess(res),
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
        console.log('lll')
        this.answer = ''
        this.questionData = res.data;
        console.log(this.questionData)
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

      /*********************************** 试题公共操作 *************************/
      // 跳题
      jumpQuestionById (seq) {
        this.questionsSeq = seq
        this.getQuestionsBySeq(seq)
      },

      // 试题答案处理
      setAnswer (d) {
        this.answer = d.toString()
      },

      // 还剩余几道题
      surplusQuestion () {
        return this.questionConf.count - this.questionAnswerArr.length - (!!~this.questionAnswerArr.indexOf(this.questionsSeq) ? 0 : 1)
      },

      // 下一题
      next () {
        let params = {
          test: {
            papersId: this.papersId,
          },
          homework: {
            workId: this.papersId,
            groupsId: this.groupsId
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
      saveAnswer (callFun, pushSeq = true) {
        if (this.answer === '') {
          this.show=true
          this.message='请先选择或填写答案'
          return false
        }

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
            if (pushSeq && !this.questionAnswerArr.includes(this.questionsSeq)) {
              this.questionAnswerArr.push(this.questionsSeq)
            }
            callFun && callFun.apply(this, res)
          },
          url: api[this.type === 'test' ? 'submitAnswer' : 'submitWorkAnswer'].path,
          method: api[this.type === 'test' ? 'submitAnswer' : 'submitWorkAnswer'].method,
          data:data[this.type],
          jsonString:true,
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

      // 计时
      timer () {//计时
        this.second = this.second + 1
        if (this.second > 59) {
          this.second = 0
          this.minute = this.minute + 1
        }

        if (this.minute > 59) {
          this.minute = 0
          this.hour = this.hour + 1
        }
      },

      // 试题做完提交
      submit () {
        this['submit' + this.getType()].apply(this)
      },

      // 停止继续做
      stopDo (fun) {
        // 有答案就提交,提交之后再进行询问(避免一个试题重复提交答案)
        if (this.answer && !this.questionAnswerArr.includes(this.questionsSeq)) {
          this.saveAnswer(() => {
            this.stopDo()
          })
          return
        }
        if (!this.questionAnswerArr.length) {
          this.show=true
          this.message='至少需要答一道题才能提交'
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
          ajaxParams: {
            url: api[this.type === 'test' ? 'submitPapers' : 'submitWork'].path,
            method: api[this.type === 'test' ? 'submitPapers' : 'submitWork'].method,
            data: data[this.type]
          }
        }
        this.ajax(opt)
      },

      /*********************************** 测评试题操作 *************************/
      // 保存答案并获取下一题
      saveAnswerAndNext () {
        this.saveAnswer(res => {
          this.answer = ''
          this.next()
        })
      },

      // 停止做测评
      stopDoTest () {
        this.confirmItem=true;
        this.message='当前测评还未完成，是否确认提交？'
//        this.stopDo(() => this.$confirm('当前测评还未完成，是否确认提交？').then(_ => {
//          this.alertTest()
//        }).catch(() => {
//        }))
      },

      // 测试提交答案弹出确认
      alertTest () {
        if (this.evaluationInfo.publishAnswerTime < new Date().getTime()) { // 当前还未到公布答案时间
          this.lookRes()
        } else {
          this.showSuccess = true;
          this.message = `测评结果将于${this.conductDate(this.evaluationInfo.publishAnswerTime, 'yyyy-MM-dd HH:mm')}时公布`;
        }
      },
      onHide(){
        this.lookRes()
      },

      // 评测提交
      submitTest () {
        this.saveAnswer(() => this.alertTest(), false)
      },

      // 查看测评结果
      goTestRes () {
        if (this.evaluationInfo.publishAnswerTime < new Date().getTime()) {
          // 立即公布
          this.$router.push({name: 'homeworkRes', params: {id: this.papersId, type: this.type}}) // 跳转到结果页面
        } else {
          // 延迟公布
          this.$router.push({name: 'selfHomework', query: {view: 'my' + this.getType(), finish: 1}}) // 跳转到：我的作业-我的评测-已完成
        }
      },

      /*********************************** 作业试题操作 *************************/
      // 保存答案并获取正确答案
      confirm () {
        this.saveAnswer(() => this.showAnswer())
      },
      onConfirm(){
        if(this.message=='当前作业还未完成，是否确认提交？'){
          this.lookRes()
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
          this.showSuccess=true;
          this.message='恭喜你题目已经做完了，上交作业并查看详情吧'
        } else {
          this.stopDo(() => {
            if (this.answer != '') {
              this.showAnswer()
            }
//            this.$confirm('当前作业还未完成，是否确认提交？').then(_ => {
//              this.lookRes()
//            }).catch(() => {
//            })
            this.confirmItem=true;
            this.message='当前作业还未完成，是否确认提交？'
          })
        }
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.top = -this.$refs.scroller.offsetTop + ''
    },
    components: {
      questionShow,topicAlert,HeaderTitle
    }
  }

</script>
<style lang="scss">
    @import '../../../../css/home/recentPractice_next/recentPractice_next_question';
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
</style>
