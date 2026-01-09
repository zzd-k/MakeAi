<!-- 环形图（甜甜圈图） -->
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
  import type { EChartsOption, PieDataItem } from '@/plugins/echarts'
  import { useChartOps, useChartComponent } from '@/hooks/core/useChart'
  import type { BaseChartProps, InteractionProps } from '@/types/component/chart'

  defineOptions({ name: 'ArtDoughnutChart' })

  interface DoughnutChartProps extends BaseChartProps, InteractionProps {
    data: number[]
    labels: string[]
    showLabel?: boolean
  }

  const props = withDefaults(defineProps<DoughnutChartProps>(), {
    height: '400px',
    loading: false,
    isEmpty: false,
    colors: () => ['#5DADE2', '#48C9B0', '#85C1E2', '#AED6F1'],
    showLegend: true,
    showLabel: true,
    legendPosition: 'right'
  })

  const { chartRef, isDark, getAnimationConfig } = useChartComponent({
    props,
    checkEmpty: () => {
      return !props.data?.length || props.data.every((item) => item === 0)
    },
    watchSources: [() => props.data, () => props.labels],
    generateOptions: (): EChartsOption => {
      const chartData = props.data.map((value, index) => ({
        value,
        name: props.labels[index]
      }))

      const option: EChartsOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: isDark.value ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: isDark.value ? '#555' : '#ddd',
          borderWidth: 1,
          textStyle: {
            color: isDark.value ? '#fff' : '#333'
          }
        },
        legend: props.showLegend
          ? {
              orient: 'vertical',
              right: '10%',
              top: 'center',
              textStyle: {
                color: isDark.value ? '#ccc' : '#666'
              },
              itemWidth: 12,
              itemHeight: 12
            }
          : undefined,
        series: [
          {
            name: '会话类型',
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 8,
              borderColor: isDark.value ? '#2c2c2c' : '#fff',
              borderWidth: 2
            },
            label: {
              show: props.showLabel,
              position: 'outside',
              formatter: '{b}\n{d}%',
              color: isDark.value ? '#ccc' : '#666',
              fontSize: 12
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: props.showLabel,
              length: 15,
              length2: 20
            },
            data: chartData,
            color: props.colors,
            ...getAnimationConfig(),
            animationType: 'expansion'
          }
        ]
      }

      return option
    }
  })
</script>
