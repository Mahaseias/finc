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
  <div class="app-shell">
    <div class="bg-layer" />
    <div class="blob blob-a" />
    <div class="blob blob-b" />
    <div class="blob blob-c" />

    <header class="header">
      <div class="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="logo">📈</span>
          <div>
            <div class="text-xs text-white/70 leading-4">Finance</div>
            <div class="text-base font-semibold leading-5">Seu painel</div>
          </div>
        </div>
        <button class="iconbtn" aria-label="Notificações">🔔</button>
      </div>
    </header>

    <main class="content">
      <div class="max-w-md mx-auto px-4 pt-4 pb-28">
        <component :is="Current" />
      </div>
    </main>

    <nav class="bottomnav" aria-label="Menu">
      <div class="max-w-md mx-auto px-4 pb-4">
        <div class="navcard">
          <div class="flex items-center justify-between">
            <button class="navbtn" :class="tab === 'home' && 'active'" @click="tab = 'home'">
              <span>🏠</span><small>Home</small>
            </button>

            <button class="navbtn" :class="tab === 'reports' && 'active'" @click="tab = 'reports'">
              <span>📊</span><small>Relatórios</small>
            </button>

            <button class="fab" @click="tab = 'add'" aria-label="Adicionar" title="Adicionar">
              ＋
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
.app-shell {
  min-height: 100dvh;
  position: relative;
  overflow: hidden;
  color: white;
}
.bg-layer {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #2b1668 0%, #1b2a70 45%, #0b1e33 100%);
}
.blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(60px);
  opacity: 0.5;
}
.blob-a {
  width: 320px;
  height: 320px;
  left: -120px;
  top: -120px;
  background: rgba(168, 85, 247, 0.7);
}
.blob-b {
  width: 320px;
  height: 320px;
  right: -140px;
  top: 180px;
  background: rgba(34, 211, 238, 0.6);
}
.blob-c {
  width: 320px;
  height: 320px;
  left: 60px;
  bottom: -140px;
  background: rgba(236, 72, 153, 0.45);
}
.header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(7, 15, 25, 0.35);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.content {
  position: relative;
  z-index: 10;
  height: calc(100dvh - 64px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.logo {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.iconbtn {
  width: 40px;
  height: 40px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.bottomnav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
}
.navcard {
  position: relative;
  border-radius: 24px;
  background: rgba(20, 20, 45, 0.72);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 10px;
}
.navbtn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 72px;
  padding: 8px 6px;
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.72);
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
.fab {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -18px;
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #fde047, #fb923c);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  font-size: 28px;
  color: #111827;
}
</style>
