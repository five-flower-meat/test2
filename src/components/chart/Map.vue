<template>
  <div :style="{width: typeof width === 'number' ? `${width}px` : width , height:`${height}px` }"
    :id="id"></div>
</template>

<script>
import G2 from '@antv/g2';
import DataSet from '@antv/data-set';
import { mapData } from '@/config/china.js';

const colorRange = '#A7CEF6-#79B6F6-#4A9EF7-#0087F5';
// const colorRange = '#D7E6FD-#A7CEF6-#79B6F6-#4A9EF7-#0087F5';

export default {
  data() {
    return {
      chart: null,
      mapData
    };
  },
  props: {
    charData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    width: {
      type: Number | String
      // default: 500
    },
    height: {
      type: Number,
      default: 500
    },
    id: String
  },
  mounted() {
    this.drawChart(this.charData);
  },
  watch: {
    charData(val, oldVal) {
      this.drawChart(val);
    }
  },
  methods: {
    drawChart(data) {
      data = data.map(val => {
        return {
          '省份': val.name,
          '数量': val.value,
        };
      });
      this.chart && this.chart.destroy();

      const { height, id, mapData } = this;
      this.chart = new G2.Chart({
        container: id,
        forceFit: true,
        height: height,
        padding: [10, 20, 70, 10]
      });
      this.chart.tooltip({
        showTitle: false
      });
      // 同步度量
      this.chart.scale({
        longitude: {
          sync: true
        },
        latitude: {
          sync: true
        }
      });
      this.chart.axis(false);
      this.chart.legend('trend', {
        position: 'left'
      });

      // 绘制世界地图背景
      var ds = new DataSet();
      var worldMap = ds.createView('back').source(mapData, {
        type: 'GeoJSON'
      });
      var worldMapView = this.chart.view();
      worldMapView.source(worldMap);
      worldMapView.tooltip(false);
      worldMapView.polygon().position('longitude*latitude').style({
        fill: '#D7E6FD',
        stroke: '#ccc',
        lineWidth: 1
      });

      // 可视化用户数据
      var userDv = ds.createView().source(data).transform({
        geoDataView: worldMap,
        field: '省份',
        type: 'geo.region',
        as: ['longitude', 'latitude']
      }).transform({
        type: 'map',
        callback: function callback(obj) {
          return obj;
        }
      });
      var userView = this.chart.view();
      userView.source(userDv, {
        'trend': {}
      });
      userView.polygon().position('longitude*latitude').opacity('数量').tooltip('省份*数量').animate({
        leave: {
          animation: 'fadeOut'
        }
      }).color('数量', colorRange);

      this.chart.render();
    }
  }
};
</script>

<style>
</style>
