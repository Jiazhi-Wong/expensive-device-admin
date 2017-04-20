<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.loanId" placeholder="借用编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.loaner" placeholder="借用人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.phone" placeholder="联系方式"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.group" placeholder="请选择组别">
            <el-option
              v-for="item in groupOptions"
              :label="item.name"
              :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.status" placeholder="请选择状态">
            <el-option
              v-for="item in statusOptions"
              :label="item.label"
              :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPageLoans(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table
        :data="formattedLoanList"
        v-loading="listLoading"
        height="500" style="width: 100%;">
        <el-table-column type="expand">
          <template scope="scope">
            <el-form label-position="left" inline class="loan-table-expand">
              <el-form-item label="借用编号">
                <span>{{ scope.row.loanId }}</span>
              </el-form-item>
              <el-form-item label="借用设备">
                <span>{{ scope.row.device }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <span>{{ scope.row.formattedStatus }}</span>
              </el-form-item>
              <el-form-item label="借用人">
                <span>{{ scope.row.loaner }}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{ scope.row.phone }}</span>
              </el-form-item>
              <el-form-item label="邮箱">
                <span>{{ scope.row.email }}</span>
              </el-form-item>
              <el-form-item label="借用时间">
                <span>{{ scope.row.formattedLoanTime }}</span>
              </el-form-item>
              <el-form-item label="应归还时间">
                <span>{{ scope.row.formattedReturnTime }}</span>
              </el-form-item>
              <el-form-item label="实际归还时间">
                <span>{{ scope.row.formattedRealReturnTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="loanId" label="借用编号"></el-table-column>
        <el-table-column prop="device" label="借用设备"></el-table-column>
        <el-table-column prop="loaner" label="借用人"></el-table-column>
        <el-table-column prop="formattedLoanTime" label="借用时间"></el-table-column>
        <el-table-column prop="formattedReturnTime" label="应归还时间"></el-table-column>
        <el-table-column prop="formattedStatus" label="状态" width="150"></el-table-column>
        <el-table-column label="操作" width="350">
          <template scope="scope">
            <template v-if="$store.state.user.userData.authority.indexOf(1) > -1
                         || $store.state.user.userData.authority.indexOf(3) > -1">
              <el-button v-if="scope.row.status === 1"
                         size="small" type="success"
                         @click="handleAdminExamine(scope.row, true)">通过</el-button>
              <el-button v-if="scope.row.status === 1"
                         size="small" type="danger"
                         @click="handleAdminExamine(scope.row, false)">不通过</el-button>
            </template>
            <template v-if="$store.state.user.userData.authority.indexOf(2) > -1">
              <el-button v-if="scope.row.status === 2"
                         size="small" type="success"
                         @click="handleLeaderExamine(scope.row, true)">通过</el-button>
              <el-button v-if="scope.row.status === 2"
                         size="small" type="danger"
                         @click="handleLeaderExamine(scope.row, false)">不通过</el-button>
            </template>
            <el-button v-if="scope.row.status > 2"
                       size="small" @click="showCreditBox(scope.row)">添加信用记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!--分页-->
    <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
      <el-pagination
        layout="prev, pager, next"
        @current-change="getPageLoans"
        :page-size="pageSize"
        :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--添加信用记录-->
    <el-dialog title="添加信用记录" v-model="addCreditVisible" @close="resetForm('addCreditForm')">
      <el-form :model="addCreditForm" label-width="110px" :rules="addCreditFormRules" ref="addCreditForm">
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
        <el-form-item label="借用记录编号" prop="loanId">
          <el-input v-model.number="addCreditForm.loanId"
                    auto-complete="off"
                    :disabled="true"></el-input>
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

  </section>
</template>

<script>
  import NProgress from 'nprogress'
  import api from '@/api/api'
  import conf from '@/assets/js/conf'
  import util from '@/assets/js/util'

  export default {
    data() {
      return {
        filters: {
          loanId: '',
          loaner: '',
          phone: '',
          group: '',
          status: '',
        },
        loanList: [],
        total: 0,
        page: 1,
        pageSize: 10,
        listLoading: false,
        statusOptions: conf.loan.statusOptions,
        addCreditVisible: false,
        addCreditForm: { //添加信用记录数据
          id: 0,
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
          ],
          loanId: [
            {required: true, type: 'number', message: '请填写借用编号', trigger: 'blur'}
          ]
        },
        addCreditLoading: false,
        btnAddCreditText: '提 交',
      }
    },
    computed: {
      groupOptions() {
        return this.$store.state.base.groupOptions;
      },
      formattedLoanList() {
        return this.loanList.map((item, index) => {
          for (let status of this.statusOptions) {
            if (status.value === item.status) {
              item.formattedStatus = status.label;
              break;
            }
          }

          item.formattedLoanTime = util.formatDate.format(new Date(item.loanTime));
          item.formattedReturnTime = util.formatDate.format(new Date(item.returnTime));

          if (item.status === 8) {
            item.formattedRealReturnTime = util.formatDate.format(new Date(item.realReturnTime));
          } else if (item.status <= 3) {
            item.formattedRealReturnTime = '未取用设备';
          } else if (item.status >= 3 && item.status <= 7) {
            item.formattedRealReturnTime = '未归还设备';
          } else if (item.status === 9) {
            item.formattedRealReturnTime = '借用已取消';
          }

          return item;
        });
      }
    },
    methods: {
      getPageLoans(val) { // 获取第几页的用户
        this.page = val;
        this.getLoans();
      },
      //获取借用记录列表
      getLoans() {
        let para = {
          page: this.page,
          pageSize: this.pageSize,
          filters: this.filters
        };

        this.listLoading = true;
        api.getLoanListPage(para).then((res) => {
          this.total = res.data.total;
          this.loanList = res.data.loanList;
          this.listLoading = false;
        }).catch(() => {

        });
      },
      handleAdminExamine(loanItem, isPass) {
        let para = {
          isPass: isPass,
          id: loanItem.loanId
        };

        if (isPass) {
          this.$confirm('确认通过吗?', '提示', {
            type: 'success'
          }).then(() => {
            this.listLoading = true;

            api.handleAdminExamine(para).then(res => {
              this.listLoading = false;
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '审核通过',
                  type: 'success'
                });
                this.getLoans();
              }
            }).catch(() => {
              console.log('error');
            });

          }).catch(() => {});
        } else {
          this.$prompt(`不通过“${loanItem.loaner}”借用申请的原因（非必填）`, '提示', {
            confirmButtonText: '不通过',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            if (value) {
              para.message = value;
            }

            api.handleAdminExamine(para).then(res => {
              this.listLoading = false;
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '审核不通过',
                  type: 'success'
                });
                this.getLoans();
              }
            }).catch(() => {
              console.log('error');
            });
          }).catch(() => {});
        }
      },
      handleLeaderExamine(loanItem, isPass) {
        let para = {
          isPass: isPass,
          id: loanItem.loanId
        };

        if (isPass) {
          this.$confirm('确认通过吗?', '提示', {
            type: 'success'
          }).then(() => {
            this.listLoading = true;

            api.handleLeaderExamine(para).then(res => {
              this.listLoading = false;
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '审核通过',
                  type: 'success'
                });
                this.getLoans();
              }
            }).catch(() => {
              console.log('error');
            });

          }).catch(() => {});
        } else {
          this.$prompt(`不通过“${loanItem.loaner}”借用申请的原因（非必填）`, '提示', {
            confirmButtonText: '不通过',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            if (value) {
              para.message = value;
            }

            api.handleLeaderExamine(para).then(res => {
              this.listLoading = false;
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '审核不通过',
                  type: 'success'
                });
                this.getLoans();
              }
            }).catch(() => {
              console.log('error');
            });
          }).catch(() => {});
        }
      },
      // 添加新信用记录
      showCreditBox: function (row) {
        this.addCreditVisible = true;
        this.addCreditForm.id = row.id;
        this.addCreditForm.type = '';
        this.addCreditForm.score = 1;
        this.addCreditForm.message = '';
        this.addCreditForm.loanId = row.loanId;
      },
      addCreditSubmit: function () {
        let _this = this;
        _this.$refs.addCreditForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              _this.addCreditLoading = true;
              _this.btnAddCreditText = '提交中';

              api.addCredit(_this.addCreditForm).then((res) => {
                if (res.code === 0) {
                  _this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success'
                  });
                  _this.addCreditLoading = false;
                  _this.btnAddCreditText = '提 交';
                  _this.resetForm('addCreditForm');
                  _this.addCreditVisible = false;
                  _this.getLoans();
                }
              })
            }).catch(() => {
            });
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted() {
      this.getPageLoans(1);

    }
  }
</script>

<style scoped>

</style>
