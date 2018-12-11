<template>
  <div>
    <div class="cont m-container">
      <div class="cont-title">
        {{trainDetail.trainTheme}}
      </div>
      <div class="task-detail-item">
        <div class="left">培训目标：</div>
        <div class="right">{{trainDetail.trainGoal}}</div>
      </div>
      <div class="task-detail-item">
        <div class="left">培训时间：</div>
        <div class="right">{{trainDetail.trainStartDate}}~{{trainDetail.trainEndDate}}</div>
      </div>
      <div class="task-detail-item">
        <div class="left">培训地点：</div>
        <div class="right">{{trainDetail.addressDetail}}</div>
      </div>
      <div class="task-detail-item">
        <div class="left">定向名单：</div>
        <div class="right">
          <train-download v-if="trainDetail.elecInst && trainDetail.elecInst.length"
            :fileObj="trainDetail.elecInst[0]" />
        </div>
      </div>
      <div class="task-detail-item">
        <div class="left">报名情况：</div>
        <div class="right">{{trainDetail.registerPopulation}}人报名
          <span class="train-reamin-days">{{remainDays()}}</span>
        </div>
      </div>
      <div class="task-detail-item">
        <div class="left">培训课表：</div>
        <div class="right">
          <train-detail-tab v-if="trainDetail.timetableDateDtoList.length" />
        </div>
      </div>

      <slot />
    </div>
  </div>
</template>

<script>
import TrainDetailTab from './TrainDetailTab.vue';
import TrainDownload from 'components/Download.vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import dayjs from 'dayjs';
export default {
  components: {
    TrainDetailTab,
    TrainDownload
  },
  computed: {
    ...mapState({
      trainDetail: ({ train }) => train.trainDetail,
    })
  },
  methods: {
    remainDays() {
      const { trainDetail } = this;

      // 如果为草稿状态，则不返回信息
      if (trainDetail.status === 0) return '';

      let registerDate = new Date(dayjs(trainDetail.registerDate).format('YYYY-MM-DD')).getTime();
      let currentTime = new Date(trainDetail.currentTime).getTime();
      if (registerDate > currentTime) {
        let days = Math.ceil((registerDate - currentTime) / 86400 / 1000);
        return `（还剩${days}天截止）`;
      }
      return '（已截止报名）';
    },

    ...mapMutations({
      routeChange: 'ROUTE_CHANGE'
    }),

    ...mapActions([
      'trainGetDetail',
    ])
  }
};
</script>

<style lang="scss" scoped>
.cont {
  margin-top: 16px;
}
.cont-title {
  line-height: 24px;
  font-size: 16px;
  margin-left: 30px;
  font-weight: bold;
}
.train-reamin-days {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}
</style>
