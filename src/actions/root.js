import * as types from '../store/types';
import API from '../utils/api';
import { CODE_TYPE_LIST } from '@/config/index';

const actions = {
  getProvince({ commit }, params) {
    const req = { codeType: 'PROVINCE' };
    return API.getProvinceAPI(req).then(res => {
      commit(types.PROVINCE, res.data.PROVINCE);
    });
  },

  getUserRole({ commit }, params) {
    return API.getUserRoleAPI(params).then(res => {
      commit(types.USER_ROLE_LIST, res.data);
    });
  },

  getCurrentUserInfo({ commit }, params) {
    return API.getCurrentUserInfoAPI(params).then(res => {
      commit(types.CURRENT_USER_GET_INFO, res.data);
    });
  },

  queryStaticData({ commit }) {
    let params = {
      codeTypeList: CODE_TYPE_LIST
    };
    return API.queryStaticDataAPI(params).then(res => {
      commit(types.STATIC_DATA, res.data);
    });
  },
  // 获取文件id
  getNewFileInputId({ commit }, params) {
    return API.getNewFileInputIdAPI(params).then(res => {
      return res.data;
    }).catch(() => {
      return '';
    });
  },

  uploadFile({ commit }, params) {
    return API.uploadFileAPI(params).then(res => {
      return false;
    }).catch(() => {
      return true;
    });
    // if (res && res.data === null) {
    //   return false;
    // }
    // return true;
  },

  goFirstPage({ commit, state }, params) {
    const path = state.root.getFirstPageRoute;
    commit(types.ROUTE_CHANGE, {
      path
    });
  },
  async getSystemInfo({ commit, dispatch }, params) {
    // 获取省份静态数据
    await dispatch('getProvince');
    // 获取用户信息
    await dispatch('getCurrentUserInfo');
    // 获取用户信息后添加动态路由
    commit('ADD_ROUTES');
    // 获取其它静态数据
    dispatch('queryStaticData');
  },

  delUploadFileUseInputId({ commit }, params) {
    return API.delUploadFileUseInputIdAPI(params);
  },

  getFileThroughtFileId({ commit }, params) {
    return API.getFileThroughtFileIdAPI(params);
  },

  delUplodFile({ commit }, params) {
    return API.delUplodFileAPI(params).then((res) => {
      return res;
    });
  },

  pdfDownloadFile({ commit }, params) {
    return API.pdfDownloadFileAPI(params);
  },
};

export default actions;
