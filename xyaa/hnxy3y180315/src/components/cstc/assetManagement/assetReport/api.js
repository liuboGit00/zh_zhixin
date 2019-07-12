const file = "";
const api = {
    first:{
      list: {//列表
        path: file + '/assetsSummary/list',
        method: 'get'
      },
      exportExcel: {//导出
        path: file + '/assetsSummary/exportExcel',
        method: 'get'
      },
      assetsOutTotal:{
        path: file + '/assetsSummary/assetsOutTotal/detailsList',
        method: 'get'
      },
      assetsCountTotal:{
        path: file + '/assetsSummary/assetsCountTotal/detailsList',
        method: 'get'
      },
      assetsScrapTotal:{
        path: file + '/assetsSummary/assetsScrapTotal/detailsList',
        method: 'get'
      },
      assetsTotal:{
        path: file + '/assetsSummary/assetsTotal/detailsList',
        method: 'get'
      }
      
    },
    second:{//资产购置
      list: {//列表
        path: file + '/assetsSummary/gzqkList',
        method: 'get'
      },
      exportExcel: {//导出
        path: file + '/assetsSummary/gzqkExportExcel',
        method: 'get'
      },
      // total:{//根据年份查询入库资产情况统计
      //   path: file + '/list/',
      //   method: 'get'
      // }
    },
   third:{
     list: {//列表
       path: file + '/assetsSummary/fundsSourceTotal/list',
       method: 'get'
     },
     exportExcel: {//添加
       path: file + '/assetsSummary/fundsSourceTotalExportExcel',
       method: 'get'
     },
     detailList:{
       path: file + '/assetsSummary/detailsList',
       method: 'get'
     }
   },
  fourth:{
    list: {//列表
      path: file + '/assetsSummary/numberList',
      method: 'get'
    },
    exportExcel: {//添加
      path: file + '/assetsSummary/numberExportExcel',
      method: 'get'
    },
  },
  five:{
    list: {//列表
      path: file + '/assetsSummary/outList',
      method: 'get'
    },
    exportExcel: {//添加
      path: file + '/assetsSummary/outExportExcel',
      method: 'get'
    },
    detailList:{
      path: file + '/assetsOutTotal/detailsList',
      method: 'get'
    }
  },
  six:{
    list: {//列表
      path: file + '/assetsSummary/scrapList',
      method: 'get'
    },
    exportExcel: {//添加
      path: file + '/assetsSummary/scrapExportExcel',
      method: 'get'
    },
    detailList:{
      path: file + '/assetsScropTotal/detailsList',
      method: 'get'
    }
  },
  seven:{
    list: {//列表
      path: file + '/assetsSummary/countInfoList',
      method: 'get'
    },
    exportExcel: {//添加
      path: file + '/assetsSummary/countInfoExportExcel',
      method: 'get'
    },
    detailList:{
      path: file + '/assetsCountTotal/detailsList',
      method: 'get'
    }
  },
}
export default api;
