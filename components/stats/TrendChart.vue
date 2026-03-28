<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { TrendItem } from '~/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps<{
  data: TrendItem[]
}>()

const colorMode = useColorMode()

const isDark = computed(() => colorMode.preference === 'dark' || colorMode.value === 'dark')

const chartData = computed(() => ({
  labels: props.data.map((item) => {
    const d = new Date(item.date)
    return `${d.getMonth() + 1}/${d.getDate()}`
  }),
  datasets: [
    {
      label: '浏览量 (PV)',
      data: props.data.map((item) => item.pv),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 5,
    },
    {
      label: '独立访客 (UV)',
      data: props.data.map((item) => item.uv),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 5,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: isDark.value ? '#a8a29e' : '#78716c',
        font: { size: 12 },
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    tooltip: {
      backgroundColor: isDark.value ? '#292524' : '#fff',
      titleColor: isDark.value ? '#fafaf9' : '#1c1917',
      bodyColor: isDark.value ? '#a8a29e' : '#57534e',
      borderColor: isDark.value ? '#44403c' : '#e7e5e4',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: {
        color: isDark.value ? 'rgba(68, 64, 60, 0.3)' : 'rgba(231, 229, 228, 0.5)',
      },
      ticks: {
        color: isDark.value ? '#a8a29e' : '#78716c',
        font: { size: 11 },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: isDark.value ? 'rgba(68, 64, 60, 0.3)' : 'rgba(231, 229, 228, 0.5)',
      },
      ticks: {
        color: isDark.value ? '#a8a29e' : '#78716c',
        font: { size: 11 },
      },
    },
  },
}))
</script>

<template>
  <div class="trend-chart">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped lang="scss">
.trend-chart {
  height: 300px;
  position: relative;
}
</style>
