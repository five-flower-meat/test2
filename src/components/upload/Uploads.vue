<template>
  <div>
    <!-- file-list就是file文件 -->
    <el-upload class="upload-demo"
      :auto-upload="false"
      :on-change="fileChange"
      :multiple="false"
      :on-remove="removeFile"
      :file-list="fileList"
      v-loading.fullscreen.lock="fullLoading">
      <el-button slot="trigger"
        size="small">
        <i class="icon-up margin-right-8"></i>上传文件
      </el-button>
      <div slot="tip"
        class="el-upload__tip">
        <p class="lh1-5">{{FILE_TIP[0]}}</p>
        <p class="lh1-5">{{FILE_TIP[1]}}</p>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { FILE_TIP, FILE_MAX_SIZE, FILE_ERROR_TIP, FILE_ACCEPT } from '@/config/index.js';
import { fileBeforeUpload } from '@/utils/common.js';

export default {
  props: {
    fileList: {
      type: Array,
      default: () => [],
    },
    fileTypeId: String,
  },
  data() {
    return {
      FILE_TIP,
      fullLoading: false,

    };
  },
  methods: {
    fileBeforeUpload(file, fileList) {
      const isOverLimit = file.size > (FILE_MAX_SIZE * 1024 * 1024);
      const isFormat = !this.isFileAcceptable(file.name);
      let index = fileList.findIndex(val => val.uid === file.raw.uid);
      if (isFormat) {
        this.$message.error(FILE_ERROR_TIP);
        fileList.splice(index, 1);
      }
      if (isOverLimit) {
        this.$message.error(`上传文件不能超过${FILE_MAX_SIZE}MB!`);
        fileList.splice(index, 1);
      }
      return isOverLimit || isFormat;
    },

    isFileAcceptable(localFileName) {
      let accepts = FILE_ACCEPT;
      for (let accept of accepts) {
        if (localFileName.toLowerCase().endsWith(accept)) return true;
      }
      return false;
    },

    async fileChange(file, fileList) {
      const isAllowed = fileBeforeUpload.call(this, file, fileList);
      if (isAllowed) return false;

      this.fullLoading = true;

      let localFileInputId = await this.getNewFileInputId();
      file.fileInputId = localFileInputId;

      let params = {
        fileInputId: file.fileInputId,
        fileTypeId: this.fileTypeId,
        moduleId: 1, // 这个值固定
        files: [file.raw]
      };
      let isError = await this.uploadFile(params);
      if (!isError) {
        await this.$emit('input', localFileInputId);
        await this.$emit('change', file, fileList);
      }
      this.fullLoading = false;
    },

    async removeFile(file, fileList) {
      this.fullLoading = true;

      let elecInstId = file.elecInstId;

      // 先获取附件详情
      if (!elecInstId) {
        let fileDetail = await this.getFileThroughtFileId({
          fileInputId: file.fileInputId
        });
        if (fileDetail && fileDetail.data) {
          // 通过名称，筛选出是哪一个文件
          let fileFilter = fileDetail.data.filter(val => val.fileName === file.name);
          if (fileFilter[0]) {
            elecInstId = fileFilter[0].elecInstId;
          }
        }
      }

      await this.delUplodFile({
        elecInstId: elecInstId,
        fileTypeId: this.fileTypeId,
      }).then(() => {
        // 将file.fileInputId置为空
        file.fileInputId = '';
        this.$emit('remove', file);
        this.$emit('input', '');
        this.fullLoading = false;
      }).catch(() => {
        this.fullLoading = false;
      });
    },

    ...mapActions([
      'getNewFileInputId',
      'uploadFile',
      'delUplodFile',
      'getFileThroughtFileId'
    ]),
  }
};
</script>

<style>
</style>
