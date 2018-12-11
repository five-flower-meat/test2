<template>
  <div>
    <div class="m-container">
      <el-form class="form-manage" ref="activityRef" :rules="activityRules" :model="activityForm">
        <div class="flex">
          <el-form-item prop="score">
            <el-form-item class="rate-act-select">
              <el-select v-model="activityForm.minScore" placeholder="评分区间" clearable @change="validateDate">
                <el-option v-for="item in 5" :key="item" :label="item" :value="item" />
                <el-option :label="'5+'" :value="5.01" />
              </el-select>
            </el-form-item>
            <div class="form-input-sep">-</div>
            <el-form-item prop="maxScore" class="rate-act-select">
              <el-select v-model="activityForm.maxScore" placeholder="评分区间" clearable @change="validateDate">
                <el-option v-for="item in 5" :key="item" :label="item" :value="item" />
                <el-option :label="'5+'" :value="5.01" />
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item class="form-query-input-width form-left-width">
            <el-input v-model="activityForm.creatorName" placeholder="上传人" clearable />
          </el-form-item>
          <el-form-item prop="region" class="form-query-input-width form-left-width">
            <el-cascader expand-trigger="hover" :options="selectRegionTree" v-model="activityForm.region" placeholder="方案归属" clearable>
            </el-cascader>
          </el-form-item>
          <el-form-item class="form-query-input-width form-left-width">
            <el-input v-model="activityForm.programmeName" placeholder="方案名称" clearable></el-input>
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item class="form-left-width">
            <el-button type="primary" @click="query">查询</el-button>
          </el-form-item>
          <el-form-item class="form-left-width">
            <el-button class="el-button--have-icon" icon="el-icon-plus" @click="redirectCreate">新增营销方案</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-tabs v-model="activityForm.programmeStatus" @tab-click="tabChange">
        <el-tab-pane label="全部"></el-tab-pane>
        <el-tab-pane label="待评分" :name="'2'"></el-tab-pane>
        <el-tab-pane label="评分中" :name="'3'"></el-tab-pane>
        <el-tab-pane label="已评级" :name="'4'"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="m-container table-container">
      <!--方案编号 方案名称 方案归属 上传人 上传时间 状态 评分 操作-->
      <wm-table :source="activityList.list" :pageNo="activityForm.pageNo" :pageSize="activityForm.pageSize" :total="activityList.totalCount" @onPagination="onPagination" @onSizePagination="onSizePagination">
        <el-table-column label="方案编号" show-overflow-tooltip property="programmeCode" />
        <el-table-column label="方案名称" show-overflow-tooltip property="programmeName" />
        <el-table-column label="方案归属" show-overflow-tooltip property="regionName" />
        <el-table-column label="上传人" show-overflow-tooltip property="creatorName" />
        <el-table-column label="上传时间" show-overflow-tooltip property="createDate" />
        <el-table-column label="状态" show-overflow-tooltip property="programmeStatusName" />
        <el-table-column label="评分" show-overflow-tooltip property="averageScore" width="150px">
          <template slot-scope="scope">
            <div v-if="scope.row.programmeStatus === '1' || scope.row.programmeStatus === '2'">
              <span>-</span>
            </div>
            <div v-else>
              <span class="demonstration">{{scope.row.scoreNumber}}人评分</span>
              <el-rate v-model="scope.row.averageScore" disabled show-score text-color="#ff9900">
              </el-rate>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="table-button" @click="redirectDetail(scope.row.programmeId)">详情</el-button>
            <el-button type="text" v-if="operatorId === scope.row.creator && (scope.row.programmeStatus === '1' || scope.row.programmeStatus === '2')" class="table-button" @click="redirectEdit(scope.row.programmeId)">修改</el-button>
          </template>
        </el-table-column>
      </wm-table>
    </div>

  </div>
</template>

<script>
import WmTable from 'components/Table.vue';
import { mapActions, mapState, mapMutations } from 'vuex';
import { numberCompare } from '@/utils/rules.js';
export default {
  components: {
    WmTable
  },
  data() {
    const scoreCompare = (rule, value, callback) => {
      numberCompare(this.activityForm.minScore, this.activityForm.maxScore, callback);
    };
    return {
      isNotPageChange: false,
      activityRules: {
        score: [
          { validator: scoreCompare, trigger: 'change' },
        ]
      }
    };
  },
  computed: {
    ...mapState({
      activityList: ({ marketProgram }) => marketProgram.activityList,
      activityForm: ({ marketProgram }) => marketProgram.activityForm,
      selectRegionTree: ({ marketProgram }) => marketProgram.selectRegionTree,
      operatorId: ({ root }) => root.operatorId,
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
      this.$refs.activityRef.validateField('score');
    },

    tabChange() {
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

    query() {
      this.activityForm.pageNo = this.isNotPageChange ? 1 : this.activityForm.pageNo;
      const params = Object.cloneDeep(this.activityForm);
      let { date, ..._params } = params;
      this.$refs.activityRef.validate(valid => {
        if (!valid) return false;

        if (_params.region.length > 0) {
          _params.region = _params.region[1];
        } else {
          _params.region = null;
        }

        if (_params.programmeStatus === '0') {
          _params.programmeStatus = '';
        }

        return this.marketGetActivityList(_params);
      });
    },

    redirectCreate() {
      this.$router.push(`/market-program/rate-activity/create`);
    },

    redirectDetail(id) {
      this.$router.push(`/market-program/rate-activity/detail/1/${id}`);
    },

    redirectEdit(id) {
      this.$router.push(`/market-program/rate-activity/edit/${id}`);
    },

    ...mapMutations({
      pageChange: 'MARKET_ACTIVITY_PAGE_CHANGE',
    }),

    ...mapActions([
      'marketGetActivityList',
      'queryRegionTree'
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
