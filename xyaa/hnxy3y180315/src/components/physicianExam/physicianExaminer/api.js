const thisFile = 'zy/examiner';
const api = {
  list: { // 列表
    path: thisFile + '/list',
    method: 'get'
  },
  structure: { // 获取树结构
    path: '/zyTreeExaminer/query',
    method: 'get'
  },
  dictionary: { // 业务字典
    path: '/dictionary/getByCode/',
    method: 'get'
  },
  add: { // 添加
    path: '/zy/examiner/add',
    method: 'post'
  },
  get: { // 编辑回显
    path: '/zy/examiner/get/',
    method: 'get'
  },
  edit: { // 编辑
    path: '/zy/examiner/modify/',
    method: 'put'
  },
  excelImport: { // 导入
    path: '/zy/examiner/import/save/',
    method: 'post'
  },
};

export default api
