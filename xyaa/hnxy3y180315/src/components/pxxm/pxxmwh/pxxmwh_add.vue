<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
    <Form-item label="培训项目名称:" prop="name">
      <span v-if="typeStatus==='show'">{{formValidate.name}}</span>
      <Input v-model="formValidate.name" placeholder="请输入姓名" v-else></Input>
    </Form-item>
    <Form-item label="培训项目描述:" prop="projectDescription">
      <span v-if="typeStatus==='show'">{{formValidate.projectDescription}}</span>
      <Input v-else v-model="formValidate.projectDescription" type="textarea" placeholder="请输入..."></Input>
    </Form-item>
    <Form-item label="所需用物明细:" prop="desc">
      <el-row style="margin-bottom: 15px;">
        <el-button type="primary" @click="newAdd" v-if="typeStatus !=='show'">新增</el-button>
        <el-button type="primary" @click="edit" v-if="typeStatus !=='show'" style="margin-left: 8px">编辑</el-button>
        <el-button type="danger" v-if="typeStatus !=='show'" @click="remove" style="margin-left: 8px">删除</el-button>
      </el-row>
      <!--表格数据-->
      <div
        id="table"
        ref="myTable"
      >
        <el-table show-summary :summary-method="getSummaries" :data="formValidate.projectDetails" style="width: 100%" highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="序号"
            prop="index"
            width="100">
            <template scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="materielType">
            <template scope="scope">
              <span v-if="(typeStatus !=='') && (addStatus !=='add') && (multipleSelectionId !== (scope.row.id))">{{converterStatus(scope.row.materielType)}}</span>
              <el-select v-model="scope.row.materielType" placeholder="请选择" @change="selectChange" v-else>
                <el-option label="模型" value="1"></el-option>
                <el-option label="耗材" value="2"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="耗材名称" prop="name">
            <template scope="scope">
             <span v-if="(typeStatus !=='') && (addStatus !=='add') && (multipleSelectionId !== (scope.row.id))">{{scope.row.name}}</span>
              <el-select v-model="scope.row.name" filterable placeholder="请选择" @change="hcChange(scope.row,scope.$index)" v-else>
                <el-option
                  v-for="item in disType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="num">
            <template scope="scope">
              <span v-if="(typeStatus !=='') && (addStatus !=='add') && (multipleSelectionId !== (scope.row.id))">{{scope.row.num}}</span>
              <el-input placeholder="请输入" v-model="scope.row.num" v-else @change="hcChange"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单次使用价格" prop="singlePrice">
            <template scope="scope">
              <span>{{scope.row.singlePrice}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </Form-item>
    <Form-item align="right">
      <el-button type="primary" @click="handleSubmit" v-if="typeStatus !=='show'">提交</el-button>
      <el-button type="ghost" @click="handleReset" style="margin-left: 8px">取消</el-button>
    </Form-item>
  </Form>
</template>
<script>
  import api from './api'
  let Util=null;
  export default {
    props: ['message','operailityData','depId','typeStatus'],
    data () {
      return {
        multipleSelection:[],
        multipleSelectionId:'',
        checkNameStatus:'',//判断项目名称是否重复
        addStatus:'',
        disType:[],
        type:'',
        template:{},// 新增部分
        currentIndex:0,  // 默认当前的下标
        uplaodUrl:"/jsonplaceholder.typicode.com/posts/",
        formValidate: {
          aggregateNum:'',
          aggregatePrice:'',
          projectDetails:[]
        },
        ruleValidate: {
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
        },

        //下拉框
        selectList: {
          ajaxSuccess: 'selectSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.selectList.path,
            method: api.selectList.method,
            params:{
              type:''
            }
          },
        },

        //保存
        submitMessTitle:{
          type:'add' || 'edit',
          successTitle:'保存成功!',
          errorTitle:'保存失败!',
          ajaxSuccess: 'submitSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString:true,
            url: api.submitMessTitle.path,
            method: api.submitMessTitle.method,
            data:[]
          },
        },
        num: 0,  //选择的id
        initNum: 0   //初始数量
      }
    },
    methods: {
      init(){
        let userInfo = this.$store.getters.getUserInfo;
        this.role = userInfo.roleList[0].identify
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;
        this.queryQptions = {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize,
        }
        if(this.typeStatus ==='edit' || this.typeStatus ==='show'){
          this.editMessTitle = {
            ajaxSuccess: 'editSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: api.editMessTitle.path + this.depId,
              method: api.editMessTitle.method,
              params:{

              }
            },
          }
          this.ajax(this.editMessTitle)
        }

      },

      getSummaries(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          if(index == 1 || index == 2 || index == 3){
            sums[index] = '';
            return;
          }
          const values = data.map(item => Number(index===4?item[column.property]:(item['num']*item[column.property])));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                if(index == 5){
                  const valueAll = (Number(prev) + Number(curr)).toFixed(2)
                  return valueAll;
                }else{
                  const valueAll = (Number(prev) + Number(curr))
                  return valueAll;
                }
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          } else {
            sums[index] = '';
          }
        });
        this.formValidate.aggregateNum = Number(sums[4])
        this.formValidate.aggregatePrice = Number(sums[5])
        return sums;
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val, event, column) {
        this.multipleSelection = val;
      },

      //转换请假条状态
      converterStatus(materielType){
        switch (materielType){
          case '1' : materielType = '模型';
            break;
          case '2' : materielType = '耗材';
            break;
        }
        return materielType
      },

      //修改回显
      editSuccess(res){
        this.formValidate = res.data
        this.formValidate.aggregateNum = this.formValidate.aggregateNum/100
        this.formValidate.aggregatePrice = this.formValidate.aggregatePrice/100
        this.initNum = this.formValidate.projectDetails && this.formValidate.projectDetails.length
        this.formValidate.projectDetails.map((item,index)=>{
          item.singlePrice = item.singlePrice/100
          item.ids = index
        })
      },

      //下拉框请求成功回调
      selectSuccess(res){
        this.disType = res.data
        this.disType.map(item=>{
          item.price = Number(item.price)/100
        })
      },

      selectChange(val){
        this.selectList.ajaxParams.params.type = val
        this.ajax(this.selectList)
      },

      //耗材名称change事件
      hcChange(val,index){
        this.currentIndex = index;
        this.disType.map(item=>{
          if(item.name === val.name){
            this.formValidate.projectDetails[this.currentIndex].singlePrice = item.price
            this.formValidate.projectDetails[this.currentIndex].techCostSetId = item.consumableModelId
          }
        })

      },


      //新添加行
      classTemplate (ids) {
        this.userInfo = this.$store.getters.getUserInfo;
        this.template = {
          ids: ids,  //id
          name:'',//名称
          num: '',//数量
          materielType: '',//类型
          singlePrice: '',//单次使用价格
          trainingProjectId:this.depId,// 父级id
          techCostSetId:'',//下拉框id
        }
        return this.template
      },

      //点击添加
      newAdd(){
        this.addStatus = 'add'
        let addTemplate = this.getFormData(this.classTemplate(++this.num + this.initNum))
        this.formValidate.projectDetails.push(addTemplate)
        console.log( this.formValidate.projectDetails,'iiiiiiiiiiiiii')
        if(this.formValidate.projectDetails.length > 0){
          this.currentIndex = this.formValidate.projectDetails.length - 1;
        }
      },

      //点击修改
      edit(){
        if(!this.isSelected()) return;
        if(this.multipleSelection.length >1){
          this.showMess("只能修改一条数据!")
          return
        }
        let ids = this.multipleSelection.map(item => item.id).join(',')
        this.multipleSelection.map(Item=>{
          this.multipleSelectionId = Item.id
        })
      },

      /*
    * 列表数据只能选择一个
    * @param isOnly true  是否只选择一个
    */
      isSelected(isOnly){
        let len = this.multipleSelection.length;
        let flag = true;
        if(len==0){
          this.showMess("请选择数据!");
          flag = false;
        }
        if(len>1){
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },

      //删除
      remove () {
        if(this.multipleSelection.length<1){
          this.showMess("请选择数据!")
          return
        }
        // if(!this.isSelected()) return;
        if(this.multipleSelection.length>1){
          this.showMess("只能删除一条数据!")
          return
        }
        
        console.log(this.formValidate, this.multipleSelection,'xinxinxnxixn')

        this.formValidate.projectDetails.map((item,index) => {
          for(let i=0;i<this.multipleSelection.length;i++){
            if(item.ids == this.multipleSelection[i].ids){
              this.formValidate.projectDetails.splice(index,1)
            }
          }
        })

        // for(let i=0;i<this.multipleSelection.length;i++){
        //   this.formValidate.projectDetails.splice(i, 1)
        // }
      },

      /*
      * 监听子组件通讯的方法
      * 作用:根据不同的参数关闭对应的模态
      * @param targer string example:"add"、"edit"
      * */
      cancel(targer){
        this[targer+'Modal'] = false;
          this.$emit('cancel','add')
      },

      /*
      * 获取表单数据
      * @return string  格式:id=0&name=aa
      * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },

      //提交
      handleSubmit () {
        let isSubmit = this.submitForm('formValidate')
        if (isSubmit) {
          this.multipleSelectionId = ''
          let flag = this.formValidate.projectDetails.some((item, index) => {//验证是否有重复的
            return this.compare(item, index, this.formValidate);
          })
          if (flag) return

          let checkName = {
              ajaxSuccess: 'checkNameSuccess',
              ajaxError: 'ajaxError',
              ajaxParams: {
                url: api.checkName.path,
                method: api.checkName.method,
                params:{
                  name:'',
                  id:'',
                }
              },
            }
          checkName.ajaxParams.params.name = this.formValidate.name
          checkName.ajaxParams.params.id = (this.typeStatus ==='add')?'':this.depId
          this.ajax(checkName)
        }
      },

      checkNameSuccess(res){
        this.checkNameStatus = res.data
        this.checkNameStatus = String(this.checkNameStatus)
        if(this.checkNameStatus !== 'false'){
          this.errorMess('培训项目名称重复，请重新修改')
          return
        }else{
          this.formValidate.aggregateNum = this.formValidate.aggregateNum*100
          this.formValidate.aggregatePrice = this.formValidate.aggregatePrice*100
          this.formValidate.projectDetails.map(item=>{
            item.singlePrice = item.singlePrice*100
          })

          //验证都必填
          console.log(this.formValidate.projectDetails,'this.formValidate')
          let isFlag = this.formValidate.projectDetails && this.formValidate.projectDetails.every((item) => {
            return item.materielType !== '' && item.name !== '' && item.num !== ''
          })
          if(!isFlag){
            this.errorMess('新增用物信息填写不完整！')
            return
          }

          if(this.typeStatus ==='edit'){
            let edit = {
              ajaxSuccess: 'submitSuccess',
              ajaxError: 'ajaxError',
              ajaxParams: {
                jsonString:true,
                url: api.edit.path,
                method: api.edit.method,
                data:[]
              },
            }
            edit.ajaxParams.data = this.formValidate;
            this.ajax(edit)
          }else{
            this.submitMessTitle.ajaxParams.data = this.formValidate;
            this.ajax(this.submitMessTitle)
          }
        }

      },
      compare (item, index, formValidate) {
        for (let i = index + 1; i < formValidate.projectDetails.length; i++) {
          let obj = formValidate.projectDetails[i];
          if (item.name === obj.name) {
            this.errorMess(`第${index + 1}行和 ${i + 1}行 ：数据重复，请修改`)
            return true;
          }
        }
      },

      //保存成功回调
      submitSuccess(res){
        this.addStatus = ''
        this.successMess('保存成功')
        this.$emit('add',this.typeStatus)
      },

      //返回
      handleReset () {
        this.$emit('cancel',this.typeStatus)
      },

      /*
      * 点击提交按钮 监听是否验证通过
      * @param formName string  form表单v-model数据对象名称
      * @return flag boolean   form表单验证是否通过
      * */
      submitForm (formName) {
        let flag = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true
          }
        })
        return flag
      },

    },
    created(){
      this.init();
    },
    components:{
    }
  }
</script>
