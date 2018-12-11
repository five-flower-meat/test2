import * as types from '../types';
import {
  PAGE_NO,
  PAGE_SIZE
} from '@/config/index.js';
import { findValueIndex } from '@/utils/common.js';

// const timetableDateDtoObj = {
//   timetableDate: '',
//   timetableTopicDtoList: []
// };

const trainCreate = {
  trainTheme: '',
  trainDate: '', // 最终映射到trainStartDate，trainEndDate
  trainStartDate: '',
  trainEndDate: '',
  registerDate: '',
  addressSubcompany: '',
  addressDetail: '',
  trainGoal: '',
  rosterFileInputId: '',
  fileName: '',
  elecInst: [],
  isPublish: 0, // 0 为草稿，1为发布
  timetableDateDtoList: []
};

const timetableTopicDtoObj = {
  topic: [],
  timetableDtoList: [],
};

const timetableDtoObj = {
  date: '',
  startTime: '',
  endTime: '',
  trainer: '',
  title: '',
  fileInputId: '',
  fileName: '',
  elecInstList: [],
};

const trainDetail = {
  trainTheme: '',
  trainGoal: '',
  trainStartDate: '',
  trainEndDate: '',
  addressSubcompany: '',
  addressDetail: '',
  registerPopulation: null,
  registerDate: '',
  toDeadLine: '',
  timetableDateDtoList: [],
  elecInst: [],
};

const state = {
  cItemObj: {},
  gItemObj: {},
  isNormalizeTime: false, // 培训时间是否被修改
  createOriginDate: [], // 保存上一步时间，判断时间是否被修改
  trainCreate: Object.cloneDeep(trainCreate),
  trainDetail: Object.cloneDeep(trainDetail),
  trainCreateManage: {
    date: '',
    trainStartDate: '',
    trainEndDate: '',
    trainTheme: '',
    trainStatus: null,
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE,
    // total: 0,
  },
  trainCreateManageObj: {
    list: [],
    totalCount: 1,
  },

  trainApplyCenterForm: {
    date: '',
    trainStartDate: '',
    trainEndDate: '',
    trainTheme: '',
    trainStatus: null,
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE,
    onlyMyTrain: false,
  },
  trainApplyCenterObj: {
    list: [],
    totalCount: 1,
  },

  trainMyForm: {
    date: '',
    trainStartDate: '',
    trainEndDate: '',
    trainTheme: '',
    trainStatus: null,
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE,
    onlyMyTrain: true,
  },
  trainMyObj: {
    list: [],
    totalCount: 1,
  },
};

const mutations = {
  [types.TRAIN_CM_PAGE_CHANGE](state, data) {
    state.trainCreateManage = data
      ? Object.assign(state.trainCreateManage, data)
      : Object.assign(state.trainCreateManage, {
        pageNo: PAGE_NO,
        pageSize: PAGE_SIZE
      });
  },

  [types.TRAIN_GET_CREATE_MANAGE](state, data) {
    state.trainCreateManageObj = Object.assign(state.trainCreateManageObj, data);
  },

  [types.TRAIN_CREATE_ADD_LINE](state, data) {
    console.log(state.trainCreate);
    state.trainCreate.timetableDateDtoList = state.trainCreate.timetableDateDtoList.map(val => {
      if (val.timetableDate === data) {
        // 时间赋值
        let cLen = Object.keys(state.cItemObj).length;
        state.cItemObj[cLen] = data;
        let gLen = Object.keys(state.gItemObj).length;
        state.gItemObj[gLen] = data;

        val.timetableTopicDtoList.push(addLine());
      }
      return val;
    });
  },

  [types.TRAIN_CREATE_MINUS_LINE](state, data) {
    let timeListFilter = state.trainCreate.timetableDateDtoList.filter(val => val.timetableDate === data.time);

    // 删除队列里的时间
    state.cItemObj = resetSort(Object.assign({}, state.cItemObj), data.index, data.time);
    timeListFilter[0].timetableTopicDtoList.forEach(val => {
      val.timetableDtoList.forEach((cVal, ci) => {
        state.gItemObj = resetSort(Object.assign({}, state.gItemObj), ci, data.time);
      });
    });

    timeListFilter[0].timetableTopicDtoList.splice(data.index, 1);
  },

  [types.TRAIN_ADD_TIME_OBJ](state, data) {
    state.trainCreate.timetableDateDtoList = data.map((val, i) => {
      // 时间赋值
      let cLen = Object.keys(state.cItemObj).length;
      state.cItemObj[cLen] = val;
      let gLen = Object.keys(state.gItemObj).length;
      state.gItemObj[gLen] = val;
      // console.log(state.gItemObj);

      return {
        timetableDate: val,
        timetableTopicDtoList: [addLine()]
      };
    });
  },

  [types.TRAIN_CREATE_ADD_ITEM](state, data) {
    let timeListFilter = state.trainCreate.timetableDateDtoList.filter(val => val.timetableDate === data.time);
    // 时间赋值
    let gLen = Object.keys(state.gItemObj).length;
    state.gItemObj[gLen] = data.time;

    timeListFilter[0].timetableTopicDtoList[data.index].timetableDtoList = timeListFilter[0].timetableTopicDtoList[data.index].timetableDtoList.concat(addItem());
  },

  [types.TRAIN_CREATE_UPDATE_ITEM](state, data) {
    state.trainCreate = Object.assign(state.trainCreate, data);
  },

  [types.TRAIN_CREATE_REDUCE_ITEM](state, data) {
    let timeListFilter = state.trainCreate.timetableDateDtoList.filter(val => val.timetableDate === data.time);

    // 删除队列内容
    state.gItemObj = resetSort(Object.assign({}, state.gItemObj), data.childIndex, data.time);

    timeListFilter[0].timetableTopicDtoList[data.index].timetableDtoList.splice(data.childIndex, 1);
  },

  [types.TRAIN_IMPORT_EXCEL](state, data) {
    // 时间转换
    data.forEach(val => {
      val.timetableTopicDtoList.forEach(cVal => {
        cVal.timetableDtoList.forEach(gVal => {
          gVal.date = [gVal.startTime, gVal.endTime];
        });
      });
    });
    state.trainCreate.timetableDateDtoList = data;
  },

  [types.TRAIN_GET_DETAIL](state, data) {
    // 往数据里添加文件标记
    data.timetableDateDtoList.forEach(val => {
      val.timetableTopicDtoList.forEach(cVal => {
        cVal.timetableDtoList.forEach(gVal => {
          gVal.isUpdatedFlag = false;
          gVal.fileInputId = gVal.fileInputId || '';
        });
      });
    });
    state.trainDetail = Object.cloneDeep(data);
  },

  [types.TRAIN_CLEAR_CREATE](state, data) {
    state.trainCreate = Object.cloneDeep(trainCreate);
    // 重置培训时间的判断值
    state.isNormalizeTime = false;
  },

  // 修改获取api数据
  [types.TRAIN_GET_EDIT](state, data) {
    // 转换时间格式
    data.trainDate = [data.trainStartDate, data.trainEndDate];
    if (data.elecInst && data.elecInst.length) {
      data.fileName = data.elecInst[0].fileName;
    }
    // console.log(data);
    data.timetableDateDtoList.forEach(val => {
      val.timetableTopicDtoList.forEach(cVal => {
        // 时间赋值
        let cLen = Object.keys(state.cItemObj).length;
        state.cItemObj[cLen] = val;

        cVal.timetableDtoList.forEach(gVal => {
          // 时间赋值
          let gLen = Object.keys(state.gItemObj).length;
          state.gItemObj[gLen] = val;
          if (gVal.elecInstList && gVal.elecInstList.length) {
            gVal.fileName = gVal.elecInstList[0].fileName;
          }
          gVal.date = [gVal.startTime, gVal.endTime];
        });
      });
    });
    state.trainCreate = data;

    state.createOriginDate = data.trainDate;
  },

  [types.TRAIN_GET_APPLY_CENTER](state, data) {
    state.trainApplyCenterObj = Object.assign(state.trainApplyCenterObj, data);
  },

  [types.TRAIN_APPLYC_PAGE_CHANGE](state, data) {
    state.trainApplyCenterForm = data
      ? Object.assign(state.trainApplyCenterForm, data)
      : Object.assign(state.trainApplyCenterForm, {
        pageNo: PAGE_NO,
        pageSize: PAGE_SIZE
      });
  },

  [types.TRAIN_MY_PAGE_CHANGE](state, data) {
    state.trainMyForm = data
      ? Object.assign(state.trainMyForm, data)
      : Object.assign(state.trainMyForm, {
        pageNo: PAGE_NO,
        pageSize: PAGE_SIZE
      });
  },

  [types.TRAIN_GET_MY](state, data) {
    state.trainMyObj = Object.assign(state.trainMyObj, data);
  },

  [types.TRAIN_CREATE_ORIGIN_DATE](state, data) {
    state.createOriginDate = state.trainCreate.trainDate;
  },

  [types.TRAIN_CREATE_IS_DATE_CHANGE](state, data) {
    if (state.createOriginDate.length &&
      state.createOriginDate[0] === state.trainCreate.trainDate[0] &&
      state.createOriginDate[1] === state.trainCreate.trainDate[1]) {
      state.isNormalizeTime = false;
    } else {
      state.isNormalizeTime = true;
    }
  },

  [types.TRAIN_CHANGE_FILE_FLAG](state, data) {
    let timeListFilter = state.trainDetail.timetableDateDtoList.filter(val => val.timetableDate === data.time);
    timeListFilter[0].timetableTopicDtoList[data.ci].timetableDtoList[data.gi].isUpdatedFlag = true;
  },

  // 初始化队列里的值
  [types.TRAIN_CLEAR_REFS_ITEM_OBJ](state, data) {
    console.log('触发初始化');
    state.cItemObj = {};
    state.gItemObj = {};
  },

  // 时间转换成当天时间
  [types.TRAIN_TIME_TRANSFOR](state, data) {
    let timetableDateDtoList = Object.cloneDeep(state.trainCreate.timetableDateDtoList);
    let timeListFilter = timetableDateDtoList.filter(val => val.timetableDate === data.time);
    let date = timeListFilter[0].timetableTopicDtoList[data.ci].timetableDtoList[data.gi].date;
    if (date && date.length) {
      date[0] = data.time + ' ' + date[0].split(' ')[1];
      date[1] = data.time + ' ' + date[1].split(' ')[1];
      timeListFilter[0].timetableTopicDtoList[data.ci].timetableDtoList[data.gi].date = date;

      state.trainCreate.timetableDateDtoList = timetableDateDtoList;
    }
  },

  // 新增或修改文件名称改变
  [types.TRAIN_FILE_NAME_CHANGE](state, data) {
    state.trainCreate = Object.assign({}, state.trainCreate, data);
  },

  // 上传文件后，同步改变课程文件名称
  [types.TRAIN_CHANGE_COURSE_FILE_NAME](state, data) {
    let timetableDateDtoList = Object.cloneDeep(state.trainCreate.timetableDateDtoList);
    let timeListFilter = timetableDateDtoList.filter(val => val.timetableDate === data.time);
    timeListFilter[0].timetableTopicDtoList[data.ci].timetableDtoList[data.gi].fileName = data.fileName;

    state.trainCreate.timetableDateDtoList = timetableDateDtoList;
  },

  [types.TRAIN_DESTORY_DETAIL](state, data) {
    // 清空详情文件
    state.trainDetail = Object.cloneDeep(trainDetail);
    console.log('详情清空', state.trainDetail);
  }
};

function addLine(state, data) {
  let line = Object.cloneDeep(timetableTopicDtoObj);
  line.timetableDtoList.push(addItem());
  return line;
}

function addItem() {
  return Object.cloneDeep(timetableDtoObj);
}

function resetSort(obj, index, time) {
  let newObj = {};
  let fIndex = findValueIndex(Object.values(obj), time, index);
  delete obj[fIndex];

  let values = Object.values(obj);
  values.forEach((val, i) => {
    newObj[i] = val;
  });
  return newObj;
}

// function addItemInQueue(obj, value) {
//   let newObj = Object.create(obj);
//   console.log(newObj);
//   let cLen = Object.keys(newObj).length;
//   newObj[cLen] = value;
//   return newObj;
// }

export default {
  state,
  mutations
};