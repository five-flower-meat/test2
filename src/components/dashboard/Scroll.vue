<template>
  <div class="box">
    <ul ref="content"
      :class="{anim:animate==true}">
      <li v-for="item in items"
        :key="item.id"
        class="clickable"
        @click="redirectTrain(item)">
        <u>{{item.trainTheme}}</u>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      default: () => [],
      type: Array,
    }
  },
  data() {
    return {
      cycleTime: 5000,
      animate: false,
      timeout: null,
      setTime: null,
    };
  },
  created() {
    this.timeout = setInterval(this.scroll, this.cycleTime);
  },
  beforeDestroy() {
    clearInterval(this.timeout);
    clearTimeout(this.setTime);
  },
  methods: {
    redirectTrain(item) {
      this.$router.push(`/train/apply-center/detail/${item.id}`);
    },

    scroll() {
      let content = this.$refs.content;
      content.style.marginTop = '-20px';
      this.animate = !this.animate;
      this.setTime = setTimeout(() => {
        this.items.push(this.items[0]);
        this.items.shift();
        content.style.marginTop = '0px';
        // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
        this.animate = !this.animate;
      }, 500);
    }
  }
};
</script>

<style scoped>
.box {
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  padding-left: 20px;
  transition: all 0.5s;
}
.anim {
  transition: all 0.5s;
}
.content li {
  list-style: none;
  line-height: 20px;
  height: 20px;
}
</style>
