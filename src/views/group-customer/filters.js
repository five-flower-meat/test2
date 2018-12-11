// import find from 'lodash/find';
import dayjs from 'dayjs';
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      provinces: ({ root }) => root.province,
      staticData: ({ root }) => root.staticData
    }),
    // 集团规模
    MEMBER_NUM() {
      return this.staticData.MEMBER_NUM || [];
    },
    // 证件类型
    CERTIFICATE_TYPE() {
      return this.staticData.CERTIFICATE_TYPE || [];
    },
    // 集团属性
    ORGANIZE_TYPE() {
      return this.staticData.ORGANIZE_TYPE || [];
    },
    // 注册资金类型
    REGISTER_FUND_TYPE() {
      return this.staticData.CM_MONEY_TYPE || [];
    },
    // 机构类型
    ORG_INDUSTRY_TYPE() {
      return this.staticData.ORG_INDUSTRY_TYPE || [];
    },
    // 行业类别
    INDUSTRY_TYPE() {
      return this.staticData.INDUSTRY_TYPE || [];
    },
    GENDER() {
      return this.staticData.SEX || [];
    },
    AGE() {
      return this.staticData.AGE || [];
    },
    MARITAL_STATUS() {
      return this.staticData.MARITAL_STATUS || [];
    }
  },
  methods: {
    /**
     * 集团客户-集团客户规模
     * @param {*} value
     */
    memberNumFilter(value) {
      // let result = _.find(this.MEMBER_NUM, { value });
      let result = this.MEMBER_NUM.find(val => val.value === String(value));

      return result ? result.label : '';
    },
    /**
     * 集团客户-性别
     * @param {String} value 原始值
     */
    genderFilter(value) {
      // let result = _.find(this.GENDER, { value });
      let result = this.GENDER.find(val => val.value === String(value));

      return result ? result.label : '';
    },
    /**
     * 集团客户-年龄
     * @param {String} value 原始值
     */
    ageFilter(value) {
      return value;
    },
    /**
     * 集团客户-所属省份
     * @param {String} value 原始值
     */
    provinceFilter(value) {
      // let result = _.find(his.provinces, { key: value });
      let result = this.provinces.find(val => val.value === String(value));

      return result ? result.value : '';
    },
    /**
     * 集团客户-婚姻状况
     * @param {String} value 原始值
     */
    maritalFilter(value) {
      return value;
    },
    /**
     * 集团客户-证件类型
     * @param {String} value 原始值
     */
    certificateTypeFilter(value) {
      let result = this.CERTIFICATE_TYPE.find(val => val.value === String(value));

      return result ? result.label : '';
    },
    /**
     * 集团客户-集团属性
     * @param {String} value 原始值
     */
    orgTypeFilter(value) {
      let result = this.ORGANIZE_TYPE.find(val => val.value === String(value));

      return result ? result.label : '';
    },
    /**
     * 集团客户-注册资金类型
     * @param {String} value 原始值
     */
    registerFundTypeFilter(value) {
      let result = this.REGISTER_FUND_TYPE.find(val => val.value === String(value));

      return result ? result.label : '';
    },
    /**
     * 集团客户-机构类型
     * @param {String} value 原始值
     */
    orgIndustryTypeFilter(value) {
      let result = this.ORG_INDUSTRY_TYPE.find(val => val.value === String(value));

      return result ? result.label : '';
    },
    /**
     * 集团客户-行业类别
     * @param {String} value 原始值
     */
    industryTypeFilter(value) {
      let result = this.INDUSTRY_TYPE.find(val => val.value === String(value));

      return result ? result.label : '';
    },
    formateDate(date) {
      if (date) {
        return dayjs(date).format('YYYY-MM-DD');
      } else {
        return '';
      }
    }
  }
};
