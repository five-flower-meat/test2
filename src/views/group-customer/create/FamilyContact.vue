<template>
  <div class="family-contact_container">
    <el-form-item
      :prop="'contactFamilyDtoList.' + index + '.name'"
      :rules="{
        validator: familyNameValidator, trigger: 'blur'
      }">
      <el-input v-model="familyContact.name"
        placeholder="姓名"
        key="name"
        :maxlength="6"></el-input>
    </el-form-item>
    <span class="line"></span>
    <el-form-item
      :prop="'contactFamilyDtoList.' + index + '.relationship'"
      :rules="{
        validator: familyRelationshipValidator, trigger: 'blur'
      }">
      <el-input v-model="familyContact.relationship"
        placeholder="与本人关系"
        key="relation"
        :maxlength="10"></el-input>
    </el-form-item>
    <span class="line"></span>
    <el-form-item style="width: 305px"
      :prop="'contactFamilyDtoList.' + index + '.remark'"
      :rules="{
        validator: familyNoteValidator, trigger: 'blur'
      }">
      <el-input v-model="familyContact.remark" style="width: 280px"
        placeholder="备注信息"
        key="remark"
        :maxlength="50"></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    familyContact: {
      type: Object,
      default() {
        return {};
      }
    },
    index: {
      type: Number
    }
  },
  methods: {
    isEmpty() {
      const {familyContact} = this;
      let count = 0;
      if (familyContact.name) {
        count += 1;
      }

      if (familyContact.relationship) {
        count += 1;
      }

      if (familyContact.jobDuty) {
        count += 1;
      }

      if (familyContact.mobile) {
        count += 1;
      }
      return count === 0;
    },
    isNotEmpty() {
      return this.isEmpty();
    },
    /**
     * 家庭成员-姓名 校验规则
     *
     * @param {Object} rule 规则
     * @param {Object} value 值
     * @param {Function} callback 回调函数
     */
    familyNameValidator(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入姓名'));
      } else if (!String(value).trim()) {
        callback(new Error('请输入姓名'));
      } else {
        callback();
      }
      // if (!this.isEmpty() && !value) {
      //   callback(new Error('请输入姓名'));
      // } else {
      //   callback();
      // }
    },

    /**
     * 家庭成员-与本人关系 校验规则
     *
     * @param {Object} rule 规则
     * @param {Object} value 值
     * @param {Function} callback 回调函数
     */
    familyRelationshipValidator(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入与本人关系'));
      } else if (!String(value).trim()) {
        callback(new Error('请输入与本人关系'));
      } else {
        callback();
      }
      // if (!this.isEmpty() && !value && value.trim()) {
      //   callback(new Error('请输入与本人关系'));
      // } else {
      //   callback();
      // }
    },
    /**
     * 家庭成员-工作职务 校验规则
     *
     * @param {Object} rule 规则
     * @param {Object} value 值
     * @param {Function} callback 回调函数
     */
    familyJobValidator(rule, value, callback) {
      if (!this.isEmpty() && !value) {
        callback(new Error('请输入工作职务'));
      } else {
        callback();
      }
    },
    /**
     * 家庭成员-联系电话 校验规则
     *
     * @param {Object} rule 规则
     * @param {Object} value 值
     * @param {Function} callback 回调函数
     */
    familyMobileValidator(rule, value, callback) {
      if (!this.isEmpty() && !value) {
        callback(new Error('请输入联系电话'));
      } else if (!!value && !/^1\d{10}$/.test(value)) {
        callback(new Error('请输入正确的联系电话'));
      } else {
        callback();
      }
    },

    /**
     * 家庭成员-备注 校验规则
     *
     * @param {Object} rule 规则
     * @param {Object} value 值
     * @param {Function} callback 回调函数
     */
    familyNoteValidator(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入备注信息'));
      } else if (!String(value).trim()) {
        callback(new Error('请输入备注信息'));
      } else {
        callback();
      }
    }
  }
};
</script>
<style lang="scss">
.family-contact_container{
  display: flex;
  align-items: center;
  margin-bottom: 22px;

  .el-form-item{
    width: 101px;
  }

  .family-contact-mobile{
    width: 120px;
  }

  .family-contact_split{
    width: 13px;
    height: 2px;
    border-top: 2px solid rgba(0, 0, 0, 0.25);
  }
}
</style>
