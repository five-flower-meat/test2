<template>
  <div>
    <el-upload v-if="!hasUploaded"
      :auto-upload="false"
      :on-change="fileChange"
      :multiple="false"
      :show-file-list="false"
      v-loading.fullscreen.lock="submitAssignButton">
      <span class="clickable">
        {{title}}
      </span>
      <el-tooltip class="item"
        effect="dark"
        :content="!isOnlyExcel ? FILE_ERROR_TIP_USED_PDF : FILE_ERROR_ONLY_EXCEL_TIP"
        placement="top-start"
        style="color: #3778FF">
        <i class="el-icon-info"></i>
      </el-tooltip>
    </el-upload>
    <div v-if="hasUploaded"
      class="name">
      <div class="clickable">{{localFileName}}</div>
      <i class="el-icon-close clickable cursor-pointer"
        @click="removeFile"
        v-loading.fullscreen.lock="submitAssignButton"></i>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import {
  FILE_MAX_SIZE,
  FILE_ACCEPT_USED_PDF,
  FILE_ACCEPT_ONLY_EXCEL,
  FILE_ERROR_ONLY_EXCEL_TIP,
  FILE_ERROR_TIP_USED_PDF
} from '@/config/index.js';

export default {
  props: {
    isUploaded: {
      type: Boolean,
      default: false,
    },
    fileTypeId: String,
    title: {
      default: '上传文件',
      type: String,
    },
    fileName: {
      type: String,
      default: '',
    },
    fileInputId: {
      type: String,
      default: '',
    },
    isOnlyExcel: {
      type: Boolean,
      default: false,
    },
    // 不触发文件展示
    isNotChange: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      FILE_ERROR_TIP_USED_PDF,
      FILE_ERROR_ONLY_EXCEL_TIP,
      hasUploaded: this.isUploaded,
      localFileName: this.fileName,
      submitAssignButton: false,
      localFileInputId: this.fileInputId,
    };
  },
  watch: {
    fileName() {
      if (!this.isNotChange) return false;

      this.localFileName = this.fileName;
      this.hasUploaded = this.isUploaded;
    },
    fileInputId() {
      this.localFileInputId = this.fileInputId;
    }
  },
  methods: {
    fileBeforeUpload(file, fileList) {
      const isOverLimit = file.size > (FILE_MAX_SIZE * 1024 * 1024);
      const isFormat = !this.isFileAcceptable(file.name);
      let index = fileList.findIndex(val => val.uid === file.raw.uid);
      if (isFormat) {
        this.$message.error(this.isOnlyExcel ? FILE_ERROR_ONLY_EXCEL_TIP : FILE_ERROR_TIP_USED_PDF);
        fileList.splice(index, 1);
      }
      if (isOverLimit) {
        this.$message.error(`上传文件不能超过${FILE_MAX_SIZE}MB!`);
        fileList.splice(index, 1);
      }
      return isOverLimit || isFormat;
    },

    isFileAcceptable(localFileName) {
      let accepts = this.isOnlyExcel ? FILE_ACCEPT_ONLY_EXCEL : FILE_ACCEPT_USED_PDF;
      for (let accept of accepts) {
        if (localFileName.toLowerCase().endsWith(accept)) return true;
      }
      return false;
    },

    async fileChange(file, fileList) {
      const isAllowed = this.fileBeforeUpload(file, fileList);
      if (isAllowed) return false;

      this.submitAssignButton = true;

      // 文件上传，出现文件名，或者只负责上传文件
      if (this.isNotChange) {
        let localFileInputId = await this.getNewFileInputId();
        this.localFileInputId = localFileInputId;

        let params = {
          fileInputId: localFileInputId,
          fileTypeId: this.fileTypeId,
          moduleId: 1,
          files: [file.raw]
        };

        let isError = await this.uploadFile(params);
        // console.log(isError);
        if (!isError) {
          this.localFileName = file.raw.name;
          this.hasUploaded = !this.hasUploaded;
          await this.$emit('input', localFileInputId);
          await this.$emit('change', file, fileList);
        }
      } else {
        this.$emit('change', file, fileList);
      }

      this.submitAssignButton = false;
    },

    removeFile() {
      this.submitAssignButton = true;
      this.hasUploaded = !this.hasUploaded;

      this.$emit('input', '');
      this.$emit('remove');

      this.delUploadFileUseInputId({
        fileInputId: this.localFileInputId,
        fileTypeId: this.fileTypeId,
      }).then(() => {
        this.submitAssignButton = false;
      }).catch(() => {
        this.submitAssignButton = false;
      });
    },

    ...mapActions([
      'getNewFileInputId',
      'uploadFile',
      'delUploadFileUseInputId',
    ]),
  }
};
</script>

<style scoped>
.name {
  display: flex;
  align-items: center;
}
.name i {
  line-height: 20px;
  font-size: 16px;
  margin-left: 6px;
}
</style>
