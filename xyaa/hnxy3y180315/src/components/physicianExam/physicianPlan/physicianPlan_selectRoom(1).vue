<!--
****--@file     roomReserve_selectRoom
****--@date     2018/7/20 15:52
****--@author   YC
****--@describe 房间预约-选择房间
-->
<template>
  <div class="selectRoomBox">
    <el-row>
      <el-col :span="24">
        <el-table ref="multipleTable" align="center" :context="self" :data="tableData" tooltip-effect="dark" :height="dynamicHt"
                  style="width: 100%" @selection-change="SelectionChangeRoom">
          <el-table-column type="selection" :selectable="selectable" width="55"></el-table-column>
          <el-table-column label="房间号" prop="roomNum"></el-table-column>
          <el-table-column label="房间名称" prop="roomName" show-overflow-tooltip></el-table-column>
          <el-table-column label="楼层" prop="floor" show-overflow-tooltip></el-table-column>
          <el-table-column label="房间所在位置" prop="address" show-overflow-tooltip></el-table-column>
          <el-table-column label="设备数量" prop="deviceNum" show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- 分页按钮 -->
        <div style="float: right;margin-top:10px;">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                         :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
        </div>
      </el-col>
      <div style="clear:both;padding-top:20px;">
        <el-col :span="6" :offset="6" align="center">
          <el-button type="primary" @click="selectRoom">确定</el-button>
        </el-col>
        <el-col :span="6" align="center">
          <el-button @click="cancel">取消</el-button>
        </el-col>
      </div>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['select','roomType','selectFloor','selectHoukao'],
    data () {
      return {
        self: this,
        selectOne: false,
        dynamicHt: 300,
        totalCount:0,
        selectData: {}, // 已选择的数据
        tableData: [],
        formValidate: {
          roomNum: '',
          address:'',
          roomType: '',
          floors: (this.selectFloor && this.roomType != 'houkao') ? this.selectFloor : '',
        },
        typeText: null
      };
    },
    methods: {
      init: function () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: '/room/list',
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
        this.setTableData();
        // this.getTypeText();
      },
      cancelSubmit () {
        return false;
      },
      getTypeText () {
        let opt = {
          ajaxSuccess: res => {
            let temp = {};
            (res.data || []).map(item => {
              temp[item.code] = item.name;
            });
            this.typeText = temp;
            this.setTableData();
          },
          ajaxParams: {
            url: 'room/getAffairType'
          }
        };
        this.ajax(opt);
      },
      loadTypeText (key) {
        return this.typeText && this.typeText[key] || key;
      },
      //*----------- 表格 ------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      SelectionChangeRoom (val) {
        this.selectData[this.queryQptions.params.curPage] = val;
      },
      handleCurrentChange (val) {
        // 表格开启了是否选择
        if (this.disSelect && (this.unSelectRoom.indexOf(+val.id) > -1)) {
          this.errorMess(`房间号 ${val.roomNum} 不允许选择，请选择其他房间！`);
          return false;
        }
        this.selectData[0] = val;
      },
      /*
       * 表格是否可选
       **/
      selectable (row) {
        let tag = true;
        // 表格开启了是否选择
        if (this.disSelect && (this.unSelectRoom.indexOf(+row.id) > -1)) {
          tag = false;
        }
        return tag;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData (isLoading) {
        Object.assign(this.queryQptions.params, this.formValidate);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount || 0;
        let data = res.data || [];
        for(let i = 0; i < this.selectHoukao.length; i ++){
          data.map((item,index)=>{
            if(item.id == this.selectHoukao[i]){
              data.splice(index,1);
            }
          });
        }
        this.tableData = data;
        this.$nextTick(() => {
          if (this.select.length) {
            let thisPageIds = [];
            let rowIndex;
            data.map(item => thisPageIds.push(item.id || item.roomId));
            for(let i = 0; i < this.select.length; i ++){
              rowIndex = thisPageIds.indexOf(Number(this.select[i]));
              if (rowIndex > -1) {
                this.$refs.multipleTable.toggleRowSelection(this.tableData[rowIndex]); // 选中数据
              }
            }
          }
        });
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.selectData.length;
        let flag = true;
        if (len == 0) {
          this.showMess('请选择房间！');
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess('只能选择一个房间!');
          flag = false;
        }
        return flag;
      },
      /**************** 按钮交互 ***************/
      // 取消
      cancel () {
        this.$emit('cancel', 'selectRoom');
      },
      // 确定
      selectRoom () {
        let data = [];
        if(this.roomType == 'room'){
          this.selectOne = true;
        }
        for(let i in this.selectData){
          if(this.selectData[i] && this.selectData[i].length > 0){
            this.selectData[i].map((item)=>{
              data.push(item);
            });
          }
        }
        if(data.length == 0){
          this.showMess('请选择数据');
          return;
        }
        if(this.selectOne){
          if(data.length > 1){
            this.showMess('只能选择一条数据');
            return;
          }
        }
        this.$emit('select', data,this.roomType);
      },
      search () {
        this.setTableData();
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
