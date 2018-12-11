<template>
  <div class="tTable"
    v-if="ordProductDtoList.length > 0">
    <div class="tHead">
      <div class="title">订购产品</div>
      <div class="title">订购数量</div>
      <div class="title">处理人</div>
      <div class="title">操作</div>
    </div>
    <div class="tBody">
      <div class="td"
        v-for="(item, index) in ordProductDtoList"
        :key="index">
        <el-form class="td"
          :model="item"
          ref="itemForm"
          :rules="itemRules">
          <el-form-item prop="productName">
            <el-autocomplete v-model="item.productName"
              :fetch-suggestions="queryProductAsync"
              placeholder="订购产品"
              @select="item => getProcessor(item, index)"
              @blur="valueIsNull($event, index)"
              :trigger-on-focus="false" />
          </el-form-item>
          <el-form-item prop="amount">
            <el-input v-model="item.amount"
              maxlength="9"
              placeholder="数量" />
          </el-form-item>
          <el-form-item prop="processorData">
            <el-select placeholder="指派人"
              v-model="item.processorData"
              :disabled="!item.productHandlers.length"
              @change="getProcessorItem({index})"
              multiple
              collapse-tags>
              <el-option v-for="cItem in item.productHandlers"
                :key="cItem.value"
                :label="cItem.value"
                :value="cItem.value" />
            </el-select>
          </el-form-item>
          <div class="del">
            <span v-if="ordProductDtoList.length > 1"
              @click="delFn(index)">删除</span>
          </div>
        </el-form>
      </div>
      <div class="add blue">
        <span class="cursor-pointer"
          @click="addList">
          <i class="el-icon-plus"></i>增加一条</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { PAGE_SIZE } from '@/config/index.js';
import { checkMultRules } from '@/utils/common.js';
import { isPositive } from '@/utils/rules.js';

export default {
  data() {
    return {
      pageSize: PAGE_SIZE,
      itemRules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        amount: [
          { validator: isPositive, trigger: 'blur' }
        ],
        processorData: [
          { required: true, message: '请输入指派人', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      ordProductDtoList: ({ business }) => business.ordProductDtoList,
      productList: ({ order }) => order.productList
    })
  },
  methods: {
    valueIsNull(event, index) {
      let _value = event.currentTarget._value;
      if (!_value) {
        this.clearProductDto({ index });
      }
    },
    addList() {
      this.creatProductDto();
    },
    delFn(index) {
      this.deleteProductDto({ index });
    },
    getProcessor(item, index) {
      // 判断是否重复，通过producteId
      let isRepeat = this.ordProductDtoList.filter((val, i) => val.productId === item.productId && i !== index);

      if (isRepeat.length >= 1) {
        this.$message({
          message: '订单产品不允许重复',
          type: 'error',
        });
        return false;
      }
      this.getProductProcessor({ item, index });
    },
    async queryProductAsync(queryString, cb) {
      if (!queryString.trim()) return false;
      let params = {
        pageSize: this.pageSize,
        productName: queryString
      };

      await this.queryProductByCodeOrName(params);

      await clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(this.productList);
      }, 1000);
    },
    validate() {
      let checkMult = checkMultRules(this.$refs['itemForm']);
      return checkMult;
    },
    ...mapMutations({
      creatProductDto: 'PRODUCT_DTO_CREATE', // 新增产品
      deleteProductDto: 'PRODUCT_DTO_DELETE', // delete 产品
      clearProductDto: 'PRODUCT_DTO_INPUT_CLEAR', // 订购产品 clear
      getProcessorItem: 'GET_PRODUCT_PROCESSOR' // 获取指派人
    }),
    ...mapActions([
      'getProductProcessor', // 获取产品指派人信息
      'queryProductByCodeOrName' // 获取产品信息
    ])
  }
};
</script>

<style lang="scss">
@import "./style.scss";
</style>
