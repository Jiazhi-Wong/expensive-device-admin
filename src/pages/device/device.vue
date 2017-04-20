<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.id" placeholder="设备编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.deviceName" placeholder="设备名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.status" placeholder="请选择设备状态">
            <el-option
              v-for="item in statusOptions"
              :label="item.label"
              :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.administrator" placeholder="请选择设备管理员">
            <el-option
              v-for="item in deviceAdministrators"
              :label="item.name"
              :value="item.id" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPageDevices(1)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table
        :data="formattedDevices"
        v-loading="listLoading"
        height="500" style="width: 100%;">
        <el-table-column prop="id" label="设备编号" width="100"></el-table-column>
        <el-table-column prop="deviceName" label="设备名"></el-table-column>
        <el-table-column prop="formattedAdministrator" label="设备管理员"></el-table-column>
        <el-table-column prop="location" label="存放地"></el-table-column>
        <el-table-column prop="price" label="价格" width="100"></el-table-column>
        <el-table-column prop="formattedStatus" label="状态" width="100"></el-table-column>
        <el-table-column label="操作" width="250">
          <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDel(scope.row)">删除</el-button>
            <el-button size="small" type="info" @click="checkLoans(scope.row)">查看借用记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!--分页-->
    <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
      <el-pagination
        layout="prev, pager, next"
        @current-change="getPageDevices"
        :page-size="pageSize"
        :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog :title="editFormTtile" v-model="editFormVisible" @close="resetForm('editForm')">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="设备名" prop="deviceName">
          <el-input v-model="editForm.deviceName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备管理员" prop="administrator">
          <el-select v-model="editForm.administrator" placeholder="请选择设备管理员">
            <el-option
              v-for="item in deviceAdministrators"
              :label="item.name"
              :value="item.id" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="存放地" prop="location">
          <el-input v-model="editForm.location" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="editForm.price" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择状态">
            <el-option
              v-for="item in statusOptions"
              :label="item.label"
              :value="item.value" :key="item.value">
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
  import util from '../../assets/js/util';
  import NProgress from 'nprogress';
  import api from '@/api/api';
  import conf from '@/assets/js/conf';

  export default {
    data() {
      return {
        filters: {
          id: '',
          deviceName: '',
          status: '',
          administrator: '',
        },
        devices: [],
        total: 0,
        page: 1,
        pageSize: 10,
        listLoading: false,
        editFormVisible: false,//编辑界面显是否显示
        editFormTtile: '编辑',//编辑界面标题
        editForm: { //编辑界面数据
          id: 0,
          deviceName: '',
          administrator: '',
          location: '',
          price: '',
          status: '',
        },
        editFormRules: {
          deviceName: [
            {required: true, message: '请输入设备名称', trigger: 'blur'}
          ],
          administrator: [
            {required: true, type: 'number', message: '请选择设备管理员', trigger: 'change'}
          ],
          location: [
            {required: true, message: '请输入存放地点', trigger: 'blur'}
          ],
          price: [
            {required: true, type: 'number', message: '请输入价格', trigger: 'blur'}
          ],
          status: [
            {required: true, type: 'number', message: '请选择状态', trigger: 'change'}
          ]
        },
        editLoading: false,
        btnEditText: '提 交',
        statusOptions: conf.device.statusOptions
      }
    },
    computed: {
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

          for (let status of this.statusOptions) {
            if (status.value === item.status) {
              item.formattedStatus = status.label;
              break;
            }
          }

          return item;
        });

        return formattedDevices;
      }
    },
    methods: {
      getPageDevices(val) { // 获取第几页的设备
        this.page = val;
        this.getDevices();
      },
      //获取设备列表
      getDevices() {
        let para = {
          page: this.page,
          pageSize: this.pageSize,
          filters: this.filters
        };

        this.listLoading = true;
        api.getDeviceListPage(para).then((res) => {
          this.total = res.data.total;
          this.devices = res.data.devices;
          this.listLoading = false;
        }).catch(() => {});
      },
      //删除
      handleDel: function (row) {
        let _this = this;
        this.$confirm('确认删除该设备吗?', '提示', {
          type: 'warning'
        }).then(() => {
          _this.listLoading = true;
          let para = {
            id: row.id,
          };

          api.delDevice(para).then(res => {
            _this.listLoading = false;
            if (res.code === 0) {
              _this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              _this.getDevices();
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
        this.editForm.id = 0;
        this.editForm.deviceName = '';
        this.editForm.administrator = '';
        this.editForm.location = '';
        this.editForm.price = '';
        this.editForm.status = '';
      },
      //显示编辑界面
      handleEdit: function (row) {
        this.editFormVisible = true;
        this.editFormTtile = '编辑';
        this.editForm.id = row.id;
        this.editForm.deviceName = row.deviceName;
        this.editForm.administrator = row.administrator;
        this.editForm.location = row.location;
        this.editForm.price = row.price;
        this.editForm.status = row.status;
      },
      //编辑 or 新增
      editSubmit: function () {
        let _this = this;

        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            _this.$confirm('确认提交吗？', '提示', {}).then(() => {
              _this.editLoading = true;
              _this.btnEditText = '提交中';

              api.updateDevice(_this.editForm).then((res) => {
                if (res.code === 0) {
                  _this.$notify({
                    title: '成功',
                    message: '提交成功',
                    type: 'success'
                  });
                  _this.editLoading = false;
                  _this.btnEditText = '提 交';
                  _this.resetForm('editForm');
                  _this.editFormVisible = false;
                  _this.getDevices();
                }
              })
            }).catch(() => {
            });

          }
        });

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted() {
      this.getPageDevices(1);
    }
  }
</script>

<style scoped>

</style>
