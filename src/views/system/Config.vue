<template>
  <div class="m-container configStyle">
    <el-form label-position="right" :model="sysConfigModel" ref="form" label-width="200px" size="small" :rules="configRules">
      <el-form-item label="集团是否二级审核：" prop="orgSecondLevelCheckCodeValue">
        <el-radio-group v-model="sysConfigModel.orgSecondLevelCheckCodeValue">
          <el-radio v-for="item in sysConfigModel.orgSecondLevelCheckChildren" :key="item" :label="item.codeValue">{{item.codeName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商机短信提醒提前天数：" prop="businessSmsForwardDayCodeValue">
        <el-input v-model="sysConfigModel.businessSmsForwardDayCodeValue"></el-input>
      </el-form-item>
      <el-form-item label="走访短信提醒提前天数：" prop="visitSmsForwardDayCodeValue">
        <el-input v-model="sysConfigModel.visitSmsForwardDayCodeValue"></el-input>
      </el-form-item>
      <el-form-item label="走访评价截止天数：" prop="visitEvaluateDeadlineCodeValue">
        <el-input v-model="sysConfigModel.visitEvaluateDeadlineCodeValue"></el-input>
      </el-form-item>
      <el-form-item label="方案评价截止天数：" prop="programmeEvaluateDeadlineCodeValue">
        <el-input v-model="sysConfigModel.programmeEvaluateDeadlineCodeValue"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('sysConfig')">保存</el-button>
        <el-button @click="resetForm()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { isPositive } from '@/utils/rules.js';

export default {
  data() {
    return {
      configRules: {
        businessSmsForwardDayCodeValue: [{ required: true, message: '请输入商机短信提醒提前天数', trigger: 'blur' }, { validator: isPositive, trigger: 'blur' }],
        visitSmsForwardDayCodeValue: [{ required: true, message: '请输入走访短信提醒提前天数', trigger: 'blur' }, { validator: isPositive, trigger: 'blur' }],
        visitEvaluateDeadlineCodeValue: [{ required: true, message: '请输入走访评价截止天数', trigger: 'blur' }, { validator: isPositive, trigger: 'blur' }],
        programmeEvaluateDeadlineCodeValue: [{ required: true, message: '请输入方案评价截止天数', trigger: 'blur' }, { validator: isPositive, trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapState({
      sysConfig: ({ system }) => system.sysConfig,
      sysConfigModel: ({ system }) => system.sysConfigModel
    })
  },
  beforeMount() {
    this.query();
  },
  methods: {
    submitForm(sysConfig) {
      let config = {};
      for (let name of Object.keys(this.sysConfig)) {
        // 比较值是否改变
        if (Object.is(this.sysConfigModel[name + 'CodeValue'], this.sysConfig[name].codeValue)) {
          continue;
        } else {
          config[name] = this.sysConfig[name];
        }
      }
      if (Object.keys(config).length === 0) {
        this.$message({
          message: '无参数改变',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      this.update(config);
    },
    query() {
      let params = {};
      this.getSysConfigList(params);
    },
    update(config) {
      this.$refs.form.validate(valid => {
        if (!valid) return false;

        this.updateSysConfig(config);

        for (let name of Object.keys(this.sysConfig)) {
          this.sysConfig[name].codeValue = this.sysConfigModel[name + 'CodeValue'];
        }
      });
    },
    resetForm() {
      for (let name of Object.keys(this.sysConfig)) {
        this.sysConfigModel[name + 'CodeValue'] = this.sysConfig[name].codeValue;
      }
    },
    ...mapMutations({
      querySysConfig: 'SYS_CONFIG'
    }),
    ...mapActions(['getSysConfigList', 'updateSysConfig'])
  },
};
</script>

<style lang="scss">
@import "scss/variables.scss";
.configStyle {
  display: flex;
  justify-content: left;
}
</style>
