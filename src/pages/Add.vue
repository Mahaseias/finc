<script setup>
import { ref } from 'vue'
import { addTransaction } from '../store/financeStore'

const type = ref('income')
const title = ref('')
const category = ref('Lucros')
const amount = ref(null)

function submit() {
  const value = Number(amount.value)
  if (!title.value || !value || value <= 0) return
  addTransaction({
    type: type.value === 'projection' ? 'invest' : 'income',
    title: title.value,
    category: category.value,
    amount: value,
    date: new Date().toISOString(),
  })
  title.value = ''
  amount.value = null
}
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-3xl bg-white/85 border border-slate-200/70 backdrop-blur p-4 shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
      <div class="font-semibold mb-3">Adicionar</div>
      <div class="grid grid-cols-2 gap-2 mb-3">
        <button class="chip" :class="type === 'income' && 'active'" @click="type = 'income'">Lucros</button>
        <button class="chip" :class="type === 'projection' && 'active'" @click="type = 'projection'">Projeção de lucros</button>
      </div>
      <label class="block text-xs text-slate-500 mb-1">Título</label>
      <input v-model="title" class="inp" placeholder="Ex: iFood, Cartão, Aporte..." />
      <div class="grid grid-cols-2 gap-2 mt-3">
        <div>
          <label class="block text-xs text-slate-500 mb-1">Categoria</label>
          <input v-model="category" class="inp" placeholder="Ex: Lazer, Contas..." />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">Valor (R$)</label>
          <input v-model="amount" type="number" inputmode="decimal" class="inp" placeholder="0,00" />
        </div>
      </div>
      <button
        @click="submit"
        class="mt-4 w-full rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black font-semibold py-3 active:scale-[0.99] transition"
      >
        Salvar
      </button>
    </div>
    <div class="text-xs text-slate-500">
      Tudo fica salvo localmente no seu dispositivo (sem backend). Para gastos do mês, use a aba Relatórios (planilha).
    </div>
  </div>
</template>

<style scoped>
.inp {
  width: 100%;
  padding: 12px 12px;
  border-radius: 16px;
  background: rgba(248, 250, 252, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.5);
  outline: none;
}
.chip {
  border-radius: 16px;
  padding: 10px 10px;
  background: rgba(248, 250, 252, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.5);
  color: #1f2937;
}
.chip.active {
  background: rgba(124, 58, 237, 0.15);
  border-color: rgba(124, 58, 237, 0.3);
  color: #4c1d95;
}
</style>
