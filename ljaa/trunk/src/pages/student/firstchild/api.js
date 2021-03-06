const file = '/'// 当前模块api前缀
const api = {
  getOpenId: {
    path: '/wxPay/getOpenId',
    method: 'get'
  },
  getJsapiTicket: {
    path: '/vip/paymentWx',
    method: 'post'
  },
  getJsapiTicket1: {
    path: '/wxPay/getJsapiTicket',
    method: 'post'
  },
  modify1: {//修改数据
    path: '/student/modify',
    method: 'put'
  },
  getQuestion:{//获取题目详情
    path:'/questions/get',
    method:'get'
  },
  libraryList: {//易错题难题库
    path: '/questions/library/list',
    method: 'put'
  },
  modifyStudent: {//同意添加
    path: '/groups/modifyStudent',
    method: 'post'
  },
  queryTextbookVersion: {//教材版本
    path: '/query-textbookVersion-by-subject',
    method: 'get'
  },
  modify2: {//修改数据
    path: '/modify',
    method: 'post'
  },
  getGradeStudent:{
    path: '/groups/students',
    method: 'get'
  },
  sysMsgList: {//
    path: 'sysMsg/list',
    method: 'get'
  },
  addStudents: {
    path: '/groups/addStudents',
    method: 'post'
  },
  removeStudent: {
    path: '/groups/removeStudent',
    method: 'delete'
  },
  questionsNotesAdd: {// 添加笔记
    path: 'questionsNotes/add',
    method: 'post'
  },
  myWrongListNum: {// 我的错题数
    path: 'questionsWrong/num',
    method: 'get'
  },
  myquestionsFavoriteNum: {// 我的收藏数
    path: 'questionsFavorite/num',
    method: 'get'
  },
  questionsNotesNum: {// 我的笔记数
    path: 'questionsNotes/num',
    method: 'get'
  },
  myWrongListList: {// 我的错题列表
    path: 'questionsWrong/myWrongList',
    method: 'get'
  },
  myquestionsFavoriteList: {// 我的收藏列表
    path: 'questionsFavorite/myFavoriteList',
    method: 'get'
  },
  questionsNotesList: {// 我的笔记列表
    path: 'questionsNotes/myNotesList',
    method: 'get'
  },
  sysMsgGet: {
    path: 'sysMsg/get',
    method: 'get'
  },
  myProductList: {
    path: 'product/myProductList',
    method: 'get'
  },
  myWrongList: {// 我的错题
    path: 'questionsWrong/myWrongList',
    method: 'get'
  },
  groupsList: {// 我的群组（学生查询自己的全部群）
    path: 'groups/list',
    method: 'get'
  },
  orderList: {// 获取订单
    path: 'order/list',
    method: 'get'
  },
  cancelOrder: {// 订单取消
    path: 'order/cancel',
    method: 'put'
  },
  queryStudents: {
    path: 'groups/queryStudentList',
    method: 'get'
  },
  studentQueryStudents:{
    path: 'groups/queryStudents',
    method: 'get'
  },
  getByNo: {// 获取群
    path: 'groups/getByNo',
    method: 'get'
  },
  joinGroup: {// 申请加入群组
    path: '/groups/join',
    method: 'post'
  },
  getWorkList: {
    path: 'work/myList',
    method: 'get'
  },
  getTestList: {
    path: 'evaluation/myList',
    method: 'get'
  },
  get: {//
    path: file + '/get?id=',
    method: 'get'
  },
  modify: {//
    path: file + '/modify',
    method: 'put'
  },
  queryWork: {// 我的作业
    path: '/work/myList',
    method: 'get'
  },
  myList: {// 我的测评
    path: '/evaluation/myList',
    method: 'get'
  },
  getMyEvaluationInfo: {// 查看试卷(测评)
    path: '/evaluation/getMyEvaluationInfo',
    method: 'get'
  },
  getMyWorkInfo: {// 查看试卷(已完成测评)
    path: '/work/getMyWorkInfo',
    method: 'get'
  },
  getUserWorkInfo: {// 查询个人详情(作业)
    path: '/work/getUserWorkInfo',
    method: 'get'
  },
  getGroupsInfo: {// 班级详情测评
    path: '/evaluation/getGroupsInfo',
    method: 'get'
  },
  getWorkGroupsInfo: {// 作业班级详情测评
    path: '/work/getGroupsInfo',
    method: 'get'
  },
  getUserEvaluationInfo: {//
    path: 'evaluation/getUserEvaluationInfo', // 测试查询个人详情
    method: 'get'
  },
  delete: {//
    path: file + '/remove?ids=',
    method: 'delete'
  },
  questionsWrong: {// 查询我的错题
    path: 'questionsWrong/get',
    method: 'get'
  },
  questionsFavorite: {// 我的收藏
    path: 'questionsFavorite/get',
    method: 'get'
  },
  questionsNotes: {// 查询我的笔记
    path: 'questionsNotes/get',
    method: 'get'
  },
  vipConfigList: {// 获取价格
    path: '/vipConfig/list',
    method: 'get'
  },
  vipPayment: {// 付钱
    path: '/vip/payment',
    method: 'post'
  },
  auditing: {// 同意添加
    path: '/friend/auditing',
    method: 'post'
  },
  getDetail: {// 班组详情
    path: '/groups/get',
    method: 'get'
  },
  // 班组通知
  message: {
    path: '/groupsNotice/query',
    method: 'get'
  }, // 解散群
  disbanded: {
    path: '/groups/disbanded',
    method: 'delete'
  },
  request: {// 获取班组成员列表
    path: '/groups/queryStudentList',
    method: 'get'
  },
  likeList:{//模糊搜索成员
    path: '/groups/studentsLike',
    method: 'get'
  },
  addStudent: {
    path: '/groups/addStudent',
    method: 'post'
  },
  //我的收藏
  myFavoriteList: {
    path: '/productFavorite/myFavoriteList',
    method: 'get'
  },

}
export default api
