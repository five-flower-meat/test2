<template>
  <div>
    <div class="m-container">
      <el-form class="form-manage"
        ref="orderOverview"
        :rules="overviewRules"
        :model="trainMyForm">
        <div class="flex">
          <el-form-item prop="date">
            <el-date-picker v-model="trainMyForm.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="培训开始日期"
              end-placeholder="培训结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="form-query-input-width form-left-width">
            <el-select clearable
              v-model="trainMyForm.trainStatus"
              placeholder="培训进行状态">
              <el-option v-for="item in TRAIN_STATUS"
                :key="item.value"
                :value="item.value"
                :label="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item class="form-query-input-width form-left-width">
            <el-input clearable
              v-model="trainMyForm.trainTheme"
              placeholder="培训主题" />
          </el-form-item>
        </div>

        <div class="flex">
          <el-form-item class="form-left-width">
            <el-button type="primary"
              @click="query">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="m-container table-container">
      <el-row v-for="(obj, i) in Math.ceil(trainMyObj.list.length / 3)"
        :key="i">
        <el-col :span="7"
          v-for="(item, index) in listSlice(i)"
          :key="index"
          :offset="index % 3 > 0 ? 1 : 0">
          <el-card :body-style="{ padding: '0px' }"
            @click.native="pushDetail(item)"
            style="position: relative; margin-bottom: 24px; cursor: pointer">

            <train-card :item="item"
              :query="query">
              <div class="train-card-bottom">
                <div>
                  报名人数
                  <span>{{item.registerPopulation}}</span>
                </div>
                <div class="train-card-bottom-line">
                  |
                </div>
                <div>
                  课件个数
                  <span>{{item.totalCourse}}</span>
                  <el-tag v-if="parseInt(item.coursewareAdvise) > 0"
                    type="warning"
                    size="mini">NEW</el-tag>
                </div>
              </div>
            </train-card>

          </el-card>
        </el-col>
      </el-row>

      <train-pagination :pageNo="trainMyForm.pageNo"
        :pageSize="trainMyForm.pageSize"
        :total="trainMyObj.totalCount"
        @onPagination="onPagination"
        @onSizePagination="onSizePagination" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import TrainPagination from 'components/train/Pagination.vue';
import TrainCard from 'components/train/TrainCard.vue';
import { TRAIN_STATUS } from '@/config/index.js';

export default {
  components: {
    TrainPagination,
    TrainCard,
  },
  data() {
    return {
      TRAIN_STATUS,
      isNotPageChange: true,
    };
  },
  computed: {
    ...mapState({
      trainMyForm: ({ train }) => train.trainMyForm,
      trainMyObj: ({ train }) => train.trainMyObj,
    })
  },
  beforeMount() {
    this.TRAIN_STATUS = this.TRAIN_STATUS.filter(val => val.value !== 0);
    this.query();
  },
  methods: {
    listSlice(index) {
      return this.trainMyObj.list.slice(3 * index, 3 * index + 3);
    },

    pushDetail(item) {
      this.$router.push(`/train/my/detail/${item.id}`);
    },

    query() {
      this.isNotPageChange && this.pageChange({ pageNo: 1 });
      let params = Object.cloneDeep(this.trainMyForm);

      if (params.date.length) {
        params.trainStartDate = params.date[0];
        params.trainEndDate = params.date[1];
      }
      delete params.date;
      this.trainGetMy(params);
    },

    async onPagination(value) {
      this.isNotPageChange = false;
      this.pageChange({ pageNo: value });
      await this.query();
      this.isNotPageChange = true;
    },

    onSizePagination(value) {
      this.pageChange({ pageSize: value });
      this.query();
    },

    ...mapActions([
      'trainGetMy',
    ]),

    ...mapMutations({
      pageChange: 'TRAIN_MY_PAGE_CHANGE'
    })
  }
};
</script>
