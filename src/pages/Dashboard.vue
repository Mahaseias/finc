<script setup>
import { onMounted, ref, watch } from 'vue'
import { Chart } from 'chart.js/auto'
import { state, totals } from '../store/financeStore'

const canvasRef = ref(null)
let chart

function computeCategories() {
  const month = new Date().getMonth()
  const year = new Date().getFullYear()
  const monthExpenses = state.transactions.filter((t) => {
    const d = new Date(t.date)
    return t.type === 'expense' && d.getMonth() === month && d.getFullYear() === year
  })
  const map = new Map()
  for (const t of monthExpenses) map.set(t.category, (map.get(t.category) || 0) + t.amount)
  const labels = [...map.keys()]
  const data = [...map.values()]
  return { labels: labels.length ? labels : ['Sem dados'], data: data.length ? data : [1] }
}

function renderChart() {
  const { labels, data } = computeCategories()
  const palette = ['#7C3AED', '#F59E0B', '#EF4444', '#EC4899', '#10B981', '#3B82F6']

  if (chart) chart.destroy()
  chart = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: labels.map((_, i) => palette[i % palette.length]),
          borderWidth: 2,
          borderColor: 'rgba(10,18,35,.55)',
          hoverOffset: 6,
        },
      ],
    },
    options: {
      cutout: '72%',
      animation: { duration: 600 },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (ctx) => {
              const v = Number(ctx.raw || 0)
              return ` ${ctx.label}: R$ ${v.toLocaleString('pt-BR')}`
            },
          },
        },
      },
    },
  })
}

onMounted(renderChart)
watch(() => state.transactions.length, renderChart)
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <div class="card bg-gradient-to-br from-amber-300/90 to-orange-500/80">
        <div class="text-white/90 text-xs">Saldo</div>
        <div class="text-2xl font-bold">R$ {{ totals.balance.toLocaleString('pt-BR') }}</div>
        <div class="mt-2 text-xs text-white/80">Total</div>
      </div>
      <div class="card bg-gradient-to-br from-emerald-400/80 to-green-600/70">
        <div class="text-white/90 text-xs">Receitas</div>
        <div class="text-2xl font-bold">R$ {{ totals.income.toLocaleString('pt-BR') }}</div>
        <div class="mt-2 text-xs text-white/80">Entrada</div>
      </div>
      <div class="card bg-gradient-to-br from-rose-500/80 to-red-700/70">
        <div class="text-white/90 text-xs">Despesas</div>
        <div class="text-2xl font-bold">R$ {{ totals.expense.toLocaleString('pt-BR') }}</div>
        <div class="mt-2 text-xs text-white/80">Saída</div>
      </div>
      <div class="card bg-gradient-to-br from-violet-500/75 to-purple-700/70">
        <div class="text-white/90 text-xs">Investimentos</div>
        <div class="text-2xl font-bold">R$ {{ totals.invest.toLocaleString('pt-BR') }}</div>
        <div class="mt-2 text-xs text-white/80">Aportes</div>
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
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 grid place-items-center shadow-lg">
            <span class="text-2xl">💰</span>
          </div>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap gap-2 justify-center">
        <div
          v-for="(lbl, i) in computeCategories().labels"
          :key="lbl"
          class="pill"
        >
          <span class="dot" :style="{ background: ['#7C3AED','#F59E0B','#EF4444','#EC4899','#10B981','#3B82F6'][i % 6] }"></span>
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
.card {
  border-radius: 1.25rem;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
}
</style>
