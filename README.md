# Finc – Controle Financeiro Mobile

Frontend estático (HTML/CSS/JS) mobile-first para acompanhar entradas, categorias orçadas x reais e checklist de gastos, com gráfico de distribuição mensal.

## v1.3 (Home vibrante + menu inferior estilo app)
- HOME com cards coloridos (saldo, entradas, despesas, investimentos) clicáveis para seções; CTA e login Google mock (sem backend).
- Menu inferior arredondado com ícones (Home, Adicionar, Relatórios, Gastos, Perfil); botão central abre formulário de gasto/entrada.
- SPA React (CDN + Babel), Tailwind e Chart.js; dados em `localStorage` (`finc-v1`), scroll suave para seções.

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
