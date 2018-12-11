<template>
  <div>
    <div class="m-container">
      <div class="breadcrumb">
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/train/my' }">我的培训</el-breadcrumb-item>
          <el-breadcrumb-item>培训详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <train-detail-cont></train-detail-cont>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import TrainDetailCont from 'components/train/detail/TrainDetailCont.vue';
export default {
  components: {
    TrainDetailCont
  },
  beforeDestroy() {
    // 清空所有详情数据
    this.trainDestoryDetail();
  },
  beforeMount() {
    this.trainGetDetail({
      id: this.$route.params.id,
      isMyTrain: true,
    });
  },
  methods: {
    ...mapMutations({
      trainDestoryDetail: 'TRAIN_DESTORY_DETAIL'
    }),

    ...mapActions([
      'trainGetDetail',
    ])
  }
};
</script>

<style>
</style>
