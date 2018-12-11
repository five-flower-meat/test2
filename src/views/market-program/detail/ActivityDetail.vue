<template>
  <div>
    <div class="m-container">
      <div class="breadcrumb">
        <el-breadcrumb v-if="$route.params.type == 1">
          <el-breadcrumb-item :to="{ path: '/market-program/rate-activity' }">活动评级管理</el-breadcrumb-item>
          <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-breadcrumb v-else-if="$route.params.type == 2">
          <el-breadcrumb-item :to="{ path: '/market-program/rate-task' }">评级任务</el-breadcrumb-item>
          <el-breadcrumb-item>评分</el-breadcrumb-item>
        </el-breadcrumb>
        <el-breadcrumb v-else-if="$route.params.type == 3">
          <el-breadcrumb-item :to="{ path: '/market-program/rate-task' }">评级任务</el-breadcrumb-item>
          <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="m-container" style="margin-top:16px">
      <div class="task-detail-content">
        <div>
          <div class="task-detail-item">
            <div class="left">方案名称</div>
            <div class="right">{{activityDetail.programmeName}}</div>
          </div>
          <div class="task-detail-item">
            <div class="left">方案实施时间</div>
            <div class="right">{{activityDetail.programmeStartTime+"-"+activityDetail.programmeEndTime}}</div>
          </div>
          <div class="task-detail-item">
            <div class="left">方案实施目的</div>
            <div class="right">{{activityDetail.programmePurpose}}</div>
          </div>
          <div class="task-detail-item">
            <div class="left">方案总结</div>
            <div class="right">{{activityDetail.programmeReport}}</div>
          </div>
          <div class="task-detail-item">
            <div class="left">方案具体文档</div>
            <div class="right">
              <es-download v-if="activityDetail.particularDocList && activityDetail.particularDocList.length" :fileObj="activityDetail.particularDocList[0]" :isPDF="true" />
              <!-- <span v-for="item in activityDetail.particularDocList" :key="item" class="blue download" @click="downloadFile(item)">{{item.fileName}}</span> -->
            </div>
          </div>
          <div class="task-detail-item">
            <div class="left">方案客户文档</div>
            <div class="right">
              <es-download v-if="activityDetail.csDocList && activityDetail.csDocList.length" :fileObj="activityDetail.csDocList[0]" :isPDF="true" />
              <!-- <span v-for="item in activityDetail.csDocList" :key="item" class="blue download" @click="downloadFile(item)">{{item.fileName}}</span> -->
            </div>
          </div>
          <div class="task-detail-item">
            <div class="left">方案收益预算文档</div>
            <div class="right">
              <es-download v-if="activityDetail.incomeCalculationDocList && activityDetail.incomeCalculationDocList.length" :fileObj="activityDetail.incomeCalculationDocList[0]" :isPDF="true" />
              <!-- <span v-for="item in activityDetail.incomeCalculationDocList" :key="item" class="blue download" @click="downloadFile(item)">{{item.fileName}}</span> -->
            </div>
          </div>
          <div class="task-detail-item" style="align-items: center;">
            <div class="left">评分情况</div>
            <div class="right">
              <el-rate v-model="activityDetail.averageScore" disabled show-score text-color="#ff9900" style="display: inline !important;margin-right:10px;">
              </el-rate>
              <span style="margin-right:8px;">{{activityDetail.bizScoreDetailDtoList.length}}人评分</span>
              <el-button v-if="$route.params.type == 1 || $route.query.businessStatus=== '4'" type="text" class="table-button" @click.stop="isShow">
                查看详情
                <i class="el-icon el-icon-arrow-down" :class="open === 'true' ? 'el-icon-arrow-up' : ''"></i>
              </el-button>
            </div>
          </div>
          <div class="task-detail-item">
            <div class="left"></div>
            <div class="rateBG" v-if="open === 'true'">
              <div v-for="(item, index) in activityDetail.bizScoreDetailDtoList" :key="item" style="padding:10px 0px;">
                <span>评论员{{(index+1)}}</span>
                <el-rate class="inline" v-model="item.totalScore" disabled show-score text-color="#ff9900"> </el-rate>
                <span style="display:block;">{{item.comment}}</span>
              </div>
            </div>
          </div>
          <div>
            <div class="myRateDetail" v-if="$route.params.type == 3 &&  $route.query.businessStatus=== '2'" v-for="item in activityDetail.bizScoreDetailDtoList" :key="item" style="padding:5px 0px;">
              <div class="task-detail-item">
                <div class="left">您的评分</div>
                <div class="right">
                  <el-rate v-model="item.score" disabled show-score text-color="#ff9900"> </el-rate>
                </div>
              </div>
              <div class="task-detail-item">
                <div class="left">加权分</div>
                <div class="right">
                  <div v-if="isShowWeightedScore()">
                    <el-rate v-model="item.weightedScore" disabled show-score text-color="#ff9900"> </el-rate>
                  </div>
                  <div v-else>
                    <span>-</span>
                  </div>
                </div>
              </div>
              <div class="task-detail-item">
                <div class="left">点评</div>
                <div class="right">
                  {{item.comment}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$route.params.type === '2'" class="m-container" style="margin-top:16px">
      <div class="rateForm">
        <el-form ref="rateScoreRef" :rules="rateScoreRules" :model="detailRateForm">
          <div class="flex">
            <el-form-item class="rateScore" prop="score">
              <span class="demonstration form-required">您的评分</span>
              <el-rate v-model="detailRateForm.score" show-score @change="rateChange" text-color="#ff9900">
              </el-rate>
            </el-form-item>
            <el-form-item v-if="isShowWeightedScore()">
              <span class="demonstration">加权评分(非必填)</span>
              <el-rate v-model="detailRateForm.weightedScore" show-score text-color="#ff9900">
              </el-rate>
            </el-form-item>
          </div>
          <el-form-item style="width:800px;" prop="comment">
            <span class="demonstration">点评</span>
            <el-input type="textarea" :rows="3" placeholder="请输入点评..." v-model="detailRateForm.comment">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
            <form-cancel path="/market-program/rate-task" />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import WmTable from 'components/Table.vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import {
  ADMIN_ROLES
} from '@/config/index.js';
import { textareaMaxLimit } from '@/utils/rules.js';
import EsDownload from 'components/Download.vue';

export default {
  components: {
    WmTable,
    EsDownload,
  },
  data() {
    const scoreRequiredCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请您选择评分'));
      } else {
        callback();
      }
    };
    return {
      open: false,
      adminRole: ADMIN_ROLES,
      rateScoreRules: {
        score: [
          { validator: scoreRequiredCheck, trigger: 'change' },
        ],
        comment: [
          { validator: textareaMaxLimit, trigger: 'blur' },
        ]
      }
    };
  },
  computed: {
    ...mapState({
      activityDetail: ({ marketProgram }) => marketProgram.activityDetail,
      detailRateForm: ({ marketProgram }) => marketProgram.detailRateForm,
      currentUserRoleList: ({ root }) => root.currentUserRoleList,
    })
  },
  beforeMount() {
    this.clearForm();
    this.detailRateForm.programmeId = this.$route.params.id;
    this.query();
  },
  beforeDestroy() {
    // 组件注销的时候，需要清空表单数据
    this.clearForm();
  },
  methods: {
    rateChange() {
      this.$refs.rateScoreRef.validateField('score');
    },

    query() {
      const param = {};
      param.programmeId = this.$route.params.id;
      if (this.$route.params.type === '1') {
        this.queryActivityDetail(param);
        return;
      }
      if (this.$route.query.businessStatus === '2') {
        this.activityScorerDetail(param);
        return;
      }
      this.queryActivityDetail(param);

      const bizScoreDetailDtoList = [];
      for (const score of this.activityDetail.bizScoreDetailDtoList) {
        if (score.scoreId) {
          bizScoreDetailDtoList.push(score);
        }
      }
      this.activityDetail.bizScoreDetailDtoList = bizScoreDetailDtoList;
    },
    downloadFile(res) {
      this.rateDownloadFile({
        fileTypeId: res.fileTypeId,
        fileSaveName: res.fileSaveName,
        fileName: res.fileName
      });
    },
    submitForm() {
      let params = Object.cloneDeep(this.detailRateForm);
      params.programmeId = this.activityDetail.programmeId;
      params.taskInsId = this.$route.query.taskInsId;

      // 转换加权分为null
      if (params.weightedScore === 0) {
        params.weightedScore = null;
      }
      this.$refs.rateScoreRef.validate(valid => {
        if (!valid) return false;

        this.submitRate(params);
      });
    },
    isShow() {
      this.open = this.open === 'true' ? 'false' : 'true';
    },
    isShowWeightedScore() {
      for (const role of this.currentUserRoleList) {
        if (this.adminRole.indexOf(role.roleId) >= 0) {
          return true;
        }
      }
      return false;
    },
    ...mapMutations({
      clearForm: 'SUBMIT_RATE_ACTIVITY_FORM',
    }),
    ...mapActions([
      'rateDownloadFile',
      'queryActivityDetail',
      'activityScorerDetail',
      'submitRate'
    ])
  }
};
</script>

<style lang="scss" scoped>
@import "scss/variables.scss";
.download {
  margin-right: 20px;
  cursor: pointer;
}
.left {
  width: 120px;
}
.inline {
  display: inline !important;
  margin-left: 10px;
}
.rateScore {
  margin-right: 180px;
}
.rateForm {
  margin-left: 10px;
}
.rateBG {
  width: 250px;
  text-align: left;
  flex-wrap: wrap;
  word-break: break-all;
  background-color: #fafafa;
  padding: 20px;
}
.myRateDetail {
  width: 600px;
  text-align: left;
  flex-wrap: wrap;
  word-break: break-all;
  background-color: #fafafa;
  padding: 20px 0px;
}
</style>
