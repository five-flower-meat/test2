<template>
  <div>
    <el-tabs class="train-step2-tab"
      v-model="editableTabsValue"
      type="border-card">
      <el-tab-pane v-for="item in trainDetail.timetableDateDtoList"
        :key="item.timetableDate"
        :label="item.timetableDate"
        :name="item.timetableDate">
        <div class="list"
          v-for="(cItem, ci) in item.timetableTopicDtoList"
          :key="ci">
          <div class="title">
            {{cItem.topic}}
          </div>
          <div class="content"
            v-for="(gItem, gi) in cItem.timetableDtoList"
            :key="gi">
            <div class="time item">
              {{`${filterYYYYMMDD(gItem.startTime)}-${filterYYYYMMDD(gItem.endTime)}`}}
            </div>
            <div class="speaker item">
              {{gItem.trainer}}
            </div>
            <div class="content-title item">
              {{gItem.title}}
            </div>
            <div class="item"
              v-if="isUploadCourseware">
              <train-upload v-if="Object.isExistArray(gItem.elecInstList)"
                :isUploaded="true"
                :fileName="Object.isExistArray(gItem.elecInstList) ? gItem.elecInstList[0].fileName : ''"
                :fileInputId="gItem.fileInputId"
                :fileTypeId="FILE_TYPE_ID.trainCourseware"
                v-model="gItem.fileInputId"
                @change="changeFileFlag(ci, gi)"
                @remove="changeFileFlag(ci, gi)" />
              <train-upload v-else
                :fileTypeId="FILE_TYPE_ID.trainCourseware"
                v-model="gItem.fileInputId"
                @change="changeFileFlag(ci, gi)"
                @remove="changeFileFlag(ci, gi)" />
            </div>
            <div class="item"
              v-else>
              <train-download v-if="Object.isExistArray(gItem.elecInstList)"
                :fileObj="gItem.elecInstList[0]"
                :isPDF="true" />
            </div>

            <div class="item"
              v-if="isNew(gItem.id)">
              <el-tag type="warning"
                size="mini">NEW</el-tag>
            </div>
          </div>

        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import TrainUpload from 'components/Upload.vue';
import TrainDownload from 'components/Download.vue';
import { FILE_TYPE_ID } from '@/config/index.js';

export default {
  components: {
    TrainUpload,
    TrainDownload
  },
  data() {
    return {
      FILE_TYPE_ID,
      editableTabsValue: '',
      isUploadCourseware: false
    };
  },
  computed: {
    ...mapState({
      trainDetail: ({ train }) => train.trainDetail,
    })
  },
  beforeMount() {
    if (this.$route.query.isUploadCourseware === '1') {
      this.isUploadCourseware = true;
    }
    // console.log(this.trainDetail.timetableDateDtoList[0]);
    this.editableTabsValue = this.trainDetail.timetableDateDtoList[0].timetableDate;
  },
  methods: {
    filterYYYYMMDD(date) {
      let dates = date.split(' ');
      return dates.length ? dates[1] : '';
    },

    isNew(id) {
      if (this.trainDetail.timetableIds && this.$route.fullPath.includes('train/my/')) {
        let news = this.trainDetail.timetableIds.split(',');
        if (news.includes(id.toString())) {
          return true;
        }
      }
      return false;
    },

    changeFileFlag(ci, gi) {
      this.trainChangeFileFlag({
        time: this.editableTabsValue,
        ci,
        gi,
      });
    },

    ...mapMutations({
      trainChangeFileFlag: 'TRAIN_CHANGE_FILE_FLAG',
    }),
  }
};
</script>

<style lang="scss" scoped>
.list {
  color: rgba(0, 0, 0, 0.85);
}
.list + .list {
  margin-top: 24px;
}
.title {
  line-height: 20px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  margin-left: 32px;
  font-weight: bold;
}
.item {
  margin-left: 32px;
}
.content {
  display: flex;
  margin-top: 16px;
}
</style>
