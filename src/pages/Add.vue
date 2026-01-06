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
    <div class="rounded-3xl bg-white/10 border border-white/10 backdrop-blur p-4">
      <div class="font-semibold mb-3">Adicionar</div>
      <div class="grid grid-cols-2 gap-2 mb-3">
        <button class="chip" :class="type === 'income' && 'active'" @click="type = 'income'">Lucros</button>
        <button class="chip" :class="type === 'projection' && 'active'" @click="type = 'projection'">Projeção de lucros</button>
      </div>
      <label class="block text-xs text-white/70 mb-1">Título</label>
      <input v-model="title" class="inp" placeholder="Ex: iFood, Cartão, Aporte..." />
      <div class="grid grid-cols-2 gap-2 mt-3">
        <div>
          <label class="block text-xs text-white/70 mb-1">Categoria</label>
          <input v-model="category" class="inp" placeholder="Ex: Lazer, Contas..." />
        </div>
        <div>
          <label class="block text-xs text-white/70 mb-1">Valor (R$)</label>
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
    <div class="text-xs text-white/60">
      Tudo fica salvo localmente no seu dispositivo (sem backend). Para gastos do mês, use a aba Relatórios (planilha).
    </div>
  </div>
</template>

<style scoped>
.inp {
  width: 100%;
  padding: 12px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  outline: none;
}
.chip {
  border-radius: 16px;
  padding: 10px 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.85);
}
.chip.active {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}
</style>
