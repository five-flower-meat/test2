<template>
  <div class="customer-audit-management">
    <div class="m-container query-block">
      <el-form class="form-manage">
        <div class="flex">
          <el-form-item class="form-query-input-width">
            <el-select v-model="organizeType" clearable placeholder="集团属性">
              <el-option v-for="(item, i) in ORGANIZE_TYPE" :key="i" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
          <!--<el-form-item class="form-query-input-width form-left-width" prop="roleId">
            <el-select v-model="provinceId" clearable placeholder="所属省份">
              <el-option v-for="(item, i) in provinces" :key="i" :value="item.key" :label="item.value" />
            </el-select>
          </el-form-item>-->

          <!--<el-form-item class="form-query-input-width form-left-width" prop="staffName">
            <el-input v-model="managerName" placeholder="客户经理" clearable/>
          </el-form-item>-->

          <el-form-item class="form-query-input-width form-left-width" prop="code">
            <el-input v-model="otherField" placeholder="集团名称/编码" clearable />
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item class="form-left-width">
            <el-button type="primary" @click="query">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="待审核" name="first"></el-tab-pane>
        <el-tab-pane label="审核通过" name="second"></el-tab-pane>
        <el-tab-pane label="审核不通过" name="third"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="m-container table-container">
      <wm-table
        :source="groupCustomerList.list"
        :total="groupCustomerList.totalCount"
        :pageNo="pageNo"
        :pageSize="pageSize"
        @onPagination="onPagination"
        @onSizePagination="onSizePagination">
        <el-table-column label="集团编码" property="organizeCode" />
        <el-table-column label="集团名称" property="organizeName">
        </el-table-column>
        <el-table-column label="集团属性" property="organizeType" >
        </el-table-column>
        <!--<el-table-column label="所属省份" property="provinceId">
        </el-table-column>-->
        <el-table-column label="创建人" property="operatorName"/>
        <el-table-column label="审核状态" property="businessStatus" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-if="activeName === 'first'" @click="handleAudit(scope.row)">
              去审核
            </el-button>
            <el-button type="text" v-else @click="handleDetail(scope.row)">
              查看主页
            </el-button>
          </template>
        </el-table-column>
      </wm-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { createHelpers } from 'vuex-map-fields';

import WmTable from 'components/Table.vue';
import filters from './filters';

const { mapFields } = createHelpers({
  getterType: 'getCustomerField',
  mutationType: 'updateCustomerField'
});
export default {
  components: {
    WmTable
  },
  mixins: [filters],
  data() {
    return {
      STATUS: {
        'first': '-1',
        'second': '1',
        'third': '0'
      }
    };
  },
  computed: {
    ...mapState({
      groupCustomerList: ({ groupCustomer }) => groupCustomer.groupCustomerList
    }),
    ...mapFields([
      'auditQuery.organizeType',
      'auditQuery.provinceId',
      'auditQuery.managerName',
      'auditQuery.otherField',
      'auditQuery.businessStatus',
      'auditQuery.pageNo',
      'auditQuery.pageSize',
      'auditQuery.activeName'
    ])
  },
  beforeMount() {
    this.query();
  },
  methods: {
    onPagination(value) {
      this.pageNo = value;
      this.query();
    },
    onSizePagination(value) {
      this.pageSize = value;
      this.query();
    },
    handleDetail(row) {
      this.$router.push(`/group-customer/audit/detail/${row.organizeId}`);
    },
    handleAudit(row) {
      this.$router.push(`/group-customer/audit/${row.organizeId}/${row.taskInsId}`);
    },
    getParams() {
      const {
        pageNo,
        pageSize,
        organizeType,
        provinceId,
        otherField,
        managerName
      } = this;

      return {
        pageNo,
        pageSize,
        organizeType,
        provinceId,
        otherField,
        managerName,
        businessStatus: this.STATUS[this.activeName]
      };
    },
    query() {
      const params = this.getParams();
      this.queryCustomerAuditList(params);
    },
    handleClick() {
      this.pageNo = 1;
      this.query();
    },
    ...mapActions([
      'queryCustomerAuditList'
    ])
  }
};
</script>

<style lang="scss">
@import "scss/variables.scss";
</style>
