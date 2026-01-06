<script setup>
import { computed, ref } from 'vue'
import { state } from '../store/financeStore'

const month = ref(new Date().toISOString().slice(0, 7)) // YYYY-MM

const items = computed(() => {
  const [y, m] = month.value.split('-').map(Number)
  return state.transactions
    .filter((t) => {
      const d = new Date(t.date)
      return d.getFullYear() === y && d.getMonth() + 1 === m
    })
    .map((t) => ({
      ...t,
      dateBR: new Date(t.date).toLocaleDateString('pt-BR'),
      signed: t.type === 'expense' ? -t.amount : t.amount,
    }))
})

const income = computed(() => items.value.filter((i) => i.type === 'income').reduce((a, b) => a + b.amount, 0))
const expense = computed(() => items.value.filter((i) => i.type === 'expense').reduce((a, b) => a + b.amount, 0))
const invest = computed(() => items.value.filter((i) => i.type === 'invest').reduce((a, b) => a + b.amount, 0))
const balance = computed(() => income.value - expense.value)
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-3xl bg-white/10 border border-white/10 backdrop-blur p-4">
      <div class="flex items-center justify-between gap-2">
        <div>
          <div class="text-sm font-semibold">Relatórios</div>
          <div class="text-xs text-white/60">Resumo por mês + tabela estilo planilha</div>
        </div>
        <input v-model="month" type="month" class="monthinp" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="sheetcard">
        <div class="sheethead">Entradas</div>
        <div class="sheetval text-emerald-200">R$ {{ income.toLocaleString('pt-BR') }}</div>
      </div>
      <div class="sheetcard">
        <div class="sheethead">Saídas</div>
        <div class="sheetval text-rose-200">R$ {{ expense.toLocaleString('pt-BR') }}</div>
      </div>
      <div class="sheetcard">
        <div class="sheethead">Investimentos</div>
        <div class="sheetval text-violet-200">R$ {{ invest.toLocaleString('pt-BR') }}</div>
      </div>
      <div class="sheetcard">
        <div class="sheethead">Saldo</div>
        <div class="sheetval">R$ {{ balance.toLocaleString('pt-BR') }}</div>
      </div>
    </div>

    <div class="rounded-3xl bg-white/10 border border-white/10 backdrop-blur p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="font-semibold">Gastos / Lançamentos</div>
        <div class="text-xs text-white/60">{{ items.length }} itens</div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-white/70">
            <tr class="border-b border-white/10">
              <th class="py-2 text-left">Data</th>
              <th class="py-2 text-left">Descrição</th>
              <th class="py-2 text-left">Categoria</th>
              <th class="py-2 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in items" :key="t.id" class="border-b border-white/5">
              <td class="py-2 text-white/70">{{ t.dateBR }}</td>
              <td class="py-2">{{ t.title }}</td>
              <td class="py-2 text-white/70">{{ t.category }}</td>
              <td
                class="py-2 text-right font-semibold"
                :class="t.type === 'expense' ? 'text-rose-200' : 'text-emerald-200'"
              >
                {{ t.type === 'expense' ? '-' : '+' }} R$ {{ t.amount.toLocaleString('pt-BR') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-3 flex items-center justify-between text-sm">
        <div class="text-white/70">Total</div>
        <div class="font-semibold">R$ {{ (income - expense).toLocaleString('pt-BR') }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.monthinp {
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
  outline: none;
}
.sheetcard {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}
.sheethead {
  padding: 10px 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.22), rgba(124, 58, 237, 0.18));
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.sheetval {
  padding: 14px 12px;
  font-size: 18px;
  font-weight: 700;
}
</style>
