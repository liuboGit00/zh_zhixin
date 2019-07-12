const thisFile = 'scheduleSyllabus';
const api = {

  listMessTitle: { // 周历表
    path:  '/techCostSet/list',
    method: 'get'
  },
  //导出
  exportWeekly:{
    path:'/scheduleSyllabusWeeklyDetail/exportWeeklyCalendar',//{ids}
    method: 'get'
  },
  // 耗材成本
  selectMessTitle:{
    path:'/techCostSet/consumables/list',//{ids}
    method: 'get'
  },
  //耗材保存 或 修改
  submitMessTitle:{
    path:'/techCostSet/addOrUpdate',//{ids}
    method: 'post'
  },
  removeMessTitle:{
    path:'/techCostSet/remove/',//{ids}
    method: 'delete'
  }

};

export default api

