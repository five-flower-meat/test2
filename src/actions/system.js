import * as types from '../store/types';
import API from '../utils/api';
import { Message } from 'element-ui';

const actions = {
  getRoleList: ({ commit }, params) => {
    return API.getRoleListAPI(params).then(res => {
      commit(types.ROLE_LIST, res.data);
    }, err => {
      if (err) {
        commit(types.ROLE_LIST, {});
      }
    });
  },
  getRoleInfo: ({ commit }, params) => {
    return API.getRoleInfoAPI(params).then(res => {
      commit(types.ROLE_GET_INFO, res.data);
    }, err => {
      if (err) commit(types.ROLE_GET_INFO, {});
    });
  },
  getPermissions: ({ commit }, params) => {
    return API.getPermissionsAPI(params).then(res => {
      commit(types.PERMISSIONS, res.data);
    });
  },
  getUserList: ({ commit }, params) => {
    return API.getUserListAPI(params).then(res => {
      commit(types.USER_GET_LIST, res.data);
    });
  },

  getUserInfo: ({ commit }, params) => {
    return API.getUserInfoAPI(params).then(res => {
      commit(types.USER_GET_INFO, res.data);
    });
  },
  createUser: ({ commit }, params) => {
    return API.createUserAPI(params).then(res => {
      Message({
        message: '创建成功',
        type: 'success',
        duration: 3000
      });
      // 创建成功
      commit(types.ROUTE_CHANGE, {
        path: '/system/user/management'
      });
    });
  },
  updateUser: ({ commit }, params) => {
    return API.updateUserAPI(params).then(res => {
      Message({
        message: '更新成功',
        type: 'success',
        duration: 3000
      });
      // 创建成功
      commit(types.ROUTE_CHANGE, {
        path: '/system/user/management'
      });
    });
  },
  deleteUser: ({ commit }, params) => {
    return API.deleteUserAPI(params).then(res => {
      Message({
        showClose: true,
        message: '删除成功',
        type: 'success',
        duration: 3000
      });
    });
  },
  createRole: ({ commit }, params) => {
    return API.createRoleAPI(params).then(res => {
      Message({
        message: '创建成功',
        type: 'success',
        duration: 3000
      });
      // 创建成功
      commit(types.ROUTE_CHANGE, {
        path: '/system/role/management'
      });
    });
  },
  updateRole: ({ commit }, params) => {
    return API.updateRoleAPI(params).then(res => {
      Message({
        message: '更新成功',
        type: 'success',
        duration: 3000
      });
      commit(types.ROUTE_CHANGE, {
        path: '/system/role/management'
      });
    });
  },
  deleteRole: ({ commit }, params) => {
    return API.deleteRoleAPI(params).then(res => {
      Message({
        showClose: true,
        message: '删除成功',
        type: 'success',
        duration: 3000
      });
    });
  },
  queryRegionRelationList: ({ commit }, params) => {
    return API.queryRegionRelationListAPI(params).then(res => {
      commit(types.SYSTEM_QUERY_REGION, res.data);
    });
  },
  getSysConfigList: ({ commit }, params) => {
    return API.getSysConfigList(params).then(res => {
      commit(types.SYS_CONFIG, res.data);
    });
  },
  async updateSysConfig({ commit }, params) {
    return API.updateSysConfig(params).then(() => {
      Message({
        message: '修改成功',
        type: 'success',
        duration: 3000
      });
    });
  }
};

export default actions;
