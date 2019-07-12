const thisFile = 'scheduleSyllabus';
const api = {

  list: { // 周历表
    path:  '/techTrainingProject/list',
    method: 'get'
  },
  //删除
  removeMessTitle:{
    path:  '/techTrainingProject/remove/',
    method: 'delete'
  },
  //修改
  edit:{
    path:'/techTrainingProject/modify',//{ids}
    method: 'post'
  },
  //导出
  exportWeekly:{
    path:'/scheduleSyllabusWeeklyDetail/exportWeeklyCalendar',//{ids}
    method: 'get'
  },
  selectMessTitle:{
    path:'/techCostSet/consumables/list',//{ids}
    method: 'get'
  },
  //判断名称是否存在
  checkName:{
    path:'/techTrainingProject/checkName',
    method: 'get'
  },

  selectList:{
    path:'/techCostSet/selectList',//{ids}
    method: 'get'
  },
  //修改回显
  editMessTitle:{
    path:'/techTrainingProject/get/',//{ids}
    method: 'get'
  },
  //提交
  submitMessTitle:{
    path:'/techTrainingProject/add',//{ids}
    method: 'post'
  },
  delete:'/techTrainingProject/remove/', // 删除节点（删除节点时调用）


};

export default api

