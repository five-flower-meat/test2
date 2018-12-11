import * as types from '../types';
import { MENU_PERMISSIONS } from '@/config';
import AddRoutes from '@/router/AddRoutes';
import router from '@/router/';

const state = {
  getFirstPageRoute: '', // 登录之后第一个跳转的页面
  province: [],
  userRoleList: [],
  currentRoute: {
    path: ''
  },
  operatorId: '',
  currentUserRoleList: [],
  currentUser: {
    menuIds: [], // 扁平化的menuId数组
    menuList: [],
    operator: {
      opRegion: null,
      staffName: '',
      provinces: []
    }
  },
  pageLoading: false,
  // 全局message状态控制
  globalMessageStatus: false,
  staticData: {}
};

const mutations = {
  [types.PROVINCE](state, data) {
    state.province = data.map(val => {
      return {
        key: val.codeValue,
        value: val.codeName
      };
    });
  },

  [types.USER_ROLE_LIST](state, data) {
    state.userRoleList = data;
  },

  // 改变当前路由
  [types.ROUTE_CHANGE](state, data) {
    state.currentRoute = data;
  },

  [types.SHOW_PAGE_LOADING](state) {
    state.pageLoading = true;
  },

  [types.HIDE_PAGE_LOADING](state) {
    state.pageLoading = false;
  },

  [types.STATIC_DATA](state, data) {
    let result = {};
    for (let key in data) {
      let value = data[key];
      let list = [];
      for (let item of value) {
        list.push({
          label: item.codeName,
          value: item.codeValue
        });
      }

      result[key] = list;
    }

    state.staticData = result;
  },

  [types.CURRENT_USER_GET_INFO](state, data) {
    let menuIds = [];
    let sidebars = Object.cloneDeep(MENU_PERMISSIONS);
    const provinces = data.secOperatorDTO.provinces.split(',');
    const regionProvinces = data.secOperatorDTO.regionProvinces ? data.secOperatorDTO.regionProvinces.split(',') : [];

    state.currentUser.operator.staffName = data.secOperatorDTO.staffName;
    state.currentUser.operator.opRegion = data.secOperatorDTO.opRegion;
    state.operatorId = data.secOperatorDTO.operatorId;
    state.currentUserRoleList = data.secRoleDTOList;
    // 数据分析页面权限:1：全国，2：大区，3：省
    state.currentUser.analysePrivilege = data.secOperatorDTO.analysePrivilege;

    // 用户拥有的菜单权限
    data.secMenuDTOList.map(val => {
      menuIds.push(val.menuId);
      val.children && val.children.map(cval => {
        menuIds.push(cval.menuId);
      });
    });
    menuIds.map(val => {
      sidebars.map(cval => {
        if (Number(cval.menuId) === Number(val)) {
          cval.enable = true;
        }
        cval.children && cval.children.map(gval => {
          if (Number(gval.menuId) === Number(val)) {
            gval.enable = true;
          }
        });
      });
    });
    // 当前用户拥有的菜单权限id列表
    state.currentUser.menuIds = menuIds;
    // 当前用户拥有的菜单权限详情列表
    state.currentUser.menuList = sidebars;

    const normalizeProvinces = val => {
      let obj = {};
      state.province.map(cval => {
        if (String(val) === String(cval.key)) {
          obj = {
            key: cval.key,
            value: cval.value
          };
        }
      });
      return obj;
    };
    // 用户拥有的省份权限
    state.currentUser.operator.provinces = provinces.map(val => {
      return normalizeProvinces(val);
    });
    // 获取用户的归属地所包含省份的权限
    state.currentUser.operator.regionProvinces = regionProvinces.map(val => normalizeProvinces(val));
  },

  [types.ADD_ROUTES](state, data) {
    const routes = new AddRoutes();
    router.addRoutes(routes.addDynamicRoutes(state.currentUser.menuIds));
    state.getFirstPageRoute = routes.getFirstPageRoute;
  }
};

export default {
  state,
  mutations
};
