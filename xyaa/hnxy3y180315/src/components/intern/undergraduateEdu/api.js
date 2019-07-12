const thisFile = 'weekSet';
const api = {
/*----- 周历 --------------------------------------------------------------------------------*/

  list: { // 列表数据
    path: thisFile + '/pagelist',
    method: 'get'
  },
  get: { // 获取
    path: thisFile + '/get',
    method: 'get'
  },
  modify: { // 修改
    path: thisFile + '/modify',
    method: 'put'
  },
  add: { // 增加
    path: thisFile + '/add',
    method: 'post'
  },
  delete: thisFile + '/remove', // 删除
  publish:{ //发布modifyStateRelease_release || 取消 modifyStateRelease_norelease
    path: thisFile + '/modifyStateRelease',
    method: 'put'
  },
  modifyStateIssued:{ //下发
    path: thisFile + '/modifyStateIssued',
    method: 'put'
  },
  cancelIssued:{ //取消下发
    path: thisFile + '/cancelIssued',
    method: 'put'
  },
  schools:{ //查询学校
    path: "/schools/queryList",
    method: 'get'
  },
  courseTime:{ //教研室设置时间添加
    path: thisFile + "/coursetime/add",
    method: 'post'
  },
  courseTimeModify:{ //教研室设置时间添加
    path: thisFile + "/coursetime/modify",
    method: 'put'
  },

  depOption:{ //教研室设置时间添加--请求科室列表
    path: "/hospital/dept/query/allNameId",
    method: 'get'
  },
  teachCourseTime:{  //活动时间段获取
    path: "/teachCourseTime/list",
    method: 'get'
  },
  monthCourseSet:{  //根据教学周历ID获取每个月课程设置
    path: thisFile + "/monthCourseSet",
    method: 'get'
  },
  modifySubmit:{ //上报教学周历设置 {id}
    path: thisFile + "/modifySubmit",
    method: 'put'
  },
  modifyNoSubmit:{  //取消上报教学周历 {id}
    path: thisFile + "/modifyNoSubmit",
    method: 'put'
  },
  dayCourseSet:{  //根据教学周历ID和时间获取一天的教学安排
    path: thisFile + "/dayCourseSet",
    method: 'get'
  },

/*----- 课程表管理 --------------------------------------------------------------------------------*/

  manageWeekSetTimeTables:{  //获取本教研室的周历分页列表-课程表
    path: thisFile + "/researchRoom/pagelist",
    method: 'get'
  },
  getMyTeachRoomCourse:{
    path: thisFile + "/weekCourse/getMyTeachRoomCourse",
    method: 'get'
  },
  weekCourseModify:{
    path: thisFile + "/weekCourse/modify",
    method: 'post'
  },
  monthCourseSetResearchRoom:{  //根据教学周历ID获取每个月课程设置-----教研室人员可看  舍弃
    path: thisFile + "/monthCourseSetResearchRoom",
    method: 'get'
  },
  monthCourseSetResearchRoomList:{  //根据教学周历ID获取每个月课程设置-----教研室人员可看
    path: thisFile + "/monthCourseSetResearchRoomList",
    method: 'get'
  },
  teachCourseTime:{
    path: "/teachCourseTime/list",
    method: 'get'
  },
  userGetCourse:{  //根据教学周历ID获取每个月课程设置-----教研室人员可看
    path: "/weekSet/userGetCourse",
    method: 'get'
  },

  /*----- 课程资料 --------------------------------------------------------------------------------*/
  teacherCourseFileList:{  //课程资料列表
    path: thisFile + "/teacherCourseFile/pagelist",
    method: 'get'
  },
  teacherCourseFileAdd:{  //添加课程资料
    path: thisFile + "/teacherCourseFile/add",
    method: 'post'
  },
  teacherCourseFileEdit:{  //修改课程资料
    path: thisFile + "/teacherCourseFile/modify",
    method: 'put'
  },
  teacherCourseFileShow:{  //查看课程资料
    path: thisFile + "/teacherCourseFile/get",
    method: 'get'
  },

  teacherCourse:{  //授课老师获取本人的课程（添加课程资料时弹出选择课程）
    path: thisFile + "/teacherCourse/list",
    method: 'get'
  },
  getCourseTypeByCode:{  //获取课程类型
    path: "/dictionary/getByCode/TEACH_COURSE_TYPE",
    method: 'get'
  },


  /*----- 课程表预览 --------------------------------------------------------------------------------*/
//教学活动安排表
teachctivityListType: '/teachctivityManagement/list',///{userType}

//活动时间段获取
//teachCourseTime:'/teachCourseTime/list',

  /*----- 签到记录 --------------------------------------------------------------------------------*/
  userSignRecord:{
    path: thisFile + "/userSignRecord/pagelist",
    method: 'get'
  },

  //教育处-课程表
  WeekSetTimeTables:'/weekSet/manageWeekSetTimeTables',

  //教育处-查看课程详情
  WeekSetManageGetCourse:'/weekSet/manageGetCourse',

  //老师-课程表
  WeekSetTeacherWeekSetTimeTables:'/weekSet/teacherWeekSetTimeTables',

  //老师-查看课程详情
  teacherGetCourse:'/weekSet/teacherGetCourse',

  //学员-课程表
  WeekSetUserWeekSetTimeTables:'/weekSet/userWeekSetTimeTables',

  //学员-学生查看课程详情
  weekSetUserGetCourse:'/weekSet/userGetCourse',

  /**学员*/
  //学员-学员获取课程安排
  userCurriculum:'/weekSet/userCurriculum',
  //学员-学员获取课程安排
  userCourse:'/weekSet/userGetCourse/',

  /**老师
   * */
  //老师-授课老师获取本人的课程
  teacherCourseFile:'/weekSet/teacherCourseFile/pagelist',
  //老师-授课老师获取本人的课程
  teacherCourseFileGet:'/weekSet/teacherCourseFile/get/',//{courseDataId}
  /**教育处
   * */
  //教育处-课程表
  manageWeekCourseFile:'/weekSet/manageWeekSetTimeTablesPageList',
  //教育处-教育处查看课程详情
  manageGetCourse:'/weekSet/manageGetCourse',//{courseDataId}


};

export default api

