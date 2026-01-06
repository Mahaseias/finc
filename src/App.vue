<script setup>
import { computed, ref } from 'vue'
import Dashboard from './pages/Dashboard.vue'
import Add from './pages/Add.vue'
import Reports from './pages/Reports.vue'
import Profile from './pages/Profile.vue'

const tab = ref('home')

const Current = computed(() => {
  if (tab.value === 'home') return Dashboard
  if (tab.value === 'add') return Add
  if (tab.value === 'reports') return Reports
  return Profile
})
</script>

<template>
  <div class="min-h-dvh text-white relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-[#2b1668] via-[#1b2a70] to-[#0b1e33]" />
    <div class="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-purple-500/25 blur-3xl" />
    <div class="absolute top-40 -right-24 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />
    <div class="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-fuchsia-500/15 blur-3xl" />

    <div class="relative max-w-md mx-auto px-4 pt-5 pb-24">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-white/10 border border-white/10">
            <span class="text-lg">📈</span>
          </span>
          <div>
            <div class="text-xs text-white/70 leading-4">Finance</div>
            <div class="text-base font-semibold leading-5">Seu painel</div>
          </div>
        </div>
        <button class="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 active:scale-95 transition">
          <span class="text-lg">🔔</span>
        </button>
      </div>

      <component :is="Current" />
    </div>

    <nav class="fixed bottom-0 left-0 right-0">
      <div class="max-w-md mx-auto px-4 pb-4">
        <div class="relative rounded-3xl bg-[#1b1b3a]/70 backdrop-blur border border-white/10 px-3 py-3">
          <div class="flex items-center justify-between">
            <button class="navbtn" :class="tab === 'home' && 'active'" @click="tab = 'home'">
              <span>🏠</span><small>Home</small>
            </button>
            <button class="navbtn" :class="tab === 'reports' && 'active'" @click="tab = 'reports'">
              <span>📊</span><small>Relatórios</small>
            </button>

            <button
              class="absolute left-1/2 -translate-x-1/2 -top-5 w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border border-white/20 shadow-xl active:scale-95 transition grid place-items-center"
              @click="tab = 'add'"
              aria-label="Adicionar"
              title="Adicionar"
            >
              <span class="text-2xl">＋</span>
            </button>

            <div class="w-14"></div>

            <button class="navbtn" :class="tab === 'add' && 'active'" @click="tab = 'add'">
              <span>🧾</span><small>Adicionar</small>
            </button>
            <button class="navbtn" :class="tab === 'profile' && 'active'" @click="tab = 'profile'">
              <span>👤</span><small>Perfil</small>
            </button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.navbtn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 72px;
  padding: 8px 6px;
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.75);
}
.navbtn.active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
.navbtn small {
  font-size: 11px;
  line-height: 12px;
}
.navbtn span {
  font-size: 18px;
  line-height: 18px;
}
</style>
