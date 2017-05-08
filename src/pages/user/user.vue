<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.phone" placeholder="联系方式"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.group" clearable placeholder="请选择组别">
            <el-option
              v-for="item in groupOptions"
              :label="item.groupName"
              :value="item.id" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPageUsers(1)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table
        :data="formattedUsers"
        v-loading="listLoading"
        height="500" style="width: 100%;">
        <el-table-column type="expand">
          <template scope="scope">
            <el-form label-position="left" inline class="user-table-expand">
              <el-form-item label="姓名">
                <span>{{ scope.row.name }}</span>
              </el-form-item>
              <el-form-item label="工号">
                <span>{{ scope.row.number }}</span>
              </el-form-item>
              <el-form-item label="微信ID">
                <span>{{ scope.row.wxId }}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{ scope.row.phone }}</span>
              </el-form-item>
              <el-form-item label="邮箱">
                <span>{{ scope.row.email }}</span>
              </el-form-item>
              <el-form-item label="角色">
                <span>{{ scope.row.formattedRole }}</span>
              </el-form-item>
              <el-form-item label="权限">
                <span>{{ scope.row.formattedAuthority.join('，') }}</span>
              </el-form-item>
              <el-form-item label="组别">
                <span>{{ scope.row.formattedGroup }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="formattedRole" label="角色"></el-table-column>
        <el-table-column prop="formattedAuthority" label="权限">
          <template scope="scope">
            <span>{{ scope.row.formattedAuthority.join('，') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="formattedGroup" label="组别"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!--分页-->
    <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
      <el-pagination
        layout="prev, pager, next"
        @current-change="getPageUsers"
        :page-size="pageSize"
        :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog :title="editFormTtile" v-model="editFormVisible" @close="resetForm">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="name">
          <el-input v-model="editForm.number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信ID" prop="name">
          <el-input v-model="editForm.wxId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="组别" prop="group">
          <el-select v-model.number="editForm.group" placeholder="请选择组别">
            <el-option
              v-for="item in groupOptions"
              :label="item.groupName"
              :value="item.id"
              :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model.number="editForm.role">
            <el-radio
              v-for="item in roleOptions"
              :label="item.value"
              :key="item.value">{{item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限" prop="authority" v-show="editForm.role === 1">
          <el-checkbox-group v-model="editForm.authority">
            <el-checkbox
              v-for="item in authorityOptions"
              :label="item.value"
              :key="item.value">{{item.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="全局权限" v-show="editForm.role === 1">
          <el-switch
            v-model="editForm.isAllAuthorityRange"
            on-color="#13ce66"
            off-color="#ff4949">
          </el-switch>
        </el-form-item>

        <el-form-item
          label="选择设备"
          v-show="editForm.role === 1 && editForm.isAllAuthorityRange === false">
          <el-col :span="24">
            <el-tag
              v-for="tag in selectedDevicesTags"
              :closable="true"
              @close="selectedDeviceClose(tag)"
              type="primary" :key="tag.id">{{tag.deviceName}}</el-tag>
          </el-col>
          <el-col :span="24">
            <el-form :inline="true" :model="deviceFilters">
              <el-form-item>
                <el-input v-model="deviceFilters.deviceName" placeholder="设备名" size="small"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getPageDevices(1)" size="small">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="24" style="margin: 10px 0">
            <el-table
              :data="formattedDevices"
              v-loading="listLoading"
              style="width: 100%;"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column prop="id" label="设备编号"></el-table-column>
              <el-table-column prop="deviceName" label="设备名"></el-table-column>
              <el-table-column prop="formattedAdministrator" label="设备管理员"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <el-pagination
              small
              layout="prev, pager, next"
              @current-change="getPageDevices"
              :current-page="devicesPage"
              :page-size="devicesPageSize"
              :total="devicesTotal" style="float:right;">
            </el-pagination>
          </el-col>
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
  import api from '@/api/api'

  export default {
    data() {
      return {
        filters: {
          name: '',
          phone: '',
          group: ''
        },
        users: [],
        total: 0,
        page: 1,
        pageSize: 10,
        listLoading: false,
        editFormVisible: false,//编辑界面显是否显示
        editFormTtile: '编辑',//编辑界面标题
        editForm: { //编辑界面数据
          uid: 0,
          name: '',
          number: '',
          wxId: '',
          phone: '',
          email: '',
          group: '',
          role: '',
          authority: [],
          isAllAuthorityRange: true, // 是否可管理所有设备
          devices: [], // 可管理的设备列表
        },
        editFormRules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          number: [
            {required: true, message: '请输入工号', trigger: 'blur'}
          ],
          wxId: [
            {required: true, message: '请输入微信ID', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入联系方式', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'}
          ],
          role: [
            {required: true, type: 'number', message: '请选择用户角色', trigger: 'change'}
          ],
          authority: [
            {required: true, type: 'array', message: '请选择权限', trigger: 'change'}
          ],
          group: [
            {required: true, type: 'number', message: '请选择组别', trigger: 'change'},
          ]
        },
        editLoading: false,
        btnEditText: '提 交',
        roleOptions: [
          {label: '管理员', value: 1},
          {label: '借用人', value: 2}
        ],
        authorityOptions: [
          {label: '系统管理权', value: 1},
          {label: '领导审核权', value: 2},
          {label: '管理员审核权', value: 3},
        ],
        deviceFilters: {
          deviceName: ''
        },
        devices: [],
        devicesTotal: 0,
        devicesPage: 1,
        devicesPageSize: 6,
        devicesListLoading: false,
        selectedDevicesTags: []
      }
    },
    computed: {
      groupOptions() {
        return this.$store.state.base.groupOptions;
      },
      formattedUsers() {
        let formattedUsers = [];

        formattedUsers = this.users.map((item, index) => {
          for (let role of this.roleOptions) {
            if (role.value === item.role) {
              item.formattedRole = role.label;
              break;
            }
          }

          item.formattedAuthority = [];
          for (let authority of item.authority) {
            for (let authorityOption of this.authorityOptions) {
              if (authorityOption.value === authority) {
                item.formattedAuthority.push(authorityOption.label);
                break;
              }
            }
          }

          for (let group of this.groupOptions) {
            if (group.id === item.group) {
              item.formattedGroup = group.groupName;
              break;
            }
          }

          return item;
        });

        return formattedUsers;
      },
      deviceAdministrators() {
        return this.$store.state.base.deviceAdministrators;
      },
      formattedDevices() {
        let formattedDevices = [];

        formattedDevices = this.devices.map((item, index) => {
          for (let administrator of this.deviceAdministrators) {
            if (administrator.uid === item.administrator) {
              item.formattedAdministrator = administrator.name;
              break;
            }
          }

          return item;
        });

        return formattedDevices;
      },
      selectedDevicesId() {
        return this.selectedDevicesTags.map((item) => {
          return item.id;
        });
      }
    },
    methods: {
      getPageUsers(val) { // 获取第几页的用户
        this.page = val;
        this.getUsers();
      },
      //获取用户列表
      getUsers() {
        let checkedFilters = {};

        for (let item in this.filters) {
          if (this.filters.hasOwnProperty(item) && !!this.filters[item].toString()) {
            checkedFilters[item] = this.filters[item];
          }
        }

        let para = {
          page: this.page,
          pageSize: this.pageSize,
          filters: checkedFilters
        };

        this.listLoading = true;
        api.getUserListPage(para).then((res) => {
          this.total = res.data.total;
          this.users = res.data.users;
          this.listLoading = false;
        }).catch(() => {

        });
      },
      //删除
      handleDel: function (row) {
        //console.log(row);
        let _this = this;
        this.$confirm('确认删除该用户吗?', '提示', {
          type: 'warning'
        }).then(() => {
          _this.listLoading = true;
          let para = {
            uid: row.uid,
          };

          api.delUser(para).then(res => {
            _this.listLoading = false;
            if (res.error_code === 0) {
              _this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              _this.getUsers();
            }
          }).catch(() => {
            console.log('error');
          });

        }).catch(() => {
        });
      },
      //显示新增界面
      handleAdd: function () {
        this.editFormVisible = true;
        this.editFormTtile = '新增';
        this.editForm.uid = 0;
        this.editForm.name = '';
        this.editForm.number = '';
        this.editForm.wxId = '';
        this.editForm.phone = '';
        this.editForm.email = '';
        this.editForm.role = '';
        this.editForm.authority = [];
        this.editForm.isAllAuthorityRange = true;
        this.editForm.group = '';
        this.editForm.devices = [];
        this.selectedDevicesTags = [];

        this.getPageDevices(1);
      },
      //显示编辑界面
      handleEdit: function (row) {
        this.editFormVisible = true;
        this.editFormTtile = '编辑';
        this.editForm.uid = row.uid;
        this.editForm.name = row.name;
        this.editForm.number = row.number;
        this.editForm.wxId = row.wxId;
        this.editForm.phone = row.phone;
        this.editForm.email = row.email;
        this.editForm.role = row.role;
        this.editForm.authority = row.authority;
        this.editForm.isAllAuthorityRange = row.isAllAuthorityRange;
        this.editForm.group = row.group;
//        this.selectedDevicesTags = row.authorityDevices;

        this.getPageDevices(1);
      },
      //编辑 or 新增
      editSubmit: function () {
        let _this = this;

        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            _this.$confirm('确认提交吗？', '提示', {}).then(() => {
              _this.editLoading = true;
              _this.btnEditText = '提交中';
              _this.editForm.devices = _this.selectedDevicesId;

              console.log(_this.editForm);
              api.updateUser(_this.editForm).then((res) => {
                if (res.error_code === 0) {
                  _this.$notify({
                    title: '成功',
                    message: '提交成功',
                    type: 'success'
                  });
                  _this.editLoading = false;
                  _this.btnEditText = '提 交';
                  _this.resetForm();
                  _this.editFormVisible = false;
                  _this.getUsers();
                }
              })
            }).catch(() => {
            });

          }
        });

      },
      getPageDevices(val) { // 获取第几页的设备
        this.devicesPage = val;
        this.getDevices();
      },
      //获取设备列表
      getDevices() {
        let para = {
          page: this.devicesPage,
          pageSize: this.devicesPageSize,
          filters: this.deviceFilters
        };

        this.devicesListLoading = true;
        api.getDeviceListPage(para).then((res) => {
          this.devicesTotal = res.data.total;
          this.devices = res.data.devices;
          this.devicesListLoading = false;
        }).catch((error) => {
          console.log(error);
        });
      },
      handleSelectionChange(selection) {
        // 避免重复添加
        let checkedSelection = selection.filter((item) => {
          let isSelected = false;

          for (let selectedItem of this.selectedDevicesTags) {
            if (item.id === selectedItem.id) {
              isSelected = true;
              break;
            }
          }

          return !isSelected;
        });

        this.selectedDevicesTags.push(...checkedSelection);
      },
      selectedDeviceClose(tag) {
        this.selectedDevicesTags.splice(this.selectedDevicesTags.indexOf(tag), 1);
      },
      resetForm(formName) {
        this.$refs.editForm.resetFields();
      }
    },
    mounted() {
      this.getUsers();
      this.getDevices();
    }
  }
</script>

<style scoped>

</style>
