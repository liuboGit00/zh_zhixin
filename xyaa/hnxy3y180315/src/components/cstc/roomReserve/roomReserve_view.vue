<!--
****--@file     roomReserve_view
****--@date     2018/7/20 10:42
****--@author   YC
****--@describe 预约房间-查看
-->
<template>
  <div>
    <el-form label-width="100px" ref="formValidate">
      <el-row>
        <el-col>
          <el-form-item label="预约名称：" prop="name">
            {{ formValidate.name }}
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="预约人：" prop="applicantName">
            {{ formValidate.applicantName }}
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="使用类型：" prop="useType">
            {{ formValidate.useType | userType(useTypeOption) }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注：" prop="comments">
            {{ formValidate.comments }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="状态：">{{ formValidate.status | roomReserve }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table align="center" :context="self" :data="selectTableData" tooltip-effect="dark">
      <el-table-column label="预约日期" prop="date" show-overflow-tooltip>
        <template scope="scope">
          {{ scope.row.date | formatDate('yyyy-MM-dd') }}
        </template>
      </el-table-column>
      <el-table-column label="预约房间" prop="roomNum" show-overflow-tooltip></el-table-column>
      <el-table-column label="预约时间" prop="startTime" show-overflow-tooltip>
        <template scope="scope">
          {{ scope.row.startTime }}-{{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column label="预约设备" prop="deviceList" show-overflow-tooltip>
        <template scope="scope">
          {{ scope.row.deviceList | getArrText('deviceTypeName') }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'roomReserveView',
    props: ['operailityData'],
    data () {
      return {
        self: this,
        useTypeOption: {},
        selectTableData: [],
        formValidate: {
          'roomReserveId': '',
          'name': '', // 预约名称
          'useType': '', // 使用类型
          'comments': '', // 备注
          'applicantId': '', // 申请人id
          'applicantName': '', // 申请人姓名
          'status': '' // 状态
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.getUseOption();
      },
      // 获取使用类型
      getUseOption () {
        let opt = {
          ajaxSuccess: res => {
            if (!res.data.length) {
              return;
            }
            res.data.map(item => {
              this.useTypeOption[item.code] = item;
            });
            this.getShowData();
          },
          ajaxParams: {
            url: api.getAffairType.path,
            method: api.getAffairType.method
          }
        };
        this.ajax(opt);
      },
      // 获取编辑数据
      getShowData () {
        this.ajax({
          ajaxSuccess: 'getShowDataSuccess',
          ajaxParams: {
            url: api.get.path + this.operailityData.roomReserveId,
            method: api.get.method
          }
        });
      },
      // 获取查看数据成功
      getShowDataSuccess (res) {
        let data = {
          roomReserveDetailsList: []
        };
        if (res.data instanceof Object) {
          data = res.data;
        }
        Object.keys(this.formValidate).map(key => this.formValidate[key] = data[key]);
        this.selectTableData = data.roomReserveDetailsList;
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    filters: {
      userType (val, self) {
        return self[val] && self[val].name || val;
      }
    },
    components: {}
  };

</script>
