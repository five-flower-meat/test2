import { PAGE_NO, PAGE_SIZE } from '@/config/index.js';
import { checkPhone, textareaLimit, textareaMaxLimit } from '@/utils/rules.js';

export default {
  data() {
    const noTextareaMaxLimit = (rule, value, callback) => {
      if (String(value).trim().length > 500) {
        callback(new Error(`输入内容字符不能超过500`));
      } else {
        callback();
      }
    };
    const noTextareaLimit = (rule, value, callback) => {
      if (String(value).trim().length > 50) {
        callback(new Error(`输入内容字符不能超过50`));
      } else {
        callback();
      }
    };
    const textLimit = (rule, value, callback) => {
      if (String(value).trim() === '') {
        callback(new Error('输入内容不能为空'));
      } else if (String(value).trim().length > 25) {
        callback(new Error(`输入内容字符不能超过25`));
      } else {
        callback();
      }
    };
    const textFormat = (rule, value, callback) => {
      let reg = /^[A-Za-z0-9\u4e00-\u9fa5??;]+[?!;]$/;
      if (String(value).trim() === '') {
        callback(new Error('输入内容不能为空'));
      } else if (String(value).trim().length > 50) {
        callback(new Error(`输入内容字符不能超过50`));
      } else if (reg.test(value) || (!reg.test(value) && value.indexOf(';;') !== -1)) {
        callback(new Error(`输入格式不正确`));
      } else {
        callback();
      }
    };
    const processorValid = (rule, value, callback) => {
      if (value.processor.length === 0) {
        callback(new Error(`请选择指派人`));
      } else {
        callback();
      }
      console.log(value);
      console.log(this.createAppointFrom.regionData.processor);
    };
    return {
      pageNo: PAGE_NO,
      pageSize: PAGE_SIZE,
      createVisitVaild: {
        visitTheme: [
          { required: true, message: '请输入走访主题', trigger: ['change', 'blur'] },
          { validator: textLimit, trigger: 'blur' }
        ],
        organizeName: [
          { required: true, message: '请输入公司名称', trigger: ['change', 'blur'] },
          { validator: textLimit, trigger: 'blur' }
        ],
        visitAddress: [
          { required: true, message: '请输入公司地址', trigger: ['change', 'blur'] },
          { validator: textareaLimit, trigger: 'blur' }
        ],
        intervieweeName: [
          { required: true, message: '请输入走访对象姓名', trigger: ['change', 'blur'] },
          { validator: textareaLimit, trigger: 'blur' }
        ],
        intervieweeMobile: [
          { required: true, message: '请输入联系电话', trigger: ['change', 'blur'] },
          { validator: checkPhone, trigger: 'blur' }
        ],
        visitPresentMembers: [
          { required: true, message: '请输入我方出席人员', trigger: ['change', 'blur'] },
          { validator: textFormat, trigger: 'blur' }
        ],
        visitContent: [
          { required: true, message: '请输入走访内容', trigger: ['change', 'blur'] },
          { validator: textareaMaxLimit, trigger: 'blur' }
        ],
        relOpporCode: [
          { validator: noTextareaLimit, trigger: 'blur' }
        ],
        problemCoordinate: [
          { message: '请输入问题协调', trigger: 'blur' },
          { validator: noTextareaMaxLimit, trigger: 'blur' }
        ],
        isFirstVisit: [
          { required: true, message: '请选择是否首客走访', trigger: ['change', 'blur'] }
        ],
        visitTime: [
          { required: true, message: '请选择日期', trigger: ['change', 'blur'] }
        ],
        timeRange: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        assignNote: [
          { required: true, message: '请输入指派说明', trigger: ['change', 'blur'] },
          { validator: textareaMaxLimit, trigger: 'blur' }
        ],
        processor: [
          { required: true, message: '请选择指派人', trigger: 'blur' }
        ],
        regionData: [
          { required: true, message: '请选择指派人', trigger: 'blur' },
          { validator: processorValid, trigger: 'change' }
        ]
      }
    };
  }
};
