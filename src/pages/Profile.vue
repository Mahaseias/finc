<script setup>
import { state, replaceState, resetState } from '../store/financeStore'

function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'finc-backup.json'
  link.click()
}

function importJSON(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result)
      replaceState(parsed || {})
    } catch {
      alert('Arquivo inválido.')
    }
  }
  reader.readAsText(file)
}

function clearAll() {
  if (confirm('Deseja apagar todos os dados locais?')) {
    resetState()
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-3xl bg-white/85 border border-slate-200/70 backdrop-blur p-4 shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
      <div class="font-semibold mb-2">Configurações locais</div>
      <div class="text-sm text-slate-500">
        Sem backend: tudo fica salvo no dispositivo. Aqui você gerencia seus dados locais.
      </div>
    </div>

    <div class="rounded-3xl bg-white/85 border border-slate-200/70 backdrop-blur p-4 space-y-3 shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
      <button class="actionBtn" @click="exportJSON">Exportar JSON</button>
      <label class="actionBtn actionBtn--alt">
        Importar JSON
        <input type="file" accept="application/json" class="hidden" @change="importJSON" />
      </label>
      <button class="actionBtn actionBtn--danger" @click="clearAll">Limpar dados locais</button>
    </div>
  </div>
</template>

<style scoped>
.actionBtn{
  width:100%;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255,255,255,.95);
  border: 1px solid rgba(148,163,184,.45);
  text-align: center;
  font-weight: 600;
}
.actionBtn--alt{
  background: rgba(124,58,237,.12);
}
.actionBtn--danger{
  background: rgba(239,68,68,.16);
  border-color: rgba(239,68,68,.45);
}
</style>
