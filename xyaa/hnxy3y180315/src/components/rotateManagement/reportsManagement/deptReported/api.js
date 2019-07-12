const thisFile = 'rotationProcess/rotaryDepSign';
const api = {
  depList: { // 获取所有科室的ID NAME
    path: '/hospital/dept/query/allNameId',
    method: 'get',
  },
  list: { // 科室报到列表
    path: thisFile + '/pageList',
    method: 'get'
  },
  signDep: { // 科室报到
    path: thisFile + '/signDep/', // {podId}
    method: 'post',
  },
  modifyDjTeacher: { // 科室报到
    path: thisFile + '/modifyDjTeacher', // {podId}
    method: 'put',
  },
  get: { // 查看单个轮转详情
    path: '/traineeRotary/arrangeRotary/getRotaryInfo/', // {podId}
    method: 'get'
  }
}

export default api
