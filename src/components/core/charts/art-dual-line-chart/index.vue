<!-- 双折线对比图 -->
<template>
  <div
    ref="chartRef"
    class="relative w-full"
    :style="{ height: props.height }"
    v-loading="props.loading"
  >
  </div>
</template>

<script setup lang="ts">
  import type { EChartsOption } from '@/plugins/echarts'
  import { useChartOps, useChartComponent } from '@/hooks/core/useChart'
  import type { BaseChartProps, InteractionProps } from '@/types/component/chart'

  defineOptions({ name: 'ArtDualLineChart' })

  interface DualLineChartProps extends BaseChartProps, InteractionProps {
    data1: number[]
    data2: number[]
    xAxisData: string[]
    legend1?: string
    legend2?: string
    showPoints?: boolean
    smooth?: boolean
  }

  const props = withDefaults(defineProps<DualLineChartProps>(), {
    height: '400px',
    loading: false,
    isEmpty: false,
    legend1: '数据1',
    legend2: '数据2',
    showPoints: true,
    smooth: true,
    showLegend: true,
    legendPosition: 'top'
  })

  const { chartRef, isDark, getAnimationConfig, getTooltipStyle, getLegendStyle } =
    useChartComponent({
      props,
      checkEmpty: () => {
        return (
          (!props.data1?.length && !props.data2?.length) ||
          (props.data1.every((v) => v === 0) && props.data2.every((v) => v === 0))
        )
      },
      watchSources: [() => props.data1, () => props.data2, () => props.xAxisData],
      generateOptions: (): EChartsOption => {
        const option: EChartsOption = {
          tooltip: props.showLegend
            ? getTooltipStyle('axis', {
                trigger: 'axis'
              })
            : undefined,
          legend: props.showLegend
            ? {
                data: [props.legend1, props.legend2],
                top: 0,
                left: 'center',
                textStyle: {
                  color: isDark.value ? '#ccc' : '#666'
                }
              }
            : undefined,
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: props.showLegend ? '40px' : '20px',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: props.xAxisData,
            axisLine: {
              lineStyle: {
                color: isDark.value ? '#4a4a4a' : '#e5e7eb'
              }
            },
            axisLabel: {
              color: isDark.value ? '#999' : '#666'
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false
            },
            axisLabel: {
              color: isDark.value ? '#999' : '#666'
            },
            splitLine: {
              lineStyle: {
                color: isDark.value ? '#333' : '#f0f0f0',
                type: 'dashed'
              }
            }
          },
          series: [
            {
              name: props.legend1,
              type: 'line',
              smooth: props.smooth,
              symbol: props.showPoints ? 'circle' : 'none',
              symbolSize: 6,
              data: props.data1,
              lineStyle: {
                width: 2.5,
                color: '#5DADE2'
              },
              itemStyle: {
                color: '#5DADE2'
              },
              ...getAnimationConfig()
            },
            {
              name: props.legend2,
              type: 'line',
              smooth: props.smooth,
              symbol: props.showPoints ? 'circle' : 'none',
              symbolSize: 6,
              data: props.data2,
              lineStyle: {
                width: 2.5,
                color: '#48C9B0'
              },
              itemStyle: {
                color: '#48C9B0'
              },
              ...getAnimationConfig()
            }
          ]
        }

        return option
      }
    })
</script>
