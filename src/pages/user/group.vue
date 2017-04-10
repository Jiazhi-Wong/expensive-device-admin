<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="users" highlight-current-row v-loading="listLoading" border height="500" style="width: 100%;">
        <el-table-column prop="id" label="工号" width="150" sortable></el-table-column>
        <el-table-column prop="name" label="姓名" width="120" sortable></el-table-column>
        <el-table-column prop="phone" label="电话" width="150"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="authority" label="权限" width="150" sortable></el-table-column>
        <el-table-column prop="role" label="角色" width="150" sortable></el-table-column>
        <el-table-column inline-template :context="_self" label="操作" width="150">
	                <span>
                        <el-button size="small" @click="handleEdit(row)">编辑</el-button>
                    <!--<el-button size="small">编辑</el-button>-->
                        <el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
				    </span>
        </el-table-column>
      </el-table>
    </template>

    <!--分页-->
    <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                     :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog :title="editFormTtile" v-model="editFormVisible">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option
              v-for="item in roleOptions"
              :label="item.value"
              :value="item.value"
              :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限" prop="authority">
          <el-select v-model="editForm.authority" placeholder="请选择权限">
            <el-option
              v-for="item in authorityOptions"
              :label="item.value"
              :value="item.value"
              :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../assets/js/util'
  import NProgress from 'nprogress'
  import {getUserListPage, removeUser, editUser, addUser} from '../../api/api';

  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        users: [],
        total: 0,
        page: 1,
        listLoading: false,
        editFormVisible: false,//编辑界面显是否显示
        editFormTtile: '编辑',//编辑界面标题
        //编辑界面数据
        editForm: {
          id: 0,
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: '',
          phone: '',
          email: '',
          role: '',
          authority: '',
        },
        editLoading: false,
        btnEditText: '提 交',
        editFormRules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入联系方式'}
          ],
          email: [
            {required: true, message: '请输入邮箱'}
          ],
          role: [
            {required: true, message: '请选择用户角色'}
          ],
          authority: [
            {required: true, message: '请选择权限'}
          ]
        },
        roleOptions: [
          {value: '管理员'},
          {value: '借用人'}
        ],
        authorityOptions: [
          {value: '领导审核权'},
          {value: '管理员审核权'},
          {value: '全局浏览'},
          {value: '归属浏览'}
        ],

      }
    },
    methods: {
      //性别显示转换
      formatSex: function (row, column) {
        return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getUsers();
      },
      //获取用户列表
      getUsers() {
        let para = {
          page: this.page,
          name: this.filters.name
        };
        this.listLoading = true;
        NProgress.start();
        getUserListPage(para).then((res) => {
          this.total = res.data.total;
          this.users = res.data.users;
          this.listLoading = false;
          NProgress.done();
        });
      },
      //删除
      handleDel: function (row) {
        //console.log(row);
        var _this = this;
        this.$confirm('确认删除该记录吗?', '提示', {
          //type: 'warning'
        }).then(() => {
          _this.listLoading = true;
          NProgress.start();
          let para = {id: row.id};
          removeUser(para).then((res) => {
            _this.listLoading = false;
            NProgress.done();
            _this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            });
            _this.getUsers();
          });

        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (row) {
        this.editFormVisible = true;
        this.editFormTtile = '编辑';
        this.editForm.id = row.id;
        this.editForm.name = row.name;

        this.editForm.phone = row.phone;
        this.editForm.email = row.email;
        this.editForm.role = row.role;
        this.editForm.authority = row.authority;
      },
      //编辑 or 新增
      editSubmit: function () {
        var _this = this;

        _this.$refs.editForm.validate((valid) => {
          if (valid) {

            _this.$confirm('确认提交吗？', '提示', {}).then(() => {
              _this.editLoading = true;
              NProgress.start();
              _this.btnEditText = '提交中';

              if (_this.editForm.id == 0) {
                //新增
                let para = {
                  name: _this.editForm.name,
                  sex: _this.editForm.sex,
                  age: _this.editForm.age,
                  birth: _this.editForm.birth == '' ? '' : util.formatDate.format(new Date(_this.editForm.birth), 'yyyy-MM-dd'),
                  addr: _this.editForm.addr,
                };
                addUser(para).then((res) => {
                  _this.editLoading = false;
                  NProgress.done();
                  _this.btnEditText = '提 交';
                  _this.$notify({
                    title: '成功',
                    message: '提交成功',
                    type: 'success'
                  });
                  _this.editFormVisible = false;
                  _this.getUsers();
                });
              } else {
                //编辑
                let para = {
                  id: _this.editForm.id,
                  name: _this.editForm.name,
                  sex: _this.editForm.sex,
                  age: _this.editForm.age,
                  birth: _this.editForm.birth == '' ? '' : util.formatDate.format(new Date(_this.editForm.birth), 'yyyy-MM-dd'),
                  addr: _this.editForm.addr,
                };
                editUser(para).then((res) => {
                  _this.editLoading = false;
                  NProgress.done();
                  _this.btnEditText = '提 交';
                  _this.$notify({
                    title: '成功',
                    message: '提交成功',
                    type: 'success'
                  });
                  _this.editFormVisible = false;
                  _this.getUsers();
                });

              }

            });

          }
        });

      },
      //显示新增界面
      handleAdd: function () {
        var _this = this;

        this.editFormVisible = true;
        this.editFormTtile = '新增';

        this.editForm.id = 0;
        this.editForm.name = '';

        this.editForm.phone = '';
        this.editForm.email = '';
        this.editForm.role = '';
        this.editForm.authority = '';
      }
    },
    mounted() {
      this.getUsers();
    }
  }
</script>

<style scoped>
</style>
