<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.groupName" placeholder="团队"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.teacher" placeholder="导师"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPageGroups(1)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table
        :data="groups"
        v-loading="listLoading"
        height="500" style="width: 100%;">
        <el-table-column prop="groupName" label="团队名"></el-table-column>
        <el-table-column prop="teacher" label="导师"></el-table-column>
        <el-table-column prop="linkman" label="联系人"></el-table-column>
        <el-table-column prop="phone" label="联系方式"></el-table-column>
        <el-table-column prop="creditScore" label="信用积分" width="100"></el-table-column>
        <el-table-column label="信用记录" width="150">
          <template scope="scope">
            <el-button size="small" @click="showCreditBox(scope.row)">添加</el-button>
            <el-button type="info" size="small" @click="handleCreditList(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350">
          <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDel(scope.row)">删除</el-button>
            <el-button size="small" type="info" @click="checkUsers(scope.row)">查看成员</el-button>
            <el-button size="small" type="info" @click="checkLoans(scope.row)">查看借用记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!--分页-->
    <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
      <el-pagination
        layout="prev, pager, next"
        @current-change="getPageGroups"
        :page-size="pageSize"
        :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog :title="editFormTtile" v-model="editFormVisible" @close="resetForm('editForm')">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="团队名" prop="groupName">
          <el-input v-model="editForm.groupName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="导师" prop="teacher">
          <el-input v-model="editForm.teacher" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="editForm.linkman" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editForm.phone" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
      </div>
    </el-dialog>

    <!--添加信用记录-->
    <el-dialog title="添加信用记录" v-model="addCreditVisible" @close="resetForm('addCreditForm')">
      <el-form :model="addCreditForm" label-width="100px" :rules="addCreditFormRules" ref="addCreditForm">
        <el-form-item label="加分/减分" prop="type">
          <el-radio-group v-model="addCreditForm.type">
            <el-radio :label="1">加分</el-radio>
            <el-radio :label="2">减分</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分数" prop="score">
          <el-input-number v-model="addCreditForm.score" :min="1" :max="20"></el-input-number>
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="addCreditForm.message">
          </el-input>
        </el-form-item>
        <el-form-item label="借用记录编号">
          <el-input v-model="addCreditForm.loanId" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addCreditVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click.native="addCreditSubmit"
                   :loading="addCreditLoading">{{btnAddCreditText}}
        </el-button>
      </div>
    </el-dialog>

    <!--查看信用记录-->
    <el-dialog title="信用记录" v-model="creditListVisible">
      <el-table :data="formattedCreditList"
                v-loading="creditListLoading"
                :row-class-name="creditListRowClass">
        <el-table-column type="expand">
          <template scope="scope">
            <el-form label-position="left" inline class="credit-table-expand">
              <el-form-item label="说明">
                <span>{{ scope.row.message }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="formattedType" label="加分/减分"></el-table-column>
        <el-table-column prop="score" label="分数"></el-table-column>
        <el-table-column prop="loanId" label="借用记录编号"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" type="danger" @click="handleCreditDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" style="padding:10px 0;">
        <el-pagination
          layout="prev, pager, next"
          @current-change="getPageCreditList"
          :current-page="creditListPage"
          :page-size="creditListPageSize"
          :total="creditListTotal" style="float:right;">
        </el-pagination>
      </el-col>
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
          groupName: '',
          teacher: '',
        },
        groups: [],
        total: 0,
        page: 1,
        pageSize: 10,
        listLoading: false,
        editFormVisible: false,//编辑界面显是否显示
        editFormTtile: '编辑',//编辑界面标题
        editForm: { //编辑界面数据
          id: 0,
          groupName: '',
          teacher: '',
          linkman: '',
          phone: '',
        },
        editFormRules: {
          groupName: [
            {required: true, message: '请输入团队名', trigger: 'blur'}
          ],
          teacher: [
            {required: true, message: '请输入导师姓名', trigger: 'blur'}
          ],
          linkman: [
            {required: true, message: '请输入团队联系人姓名', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入联系人联系方式', trigger: 'blur'}
          ]
        },
        editLoading: false,
        btnEditText: '提 交',
        addCreditVisible: false,
        addCreditForm: { //添加信用记录数据
          groupId: 0,
          type: '',
          score: '',
          message: '',
          loanId: '',  // 借用记录编号
        },
        addCreditFormRules: {
          type: [
            {required: true, type: 'number', message: '请选择加分/减分', trigger: 'change'}
          ],
          score: [
            {required: true, type: 'number', message: '请填写分数', trigger: 'blur'}
          ]
        },
        addCreditLoading: false,
        btnAddCreditText: '提 交',
        creditListVisible: false, // 查看信用记录
        creditList: [], // 信用记录数据
        creditListGroupId: '',
        creditListTotal: 0,
        creditListPage: 1,
        creditListPageSize: 5,
        creditListLoading: false,
      }
    },
    computed: {
      formattedCreditList() {
        let formattedCreditList = [];
        let creditMapArr = [{
          label: '加分',
          value: 1
        }, {
          label: '减分',
          value: 2
        }];

        formattedCreditList = this.creditList.map((item, index) => {
          for (let type of creditMapArr) {
            if (type.value === item.type) {
              item.formattedType = type.label;

              break;
            }
          }

          return item;

        });

        return formattedCreditList;
      }
    },
    methods: {
      getPageGroups(val) { // 获取第几页的用户
        this.page = val;
        this.getGroups();
      },
      //获取用户列表
      getGroups() {
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
        api.getGroupListPage(para).then((res) => {
          this.total = res.data.total;
          this.groups = res.data.groups;
          this.listLoading = false;
        }).catch(() => {});
      },
      //删除
      handleDel: function (row) {
        //console.log(row);
        let _this = this;
        this.$confirm('确认删除该组别吗?', '提示', {
          type: 'warning'
        }).then(() => {
          _this.listLoading = true;
          let para = {
            id: row.id,
          };

          api.delGroup(para).then(res => {
            _this.listLoading = false;
            if (res.error_code === 0) {
              _this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              _this.getGroups();
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
        this.editForm.groupName = '';
        this.editForm.teacher = '';
        this.editForm.linkman = '';
        this.editForm.phone = '';
      },
      //显示编辑界面
      handleEdit: function (row) {
        this.editFormVisible = true;
        this.editFormTtile = '编辑';
        this.editForm.id = row.id;
        this.editForm.groupName = row.groupName;
        this.editForm.teacher = row.teacher;
        this.editForm.linkman = row.linkman;
        this.editForm.phone = row.phone;
      },
      //编辑 or 新增
      editSubmit: function () {
        let _this = this;

        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            _this.$confirm('确认提交吗？', '提示', {}).then(() => {
              _this.editLoading = true;
              _this.btnEditText = '提交中';

              api.updateGroup(_this.editForm).then((res) => {
                if (res.error_code === 0) {
                  _this.$notify({
                    title: '成功',
                    message: '提交成功',
                    type: 'success'
                  });
                  _this.editLoading = false;
                  _this.btnEditText = '提 交';
                  _this.resetForm('editForm');
                  _this.editFormVisible = false;
                  _this.getGroups();
                }
              })
            }).catch(() => {
            });

          }
        });

      },
      // 添加新信用记录
      showCreditBox: function (row) {
        this.addCreditVisible = true;
        this.addCreditForm.groupId = row.id;
        this.addCreditForm.type = '';
        this.addCreditForm.score = '';
        this.addCreditForm.message = '';
        this.addCreditForm.loanId = '';
      },
      addCreditSubmit: function () {
        let _this = this;
        _this.$refs.addCreditForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              _this.addCreditLoading = true;
              _this.btnAddCreditText = '提交中';

              api.addCredit(_this.addCreditForm).then((res) => {
                if (res.error_code === 0) {
                  _this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success'
                  });
                  _this.addCreditLoading = false;
                  _this.btnAddCreditText = '提 交';
                  _this.resetForm('addCreditForm');
                  _this.addCreditVisible = false;
                  _this.getGroups();
                }
              })
            }).catch(() => {
            });
          }
        })
      },
      handleCreditList: function (row) {
        this.creditListVisible = true;
        this.creditListGroupId = row.id;
        this.getPageCreditList(1);
      },
      getPageCreditList: function (val) {
        this.creditListPage = val;
        this.checkCreditList();
      },
      checkCreditList: function () {
        let para = {
          groupId: this.creditListGroupId,
          page: this.creditListPage,
          pageSize: this.creditListPageSize
        };

        this.creditListLoading = true;
        api.getCreditListPage(para).then((res) => {
            console.log(2222222);
            console.log(res.data);
          this.creditListTotal = res.data.total;
          this.creditList = res.data.creditList;
          this.creditListLoading = false;
        }).catch(() => {

        });
      },
      handleCreditDel: function (row) {
        let _this = this;
        this.$confirm('确认删除该信用记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          _this.creditListLoading = true;
          let para = {
            id: row.id,
          };

          api.delCredit(para).then(res => {
            _this.creditListLoading = false;
            if (res.error_code === 0) {
              _this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              _this.checkCreditList();
            }
          }).catch(() => {
            console.log('error');
          });

        }).catch(() => {
        });
      },
      creditListRowClass(row, index) {
        if (row.type === 2) {
          return 'bad-credit';
        }

        return '';
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted() {
      this.getPageGroups(1);
    }
  }
</script>

<style scoped>

</style>
