<template>
  <div>
    <div v-if="trainCreate.timetableDateDtoList.length">
      <!-- {{trainCreate.timetableDateDtoList}} -->
      <el-tabs class="train-step2-tab"
        v-model="editableTabsValue"
        type="border-card">
        <el-tab-pane v-for="item in trainCreate.timetableDateDtoList"
          :key="item.timetableDate"
          :label="item.timetableDate"
          :name="item.timetableDate">
          <div v-for="(cItem, ci) in item.timetableTopicDtoList"
            :key="ci"
            class="c-item-form">

            <div @click="minusLine(ci)"
              class="train-minus-line cursor-pointer"
              v-if="item.timetableTopicDtoList.length > 1">
              <el-tooltip effect="dark"
                content="删除议题"
                placement="top-start">
                <i class="el-icon-delete"></i>
              </el-tooltip>
            </div>

            <el-form :model="cItem"
              ref="cItemForm"
              :rules="cItemRules"
              label-width="140px">
              <el-form-item label="议题名称："
                prop="topic">
                <el-input class="form-input-medium"
                  v-model="cItem.topic"
                  placeholder="请输入议题名称" />
              </el-form-item>

              <el-form-item class="margin-top-16"
                label="培训内容：">
                <div v-for="(gItem, gi) in cItem.timetableDtoList"
                  :key="gi"
                  class="g-item-form">
                  <el-form label-width="0px"
                    :model="gItem"
                    ref="gItemForm"
                    :rules="gItemRules">
                    <el-form-item>
                      <el-form-item style="display: inline-block"
                        prop="date">
                        <el-time-picker is-range
                          v-model="gItem.date"
                          @change="timeTransfor(ci, gi)"
                          range-separator="至"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          placeholder="选择时间范围">
                        </el-time-picker>
                      </el-form-item>

                      <div class="form-input-sep">-</div>

                      <el-form-item style="display: inline-block"
                        prop="trainer">
                        <el-input class="form-input-128"
                          v-model="gItem.trainer"
                          placeholder="讲师" />
                      </el-form-item>

                      <div class="form-input-sep">-</div>

                      <el-form-item style="display: inline-block"
                        prop="title">
                        <el-input class="form-input-medium"
                          v-model="gItem.title"
                          placeholder="请输入培训主题" />
                      </el-form-item>

                      <div class="form-input-sep">
                        <span v-if="cItem.timetableDtoList.length - 1 === gi"
                          class="clickable cursor-pointer"
                          @click="addItem(ci)">
                          <i class="el-icon-circle-plus-outline icontype-medium"></i>
                        </span>
                        <span v-if="cItem.timetableDtoList.length > 1"
                          class="clickable cursor-pointer"
                          @click="reduceItem(ci, gi)">
                          <i class="el-icon-remove-outline icontype-medium"></i>
                        </span>
                      </div>
                    </el-form-item>
                    <el-form-item style="margin-top: 8px;">
                      <train-upload :fileTypeId="FILE_TYPE_ID.trainCourseware"
                        v-model="gItem.fileInputId"
                        :fileInputId="gItem.fileInputId"
                        @change="file => changeCourseFileName(file, ci, gi)"
                        @remove="removeCourseFileName(ci, gi)"
                        :fileName="gItem.fileName"
                        :isUploaded="gItem.fileName ? true : false" />
                    </el-form-item>
                  </el-form>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="train-addline">
        <el-button type="text"
          @click="addLine()">
          <i class="el-icon-plus"></i> 添加议题
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { checkMultRulesIndexOf } from '@/utils/common.js';
import TrainUpload from 'components/Upload.vue';
import { FILE_TYPE_ID } from '@/config/index.js';
import { textAccountLimit, textNameLimit, textareaLimit } from '@/utils/rules.js';
import dayjs from 'dayjs';

export default {
  components: {
    TrainUpload
  },
  data() {
    const isEqual = (rule, value, callback) => {
      if (value && value.length) {
        const _isEqual = new Date(value[0]).getTime() === new Date(value[1]).getTime();
        if (_isEqual) {
          callback(new Error('时间不能相同'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      FILE_TYPE_ID,
      editableTabsValue: '',
      cItemRules: {
        topic: [
          { required: true, message: '请输入议题名称', trigger: 'blur' },
          { validator: textAccountLimit, trigger: 'blur' },
        ]
      },
      gItemRules: {
        date: [
          { required: true, message: '请输入时间范围', trigger: 'blur' },
          { validator: isEqual, trigger: 'blur' }
        ],
        trainer: [
          { required: true, message: '请输入讲师', trigger: 'blur' },
          { validator: textNameLimit, trigger: 'blur' },
        ],
        title: [
          { required: true, message: '请输入培训主题', trigger: 'blur' },
          { validator: textareaLimit, trigger: 'blur' },
        ]
      }
    };
  },
  computed: {
    ...mapState({
      trainCreate: ({ train }) => train.trainCreate,
      isNormalizeTime: ({ train }) => train.isNormalizeTime,
      cItemObj: ({ train }) => train.cItemObj,
      gItemObj: ({ train }) => train.gItemObj,
    })
  },
  beforeMount() {
    // 当培训时间值没有改变，就不会触发第二步的更新
    if (!this.isNormalizeTime) {
      this.transforFirstTab(this.trainCreate.timetableDateDtoList[0].timetableDate);
      return false;
    }

    // 初始化时间队列里的数据
    this.clearRefsItemObj();

    // 添加所有数据
    let times = this.splitTime();
    this.addTimeObj(times);
  },
  methods: {
    changeCourseFileName(file, ci, gi) {
      this.trainChangeCourseFileName({
        time: this.editableTabsValue,
        ci,
        gi,
        fileName: file.raw.name
      });
    },

    removeCourseFileName(ci, gi) {
      this.trainChangeCourseFileName({
        time: this.editableTabsValue,
        ci,
        gi,
        fileName: ''
      });
    },

    timeTransfor(ci, gi) {
      this.trainTimeTransfor({
        ci,
        gi,
        time: this.editableTabsValue,
      });
    },

    addLine() {
      this.trainCreateAddLine(this.editableTabsValue);
    },

    minusLine(index) {
      this.trainCreateMinusLine({
        time: this.editableTabsValue,
        index
      });
    },

    reduceItem(ci, gi) {
      this.trainCreateReduceItem({
        time: this.editableTabsValue,
        index: ci,
        childIndex: gi,
      });
    },

    addItem(ci) {
      this.trainCreateAddItem({
        time: this.editableTabsValue,
        index: ci,
      });
    },

    transforFirstTab(value) {
      this.editableTabsValue = value;
    },

    splitTime() {
      if (!this.trainCreate.trainDate.length) {
        return [];
      }

      if (!this.editableTabsValue) {
        this.transforFirstTab(this.trainCreate.trainDate[0]);
      }
      let times = [];
      let oneDay = 1000 * 60 * 60 * 24;
      let startTime = new Date(this.trainCreate.trainDate[0]).getTime();
      let endTime = new Date(this.trainCreate.trainDate[1]).getTime();

      // 遍历时间戳
      for (let i = startTime; i <= endTime; i = i + oneDay) {
        let newDate = dayjs(new Date(i)).format('YYYY-MM-DD');
        times.push(newDate);
      }
      return times;
    },

    validate() {
      const { timetableDateDtoList } = this.trainCreate;
      let cItemCheckIndexOf = checkMultRulesIndexOf(this.$refs['cItemForm']);
      let gItemCheckIndexOf = checkMultRulesIndexOf(this.$refs['gItemForm']);

      if (cItemCheckIndexOf !== -1) {
        let index = timetableDateDtoList.findIndex(val => val.timetableDate === this.cItemObj[cItemCheckIndexOf]);
        this.transforFirstTab(timetableDateDtoList[index].timetableDate);
        return false;
      }

      if (gItemCheckIndexOf !== -1) {
        let gIndex = timetableDateDtoList.findIndex(val => val.timetableDate === this.gItemObj[gItemCheckIndexOf]);
        this.transforFirstTab(timetableDateDtoList[gIndex].timetableDate);
        return false;
      }
      return true;
    },

    ...mapActions([
    ]),

    ...mapMutations({
      trainCreateAddLine: 'TRAIN_CREATE_ADD_LINE',
      addTimeObj: 'TRAIN_ADD_TIME_OBJ',
      trainCreateAddItem: 'TRAIN_CREATE_ADD_ITEM',
      trainCreateReduceItem: 'TRAIN_CREATE_REDUCE_ITEM',
      trainCreateMinusLine: 'TRAIN_CREATE_MINUS_LINE',
      clearRefsItemObj: 'TRAIN_CLEAR_REFS_ITEM_OBJ',
      trainTimeTransfor: 'TRAIN_TIME_TRANSFOR',
      trainChangeCourseFileName: 'TRAIN_CHANGE_COURSE_FILE_NAME',
    })
  }
};
</script>

<style lang="scss">
.train-addline {
  border: 1px solid #dcdfe6;
  border-top: 0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.train-step2-tab {
  box-shadow: none;
  -webkit-box-shadow: none;
}
.icontype-medium {
  font-size: 16px;
}
.c-item-form + .c-item-form {
  border-top: 1px solid #dcdfe6;
  padding-top: 16px;
}
.c-item-form {
  position: relative;
}
.train-minus-line {
  position: absolute;
  right: 0;
  font-size: 16px;
  z-index: 99;
}
</style>
