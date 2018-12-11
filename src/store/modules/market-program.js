import * as types from '@/store/types';
import {
  PAGE_NO,
  PAGE_SIZE
} from '@/config/index.js';
const createActivityForm = {
  programmeName: '',
  date: [],
  programmePurpose: '',
  programmeReport: '',
  programmeStartTime: '',
  programmeEndTime: '',
  particularDocId: '',
  csDocId: '',
  incomeCalculationDocId: '',
  programmeStatus: '',
  particularDocName: '',
  csDocName: '',
  incomeCalculationDocName: '',
};
const detailRateForm = {
  programmeId: '',
  score: '',
  weightedScore: '',
  comment: ''
};
const state = {
  selectRegionTree: [],
  activityList: [],
  activityForm: {
    minScore: '',
    maxScore: '',
    creatorName: '',
    region: '',
    programmeName: '',
    programmeStatus: '',
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE
  },
  rateTaskList: [],
  rateTaskForm: {
    minScore: '',
    maxScore: '',
    creatorName: '',
    region: '',
    programmeName: '',
    businessStatus: '1',
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE
  },
  activityDetail: {
    programmeName: '',
    programmeStartTime: '',
    programmeEndTime: '',
    programmePurpose: '',
    programmeReport: '',
    particularDocId: '',
    particularDocList: [],
    csDocId: '',
    csDocList: [],
    incomeCalculationDocId: '',
    incomeCalculationDocList: [],
    averageScore: '',
    programmeStatus: '',
    bizScoreDetailDtoList: []
  },
  createActivityForm: Object.cloneDeep(createActivityForm),
  detailRateForm: Object.cloneDeep(detailRateForm),
};

const mutations = {
  [types.CREATE_ACTIVITY_FORM](state, data) {
    state.createActivityForm = Object.cloneDeep(createActivityForm);
  },

  [types.SUBMIT_RATE_ACTIVITY_FORM](state, data) {
    state.detailRateForm = Object.cloneDeep(detailRateForm);
  },

  [types.ACTIVITY_LIST](state, data) {
    state.activityList = data;
  },

  [types.MARKET_ACTIVITY_PAGE_CHANGE](state, data) {
    state.activityForm = data
      ? Object.assign(state.activityForm, data)
      : Object.assign(state.activityForm, {
        pageNo: PAGE_NO,
        pageSize: PAGE_SIZE
      });
  },
  [types.MARKET_ACTIVITY_TASK_PAGE_CHANGE](state, data) {
    state.rateTaskForm = data
      ? Object.assign(state.rateTaskForm, data)
      : Object.assign(state.rateTaskForm, {
        pageNo: PAGE_NO,
        pageSize: PAGE_SIZE
      });
  },

  [types.MARKET_ACTIVITY_GEY_DETAIL](state, data) {
    const isExist = value => value && value.length;

    if (isExist(data.particularDocList)) {
      data.particularDocName = data.particularDocList[0].fileName;
    }
    if (isExist(data.csDocList)) {
      data.csDocName = data.csDocList[0].fileName;
    }
    if (isExist(data.incomeCalculationDocList)) {
      data.incomeCalculationDocName = data.incomeCalculationDocList[0].fileName;
    }

    data.date = [data.programmeStartTime, data.programmeEndTime];
    state.createActivityForm = data;
  },

  [types.ACTIVITY_DETAIL](state, data) {
    state.activityDetail = data;
    const bizScoreDetailDtoList = [];
    for (const score of state.activityDetail.bizScoreDetailDtoList) {
      if (score.scoreId) {
        bizScoreDetailDtoList.push(score);
      }
    }
    state.activityDetail.bizScoreDetailDtoList = bizScoreDetailDtoList;
  },

  [types.ACTIVITY_RATE_LIST](state, data) {
    state.rateTaskList = data;
  },

  [types.ACTIVITY_SELECT_REGION_TREE](state, data) {
    // 需要将用户归属改造成v-model识别的数据类型
    let handlers = data.map(val => {
      let newVal = {};
      newVal.value = val.codeValue;
      newVal.label = val.codeName;
      newVal.children = val.childrenList && val.childrenList.map(cval => {
        let newCval = {};
        newCval.value = cval.codeValue;
        newCval.label = cval.codeName;
        return newCval;
      });
      return newVal;
    });
    state.selectRegionTree = handlers;
  },

  [types.CREATE_ACTIVITY_VALUE_UPDATE](state, data) {
    state.createActivityForm = Object.assign({}, state.createActivityForm, data);
  },

};

export default {
  state,
  mutations
};
