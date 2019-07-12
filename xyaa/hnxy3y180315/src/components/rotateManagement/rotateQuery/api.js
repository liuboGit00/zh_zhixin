/*----- 实习生__轮转查询 --------------------------------------------------------------------------------*/
const rotateQuery = 'rotationProcess/rotaryTable';
const api = {
  getRotaryInfos:{
    path : rotateQuery + '/getRotaryInfos',
    method : 'get',
  },
  myRotaryInfo:{
    path : rotateQuery + '/myRotaryInfo',
    method : 'get',
  },

  /** 轮转手册（实习生，进修生）*/
  rotaryManulList:{ //pagelist
    path : '/rotaryManul/pagelist',
    method : 'get',
  },
  rotaryManulGet:{ //轮转手册查看
    path : '/rotaryManul/get/', //{userId}
    method : 'get',
  },
  rotaryManulExport:{ //导出轮转手册 （Word）
    path : '/rotaryManul/exportWord/', //{userId}
    method : 'get',
  },



  /** 培训档案（实习生，住院医）*/
  archivesList:{ //培训档案列表
    path : '/traineeRotary/archives/pageList',
    method : 'get',
  },
  archivesGet:{ //培训档案查看
    path : '/traineeRotary/archives/get/', //{userId}-{userType}
    method : 'get',
  },
  archivesExport:{ //导出培训档案（Word）
    path : '/traineeRotary/archives/exportWord-', //{userType}-{userId}
    method : 'get',
  },




}

export default api
