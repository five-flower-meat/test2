<template>
  <div class="requirement-create">
    <div class="m-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/requirement/manage' }">需求创建管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增需求</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="m-container info-block">
      <el-form :model="requirement"
        ref="baseForm"
        :rules="baseInfoRules"
        label-width="130px"
        key="baseForm">
        <div class="block">
          <el-form-item label="需求客户"
            prop="organizeName"
            key="org-group">
            <el-autocomplete key="org-group_code-input"
              v-model="requirement.organizeName"
              placeholder="集团名称/编码"
              :fetch-suggestions="querySearchAsync"
              :trigger-on-focus="false"
              @select="handleSelect"></el-autocomplete>
          </el-form-item>
          <el-form-item label="需求类型"
            prop="reqType"
            key="requirement-type">
            <el-radio-group v-model="requirement.reqType"
              @change="changeReqType">
              <el-radio label="0">日常需求</el-radio>
              <el-radio label="1">投诉需求</el-radio>
              <el-radio label="2">物料需求</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="requirement.reqType === '1' || requirement.reqType === '0'">
            <el-form-item label="需求描述"
              prop="reqDesc"
              key="requirementDesc">
              <el-input v-model="requirement.reqDesc"
                :maxlength="500"
                type="textarea"
                placeholder="简要描述一下需求"
                key="requirementDesc-input"></el-input>
            </el-form-item>
            <el-form-item label="需求附件"
              prop="uploadFiles"
              key="provinceId1">
              <!-- <el-upload
                  :limit="FILE_MAX_COUNT"
                  class="upload-demo"
                  :on-change="handleChange"
                  :on-remove="handleRemove"
                  :on-exceed="handleExceed"
                  :auto-upload="false"
                  :file-list="uploadFiles">
                  <el-button size="small" type="default"><i class="icon-up margin-right-8"></i>选择文件</el-button>
                  <div slot="tip" class="el-upload__tip">
                    <p class="lh1-5">{{FILE_TIP[0]}}</p>
                    <p class="lh1-5">{{FILE_TIP[1]}}</p>
                  </div>
                </el-upload> -->

              <uploads v-model="requirement.fileInputId"
                :file-list="requirement.uploadFiles"
                :file-type-id="FILE_TYPE_ID.requirement"/>

            </el-form-item>
          </template>
          <!-- 物料需求 -->
          <template v-if="requirement.reqType === '2'">
            <el-form-item label="物料名称"
              prop="materialName"
              key="materialName">
              <el-input v-model="requirement.materialName"
                :maxlength="20"
                placeholder="请输入物料名称"
                key="materialName-input"></el-input>
            </el-form-item>
            <el-form-item label="物料格式要求"
              prop="materialSupplyType"
              key="materialSupplyType">
              <el-input class="col-input"
                v-model="requirement.materialSupplyType"
                placeholder="请输入物料格式要求"
                :maxlength="50"
                key="materialType-input">
              </el-input>
            </el-form-item>
            <el-form-item label="物料使用时间"
              required
              key="materialTime">
              <el-col :span="11">
                <el-form-item prop="materialUseCreateTime">
                  <el-date-picker key="materialUseCreateTime"
                    type="date"
                    placeholder="选择日期"
                    v-model="requirement.materialUseCreateTime"
                    :editable="false"
                    :picker-options="startOptions"
                    value-format="yyyy-MM-dd"
                    style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line"
                :span="2"></el-col>
              <el-col :span="11">
                <el-form-item prop="materialUseEndTime">
                  <el-date-picker key="materialUseEndTime"
                    type="date"
                    placeholder="选择日期"
                    v-model="requirement.materialUseEndTime"
                    :editable="false"
                    :picker-options="endOptions"
                    value-format="yyyy-MM-dd"
                    style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="物料描述"
              prop="materialDesc"
              key="materialDesc">
              <el-input v-model="requirement.materialDesc"
                :maxlength="500"
                type="textarea"
                placeholder="请输入物料描述"
                key="materialDesc-input"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="联系人"
            required
            key="contact">
            <el-row>
              <el-col :span="11">
                <el-form-item prop="contactName"
                  key="contactName">
                  <el-input class="col-input"
                    v-model="requirement.contactName"
                    placeholder="姓名"
                    :maxlength="6"
                    key="contact-name-input"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line-container"
                :span="1">
                <div class="line">
                </div>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="contactMobile"
                  key="contactMobile">
                  <el-input class="col-input"
                    v-model="requirement.contactMobile"
                    placeholder="手机号"
                    :maxlength="11"
                    key="contactMobile-input"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item key="contact-llll">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="contactEmail"
                  key="contact-email">
                  <el-input class="col-input"
                    v-model="requirement.contactEmail"
                    placeholder="邮箱"
                    :maxlength="35"
                    key="contact-email-input"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <div class="line"></div>
        <div class="block processor-info">
          <el-form-item label="指派处理人"
            required
            key="processor-group">
            <el-col :span="16">
              <el-form-item prop="processor"
                key="processor">
                <el-select v-model="requirement.processor"
                  placeholder="请选择指派处理人">
                  <el-option v-for="(item, index) in processors"
                    :key="index"
                    :value="item.operatorId"
                    :label="item.staffName" />
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col class="line-container checkbox-sms" :span="7">
                <el-checkbox v-model="checked">短信提醒他</el-checkbox>
              </el-col> -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
              @click="submitRequirement()">提交处理</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
// import endsWith from 'lodash/endsWith';
import mixins from './mixins';
import { FILE_TYPE_ID } from '@/config/index.js';
import Uploads from 'components/upload/Uploads.vue';
// import {
//   FILE_ACCEPT,
//   FILE_TIP,
//   FILE_MAX_COUNT,
//   FILE_MAX_SIZE,
//   FILE_ERROR_TIP
// } from '@/config';

export default {
  name: 'RequirementCreate',
  mixins: [mixins],
  components: {
    Uploads
  },
  data() {
    // const that = this;
    return {
      // FILE_TIP,
      // FILE_MAX_COUNT,
      FILE_TYPE_ID,
      // isSubmit: false,
      requirement: {
        orgId: '',
        reqType: '0',
        fileInputId: '',
        needSms: '0',
        uploadFiles: [],
      },
      processor: [],
      checked: false,
      extraData: {
      },
      // uploadData: {
      //   fileInputId: '',
      //   fileTypeId: FILE_TYPE_ID.requirement,
      //   moduleId: 1,
      //   expireDate: '',
      //   effectiveDate: '',
      //   files: []
      // },
      startOptions: {
        disabledDate: time => {
          if (this.requirement.materialUseEndTime) {
            return time.getTime() > new Date(this.requirement.materialUseEndTime).getTime();
          }
        }
      },
      endOptions: {
        disabledDate: time => {
          if (this.requirement.materialUseCreateTime) {
            return time.getTime() < new Date(this.requirement.materialUseCreateTime).getTime();
          }
        }
      },
    };
  },
  computed: {
    ...mapState({
      processors: ({ requirement }) => requirement.createProcessors
    })
  },
  watch: {
    checked(newVal) {
      this.requirement.needSms = newVal ? '1' : '0';
    }
  },
  created() {
    this.queryRequirementCreateProcessors();
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
    changeReqType(val) {
      if (val === '2') {
        this.clearRequirement();
      } else {
        this.clearMaterial();
      }
    },
    clearFile() {
      this.requirement.uploadFiles = [];
    },
    clearRequirement() {
      const { requirement } = this;
      requirement.reqDesc = '';
      this.clearFile();
    },
    /**
     * 清除输入的 物料需求信息
     */
    clearMaterial() {
      const { requirement } = this;
      requirement.materialName = '';
      requirement.materialSupplyType = '';
      requirement.materialUseCreateTime = '';
      requirement.materialUseEndTime = '';
      requirement.materialDesc = '';
    },
    // handleExceed() {
    //   this.$message({
    //     message: `文件上传数量不能超过${FILE_MAX_COUNT}个`,
    //     type: 'error'
    //   });
    // },
    // handleChange(file, fileList) {
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
    //   } else {
    //     this.$refs.baseForm.validateField('uploadFiles');
    //   }

    //   return result;
    // },
    // handleRemove(file, fileList) {
    //   const that = this;
    //   const {uploadFiles} = that;

    //   uploadFiles.splice(0, uploadFiles.length);

    //   for (let item of fileList) {
    //     uploadFiles.push(item.raw);
    //   }

    //   this.$refs.baseForm.validateField('uploadFiles');
    // },
    submitRequirement() {
      // const { uploadFiles } = this;
      let params = Object.cloneDeep(this.requirement);
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          // this.isSubmit = true;

          // if (uploadFiles && uploadFiles.length) {
          //   this.getProductFileId().then((res) => {
          //     let fileInputId = res.data;
          //     uploadData.files = uploadFiles;
          //     uploadData.fileInputId = fileInputId;
          //     this.requirement.fileInputId = fileInputId;
          //     this.uploadProductScheme(uploadData).then(() => {
          //       delete this.requirement.uploadFiles;
          //       this.saveRequirement(this.requirement);
          //     });
          //   });
          // } else {
          //   delete this.requirement.uploadFiles;
          //   this.saveRequirement(this.requirement);
          // }

          delete params.uploadFiles;
          this.saveRequirement(params);
        }
      });
    },
    ...mapActions([
      'saveRequirement',
      'queryRequirementCreateProcessors',
      'getProductFileId',
      'uploadProductScheme'
    ])
  }
};
</script>
<style lang="scss" src="./style.scss"></style>
