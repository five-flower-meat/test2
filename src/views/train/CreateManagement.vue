<template>
  <div>
    <div class="m-container">
      <el-form class="form-manage"
        ref="orderOverview"
        :rules="overviewRules"
        :model="trainCreateManage">
        <div class="flex">
          <el-form-item prop="date">
            <el-date-picker v-model="trainCreateManage.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="培训开始日期"
              end-placeholder="培训结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="form-query-input-width form-left-width">
            <el-select clearable
              v-model="trainCreateManage.trainStatus"
              placeholder="培训进行状态">
              <el-option v-for="item in TRAIN_STATUS"
                :key="item.value"
                :value="item.value"
                :label="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item class="form-query-input-width form-left-width">
            <el-input clearable
              v-model="trainCreateManage.trainTheme"
              placeholder="培训主题" />
          </el-form-item>
        </div>

        <div class="flex">
          <el-form-item class="form-left-width">
            <el-button type="primary"
              @click="query">查询</el-button>
          </el-form-item>
          <el-form-item class="form-left-width">
            <el-button class="el-button--have-icon"
              @click.prevent="handleCreate"
              icon="el-icon-plus">创建培训课程</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="m-container table-container">
      <el-row v-for="(obj, i) in Math.ceil(trainCreateManageObj.list.length / 3)"
        :key="i">
        <el-col :span="7"
          v-for="(item, index) in listSlice(i)"
          :key="index"
          :offset="index % 3 > 0 ? 1 : 0">
          <el-card :body-style="{ padding: '0px' }"
            @click.native="pushDetail(item)"
            style="position: relative; margin-bottom: 24px; cursor: pointer">

            <train-card :item="item">
              <!-- 非草稿状态，展示 -->
              <div class="train-card-bottom"
                v-if="item.status !== '0'">
                <!-- 结束状态不能点击上传课件 -->
                <div class="cursor-pointer clickable"
                  v-if="isShowUploadCourse(item)"
                  @click.stop="uploadCourse(item)">
                  上传课件
                </div>
                <div style="cursor: auto;"
                  v-if="!isShowUploadCourse(item)"
                  @click.stop>
                  上传课件
                </div>
                <div class="train-card-bottom-line">
                  |
                </div>
                <div class="cursor-pointer clickable"
                  @click.stop="downloadCourse(item)">
                  下载报名单
                </div>
              </div>

              <div class="train-card-bottom"
                v-if="item.status === '0'">
                <div class="cursor-pointer clickable extend-click"
                  @click.stop="publishCourse(item.id)">
                  发布
                </div>
                <div class="train-card-bottom-line">
                  |
                </div>
                <div class="cursor-pointer clickable extend-click"
                  @click.stop="editCourse(item.id)">
                  修改
                </div>
                <div class="train-card-bottom-line">
                  |
                </div>
                <div class="cursor-pointer clickable extend-click"
                  @click.stop="deleteCourse(item.id)">
                  删除
                </div>
              </div>
            </train-card>

          </el-card>
        </el-col>
      </el-row>

      <train-pagination :pageNo="trainCreateManage.pageNo"
        :pageSize="trainCreateManage.pageSize"
        :total="trainCreateManageObj.totalCount"
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
import dayjs from 'dayjs';

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
      trainCreateManage: ({ train }) => train.trainCreateManage,
      trainCreateManageObj: ({ train }) => train.trainCreateManageObj,
    })
  },
  beforeMount() {
    this.query();
  },
  methods: {
    isShowUploadCourse(item) {
      // 结束时间超过一个月不展示“上传课件”按钮
      let trainEndDate = dayjs(item.trainEndDate).add(1, 'month').toDate().getTime();
      let currentTime = new Date(item.currentTime).getTime();
      let isPassOneMonth = currentTime > trainEndDate;
      return !(item.statusBranch === '3' && isPassOneMonth);
    },

    listSlice(index) {
      return this.trainCreateManageObj.list.slice(3 * index, 3 * index + 3);
    },

    pushDetail(item) {
      this.$router.push(`/train/create-management/detail/${item.id}`);
    },

    handleCreate() {
      this.$router.push('/train/create-management/create');
    },

    uploadCourse(item) {
      this.$router.push(`/train/create-management/detail/${item.id}?isUploadCourseware=1`);
    },

    downloadCourse(item) {
      this.trainDownloadCourse({
        trainId: item.id,
        trainTheme: item.trainTheme
      });
    },

    publishCourse(id) {
      this.$confirm('您确定要发布？', ' ', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.trainPublishCourse({ id }).then(() => {
          this.$message({
            type: 'success',
            message: '发布成功！'
          });
          this.query();
        });
      }).catch(() => {
        this.$message('已取消发布');
      });
    },

    editCourse(id) {
      this.$router.push(`/train/create-management/edit/${id}`);
    },

    deleteCourse(id) {
      this.$confirm('您确定要删除？', ' ', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.trainDeleteCourse({ id }).then(() => {
          this.$message({
            type: 'success',
            message: '您已成功删除！'
          });
          this.query();
        });
      }).catch(() => {
        this.$message('已取消删除');
      });
    },

    query() {
      this.isNotPageChange && this.pageChange({ pageNo: 1 });
      let params = Object.cloneDeep(this.trainCreateManage);

      if (params.date.length) {
        params.trainStartDate = params.date[0];
        params.trainEndDate = params.date[1];
        delete params.date;
      }
      this.trainGetCreateManage(params);
    },

    async onPagination(value) {
      console.log(value);
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
      'trainGetCreateManage',
      'trainPublishCourse',
      'trainDeleteCourse',
      'trainDownloadCourse',
    ]),

    ...mapMutations({
      pageChange: 'TRAIN_CM_PAGE_CHANGE'
    })
  }
};
</script>
