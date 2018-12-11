import * as types from '../types';
import {
  PAGE_NO,
  PAGE_SIZE
} from '@/config/index.js';
const ordProductDtoListObj = {
  productId: null,
  productName: '',
  amount: '',
  processor: [],
  processorData: [],
  companyBelong: '',
  productHandlers: []
};

const state = {
  ordProductDtoList: [{
    productId: null,
    productName: '',
    amount: '',
    processor: [],
    processorData: [],
    companyBelong: '',
    productHandlers: []
  }],
  productDtoCreate: {},
  productDtoDelete: {},
  regionData: {
    regionList: [],
    processorList: [],
    processor: []
  },
  cooperationGroupList: [],
  businessForm: {
    startDate: '',
    endDate: '',
    date: [],
    organizeNameOrCode: '',
    opporCodeOrName: '',
    opName: '',
    opporStatus: '',
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE
  },
  myBusinessForm: {
    startDate: '',
    endDate: '',
    date: [],
    organizeNameOrCode: '',
    opporCodeOrName: '',
    opporStatus: '0',
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE
  },
  businessTaskForm: {
    startDate: '',
    endDate: '',
    date: [],
    organizeNameOrCode: '',
    opporCodeOrName: '',
    taskHasComplete: '0',
    pageNo: PAGE_NO,
    pageSize: PAGE_SIZE
  },
  businessTaskList: '',
  businessList: '',
  businessDetail: {},
  officeAddress: '',
  submitBusinessStatus: '',
  groupAssociationStatus: '',
  delBusinessStatus: '',
  designatePerson: [],
  remindPerson: [],
  submitBusinessSendStatus: '',
  submitBusinessCancelStatus: '',
  saveBusinessDrafStatus: '',
  saveBusinessOrder: '',
  myBusinessList: '',
  transforOrderDetail: '',
  submitBusinessDraftStatus: '',
  editBusinessDetailStatus: '',
  editBusinessDetailApproveStatus: '',
  productNameCode: '',
  queryTask: []
};

const mutations = {
  [types.COOPERATION_GROUP](state, data) {
    state.cooperationGroupList = data.list.map(val => Object.assign(val, { value: val.organizeName }));
  },
  [types.BUSINESS_OPPORTUNITY_LIST](state, data) {
    state.businessList = data;
  },
  [types.BUSINESS_DETAIL](state, data) {
    state.businessDetail = data;
  },
  [types.OFFICE_ADDRESS](state, data) {
    state.officeAddress = data.list;
  },
  [types.SUBMIT_BUSINESS_STATUS](state, data) {
    state.submitBusinessStatus = data.list;
  },
  [types.GROUP_ASSOCIATION_STATUS](state, data) {
    state.groupAssociationStatus = data.list;
  },
  [types.DEL_BUSINESS_STATUS](state, data) {
    state.delBusinessStatus = data;
  },
  [types.DESIGNATE_PERSON](state, data) {
    state.designatePerson = data.map(val => {
      let _val = {};
      _val.value = val.codeValue;
      _val.label = val.codeName;
      if (val.childrenList) {
        let children = [];
        val.childrenList.map(val => {
          let _chi = {};
          _chi.value = val.codeValue;
          _chi.label = val.codeName;
          children.push(_chi);
        });
        _val.children = children;
      };
      return _val;
    });
  },
  [types.REMIND_PERSON](state, data) {
    let handlers = data.map(val => {
      let newVal = {};
      newVal.value = val.codeValue;
      newVal.label = val.codeName;
      newVal.children = val.childrenList && val.childrenList.filter(cval => cval.secOperatorDTOList).map(cval => {
        let newCval = {};
        newCval.value = cval.codeValue;
        newCval.label = cval.codeName;
        newCval.children = cval.secOperatorDTOList && cval.secOperatorDTOList.map(gcval => {
          return {
            value: gcval.operatorId,
            label: gcval.staffName
          };
        });
        return newCval;
      });
      return newVal;
    });
    state.remindPerson = handlers;
  },
  [types.SUBMIT_BUSINESS_SEND_STATUS](state, data) {
    state.submitBusinessSendStatus = data.list;
  },
  [types.SUBMIT_BUSINESS_CANCEL_STATUS](state, data) {
    state.submitBusinessCancelStatus = data;
  },
  [types.SAVE_BUSINESS_DRAFT_STATUS](state, data) {
    state.saveBusinessDrafStatus = data.list;
  },
  [types.SAVE_BUSINESS_ORDER](state, data) {
    state.saveBusinessOrder = data.list;
  },
  [types.MY_BUSINESS_LIST](state, data) {
    state.myBusinessList = data;
  },
  [types.BUSINESS_TASK_LIST](state, data) {
    state.businessTaskList = data;
  },
  [types.TRANSFOR_ORDER_DETAIL](state, data) {
    state.transforOrderDetail = data;
  },
  [types.SUBMIT_BUSINESS_DRAFT_STATUS](state, data) {
    state.submitBusinessDraftStatus = data;
  },
  [types.EDIT_BUSINESS_DETAIL_STATUS](state, data) {
    state.editBusinessDetailStatus = data;
  },
  [types.EDIT_BUSINESS_DETAIL_APPROVE_STATUS](state, data) {
    state.editBusinessDetailApproveStatus = data;
  },
  [types.PRODUCT_NAME_CODE](state, data) {
    state.productNameCode = data.list.map(val => Object.assign(val, { value: val.productName }));
  },
  [types.QUERY_TASK](state, data) {
    state.queryTask = data;
  },
  [types.PRODUCT_DTO_LIST](state, data) {
  },
  [types.CLEAR_BUSINESS_PRODUCT](state, data) {
    state.ordProductDtoList = [Object.cloneDeep(ordProductDtoListObj)];
  },
  [types.PRODUCT_DTO_CREATE](state, data) {
    let item = Object.cloneDeep(ordProductDtoListObj);
    state.ordProductDtoList = state.ordProductDtoList.concat([item]);
  },
  [types.PRODUCT_DTO_DELETE](state, data) {
    let nick = state.ordProductDtoList;
    nick.splice(data.index, 1);
  },
  [types.PRODUCT_DTO_INPUT_CLEAR](state, data) {
    state.ordProductDtoList[data.index].companyBelong = '';
    state.ordProductDtoList[data.index].productId = null;
    state.ordProductDtoList[data.index].productHandlers = [];
    state.ordProductDtoList[data.index].productName = '';
    state.ordProductDtoList[data.index].processor = [];
    state.ordProductDtoList[data.index].processorData = [];
  },
  [types.QUERY_PRODUCT_PROCESSOR](state, data) {
    let dataList = data.list.map(item => {
      return {
        value: item.staffName,
        label: item.operatorId,
      };
    });
    state.ordProductDtoList[data.index].companyBelong = data.item.region;
    state.ordProductDtoList[data.index].productId = data.item.productId;
    state.ordProductDtoList[data.index].productHandlers = dataList;
  },
  [types.GET_PRODUCT_PROCESSOR](state, data) {
    let item = state.ordProductDtoList[data.index];
    item.processor = item.processorData.map(val => {
      let processor = item.productHandlers.filter(cval => cval.value === val)[0];
      if (processor) {
        return processor.label;
      }
    });
  }
};

const getters = {
  businessDetail(state) {
    return state.businessDetail;
  },
  transforOrderDetail(state) {
    return state.transforOrderDetail;
  }
};

export default {
  state,
  mutations,
  getters
};
