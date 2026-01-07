<script setup>
import { ref, computed } from 'vue'
import { state } from '../store/financeStore'

const month = ref(new Date().toISOString().slice(0, 7)) // YYYY-MM

const monthTransactions = computed(() => {
  const [year, m] = month.value.split('-').map(Number)
  return state.transactions.filter(t => {
    const d = new Date(t.date)
    return d.getFullYear() === year && (d.getMonth() + 1) === m
  })
})

const income = computed(() =>
  monthTransactions.value
    .filter(i => i.type === 'income')
    .reduce((a, b) => a + Number(b.amount || 0), 0),
)

const expense = computed(() =>
  monthTransactions.value
    .filter(i => i.type === 'expense')
    .reduce((a, b) => a + Number(b.amount || 0), 0),
)

const invest = computed(() =>
  monthTransactions.value
    .filter(i => i.type === 'invest')
    .reduce((a, b) => a + Number(b.amount || 0), 0),
)

// Aqui considero Investimento como parte do “gasto planejado” (estilo planilha)
const totalGasto = computed(() => expense.value + invest.value)
const ficaPraGastar = computed(() => income.value - totalGasto.value)

// Resumo por categoria (para eventual futuro gráfico ou ranking)
const byCategory = computed(() => {
  const map = new Map()
  monthTransactions.value.forEach(t => {
    const cat = t.category || 'Outros'
    const sign =
      t.type === 'expense' || t.type === 'invest' || t.type === 'debt'
        ? -1
        : 1
    const val = sign * Number(t.amount || 0)
    map.set(cat, (map.get(cat) || 0) + val)
  })
  return [...map.entries()]
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
})
</script>

<template>
  <div class="space-y-4">
    <!-- Header / seletor de mês -->
    <div class="rounded-3xl bg-white/85 border border-slate-200/70 backdrop-blur p-4 shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
      <div class="flex items-center justify-between gap-2">
        <div>
          <div class="text-sm font-semibold">Relatórios</div>
          <div class="text-xs text-slate-500">
            Resumo do mês e distribuição dos lançamentos.
          </div>
        </div>

        <input v-model="month" type="month" class="monthinp" />
      </div>
    </div>

    <!-- Cards de resumo (estilo planilha) -->
    <div class="grid grid-cols-2 gap-3">
      <div class="sheetcard">
        <div class="sheethead head-income">Entradas</div>
        <div class="sheetval text-emerald-200">
          R$ {{ income.toLocaleString('pt-BR') }}
        </div>
      </div>

      <div class="sheetcard">
        <div class="sheethead head-expense">Total gasto</div>
        <div class="sheetval text-rose-200">
          R$ {{ totalGasto.toLocaleString('pt-BR') }}
        </div>
      </div>

      <div class="sheetcard">
        <div class="sheethead head-balance">Fica para gastar</div>
        <div
          class="sheetval"
          :class="ficaPraGastar >= 0 ? 'text-emerald-200' : 'text-rose-200'"
        >
          R$ {{ ficaPraGastar.toLocaleString('pt-BR') }}
        </div>
      </div>

      <div class="sheetcard">
        <div class="sheethead head-invest">Investimentos</div>
        <div class="sheetval text-violet-200">
          R$ {{ invest.toLocaleString('pt-BR') }}
        </div>
      </div>
    </div>

    <!-- Tabela de lançamentos -->
    <div class="rounded-3xl bg-white/85 border border-slate-200/70 backdrop-blur p-4 shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
      <div class="flex items-center justify-between mb-3">
        <div class="font-semibold">Lançamentos do mês</div>
        <div class="text-xs text-slate-500">
          {{ monthTransactions.length }} itens
        </div>
      </div>

      <div v-if="monthTransactions.length" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-slate-500">
            <tr class="border-b border-slate-200/70">
              <th class="py-2 text-left pr-2">Data</th>
              <th class="py-2 text-left pr-2">Descrição</th>
              <th class="py-2 text-left pr-2">Categoria</th>
              <th class="py-2 text-left pr-2">Tipo</th>
              <th class="py-2 text-right pl-2">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="t in monthTransactions"
              :key="t.id"
              class="border-b border-slate-200/50"
            >
              <td class="py-2 text-slate-500 align-top pr-2">
                {{ new Date(t.date).toLocaleDateString('pt-BR') }}
              </td>
              <td class="py-2 align-top pr-2">
                <div class="truncate max-w-[140px]">
                  {{ t.title }}
                </div>
              </td>
              <td class="py-2 text-slate-500 align-top pr-2">
                <span class="tag">
                  {{ t.category || 'Sem categoria' }}
                </span>
              </td>
              <td class="py-2 align-top pr-2">
                <span
                  class="tag"
                  :class="{
                    'tag-income': t.type === 'income',
                    'tag-expense': t.type === 'expense',
                    'tag-invest': t.type === 'invest',
                    'tag-debt': t.type === 'debt',
                  }"
                >
                  {{
                    t.type === 'income'
                      ? 'Receita'
                      : t.type === 'expense'
                      ? 'Despesa'
                      : t.type === 'invest'
                      ? 'Investimento'
                      : 'Dívida'
                  }}
                </span>
              </td>
              <td
                class="py-2 text-right font-semibold align-top pl-2"
                :class="{
                  'text-emerald-200': t.type === 'income',
                  'text-rose-200': t.type === 'expense' || t.type === 'debt',
                  'text-violet-200': t.type === 'invest',
                }"
              >
                <span v-if="t.type === 'expense' || t.type === 'debt'">-</span>
                <span v-else>+</span>
                &nbsp;R$ {{ Number(t.amount || 0).toLocaleString('pt-BR') }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Totais na parte de baixo -->
        <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div class="rounded-2xl bg-white border border-slate-200/70 p-3">
            <div class="text-xs text-slate-500 mb-1">Total de entradas</div>
            <div class="font-semibold text-emerald-200">
              R$ {{ income.toLocaleString('pt-BR') }}
            </div>
          </div>
          <div class="rounded-2xl bg-white border border-slate-200/70 p-3">
            <div class="text-xs text-slate-500 mb-1">Total de saídas</div>
            <div class="font-semibold text-rose-200">
              R$ {{ expense.toLocaleString('pt-BR') }}
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-xs text-slate-500">
        Não há lançamentos para este mês. Experimente mudar o período ou
        adicionar novas movimentações.
      </div>
    </div>

    <!-- Resumo por categoria (tipo planilha “Distribuição de gastos”) -->
    <div
      v-if="byCategory.length"
      class="rounded-3xl bg-white/85 border border-slate-200/70 backdrop-blur p-4 shadow-[0_14px_40px_rgba(0,0,0,0.08)]"
    >
      <div class="flex items-center justify-between mb-3">
        <div class="font-semibold">Distribuição por categoria</div>
      </div>

      <div class="space-y-2">
        <div
          v-for="c in byCategory"
          :key="c.category"
          class="flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <span class="tag">{{ c.category }}</span>
          </div>
          <div
            class="text-sm font-semibold"
            :class="c.value >= 0 ? 'text-emerald-200' : 'text-rose-200'"
          >
            {{ c.value >= 0 ? '+' : '-' }}
            R$
            {{ Math.abs(c.value).toLocaleString('pt-BR') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.monthinp{
  padding:10px 12px;
  border-radius: 14px;
  background: rgba(255,255,255,.95);
  border: 1px solid rgba(148,163,184,.45);
  color: #1f2937;
  outline: none;
  font-size: 12px;
}

/* Cards estilo planilha */
.sheetcard{
  border-radius: 18px;
  background: rgba(255,255,255,.9);
  border: 1px solid rgba(148,163,184,.35);
  overflow:hidden;
}
.sheethead{
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(21,24,35,.92);
  border-bottom: 1px solid rgba(148,163,184,.35);
}
.head-income{
  background: linear-gradient(90deg, rgba(16,185,129,.65), rgba(56,189,248,.60));
}
.head-expense{
  background: linear-gradient(90deg, rgba(239,68,68,.7), rgba(249,115,22,.75));
}
.head-balance{
  background: linear-gradient(90deg, rgba(245,158,11,.85), rgba(252,211,77,.75));
}
.head-invest{
  background: linear-gradient(90deg, rgba(129,140,248,.8), rgba(236,72,153,.75));
}
.sheetval{
  padding: 14px 12px;
  font-size: 18px;
  font-weight: 700;
}

/* Tags para categoria / tipo */
.tag{
  display:inline-flex;
  align-items:center;
  padding: 3px 9px;
  border-radius: 9999px;
  font-size: 11px;
  background: rgba(255,255,255,.9);
  border: 1px solid rgba(148,163,184,.45);
  color: rgba(30,41,59,.85);
}
.tag-income{
  background: rgba(16,185,129,.15);
  border-color: rgba(34,197,94,.45);
}
.tag-expense{
  background: rgba(239,68,68,.15);
  border-color: rgba(248,113,113,.45);
}
.tag-invest{
  background: rgba(129,140,248,.16);
  border-color: rgba(165,180,252,.5);
}
.tag-debt{
  background: rgba(251,191,36,.16);
  border-color: rgba(251,191,36,.5);
}
</style>
