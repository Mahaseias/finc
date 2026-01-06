import { reactive, computed } from 'vue'

const KEY = 'finance_app_v1'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null
  } catch {
    return null
  }
}

function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

const initial = load() || {
  transactions: [
    { id: crypto.randomUUID(), type: 'income', title: 'Salário', amount: 9900, category: 'Trabalho', date: new Date().toISOString() },
    { id: crypto.randomUUID(), type: 'expense', title: 'Cartão', amount: 7100, category: 'Contas', date: new Date().toISOString() },
    { id: crypto.randomUUID(), type: 'invest', title: 'Aporte', amount: 1500, category: 'Investimento', date: new Date().toISOString() },
  ],
}

export const state = reactive(initial)

export function addTransaction(tx) {
  state.transactions.unshift({ id: crypto.randomUUID(), ...tx })
  save(state)
}

export const totals = computed(() => {
  const income = state.transactions.filter((t) => t.type === 'income').reduce((a, b) => a + b.amount, 0)
  const expense = state.transactions.filter((t) => t.type === 'expense').reduce((a, b) => a + b.amount, 0)
  const invest = state.transactions.filter((t) => t.type === 'invest').reduce((a, b) => a + b.amount, 0)
  const balance = income - expense
  return { income, expense, invest, balance }
})
