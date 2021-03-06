const urlPrefix = '/product/'; // 当前模块api前缀
const api = {
  productList: { // 推荐练习
    path: urlPrefix + 'list',
    method: 'get'
  },
  productGet: {
    path: urlPrefix + 'get',
    method: 'get'
  },
  toOrder: {// 下单  生成订单
    path: '/order/toOrder',
    method: 'post'
  },
  integralPay: {  //积分兑换
    path: '/integral/payment',
    method: 'post'
  },
  getOrder: {// 获取订单信息
    path: '/order/getOrder',
    method: 'get'
  },
  createSign: {
    path: '/wxPay/createSign',
    method: 'get'
  },
  generateUUID: {
    path: '/wxPay/generateUUID',
    method: 'get'
  },
  payment: {//支付（微信，支付宝）
    path: '/order/toOrder',
    method: 'post'
  },
  getOpenId: {
    path: '/wxPay/getOpenId',
    method: 'get'
  },
  pay: {
    path: '/order/paymentWX',
    method: 'post'
  },
  getJsapiTicket: {
    path: '/wxPay/getJsapiTicket',
    method: 'post'
  },
  //添加收藏
  productFavorite: {
    path: '/productFavorite/add',
    method: 'post'
  },
};
export default api;
