import DetailInfo from './DetailInfo.vue';
import {mapActions} from 'vuex';

export default {
  components: {
    DetailInfo
  },
  data() {
    return {
      showMore: false
    };
  },
  computed: {
    customer() {
      return this.$store.getters.groupCustomer;
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.queryCustomerSnapshot(this.$route.params.id).then(() => {
        this.$nextTick(() => {
          let list = document.querySelectorAll('.el-table__expand-icon');
          for (let dom of list) {
            dom.innerHTML = '详情<i class="el-icon el-icon-arrow-right"></i>';
          }
        });
      });
    },
    ...mapActions(['queryCustomerSnapshot'])
  }
};
