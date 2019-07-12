const dykfRouters = {
  path: 'pxxm',
  name: 'pxxm',
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'pxxm');
  },
  redirect: to => {
    return '/manage/pxxm/pxxmwh';
  },
  children: [{
    //培训项目维护
    path: 'pxxmwh',
    name: 'pxxmwh',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('../../components/pxxm/pxxmwh/pxxmwh_list.vue'));
      }, 'pxxm');
    }
  },
    {
      //模型成本维护
      path: 'mxcbwh',
      name: 'mxcbwh',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/pxxm/mxcbwh/mxcbwh_list.vue'));
        }, 'pxxm');
      }
    },
    {
      //耗材成本维护
      path: 'hccbwh',
      name: 'hccbwh',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/pxxm/hccbwh/hccbwh_list.vue'));
        }, 'pxxm');
      }
    },

  ]
};

export default dykfRouters;
