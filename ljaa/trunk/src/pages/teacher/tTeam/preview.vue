<!--
****--@file     preview.vue
****--@date     2018/6/8 18:51
****--@author   ${王恒}
****--@describe   布置作业预览
-->
<template>
    <div class="paperView_edit">
        <header-title :notgo="addModal" @notGoResult="addModal=false"><template v-if="!addModal"><template
                v-if="paperType=='homework'">作业</template><template v-else>试卷</template>详情</template><template v-else>添加试题</template>
        </header-title>
        <div class="stance"></div>
        <div v-if="!addModal">
            <template v-if="error">
                <p class="urlParamsError">环境异常，请退出后重新登录</p>
            </template>
            <template v-else>
                <!-- 试卷顶部 -->
                <div class="paperHeader">
                    <div>
                        <flexbox>
                            <flexbox-item class="border" :span="6"><span v-if="paperType=='homework'">作业</span><span v-else>试卷</span>名称
                            </flexbox-item>
                            <div>
                                <x-input placeholder-align="right" placeholder="输入名称" text-align="right" v-model="info.name"></x-input>
                            </div>
                        </flexbox>
                        <flexbox>
                            <flexbox-item class="border"  :span="6">试题总分</flexbox-item>
                            <div> {{ info.score }}分</div>
                        </flexbox>
                        <flexbox v-if="paperType !== 'homework'">
                            <flexbox-item class="border"  :span="6">答题时间</flexbox-item>
                            <div>{{ (info.times / 60).toFixed(0)}}</div>
                        </flexbox>
                        <flexbox>
                            <flexbox-item class="border"  :span="6">题数</flexbox-item>
                            <div> {{ info.questionsLen }}题</div>
                        </flexbox>
                        <flexbox>
                            <flexbox-item class="border"  :span="6">发布时间</flexbox-item>
                            <div>       <span
                                    v-if="info.startTime && new Date(info.startTime).getTime() > now">{{info.startTime | formatDate('yyyy-MM-dd HH:mm')
                                }}</span>
                                <span v-else>{{ info.startTime ? '立即发布' : '——' }}</span></div>
                        </flexbox>
                    </div>
                </div>
                <!-- 试卷结构 -->
                <div class="paperBody" style="    background: #DEEAE1;">
                    <div style="margin-left: 0.15rem">
                        <template v-for="questionsTypeId in info.questionsListShowOrder">
                            <div class="paperQuestionType" style="width: 3.45rem">
                                <flexbox style="padding:0.1rem 0">
                                    <flexbox-item :span="6"> {{ questionType[questionsTypeId] }}</flexbox-item>
                                    <!-- <div>
                                        <x-button mini icon="el-icon-plus" class="greenButton"
                                                  @click.native="addQueToPaper(questionsTypeId)">添加题目
                                        </x-button>
                                    </div> -->
                                </flexbox>
                                <!--<div :span="12">-->
                                <!--<h3 :key="questionsTypeId" class="questionTypeText">-->
                                <!---->
                                <!--</h3>-->
                                <!--</div>-->
                                <!--<div :span="12" align="right">-->
                                <!---->
                                <!--</div>-->
                            </div>

                            <template v-for="(cItem,index) in info.questionsList[questionsTypeId]">
                                <question-show :key="cItem.id" :index="index+1"
                                               :showData="cItem" :class="'questionItem' + index" :has-do="1.7"
                                               :show-score="true"
                                               :show-answer="false" padingtop="8.5">
                                    <template slot="todoBox">

                                        <x-button mini type="success" style="height: 0.22rem;line-height: 0.22rem;background-color: #ccc"
                                                  @click.native="moveIndex(questionsTypeId,index,'up')"
                                                  :disabled="index==0">
                                            ↑
                                        </x-button>
                                        <x-button mini type="success" style="height: 0.22rem;line-height: 0.22rem;background-color: #ccc"
                                                  @click.native="moveIndex(questionsTypeId,index,'down')"
                                                  :disabled="index==info.questionsList[questionsTypeId].length-1">↓
                                        </x-button>
                                        <select ref="selects"  v-model="todoType[cItem.id]" placeholder="管理试题" style="width: 0.5rem;border-radius: 0.03rem;font-size: 0.1rem;padding: 0 0 0 2%;"
                                                @change="changeTodoType(todoType[cItem.id])">
                                            <option label="管理试题" value="undefined"  hidden style="text-align:center;">管理试题</option>
                                            <template v-for="(oItem,oIndex) in todoTypeOptions">
                                              <!--v-if="!cItem.groups || cItem.groups && oItem.value!='change'"-->
                                                <!-- 组题题型不允许替换 -->
                                                <option style="text-align:center;" :disabled="info.questionsList[questionsTypeId].length < 2 && oItem.value === 'delete'"
                                                        :key="oIndex" :label="oItem.label"
                                                        :value="oItem.value+'_'+questionsTypeId+'_'+index+'_'+cItem.id">{{oItem.label}}</option>
                                            </template>
                                        </select>
                                    </template>
                                </question-show>
                            </template>

                        </template>
                    </div>
                </div>

                <!--<el-row>-->
                <!--<el-col align="center" class="btnBox">-->
                <!--<load-btn @reloadPaper="reloadPaper" :btnData="reloadPaperBtn" v-show="editType=='add'"></load-btn>-->
                <!--<load-btn @listenSubEvent="listenSubEvent" :btnData="saveBtn"></load-btn>-->
                <!--</el-col>-->
                <!--</el-row>-->
            </template>
            <x-button class="btn_publish" @click.native="publishStart">发布</x-button>

        </div>
        <div v-if="addModal">
            <add-que-to-paper @cancel="cancel" @add="addCall" :selectedIds="selectedIds"
                              :selectItems="headerSelectObj" :btnText="btnText"
                              :questionsTypeId="todoQuestionsTypeId"></add-que-to-paper>
        </div>
        <!--&lt;!&ndash; 模态框 增加（add） &ndash;&gt;-->
        <!--<Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题" class-name="vertical-center-modal"-->
        <!--:width="900">-->
        <!--<modal-header slot="header" :content="contentHeader.addId"></modal-header>-->
        <!--<add-que-to-paper v-if="addModal" @cancel="cancel" @add="addCall" :selectedIds="selectedIds"-->
        <!--:selectItems="headerSelectObj" :btnText="btnText"-->
        <!--:questionsTypeId="todoQuestionsTypeId"></add-que-to-paper>-->
        <!--<div slot="footer"></div>-->
        <!--</Modal>-->
        <!--<Modal :mask-closable="false" v-model="publishModal" height="200" title="对话框标题"-->
        <!--class-name="vertical-center-modal" :width="300">-->
        <!--<modal-header slot="header" :content="contentHeader.publishId"></modal-header>-->
        <!--<el-row class="publishModal">-->
        <!--<p v-if="info.startTime && new Date(info.startTime).getTime() < now">作业将立即发布给学生</p>-->
        <!--<p v-else>作业将于{{ info.startTime | formatDate('yyyy-MM-dd HH:mm') }}发布给学生</p>-->
        <!--<el-col align="center">-->
        <!--<el-button type="success" @click="publish">确定</el-button>-->
        <!--<el-button @click="cancel('publish')">取消</el-button>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--&lt;!&ndash;<add-que-to-paper v-if="publishModal" @cancel="cancel" @add="addCall" :selectedIds="selectedIds"&ndash;&gt;-->
        <!--&lt;!&ndash;:selectItems="headerSelectObj" :btnText="btnText"&ndash;&gt;-->
        <!--&lt;!&ndash;:questionsTypeId="todoQuestionsTypeId"></add-que-to-paper>&ndash;&gt;-->
        <!--<div slot="footer"></div>-->
        <!--</Modal>-->

        <alert v-model="show" @on-hide="onHide">{{message}}</alert>
        <confirm v-model="showConfirm"
                 title=""
                 @on-confirm="publish">
            <p v-if="info.startTime && new Date(info.startTime).getTime() < now"><span
                    v-if="paperType=='homework'">作业</span><span v-else>试卷</span>将立即发布给学生</p>
            <p v-else><span
                    v-if="paperType=='homework'">作业</span><span v-else>试卷</span>将于{{ info.startTime | formatDate('yyyy-MM-dd HH:mm') }}发布给学生</p>
        </confirm>
    </div>
</template>
<!--<script src="http://pv.sohu.com/cityjson?ie=utf-8"></script>-->
<!--<script type="text/javascript">-->
<!--document.write(returnCitySN["cip"]+','+returnCitySN["cname"])-->
<!--</script>-->
<script>
/* 当前组件必要引入 */
import api from './api'
import HeaderTitle from '../header'
import questionShow from '../../../components/questionShow/show'
import XInput from '../../../../node_modules/vux/src/components/x-input/index.vue'
import addQueToPaper from './addQueToPaper'
import XButton from '../../../../node_modules/vux/src/components/x-button/index.vue'
// import addQueToPaper from './components/addQueToPaper'

// 当前组件引入全局的util
let Util = null
let oneDayTime = 1000 * 60 * 60 * 24
export default {
  name: 'createPaperPreview',
  props: ['operailityData'],
  data () {
    return {
      showConfirm: false,
      show: false,
      message: '',
      addModal: false,
      info: {
        startTime: new Date(),
        submitTime: new Date(new Date().setDate(new Date().getDate() + 1)),
        publishAnswerTime: new Date(new Date().setDate(new Date().getDate() + 1))
      },
      starTimes: new Date(),
      endTimes: new Date(new Date().setDate(new Date().getDate() + 1)),
      printModal: false,
      questionType: {}, // 题型
      questionTypeIndex: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      // 选择题、判断题、填空题、问答题
      saveBtn: {title: '保存', callParEvent: 'listenSubEvent', type: 'success'},
      reloadPaperBtn: {title: '换一批', callParEvent: 'reloadPaper', type: 'info'},
      pickerOptions1: {
        // 选择结束时间后设置开始日期的限制
        disabledDate: (time) => {
          if (this.starTimes != '') {
            return time.getTime() <= this.starTimes - oneDayTime
          }
        }
      },
      pickerOptions0: {
        // 选择开始时间后设置结束日期的限制
        disabledDate: (time) => {
          console.log(this.endTimes)
          if (this.endTimes < 0) {
            this.endTimes = ''
          }
          if (this.endTimes != '') {
            return time.getTime() >= this.endTimes
          }
        }
      },
      headerSelectObj: { // 当前试题的配置信息
        textbookVersion: '', // 教材
        grade: '', // 年级
        term: '', // 学期
        subject: '', // 科目
        chapter: '' // 章节
      },

      error: true,
      paperType: 'homework', // 试卷类型(homework布置作业|intelligent智能组卷)

      selectedIds: [], // 已经选择的试题id

      contentHeader: {
        addId: {id: 'addId', title: '选择试题'},
        publishId: {id: 'publishId', title: '确认发布'},
        printId: {id: 'printId', title: '打印'}
      },

      todoType: {}, // 操作类型
      todoQuestionsTypeId: '', // 操作试题类型id
      todoQuestionsObj: {id: '', index: ''}, // 操作试题索引
      todoTypeOptions: [{label: '替换试题', value: 'change'}],

      btnText: '添加',

      queTodoType: 'add', // 添加试题add|替换试题change
      editType: 'add',
      editTitle: false,
      publishModal: false,
      now: new Date().getTime(),
      drawDate: null,
      isClickStart: false,
      deleteId: '',
      scoreConf: 0
    }
  },
  methods: {
    onHide () {
      if (this.message = '发布成功') {
        this.$router.push({name: 'tBook', query: this.$route.query})
      }
    },
    handleStartTime (d) {
      this.starTimes = this.deformatterDate(d)
      this.isClickStart = true
      oneDayTime = 0
    },
    handleEndTime (d) {
      console.log(1)
      if (this.isClickStart) {
        oneDayTime = 0
      } else {
        oneDayTime = 1000 * 60 * 60 * 24
      }
      this.endTimes = this.deformatterDate(d)
    },
    // 初始化请求列表数据
    init () {
      let {type} = this.$route.params
      Util = this.$util
      if (['homework', 'intelligent', 'manual', 'template'].includes(type)) {
        this.paperType = type
        this.error = false
      } else {
        return
      }
      console.log(this.paperType)
      if (this.operailityData) {
        console.log(this.operailityData, 'whdsg')
        // 获取数据初始化
        this.$store.commit('papers/init')
        this.editType = 'edit'
        this.getShowData()
      } else {
        this.initInfo()
      }
      //        if (type == 'homework') {
      //          this.drawDate = this.$store.state.papers.chartOption
      //          this.drawHomeWork()
      //        }
    },
    initInfo () {
      let znPreview = this.$store.state.papers.znPreview
      console.log(this.$store.state.papers)
      let info = {}
      // 获取题型
      this.questionType = this.$store.getters['papers/questionsType']()
      // 从状态中初始化数据
      info = Util._.defaultsDeep({}, this.$store.state.papers.info)
      console.log(info)
      if (!znPreview || !info) {
        this.$router.push({name: 'selfCenter'})
        return
      }
      for (let key in this.headerSelectObj) {
        this.headerSelectObj[key] = info[key]
      }
      this.headerSelectObj.textbookVersion = this.info.textbookVersionId
      if (!info.name) {
        info.name = znPreview.title || ''
      }
      if (this.paperType === 'manual') { // 人工组卷
        ['cheatSetQuestionsSeqRandom', 'cheatSetOptionsSeqRandom', 'startTime', 'publishAnswerTime', 'releaseTime'].map(key => info[key] = znPreview[key])
      }
      info.startTime = znPreview.startTime || ''
      if (this.paperType === 'manual') {
        info.startTime = this.info.startTime
        info.submitTime = this.info.submitTime
        info.publishAnswerTime = this.info.publishAnswerTime
      }
      info.times = znPreview.times || ''
      info.selectedIds = this.$store.state.papers.questionsIds || []
      this.info = info
      console.log(this.info)
      this.todoType = {}
    },
    // 编辑标题
    editTitleCall () {
      this.editTitle = !this.editTitle
    },
    // 发布弹窗
    publishStart () {
      this.showConfirm = true
    },
    // 发布
    publish () {
      let data = {}
      if (this.paperType === 'homework') {
        data = this.getHomeworkPublishData() // 作业发布数据
      } else {
        data = this.getPublishData() //  测评发布数据
      }
      let opt = {
        ajaxSuccess: () => {
          this.show = true
          this.message = '发布成功'
          this.show = true
          //            this.$router.push({name: 'groupManage'})
        },
        url: api[this.paperType === 'homework' ? 'workAdd' : 'releaseAdd'].path,
        method: api[this.paperType === 'homework' ? 'workAdd' : 'releaseAdd'].method,
        jsonString: true,
        data
      }
      this.ajax(opt)
    },
    // 检查人工组卷的必填项
    checkManualPublishData () {
      let tag = this.submitForm('info')
      if (!this.info.name) {
        tag = false
        this.errorMess('请输入标题')
      }
      return tag
    },
    /** ********************************* 按钮事件 *********************************/
    // 添加试题到试卷中
    addQueToPaper (questionsTypeId) {
      this.todoQueToPaper('add', questionsTypeId)

      console.log(questionsTypeId)
    },
    // 上下移动
    moveIndex (questionsTypeId, index, type) {
      console.log(1)
      this.$store.commit('papers/moveQuestionsIndex', {questionsTypeId, index, type})
      console.log(1)
      this.initInfo()
    },
    // 保存
    listenSubEvent (isLoadingFun) {
      if (!this.submitForm('info')) {
        return
      }
      let data = this.getSaveData()
      if (data.questionNums < 1) {
        this.errorMess('试卷至少要有一道试题！')
        return false
      }
      if (!isLoadingFun) {
        isLoadingFun = function () {
        }
      }
      isLoadingFun(true)
      let opt = {
        ajaxSuccess: res => {
          this.$emit('edit', 'edit', '保存成功！')
        },

        jsonString: true,
        url: api[this.editType].path,
        method: api[this.editType].method,
        data

      }
      this.ajax(opt, isLoadingFun)
    },
    // 换一批
    reloadPaper (isLoadingFun) {
      let data = this.$util.getFormData(this.$store.state.papers.znPreview)
      if (!isLoadingFun) {
        isLoadingFun = function () {
        }
      }
      isLoadingFun(true)
      let opt = {
        ajaxSuccess: res => {
          this.$store.commit('papers/updateInfo', res.data)
          this.$store.commit('papers/initQuestionsList', res.data.questionsList)
          this.$store.commit('papers/getShowQuestionTypeOrder')
          this.initInfo()
        },

        jsonString: true,
        url: api.preview.path,
        method: api.preview.method,
        data

      }
      this.ajax(opt, isLoadingFun)
    },
    // 管理
    changeTodoType (type) {
      console.log(type)
      let todoObj = type.split('_')
      console.log(type)
      console.log(todoObj)
      this.deleteId = todoObj[3]
      switch (todoObj[0]) {
        case 'delete':
          this.$store.commit('papers/deleteQuestions', {
            questionsTypeId: todoObj[1],
            index: todoObj[2]
          })
          this.todoType[todoObj[3]] = ''
          // this.getQuestionScoreData()
          this.$store.commit('papers/getShowQuestionTypeOrder')

          break
        case 'change':
          this.reGetChatDate('change')
          //                  操作类型    题型id        操作索引    题目id
          this.todoQueToPaper(todoObj[0], todoObj[1], todoObj[2], todoObj[3])
          break
        default:
          break
      }
      this.initInfo()
    },
    reGetChatDate (type) {
      console.log(this.info.questionsListShowOrder)
      //        if(type=='delete'){
      //          this.drawDate=''
      //        }
    },
    /** ********************************** 数据相关 ********************************/
    /*
      * 点击提交按钮 监听是否验证通过
      * @param formName string  form表单v-model数据对象名称
      * @return flag boolean   form表单验证是否通过
      * */
    submitForm (formName) {
      let flag = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          flag = true
        }
      })
      return flag
    },
    checkData () {

    },
    // 获取保存数据
    getSaveData () {
      let data = this.$util.getFormData(this.info)
      let {id = '', textbookVersionId, stage, subject, grade, term, types, name, remark, times, score} = data
      let papersQuestions = []
      let start = 1 // 题目顺序从1开始

      for (let key in data.questionsList) {
        data.questionsList[key].map(item => {
          let isGroup = item.childQuestionsList instanceof Array && item.childQuestionsList.length
          let childQuestionsList = [] // 记录组题中的小题
          // 组合题型提取该题型下的所有小题
          if (isGroup) {
            item.childQuestionsList.map((cItem, cIndex) => {
              childQuestionsList.push({
                'questionsId': cItem.oldId || cItem.id,
                'seq': start,
                'score': cItem.score,
                'childQuestionsList': []
              })
              start++
            })
          }
          papersQuestions.push({
            'questionsId': item.oldId || item.id,
            'seq': isGroup ? '' : start,
            'score': isGroup ? '' : item.score,
            childQuestionsList
          })
          // 统计题数（累加）
          !isGroup && start++
        })
      }

      return {
        id,
        // 统计试题数量
        questionNums: start - 1,
        textbookVersionId,
        stage,
        subject,
        grade,
        term,
        types,
        name,
        remark,
        times,
        score,
        papersQuestions
      }
    },
    // 获取编辑数据
    getShowData () {
      let opt = {
        ajaxSuccess: res => {
          this.$store.commit('papers/updateInfo', res.data)
          this.$store.commit('papers/initQuestionsList', res.data.questionsList)
          this.$store.commit('papers/getShowQuestionTypeOrder')
          this.getPaperScoreType()
          this.initInfo()
        },

        url: api.get.path,
        method: api.get.method,
        params: {id: this.operailityData.id}

      }
      this.ajax(opt)
    },
    // 获取作业发布数据
    getHomeworkPublishData () {
      let {groupsId, subject, textbookVersionId, grade, diffLevel, cheatSetQuestionsSeqRandom,
        cheatSetOptionsSeqRandom, startTimeDate, submitTimeDate, submitTime} = this.$store.state.papers.znPreview
      let {name: title, score: totalScore, questionsLen: totalQuestions, questionsListShowOrder} = this.info
      let questionsList = []
      let showQuestionsList = this.info.questionsList
      let seq = 1 // 从1开始
      questionsListShowOrder.map(type => {
        showQuestionsList[type].map(item => {
          if (item.groups && item.childQuestionsList) { // 组题
            item.childQuestionsList.map(cItem => {
              questionsList.push({questionsId: cItem.id, score: cItem.score, seq})
              seq++
            })
          } else { // 基础题型
            questionsList.push({questionsId: item.id, score: item.score, seq})
            seq++
          }
        })
      })
      // startTime = new Date(startTime).getTime()
      // submitTime = new Date(submitTime).getTime()
      // startTimeDate = this.conductDate(this.info.startTime, 'yyyy-MM-dd HH:mm:ss')
      // submitTimeDate = this.conductDate(this.info.submitTime, 'yyyy-MM-dd HH:mm:ss')
      let data = {
        title,
        totalScore,
        totalQuestions,
        groupsId,
        subject,
        textbookVersionId,
        grade,
        diffLevel,
        cheatSetQuestionsSeqRandom,
        cheatSetOptionsSeqRandom,
        questionsList,
        startTimeDate,
        submitTimeDate
      }
      // data.startTime = new Date(startTime).getTime()
      // data.submitTime = new Date(submitTime).getTime()
      // data.startTimeDate = this.conductDate(this.info.startTime, 'yyyy-MM-dd HH:mm:ss')
      // data.submitTimeDate = this.conductDate(this.info.submitTime, 'yyyy-MM-dd HH:mm:ss')
      data.startTimeDate = this.info.startTime
      data.submitTimeDate = submitTime
      return data
      // return {
      //   title,
      //   totalScore,
      //   totalQuestions,
      //   groupsId,
      //   subject,
      //   textbookVersionId,
      //   grade,
      //   diffLevel,
      //   cheatSetQuestionsSeqRandom,
      //   cheatSetOptionsSeqRandom,
      //   questionsList,
      //   startTimeDate,
      //   submitTimeDate
      // }
    },
    // 获取测评发布数据
    getPublishData () {
      let {
        groupsId: releaseTo, remark, subject, textbookVersionId, term, grade, stage, times, diffLevel,
        startTime: releaseTime, submitTime: endTime, publishAnswerTime,
        cheatSetQuestionsSeqRandom, cheatSetOptionsSeqRandom
      } = this.$store.state.papers.znPreview
      let {name, score, questionsLen: questionNums, questionsListShowOrder} = this.info
      let papersQuestions = []
      let showQuestionsList = this.info.questionsList
      let paperTypes = {
        'manual': 0, // 0人工组卷
        'intelligent': 1, // 1智能组卷
        'template': 2 // 2 模板组卷
      }
      let types = paperTypes[this.paperType]
      let seq = 1
      questionsListShowOrder.map(type => {
        showQuestionsList[type].map(item => {
          let questionItem = {questionsId: item.id, score: item.score || '', seq: '', childQuestionsList: []} // 基础题型
          if (item.groups && item.childQuestionsList) { // 组题
            item.childQuestionsList.map(cItem => {
              questionItem.childQuestionsList.push({questionsId: cItem.id, score: cItem.score || '', seq: seq++})
            })
          } else {
            questionItem.seq = seq++
          }
          papersQuestions.push(questionItem)
        })
      })
      let data = {
        name,
        remark,
        score,
        questionNums,
        releaseTo,
        subject,
        textbookVersionId,
        term,
        grade,
        stage,
        diffLevel,
        times,
        types,
        releaseTime,
        endTime,
        publishAnswerTime,
        papersTypes: '2', // 0试卷/1联考/2测验'3 专题库
        cheatSetQuestionsSeqRandom,
        cheatSetOptionsSeqRandom,
        papersQuestions
      }
      if (this.paperType === 'manual') { // 人工组卷
        ['cheatSetQuestionsSeqRandom', 'cheatSetOptionsSeqRandom'].map(key => data[key] = this.info[key])
        data.times = (this.info.times || 0) * 60 // 分钟转换为秒
        data.releaseTime = this.conductDate(this.info.startTime, 'yyyy-MM-dd HH:mm:ss')
        data.endTime = this.conductDate(this.info.submitTime, 'yyyy-MM-dd HH:mm:ss')
        data.publishAnswerTime = this.conductDate(this.info.publishAnswerTime, 'yyyy-MM-dd HH:mm:ss') || ''
      }
      return data
    },
    // 试卷操作
    todoQueToPaper (type, questionsTypeId, index = '', id = '') {
      let todoText = {add: '添加', change: '替换'}
      this.queTodoType = type
      this.todoQuestionsTypeId = questionsTypeId
      this.todoQuestionsObj = {index, id}
      if (id) {
        this.todoType[id] = ''
      }
      this.btnText = todoText[type]
      this.openModel('add')
      //        this.$router.push({name:'haddQueToPaper',query:{groupsId:item.groupsId,seeType:'parents'}})
    },
    /** ********************************** 弹窗相关 ********************************/
    // 选择试题回调
    addCall (res) {
      if (this.$route.params.type == 'homework') {
        let temp = true
        for (var i in this.info.questionsList) {
          this.info.questionsList[i].map((item) => {
            if (res.id == item.id) {
              this.errorMess('所选试题已存在！')
              temp = false
            }
          })
        }
      }
      if (this.queTodoType == 'add') {
        // this.getQuestionScoreData(res)
        this.$store.commit('papers/addQuestionsList', {
          questionsTypeId: res.questionsTypeId,
          question: res
        })
        console.log(1)
        this.$store.commit('papers/getShowQuestionTypeOrder')
      } else if (this.queTodoType == 'change') {
        this.$store.commit('papers/updateQuestions', {
          questionsTypeId: res.questionsTypeId,
          index: this.todoQuestionsObj.index,
          data: res
        })
      }
      console.log(this.$store.getters['papers/questionsType']())
      this.initInfo()
      this.cancel('add')
    },
    //      // 获取试卷计分方式
    //      getPaperScoreType () {
    //        let {scoreType, papsersQuestionsTypeScoreList} = this.editType === 'add' ? this.$store.state.papers.znPreview : this.info
    //        let questionsTypeScoreObj = {}
    //        this.$util._.defaultsDeep([], papsersQuestionsTypeScoreList).map(item => questionsTypeScoreObj[item.questionsTypeId] = item.score)
    //        this.scoreConf = {scoreType, papsersQuestionsTypeScoreList, questionsTypeScoreObj}
    //      },
    // 重新计算试卷分数
    getQuestionScoreData (addQuestion) {
      let {scoreType, questionsTypeScoreObj} = this.scoreConf
      if (scoreType === 1) { // 按题型计算分数
        if (!addQuestion) {
          return
        }
        if (addQuestion.groups) {
          addQuestion.childQuestionsList.map(item => item.score = questionsTypeScoreObj[addQuestion.questionsTypeId])
        } else {
          addQuestion.score = questionsTypeScoreObj[addQuestion.questionsTypeId]
        }
        this.$store.commit('papers/addQuestionsList', {
          questionsTypeId: addQuestion.questionsTypeId,
          question: addQuestion
        })
      } else {
        this.getQuestionScoreByServer(addQuestion)
      }
    },
    // 系统计算分数
    getQuestionScoreByServer (addQuestion) {
      let data = this.getCalculationScoreData(addQuestion)
      let opt = {
        ajaxSuccess: res => {
          this.$store.commit('papers/initQuestionsList', res.data.questionsList)
          this.initInfo()
        },
        ajaxParams: {
          jsonString: true,
          url: api.calculationScore.path,
          method: api.calculationScore.method,
          data
        }
      }
      this.ajax(opt)
    },
    /*
      * 打开指定的模态窗体
      * @param options string 当前指定的模态:"add"、"edit"
      * */
    openModel (options) {
      console.log(this.selectedIds, this.headerSelectObj, this.btnText, this.questionsTypeId)
      this[options + 'Modal'] = true
    },
    // 取消
    cancel (targer) {
      this[targer + 'Modal'] = false
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  //    destroyed () {
  //      this.$store.commit('papers/destroy')
  //    },
  watch: {
    '$route' (to, from) {
      console.log(to, from)
      //        this.$router.go(0)
    }
  },
  components: {
    // 试题类型
    XButton,
    XInput,
    HeaderTitle,
    questionShow,
    addQueToPaper
    // 试题选择弹窗
    //      addQueToPaper, printShow
  }
}

</script>
<style lang="scss">
    .paperView_edit {
        select{
            -webkit-appearance: none;
            -webkit-tap-highlight-color: #fff;
            outline: 0;
            background: #fff;
            height: 0.22rem;
            position: relative;
            top: -0.01rem;
        }
        .border{
            font-weight: bold;
        }
        color: #363636;
        .vux-flexbox {
            box-sizing: border-box;
            padding: 0.1rem 0.1rem 0.1rem 0.16rem;
            border-bottom: 1px solid #EDF3EE;
            justify-content: space-between;
            align-items: center;
            .weui-cell{
                padding: 0;
            }
        }
        .btn_publish {
            width: 90%;;
            margin: 0.2rem;
            background-color: #1cc03b;
            color: white;
        }
    }

    /*@import "../../assets/css/paper/view";*/
    /*@import "../css/createPaper_preview";*/
</style>
