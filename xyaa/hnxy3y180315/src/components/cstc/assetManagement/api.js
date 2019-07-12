const thisFile = 'assetBase'
const thisFile1 = 'assets'
const api = {
  select: { // 获取基础信息选择列表
    path: thisFile + '/selectList',
    method: 'get',
  },
  baseAsset: { // 获取基础信息选择列表
    path: thisFile1 + '/getByBaseId',
    method: 'get',
  },
}

export default api
