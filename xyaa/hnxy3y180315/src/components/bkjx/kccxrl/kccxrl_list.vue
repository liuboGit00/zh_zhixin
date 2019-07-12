<!----------------------------------
****--课程查询-日历
****--@date
****--@author
----------------------------------->
<template>
  <div>
    <div class="newCalendar calendareManagement">
      <full-calendar ref="calendar" class="test-fc" :tpl="calendarSet.tpl" :itemLimit="calendarSet.itemLimit"
                     :events="calendarSet.fcEvents"
                     first-day='1' locale="zh-cn"
                     @changeMonth="changeMonth"
                     @moreClick="moreClick"
                     @goPrev="goPrev"
                     @goNext="goNext">
        <template slot="fc-header-left" scope="p">
          <span style="font-size: 16px;">{{monthTitle}}</span>
        </template>
        <template slot="fc-header-center" scope="p">
          <span v-if="false">周-历</span>
        </template>
        <template slot="fc-header-right" scope="p">
          <div style="float: right">
            <el-button-group>
              <el-button type="primary" icon="arrow-left" @click="goPrev"></el-button>
              <el-button type="primary" icon="arrow-right" @click="goNext"></el-button>
            </el-button-group>
          </div>
        </template>
        <template slot="fc-event-card" scope="p">
          <p>{{ p.event.title }}</p>
        </template>
      </full-calendar>
      <br/>
    </div>


  </div>
</template>
<style>
  .newCalendar .comp-full-calendar {
    max-width: 1280px;
    padding: 10px 0;
  }

  .newCalendar .full-calendar-body .dates .dates-events .events-week .events-day {
    min-height: 90px;
  }

  .newCalendar .full-calendar-body .dates .dates-events .events-week .events-day .event-box {
    overflow: hidden;
    width: 95%;
    position: relative;
    top: -18px;
  }
</style>
<script>
  /*当前组件必要引入*/
  import fullCalendar from 'vue-ambuf-fullcalendar';
  import setCurriculum from './setCurriculum.vue';

  //引入日历相关的配置
  import calendarSet from './calendarSet.js';

  //引入当前组件字典api
  import api from './api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'whereFrom'],
    data() {
      return {
        //是否显示全日历
        isBack:false,
        isShowCalendar: false,
        holidayList: [],//获取的当个月的节假日列表

        //全日历
        calendarSet,
        //学期
        semesterOptions: [
          {
            key: 'ONE',
            value: '一'
          }, {
            key: 'TWO',
            value: '二'
          }],
        semesterVal: '',
        monthTitle: '',

        //form表单bind数据
        formValidate: {
          schoolIds: '',
          schoolNames: '',
          weekSetStartTime: '',
          weekSetEndTime: '',
          semester: '',
          gradeNum: '',
          classNum: '',
          weekSetInstructions: '',
        },

        //当前月
        currMonth: '',

        //获取时间段设置的课程
        courseTimeData: {},

        //根据教学周历ID获取每个月课程设置
        getMonthCourseSet: {
          ajaxSuccess: 'getMonthCourseData',
          ajaxParams: {
            url: api.calendar.path,
            method: api.calendar.method,
            params: {
              yearMonth:this.currMonth
            }
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
      },

      //根据教学周历ID获取每个月课程设置--server回调
      getMonthCourseData(responseData) {

        let data = responseData.data;
        let myData = [];
        let range = [];
        let currFormate = ['上', '下', '晚'];
          Util._.forEach(data, (v, k) => {
            let contentArr = v;
            for (var i = 0; i < contentArr.length; i++) {
              let num = i + 1;//(i+1);
              let tempObj = {
                courseContent: contentArr[i]['courseContent'] || '',
                specialty: contentArr[i]['specialty'] || '',
                teacherName: contentArr[i]['teacherName'] || '',
                sectionOrder: contentArr[i]['sectionOrder'] || '',
                classHour: contentArr[i]['classHour'] || '',
                teachPlace: contentArr[i]['teachPlace'] || '',
              }
              let back = tempObj['sectionOrder'].split('-')
              let backStart = back[0]
              let backEnd = back[1]
              if(backStart >= 5 && backEnd >= 5){
                this.isBack = true
              }else{
                this.isBack = false
              }
              // myData.unshift({
              //   cssClass: (this.isBack)?(['event-item.is-start', 'kg']):(['event-item.is-start', 'cq']),
              //   title: `课程内容：${tempObj['courseContent']} 专业：${tempObj['specialty']} 教师：${tempObj['teacherName']} 节次：${ tempObj['sectionOrder'] } 学时：${ tempObj['classHour'] }  地点：${ tempObj['teachPlace'] }`,
              //   start: k,
              //   end: k,
              // })
              myData.push({
                cssClass: (this.isBack)?(['event-item.is-start', 'kg']):(['event-item.is-start', 'cq']),
                title: `课程内容：${tempObj['courseContent']} 专业：${tempObj['specialty']} 教师：${tempObj['teacherName']} 节次：${ tempObj['sectionOrder'] } 学时：${ tempObj['classHour'] }  地点：${ tempObj['teachPlace'] }`,
                start: k,
                end: k,
              })
            }

          })
        calendarSet.setCalData(myData);
      },

      /**循环周历当前时间的前后45天，并处理数据*/
      getDate(fun) {
        let date = this.parseDate(this.currMonth + '-15', 'yyyy-MM-dd').getTime();
        let firstDate = date - 45 * 86400000
        let lastDate = date + 45 * 86400000
        for (let i = firstDate; i < lastDate; i += 86400000) {
          if (![0, 6].includes(new Date(i).getDay())) continue;
          fun(i);
        }
      },

      goPrev() {
        this.$refs.calendar.goPrev();
      },
      goNext() {
        this.$refs.calendar.goNext();
      },
      changeMonth(start, end, current, foramatData) {
        this.monthTitle = foramatData(current, 'MMMM YYYY');
        this.currMonth = this.conductDate(current, 'yyyy-MM');
        this.getMonthCourseSet.ajaxParams.params.yearMonth = this.currMonth
        this.ajax(this.getMonthCourseSet)
      },

      //关闭当前组件
      cancel() {
        this.$emit('cancel', 'show');
      },

      /**
       *
       * @param day
       * @param events
       * @param jsEvent
       */
      moreClick(day, events, jsEvent) {
      },

    },
    created() {
      this.init();
    },
    watch: {
      weekSetId(val) {

      }
    },
    mounted() {

    },
    components: {
      fullCalendar,
      setCurriculum,
    }
  }
</script>
<style lang="scss">
  .calendareManagement {
    height: 100%;
    overflow: auto;
    .handle {
      width: 650px;
      margin: 20px auto 0;
      font-size: 16px;
    }
    .middle {
      width: 600px;
      margin: 0 auto;
    }

    .myAttendance .comp-full-calendar {
      max-width: 100%;
      padding: 10px 0;
    }
    .full-calendar-body .dates .dates-events .events-week .events-day {
      min-height: 99px;
      position: relative;
      .event-box {
        overflow: hidden;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 99px;
        .label {
          height: 99px;
          line-height: 99px;
          text-align: center;
          width: 100%;
        }
        .cq {
          background: rgba(26, 158, 216, 0.7);
        }
        .bj {
          background: rgba(255, 255, 0, 0.7);
        }
        .hj {
          background: rgba(253, 36, 255, 0.7);
        }
        .qt {
          background: rgba(4, 253, 2, 0.7);
        }
        .kg {
          background: rgba(250, 54, 0, 0.7);
        }
        .weekEnd {
          background: rgba(134, 134, 134, 0.2);
        }
        .event-item.is-end {
          margin-right: 0;
        }
        .event-item.is-start {
          margin-left: 0;
        }
      }
    }

    .mark {
      width: 50px;
      height: 40px;
    }
    .cq {
      background: rgba(26, 158, 216, 0.7);
    }
    .bj {
      background: rgba(255, 255, 0, 0.7);
    }
    .hj {
      background: rgba(253, 36, 255, 0.7);
    }
    .qt {
      background: rgba(4, 253, 2, 0.7);
    }
    .kg {
      background: rgba(250, 54, 0, 0.7);
    }
    .events-week {
      margin-top: 0px !important;
      height: 99px;

    }

  }

</style>
