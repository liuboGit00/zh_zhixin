import _ from 'lodash';
import baseRules from '../../formRules/base'; // 公共规则

// 事务管理
let affairs = {
  // registerDate: baseRules.isDate, // 开始时间 时间类型
  // timeInterval: baseRules.required, // 结束时间 必填
  // affairType: baseRules.selectText, // 类型 必选
  // classhour: baseRules.numberMust, // 课时 必须为数字
  // peopleNum: baseRules.numberMust, // 人数 必须为数字
  name: baseRules.requiredNoEvent,
  company: baseRules.requiredNoEvent,
  department: baseRules.requiredNoEvent,
  useDate: baseRules.requiredNoEvent,
  usetype: baseRules.requiredNoEvent,
  reception: baseRules.requiredNoEvent,
  cause: baseRules.requiredNoEvent,
  reserveNum: baseRules.requiredNoEvent,
  userNum: baseRules.requiredNoEvent,
  roomNum: baseRules.requiredNoEvent,
  roomRequire: baseRules.requiredNoEvent,
  applicant: baseRules.requiredNoEvent,
  phone: [ baseRules.requiredNoEvent, baseRules.mobile] ,
  fileIds: baseRules.requiredNoEvent
  // phone: baseRules.mobile,
};


export {
  affairs
};
