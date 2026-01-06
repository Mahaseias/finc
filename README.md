# Finc – Controle Financeiro Mobile

Frontend estático (HTML/CSS/JS) mobile-first para acompanhar entradas, categorias orçadas x reais e checklist de gastos, com gráfico de distribuição mensal.

## v1.2 (HTML estático estilo card vibrante)
- UI estática em HTML + Tailwind + Lucide (CDN), foco mobile, cards vibrantes e menu inferior com botão flutuante para adicionar.
- Modal para nova movimentação (Entrada ou Gasto); dados persistem em `localStorage` (`finc_transactions`) e são carregados automaticamente.
- Sem login; 100% offline/local.

Como usar:
- Abra `index.html` no navegador (duplo clique ou servindo via HTTP estático).
- Clique no botão “+” do menu inferior para registrar entradas ou gastos; os totais são exibidos nos cards.
- Dados ficam gravados no navegador; use o ícone de lixeira para limpar.

Publicar no GitHub Pages:
```
git add index.html README.md
git commit -m "chore: release v1.1 react/tailwind"
git push -u origin main   # ou master, conforme o repo
```
No GitHub, Settings > Pages > Source = Deploy from branch, branch = `main`, folder = `/ (root)`.
