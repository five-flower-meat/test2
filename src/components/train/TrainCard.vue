<template>
  <div class="train-card">
    <div class="train-card-main">
      <div class="train-card-badge"
        :style="{'border-right-color': renderColor(item), 'border-top-color' : renderColor(item)}">
        <div class="train-card-badge__title">{{renderTitle(item)}}</div>
      </div>
      <div class="train-card-badge-small"></div>
      <div class="train-card__title">
        {{item.trainTheme}}
      </div>
      <div class="train-card-main-item">
        <div class="train-card-main__left">培训时间</div>
        <div class="train-card-main__right">{{item.trainStartDate}}~{{item.trainEndDate}}</div>
      </div>
      <div class="train-card-main-item">
        <div class="train-card-main__left">培训地点</div>
        <div class="train-card-main__right">{{item.addressDetail}}</div>
      </div>
      <div class="train-card__join"
        v-if="!isMyTrainPage">
        {{item.registerPopulation}} 人报名参加
      </div>
      <div class="train-card__join"
        v-if="isMyTrainPage">
        <!-- 进行中状态 -->
        <count-down v-if="item.trainStartDate && item.status === '1'"
          :startTime="item.trainStartDate"
          :currentTime="item.currentTime"
          :isStart="1" />
          <!-- 结束状态 -->
        <count-down v-if="item.trainEndDate && item.status === '2'"
          :startTime="item.trainEndDate"
          :currentTime="item.currentTime"
          :isStart="0" />
        <span class="clickable cursor-pointer train-cancel-apply"
          v-if="isShowCancelApply(item)"
          @click.stop="cancelApply(item.id)">取消报名</span>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { TRAIN_STATUS } from '@/config/index.js';
import CountDown from 'components/train/CountDown.vue';
export default {
  props: {
    item: Object,
    query: Function,
  },
  components: {
    CountDown
  },
  data() {
    return {
      isMyTrainPage: this.$route.fullPath.includes('train/my'),
    };
  },
  methods: {
    isShowCancelApply(item) {
      const hasOverTime = new Date(item.registerDate).getTime() < new Date(item.currentTime).getTime();
      return parseInt(item.isRegister) === 1 && !hasOverTime;
    },

    renderColor(item) {
      let _filter = TRAIN_STATUS.filter(val => val.value === parseInt(item.statusBranch))[0];
      return _filter ? _filter.color : '';
    },

    renderTitle(item) {
      let _filter = TRAIN_STATUS.filter(val => val.value === parseInt(item.statusBranch))[0];
      return _filter ? _filter.key : '';
    },

    cancelApply(trainId) {
      this.$confirm('您确定要取消报名？', ' ', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.trainCancelApply({
          trainId
        }).then(() => {
          this.$message({
            type: 'success',
            message: '取消报名成功！'
          });
          this.query();
        });
      }).catch(() => {
        this.$message('已取消操作');
      });
    },

    ...mapActions([
      'trainCancelApply'
    ])
  }
};
</script>

<style>
</style>
