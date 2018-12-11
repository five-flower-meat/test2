<template>
  <div>
    <div class="m-container">
      <div class="breadcrumb">
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/train/create-management' }">培训创建管理</el-breadcrumb-item>
          <el-breadcrumb-item>创建培训</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="m-container train-create">
      <steps :active="active"
        style="text-align: center;">
        <step title="基本信息填写"></step>
        <step title="培训课表设置"></step>
      </steps>
      <div class="train-create-cont">
        <first-step v-if="active === 0"
          @next="activeChange"
          :active="active" />
        <second-step v-if="active === 1"
          @prev="activeChange"
          :active="active" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import FirstStep from 'components/train/create/FirstStep.vue';
import SecondStep from 'components/train/create/SecondStep.vue';
import Steps from '@/components/Steps.vue';
import Step from '@/components/Step.vue';
export default {
  components: {
    FirstStep,
    SecondStep,
    Steps,
    Step
  },
  data() {
    return {
      active: 0,
    };
  },
  computed: {
    ...mapState({
      trainCreate: ({ train }) => train.trainCreate
    })
  },
  beforeMount() {
    const { type, id } = this.$route.params;
    if (type !== 'create') {
      this.trainGetEdit({ id: id });
    }
  },
  beforeDestroy() {
    this.trainClearCreate();
  },
  methods: {
    activeChange(val) {
      this.active = val;
    },

    ...mapActions([
      'trainGetEdit'
    ]),

    ...mapMutations({
      trainClearCreate: 'TRAIN_CLEAR_CREATE',
    })
  }
};
</script>

<style lang="scss">
@import "scss/variables.scss";
.train-create {
  margin-top: $blockWidth;
}
.train-create-cont {
  margin-top: $blockWidth * 2;
  display: flex;
  justify-content: center;
}
</style>
