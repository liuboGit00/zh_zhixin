const api = {
  list: { // 列表
    path: 'zy/task/station/wait/nowList',
    method: 'get'
  },
  checkWaitInfo: {   //通过候考室id查询人员信息
    path: 'zy/arrage/getByWaitId',
    method: 'get'
  }
};

export default api
