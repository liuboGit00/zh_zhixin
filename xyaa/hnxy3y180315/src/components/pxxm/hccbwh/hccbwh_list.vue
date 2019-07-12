<template>
  <div>
    <el-form ref="formValidate">
      <el-form-item>
        <el-row style="margin-bottom: 15px;">
          <el-button type="primary" @click="newAdd">新增</el-button>
          <el-button type="primary" @click="edit" style="margin-left: 8px">编辑</el-button>
          <el-button type="danger" @click="remove" style="margin-left: 8px">删除</el-button>
        </el-row>
        <!--表格数据-->
        <div
          id="table"
          ref="myTable"
        >
          <el-table :data="formValidate" style="width: 100%" highlight-current-row @selection-change="handleSelectionChange">
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
            <el-table-column align="center" label="耗材名称" prop="consumableModelId">
              <template scope="scope">
                <span v-if="(addStatus !== 'add') && (multipleSelectionId !== scope.row.id)">{{scope.row.name}}</span>
                <el-select v-model="scope.row.name" v-else filterable placeholder="请选择" @change="selectChange(scope.$index)">
                  <el-option
                  v-for="(item,index) in option"
                  :key="index"
                  :label="item.consumablesName"
                  :value="item.consumablesName">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="单次使用价格" prop="price">
              <template scope="scope">
                <span v-if="(addStatus !== 'add') && (multipleSelectionId !== (scope.row.id))">{{scope.row.price}}</span>
                <el-input placeholder="请输入"  v-else v-model="scope.row.price"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item align="right">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <!--<el-button type="ghost" @click="handleReset" style="margin-left: 8px">取消</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import api from './api'
  let Util=null;
  export default {
    name: 'mxcbwh_list',
    data () {
      return {
        option:[],
        addNewId:'',
        multipleSelection:[],//选中
        multipleSelectionId:'',
        addStatus:'',
        isShow:false,//默认列表显示
        template:{},// 新增部分
        currentIndex:0,  // 默认当前的下标
        uplaodUrl:"/jsonplaceholder.typicode.com/posts/",
        formValidate: [],
        ruleValidate: {
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
        },
        listMessTitle: {
          ajaxSuccess: 'listSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.listMessTitle.path,
            method: api.listMessTitle.method,
            params:{
              type:1
            }
          },
        },
        selectMessTitle: {
          ajaxSuccess: 'selectSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.selectMessTitle.path,
            method: api.selectMessTitle.method,
          },
        },
        submitMessTitle:{
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
        selectVal:{},

      }
    },
    methods:{
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
        this.setTableData()
        this.ajax(this.selectMessTitle)
      },

      setTableData(){
        this.listMessTitle.ajaxParams.params = this.queryQptions
        this.listMessTitle.ajaxParams.params.type = 2
        this.ajax(this.listMessTitle)
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val, event, column) {
        this.multipleSelection = val;
      },

      selectChange(index){
        this.currentIndex = index;
        let val = this.formValidate[this.currentIndex].name;
        this.option.map(items=>{
          if(val === items.consumablesName){
            this.formValidate[this.currentIndex].consumableModelId = items.id;
          }
        })
        let name = this.formValidate[this.currentIndex].name
        for(let i = 0;i < this.formValidate.length; i++){
          let Name = this.formValidate[i].name
          return
          if(name !== consumablesName){

          }else{
            this.showMess('耗材名称不能重复')
            return
          }
        }
      },

      listSuccess(res){
        this.formValidate = res.data
        this.formValidate.map(item=>{
          item.price = item.price/100
        })
      },

      selectSuccess(res){
        this.option = res.data
      },

      classTemplate () {
        this.userInfo = this.$store.getters.getUserInfo;
        this.template = {
          isDelete:0,//科室/部门
          // isShow:true,
          price: '',//用户名
          type: 2,//现任技术职务/职称
          consumableModelId:'',//耗材名称id
          name:'',//耗材名称
        }
        return this.template
      },
      /*
     * 获取表单数据
     * @return string  格式:id=0&name=aa
     * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },

      newAdd(){
        this.addStatus = 'add'
        let addTemplate = this.getFormData(this.classTemplate());
        this.formValidate.push(addTemplate)
        if (this.formValidate.length > 0) {
          this.currentIndex = this.formValidate.length - 1;
        }
      },

      edit(){
        if(!this.isSelected()) return;
        if(this.multipleSelection.length >1){
          this.showMess("只能修改一条数据!")
          return
        }
        this.multipleSelectionId = this.multipleSelection[this.currentIndex].id
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
        if(len>1 && isOnly){
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },

      //删除
      remove () {
        if(!this.isSelected()) return;
        let ids = this.multipleSelection.map(item => item.id).join(',')

        let removeMessTitle = {
          successTitle:'删除成功!',
            errorTitle:'删除失败!',
            ajaxSuccess: 'removeSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: api.removeMessTitle.path + ids,
              method: api.removeMessTitle.method,
          },
        }
        this.ajax(removeMessTitle)
      },
      removeSuccess(){
        this.successMess('删除成功')
        this.setTableData()
        this.multipleSelection = []
      },

      handleSubmit () {
        let isSubmit = this.submitForm('formValidate')
        if (isSubmit) {
          this.multipleSelectionId = ''
          if(this.formValidate[this.currentIndex].price !==''){
          }else{
            this.errorMess('单次使用价格不能为空')
            return
          }
          let flag = this.formValidate.some((item, index) => {//验证是否有重复的
            return this.compare(item, index, this.formValidate);
          })
          if (flag) return
          let arr = Util._.defaultsDeep([],this.formValidate);
          arr.map(item=>{
           item.price = Number(item.price)*100
          })
          this.submitMessTitle.ajaxParams.data = arr;
          this.ajax(this.submitMessTitle)
        }
      },

      compare (item, index, formValidate) {
        for (let i = index + 1; i < formValidate.length; i++) {
          let obj = formValidate[i];
          if (item.name === obj.name) {
            this.errorMess(`第${index + 1}行和 ${i + 1}行 ：数据重复，请修改`)
            return true;
          }
        }
      },

      submitSuccess(res){
        this.addStatus = ''
        this.successMess('保存成功')
        this.setTableData()
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

<style scoped>

</style>
