<template>
  <div class="product-create">
    <div class="m-container">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/product/product-creat-manage' }">产品创建管理</el-breadcrumb-item>
        <el-breadcrumb-item>新建产品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="m-container info-block">
      <el-form class="base-info"
        :model="product"
        :rules="baseFormRules"
        ref="baseForm"
        label-width="120px">
        <el-form-item label="产品名称"
          prop="productName">
          <el-input class="form-input-240"
            v-model="product.productName"
            :maxlength="25"
            placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="主营市场"
          prop="mainMarketArr">
          <el-checkbox-group v-model="product.mainMarketArr">
            <el-checkbox v-for="item in marketList"
              :label="item"
              :key="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="产品类别"
          prop="productType">
          <el-select class="form-input-240"
            v-model="product.productType"
            placeholder="请选择产品类别">
            <el-option label="卡类"
              value="1"></el-option>
            <el-option label="衍生品类"
              value="2"></el-option>
            <el-option label="活动类"
              value="3"></el-option>
            <el-option label="智能硬件类"
              value="4"></el-option>
            <el-option label="会员"
              value="5"></el-option>
            <el-option label="其他"
              value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品介绍:"
          prop="description">
          <el-input v-model="product.description"
            :maxlength="500"
            :rows="3"
            resize="none"
            type="textarea"
            placeholder="请输入产品介绍"></el-input>
        </el-form-item>
        <el-form-item label="价格策略:">
          <el-input :maxlength="500"
            resize="none"
            type="textarea"
            v-model="product.priceStrategy"
            placeholder="请输入介绍"></el-input>
        </el-form-item>
        <el-form-item label="商务策略:">
          <el-input :maxlength="500"
            resize="none"
            type="textarea"
            v-model="product.commercialStrategy"
            placeholder="请输入介绍"></el-input>
        </el-form-item>
        <el-form-item label="产品归属:"
          class="col-item">
          <el-col :span="11">
            <el-form-item>
              <el-select v-model="product.belongToCompany"
                placeholder="选择产品归属"
                @change="selectBelongToCompany">
                <el-option label="无"
                  value="无"></el-option>
                <el-option label="核心能力清单"
                  value="核心能力清单"></el-option>
                <el-option label="一级集采目录"
                  value="一级集采目录"></el-option>
                <el-option label="二级集采目录"
                  value="二级集采目录"></el-option>
                <el-option label="终端库"
                  value="终端库"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <div v-if="isFirstLevel">
            <el-col class="line-container"
              :span="2">
              <div class="line"></div>
            </el-col>
            <el-col :span="11">
              <el-form-item>
                <el-cascader placeholder="类别"
                  v-if="firstCollectionType"
                  :options="firstCollectionType"
                  v-model="product.secondOption"
                  @change="changeFirstCollectType">
                </el-cascader>
              </el-form-item>
            </el-col>
          </div>
          <div v-if="isCoreCompetency">
            <el-col class="line-container"
              :span="2">
              <div class="line"></div>
            </el-col>
            <el-col :span="11">
              <el-form-item>
                <el-select v-model="product.secondOption"
                  placeholder="核心能力"
                  @change="selectCoreAbility">
                  <el-option v-for="item in coreAbilityType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
        </el-form-item>
        <el-form-item v-if="isCoreCompetency || isFirstLevel">
          <el-col :span="24">
            <el-form-item>
              <el-select class="form-input-320"
                v-model="product.specificProduct"
                placeholder="具体能力及产品">
                <!--specificProductList-->
                <el-option v-for="item in specProductList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="产品对接人:"
          class="col-item"
          required>
          <el-col :span="11">
            <el-form-item prop="broker">
              <el-select v-model="product.broker"
                placeholder="对接人"
                @change="selectBroker">
                <el-option v-for="item in brokerList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line-container"
            :span="2">
            <div class="line"></div>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="mobile">
              <el-input v-model="product.mobile"
                :maxlength="11"
                placeholder="手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item prop="deptment">
              <el-input v-model="product.deptment"
                :maxlength="15"
                placeholder="部门"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line-container"
            :span="2">
            <div class="line"></div>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="position">
              <el-input v-model="product.position"
                :maxlength="15"
                placeholder="岗位"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="产品资料">
          <!-- <el-upload class="upload-files"
            :limit="FILE_MAX_COUNT"
            :auto-upload="false"
            :on-change="handleChangeFile"
            :on-remove="handleRemoveFile"
            :on-exceed="handleExceed"
            :file-list="uploadFiles">
            <el-button slot="trigger"
              size="small"
              class="form-input-128">
              <i class="icon-up margin-right-8"></i>上传文件
            </el-button>
            <div slot="tip"
              class="el-upload__tip">
              <p class="lh1-5">{{FILE_TIP[0]}}</p>
              <p class="lh1-5">{{FILE_TIP[1]}}</p>
            </div>
          </el-upload> -->

          <uploads v-model="product.productFileid"
            :file-list="uploadFiles"
            :file-type-id="FILE_TYPE_ID.product" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="toSubmit()">立即提审</el-button>
          <el-button @click="cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import mixins from './mixins';
import { FILE_TYPE_ID } from '@/config/index.js';
// import endsWith from 'lodash/endsWith';
// import { fileBeforeUpload } from '@/utils/common.js';
import Uploads from 'components/upload/Uploads.vue';
// import {
//   FILE_ACCEPT,
//   FILE_TIP,
//   FILE_MAX_COUNT,
//   FILE_MAX_SIZE,
//   FILE_ERROR_TIP
// } from '@/config';

export default {
  name: 'ProductCreate',
  mixins: [mixins],
  components: {
    Uploads,
  },
  data() {
    return {
      FILE_TYPE_ID,
      // step: 0,
      product: {
        salesList: [],
        mainMarketArr: [],
        broker: '',
        productFileid: '',
      },
      isSubmit: false,
      // FILE_TIP,
      // FILE_MAX_COUNT,
      index: -1,
      productCase: {
        salesType: '0',
        composedProduct: []
      },
      uploadFiles: [],
      // 用于保存，修改产品时， 修改销售案例删除的方案文件
      // deleteFiles: [],
      // newFiles: [],
      marketList: ['政企市场', '家庭市场', '个人市场'],
      selMarket: [],
      isFirstLevel: false,
      isCoreCompetency: false,
      specificProductList: [],
      list: [],
      secondOption: ''
    };
  },
  computed: {
    cases() {
      return this.product.salesList;
    },
    ...mapState({
      firstCollectList: ({ product }) => product.firstCollectList,
      coreAbilityList: ({ product }) => product.coreAbilityList,
      firstCollectionType: ({ product }) => product.firstCollectionType,
      brokerList: ({ product }) => product.brokerList,
      coreAbilityType: ({ product }) => product.coreAbilityType,
      specProductList: ({ product }) => product.specProductList
    })
  },
  beforeMount() {
    this.getFirstCatalog();
    this.getCoreAbility();
    this.getBroker();
  },
  methods: {
    // isAcceptable(fileName) {
    //   for (let accept of FILE_ACCEPT) {
    //     if (endsWith(fileName.toLowerCase(), accept)) {
    //       return true;
    //     }
    //   }
    //   return false;
    // },
    // handleExceed() {
    //   this.$message({
    //     message: `文件上传数量不能超过${FILE_MAX_COUNT}个`,
    //     type: 'error'
    //   });
    // },
    // handleChangeFile(file, fileList) {
    //   // 添加文件上传文件的验证
    //   if (fileBeforeUpload.call(this, file, fileList)) return false;

    //   let fileName = file.name;
    //   let result = true;
    //   if (this.isAcceptable(fileName)) {
    //     let fileSize = file.size / (1024 * 1024);

    //     if (fileSize > FILE_MAX_SIZE) {
    //       this.$message({
    //         message: `附件超过${FILE_MAX_SIZE}M`,
    //         type: 'error'
    //       });

    //       result = false;
    //     } else {
    //       this.uploadFiles.push(file.raw);
    //     }
    //   } else {
    //     this.$message({
    //       message: FILE_ERROR_TIP,
    //       type: 'error'
    //     });
    //     result = false;
    //   }

    //   if (!result) {
    //     fileList.pop();
    //   }

    //   return result;
    // },
    // handleRemoveFile(file, fileList) {
    //   const that = this;
    //   const { uploadFiles } = that;

    //   uploadFiles.splice(0, uploadFiles.length);

    //   for (let item of fileList) {
    //     uploadFiles.push(item);
    //   }

    //   if (file.elecInstId) {
    //     this.deleteFiles.push(file);
    //   }
    // },
    submitProduct() {
      this.saveProduct(this.product);
    },

    // submitProduct() {
    //   const that = this;
    //   const { cases } = that;
    //   that.isSubmit = true;

    //   // 有方案附件, 先上传文件
    //   if (this.hasFiles(cases)) {
    //     let promises = [];
    //     for (let productCase of cases) {
    //       let files = productCase.files;
    //       if (files && files.length) {
    //         let promise = new Promise((resolve, reject) => {
    //           that.getProductFileId().then((res) => {
    //             let fileInputId = res.data;

    //             let uploadData = {
    //               fileInputId,
    //               fileTypeId: FILE_TYPE_ID.product,
    //               moduleId: 1,
    //               expireDate: '',
    //               effectiveDate: '',
    //               files: []
    //             };
    //             uploadData.files = files;
    //             that.uploadProductScheme(uploadData).then(() => {
    //               productCase.fileInputId = fileInputId;
    //               resolve();
    //             }, (err) => {
    //               reject(new Error(err));
    //             });
    //           }, (err) => {
    //             reject(new Error(err));
    //           });
    //         });

    //         promises.push(promise);
    //       }
    //     }

    //     Promise.all(promises).then(() => {
    //       for (let productCase of cases) {
    //         delete productCase.files;
    //         delete productCase.deleteFiles;
    //       }
    //       this.saveProduct(this.product).then(() => {
    //       }, () => {
    //         that.isSubmit = false;
    //       });
    //     }, () => {
    //       that.isSubmit = false;
    //     });
    //   } else {
    //     this.saveProduct(this.product).then(() => {
    //     }, () => {
    //       that.isSubmit = false;
    //     });
    //   }
    // },

    /**
     * 判断销售案例中是否有方案附件
     */
    // hasFiles(cases) {
    //   for (let productCase of cases) {
    //     let files = productCase.files;
    //     if (files && files.length) {
    //       return true;
    //     }
    //   }

    //   return false;
    // },
    selectBelongToCompany() {
      if (this.product.belongToCompany === '一级集采目录') {
        if (this.product.secondOption) {
          this.product.secondOption = [];
        }
        if (this.product.specificProduct) {
          this.product.specificProduct = '';
        }
        this.getFirstCatalogType().then(res => {
          this.isCoreCompetency = false;
          this.isFirstLevel = true;
        });
      } else if (this.product.belongToCompany === '核心能力清单') {
        if (this.product.secondOption) {
          this.product.secondOption = '';
        }
        if (this.product.specificProduct) {
          this.product.specificProduct = '';
        }
        this.getCoreAbilityType();
        this.isCoreCompetency = true;
        this.isFirstLevel = false;
      } else {
        this.product.secondOption = [];
        if (this.product.specificProduct) {
          this.product.specificProduct = '';
        }
        this.isFirstLevel = false;
        this.isCoreCompetency = false;
      }
      let obj = {};
      obj.codeType = '';
      obj.parentCode = '';
      this.getSpecProductList(obj);
    },
    selectCoreAbility(item) {
      if (this.product.specificProduct) {
        this.product.specificProduct = '';
      }
      let obj = {};
      obj.codeType = 'CORE_ABILITY';
      obj.parentCode = this.product.secondOption;
      this.getSpecProductList(obj);
      let arr = [];
      arr.push(item);
      this.product.secondOptionAbility = arr;
    },
    changeFirstCollectType(item) {
      if (this.product.specificProduct) {
        this.product.specificProduct = [];
      }
      let type = this.product.secondOption[2];
      let obj = {};
      obj.codeType = 'FIRST_COLLECTION';
      obj.parentCode = type;
      this.getSpecProductList(obj);
      this.firstCollectionType.map(val => {
        if (val.children) {
          val.children.map(val => {
            if (val.children) {
              val.children.map(val => {
                if (val.value === type) {
                  this.product.secondOptionStr = val.label;
                }
              });
            };
          });
        };
      });
    },
    selectBroker(item) {
      this.brokerList.map(val => {
        if (val.value === item) {
          this.product.mobile = val.mobile;
        }
      });
    },
    ...mapActions([
      'saveProduct',
      'getFirstCatalog',
      'getCoreAbility',
      'getFirstCatalogType',
      'getBroker',
      'getCoreAbilityType',
      'getSpecProductList'
    ])
  }
};
</script>

<style lang="scss" src="./style.scss"></style>
<style lang="scss">
.product-type {
  .el-select-dropdown {
    height: 100px;
  }
}
</style>
