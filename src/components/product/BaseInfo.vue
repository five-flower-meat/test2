<template>
<div class="base-info">
  <h3>产品基本信息</h3>
  <!--{{productList}}-->
  <ul class="b-i-list">
    <li class="flex-1"><span>产品名称：</span>{{productList.productName}}</li>
    <li class="flex-2"><span>产品资料：</span>
    <label v-for="item in productList.fileData" :key="item" class="download" @click="downloadFile(item)" v-if="productList.fileData">{{item.fileName}}&nbsp;&nbsp;&nbsp;</label>
    </li>
    <!--<li><span>产品价格：</span>{{productList.price}}元</li>
    <li><span>产品类别：</span>{{productList.productType}}</li>
    <li><span>负责人员：</span><label>{{productList.username}}-{{productList.deptment}}-{{productList.position}}</label></li>-->
    <!--<li class="pro-w-67"><span>产品介绍：</span><label class="product-desc">{{productList.description}}</label></li>-->
  </ul>
  <ul class="b-i-list">
    <li class="flex-3"><span>产品介绍：</span>{{productList.description}}</li>
  </ul>
  <ul class="b-i-list">
    <li class="flex-1"><span>主营市场：</span>{{mainMarket}}</li>
    <li class="flex-2"><span>产品类别：</span>{{productType}}</li>
  </ul>
  <ul class="b-i-list">
    <li class="flex-3"><span>价格策略：</span>{{productList.priceStrategy}}</li>
  </ul>
  <ul class="b-i-list">
    <li class="flex-3"><span>商务策略：</span>{{productList.commercialStrategy}}</li>
  </ul>
  <ul class="b-i-list">
    <li class="flex-3"><span>产品归属：</span>{{productList.belongToCompany}}<label v-if="productList.secondOptionCN">-{{productList.secondOptionCN}}</label><label v-if="productList.specificProduct">-{{productList.specificProduct}}</label></li>
  </ul>
  <ul class="b-i-list">
    <li class="flex-3"><span>产品对接人：</span>{{productList.brokerCN}}-{{productList.mobile}}-{{productList.deptment}}-{{productList.position}}</li>
  </ul>
</div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: {
    product: {
      type: Object
    }
  },
  computed: {
    productList() {
      if (this.product) {
        return this.product;
      }
    },
    mainMarket() {
      if (this.product && this.product.mainMarketArrCN) {
        let product = this.product.mainMarketArrCN.join();
        return product;
      }
    },
    productType() {
      switch (this.productList.productType) {
        case '1':
          return '卡类';
        case '2':
          return '衍生品类';
        case '3':
          return '活动类';
        case '4':
          return '智能硬件类';
        case '5':
          return '会员';
        case '6':
          return '其他';
      }
    }
  },
  methods: {
    downloadFile(obj) {
      let params = {
        fileTypeId: 502,
        fileSaveName: obj.fileSaveName,
        fileName: obj.fileName
      };
      this.productDownloadFile(params);
    },
    ...mapActions([
      'productDownloadFile'
    ])
  }
};
</script>

<style lang="scss">
.base-info {
  margin-top: 16px;
  padding-bottom: 30px;
  background: #fff;
  h3 {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    color: #262626;
    margin: 0;
    border-bottom: 1px #E6E6E6 solid;
    padding: 0px 32px;
  }
  .b-i-list {
    display: flex;
    flex-flow: wrap;
    padding: 10px 32px 0;
    .flex-3 {
      width: 100%;
    }
    .flex-1 {
      width: 33.3%;
    }
    .flex-2 {
      width: 66.6%;
    }
    li {
      height: auto !important;
      display: flex;
      word-break: break-word;
      line-height: 1.5 !important;
      font-size: 14px;
      color: #262626;
      margin: 5px 0;
      span {
        min-width: 85px;
        text-align: right;
        // color: #c0c0c0;
      }
    }
    .pro-w-67 {
      width: 67%;
    }
  }

  .product-desc{
    word-break: break-all;
  }
  .download {
    color: #3778FF;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
