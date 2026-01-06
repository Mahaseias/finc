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
    { id: crypto.randomUUID(), type: 'expense', title: 'Cartão', amount: 2400, category: 'Cartão', date: new Date().toISOString() },
    { id: crypto.randomUUID(), type: 'expense', title: 'Contas fixas', amount: 1800, category: 'Contas fixas', date: new Date().toISOString() },
    { id: crypto.randomUUID(), type: 'expense', title: 'Uso pessoal', amount: 900, category: 'Uso pessoal', date: new Date().toISOString() },
    { id: crypto.randomUUID(), type: 'expense', title: 'Emergência', amount: 700, category: 'Emergência', date: new Date().toISOString() },
    { id: crypto.randomUUID(), type: 'invest', title: 'Projeção', amount: 1500, category: 'Investimento', date: new Date().toISOString() },
  ],
  budgets: {},
}

export const state = reactive(initial)

export function addTransaction(tx) {
  state.transactions.unshift({ id: crypto.randomUUID(), ...tx })
  save(state)
}

export function setCategoryBudget(monthKey, category, value) {
  if (!state.budgets) state.budgets = {}
  if (!state.budgets[monthKey]) state.budgets[monthKey] = {}
  state.budgets[monthKey][category] = value
  save(state)
}

export function getCategoryBudget(monthKey, category) {
  return state.budgets?.[monthKey]?.[category] ?? 0
}

export function replaceState(next) {
  state.transactions = next.transactions || []
  state.budgets = next.budgets || {}
  save(state)
}

export function resetState() {
  state.transactions = []
  state.budgets = {}
  save(state)
}

export const totals = computed(() => {
  const income = state.transactions.filter((t) => t.type === 'income').reduce((a, b) => a + b.amount, 0)
  const expense = state.transactions.filter((t) => t.type === 'expense').reduce((a, b) => a + b.amount, 0)
  const invest = state.transactions.filter((t) => t.type === 'invest').reduce((a, b) => a + b.amount, 0)
  const balance = income - expense
  return { income, expense, invest, balance }
})
