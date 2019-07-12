<template>
  <div style="margin-top: 20px;">
    <!-- <el-button @click="toggleSelection(\\</el-button> -->
    <el-button @click="add()">新增</el-button>
    <el-button @click="toggleSelection()">删除</el-button>
  
  <el-table
    ref="multipleTable"
    :data="tableData3"
    border
    tooltip-effect="dark"
    style="width: 100%;margin-top:15px;margin-bottom:15px;"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
     
    <el-table-column
      prop="id"
      label="耗材名称"
      width="120">
      <template scope="scope">
          <el-select v-model="scope.row.id" @change="selectHaocai(scope.$index)" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.consumablesName"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
      
    </el-table-column>
    <el-table-column
      prop="consumableNumber"
      label="数量"
      show-overflow-tooltip>
      <template scope="scope">
        <el-input v-model="scope.row.consumableNumber"></el-input>
          
      </template>
    </el-table-column>
  </el-table>

  <el-button @click="Preservation(true)">保存</el-button>
  <el-button @click="Preservation(false)">取消</el-button>
  </div> 
  <!-- <div style="margin-top: 20px">
    <el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button>
    <el-button @click="toggleSelection()">取消选择</el-button>
  </div> -->
</template>

<script>
let Util = null;

import api from "./api"; // API
  export default {
    data() {
      return {
          api,
        tableData3: [],
        options: [],
        consumablesList:[],//计算价格后的 list
        value: '',
        multipleSelection: [],
        currentIndex:0, // 存储当前操作的下标
        // 获取书籍
        booksListTitle:{
          ajaxSuccess:'getBookData',
          ajaxParams:{
            url:api.haocai.path,
          },
        },
      }
    },

    methods: {
      init () {
          this.ajax(this.booksListTitle); // 获取书籍
      },
      // 请求回调
      getBookData(res){
        console.log(res)
        this.options = res.data || [];
      },
      // 新增耗材选择
      add(row){
        this.tableData3.push(
          {
            id: '',
            consumablesName: '',
            consumableNumber: '',
            consumablePrice:''
          }
        )
      },
      // 下拉框选择事件
      selectHaocai(index){
        this.currentIndex = index;
        let id = this.tableData3[this.currentIndex].id;
  
        this.options.map(item => {
          if(id == item.id){
            this.tableData3[this.currentIndex].consumableId = item.id;
            this.tableData3[this.currentIndex].consumableName = item.consumablesName;
            this.tableData3[this.currentIndex].consumableNumber = item.consumablesNum;
            this.tableData3[this.currentIndex].consumablePrice = item.price * item.consumablesNum;
          }
        })
      },
      //保存
      Preservation(e){
        console.log(this.tableData3)

        if (e) {
          this.$emit('monitorSave',this.tableData3)
        }else{
          console.log('取消')
          this.$emit('monitorSave','取消')
        }
        // console.log(this)
        // this.$emit('monitorSave',this.tableData3)
      },

      toggleSelection(rows) {
        console.log(this.multipleSelection)
        let NumS ;
        this.multipleSelection.map(ent=>{
          console.log(ent.id)
          NumS = ent.id
        })
        this.tableData3.map((e,key)=>{
          // console.log(e , key)
          if (NumS ==e.id) {
            console.log(e , key)
            this.tableData3.splice(key,1)
          }
        })
        // console.log(this.tableData3)
        console.log(rows)
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      },

    },
    created () {
        console.log('****************')
        Util = this.$util;
      this.init();
    },
  }
</script>