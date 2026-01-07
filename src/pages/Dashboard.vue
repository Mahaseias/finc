<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Chart } from 'chart.js/auto'
import { state, totals } from '../store/financeStore'

const canvasRef = ref(null)
let chart = null

// Paleta fixa por categoria (pode ajustar nomes/cor aqui)
const COLOR_BY_CATEGORY = {
  'Cartão': '#7C3AED',
  'Contas fixas': '#F59E0B',
  'Uso pessoal': '#10B981',
  'Emergência': '#EF4444',
  'Investimento': '#EC4899',
  'Outros': '#3B82F6',
}

// Resumo de despesas do mês por categoria
const monthCategorySummary = computed(() => {
  const now = new Date()
  const m = now.getMonth()
  const y = now.getFullYear()

  const map = new Map()

  state.transactions.forEach(t => {
    if (t.type !== 'expense') return
    const d = new Date(t.date)
    if (d.getMonth() !== m || d.getFullYear() !== y) return

    const cat = t.category || 'Outros'
    map.set(cat, (map.get(cat) || 0) + Number(t.amount || 0))
  })

  const result = [...map.entries()].map(([category, value]) => ({ category, value }))
  if (!result.length) {
    // Estado vazio: donut “fake” para não quebrar layout
    return [{ category: 'Sem gastos', value: 1 }]
  }
  return result
})

// Itens para legenda (categoria + cor + valor + %)
const legendItems = computed(() => {
  const total = monthCategorySummary.value.reduce((a, b) => a + b.value, 0) || 1
  return monthCategorySummary.value.map((item, idx) => {
    const color = COLOR_BY_CATEGORY[item.category] || COLOR_BY_CATEGORY['Outros']
    const pct = Math.round((item.value / total) * 100)
    return {
      ...item,
      color,
      pct,
      idx,
    }
  })
})

// Últimos lançamentos
const recentTransactions = computed(() => state.transactions.slice(0, 6))

function renderChart() {
  if (!canvasRef.value) return

  const labels = monthCategorySummary.value.map(i => i.category)
  const data = monthCategorySummary.value.map(i => i.value)
  const total = data.reduce((a, b) => a + b, 0) || 1

  const bg = monthCategorySummary.value.map(
    i => COLOR_BY_CATEGORY[i.category] || COLOR_BY_CATEGORY['Outros'],
  )

  if (chart) chart.destroy()

  chart = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: bg,
        borderWidth: 2,
        borderColor: 'rgba(10,18,35,.65)',
        hoverOffset: 8,
      }],
    },
    options: {
      cutout: '78%',
      radius: '92%',
      animation: { duration: 650 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const v = Number(ctx.raw || 0)
              const pct = Math.round((v / total) * 100)
              return ` ${ctx.label}: R$ ${v.toLocaleString('pt-BR')} (${pct}%)`
            },
          },
        },
      },
    },
  })
}

onMounted(renderChart)
watch(monthCategorySummary, renderChart, { deep: true })
</script>

<template>
  <div class="space-y-4">
    <!-- KPIs -->
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

    <!-- Donut gastos do mês -->
    <div class="rounded-3xl bg-white/85 border border-slate-200/70 backdrop-blur p-4 shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
      <div class="flex items-center justify-between mb-3">
        <div class="font-semibold">Gastos do mês</div>
        <div class="text-xs text-slate-500">por categoria</div>
      </div>

      <div class="relative grid place-items-center">
        <div class="w-64 h-64">
          <canvas ref="canvasRef"></canvas>
        </div>

        <!-- Centro “badge” -->
        <div class="absolute grid place-items-center">
          <div class="centerBadge">
            <div class="text-xs text-slate-500">Gastos</div>
            <div class="text-lg font-semibold">do mês</div>
          </div>
        </div>
      </div>

      <!-- Legenda em pílulas -->
      <div class="mt-4 flex flex-wrap gap-2 justify-center">
        <div
          v-for="item in legendItems"
          :key="item.category"
          class="pill"
        >
          <span class="dot" :style="{ background: item.color }"></span>
          <span class="text-xs text-slate-600">
            {{ item.category }} · {{ item.pct }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Últimos lançamentos -->
    <div class="rounded-3xl bg-white/85 border border-slate-200/70 backdrop-blur p-4 shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
      <div class="flex items-center justify-between mb-3">
        <div class="font-semibold">Últimos lançamentos</div>
        <div class="text-xs text-slate-500">{{ recentTransactions.length }} itens</div>
      </div>

      <div v-if="recentTransactions.length" class="space-y-2">
        <div
          v-for="t in recentTransactions"
          :key="t.id"
          class="flex items-center justify-between rounded-2xl bg-white border border-slate-200/80 px-3 py-2"
        >
          <div class="flex flex-col">
            <div class="text-sm font-medium truncate max-w-[180px]">
              {{ t.title }}
            </div>
            <div class="text-[11px] text-slate-500">
              {{ t.category || 'Sem categoria' }} ·
              {{ new Date(t.date).toLocaleDateString('pt-BR') }}
            </div>
          </div>

          <div
            class="text-sm font-semibold text-right"
            :class="{
              'text-emerald-200': t.type === 'income',
              'text-rose-200': t.type === 'expense',
              'text-violet-200': t.type === 'invest',
              'text-orange-200': t.type === 'debt',
            }"
          >
            <span v-if="t.type === 'expense' || t.type === 'debt'">-</span>
            <span v-else>+</span>
            &nbsp;R$ {{ Number(t.amount || 0).toLocaleString('pt-BR') }}
          </div>
        </div>
      </div>

      <div v-else class="text-xs text-slate-500">
        Você ainda não lançou nada. Toque no botão “+” para adicionar sua primeira movimentação.
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

.kpi-balance{
  background: linear-gradient(135deg, rgba(245,158,11,.95), rgba(249,115,22,.80));
  color:#111827;
  border-color: rgba(255,255,255,.25);
}
.kpi-balance .kpi-title,
.kpi-balance .kpi-sub{
  color: rgba(0,0,0,.65);
}

.kpi-income{
  background: linear-gradient(135deg, rgba(16,185,129,.85), rgba(34,197,94,.70));
}
.kpi-expense{
  background: linear-gradient(135deg, rgba(239,68,68,.85), rgba(190,18,60,.70));
}
.kpi-invest{
  background: linear-gradient(135deg, rgba(124,58,237,.82), rgba(147,51,234,.65));
}

.centerBadge{
  width: 112px;
  height: 112px;
  border-radius: 9999px;
  background: rgba(255,255,255,.85);
  border: 1px solid rgba(148,163,184,.45);
  backdrop-filter: blur(12px);
  display: grid;
  place-items: center;
  text-align: center;
}

.pill{
  display:flex;
  align-items:center;
  gap:8px;
  padding: 8px 12px;
  border-radius: 9999px;
  background: rgba(255,255,255,.85);
  border: 1px solid rgba(148,163,184,.45);
}
.dot{
  width:10px;
  height:10px;
  border-radius:9999px;
}
</style>
