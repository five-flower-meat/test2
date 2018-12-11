<template>
  <div>
    <el-pagination v-if="total"
      class="paginationSty"
      :layout="paginationLayout"
      @current-change="onPagination"
      @size-change="onSizePagination"
      :current-page="pageNo"
      :page-size="pageSize"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    pageNo: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    paginationLayout: {
      type: String,
      default: 'total,sizes,prev, pager, next, jumper'
    }
  },
  methods: {
    onPagination(pageNo) {
      this.$emit('onPagination', pageNo);
    },
    onSizePagination(pageSize) {
      this.$emit('onSizePagination', pageSize);
    },
  }
};
</script>

<style>
.paginationSty {
  margin-top: 20px;
  text-align: right;
  margin-right: 20px;
}
</style>
