<template>
  <div class="transfor-order">
    <div class="m-container">
      <div class="breadcrumb">
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/business-manage/business-task' }">商机处理任务</el-breadcrumb-item>
          <el-breadcrumb-item>转订单</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="detail-bar-container"
      v-if="orderData.opporAssignReason">
      <div class="detail-bar">
        <div class="detail-bar-item">
          <div class="title">指派人：</div>
          <div>{{orderData.opporAssignPerson}}</div>
        </div>
        <div class="detail-bar-item-2">
          <div class="title">指派原因：</div>
          <div class="ellipsis"
            :title="orderData.opporAssignReason">{{orderData.opporAssignReason}}</div>
        </div>
      </div>
    </div>
    <div class="order-container">
      <el-form :rules="rules"
        ref="transForm"
        :model="orderData"
        label-width="140px">
        <el-form-item label="订单名称："
          prop="ordName">
          <el-input :maxlength="25"
            v-model="orderData.ordName"
            class="form-input-medium"
            placeholder="请输入订单名称">
          </el-input>
        </el-form-item>
        <el-form-item label="合作集团："
          prop="organizeName">
          <el-autocomplete disabled
            :maxlength="25"
            class="form-input-half"
            v-model="orderData.organizeName"
            :fetch-suggestions="querySearchAsync"
            placeholder="合作集团/编码"
            @select="handleSelect"
            @blur="noData = false;"></el-autocomplete>
          <el-card class="create-business-box-card"
            v-if="noData">
            <div>
              系统暂未录入该集团，你可以暂时手动输入，建议后续尽快录入并同步关联修改！
            </div>
          </el-card>
          <span class="form-input-sep">-</span>
          <el-form-item prop="address"
            style="display:inline-block;">
            <el-input disabled
              :maxlength="50"
              class="form-input-half"
              v-model="orderData.address"
              placeholder="办公地址"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="联系人："
          prop="contactName">
          <el-input :maxlength="6"
            class="form-input-80"
            v-model="orderData.contactName"
            placeholder="姓名"></el-input>
          <span class="form-input-sep">-</span>
          <el-form-item prop="contactGender"
            style="display: inline-block;">
            <el-select class="form-input-80"
              v-model="orderData.contactGender"
              placeholder="性别">
              <el-option v-for="item in SEX"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <span class="form-input-sep">-</span>
          <el-form-item prop="contactMobile"
            style="display: inline-block;">
            <el-input :maxlength="11"
              class="form-input-120"
              v-model="orderData.contactMobile"
              placeholder="手机号"></el-input>
          </el-form-item>
          <span class="form-input-sep">-</span>
          <el-form-item prop="contactEmail">
            <el-input :maxlength="35"
              class="form-input-320"
              v-model="orderData.contactEmail"
              placeholder="请输入邮箱"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="订购产品："
          required>
          <product-item ref="productItemRef" />
        </el-form-item>
        <el-form-item label="业务描述："
          prop="busiDesc">
          <el-input :maxlength="500"
            v-model="orderData.busiDesc"
            class="form-input-320"
            type="textarea"
            :rows="3"
            placeholder="请输入业务描述"></el-input>
        </el-form-item>
        <el-form-item label="合作方案："
          prop="teamProject">
          <el-input type="textarea"
            class="form-input-large"
            :maxlength="500"
            v-model="orderData.teamProject"
            placeholder="请输入合作方案" />
        </el-form-item>
        <el-form-item label="预计收入："
          prop="predictRevenue">
          <el-input v-model="orderData.predictRevenue"
            class="form-input-medium"
            placeholder="请输入预计收入">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="预计签约时间："
          prop="predictSignTime">
          <el-date-picker class="form-input-medium"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            v-model="orderData.predictSignTime"
            placeholder="请选择时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="预计协议期："
          prop="predictAgreementTime">
          <el-input class="form-input-medium"
            v-model="orderData.predictAgreementTime"
            :maxlength="3"
            placeholder="请输入时间">
            <template slot="append">月</template>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary"
            @click="submit">提交</el-button>
          <el-button @click="cancel"
            plain>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { checkPhone, emailCheck, inte8Deci2, checkLeftRightSpace } from '@/utils/rules.js';

import filters from '@/views/business-manage/filters';
import ProductItem from 'components/business/toOrder/ProductItem.vue';
export default {
  mixins: [filters],
  components: {
    ProductItem
  },
  data() {
    const isProductExist = (rule, value, callback) => {
      if (this.selectedProduct.productId &&
        this.selectedProduct.productName === this.orderData.productName) {
        callback();
      } else {
        callback(new Error('产品名称不存在'));
      }
    };
    return {
      date: 0,
      selectedProduct: {
        productName: '',
        productId: null
      },
      rules: {
        ordName: [
          { required: true, message: '请输入订单名称', trigger: 'blur' },
          { validator: checkLeftRightSpace, trigger: 'blur' }
        ],
        organizeName: [
          { required: true, message: '请输入合作集团/编码', trigger: 'blur' },
          { validator: checkLeftRightSpace, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入办公地址', trigger: 'blur' },
          { validator: checkLeftRightSpace, trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: checkLeftRightSpace, trigger: 'blur' }
        ],
        contactGender: [
          { required: true, message: '请选择性别', trigger: ['blur', 'change'] }
        ],
        contactMobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        contactEmail: [
          { message: '请输入电子邮箱', trigger: 'blur' },
          { validator: emailCheck, trigger: 'blur' }
        ],
        busiDesc: [
          { required: true, message: '请输入订单描述', trigger: 'blur' },
          { validator: checkLeftRightSpace, trigger: 'blur' }
        ],
        teamProject: [
          { required: true, message: '请输入合作方案', trigger: 'blur' },
          { validator: checkLeftRightSpace, trigger: 'blur' }
        ],
        busiRequire: [
          { required: true, message: '请输入订单需求', trigger: 'blur' },
          { validator: checkLeftRightSpace, trigger: 'blur' }
        ],
        predictRevenue: [
          { validator: inte8Deci2, trigger: 'blur' }
        ],
        predictSignTime: [
          { required: true, message: '请选择预计签约时间', trigger: ['blur', 'change'] }
        ],
        predictAgreementTime: [
          { required: true, message: '请选择预计协议期', trigger: ['blur', 'change'] }
        ],
        isProjectInvitation: [
          { required: true, message: '请选择项目是否招标', trigger: ['blur', 'change'] }
        ],
        productName: [
          { required: true, message: '请输入产品名称/编码', trigger: 'blur' },
          { validator: checkLeftRightSpace, trigger: 'blur' },
          { validator: isProductExist, trigger: 'blur' }
        ],
        predictContractAmount: [
          { required: true, message: '请输入预计合同金额', trigger: 'blur' },
          { pattern: /^\d{1,5}(?:\.\d{1,4})?$/, message: '整数部分最多5位，小数部分最多4位' }
        ]
      },
      noData: false
    };
  },
  beforeMount() {
    const opprparam = {};
    opprparam.opporId = this.$route.params.opporId;
    this.getBusinessDetail(opprparam);
    this.getTransforOrderDetail(opprparam);
  },
  computed: {
    businessData() {
      return this.$store.getters.businessDetail;
    },
    orderData() {
      return this.$store.getters.transforOrderDetail;
    },
    ...mapState({
      ordProductDtoList: ({ business }) => business.ordProductDtoList,
      cooperationGroupList: ({ business }) => business.cooperationGroupList,
      transforOrderDetail: ({ business }) => business.transforOrderDetail,
      businessDetail: ({ business }) => business.businessDetail,
      productNameCode: ({ business }) => business.productNameCode
    })
  },
  beforeDestroy() {
    // 组件注销的时候，需要清空产品数据
    this.clearProductStore();
  },
  methods: {
    async querySearchAsync(queryString, cb) {
      this.noData = false;
      if (!queryString) return false;
      let params = {
        pageSize: 20,
        organizeName: queryString
      };
      await this.getCooperationGroupList(params);
      await clearTimeout(this.timeout);
      this.timeout = await setTimeout(() => {
        var results = this.cooperationGroupList;
        if (results.length === 0) {
          this.noData = true;
        } else {
          this.noData = false;
        };
        cb(results);
      }, 1000);
    },
    async productQuerySearch(queryString, cb) {
      if (!queryString) return false;
      let params = {
        pageSize: 20,
        productName: queryString
      };
      await this.getProductNameCode(params);
      await clearTimeout(this.timeout);
      this.timeout = await setTimeout(() => {
        var productNameCode = this.productNameCode;
        var results = queryString ? productNameCode.filter(this.createStateFilter(queryString)) : productNameCode;
        cb(results);
      }, 1000);
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      this.updateOrderCreate({ address: item.orgAddress });
    },
    submit() {
      let orderData = Object.cloneDeep(this.orderData);
      let ordProductDtoList = Object.cloneDeep(this.ordProductDtoList);
      let params = Object.assign(orderData, {ordProductDtoList: ordProductDtoList});
      params.ordProductDtoList = ordProductDtoList.filter(item => {
        delete item.processorData;
        delete item.productHandlers;
        return item;
      });
      delete params.opporProcessor;
      delete params.opporAssignReason;
      delete params.opporAssignPerson;
      delete params.predictContractAmount;
      delete params.productName;
      delete params.productId;
      params.taskInsId = this.$route.params.taskInsId;
      params.predictRevenue = params.predictRevenue ? params.predictRevenue : '';
      let productItemValidate = this.$refs.productItemRef.validate();
      this.$refs.transForm.validate(valid => {
        if (!valid || !productItemValidate) return false;
        this.saveBusinessOrder(params).then(res => {
          if (res.data) {
            this.$message({ showClose: true, message: '您已成功提交！', type: 'success' });
            this.cancel();
          } else {
            this.$message({ showClose: true, message: '提交失败！', type: 'error' });
          }
        });
      });
    },
    cancel() {
      const path = `/business-manage/business-task`;
      this.$router.push(path);
    },
    ...mapMutations({
      updateOrderCreate: 'ORDER_UPDATE_CREATE',
      clearProductStore: 'CLEAR_BUSINESS_PRODUCT'
    }),
    ...mapActions([
      'getTransforOrderDetail',
      'getCooperationGroupList',
      'getBusinessDetail',
      'saveBusinessOrder',
      'getProductNameCode'
    ])
  }
};
</script>

<style lang="scss">
@import "scss/variables.scss";
.order-container {
  padding: 16px;
  background: #fff;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
}
.business-detail {
  margin-top: $blockWidth;
}
.create-business-box-card {
  position: absolute;
  z-index: 2;
  line-height: 20px;
  .el-card__body {
    padding: 10px;
    color: rgba(0, 0, 0, 0.45);
  }
}
.transfor-order {
  .detail-bar-container {
    background: rgb(255, 255, 255);
    margin-top: 16px;
    padding-top: 10px;
  }
  .detail-bar {
    margin: 17px 24px 0px 24px;
    border-radius: 2px;
    background-color: #fafafa;
    padding: 24px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .detail-bar-item {
      flex: 1;
      display: flex;
    }
    .title {
      width: 100px;
      text-align: right;
      color: rgba(0, 0, 0, 0.45);
      padding-right: 12px;
    }
    .detail-bar-item-2 {
      flex: 2;
      display: flex;
      .ellipsis {
        width: 600px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
