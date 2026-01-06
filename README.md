# FINC v1.4 – Vue + Vite + Tailwind + Chart.js (PWA-ready)

App mobile-first com navegação inferior, cards vibrantes, donut de gastos e dados 100% locais (localStorage). Estrutura Vite + Vue 3, Tailwind, Chart.js e service worker simples para suporte PWA.

## Requisitos
- Node 18+

## Instalação e execução
```bash
npm install
npm run dev    # http://localhost:5173
npm run build  # saída em dist/
npm run preview
```

## Estrutura
- `src/App.vue` – layout mobile com nav inferior (Home/Adicionar/Relatórios/Perfil) e gradientes.
- `src/pages/Dashboard.vue` – KPI cards + donut “Gastos do mês” + recentes.
- `src/pages/Add.vue` – registro rápido (Despesa/Receita/Investimento/Dívida).
- `src/store/financeStore.js` – estado reativo em `localStorage` (`finance_app_v1`).
- `public/manifest.webmanifest` + `public/sw.js` – base PWA offline.

## Deploy no GitHub Pages
```bash
npm run build
# publique o conteúdo de dist/ (ex: gh-pages ou ação automática)
```
No Pages, aponte para a pasta `dist` da branch escolhida.
