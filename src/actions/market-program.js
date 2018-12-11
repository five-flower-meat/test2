import * as types from '../store/types';
import API from '../utils/api';
import { Message } from 'element-ui';

const actions = {
  marketGetActivityList({ commit }, params) {
    return API.marketGetActivityListAPI(params).then(res => {
      commit(types.ACTIVITY_LIST, res.data);
    });
  },

  marketActivityCreate({ commit }, params) {
    return API.marketActivityCreateAPI(params).then(res => {
      Message({
        message: '新建成功',
        type: 'success'
      });
      commit(types.ROUTE_CHANGE, {
        path: '/market-program/rate-activity'
      });
    });
  },

  marketActivityEdit({ commit }, params) {
    return API.marketActivityEditAPI(params).then(res => {
      Message({
        message: '修改成功',
        type: 'success'
      });
      commit(types.ROUTE_CHANGE, {
        path: '/market-program/rate-activity'
      });
    });
  },

  marketActivityGetDetail({ commit }, params) {
    return API.marketActivityDetailAPI(params).then(res => {
      commit(types.MARKET_ACTIVITY_GEY_DETAIL, res.data);
    });
  },
  rateDownloadFile({ commit }, params) {
    return API.downloadAttachFileAPI(params);
  },
  queryActivityDetail({ commit }, params) {
    return API.marketActivityDetailAPI(params).then(res => {
      commit(types.ACTIVITY_DETAIL, res.data);
    });
  },
  activityScorerDetail({ commit }, params) {
    return API.marketActivityScorerDetailAPI(params).then(res => {
      commit(types.ACTIVITY_DETAIL, res.data);
    });
  },
  submitRate({ commit }, params) {
    return API.marketActivityRateAPI(params).then(res => {
      Message({
        message: '评分成功',
        type: 'success'
      });
      commit(types.ROUTE_CHANGE, {
        path: '/market-program/rate-task'
      });
    });
  },
  closeRate({ commit }, params) {
    return API.marketActivityCloseRateAPI(params).then(res => {
      Message({
        message: '关闭成功',
        type: 'success'
      });
    });
  },
  queryRateTaskList({ commit }, params) {
    return API.marketActivityRateTaskListAPI(params).then(res => {
      commit(types.ACTIVITY_RATE_LIST, res.data);
    });
  },
  queryRateTaskOfActivityList({ commit }, params) {
    return API.marketGetActivityListAPI(params).then(res => {
      commit(types.ACTIVITY_RATE_LIST, res.data);
    });
  },
  queryRegionTree({ commit }, params) {
    return API.marketActivitySelectRegionTreeAPI(params).then(res => {
      commit(types.ACTIVITY_SELECT_REGION_TREE, res.data);
    });
  },
};
export default actions;
