const thisFile = '/tree';
const api = {
  list: { // 获取节点详情（修改树节点加载时调用）
    path: '/techCourse/list',
    method: 'get'
  },
  relationList:{  //用物关联查询列表
    path: '/techCourse/relationList',
    method: 'get'
  },
  queryDetail:{  //用物关联链接
    path: '/techCourseProject/queryDetail',
    method: 'get'
  },
  baseUrl: {
    path: thisFile,
  },
  get: { // 获取节点详情（修改树节点加载时调用）
    path: '/techCourseTree/get/',
    method: 'get'
  },
  add: { // 添加节点（新建节点时调用）
    path: thisFile + '/add',
    method: 'post'
  },
  structure: { // 获取树结构（加载技能考核内容树结构时调用）
    path: '/techCourseTree/query',
    method: 'get'
  },
  modify: { // 修改节点（修改节点提交是调用）
    path: thisFile + '/modify',
    method: 'put'
  },
  listMessTitle: { //
    path:  '/techCostSet/list',
    method: 'get'
  },
  addMessTitle:{
    path:'/techCourseProject/query',//{ids}
    method: 'get'
  },
  //耗材保存 或 修改
  submitMessTitle:{
    path:'/techCourseProject/addOrUpdate',//{ids}
    method: 'post'
  },
  // 耗材成本
  selectMessTitle:{
    path:'/techTrainingProject/queryAll',//{ids}
    method: 'get'
  },
  removeMessTitle:{  // 删除
    path:'/techCourseProject/remove/',//{ids}
    method: 'delete'
  },
  delete: thisFile + '/remove', // 删除节点（删除节点时调用）
};

export default api
