import _ from 'lodash'
import baseRules from '../../formRules/base' // 公共规则

// 考核管理
let physicianExamineInterval = {
//  examName: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)]
  roomNum:[baseRules.requiredNoEvent],
  name:[baseRules.requiredNoEvent]
}

let physicianExamineMonitorWaitTime = {
  startTime: [baseRules.requiredNoEvent, baseRules.isDate],
  timeLong: [baseRules.requiredNoEvent, baseRules.float(1), baseRules.numberSection(-300, 300)]
}

let physicianExaminee = {   //考生管理
  name: [baseRules.requiredNoEvent],
  quasiExamNumber: [baseRules.requiredNoEvent],
  examinationDate: [baseRules.requiredNoEvent],
  examinationTime: [baseRules.requiredNoEvent],
  examinationType: [baseRules.requiredNoEvent],
}
let physicianExaminer = {   //考管管理
  name: [baseRules.requiredNoEvent],  //姓名
  phone: [baseRules.requiredNoEvent,baseRules.mobile], //电话
  major: [baseRules.requiredNoEvent],  //专业
  category: [baseRules.requiredNoEvent],  //考官类别
  position: [baseRules.requiredNoEvent],  //职称
  company: [baseRules.requiredNoEvent],   //单位
  invigilateDate: [baseRules.requiredNoEvent],  //可监考日期
  idCard: [baseRules.inputLen(15, 18)],//身份证号验证
  date: [baseRules.requiredNoEvent],  //弹框 中可监考日期
}

export{
  physicianExaminee,
  physicianExaminer,
  physicianExamineInterval,
  physicianExamineMonitorWaitTime,
}
