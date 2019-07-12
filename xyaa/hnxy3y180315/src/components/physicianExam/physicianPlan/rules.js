import _ from 'lodash'
import baseRules from '../../../formRules/base' // 公共规则

// 模拟中心-国家医师考核-场次管理
let physicianPlanRules = {
  planName:[baseRules.requiredNoEvent], // 考室名称
  startDate:[baseRules.requiredNoEvent], // 开始时间
  endDate:[baseRules.requiredNoEvent], // 结束时间
  amStartTime:[baseRules.requiredNoEvent] , // 上午开考时间
  pmStartTime:[baseRules.requiredNoEvent], // 下午开考时间
  amCheckTime:[baseRules.requiredNoEvent], // 上午安检时间
  pmCheckTime:[baseRules.requiredNoEvent], // 下午安检时间
}
let physicianRules = {
  // startDate:[baseRules.requiredNoEvent], // 开始日期
  //   // endDate:[baseRules.requiredNoEvent], // 结束日期
}
let physicianListRules = {
  // stationName:[{ required: true, message: '此项不能为空'}], // 考站名称
  // timeLong:[{ required: true, message: '此项不能为空'}], // 考试时长
  // isExaminer:[{ required: true, message: '此项不能为空'}], // 是否需要考官
  // examinerNum:[{ required: true, message: '此项不能为空'}], // 考官人数
  // examForm:[{ required: true, message: '此项不能为空'}], // 考试形式
  // isStation:[{ required: true, message: '此项不能为空'}], // 是否考站
}

export default{
  physicianPlanRules,
  physicianRules,
  physicianListRules,
}
