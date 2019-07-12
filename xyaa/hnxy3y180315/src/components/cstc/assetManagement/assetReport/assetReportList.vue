<!--
****--@file     assetReportList.vue
****--@date     2018/12/19 11:34
****--@author   WH
****--@describe   资产报告
-->
<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="资产总表" name="first"></el-tab-pane>
      <el-tab-pane label="资产购置情况" name="second"></el-tab-pane>
      <el-tab-pane label="经费来源情况" name="third"></el-tab-pane>
      <el-tab-pane label="资产数量统计" name="fourth"></el-tab-pane>
      <el-tab-pane label="转出资产情况" name="five"></el-tab-pane>
      <el-tab-pane label="报废资产情况" name="six"></el-tab-pane>
      <el-tab-pane label="盘亏资产情况" name="seven"></el-tab-pane>
      <!--<el-tab-pane label="退库资产情况" name="eight"></el-tab-pane>-->
    </el-tabs>
    <el-row>
      <el-col :xs="5" :md="24" align="right">
        <!-- 搜索 -->

        <el-form :inline="true" class="el-form-item-search"
                 onsubmit="return false">
          <el-form-item label="经费来源：" v-if="activeName=='third'">
            <el-select v-model="searchObj.fundsSource" placeholder="请选择">
              <el-option v-for="item in JFLY" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年份：" prop="returnStartTime" v-if="activeName!='third'">
            <date-group
              :dateGroup="{text:'',startDate:searchObj.startTime,endDate:searchObj.endTime}">
              <el-date-picker name="start" v-model="searchObj.startTime"
                              :editable="false" type="year" placeholder="选择日期"
                              :picker-options="pickerOptions0"
                              @change="handleStartTime"></el-date-picker>
              <span>-</span>
              <el-date-picker name="end" v-model="searchObj.endTime"
                              :editable="false" type="year" placeholder="选择日期"
                              :picker-options="pickerOptions1"
                              @change="handleEndTime"></el-date-picker>
            </date-group>
          </el-form-item>
          <el-form-item label="年份：" v-else prop="year">
            <el-date-picker v-model="searchObj.year" type="year" :editable="false"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="是否含细分资产：">
            <el-checkbox v-model="searchObj.isSubdivided"></el-checkbox>
            <!--<el-input size="small" v-model="searchObj.isSubdivided"></el-input>-->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search">查询
            </el-button>
            <el-button type="primary" size="small" @click="toChannel">导出
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div id="deviceTable" ref="deviceTable">
      <template v-if="activeName=='first'">
        <!-- 表格数据 -->

        <el-table  v-if="tableData.length"  align="center" :height="dynamicHt" :context="self"
                  :data="tableData" tooltip-effect="dark"
                  class="tableShowMoreInfo" ref="multipleTable"
                  style="width: 100%">
          <el-table-column label="年份" prop="year"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="历史资产" prop="history"
                           show-overflow-tooltip>
            <!--{{fmoney()}}-->
            <template scope="scope">
              {{scope.row.history == '合计' ? '合计' : fmoney(scope.row.history)}}
            </template>
          </el-table-column>
          <el-table-column label="投入资产" prop="assets"
                           show-overflow-tooltip>
            <template scope="scope">
              {{fmoney(scope.row.assets)}}
            </template>
          </el-table-column>
          <el-table-column label="报废资产" prop="assetsScrap" show-overflow-tooltip>
            <template scope="scope">
              {{fmoney(scope.row.assetsScrap)}}
            </template>
          </el-table-column>
          <el-table-column label="转出资产" prop="assetsOut" show-overflow-tooltip>
            <template scope="scope">
              {{fmoney(scope.row.assetsOut)}}
            </template>
          </el-table-column>
          <el-table-column label="盘亏资产" prop="assetsCount"
                           show-overflow-tooltip>
            <template scope="scope">
              {{fmoney(scope.row.assetsCount)}}
            </template>
          </el-table-column>
          <el-table-column label="现有资产" prop="sum"
                           show-overflow-tooltip>
            <template scope="scope">
              {{fmoney(scope.row.sum)}}
            </template>
          </el-table-column>
        </el-table>


      </template>
      <template v-else-if="activeName=='fourth'">
        <!-- 表格数据 -->
        <el-table  v-if="tableData.length"  align="center" :height="dynamicHt" :context="self"
                  :data="tableData" tooltip-effect="dark"
                  class="tableShowMoreInfo" ref="multipleTable"
                  style="width: 100%">
          <el-table-column label="年份" prop="year"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="继上一年（台件）" prop="lastYear"
                           show-overflow-tooltip>
            <template scope="scope">
              {{(scope.row.history||0)}}
            </template>
          </el-table-column>
          <el-table-column label="新增（台件）" prop="assets" show-overflow-tooltip>
            <template scope="scope">
              {{(scope.row.assets||0)}}
            </template>
          </el-table-column>
          <el-table-column label="转出（台件）" prop="assetsOut" show-overflow-tooltip>
            <template scope="scope">
              {{(scope.row.assetsOut||0)}}
            </template>
          </el-table-column>
          <el-table-column label="报废（台件）" prop="assetsScrap" show-overflow-tooltip>
            <template scope="scope">
              {{(scope.row.assetsScrap||0)}}
            </template>
          </el-table-column>
          <el-table-column label="盘亏（台件）" prop="assetsCount" show-overflow-tooltip>
            <template scope="scope">
              {{(scope.row.assetsCount||0)}}
            </template>
          </el-table-column>
          <el-table-column label="现有（台件）" prop="sum" show-overflow-tooltip>
            <template scope="scope">
              {{(scope.row.sum||0)}}
            </template>
          </el-table-column>
        </el-table>

      </template>
      <template v-else-if="activeName=='third'">
        <!-- 表格数据 -->
        <el-table  v-if="tableData.length"  align="center" :height="dynamicHt" :context="self"
                  :data="tableData" tooltip-effect="dark"
                  class="tableShowMoreInfo" ref="multipleTable"
                  style="width: 100%">
          <!--<el-table-column type="selection" width="55"></el-table-column>-->
          <!--<el-table-column label="序号" type="index" width="100"-->
          <!--align="center"></el-table-column>-->
          <!--<el-table-column label="操作" prop="deviceTypeName">-->
          <!--<template scope="props">-->
          <!--<el-button size="small" @click="show(props.row.baseId)">查看-->
          <!--</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column label="经费来源" prop="fundsSource"
                           show-overflow-tooltip>
            <template scope="scope">
              {{scope.row.fundsSource|assetJFLY}}
            </template>
          </el-table-column>
          <el-table-column label="年份" prop="year"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="经费" prop="price" show-overflow-tooltip>
            <template scope="scope">
              {{fmoney(scope.row.price||0)}}
            </template>
          </el-table-column>
        </el-table>

      </template>
      <template v-else>
        <!-- 表格数据 -->
        <el-table v-if="tableData.length" align="center" :context="self"
                  :data="tableData" tooltip-effect="dark"
                  class="tableShowMoreInfo" ref="multipleTable1"
                  style="width: 100%">
          <!--<el-table-column type="selection" width="55"></el-table-column>-->
          <!--<el-table-column label="序号" type="index" width="100"-->
          <!--align="center"></el-table-column>-->
          <!--<el-table-column label="操作" prop="deviceTypeName">-->
          <!--<template scope="props">-->
          <!--<el-button size="small" @click="show(props.row.baseId)">查看-->
          <!--</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column label="年份" prop="year"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="台件" prop="number"
                           show-overflow-tooltip>
            <template scope="scope">
              {{(scope.row.number||0)}}
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="price" show-overflow-tooltip>
            <template scope="scope">
              {{fmoney(scope.row.price||0)}}
            </template>
          </el-table-column>

        </el-table>

      </template>
    </div>
    <!--&lt;!&ndash; 分页 &ndash;&gt;-->
    <!--<div style="margin-top:10px;">-->
    <!--<el-pagination style="float: right" @size-change="changePageSize"-->
    <!--@current-change="changePage"-->
    <!--:current-page="myPages.currentPage"-->
    <!--:page-sizes="myPages.pageSizes"-->
    <!--:page-size="myPages.pageSize"-->
    <!--layout="total, sizes, prev, pager, next, jumper"-->
    <!--:total="totalCount"></el-pagination>-->
    <!--</div>-->
    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题"
           class-name="vertical-center-modal"
           :width="500">
      <modal-header slot="header" :content="button.deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="derUrl">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import api from './api'
//  import ElFormItem from '../../../../../node_modules/element-ui/packages/form/src/form-item.vue'
  /*当前组件必要引入*/
  let Util = null
  export default {
    data () {
      return {
        optList: [
          {
            name: '全部',
            val: '',
          }, {
            name: '学校—外来专项',
            val: 'CSTC_XXWLZX',
          }, {
            name: '学校—实验室建设经费',
            val: 'CSTC_XXSYSJSJF',
          }, {
            name: '医院—外来专项',
            val: 'CSTC_YYWLZX',
          }, {
            name: '医院—自筹',
            val: 'CSTC_YYZC',
          }],
        derUrl: '',
        activeName: 'first',
        searchObj: {
          startTime: new Date(),
          endTime: new Date(),
          isSubdivided: false,
          fundsSource: '',
          year: new Date(),
        },
        button: {
          deriveId: {
            id: 'derive',
            title: '导出',
          },
        },
        deriveModal: false,
        totalCount: 0,
        dynamicHt: 200,
        self: this,
        tableData: [],
        queryQptions: {},
        JFLY:[]
      }
    },
    methods: {
      getOption (type) {
        let opt = {
          ajaxSuccess: (res) => {this[type]=[];this[type] = res.data.child;this[type].unshift({name:'全部',code:''})},
          ajaxParams: {
            url: '/dictionary/getByCode/CSTC_' + type,
            method: 'get',
            params: {},
          },
        }
        this.ajax(opt)
      },
      //初始化请求列表数据
      init () {
        this.getOption('JFLY')
        Util = this.$util
        this.queryQptions = {
          params: {
//                  curPage: 1,
//                  pageSize: Util.pageInitPrams.pageSize,
          },
        }
        this.getList()
      },
      //确定导出
      affirmDerive () {
        this.cancel('derive')
      },
      cancel (targer) {
        this[targer + 'Modal'] = false
      },
      handleClick () {
//               this.myPages.currentPage=1;

        this.searchObj = {
          startTime: new Date(),
          endTime: new Date(),
          isSubdivided: false,
          fundsSource: '',
          year: new Date(),
        }
        this.tableData = []
//              this.queryQptions.params.curPage=1;
        this.getList()
      },
      getList () {
        this.searchObj.startTime = this.conductDate(this.searchObj.startTime, 'yyyy')
        this.searchObj.endTime = this.conductDate(this.searchObj.endTime, 'yyyy')
        this.searchObj.year = this.conductDate(this.searchObj.year, 'yyyy')
        console.log(typeof (this.searchObj.startTime))
        let parmas=Object.assign(this.queryQptions.params, this.searchObj)
        parmas.isSubdivided = (this.searchObj.isSubdivided && this.searchObj.isSubdivided != '0') ? 1 : '0'
        let opt = {
          ajaxSuccess: 'getShowDataSuccess',
          ajaxParams: {
            url: api[this.activeName].list.path,
            method: 'get',
            params: parmas,
          },
        }
        this.ajax(opt)
      },
      getShowDataSuccess (res) {
        console.log(this.activeName)
        this.tableData = []
        this.tableData = res.data
        let temp = {}
        if (this.activeName == 'first') {
          temp = {
            assets: 0,
            assetsScrap: 0,
            assetsOut: 0,
            assetsCount: 0,
            sum: 0,
          }
          for (var i in temp) {
            this.tableData.map((item) => {
              console.log(i)
              temp[i] += item[i]
            })
          }
          temp.year = ''
          temp.history = '合计'
        } else if (this.activeName != 'third' && this.activeName != 'fourth') {
          temp = {
            number: 0,
            price: 0,
          }
          console.log(999)
          for (var i in temp) {
            this.tableData.map((item) => {
              temp[i] += item[i]
            })
          }
          temp.year = '合计'

        } else if (this.activeName == 'third') {
          temp = {
            price: 0,
          }
          console.log(9990)
          for (var i in temp) {
            this.tableData.map((item) => {
              temp[i] += item[i]
            })
          }
          console.log(temp)
          temp.year = '合计'
        } else if (this.activeName == 'fourth') {
          temp = {

            assets: 0,
            assetsScrap:0,
            assetsOut:0,
            assetsCount:0,
            sum:0
          }
          console.log(999)
          for (var i in temp) {
            this.tableData.map((item) => {
              temp[i] += item[i]
            })
          }
          temp.history = '合计'
        }

        this.tableData.push(temp)
        console.log(222)
//            if (this.tableData.length > 0) {
//              this.shows = 1
//            } else {
//              this.shows = 0
//            }
//            this.$emit('shows', this.shows)
        console.log(this.tableData)
      },
      search () {
        this.getList()
      },
      toChannel () {
        this.deriveModal = true
        console.log(this.searchObj.isSubdivided)
        let searchObj = Util._.defaultsDeep({},this.searchObj);
        if(this.searchObj.isSubdivided&&this.searchObj.isSubdivided!=0){
          searchObj.isSubdivided=1;
        }else{
          searchObj.isSubdivided=0;
        }
//        this.searchObj.isSubdivided = (this.searchObj.isSubdivided && this.searchObj.isSubdivided != '0') ? 1 : '0'
        console.log(this.searchObj.isSubdivided)
        let url = ''
        for (var i in searchObj) {
          url += (i + '=' +searchObj[i] + '&')
        }
        url = `/api${api[this.activeName].exportExcel.path}?` + url.substring(0, url.length - 1)
        console.log(url)
        this.derUrl = url
      },
      setTableDynHeight () {

        let tableData = this.$refs.deviceTable
        let parHt = tableData.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.offsetHeight
        let paginationHt = 100
        this.dynamicHt = parHt - tableData.offsetTop - paginationHt
        console.log(this.dynamicHt)
      },

    },
    created () {
      this.init()
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight()
        //为窗体绑定改变大小事件
        let Event = Util.events
        Event.addHandler(window, 'resize', this.setTableDynHeight)
      })
    },
    components: {},
  }

</script>
<style lang="scss">

</style>
