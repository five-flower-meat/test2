<template>
  <div>
    <div class="m-container">
      <div class="breadcrumb">
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/train/apply-center' }">培训报名中心</el-breadcrumb-item>
          <el-breadcrumb-item>培训详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <train-detail-cont ref="trainContRef">
      <div class="task-detail-item">
        <div class="left"></div>
        <div class="right">
          <el-button type="primary"
            @click="imedApply"
            v-if="isShowApplyImed()">
            立刻报名
          </el-button>

          <!-- <el-button type="default"
            @click="doawnloadAllCourse">
            下载全部课件
          </el-button> -->

          <el-button type="default"
            @click="downloadClassSchedule">
            下载课表
          </el-button>
        </div>
      </div>
    </train-detail-cont>
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
import { mapState, mapActions, mapMutations } from 'vuex';
import { checkPhone, emailCheck, textLimit } from '@/utils/rules.js';
import TrainDetailCont from 'components/train/detail/TrainDetailCont.vue';
import dayjs from 'dayjs';

export default {
  data() {
    return {
      dialogVisible: false,
      isShowApplyBtn: true,
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
      },
    };
  },
  components: {
    TrainDetailCont
  },
  beforeMount() {
    this.trainGetDetail({
      id: this.$route.params.id
    });
  },
  computed: {
    ...mapState({
      trainDetail: ({ train }) => train.trainDetail,
    })
  },
  beforeDestroy() {
    // 清空所有详情数据
    this.trainDestoryDetail();
  },
  methods: {
    // 是否展示立刻报名
    isShowApplyImed() {
      let isTimePass = false;
      const { trainDetail } = this;
      let registerDate = new Date(dayjs(trainDetail.registerDate).format('YYYY-MM-DD')).getTime();
      let currentTime = new Date(trainDetail.currentTime).getTime();
      if (registerDate > currentTime) {
        isTimePass = true;
      };
      return this.isShowApplyBtn && isTimePass;
    },

    imedApply() {
      this.dialogVisible = true;
    },

    applyConfirm() {
      this.trainApplyForm.trainId = this.$route.params.id;
      this.$refs.trainApplyRef.validate(valid => {
        if (!valid) return false;

        this.trainApplyConfirm(this.trainApplyForm).then(() => {
          this.$message({
            type: 'success',
            message: '报名成功'
          });
          this.isShowApplyBtn = false;
          this.dialogVisible = false;
        });
      });
    },

    applyCancel() {
      this.dialogVisible = false;
    },

    downloadAllCourse() {

    },

    downloadClassSchedule() {
      this.trainDownloadTimetable({
        trainId: this.$route.params.id,
        trainTheme: this.trainDetail.trainTheme,
      });
    },

    ...mapMutations({
      trainDestoryDetail: 'TRAIN_DESTORY_DETAIL'
    }),

    ...mapActions([
      'trainApplyConfirm',
      'trainGetDetail',
      'trainDownloadTimetable',
    ])
  }
};
</script>

<style>
</style>
