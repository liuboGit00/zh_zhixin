<template>
    <div class="cs_moudle-head" :class="{'noAll':!hasAll}">
        <p v-if="~showItem.indexOf('textbookVersion')">
            <span>教材：</span>
            <span v-if="hasAll" @click="changeMoudle('textbookVersion')"
                  :class="select.textbookVersion == '' ? 'is-active' : ''">全部</span>
            <span v-for="(item,id) in textbookVersionList" :key="id"
                  :class="select.textbookVersion == id ? 'is-active' : ''"
                  @click="changeMoudle('textbookVersion',id)">{{item.name}}</span>
            <template v-if="!hasAll && !textbookVersionList">
                暂无教材
            </template>
        </p>
        <p v-if="~showItem.indexOf('grade')">
            <span>年级：</span>
            <span v-if="hasAll" @click="changeMoudle('grade')" :class="select.grade === '' ? 'is-active' : ''">全部</span>
            <span  v-for="index in teacherGrade" :key="index"
                   :class="select.grade == index ? 'is-active' : ''"
                   @click="changeMoudle('grade',index)">{{ index | grade(self) }}</span>
        </p>
        <p v-if="~showItem.indexOf('subject')&&!showSubject">
            <span>科目：</span>
            <span v-if="hasAll" @click="changeMoudle('subject')"
                  :class="select.subject == '' ? 'is-active' : ''">全部</span>
            <span v-for="(item,id) in subjectList" :key="id"
                  :class="select.subject == item.code ? 'is-active' : ''"
                  @click="changeMoudle('subject',item.code)">{{ item.value }}</span>
            <template v-if="!hasAll && !subjectList">
                暂无科目
            </template>
        </p>
        <p v-if="~showItem.indexOf('term')">
            <span>学期：</span>
            <span v-if="hasAll" @click="changeMoudle('term')" :class="select.term === '' ? 'is-active' : ''">全部</span>
            <span v-for="index in 2" :key="index"
                  :class="select.term === (index - 1) ? 'is-active' : ''"
                  @click="changeMoudle('term',index - 1)">{{ (index - 1) | term }}</span>
        </p>
        <p v-if="~showItem.indexOf('chapter')">
            <span>章节：</span>
            <span v-if="hasAll&&!notShowCharpter" @click="changeMoudle('chapter')"
                  :class="select.chapter == '' ? 'is-active' : ''">全部</span>
            <span v-for="(item,id) in chapterList" :key="id"
                  :class="select.chapter == id ? 'is-active' : ''"
                  @click="changeMoudle('chapter',id)">{{  item.name}}</span>
            <template v-if="!hasAll && !chapterList">
                暂无章节
            </template>
        </p>
        <p v-if="~showItem.indexOf('knowledge')">
            <span>知识点：</span>
            <span v-if="hasAll" @click="changeMoudle('knowledge')"
                  :class="select.knowledge == '' ? 'is-active' : ''">全部</span>
            <span v-for="(item,id) in knowledgeList" :key="id"
                  :class="select.knowledge == id ? 'is-active' : ''"
                  @click="changeMoudle('knowledge',id)">{{ item.name }}</span>
            <template v-if="!hasAll && !knowledgeList">
                暂无章节
            </template>
        </p>
        <p v-if="~showItem.indexOf('diffLevelCode')">
            <span>难度：</span>
            <span v-if="hasAll" @click="changeMoudle('diffLevelCode')"
                  :class="select.diffLevelCode == '' ? 'is-active' : ''">全部</span>
            <span v-for="(item,code) in diffLevelCodeList" :key="code"
                  :class="select.diffLevelCode == code ? 'is-active' : ''"
                  @click="changeMoudle('diffLevelCode',code)">{{ item.name }}</span>
            <template v-if="!hasAll && !diffLevelCodeList">
                暂无章节
            </template>
        </p>
    </div>
</template>
<script>
export default {
  props: {
    showItems: { // 显示项 --> ['textbookVersion']
      type: Array,
      default: () => []
    },
    selectItems: { // 初始化选中项 --> {textbookVersion:id}
      type: Object,
      default: () => ({})
    },
    disSel: { // 不可重新选择的项
      type: Array,
      default: () => []
    },
    hasAll: { // 是否有“全部”
      type: Boolean,
      default: true
    },
    notShowCharpter: '',
    showSubject: ''
  },
  data () {
    return {
      self: this,
      // 老师所教班级
      teacherGrade: [], // 默认小学
      // 缓存所有的科目
      allSubject: {},
      // 缓存所有章节
      allChapter: {},
      // 缓存所有知识点
      allKnowledge: {},
      // 显示项
      // showItem: ['textbookVersion', 'grade', 'term', 'subject', 'chapter', 'knowledge', 'diffLevelCode'],
      showItem: ['grade', 'term', 'subject', 'chapter', 'knowledge', 'diffLevelCode'],
      getDataItem: ['textbookVersion'], // 显示项中需要获取数据初始化的项
      // 待选项
      textbookVersionList: null, // 教材
      subjectList: null, // 科目
      chapterList: null, // 章节
      knowledgeList: null, // 知识点
      diffLevelCodeList: null, // 难度
      // 选中项
      select: { // 选中数据
        textbookVersion: '', // 教材
        grade: '', // 年级
        term: '', // 学期
        subject: '', // 科目
        chapter: '', // 章节,
        knowledge: '', // 知识点
        diffLevelCode: '' // 难度
      },
      // 接口
      api: {
        textbookVersion: 'textbook/version/all',
        chapter: 'textbookContent/queryChapterList',
        knowledge: 'textbookContent/queryKnowledgeListByChapter'
      }
    }
  },
  methods: {
    // 初始化
    init () {
      let intSel = false
      let types = this.$store.state.loginInfo.types
      let teacherGrade = null
      if (this.$store.state.loginInfo.textbookVersionList[0].length == 0) {
        teacherGrade = [[1, 2, 3, 4, 5, 6], [7, 8, 9], [10, 11, 12]]
      } else {
        teacherGrade = [[1, 2, 3, 4, 5], [6, 7, 8, 9], [10, 11, 12]]
      }
      this.teacherGrade = teacherGrade[types || 0]
      for (let key in this.selectItems) {
        this.select[key] = this.selectItems[key]
        if (key === 'grade') {
          this.changeGradeCall()
        }
        intSel = true
      }
      intSel && this.getChapterDataForServer()
      if (this.showItems.length) {
        this.showItem = this.showItems
      }
      // 如果显示项包含难度则初始化难度选项
      if (this.showItem.includes('diffLevelCode')) {
        this.initPiffLevelCodeList()
      }
      // 初始化选择数据
      this.showItem.map(type => ~this.getDataItem.indexOf(type) && this.getSelectDataForServer(type))
    },
    // 初始化难度
    initPiffLevelCodeList () {
      let questionDiffMap = this.$store.state.envs.questionDiffMap
      let temp = null
      if (questionDiffMap instanceof Object) {
        temp = {}
        Object.keys(questionDiffMap).map(key => temp[key] = {name: questionDiffMap[key], code: key})
      }
      this.diffLevelCodeList = temp
    },
    // 从服务器获取选择数据
    getSelectDataForServer (type, params, call) {
      console.log('msams')
      let opt = {
        ajaxSuccess: (data1, res) => {
          let data = {}
          if (res.data instanceof Array && res.data.length) {
            res.data.map(item => data[item.id] = item)
          } else {
            data = null
          }
          this[type + 'List'] = data
          call && call(data, res.data)
        },
        url: this.api[type],
        params

      }
      this.ajax(opt)
      console.log('msams1')
    },
    // 获取章节
    getChapterDataForServer () {
      if (!~this.showItem.indexOf('chapter')) {
        return
      }
      // 重置知识点
      this.select.knowledge = ''
      this.knowledgeList = null
      // 章节处理
      this.select.chapter = ''
      let {textbookVersion: textbookVersionId, grade, term, subject} = this.select
      // 教材、年级、学期、科目缺一不可
      // if (!textbookVersionId || !grade || term === '' || !subject) {
      if (!grade || term === '' || !subject) {
        this.chapterList = null
        return
      }
      // 缓存数据
      let cacheKey = [textbookVersionId, grade, term, subject]
      let cacheData = this.allChapter[cacheKey.join('-')]
      if (cacheData) {
        this.chapterList = this.$util._.defaultsDeep({} ,cacheData) // 读取缓存
        return
      } else {
        // 获取数据并缓存
        this.getSelectDataForServer('chapter', {
          textbookVersionId,
          grade,
          subject: this.subjectList[subject].code,
          term
        }, data => {
          this.allChapter[cacheKey.join('-')] = data
          for (let id in data) {
            if (!this.select.chapter) {
              this.changeMoudle('chapter', '')
            }
            break
          }
        })
      }
    },
    // 选择年级后回调
    changeGradeCall () {
      if (!this.select.grade && this.disSel.toString() != 'subject') {
        this.subjectList = null
        return
      }
      // 科目处理
      if (this.allSubject[this.select.grade]) { // 缓存中是否存在该年级的科目
        this.subjectList = this.$util._.defaultsDeep({} ,this.allSubject[this.select.grade])
      } else {
        console.log(this.$store.state.envs)
        let subjectArr = this.$store.state.envs.gradeMap[this.select.grade]
        if (this.disSel.toString() == 'subject') {
          subjectArr = this.$store.state.envs.gradeMap[this.teacherGrade[0]]
        }
        let subjectObj = {}
        subjectArr.map(item => subjectObj[item.code] = item)
        this.subjectList = subjectObj
        console.log(this.subjectList)
        this.allSubject[this.select.grade] = subjectObj
      }
      this.getChapterDataForServer()
    },
    // 选择章节后回调
    changeChapterCall () {
      if (!this.select.chapter) {
        this.knowledgeList = null
        return
      }
      // 知识点重置
      this.select.knowledge = ''
      if (this.allKnowledge[this.select.chapter]) {
        this.knowledgeList = this.$util._.defaultsDeep({} ,this.allKnowledge[this.select.chapter])
      } else {
        this.getSelectDataForServer('knowledge', {chapterIds: this.select.chapter}, obj => {
          this.allKnowledge[this.select.chapter] = obj
        })
      }
    },
    // 选择数据
    changeMoudle (type, id) {
      // 是否为不允许重新选择的项
      if (~this.disSel.indexOf(type)) {
        return
      }
      if (this.select[type] === id && id !== '') return
      this.select[type] = id !== undefined ? id : ''
      // 做对应类型的回调处理
      let callFun = this['change' + type.replace(/^\w/, type[0].toLocaleUpperCase()) + 'Call']
      if (typeof callFun === 'function') {
        callFun()
      } else if (['grade', 'term', 'subject'].includes(type)) {
        this.getChapterDataForServer()
      }
      let data = {}
      this.showItem.map(type => data[type] = this.getSelectData(type))
      this.$emit('change', data, this.select)
    },
    // 获取选择数据
    getSelectData (type) {
      // 如果有值则返回对象，否则返回空字符
      return this[type + 'List'] && this[type + 'List'][this.select[type]] || this.select[type]
    }
  },
  created () {
    this.init()
  }
}
</script>
<style lang="scss">
    .cs_moudle-head {
        width: 100%;
        font-size: 14px;
        background: #ffffff;
        padding-bottom: 10px;
        border-bottom: 0.01rem solid #cccccc;
        p {
            line-height: 0.24rem;
            font-size: 0.14rem;
            padding-left: 0.15rem;
            span {
                display: inline-block;
                cursor: pointer;
                margin-right: 0.1rem;
                font-size: 0.14rem;
            }
            .is-frist {
                border-left: none;
            }
            .is-active {
                color: #fd7416;
            }
        }
        &.noAll {
            p span:first-child i {
                display: none;
            }
        }
    }
</style>
