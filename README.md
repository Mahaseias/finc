# Finc – Controle Financeiro Mobile

Frontend estático (HTML/CSS/JS) mobile-first para acompanhar entradas, categorias orçadas x reais e checklist de gastos, com gráfico de distribuição mensal.

## v1.2 (Home + menu + cards clicáveis)
- Landing HOME estilizada com call-to-action e botão mock de login Google (sem backend).
- Menu fixo de abas leva a HOME, Dashboard, Entradas, Gastos e Resumo (scroll suave).
- Cards do dashboard levam às seções correspondentes (use os botões do menu).
- SPA React (CDN + Babel) com Tailwind e Chart.js; dados no `localStorage` (`finc-v1`).

Como usar:
- Abra `index.html` no navegador (duplo clique ou servindo via HTTP estático).
- Use os formulários de Entrada e Gasto pelo botão flutuante; dados persistem em `localStorage`.
- Selecione/adicione meses pelo seletor do topo.
- Exporte CSV ou PDF pelos botões dedicados.

Publicar no GitHub Pages:
```
git add index.html README.md
git commit -m "chore: release v1.1 react/tailwind"
git push -u origin main   # ou master, conforme o repo
```
No GitHub, Settings > Pages > Source = Deploy from branch, branch = `main`, folder = `/ (root)`.
