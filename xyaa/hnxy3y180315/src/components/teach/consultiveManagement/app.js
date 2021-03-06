/**
 * Created by Administrator on 2017/5/22.
 */
export default {

  /*发布通知*/

  //获取栏目树结构get

  treeList: 'information/module/treeList',

  //获取栏目列表get
  moduleList: 'information/module/list',

  //获取栏目详情GET
  moduleGet: 'information/module/get/',//{id}

  //添加栏目POST
  moduleAdd: 'information/module/add',

  //修改栏目PUT
  moduleModify: 'information/module/modify/',//{id}

  //删除一个或多个栏目DELETE
  moduleRemove: 'information/module/remove/',//{ids}
  //获取单一咨询栏目内容接口
  getSingleInfomation:'information/single/info/get/',
  /*
   * 内容管理
   * */
  //获取资讯内容列表  GET
  columnList: 'information/list',

  //删除一条或多条资讯内容DELETE
  columnReomve: 'information/remove',  //{ids}

  //修改资讯内容PUT
  columnModify: 'information/modify/',  //{id}

  //修改资讯内容发布状态PUT
  columnModifyStatus: 'information/modifyStatus',  //{id}

  //获取资讯内容GET
  columnGet: 'information/get/',  //{id}

  //添加资讯内容 POST
  columnAdd: 'information/add',
  //文件上传(静态资源上传，主要用于上传可直接访问的多媒体文件) POST
  multimedia: '/file/upload/static/multimedia',

  /*
  * 发布通知
  *
  * */




  //删除一条或多条通知  DELETE
  noticeRemove: 'notice/remove',    //{ids}

  //修改通知发布状态 PUT
  noticeModifyStatus: 'notice/modifyStatus/',    //{id}

  //添加通知回执信息 POST
  noticeRreceipt: 'notice/receipt/add',

  //获取通知列表  GET
  noticeList: 'notice/list',

  //获取通知详情 GET
  noticeGet: 'notice/get/',    //{id}

  //修改通知 PUT
  noticeModify: 'notice/modify/',    //{id}

  //添加通知 PUT
  noticeAdd: 'notice/add',

  //查看回执信息（查看回执时调用） get
  receiptList: 'notice/receipt/list',

  /**中心风采---*/
  infoRemove: {//删除中心风采内容
    path: 'center/style/info/remove',//{infoIds}
    method: 'delete',
  },
  modifyStatus: {//发布中心风采内容
    path: 'center/style/info/modify/status',//{infoIds}
    method: 'put',
  },
  infoList: {//中心风采内容列表
    path: 'center/style/info/list',
    method: 'get',
  },
  infoModify: {//修改中心风采内容
    path: 'center/style/info/modify/',//{infoId}
    method: 'put',
  },
  infoAdd: {//添加中心风采内容
    path: 'center/style/info/add',
    method: 'post',
  },
  infoGet: {//中心风采内容详情
    path: 'center/style/info/get/',//{infoId}
    method: 'get',
  },

  /**设备环境---*/
  modleRemove: {//删除中心风采内容
    path: 'deviceEnvironmentalInfo/remove',//{infoIds}
    method: 'delete',
  },
  modifyModleStatus: {//发布中心风采内容
    path: 'deviceEnvironmentalInfo/modify/status',//{infoIds}
    method: 'put',
  },
  modleList: {//中心风采内容列表
    path: 'deviceEnvironmentalInfo/list',
    method: 'get',
  },
  modleModify: {//修改中心风采内容
    path: 'deviceEnvironmentalInfo/modify/',//{infoId}
    method: 'put',
  },
  modleAdd: {//添加中心风采内容
    path: 'deviceEnvironmentalInfo/add',
    method: 'post',
  },
  modleGet: {//中心风采内容详情
    path: 'deviceEnvironmentalInfo/get/',//{infoId}
    method: 'get',
  },
}

