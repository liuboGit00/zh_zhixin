const file = '/';//当前模块api前缀
const api = {
  add: {//
    path: '/feedback/add',
    method: 'post'
  },
  list: {//
    path: file + '/list',
    method: 'get'
  },
  get: {//
    path: file + '/get?id=',
    method: 'get'
  },
  modify: {//
    path: file + '/modify',
    method: 'put'
  },
  delete: {//
    path: file + '/remove?ids=',
    method: 'delete'
  },
  //收藏列表
  myFavoriteList: {
    path: '/productFavorite/myFavoriteList',
    method: 'get'
  }
}
export default api
