import * as types from '../store/types';
import API from '../utils/api';
import { Message } from 'element-ui';

const actions = {
  trainGetCreateManage({ commit }, params) {
    return API.trainGetCreateManageAPI(params).then(res => {
      commit(types.TRAIN_GET_CREATE_MANAGE, res.data);
    });
  },

  trainGetApplyCenter({ commit }, params) {
    return API.trainGetApplyCenterAPI(params).then(res => {
      commit(types.TRAIN_GET_APPLY_CENTER, res.data);
    });
  },

  trainGetMy({ commit }, params) {
    return API.trainGetMyAPI(params).then(res => {
      commit(types.TRAIN_GET_MY, res.data);
    });
  },

  trainDeleteCourse({ commit }, params) {
    return API.trainDeleteCourseAPI(params);
  },

  trainPublishCourse({ commit }, params) {
    return API.trainPublishCourseAPI(params);
  },

  trainDownloadCourse({ commit }, params) {
    return API.trainDownloadCourseAPI(params);
  },

  trainSaveDetail({ commit, state }, params) {
    let files = [];
    const { trainDetail } = state.train;
    trainDetail.timetableDateDtoList.forEach(val => {
      val.timetableTopicDtoList.forEach(cVal => {
        cVal.timetableDtoList.forEach(gVal => {
          if (gVal.isUpdatedFlag) {
            files.push({
              id: trainDetail.id,
              timeTableId: gVal.id,
              fileInputId: gVal.fileInputId
            });
          }
        });
      });
    });

    return API.trainSaveDetailAPI({
      operateFileDtoList: files
    }).then(() => {
      Message({
        message: '保存成功',
        type: 'success'
      });
      commit(types.ROUTE_CHANGE, {
        path: '/train/create-management',
      });
    });
  },

  trainManagementCreate({ commit }, params) {
    return API.trainManagementCreateAPI(params).then(() => {
      Message({
        message: '新建成功',
        type: 'success'
      });
      commit(types.ROUTE_CHANGE, {
        path: '/train/create-management'
      });
    });
  },

  trainImportExcel({ commit }, params) {
    return API.trainImportExcelAPI(params).then(res => {
      commit(types.TRAIN_IMPORT_EXCEL, res.data);
    });
  },

  trainGetDetail({ commit }, params) {
    return API.trainGetDetailAPI(params).then(res => {
      commit(types.TRAIN_GET_DETAIL, res.data);
    });
  },

  trainGetEdit({ commit }, params) {
    return API.trainGetDetailAPI(params).then(res => {
      commit(types.TRAIN_GET_EDIT, res.data);
    });
  },

  trainManagementEdit({ commit }, params) {
    return API.trainManagementEditAPI(params).then(() => {
      Message({
        message: '修改成功',
        type: 'success'
      });
      commit(types.ROUTE_CHANGE, {
        path: '/train/create-management'
      });
    });
  },

  trainApplyConfirm({ commit }, params) {
    return API.trainApplyConfirmAPI(params);
  },

  trainCancelApply({ commit }, params) {
    return API.trainCancelApplyAPI(params);
  },

  trainDownloadTimetable({ commit }, params) {
    return API.trainDownloadTimetableAPI(params);
  }
};

export default actions;
