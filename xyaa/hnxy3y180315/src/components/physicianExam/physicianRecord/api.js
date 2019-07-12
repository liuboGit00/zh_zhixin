const thisFile = 'zy/examinee';
const api = {
  list: { // 列表
    path: thisFile + '/recordList',
    method: 'get'
  },
  automaticList: { // 定时循环调用 检录
    path: thisFile + '/automaticList',
    method: 'get'
  },
};

export default api
