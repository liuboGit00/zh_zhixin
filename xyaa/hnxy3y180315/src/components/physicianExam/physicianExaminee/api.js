const thisFile = 'zy/examinee';
const api = {
  list: { // 列表
    path: thisFile + '/list',
    method: 'get'
  },
  structure: { // 获取树结构
    path: '/zyTreeExaminee/query',
    method: 'get'
  },
  get: { // 编辑回显
    path: '/zy/examinee/get/',
    method: 'get'
  },
  excelImport: { // 导入
    path: '/zy/examinee/import/save/',
    method: 'post'
  },
  edit: { // 编辑
    path: '/zy/examinee/modify/',
    method: 'put'
  },
};

export default api
