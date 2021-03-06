/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:进修管理-学术会议
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const enrollEnrollRouters = {
  path: 'EnrollEnroll',
  name: 'EnrollEnroll',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'enrollEnroll');
  },
  redirect: to => {
    return '/manage/EnrollEnrollRouters/OnlinePrequalification'
  },
  children:[
    {
      //网上预审
      path:'OnlinePrequalification',
      name:'OnlinePrequalification',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/EnrollEnroll/OnlinePrequalification/onlinePrequalification_list.vue'));
        }, 'enrollEnroll');
      }
    },
    {
      //遴选进修生
      path:'selectionEducation',
      name:'selectionEducation',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/EnrollEnroll/selectionEducation/selectionEducation_list.vue'));
        }, 'enrollEnroll');
      }
    },
    {
      //交费管理
      path:'feeManagement',
      name:'feeManagement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/EnrollEnroll/feeManagement/feeManagement_list.vue'));
        }, 'enrollEnroll');
      }
    },
    {
      //进修回执填写
      path:'EducationReceiptWrite',
      name:'EducationReceiptWrite',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/EnrollEnroll/EducationReceiptWrite/educationReceiptWrite_list.vue'));
        }, 'enrollEnroll');
      }
    },
    {
      //进修回执查询
      path:'EducationReceiptQuery',
      name:'EducationReceiptQuery',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/EnrollEnroll/EducationReceiptQuery/educationReceiptQuery_list.vue'));
        }, 'enrollEnroll');
      }
    },
    // {
    //   //进修支付查询
    //   path:'EducationReceiptQuery',
    //   name:'EducationReceiptQuery',
    //   component:resolve=> {
    //     require.ensure([], () => {
    //       resolve(require('../../components/educationManagement/EnrollEnroll/getPay/getPay_list.vue'));
    //     }, 'enrollEnroll');
    //   }
    // },
    {
      //现场审核
      path:'onAuditDay',
      name:'onAuditDay',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/EnrollEnroll/onAuditDay/onAuditDay_list.vue'));
        }, 'enrollEnroll');
      }
    },
  ]
}

export default enrollEnrollRouters;
