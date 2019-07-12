const thisFile = 'zy/task/station/wait/room/';
const api = {
  list: { // 列表
    path: thisFile + 'queryAll',
    method: 'get'
  },
  enterRoom: { //进入考站
    path: thisFile + 'getInto',
    method: 'get'
  },
  updateExamStatus: {   //修改考试状态
    path: thisFile + 'modifyStatus',
    method: 'get'
  },
  updateTime:{
    path: thisFile + 'timeCheck',
    method: 'get'
  }
};

export default api
