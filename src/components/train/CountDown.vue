<template>
  <div>
    <div v-if="totalTime >= 0">
      还剩
      <span class="content">{{content}}</span>
      {{isStart ? '开始' : '结束'}}
    </div>
    <div v-else>
      课程已结束
    </div>
  </div>
</template>

<script>
export default {
  props: {
    startTime: String,
    currentTime: String,
    isStart: Number,
  },
  data() {
    const { startTime, currentTime } = this;
    let totalTime = startTime && currentTime
      ? new Date(startTime).getTime() - new Date(currentTime).getTime()
      : null;
    return {
      content: '',
      totalTime, // 时间戳
      timeout: null,
    };
  },
  beforeMount() {
    this.countDown();
  },
  beforeDestroy() {
    clearInterval(this.timeout);
  },
  methods: {
    // 每个一分钟计算一次剩余时间
    countDown() {
      this.content = this.transforTime(this.totalTime);
      // this.totalTime = 600 * 1000;
      this.timeout = setInterval(() => {
        if (this.totalTime < 0) {
          clearInterval(this.timeout);
        }
        this.totalTime = this.totalTime - 1000 * 60;
        this.content = this.transforTime(this.totalTime);
      }, 1000 * 60);
    },

    transforTime(time) {
      time = parseInt(time / 1000);
      let days = parseInt(time / 86400);
      let hours = parseInt((time - days * 86400) / 3600);
      let minutes = parseInt((time - days * 86400 - hours * 3600) / 60);
      return `${days}天${hours}时${minutes}分`;
    },
  }
};
</script>

<style scoped>
.content {
  font-weight: bold;
}
</style>
