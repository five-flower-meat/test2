<template>
  <div>
    <div class="m-container">
      <div class="breadcrumb">
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/train/create-management' }">培训创建管理</el-breadcrumb-item>
          <el-breadcrumb-item>培训详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <train-detail-cont>
      <div class="task-detail-item" v-if="$route.query.isUploadCourseware === '1'">
        <div class="left"></div>
        <div class="right">
          <el-button type="primary"
            @click="save">
            保存并返回
          </el-button>
        </div>
      </div>
    </train-detail-cont>
  </div>
</template>

<script>
import TrainDetailCont from 'components/train/detail/TrainDetailCont.vue';
import { mapActions, mapMutations } from 'vuex';
export default {
  components: {
    TrainDetailCont
  },
  beforeMount() {
    this.trainGetDetail({
      id: this.$route.params.id
    });
  },
  beforeDestroy() {
    // 清空所有详情数据
    this.trainDestoryDetail();
  },
  methods: {
    save() {
      this.trainSaveDetail();
    },

    ...mapMutations({
      trainDestoryDetail: 'TRAIN_DESTORY_DETAIL'
    }),

    ...mapActions([
      'trainGetDetail',
      'trainSaveDetail',
    ])
  }
};
</script>

<style>
</style>
