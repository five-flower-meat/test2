import find from 'lodash/find';
import {mapActions} from 'vuex';
import CustomerContacts from './CustomerContacts.vue';
import Steps from '@/components/Steps.vue';
import Step from '@/components/Step.vue';
import {
  isEmpty as emptyValidator
} from '@/utils/rules';
export default {
  components: {
    CustomerContacts,
    Steps,
    Step,
  },
  data() {
    return {
      step: 0,
      isAddingContact: false,
      dateOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime();
        }
      },
      baseInfoRules: {
        organizeName: [
          { required: true, message: '请输入集团名称', trigger: 'blur' },
          { min: 1, max: 50, message: '集团名称过长，长度 50 个字符内', trigger: 'blur' },
          { validator: emptyValidator, trigger: 'blur' }
        ],
        organizeType: [
          { required: true, message: '请选择集团属性', trigger: 'change' }
        ],
        establishTime: [
          { required: true, message: '请选择成立日期', trigger: 'change' }
        ],
        provinceId: [
          // { required: true, message: '请选择所属省份', trigger: 'change' }
        ],
        orgIndustryType: [
          { required: true, message: '请选择机构类型', trigger: 'change' }
        ],
        industryType: [
          { required: true, message: '请选择行业类别', trigger: 'change' }
        ],
        memberNum: [
          { required: true, message: '请选择集团客户规模', trigger: 'change' }
        ],
        orgAdvantage: [
          { required: true, message: '请输入优势能力', trigger: 'blur' },
          { validator: emptyValidator, trigger: 'blur' }
        ],
        businessScope: [
          { required: true, message: '请输入经营范围', trigger: 'blur' },
          { validator: emptyValidator, trigger: 'blur' }
        ],
        orgAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { validator: emptyValidator, trigger: 'blur' }
        ],
        registerNum: [
          { type: 'string', pattern: /^\d{13}$/, message: '请输入13位数字', trigger: 'blur' }
        ],
        socialCreditCode: [
          { type: 'string', pattern: /^[A-Z\d]{18}$/, message: '请输入18位数字或大写英文字母', trigger: 'blur' }
        ],
        businessTerm: [
          { type: 'string', pattern: /^[1-9]\d{0,2}$/, message: '请输入整数', trigger: 'blur' }
        ],
        registerFund: [
          {
            type: 'string',
            pattern: /^((([1-9][0-9]{0,7})([.]\d{1,4})?)|(0\.\d{1,4}))$/,
            message: '请输入整数或者浮点数，小数点后最多4位',
            trigger: 'blur'
          }
        ]
      },
      managerRules: {
        managerName: [
          { required: true, message: '请输入客户经理', trigger: 'blur' },
          { min: 1, max: 6, message: '请输入6个以内字符', trigger: 'blur' },
          { validator: emptyValidator, trigger: ['blur', 'change'] }
        ],
        managerMobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { type: 'string', pattern: /^1\d{10}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        managerNo: [
          { required: true, message: '请输入员工工号', trigger: 'blur' },
          { type: 'string', pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' }
        ],
        managerDepartment: [
          { required: true, message: '请输入所在部门', trigger: 'blur' },
          { validator: emptyValidator, trigger: 'blur' }
        ],
        managerPosition: [
          { required: true, message: '请输入所在职位', trigger: 'blur' },
          { validator: emptyValidator, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    contacts() {
      return this.customer.contactDtoList;
    }
  },
  methods: {
    isFirstStep() {
      return this.step === 0;
    },
    isSecondStep() {
      return this.step === 1;
    },
    isThirdStep() {
      return this.step === 2;
    },
    toFirstStep() {
      this.step = 0;
    },
    toSecondStep() {
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          this.step = 1;
          if (!this.contacts.length) {
            this.isAddingContact = true;
          }
        }
      });
    },
    toSecondStepFromThird() {
      this.step = 1;
      if (!this.contacts.length) {
        this.isAddingContact = true;
      }
    },
    isNotAbleToThirdStep() {
      return this.isAddingContact || !this.contacts.length;
    },
    toThirdStep() {
      this.step = 2;
    },
    addContact() {
      this.isAddingContact = true;
    },
    cancelAddingContact() {
      this.isAddingContact = false;
    },
    handleDeleteContact(index, id) {
      let filters = this.contacts.filter(val => Number(val.parentContactId) === Number(id));
      if (filters.length) {
        this.$message({
          message: `已经被选为上级，不可删除`,
          type: 'warning'
        });
      } else {
        this.contacts.splice(index, 1);
      }
    },
    handleEditContact(contact, index) {
      this.isAddingContact = true;
      this.$nextTick(() => {
        this.$refs.customerContacts.init(contact, index);
      });
    },
    /**
     *
     * 选择上级领导时，进行判断
     *
     * @param {*} index 当前联系人在表格中的索引值
     * @param {*} contactId 当前联系人ID
     */
    changeContactParent(index, contactId) {
      const {contacts} = this;
      // 当前选中的上级领导ID
      let parentContactId = contacts[index].parentContactId;

      // let filters = contacts.filter(contacts, { 'parentContactId': contactId, 'contactId': parentContactId });
      let filters = contacts.filter(val => {
        return Number(val.parentContactId) === Number(contactId) && Number(val.contactId) === Number(parentContactId);
      });

      if (filters.length) {
        this.$message({
          message: `不能与“${filters[0].name}”互选为上级`,
          type: 'warning'
        });
        contacts[index].parentContactId = '';

        return false;
      }

      let parents = [];

      /**
       * 找出联系人的所有父节点ID
       * @param {*} contacts
       * @param {*} contactId
       */
      function findParents(contacts, contactId) {
        let contact = find(contacts, {'contactId': contactId});
        if (contact.parentContactId) {
          parents.push(contact.parentContactId);
          findParents(contacts, contact.parentContactId);
        }
      }

      // 必须要清除，否则会导致死循环
      contacts[index].parentContactId = '';
      findParents(contacts, parentContactId);
      if (parents.indexOf(contactId) >= 0) {
        this.$message({
          message: `不能将下属选为上级`,
          type: 'warning'
        });
      } else {
        contacts[index].parentContactId = parentContactId;
      }
    },
    querySearchAsync(queryString, cb) {
      this.queryCustomerManagers(queryString).then((res) => {
        cb(res.data);
      });
    },
    handleSelect(item) {
      this.customer.managerName = item.staffName;

      if (item.mobile) {
        this.customer.managerMobile = item.mobile;
      }

      if (item.operatorId) {
        this.customer.managerNo = `${item.operatorId}`;
      }

      if (item.postion) {
        this.customer.managerPosition = item.postion;
      }
    },
    ...mapActions(['queryCustomerManagers'])
  }
};
