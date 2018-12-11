<template>
  <div>
    <div class="m-container">
      <el-form class="form-manage" :model="rateTaskForm" ref="rateTaskRef" :rules="rateRules">
        <div class="flex">
          <el-form-item prop="score">
            <el-form-item prop="minScore" class="rate-act-select">
              <el-select v-model="rateTaskForm.minScore" placeholder="评分区间" clearable @change="validateDate">
                <el-option v-for="item in 5" :key="item" :label="item" :value="item" />
                <el-option :label="'5+'" :value="5.01" />
              </el-select>
            </el-form-item>
            <div class="form-input-sep">-</div>
            <el-form-item prop="maxScore" class="rate-act-select">
              <el-select v-model="rateTaskForm.maxScore" placeholder="评分区间" clearable @change="validateDate">
                <el-option v-for="item in 5" :key="item" :label="item" :value="item" />
                <el-option :label="'5+'" :value="5.01" />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item class="form-query-input-width form-left-width">
            <el-input v-model="rateTaskForm.creatorName" placeholder="上传人" clearable></el-input>
          </el-form-item>
          <el-form-item prop="region" class="form-query-input-width form-left-width">
            <el-cascader style="width: 160px;" expand-trigger="hover" :options="selectRegionTree" v-model="rateTaskForm.region" placeholder="方案归属" clearable>
            </el-cascader>
          </el-form-item>
          <el-form-item class="form-query-input-width form-left-width">
            <el-input v-model="rateTaskForm.programmeName" placeholder="方案名称" clearable></el-input>
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-tabs v-model="rateTaskForm.businessStatus" @tab-click="tabChange">
        <el-tab-pane label="待评分" :name="'1'"></el-tab-pane>
        <el-tab-pane label="已评分" :name="'2'"></el-tab-pane>
        <el-tab-pane label="已评级" :name="'4'"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="m-container table-container">
      <!--方案编号 方案名称 方案归属 上传人 上传时间 状态 评分 操作-->
      <wm-table :source="rateTaskList.list" :pageNo="rateTaskForm.pageNo" :pageSize="rateTaskForm.pageSize" :total="rateTaskList.totalCount" @onPagination="onPagination" @onSizePagination="onSizePagination">
        <el-table-column label="方案编号" show-overflow-tooltip property="programmeCode"></el-table-column>
        <el-table-column label="方案名称" show-overflow-tooltip property="programmeName"></el-table-column>
        <el-table-column label="方案归属" show-overflow-tooltip property="regionName"></el-table-column>
        <el-table-column label="上传人" show-overflow-tooltip property="creatorName"></el-table-column>
        <el-table-column label="上传时间" show-overflow-tooltip property="createDate"></el-table-column>
        <el-table-column label="评级" show-overflow-tooltip property="averageScore" width="150px">
          <template slot-scope="scope">
            <span class="demonstration">{{scope.row.scoreNumber}}人评分</span>
            <el-rate v-model="scope.row.averageScore" disabled show-score text-color="#ff9900">
            </el-rate>
          </template>
        </el-table-column>
        <el-table-column v-if="rateTaskForm.businessStatus === '2'" label="我的评分" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.score}}分{{scope.row.weightedScore?'+'+scope.row.weightedScore+'分':''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div v-if="rateTaskForm.businessStatus === '1'">
              <el-button type="text" class="table-button" @click="handleRate(scope.row)">评分</el-button>
              <el-button type="text" class="table-button" @click="handleCloseRate(scope.row.programmeId)">关闭评分</el-button>
            </div>
            <div v-else-if="rateTaskForm.businessStatus === '2'">
              <el-button type="text" class="table-button" @click="handleDetail(scope.row)">
                详情
              </el-button>
              <el-button v-if="scope.row.programmeStatus !== '4'" type="text " class="table-button " @click="handleCloseRate(scope.row.programmeId) ">
                关闭评分</el-button>
            </div>
            <div v-else>
              <el-button type="text " class="table-button " @click="handleDetail(scope.row) ">
                详情
              </el-button>
            </div>
          </template>
        </el-table-column>
      </wm-table>
    </div>
  </div>
</template>

<script>
import WmTable from 'components/Table.vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import { numberCompare } from '@/utils/rules.js';

export default {
  components: {
    WmTable
  },
  data() {
    const scoreCompare = (rule, value, callback) => {
      numberCompare(this.rateTaskForm.minScore, this.rateTaskForm.maxScore, callback);
    };
    return {
      isNotPageChange: false,
      rateRules: {
        score: [
          { validator: scoreCompare, trigger: 'change' },
        ]
      }
    };
  },
  computed: {
    ...mapState({
      rateTaskList: ({ marketProgram }) => marketProgram.rateTaskList,
      rateTaskForm: ({ marketProgram }) => marketProgram.rateTaskForm,
      selectRegionTree: ({ marketProgram }) => marketProgram.selectRegionTree
    })
  },
  beforeMount() {
    this.queryRegionTree({
      'selectName': 'headOfficeAndRegion',
      'onlyOperator': 2
    });
    this.$nextTick(() => {
      this.query();
    });
  },
  methods: {
    validateDate() {
      this.$refs.rateTaskRef.validateField('score');
    },

    tabChange(val) {
      this.pageChange();
      this.query();
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
    // 详情
    handleDetail(row) {
      const path = `/market-program/rate-task/detail/3/${row.programmeId}?taskInsId=${row.taskInsId}&businessStatus=${this.rateTaskForm.businessStatus}`;
      this.$router.push(path);
    },
    // 评分
    handleRate(row) {
      const path = `/market-program/rate-task/detail/2/${row.programmeId}?taskInsId=${row.taskInsId}`;
      this.$router.push(path);
    },
    // 关闭评分
    handleCloseRate(programmeId) {
      this.$confirm('您确定要关闭评级？', ' ', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.closeRate({ programmeId }).then(() => {
          this.$message({
            type: 'success',
            message: '您已成功关闭评级！'
          });
          this.query();
        });
      }).catch(() => {
        this.$message('已取消关闭评级');
      });
      // const params = {};
      // params.programmeId = row.programmeId;
      // this.closeRate(params);
      // this.query();
    },
    query() {
      this.rateTaskForm.pageNo = this.isNotPageChange ? 1 : this.rateTaskForm.pageNo;
      const params = Object.cloneDeep(this.rateTaskForm);
      let { date, ..._params } = params;
      this.$refs.rateTaskRef.validate(valid => {
        if (!valid) return false;

        if (_params.region.length > 0) {
          _params.region = _params.region[1];
        } else {
          _params.region = null;
        }

        if (this.rateTaskForm.businessStatus === '4') {
          _params.programmeStatus = '4';
          delete _params.businessStatus;
          return this.queryRateTaskOfActivityList(_params);
        }

        return this.queryRateTaskList(_params);
      });
    },
    ...mapMutations({
      pageChange: 'MARKET_ACTIVITY_TASK_PAGE_CHANGE',
    }),
    ...mapActions([
      'queryRateTaskList',
      'closeRate',
      'queryRegionTree',
      'queryRateTaskOfActivityList'
    ])
  }
};
</script>

<style>
.rate-act-select {
  width: 120px;
  display: inline-block;
}
</style>
