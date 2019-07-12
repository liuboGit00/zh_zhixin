const file = "contract";
const api = {
    list: {//列表
        path: file + '/list',
        method: 'get'
    },
    get: {//根据ID获取详情
        path: file + '/get/',
        method: 'get'
    },
    edit: {//修改
        path: file + '/modify/',
        method: 'put'
    },
    add: {//添加
        path: file + '/add',
        method: 'post'
    },
    remove: {//删除
        path: file + '/removes',
        method: 'delete'
    },
    excelImport:{
      path: file + '/excelImport/save',
      method: 'post'
    }
}
export default api;
