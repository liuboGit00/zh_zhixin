const file = "open/reserve";
const api = {
    list: {//列表
        path: file + '/auditList',
        method: 'get'
    },
    see:{ // 审核查看
        path:file +'/audit/get/',
        method:'get'
    },
    zraudit:{ // 主任审核
        path:file +'/zr/audit/',
        method:'put'
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
    report:{
        path:file + '/report',
        method:'put'
    },
    excelImport:{
      path: file + '/excelImport/save',
      method: 'post'
    },
    haocai:{
        path:'consumables/noPageList',
        method:'get'
    },
    audit:{
        path:'open/reserve/gl/audit',
        method:'post'
    },
}
export default api;
