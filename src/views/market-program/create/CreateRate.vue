<template>
  <div>
    <div class="m-container">
      <div class="breadcrumb">
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/market-program/rate-activity' }">营销方案管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{ routeType() }}营销方案</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="m-container margin-top-16">
      <el-form :model="createActivityForm" :rules="activityRules" ref="createActivityRef" label-width="140px">
        <el-form-item label="方案名称" prop='programmeName'>
          <el-input class="form-input-medium" v-model="createActivityForm.programmeName"></el-input>
        </el-form-item>
        <el-form-item label="方案实施时间" prop="date">
          <el-date-picker :disabled="createActivityForm.programmeStatus === '2'" class="form-input-large" v-model="createActivityForm.date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="方案实施目的" prop="programmePurpose">
          <el-input type="textarea" class="form-input-large" v-model="createActivityForm.programmePurpose"></el-input>
        </el-form-item>
        <el-form-item label="方案总结" prop="programmeReport">
          <el-input type="textarea" class="form-input-large" v-model="createActivityForm.programmeReport"></el-input>
        </el-form-item>

        <el-form-item label="方案具体文档">
          <vm-upload :fileTypeId="FILE_TYPE_ID.marketSpecific" v-model="createActivityForm.particularDocId" :fileInputId="createActivityForm.particularDocId" @change="file => getFileName(file, 'particularDocName')" @remove="removeFileName('particularDocName')" :fileName="createActivityForm.particularDocName" :isUploaded="createActivityForm.particularDocName ? true : false" />
        </el-form-item>
        <el-form-item label="方案客服文档">
          <vm-upload :fileTypeId="FILE_TYPE_ID.marketCustomerService" v-model="createActivityForm.csDocId" :fileInputId="createActivityForm.csDocId" @change="file => getFileName(file, 'csDocName')" @remove="removeFileName('csDocName')" :fileName="createActivityForm.csDocName" :isUploaded="createActivityForm.csDocName ? true : false" />
        </el-form-item>

        <el-form-item label="方案收益测算文档">
          <vm-upload :fileTypeId="FILE_TYPE_ID.marketEarn" v-model="createActivityForm.incomeCalculationDocId" :fileInputId="createActivityForm.incomeCalculationDocId" @change="file => getFileName(file, 'incomeCalculationDocName')" @remove="removeFileName('incomeCalculationDocName')" :fileName="createActivityForm.incomeCalculationDocName" :isUploaded="createActivityForm.incomeCalculationDocName ? true : false" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>
          <form-cancel path="/market-program/rate-activity" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import VmUpload from 'components/Upload.vue';
import { FILE_TYPE_ID } from '@/config/index.js';
import { textAccountLimit, textareaMaxLimit } from '@/utils/rules.js';
import dayjs from 'dayjs';

export default {
  components: {
    VmUpload,
  },
  data() {
    return {
      FILE_TYPE_ID,
      resetForm: {},
      activityRules: {
        programmeName: [
          { required: true, message: '请输入方案名称', trigger: 'blur' },
          { validator: textAccountLimit, trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请输入方案实施时间', trigger: 'blur' },
        ],
        programmePurpose: [
          { required: true, message: '请输入方案实施目的', trigger: 'blur' },
          { validator: textareaMaxLimit, trigger: 'blur' }
        ],
        programmeReport: [
          { required: true, message: '请输入方案总结', trigger: 'blur' },
          { validator: textareaMaxLimit, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      createActivityForm: ({ marketProgram }) => marketProgram.createActivityForm
    })
  },
  beforeMount() {
    this.resetForm = Object.cloneDeep(this.createActivityForm);
    if (this.$route.params.type !== 'create') {
      this.marketActivityGetDetail({
        programmeId: this.$route.params.id
      });
    } else {
      this.clearForm();
    }
  },
  beforeDestroy() {
    // 组件注销的时候，需要清空表单数据
    this.clearForm();
  },
  methods: {
    getFileName(file, value) {
      this.createActivityValueUpdate({
        [value]: file.raw.name
      });
    },

    removeFileName(value) {
      this.createActivityValueUpdate({
        [value]: ''
      });
    },

    routeType() {
      return this.$route.params.type === 'create' ? '上传' : '修改';
    },

    submitForm() {
      let params = Object.cloneDeep(this.createActivityForm);

      delete params.programmeCode;
      delete params.averageScore;
      delete params.bizScoreDetailDtoList;
      delete params.programmeStatus;

      delete params.csDocList;
      delete params.incomeCalculationDocList;
      delete params.particularDocList;
      delete params.particularDocName;
      delete params.csDocName;
      delete params.incomeCalculationDocName;

      if (params.date.length) {
        params.programmeStartTime = dayjs(params.date[0]).format('YYYY-MM-DD');
        params.programmeEndTime = dayjs(params.date[1]).format('YYYY-MM-DD');
        delete params.date;
      }
      this.$refs.createActivityRef.validate(valid => {
        if (!valid) return false;

        if (this.$route.params.type === 'create') {
          this.marketActivityCreate(params);
        } else {
          params.programmeId = this.$route.params.id;
          this.marketActivityEdit(params);
        }
      });
    },
    ...mapMutations({
      clearForm: 'CREATE_ACTIVITY_FORM',
      createActivityValueUpdate: 'CREATE_ACTIVITY_VALUE_UPDATE',
    }),

    ...mapActions([
      'marketActivityCreate',
      'marketActivityEdit',
      'marketActivityGetDetail',
    ])
  }
};
</script>
