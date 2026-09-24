# Lucas Porto · Personal Trainer

Landing page em HTML/CSS/JS puro, sem framework e sem build step.

```
index.html   → estrutura e conteúdo (planos, preços, textos)
style.css    → visual (cores, fontes, animações, responsivo)
script.js    → link do WhatsApp, animações ao rolar, abas
.nojekyll    → diz ao GitHub Pages para servir os arquivos como estão
```

## Ver localmente

Abra o `index.html` no navegador, ou sirva a pasta:

```bash
python3 -m http.server 8000
```

e acesse http://localhost:8000.

## Publicar no GitHub Pages

O site é servido direto da raiz da branch `main`.

1. Envie os arquivos para o repositório (`git push origin main`).
2. No GitHub, abra **Settings → Pages** do repositório `raimedeiros/LucasPorto`.
3. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
4. Em **Branch**, selecione `main` e a pasta `/ (root)`. Clique em **Save**.
5. Aguarde 1–2 minutos. O site fica em **https://raimedeiros.github.io/LucasPorto/**.

A cada novo `push` na `main`, o site é atualizado automaticamente.

> Domínio próprio: em **Settings → Pages → Custom domain**, informe o domínio e configure o DNS conforme a documentação do GitHub.

## Onde editar

- **WhatsApp (número e mensagem):** topo do `script.js` (`WHATSAPP_NUMBER`, `WHATSAPP_MESSAGE`). Os `href` no HTML são só fallback caso o JS não carregue.
- **Preços e planos:** direto no `index.html`, nas seções `#consultoria-online`, `#planos-mensais` (acompanhamento mensal) e `#avulsos`.
- **Cores e fontes:** variáveis no início do `style.css` (`:root`).
- **Cache:** ao alterar `style.css`, `script.js` ou as imagens em `assets/`, aumente o número em `?v=` nos links do `index.html` (ex.: `style.css?v=3`). Sem isso, navegadores podem continuar usando o arquivo antigo e a página aparece com estilos quebrados.
- **Logo e foto:** `assets/logo.svg` (topo e rodapé) e `assets/lucas.png` (hero). Para trocar, substitua os arquivos mantendo o mesmo nome.
- **Mensagem do WhatsApp por plano:** cada botão de plano tem um `data-plan` no `index.html`; o texto base fica em `WHATSAPP_PLAN_MESSAGE` no `script.js`.
