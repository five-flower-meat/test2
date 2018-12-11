<template>
  <div>
    <div class="m-container">
      <el-form class="form-manage"
        ref="orderOverview"
        :rules="overviewRules"
        :model="trainApplyCenterForm">
        <div class="flex">
          <el-form-item prop="date">
            <el-date-picker v-model="trainApplyCenterForm.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="培训开始日期"
              end-placeholder="培训结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="form-query-input-width form-left-width">
            <el-select clearable
              v-model="trainApplyCenterForm.trainStatus"
              placeholder="培训进行状态">
              <el-option v-for="item in TRAIN_STATUS"
                :key="item.value"
                :value="item.value"
                :label="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item class="form-query-input-width form-left-width">
            <el-input clearable
              v-model="trainApplyCenterForm.trainTheme"
              placeholder="培训主题" />
          </el-form-item>
        </div>

        <div class="flex">
          <el-form-item class="form-left-width">
            <el-button type="primary"
              @click="query">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="m-container table-container">
      <el-row v-for="(obj, i) in Math.ceil(trainApplyCenterObj.list.length / 3)"
        :key="i">
        <el-col :span="7"
          v-for="(item, index) in listSlice(i)"
          :key="index"
          :offset="index % 3 > 0 ? 1 : 0">
          <el-card :body-style="{ padding: '0px' }"
            @click.native="pushDetail(item)"
            style="position: relative; margin-bottom: 24px; cursor: pointer">

            <train-card :item="item">
              <div class="train-apply">
                <!-- 状态为2，表示已结束 -->
                <el-button type="primary"
                  v-if="isShowApply(item)"
                  :disabled="isDisabledApply(item)"
                  @click.stop="handleImedApply(item)">
                  立即报名
                </el-button>
                <el-button type="primary"
                  v-else
                  disabled>
                  已报名
                </el-button>
              </div>
            </train-card>

          </el-card>
        </el-col>
      </el-row>

      <train-pagination :pageNo="trainApplyCenterForm.pageNo"
        :pageSize="trainApplyCenterForm.pageSize"
        :total="trainApplyCenterObj.totalCount"
        @onPagination="onPagination"
        @onSizePagination="onSizePagination" />
    </div>

    <el-dialog class="train-task-dialog"
      width="433px"
      title="立即报名"
      :center="true"
      :visible.sync="dialogVisible">
      <el-form ref="trainApplyRef"
        :rules="trainApplyRules"
        :model="trainApplyForm"
        :label-width="'80px'">
        <el-form-item label="姓名："
          prop="name">
          <el-input type="input"
            v-model="trainApplyForm.name"
            placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="公司："
          prop="company">
          <el-input type="input"
            v-model="trainApplyForm.company"
            placeholder="请输入公司"></el-input>
        </el-form-item>

        <el-form-item label="手机："
          prop="mobile">
          <el-input type="input"
            v-model="trainApplyForm.mobile"
            placeholder="请输入手机"></el-input>
        </el-form-item>

        <el-form-item label="邮箱：">
          <el-input type="input"
            v-model="trainApplyForm.email"
            placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
            @click="applyConfirm">确 定</el-button>
          <el-button @click="applyCancel">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import TrainPagination from 'components/train/Pagination.vue';
import TrainCard from 'components/train/TrainCard.vue';
import { TRAIN_STATUS } from '@/config/index.js';
import { checkPhone, emailCheck, textLimit } from '@/utils/rules.js';
import dayjs from 'dayjs';

export default {
  components: {
    TrainPagination,
    TrainCard,
  },
  data() {
    return {
      TRAIN_STATUS,
      isNotPageChange: true,
      dialogVisible: false,
      trainApplyForm: {
        trainId: '',
        name: '',
        company: '',
        mobile: '',
        email: '',
      },
      trainApplyRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: textLimit, trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入公司', trigger: 'blur' },
          { validator: textLimit, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        email: [
          { validator: emailCheck, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      trainApplyCenterForm: ({ train }) => train.trainApplyCenterForm,
      trainApplyCenterObj: ({ train }) => train.trainApplyCenterObj,
    })
  },
  beforeMount() {
    this.TRAIN_STATUS = this.TRAIN_STATUS.filter(val => val.value !== 0);
    this.query();
  },
  methods: {
    isDisabledApply(item) {
      // 是否展示立刻报名
      let registerDate = new Date(dayjs(item.registerDate).format('YYYY-MM-DD')).getTime();
      let currentTime = new Date(item.currentTime).getTime();
      return !(registerDate > currentTime);
    },

    isShowApply(item) {
      return parseInt(item.isRegister) === 0;
    },

    // hasOverTime(item) {
    //   const hasOverTime = new Date(item.registerDate).getTime() < new Date(item.currentTime).getTime();
    //   return hasOverTimel
    // },

    handleImedApply(item) {
      this.trainApplyForm.trainId = item.id;
      this.dialogVisible = true;
    },

    applyConfirm() {
      this.$refs.trainApplyRef.validate(valid => {
        if (!valid) return false;

        this.trainApplyConfirm(this.trainApplyForm).then(() => {
          this.$message({
            type: 'success',
            message: '报名成功'
          });
          this.query();
          this.clearDialogForm();
        });
      });
    },

    applyCancel() {
      this.clearDialogForm();
    },

    clearDialogForm() {
      this.$refs.trainApplyRef.resetFields();
      this.dialogVisible = false;
    },

    listSlice(index) {
      return this.trainApplyCenterObj.list.slice(3 * index, 3 * index + 3);
    },

    pushDetail(item) {
      this.$router.push(`/train/apply-center/detail/${item.id}`);
    },

    query() {
      this.isNotPageChange && this.pageChange({ pageNo: 1 });
      let params = Object.cloneDeep(this.trainApplyCenterForm);

      if (params.date.length) {
        params.trainStartDate = params.date[0];
        params.trainEndDate = params.date[1];
      }
      delete params.date;
      this.trainGetApplyCenter(params);
    },

    async onPagination(value) {
      this.isNotPageChange = false;
      this.pageChange({ pageNo: value });
      await this.query();
      this.isNotPageChange = true;
    },

    onSizePagination(value) {
      this.pageChange({ pageSize: value });
      this.query();
    },

    ...mapActions([
      'trainGetApplyCenter',
      'trainApplyConfirm',
    ]),

    ...mapMutations({
      pageChange: 'TRAIN_APPLYC_PAGE_CHANGE'
    })
  }
};
</script>
