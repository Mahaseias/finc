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
    <div class="rounded-3xl bg-white/10 border border-white/10 backdrop-blur p-4">
      <div class="font-semibold mb-2">Configurações locais</div>
      <div class="text-sm text-white/70">
        Sem backend: tudo fica salvo no dispositivo. Aqui você gerencia seus dados locais.
      </div>
    </div>

    <div class="rounded-3xl bg-white/10 border border-white/10 backdrop-blur p-4 space-y-3">
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
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.14);
  text-align: center;
  font-weight: 600;
}
.actionBtn--alt{
  background: rgba(255,255,255,.12);
}
.actionBtn--danger{
  background: rgba(239,68,68,.20);
  border-color: rgba(239,68,68,.35);
}
</style>
