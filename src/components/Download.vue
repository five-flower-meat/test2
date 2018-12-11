<template>
  <div>
    <div class="clickable cursor-pointer width-fit-content"
      @click="downloadFile"
      v-if="fileObj && Object.keys(fileObj).length">
      {{fileObj && fileObj.fileName ? fileObj.fileName : ''}}
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: {
    fileObj: Object,
    isPDF: {
      default: false,
      type: Boolean
    },
  },
  methods: {
    downloadFile() {
      let params = {
        fileTypeId: this.fileObj.fileTypeId,
        fileSaveName: this.fileObj.fileSaveName,
        fileName: this.fileObj.fileName
      };

      if (this.isPDF) {
        this.pdfDownloadFile(params);
      } else {
        this.orderDownloadFile(params);
      }
    },

    ...mapActions([
      'pdfDownloadFile',
      'orderDownloadFile',
    ])
  }
};
</script>

<style>
</style>
