const thisFile = 'assetsOut'
const api = {
  list: { // 列表数据
    path: thisFile + '/list',
    method: 'get',
  },
  get: { // 获取
    path: thisFile + '/get',
    method: 'get',
  },
  modify: { // 修改
    path: thisFile + '/modify',
    method: 'put',
  },
  add: { // 增加
    path: thisFile + '/add',
    method: 'post',
  },
  delete: thisFile + '/removes', // 删除
  select: { // 获取选择设备列表
    path: 'device/type/select/list',
    method: 'get',
  },
}

export default api
