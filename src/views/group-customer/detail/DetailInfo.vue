<template>
  <div class="customer-detail_info">
      <audit-steps v-if="customer.processInsId && processes.length" :processList="processes" />
      <div class="block-title base-info_title">
        基本信息
        <span class="base-info_title-sub" v-if="customer.visibleRange" @click="showMore = !showMore">更多信息</span>
        <!--<span class="base-info_title-sub" v-else>更多信息</span>-->
      </div>
      <div class="block-info">
        <el-row>
          <el-col :span="8">
            <span class="info_label">集团名称：</span>
            <span class="info_content">{{customer.organizeName}}</span>
          </el-col>
          <el-col :span="8">
            <span class="info_label">集团属性：</span>
            <span class="info_content">{{customer.organizeTypeValue}}</span>
          </el-col>
          <el-col :span="8">
            <span class="info_label">所属省份：</span>
            <span class="info_content">{{customer.provinceName}}</span>
          </el-col>
        </el-row>
        <el-row>
          <!--<el-col :span="8">
            <span class="info_label">成立时间：</span>
            <span class="info_content">{{formateDate(customer.establishTime)}}</span>
          </el-col>-->
          <el-col :span="8">
            <span class="info_label">机构类型：</span>
            <span class="info_content">{{customer.orgIndustryTypeValue}}</span>
          </el-col>
          <el-col :span="16">
            <span class="info_label">行业类别：</span>
            <span class="info_content">{{customer.industryTypeValue}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="info_label">集团规模：</span>
            <span class="info_content">{{customer.memberNumValue}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="info_label">公司标签：</span>
            <div class="info_content">{{customer.label}}</div>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="24">
            <span class="info_label">经营范围：</span>
            <div class="info_content">{{customer.businessScope}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="info_label">办公地址：</span>
            <div class="info_content">{{customer.orgAddress}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="info_label">优势能力：</span>
            <div class="info_content">{{customer.orgAdvantage}}</div>
          </el-col>
        </el-row>
        <div v-if="showMore" class="more-info">
          <el-row>
            <el-col :span="8">
              <span class="info_label">工商注册号：</span>
              <span class="info_content">{{customer.registerNum}}</span>
            </el-col>
            <el-col :span="8">
              <span class="info_label">证件类型：</span>
              <span class="info_content">{{customer.certificateTypeValue}}</span>
            </el-col>
            <el-col :span="8">
              <span class="info_label">统一社会信用代码：</span>
              <span class="info_content">{{customer.socialCreditCode}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <span class="info_label">注册资金类型：</span>
              <span class="info_content">{{customer.registerFundTypeValue}}</span>
            </el-col>
            <el-col :span="8">
              <span class="info_label">注册资金：</span>
              <span class="info_content">{{customer.registerFund}}万元</span>
            </el-col>
            <el-col :span="8">
              <span class="info_label">经营期限：</span>
              <span class="info_content">{{customer.businessTerm}}年</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <span class="info_label">登记机关：</span>
              <span class="info_content">{{customer.registrateOrg}}</span>
            </el-col>
            <el-col :span="8">
              <span class="info_label">发证日期：</span>
              <span class="info_content">{{formateDate(customer.openTime)}}</span>
            </el-col>
            <el-col :span="8">
              <span class="info_label">证件地址：</span>
              <span class="info_content">{{customer.certificateAddress}}</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="block-title">
        联系人
      </div>
      <div>
        <el-table
          border
          :data="contacts">
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <!--<el-table-column
            prop="mobile"
            label="手机">
          </el-table-column>-->
          <el-table-column
            prop="genderValue"
            label="性别">
          </el-table-column>
          <el-table-column
            prop="department"
            label="部门">
          </el-table-column>
          <el-table-column
            prop="position"
            label="职位">
          </el-table-column>
          <el-table-column
            prop="parentContactId"
            label="上级领导">
            <template slot-scope="props">
              {{parentContact(props.row.parentContactId)}}
            </template>
          </el-table-column>
          <el-table-column type="expand" label="操作" width="100px">
            <template slot-scope="props" v-if="props.row.visibleRange">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="姓名">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="部门">
                  <span>{{ props.row.department }}</span>
                </el-form-item>
                <el-form-item label="出生年月">
                  <span>{{ props.row.birthDate }}</span>
                </el-form-item>
                <el-form-item label="职位">
                  <span>{{ props.row.position }}</span>
                </el-form-item>
                <el-form-item label="性别">
                  <span>{{ props.row.genderValue}}</span>
                </el-form-item>
                <el-form-item label="手机号">
                  <span>{{ props.row.mobile }}</span>
                </el-form-item>
                <el-form-item label="婚姻状况">
                  <span>{{ maritalFilter(props.row.maritalStatusValue)}}</span>
                </el-form-item>
                <el-form-item label="邮箱">
                  <span>{{ props.row.email }}</span>
                </el-form-item>
                <el-form-item label="管理范畴" class="full-desc">
                  <span>{{ props.row.manageScope }}</span>
                </el-form-item>
                <el-form-item label="工作职责" class="full-desc">
                  <span>{{ props.row.responsibility }}</span>
                </el-form-item>
                <el-form-item label="兴趣爱好" class="full-desc">
                  <span>{{ props.row.interests }}</span>
                </el-form-item>
                <el-form-item label="家庭成员" class="full-desc">
                  <span>{{ familyContact(props.row.contactFamilyDtoList) }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <!--<el-table-column label="操作" width="100px">
            <template slot-scope="props">
             <div style="text-align:center;color: #666;font-size: 12px;margin-left:5px;"><span>详细</span><i class="el-icon-arrow-down"></i></div>
            </template>
          </el-table-column>-->
        </el-table>
      </div>
      <div class="block-title">
        客户经理
      </div>
      <div class="block-info">
        <el-row>
          <el-col :span="8">
            <span class="info_label">客户经理：</span>
            <span class="info_content">{{customer.managerName}}</span>
          </el-col>
          <el-col :span="8">
            <span class="info_label">手机号码：</span>
            <span class="info_content">{{customer.managerMobile}}</span>
          </el-col>
          <el-col :span="8">
            <span class="info_label">员工编号：</span>
            <span class="info_content">{{customer.managerNo}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="info_label">所在部门：</span>
            <span class="info_content">{{customer.managerDepartment}}</span>
          </el-col>
          <el-col :span="8">
            <span class="info_label">所在职位：</span>
            <span class="info_content">{{customer.managerPosition}}</span>
          </el-col>
        </el-row>
      </div>
    </div>
</template>
<script>
import find from 'lodash/find';
import {mapActions} from 'vuex';
import filters from '../filters.js';
import AuditSteps from 'components/AuditSteps.vue';
export default {
  name: 'DetailInfo',
  mixins: [filters],
  components: {
    AuditSteps
  },
  props: {
    customer: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    contacts() {
      return this.customer.contactDtoList || [];
    },
    processes() {
      return this.$store.getters.processes;
    }
  },
  data() {
    return {
      showMore: false
    };
  },
  watch: {
    customer() {
      this.initProcesses();
    }
  },
  methods: {
    parentContact(parentId) {
      let result = '-';
      if (parentId) {
        let contact = find(this.contacts, {contactId: parentId});

        result = contact ? contact.name : result;
      }

      return result;
    },
    familyContact(contacts) {
      let result = '';
      if (contacts && contacts.length) {
        for (let contact of contacts) {
          result += `${contact.name}，${contact.relationship}，${contact.remark}；`;
        }
      }

      return result;
    },
    initProcesses() {
      if (this.customer.processInsId) {
        this.queryProcesses(this.customer.processInsId);
      }
    },
    ...mapActions([
      'queryProcesses'
    ])
  }
};
</script>
<style lang="scss">
@import '@/assets/scss/variables.scss';
  .customer-detail_audit,
  .customer-detail_info{
    background: #FFFFFF;
    margin-top: 16px;
  }

  .customer-detail_audit{
    margin-top: 16px;
    padding: 24px 0 10px 0;

    .el-textarea{
      width: $formLargeWidth;
    }
  }

  .customer-detail_info{
    padding: 32px;

    .base-info_title{
      display: flex;
      justify-content: space-between;
    }

    .base-info_title-sub{
      color: $primary-color;
      font-size: 14px;
      cursor: pointer;
    }

    .block-title{
      margin: 32px  0 16px 0 ;
      height: 24px;
      line-height: 24px;
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;
    }

    .block-info{
      .el-row{
        line-height: 1.25;
        margin-bottom: 16px;
        &:last-child{
          margin-bottom: 0;
        }
      }

      .el-col{
        display: flex;
      }

      .info_label{
        min-width: 90px;
        max-width: 130px;
        height: 20px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }

      .info_content{
        flex: 1;
        line-height: 1.25;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        word-break: break-all;
      }
    }

    .demo-table-expand label {
      width: 90px;
      color: rgba(0, 0, 0, 0.45);
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }

    .demo-table-expand {
      font-size: 0;

      .full-desc{
        width: 100%;
        word-break: break-all;
      }
    }

    .el-table__expand-column{
      .el-icon{
        margin-left: 16px;
        transform: rotate(90deg);
        transition: transform .2s ease-in-out;
      }

      .el-table__expand-icon--expanded {
        transform: rotate(0);

        .el-icon{
          transform: rotate(-90deg);
          transition: transform .2s ease-in-out;
        }
      }
    }
  }
</style>
