import * as types from '../types';
import {
  PAGE_NO,
  PAGE_SIZE,
  MENU_PERMISSIONS
} from '@/config/index.js';
import store from '@/store';

const roleCreate = {
  roleName: '',
  notes: '',
  menuIds: []
};
const userCreate = {
  staffName: '',
  code: '',
  roleId: [],
  provinces: [],
  opRegion: [],
  mobile: '',
  email: ''
};

const state = {
  roleObj: {
    list: [],
    totalCount: 1
  },
  roleForm: {
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE,
    roleName: ''
  },
  roleCreate: Object.cloneDeep(roleCreate),
  userObj: {
    list: [],
    totalcount: 1
  },
  userForm: {
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE,
    opRegion: null,
    otherField: '',
    role: ''
  },
  userCreate: Object.cloneDeep(userCreate),

  regionRelationList: [],

  sysConfig: {
    orgSecondLevelCheck: {
      id: '',
      codeName: '',
      codeValue: '',
      children: []
    },
    businessSmsForwardDay: {
      id: '',
      codeName: '',
      codeValue: '',
      children: []
    },
    visitSmsForwardDay: {
      id: '',
      codeName: '',
      codeValue: '',
      children: []
    },
    visitEvaluateDeadline: {
      id: '',
      codeName: '',
      codeValue: '',
      children: []
    }
  },
  sysConfigModel: {
    orgSecondLevelCheckCodeValue: '',
    orgSecondLevelCheckChildren: [],
    businessSmsForwardDayCodeValue: '',
    businessSmsForwardDayChildren: [],
    visitSmsForwardDayCodeValue: '',
    visitSmsForwardDayChildren: [],
    visitEvaluateDeadlineCodeValue: '',
    visitEvaluateDeadlineChildren: [],
    programmeEvaluateDeadlineCodeValue: '',
    programmeEvaluateDeadlineChildren: []
  }
};

const mutations = {
  [types.ROLE_LIST](state, data) {
    state.roleObj = data;
    state.roleObj.totalCount = data.totalCount;
  },
  [types.ROLE_INIT_FORM](state, data) {
    state.roleCreate = Object.cloneDeep(roleCreate);
  },
  [types.ROLE_GET_INFO](state, data) {
    let exceptFirstMendId = MENU_PERMISSIONS.filter(val => val.children).map(val => val.menuId);
    state.roleCreate = Object.assign(state.roleCreate, data);

    // 将多余的一级菜单menuId剔除
    state.roleCreate.menuIds = state.roleCreate.menuIds.filter(val => {
      let flag = true;
      exceptFirstMendId.map(cval => {
        if (cval === val) flag = false;
      });

      return flag;
    });
  },
  [types.USER_INIT_FORM](state, data) {
    state.userCreate = Object.cloneDeep(userCreate);
  },
  [types.USER_GET_LIST](state, data) {
    state.userObj = data;
  },
  [types.USER_GET_INFO](state, data) {
    // 需要将用户归属改造成v-model识别的数据类型
    let opRegion = [];
    state.regionRelationList.map(val => {
      val.children.map(cval => {
        if (cval.value === String(data.opRegion).toString()) {
          opRegion = [val.value, cval.value];
        }
      });
    });
    data.opRegion = opRegion;
    state.userCreate = data;
  },
  [types.SYSTEM_QUERY_REGION](state, data) {
    let regionArr = [];
    data.map(val => {
      if (String(val.codeValue) === String(store.state.root.currentUser.operator.opRegion)) {
        regionArr.push(val);
        return false;
      }
      val.children && val.children(cval => {
        if (String(cval.codeValue) === String(store.state.root.currentUser.operator.opRegion)) {
          val.children = [cval];
          regionArr.push(val);
          return false;
        }
      });
    });
    regionArr = regionArr.length ? regionArr : data;

    state.regionRelationList = regionArr.map(val => {
      let _val = {};
      _val.value = val.codeValue;
      _val.label = val.codeName;
      _val.children = val.staticDataDTOList.map(cval => {
        let _cval = {};
        _cval.value = cval.codeValue;
        _cval.label = cval.codeName;
        return _cval;
      });
      return _val;
    });
  },
  [types.ROLE_REDIRECT_USER_CREATE](state, data) {
    state.userForm = {
      pageNo: PAGE_NO,
      pageSize: PAGE_SIZE,
      opRegion: null,
      otherField: '',
      role: data
    };
  },
  [types.SYS_CONFIG](state, data) {
    state.sysConfig = data;
    for (let name of Object.keys(state.sysConfig)) {
      state.sysConfigModel[name + 'CodeValue'] = state.sysConfig[name].codeValue;
      state.sysConfigModel[name + 'Children'] = Object.cloneDeep(state.sysConfig[name].children);
    }
  }
};

export default {
  state,
  mutations
};
