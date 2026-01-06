<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Chart } from 'chart.js/auto'
import { state, totals } from '../store/financeStore'

const canvasRef = ref(null)
let chart
const selectedIndex = ref(null)
const chartMeta = ref({ labels: [], data: [] })

const COLOR_BY_CATEGORY = {
  'Cartão': '#7C3AED',
  'Contas fixas': '#F59E0B',
  'Emergência': '#EF4444',
  'Investimento': '#EC4899',
  'Uso pessoal': '#10B981',
  'Outros': '#3B82F6',
}

function computeCategories() {
  const month = new Date().getMonth()
  const year = new Date().getFullYear()
  const monthExpenses = state.transactions.filter((t) => {
    const d = new Date(t.date)
    return t.type === 'expense' && d.getMonth() === month && d.getFullYear() === year
  })
  const map = new Map()
  for (const t of monthExpenses) {
    const cat = t.category || 'Outros'
    map.set(cat, (map.get(cat) || 0) + t.amount)
  }
  const labels = [...map.keys()]
  const data = [...map.values()]
  return { labels: labels.length ? labels : ['Sem dados'], data: data.length ? data : [1] }
}

function renderChart() {
  const { labels, data } = computeCategories()
  chartMeta.value = { labels, data }
  const total = data.reduce((a, b) => a + Number(b || 0), 0) || 1
  const palette = labels.map((lbl) => COLOR_BY_CATEGORY[lbl] || COLOR_BY_CATEGORY['Outros'])

  if (chart) chart.destroy()
  chart = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: palette,
          borderWidth: 2,
          borderColor: 'rgba(10,18,35,.65)',
          hoverOffset: 8,
        },
      ],
    },
    options: {
      cutout: '78%',
      radius: '92%',
      animation: { duration: 650 },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (ctx) => {
              const v = Number(ctx.raw || 0)
              const pct = Math.round((v / total) * 100)
              return ` ${ctx.label}: R$ ${v.toLocaleString('pt-BR')} (${pct}%)`
            },
          },
        },
      },
    },
  })

  chart.options.onClick = (event) => {
    const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true)
    selectedIndex.value = points.length ? points[0].index : null
    applySelection()
  }

  selectedIndex.value = null
  applySelection()
}

onMounted(renderChart)
watch(() => state.transactions.length, renderChart)

const selectedInfo = computed(() => {
  const { labels, data } = chartMeta.value
  if (selectedIndex.value === null || !labels.length) {
    return { title: 'Gastos', subtitle: 'do mês' }
  }
  const total = data.reduce((a, b) => a + Number(b || 0), 0) || 1
  const value = data[selectedIndex.value] || 0
  const pct = Math.round((value / total) * 100)
  return { title: labels[selectedIndex.value], subtitle: `${pct}%` }
})

function hexToRgba(hex, alpha) {
  const normalized = hex.replace('#', '')
  const bigint = parseInt(normalized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function applySelection() {
  if (!chart) return
  const baseColors = chartMeta.value.labels.map((lbl) => COLOR_BY_CATEGORY[lbl] || COLOR_BY_CATEGORY['Outros'])
  if (selectedIndex.value === null) {
    chart.data.datasets[0].backgroundColor = baseColors
  } else {
    chart.data.datasets[0].backgroundColor = baseColors.map((c, i) =>
      i === selectedIndex.value ? c : hexToRgba(c, 0.35)
    )
  }
  chart.update()
}
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <div class="kpi kpi-balance">
        <div class="kpi-title">Saldo</div>
        <div class="kpi-value">R$ {{ totals.balance.toLocaleString('pt-BR') }}</div>
        <div class="kpi-sub">Total</div>
      </div>

      <div class="kpi kpi-income">
        <div class="kpi-title">Receitas</div>
        <div class="kpi-value">R$ {{ totals.income.toLocaleString('pt-BR') }}</div>
        <div class="kpi-sub">Entrada</div>
      </div>

      <div class="kpi kpi-expense">
        <div class="kpi-title">Despesas</div>
        <div class="kpi-value">R$ {{ totals.expense.toLocaleString('pt-BR') }}</div>
        <div class="kpi-sub">Saída</div>
      </div>

      <div class="kpi kpi-invest">
        <div class="kpi-title">Investimentos</div>
        <div class="kpi-value">R$ {{ totals.invest.toLocaleString('pt-BR') }}</div>
        <div class="kpi-sub">Aportes</div>
      </div>
    </div>

    <div class="rounded-3xl bg-white/10 border border-white/10 backdrop-blur p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="font-semibold">Gastos do mês</div>
        <div class="text-xs text-white/70">por categoria</div>
      </div>
      <div class="relative grid place-items-center">
        <div class="w-64 h-64">
          <canvas ref="canvasRef"></canvas>
        </div>
        <div class="absolute grid place-items-center">
          <div class="centerBadge">
            <div class="text-xs text-white/70">{{ selectedInfo.title }}</div>
            <div class="text-lg font-semibold">{{ selectedInfo.subtitle }}</div>
          </div>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap gap-2 justify-center">
        <div
          v-for="(lbl, i) in computeCategories().labels"
          :key="lbl"
          class="pill"
        >
          <span class="dot" :style="{ background: (COLOR_BY_CATEGORY[lbl] || COLOR_BY_CATEGORY['Outros']) }"></span>
          <span class="text-xs text-white/80">{{ lbl }}</span>
        </div>
      </div>
    </div>

    <div class="rounded-3xl bg-white/10 border border-white/10 backdrop-blur p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="font-semibold">Recentes</div>
        <div class="text-xs text-white/70">{{ state.transactions.length }} itens</div>
      </div>
      <div class="space-y-2">
        <div
          v-for="t in state.transactions.slice(0, 6)"
          :key="t.id"
          class="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-3 py-2"
        >
          <div>
            <div class="text-sm font-medium">{{ t.title }}</div>
            <div class="text-xs text-white/60">{{ t.category }}</div>
          </div>
          <div class="text-sm font-semibold" :class="t.type === 'expense' ? 'text-rose-200' : 'text-emerald-200'">
            {{ t.type === 'expense' ? '-' : '+' }} R$ {{ t.amount.toLocaleString('pt-BR') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpi{
  border-radius: 22px;
  padding: 14px 14px;
  border: 1px solid rgba(255,255,255,.14);
  box-shadow: 0 18px 55px rgba(0,0,0,.30);
  position: relative;
  overflow: hidden;
}
.kpi::after{
  content:"";
  position:absolute; inset:-40px -40px auto auto;
  width:140px; height:140px;
  border-radius:9999px;
  background: rgba(255,255,255,.16);
  filter: blur(20px);
  transform: rotate(20deg);
}
.kpi-title{ font-size: 12px; color: rgba(255,255,255,.85); }
.kpi-value{ margin-top: 6px; font-size: 22px; font-weight: 700; line-height: 1.1; }
.kpi-sub{ margin-top: 8px; font-size: 12px; color: rgba(255,255,255,.80); }

.kpi-balance{ background: linear-gradient(135deg, rgba(245,158,11,.95), rgba(249,115,22,.75)); color:#1b1b1b; border-color: rgba(255,255,255,.20); }
.kpi-balance .kpi-title,.kpi-balance .kpi-sub{ color: rgba(0,0,0,.65); }

.kpi-income{ background: linear-gradient(135deg, rgba(16,185,129,.85), rgba(34,197,94,.60)); }
.kpi-expense{ background: linear-gradient(135deg, rgba(239,68,68,.80), rgba(190,18,60,.60)); }
.kpi-invest{  background: linear-gradient(135deg, rgba(124,58,237,.78), rgba(147,51,234,.58)); }

.centerBadge{
  width: 112px;
  height: 112px;
  border-radius: 9999px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  backdrop-filter: blur(12px);
  display: grid;
  place-items: center;
  text-align: center;
}

.pill{
  display:flex; align-items:center; gap:8px;
  padding: 8px 12px;
  border-radius: 9999px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.10);
}
.dot{
  width:10px; height:10px; border-radius:9999px;
}
</style>
