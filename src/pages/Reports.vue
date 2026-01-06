<script setup>
import { computed, ref } from 'vue'
import { state, addTransaction, getCategoryBudget, setCategoryBudget } from '../store/financeStore'

const month = ref(new Date().toISOString().slice(0, 7))
const newExpense = ref({ title: '', category: 'Cartão', amount: null })

const items = computed(() => {
  const [y, m] = month.value.split('-').map(Number)
  return state.transactions.filter((t) => {
    const d = new Date(t.date)
    return d.getFullYear() === y && d.getMonth() + 1 === m
  })
})

const incomes = computed(() => items.value.filter((i) => i.type === 'income'))
const expenses = computed(() => items.value.filter((i) => i.type === 'expense'))
const incomeTotal = computed(() => incomes.value.reduce((a, b) => a + b.amount, 0))
const expenseTotal = computed(() => expenses.value.reduce((a, b) => a + b.amount, 0))
const balance = computed(() => incomeTotal.value - expenseTotal.value)

const categorySummary = computed(() => {
  const map = new Map()
  expenses.value.forEach((t) => {
    const cat = t.category || 'Outros'
    map.set(cat, (map.get(cat) || 0) + t.amount)
  })
  return Array.from(map.entries()).map(([category, actual]) => ({
    category,
    actual,
    planned: getCategoryBudget(month.value, category) || 0,
  }))
})

function addExpense() {
  const amount = Number(newExpense.value.amount)
  if (!newExpense.value.title || !newExpense.value.category || !amount || amount <= 0) return
  addTransaction({
    type: 'expense',
    title: newExpense.value.title,
    category: newExpense.value.category,
    amount,
    date: new Date().toISOString(),
  })
  newExpense.value = { title: '', category: 'Cartão', amount: null }
}

function updateBudget(category, value) {
  setCategoryBudget(month.value, category, Number(value) || 0)
}
</script>

<template>
  <div class="space-y-4">
    <div class="sheetHeader">
      <div>
        <div class="text-sm font-semibold">Relatórios</div>
        <div class="text-xs text-white/60">Resumo do mês + planilha de gastos</div>
      </div>
      <input v-model="month" type="month" class="monthinp" />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="sheetcard">
        <div class="sheethead">Entradas</div>
        <div class="sheetval text-emerald-200">R$ {{ incomeTotal.toLocaleString('pt-BR') }}</div>
      </div>
      <div class="sheetcard">
        <div class="sheethead">Saídas</div>
        <div class="sheetval text-rose-200">R$ {{ expenseTotal.toLocaleString('pt-BR') }}</div>
      </div>
      <div class="sheetcard">
        <div class="sheethead">Total gasto</div>
        <div class="sheetval text-orange-200">R$ {{ expenseTotal.toLocaleString('pt-BR') }}</div>
      </div>
      <div class="sheetcard">
        <div class="sheethead">Queda por gastar</div>
        <div class="sheetval">R$ {{ balance.toLocaleString('pt-BR') }}</div>
      </div>
    </div>

    <div class="sheetBlock">
      <div class="sheetTitle bg-emerald-500/20">Ingresos</div>
      <div class="sheetTable">
        <div class="sheetRow sheetRowTwo sheetHeadRow">
          <span>Descrição</span>
          <span class="text-right">Valor</span>
        </div>
        <div v-for="item in incomes" :key="item.id" class="sheetRow sheetRowTwo">
          <span>{{ item.title }}</span>
          <span class="text-right text-emerald-200">R$ {{ item.amount.toLocaleString('pt-BR') }}</span>
        </div>
        <div v-if="!incomes.length" class="sheetRow sheetRowTwo text-white/60">
          <span>Sem entradas no período.</span>
          <span class="text-right">—</span>
        </div>
      </div>
    </div>

    <div class="sheetBlock">
      <div class="sheetTitle bg-purple-500/20">Distribuição de Gastos</div>
      <div class="sheetTable">
        <div class="sheetRow sheetHeadRow">
          <span>Categoria</span>
          <span class="text-center">Planejado</span>
          <span class="text-right">Real</span>
        </div>
        <div v-for="item in categorySummary" :key="item.category" class="sheetRow">
          <span>{{ item.category }}</span>
          <input
            class="planInput"
            type="number"
            :value="item.planned"
            min="0"
            @change="updateBudget(item.category, $event.target.value)"
          />
          <span class="text-right text-rose-200">R$ {{ item.actual.toLocaleString('pt-BR') }}</span>
        </div>
        <div v-if="!categorySummary.length" class="sheetRow text-white/60">
          <span>Sem gastos no período.</span>
          <span class="text-center">—</span>
          <span class="text-right">—</span>
        </div>
      </div>
    </div>

    <div class="sheetBlock">
      <div class="sheetTitle bg-rose-500/20">Gastos</div>
      <div class="sheetTable">
        <div class="sheetRow sheetHeadRow">
          <span>Descrição</span>
          <span>Categoria</span>
          <span class="text-right">Real</span>
        </div>

        <div class="sheetRow sheetInputRow">
          <input v-model="newExpense.title" class="planInput text-left" placeholder="Ex: Supermercado" />
          <input v-model="newExpense.category" class="planInput text-left" placeholder="Ex: Contas fixas" />
          <input v-model="newExpense.amount" type="number" class="planInput text-right" placeholder="0" />
          <button class="addBtn" @click="addExpense">Adicionar</button>
        </div>

        <div v-for="item in expenses" :key="item.id" class="sheetRow">
          <span>{{ item.title }}</span>
          <span class="text-white/70">{{ item.category }}</span>
          <span class="text-right text-rose-200">R$ {{ item.amount.toLocaleString('pt-BR') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sheetHeader{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  border-radius: 24px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.10);
  padding: 14px 16px;
}
.monthinp{
  padding:10px 12px;
  border-radius: 14px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.9);
  outline: none;
}
.sheetcard{
  border-radius: 18px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.10);
  overflow:hidden;
}
.sheethead{
  padding: 10px 12px;
  font-size: 12px;
  color: rgba(255,255,255,.80);
  background: linear-gradient(90deg, rgba(245,158,11,.22), rgba(124,58,237,.18));
  border-bottom: 1px solid rgba(255,255,255,.08);
}
.sheetval{
  padding: 14px 12px;
  font-size: 18px;
  font-weight: 700;
}
.sheetBlock{
  border-radius: 24px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.10);
  overflow:hidden;
}
.sheetTitle{
  padding: 10px 14px;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid rgba(255,255,255,.08);
}
.sheetTable{
  display:grid;
}
.sheetRow{
  display:grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255,255,255,.05);
  align-items:center;
}
.sheetRowTwo{
  grid-template-columns: 1.6fr 1fr;
}
.sheetHeadRow{
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,.70);
  background: rgba(255,255,255,.04);
}
.sheetInputRow{
  grid-template-columns: 1.4fr 1fr 0.8fr auto;
}
.planInput{
  width:100%;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.85);
}
.addBtn{
  padding: 8px 12px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fde047, #fb923c);
  color: #111827;
  font-weight: 600;
}
</style>
