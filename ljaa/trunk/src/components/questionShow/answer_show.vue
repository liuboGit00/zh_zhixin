<!--
****--@file     answer_show
****--@date     2017/12/5 9:41
****--@author   YC
****--@describe 问答题-查看
-->
<template>
    <div class="answerShow">
        <div class="questionBox">
            <!-- 顶部 -->
            <div class="qHeader"></div>
            <!-- 主体部分 -->
            <div class="qContent" style="width: 100%">
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
                                    <div class="studentAnswer">学生答案：
                                    <div style="text-align: right;float: right">
                                        <slot name="answerRight"> </slot>
                                    </div>
                                    </div>
                                    <p class="qcfiAnswer qcfiAnswer_answer " v-html="questionData.studentAnswer"></p>
                                </div>
                            </div>
                        </template>


                        <!--<div :span="2/24" align="right">-->
                        <!--<slot name="answerRight">-->
                        <!--<x-button mini plain type="text" class="qcfShowExp" @click.native="showExp">查看解析 <i-->
                        <!--:class="showExpStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>-->
                        <!--</x-button>-->
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
            <!--<div class="qFooter" >-->
                <!--&lt;!&ndash;<div style="text-align: right;">&ndash;&gt;-->
                    <!--&lt;!&ndash;<slot name="answerRight"> </slot>&ndash;&gt;-->
                <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--</div>-->
        </div>
        <!--{{images}}-->
        <div class="qAnswerBox" v-if="showInput">
            <div>
                <!--<div @click="upPicture">点击拍照上传答案 </div>-->
                <up-loader
                        :max="varmax"
                        :images="images"
                        :handle-click="false"
                        :show-header="true"
                        :readonly="false"
                        :upload-url="uploadUrl"
                        :autoUpload="true"
                        name="file"
                        :params="params"
                        size="small"
                        @preview="previewMethod"
                        @add-image="addImageMethod"
                        @remove-image="removeImageMethod"
                ></up-loader>
                <!--<div v-html="images[0]"></div>-->
                <!--<img :src="images[0]"/>-->
                <!--<el-form>-->
                <!--<el-form-item label="填写答案：">-->
                <img :src="images[0]" width="100%" v-if="images.length"/>
                <input v-else type="textarea" style="min-height: 0.4rem;width: 100%" v-model="answerVal" @input="answer"
                       placeholder="请填写答案">
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
  import upLoader from 'vux-uploader'
  //当前组件引入全局的util
  let Util = null
  export default {
    name: 'questionAnswerShow',
    /**
     * index    题号
     * question 题目对象
     * hasDo 标题操作
     */
    props: ['index', 'question', 'hasDo', 'showAnswer', 'showInput', 'padingtop'],
    data () {
      return {
        active:'1',
        src:'',
        images: [],
        varmax: 1,
        uploadUrl: '/api/app/stu/file/uploadImg',
        answerVal: '',
        params: {mini: false},
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
      previewMethod (res) {
        console.log(1,res)
      },
      addImageMethod () {
        console.log('1212')
//        console.log(file)
        console.log(0)
      },
      removeImageMethod () {
        console.log(1)
      },
      //初始化请求列表数据
      init(flag) {
        if (this.question instanceof Object) {
          this.questionData = this.$util._.defaultsDeep({}, this.question)
        }

        if (this.questionData.studentAnswer != undefined) {
          if (/^<img.*>$/.test(this.questionData.studentAnswer)) {
            var b = /\/img([^\"]*?)\"/gi
            console.log(this.questionData.studentAnswer.match(b), 1212)
            let src = this.questionData.studentAnswer.match(b)[0].replace(/\"/g, '')
            if (!flag) {
              src = this.getStaticPath(src);
            }
            this.images = [src];
          } else {
            this.answerVal = this.questionData.studentAnswer
            this.answer()
          }

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
        this.images = [];
        this.answerVal = ''
        console.log('question', val)
        this.init(true);
      },
      images(val){
        console.log('imgs', val)
        if(val.length){
          val[0]=this.getStaticPath(val[0]);
          this.answerVal = '<img style=" width:100%" src="' + val[0] + '">';
          this.$emit('answer', this.answerVal)
        } else {
          if (/^<img.*>$/.test(this.answerVal)) {
            this.answerVal = ''
            this.answer()
          }
        }
      },

    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {upLoader,}
  }
</script>
<style>
    /*.answerShow{*/
      /*.weui-uploader__bd.small .weui-uploader__file{*/
          /*background: url('');*/
      /*}*/
    /*}*/

</style>
