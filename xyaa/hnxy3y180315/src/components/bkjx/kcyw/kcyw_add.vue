<template>
  <div>
    <el-form  ref="formValidate">
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
            <el-table-column label="培训项目" prop="projectName">
              <template scope="scope">
                <span v-if="(addStatus !== 'add') && (multipleSelectionId !== (scope.row.id))">{{scope.row.projectName}}</span>
                <el-select v-model="scope.row.projectName" v-else filterable placeholder="请选择" @change="selectChange(scope.$index)">
                  <el-option
                    v-for="(item,index) in option"
                    :key="index"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="num">
              <template scope="scope">
                <span v-if="(addStatus !== 'add') && (multipleSelectionId !== (scope.row.id))">{{scope.row.num}}</span>
                <el-input placeholder="请输入"  v-else v-model="scope.row.num"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item align="right">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button type="ghost" @click="handleReset" style="margin-left: 8px">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import api from './api'
  let Util=null;
  export default {
    props:['id'],
    name: 'mxcbwh_list',
    data () {
      return {
        addStatus:'',
        option:[],
        multipleSelectionId:'',
        multipleSelection:[],//选中
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
            url: api.addMessTitle.path,
            method: api.addMessTitle.method,
            params:{}
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
          type:add,
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

        listLength: 0,  //后台返回数据的长度
        num: 0,   //添加数据的起始值
        templatureArr: [],  //暂时保存数组
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
        this.listMessTitle.ajaxParams.params.techCourseId = this.id
        this.ajax(this.listMessTitle)
      },

      /*
      * checkbox 选择后触发事件
      * @param val Array 存在所有的选择每一个行数据
      */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      classTemplate (ids) {
        this.userInfo = this.$store.getters.getUserInfo;
        this.template = {
          id:'',
          ids,
          techTrainingProjectId:'',//培训项目id
          num: '',//需要培训项目数量
          projectName: '',//培训项目
          techCourseId:Number(this.id),
        }
        return this.template
      },

      listSuccess(res){
        //给数据添加新值
        res.data && res.data.map((item,index) => {
          item.ids = index
        })
        this.listLength = res.data && res.data.length
        let arr = res.data.concat(this.templatureArr)
        this.formValidate = arr
      },

      selectSuccess(res){
        this.option = res.data
      },

      selectChange(index){
        this.currentIndex = index;
        let val = this.formValidate[this.currentIndex].projectName;
        this.option.map(items=>{
          if(val === items.name){
            this.formValidate[this.currentIndex].techTrainingProjectId = items.id;
          }else{
          }
        })
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
        if(this.formValidate.length > 0){
          this.currentIndex = this.formValidate.length;
        }
        let addTemplate = this.getFormData(this.classTemplate(this.listLength + this.num++ ))
        this.templatureArr.push(addTemplate);
        this.formValidate.push(addTemplate)
      },

      edit(){
        if(!this.isSelected()) return;
        if(this.multipleSelection.length >1){
          this.showMess("只能修改一条数据!")
          return
        }
        this.multipleSelectionId = this.multipleSelection[this.currentIndex].id
      },

      //删除
      remove () {
        if(!this.isSelected()) return;
        let multipleSelection = this.multipleSelection
        console.log(multipleSelection,this.formValidate,'kkkkkkkkkk')
        if(multipleSelection){
          multipleSelection.forEach((val,index)=>{
            this.formValidate.forEach((v,i)=>{
              if(val.ids === v.ids){
                if(val.id !== ''){
                  let isSubmit = this.submitForm('formValidate')
                  if (isSubmit) {
                    let ids = multipleSelection.map(item => item.id).join(',')
                    let removeMessTitle = {
                      successTitle: '删除成功!',
                      errorTitle: '删除失败!',
                      ajaxSuccess: 'removeSuccess',
                      ajaxError: 'ajaxError',
                      ajaxParams: {
                        url: api.removeMessTitle.path + ids,
                        method: api.removeMessTitle.method,
                      },
                    }
                    this.ajax(removeMessTitle)
                  }
                }else{
                  //删除暂存的数据
                  this.templatureArr.map((item,index) => {
                    if(item.ids == val.ids){
                      this.templatureArr.splice(index,1)
                    }
                  })  

                  this.formValidate.splice(i,1)
                  this.successMess('删除成功')
                }

              }
            })
          })
        }



      },
      removeSuccess(){
        this.successMess('删除成功')
        this.$emit('add')
        this.setTableData()
        this.multipleSelection = []
      },

      handleSubmit () {
        if(this.formValidate.length === 0){
          this.errorMess('暂无数据时不能保存')
          return
        }
        let isSubmit = this.submitForm('formValidate')
        if (isSubmit) {
          this.multipleSelectionId = ''
          let flag = this.formValidate.some((item, index) => {//验证是否有重复的
            return this.compare(item, index, this.formValidate);
          })
          if (flag) return
          let isPass = this.formValidate && this.formValidate.every((item,index) => {
            return item.num !== '' &&  item.projectName !== ''
          })
          if(!isPass){
              this.errorMess('数量或项目名不能为空')
              return
          }
          // if(this.formValidate[this.currentIndex].num !==''){

          // }else{
          //   this.errorMess('数量不能为空')
          //   return
          // }
          // this.formValidate[this.currentIndex].num = Number(this.formValidate[this.currentIndex].num)
          // this.formValidate[this.currentIndex].techTrainingProjectId = Number(this.formValidate[this.currentIndex].techTrainingProjectId)

          this.submitMessTitle.ajaxParams.data = this.formValidate;
          this.ajax(this.submitMessTitle)
        }
      },

      compare (item, index, formValidate) {
        for (let i = index + 1; i < formValidate.length; i++) {
          let obj = formValidate[i];
          if (item.projectName === obj.projectName) {
            this.errorMess(`第${index + 1}行和 ${i + 1}行 ：数据重复，请修改`)
            return true;
          }
        }

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


      submitSuccess(res){
        this.addStatus = ''
        this.successMess('保存成功')
        this.$emit('add', 'add')
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
        // if(len>1 && isOnly){
        //   this.showMess("只能修改一条数据!")
        //   flag = false;
        // }
        return flag;
      },

      handleReset () {
        this.$emit('cancel', 'add')
      }

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
