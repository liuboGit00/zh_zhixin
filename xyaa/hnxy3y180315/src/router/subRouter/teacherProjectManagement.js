/*
 * 模块名称:项目管理
 * 作者:yc
 * 日期:2018-4-11
 * */

const teacherProjectManagementRouters = {
  path: 'teacherProjectManagement',
  name: 'teacherProjectManagement',
  meta: {
    requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'))
    }, 'resources')
  },
  redirect: to => {
    return '/teacherProjectManagement/management'
  },
  children: [
    {
      //标准课程
      path: 'tpmIndex',
      name: 'tpmIndex',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/teach/teacherProjectManagement/tpmIndex/tpmIndex_list'))
        }, 'teacherProjectManagement')
      },
    },
  ],
}

export default teacherProjectManagementRouters
