<template>
  <div class="chart" v-if="show">
    <ECharts :options="option" theme="irs"></ECharts>
    <div class="conversion">
      <p>{{ `------转化率：${(funnelData.rate1*100).toFixed(3)}%` }}</p>
      <p>{{ `------转化率: ${(funnelData.rate2*100).toFixed(3)}%` }}</p>
    </div>
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
import 'echarts/lib/chart/funnel'
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
    funnelData: Object,
  },
  methods: {
    changeEchart(val) {
      this.radioVal = val;
      this.$emit('change-channel', val);
    }
  },
  watch: {
    data(data) {
      data.map(item => {
        item.type = 'funnel'
      })
      const max = Math.max.apply(Math, data.map(item => {
        return item.value
      }));
      const min = Math.min.apply(Math, data.map(item => {
        return item.value
      }));

      this.option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'item',
          extraCssText: option.extraCssText,
          textStyle: {
            fontSize: 12
          },
          formatter: function(params) {
            const tooltip = `<div style="${option.tipBodyCss}">
                      <i style="${option.tipBodyCircle}background: ${params.color}"></i>
                      ${params.name}: ${params.value.toFixed(3)}
                    </div>`;
            return tooltip
          }
        },
        legend: {
          data: data.map(({ name }) => name),
          y:'bottom',
          itemWidth:14,
          itemheight:12
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        },
        series: {
          name: '漏斗图',
          type: 'funnel',
          left: '10%',
          right: '10%',
          width: '80%',
          maxSize: '60%',
          sort: 'descending',
          gap: 10,
          label: {
            normal: {
              show: true,
              position: 'inside'
            },
            emphasis: {
              textStyle: {
                fontSize: 20
              }
            }
          },
          labelLine: {
            normal: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#fff',
              borderWidth: 1
            }
          },
          data: data
        }
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
