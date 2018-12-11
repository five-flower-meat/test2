import * as types from '../types';
import {PAGE_NO, PAGE_SIZE} from '@/config';

const state = {
  regionData: {
    regionList: [],
    processorList: [],
    processor: []
  },
  downloadForm: {
    startDate: '',
    endDate: '',
    name: '',
    extractBusinessStatus: null,
    status: 100,
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE,
    timeRange: ''
  },
  dataDownloadList: [],
  dataSteps: [],
  dataDetailList: {},
  auditForm: {
    startDate: '',
    endDate: '',
    staffName: '',
    name: '',
    taskHasComplete: 0,
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE,
    timeRange: ''
  },
  dataAuditList: {},
  dataTaskList: [],
  processorList: [],
  provinceList: null
};

const mutations = {
  [types.DATA_EXTRACTION_DOWMLOAD](state, data) {
    state.dataDownloadList = data;
  },
  [types.DATA_EXTRACTION_STEPS](state, data) {
    state.dataSteps = data;
  },
  [types.DATA_EXTRACTION_DETAIL_DATA](state, data) {
    state.dataDetailList = data;
  },
  [types.DATA_EXTRACTION_AUDIT](state, data) {
    state.dataAuditList = data;
  },
  [types.DATA_EXTRACTION_TASK](state, data) {
    state.dataTaskList = data;
  },
  [types.PROCESSOR_LIST](state, data) {
    let handlers = data.map(val => {
      let newVal = {};
      if (val.region) {
        newVal.value = val.region;
        newVal.label = val.regionName;
        newVal.children = val.province && val.province.filter(cval => cval.province).map(cval => {
          let newCval = {};
          newCval.value = cval.province;
          newCval.label = cval.provinceName;
          return newCval;
        });
      } else {
        newVal.value = val.province;
        newVal.label = val.provinceName;
      }
      return newVal;
    });
    if (data[0].region) {
      state.processorList = handlers;
    } else {
      state.provinceList = data[0].province;
    }
  }
};

export default {
  state,
  mutations
};
