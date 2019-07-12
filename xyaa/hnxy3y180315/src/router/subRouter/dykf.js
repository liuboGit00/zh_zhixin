const dykfRouters = {
    path: 'dwkf',
    name: 'dwkf',
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    },
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/common/rightMain'));
      }, 'dwkf');
    },
    redirect: to => {
      return '/manage/dykf/yysq';
    },
    children: [{
      //预约申请
      path: 'yysq',
      name: 'yysq',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/dykf/deviceEnvironmental/deviceEnvironmental_list.vue'));
        }, 'dwkf');
      }
    },
    {
      //预约审核
      path: 'yysh',
      name: 'yysh',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/dykf/appointmentAudit/appointmentAudit_list.vue'));
        }, 'dwkf');
      }
    },
    {
      //预约审核-主任
      path: 'yyshzr',
      name: 'yyshzr',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/dykf/appointmentAudit/appointmentAudit_zrlist.vue'));
        }, 'dwkf');
      }
    },
    {
      //课外开放统计
      path: 'kwkftj',
      name: 'kwkftj',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/dwkf/kwkftj/kwkftj_list.vue'));
        }, 'dwkf');
      }
    }, {
      //实验室开放统计
      path: 'syskftj',
      name: 'syskftj',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/dwkf/syskftj/syskftj_list.vue'));
        }, 'dwkf');
      }
    },
      {
        //预约查询
        path: 'yycx',
        name: 'yycx',
        component: resolve => {
          require.ensure([], () => {
            resolve(require('../../components/dwkf/yycx/yycx_list.vue'));
          }, 'dwkf');
        }
      },
      {
        //统计分析列表
        path: 'tjfxlb',
        name: 'tjfxlb',
        component: resolve => {
          require.ensure([], () => {
            resolve(require('../../components/dwkf/tjfxlb/tjfxlb_list.vue'));
          }, 'dwkf');
        }
      },
      {
        //统计分析图标
        path: 'tjfxtb',
        name: 'tjfxtb',
        component: resolve => {
          require.ensure([], () => {
            resolve(require('../../components/dwkf/tjfxtb/tjfxtb_list.vue'));
          }, 'dwkf');
        }
      }
      
    ]
  };
  
  export default dykfRouters;