# Finc – Controle Financeiro Mobile

Frontend estático (HTML/CSS/JS) mobile-first para acompanhar entradas, categorias orçadas x reais e checklist de gastos, com gráfico de distribuição mensal.

## v1.1 (React + Tailwind + Chart.js via CDN)
- SPA React (CDN + Babel), Tailwind para layout mobile-first e gráfico donut Chart.js.
- Dados ficam em `localStorage` (`finc-v1`), por mês selecionado.
- Botão flutuante "+" para adicionar gasto/entrada; seletor/criação de mês, exportar CSV/PDF.

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
