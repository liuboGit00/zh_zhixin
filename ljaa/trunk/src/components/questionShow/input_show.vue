<!--
****--@file     input_show
****--@date     2017/12/5 9:41
****--@author   YC
****--@describe 填空题-查看
-->
<template>
    <div>
        <div class="questionBox">
            <!-- 顶部 -->
            <div class="qHeader"></div>
            <!-- 主体部分 -->
            <div class="qContent">
                <!-- 问题标题 -->
                <div class="qcTitle" :class="{'hasDo':hasDo}">
                    <!-- 问题显示区域 -->
                    <span v-if="index" class="qctIndex" :style="{paddingTop:padingtop+'%'}">{{ index }}.</span>
                    <div class="qctTextBox" v-html="questionData.title" :style="{paddingTop:padingtop+'%'}"></div>
                    <div class="qctTodoBox" :style="{width:hasDo + 'rem'}">
                        <slot name="todo"></slot>
                    </div>
                </div>
                <!-- 问题选项 -->
                <div class="qcMain"></div>
                <!-- 答案及解析 -->
                <div class="qcFooter" v-if="showAnswer&&questionData.studentAnswer !== undefined">
                    <div>
                        <!-- 学生答案 -->
                        <template v-if="questionData.studentAnswer !== undefined">
                            <div>
                                <div class="qcfItem">
                                    <div  class="studentAnswer">
                                        学生答案：
                                        <div style="text-align: right;float: right">
                                            <slot name="answerRight"> </slot>
                                        </div>
                                    </div>
                                    <p class="qcfiAnswer qcfiAnswer_answer" v-if="questionData.studentAnswer !== null">{{
                                      questionData.studentAnswer }}</p>
                                    <p class="qcfiAnswer qcfiAnswer_answer" v-else></p>
                                </div>
                            </div>
                        </template>
                        <!--<div>-->
                            <!--<div class="qcfItem">-->
                                <!--<p  class="studentAnswer">正确答案：</p>-->
                                <!--<p class="qcfiAnswer qcfiAnswer_answer" v-html="questionData.answer"></p>-->
                            <!--</div>-->
                        <!--</div>-->

                        <!--<div :span="2/24" align="right">-->
                        <!--<slot name="answerRight">-->
                        <!--<el-button type="text" class="qcfShowExp" @click.native="showExp">查看解析 <i-->
                        <!--:class="showExpStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>-->
                        <!--</el-button>-->
                        <!--</slot>-->
                        <!--</div>-->
                    </div>
                    <!--<div class="qcfExpCon" v-if="showExpStatus">-->
                        <!--<div><span class="analysis">解析：</span>  <span class="detail" v-html="questionData.answerExplain"></span></div>-->
                    <!--</div>-->

                </div>
                <div class="qcFooter" v-if="showAnswer">
                    <div>
                        <div>
                            <div class="qcfItem">
                                <p class="studentAnswer studentAnswerItem "> <span :class="active==1?'activeSelect':''" @click="active=1"> 正确答案 </span><span @click="active=2"  :class="active==2?'activeSelect':''"> 解析</span> </p>
                                <p v-if="active=='1'" style="color: #fd7416;" class="qcfiAnswer qcfiAnswer_answer" v-html="questionData.answer"></p>
                                <p v-if="active=='2'"> <span class="qcfiAnswer qcfiAnswer_answer" style="font-size: 0.12rem;color: #fd7416" v-html="questionData.answerExplain"></span></p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <!-- 底部 -->
            <!--<div class="qFooter">-->

            <!--</div>-->
        </div>
        <div class="qAnswerBox" v-if="showInput">
            <div>
                <!--<el-form>-->
                <!--<el-form-item label="填写答案：">-->
                <input type="textarea" v-model="answerVal" @input="answer" style="min-height: 0.4rem;width: 100%"
                       placeholder="请填写答案"></input>
                <!--</el-form-item>-->
                <!--</el-form>-->
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    @import "../../assets/css/question";
</style>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null
  export default {
    name: 'questionInputShow',
    /**
     * index    题号
     * question 题目对象
     * hasDo 标题操作
     */
    props: ['index', 'question', 'hasDo', 'showAnswer', 'showInput', 'padingtop'],
    data () {
      return {
        active:1,
        answerVal: '',
        showExpStatus: true, // 显示解析
        optionsSpan: 24, // 选项展示比例
        questionData: {
          'score': '', // 分值
          'title': '', // 题目内容：文字
          'answer': '', // 正确答案：多个|隔开
          'answerExplain': '', // 答案解析
          'questionsOptions': null // 试题选项：单选题、多选题、判断题 有此项。填空题 没有此项
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        if (this.question instanceof Object) {
          this.questionData = this.$util._.defaultsDeep({}, this.question)
        }
        this.answerVal = ''
        if (this.questionData.studentAnswer !== undefined && this.questionData.studentAnswer !== null) {
          this.answerVal = this.questionData.studentAnswer
          this.answer()
        }
      },
      showExp () {
        this.showExpStatus = !this.showExpStatus
      },
      answer () {
        this.$emit('answer', this.answerVal)
      }
    },
    watch: {
      question (val) {
        console.log(val)
        this.init()
      }
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {}
  }
</script>
