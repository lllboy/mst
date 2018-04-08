<template>
  <div class="chart" v-if="show">
    <ECharts :options="option" theme="irs"></ECharts>
  </div>
</template>

<script>
import option from '@/echarts/echartTooltip'
import { formatLegend } from '@/echarts/echartFormat'
import ECharts from 'vue-echarts/components/ECharts.vue'
import theme from '@/echarts/theme.json'
ECharts.registerTheme('irs', theme)
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/chart/line'
export default {
  name: 'trend-chart',
  components: {
    ECharts
  },
  props: {
    show: {
      type: Boolean
    },
    data: Array,
    xAxis: Array
  },
  watch: {
    data(data) {
      data.map(item => {
        item.type = 'line'
      })
      const type = this.$route.meta.type;
      let name = '';
      switch (type) {
        case 'download':
          name = '下载量';
          break;
        case 'install':
          name = '安装量';
          break;
        case 'active':
          name = '活跃量';
          break;
        case 'unload':
          name = '卸载量';
          break;
        case 'freq':
          name = '使用频次';
          break;
        case 'time':
          name = '使用时长';
          break;
        default:
          break;
      }
      this.option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          extraCssText: option.extraCssText,
          textStyle: {
            fontSize: 12
          },
          formatter: function(params) {
            let tooltip = `<div style ="${option.tipHeaderCss}"> ${params[0].name} </div>`;
            for (let i = 0; i < params.length; i++) {
              tooltip += `<div style="${option.tipBodyCss}">
                      <i style="${option.tipBodyCircle}background: ${params[i].color}"></i>
                      ${params[i].seriesName}<br>
                      ${name}:&nbsp;&nbsp;${(params[i].value).toFixed(3)}&nbsp;&nbsp;&nbsp;&nbsp;环比:&nbsp;&nbsp;${((params[i].data.hb) * 100).toFixed(3)}%
                    </div>`;
            }
            return tooltip
          }
        },
        legend: {
          data: this.data.map(({ name }) => name)
        },
        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxis,
          axisLabel: {
            interval: 0,
            margin: 6,
            formatter: function(value, index) {
              if (index % 2 === 0) {
                return value;
              } else {
                return '';
              }
            }
          },
        },
        yAxis: {
          type: 'value'
        },
        series: this.data
      }
    }
  },
  data() {
    return {
      option: {}
    }
  }
}
</script>

<style>

</style>
