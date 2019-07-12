const dykfRouters = {
  path: 'bkjx',
  name: 'bkjx',
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'bkjx');
  },
  redirect: to => {
    return '/manage/bkjx/jcwh';
  },
  children: [{
    //节次维护
    path: 'jcwh',
    name: 'jcwh',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('../../components/bkjx/jcwh/jcwh_list.vue'));
      }, 'bkjx');
    }
  },
    {
      //课程表管理
      path: 'kcbgl',
      name: 'kcbgl',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/bkjx/kcbgl/kcbgl_list.vue'));
        }, 'bkjx');
      }
    },
    {
      //课程用物管理
      path: 'kcyw',
      name: 'kcyw',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/bkjx/kcyw/kcyw_list.vue'));
        }, 'bkjx');
      }
    },
    {
      //课程查询
      path: 'kccx',
      name: 'kccx',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/bkjx/kccx/kccx_list.vue'));
        }, 'bkjx');
      }
    },
    {
      //课程查询-日历
      path: 'kccxrl',
      name: 'kccxrl',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/bkjx/kccxrl/kccxrl_list.vue'));
        }, 'bkjx');
      }
    },
    {
      //统计分析-列表
      path: 'tjfxlb',
      name: 'tjfxlb',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/bkjx/tjfxlb/tjfxlb_list.vue'));
        }, 'bkjx');
      }
    },
    {
      //统计分析-图表
      path: 'tjfxtb',
      name: 'tjfxtb',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/bkjx/tjfxtb/tjfxtb_list.vue'));
        }, 'bkjx');
      }
    },
    {
      //实验项目开出情况统计
      path: 'syxmkcqktj',
      name: 'syxmkcqktj',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/bkjx/syxmkcqktj/syxmkcqktj_list.vue'));
        }, 'bkjx');
      }
    },
    {
      //实验数据统计
      path: 'sysjtj',
      name: 'sysjtj',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/bkjx/sysjtj/sysjtj_list.vue'));
        }, 'bkjx');
      }
    },

  ]
};

export default dykfRouters;
