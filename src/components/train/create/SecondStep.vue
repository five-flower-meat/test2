<template>
  <div>
    <div class="train-step2-upload">
      <train-upload @change="fileChange"
        :isOnlyExcel="true"
        :isNotChange="false"
        :title="'导入课表'" />

      <span class="clickable cursor-pointer train-step2-upload__button"
        @click="downloadTemplate">下载模板</span>
    </div>
    <el-form class="train-step-form"
      :model="trainCreate"
      ref="trainCreateSecondForm"
      :rules="trainCreateSecondRules">

      <el-form-item>
        <courseware-form ref="coursewareRef"
          style="width: 100%"></courseware-form>
      </el-form-item>

      <el-form-item>
        <el-button @click="prev()">上一步</el-button>
        <el-button type="primary"
          @click="submitForm(1)">提交</el-button>
        <el-button @click="submitForm(0)">保存为草稿</el-button>
        <form-cancel :path="'/train/create-management'">取消</form-cancel>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CoursewareForm from 'components/train/create/CoursewareForm.vue';
import TrainUpload from 'components/Upload';

export default {
  props: {
    active: Number
  },
  components: {
    CoursewareForm,
    TrainUpload,
  },
  data() {
    return {
      trainCreateSecondRules: {},
      files: [],
    };
  },
  computed: {
    ...mapState({
      trainCreate: ({ train }) => train.trainCreate
    })
  },
  methods: {
    prev() {
      this.$emit('prev', this.active - 1);
    },

    submitForm(isPublish) {
      let valid = this.$refs.coursewareRef.validate();
      let params = Object.cloneDeep(this.trainCreate);
      if (!valid) return false;

      params.isPublish = isPublish;
      // 时间转化
      params.trainStartDate = params.trainDate[0];
      params.trainEndDate = params.trainDate[1];
      delete params.trainDate;
      delete params.fileName;
      delete params.elecInst;
      params.timetableDateDtoList.forEach(val => {
        val.timetableTopicDtoList.forEach(cVal => {
          cVal.timetableDtoList.forEach(gVal => {
            gVal.startTime = gVal.date[0];
            gVal.endTime = gVal.date[1];
            delete gVal.elecInstList;
            delete gVal.date;
            delete gVal.fileName;
          });
        });
      });
      if (this.$route.params.type !== 'create') {
        params.trainId = this.$route.params.id;
        this.trainManagementEdit(params);
      } else {
        this.trainManagementCreate(params);
      }
    },

    downloadTemplate() {
      window.location.href = './static/file/courseware.xlsx';
    },
    fileChange(file, fileList) {
      // 导入课表
      this.trainImportExcel({
        files: [file.raw]
      }).then(() => {
        // 跳转到第一个tab标签页
        this.$refs.coursewareRef.transforFirstTab(this.trainCreate.timetableDateDtoList[0].timetableDate);
      });
    },

    ...mapActions([
      'trainManagementCreate',
      'trainManagementEdit',
      'trainImportExcel',
    ])
  }
};
</script>

<style lang="scss">
@import "scss/variables.scss";
.train-step2-upload {
  display: flex;
  justify-content: flex-end;
}
.train-step2-upload__button {
  margin-left: $blockWidth;
}
.train-step-form {
  margin-top: $blockWidth;
}
</style>
