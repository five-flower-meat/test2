<template>
  <div>
    <el-form :label-position="'right'"
      label-width="140px"
      :model="trainCreate"
      ref="trainCreateFirstForm"
      :rules="trainCreateFirstRules">
      <el-form-item label="培训主题："
        prop="trainTheme">
        <el-input class="form-input-medium"
          v-model="trainCreate.trainTheme"
          placeholder="请输入培训主题" />
      </el-form-item>

      <el-form-item label="培训时间："
        prop="trainDate">
        <el-date-picker v-model="trainCreate.trainDate"
          type="daterange"
          :picker-options="dateOptions"
          :editable="false"
          value-format="yyyy-MM-dd"
          start-placeholder="培训开始日期"
          end-placeholder="培训结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="报到时间："
        prop="registerDate">
        <el-date-picker class="form-input-medium"
          v-model="trainCreate.registerDate"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :editable="false"
          placeholder="选择日期时间"
          default-time="12:00:00">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="培训地点："
        required>
        <el-form-item style="display: inline-block"
          prop="addressSubcompany">
          <el-select class="form-input-medium"
            placeholder="请选择子公司"
            v-model="trainCreate.addressSubcompany">
            <el-option v-for="item in subCompanyList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <div class="form-input-sep">-</div>
        <el-form-item style="display: inline-block"
          prop="addressDetail">
          <el-input class="form-input-medium"
            v-model="trainCreate.addressDetail"
            placeholder="详细地址" />
        </el-form-item>
      </el-form-item>

      <el-form-item label="培训目标："
        prop="trainGoal">
        <el-input type="textarea"
          class="form-input-large"
          v-model="trainCreate.trainGoal"
          placeholder="请输入培训目标" />
      </el-form-item>
      <el-form-item label="定向名单："
        prop="rosterFileInputId">
        <train-upload style="display:inline-block"
          :fileTypeId="FILE_TYPE_ID.trainConfirmList"
          v-model="trainCreate.rosterFileInputId"
          :fileInputId="trainCreate.rosterFileInputId"
          @change="getFileName"
          @remove="removeFileName"
          :fileName="trainCreate.fileName"
          :isUploaded="trainCreate.fileName ? true : false"
          :isOnlyExcel="true" />
        <span class="clickable cursor-pointer"
        style="margin-left: 16px;"
          @click="downloadTemplate">下载模板</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
          @click="next()">下一步</el-button>
        <form-cancel :path="'/train/create-management'">取消</form-cancel>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { dateRangeWeek, textAccountLimit, textareaLimit, textareaMaxLimit } from '@/utils/rules.js';
import TrainUpload from 'components/Upload.vue';
import { FILE_TYPE_ID } from '@/config/index.js';
import dayjs from 'dayjs';

export default {
  props: {
    active: Number
  },
  components: {
    TrainUpload
  },
  data() {
    // 报到时间必须小于等于培训时间
    const timeCheck = (rule, value, callback) => {
      if (this.trainCreate.trainDate.length) {
        let registerDate = new Date(dayjs(value).format('YYYY-MM-DD')).getTime();
        let trainStartDate = new Date(this.trainCreate.trainDate[0]).getTime();
        if (registerDate > trainStartDate) {
          callback(new Error('报到时间必须小于培训时间'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      FILE_TYPE_ID,
      dateOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      trainCreateFirstRules: {
        trainTheme: [
          { required: true, message: '请输入培训主题', trigger: 'blur' },
          { validator: textAccountLimit, trigger: 'blur' },
        ],
        trainDate: [
          { required: true, message: '请输入培训时间', trigger: 'blur' },
          { validator: dateRangeWeek, trigger: 'blur' },
        ],
        registerDate: [
          { required: true, message: '请输入报到时间', trigger: 'blur' },
          { validator: timeCheck, trigger: 'blur' },
        ],
        addressSubcompany: [
          { required: true, message: '请输入子公司', trigger: 'change' },
        ],
        addressDetail: [
          { required: true, message: '请输入培训地点', trigger: 'blur' },
          { validator: textareaLimit, trigger: 'blur' },
        ],
        trainGoal: [
          // { required: true, message: '请输入培训目标', trigger: 'blur' },
          { validator: textareaMaxLimit, trigger: 'blur' },
        ]
      }
    };
  },
  computed: {
    ...mapState({
      trainCreate: ({ train }) => train.trainCreate,
      subCompanyList: ({ root }) => root.staticData.TRAIN_SUB_COMPANY
    })
  },
  methods: {
    downloadTemplate() {
      window.location.href = './static/file/orienteeringNameList.xlsx';
    },

    getFileName(file) {
      this.trainFileNameChange({
        fileName: file.raw.name
      });
    },

    removeFileName() {
      this.trainFileNameChange({
        fileName: ''
      });
    },

    next() {
      // this.$emit('next', this.active + 1);
      this.$refs.trainCreateFirstForm.validate(valid => {
        if (!valid) return false;

        this.isDateChange();

        this.setOriginDate();

        this.$emit('next', this.active + 1);
      });
    },

    ...mapMutations({
      updateItem: 'TRAIN_CREATE_UPDATE_ITEM',
      isDateChange: 'TRAIN_CREATE_IS_DATE_CHANGE',
      setOriginDate: 'TRAIN_CREATE_ORIGIN_DATE',
      trainFileNameChange: 'TRAIN_FILE_NAME_CHANGE',
    })
  }
};
</script>

<style>
</style>
