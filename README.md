# conecta-frontend

Site da **Conecta**: portfólio com abertura 3D animada dos sete cubos do símbolo, serviços, vitrine de projetos conceito com telas ilustradas, projetos reais e contato por e-mail e WhatsApp.

Angular 22 · TypeScript · SCSS · Three.js (só na abertura) · GSAP.
O conteúdo vem da [conecta-api](https://github.com/ivannalison/conecta-api).

## Requisitos

- Node.js **22.22.3 ou mais novo** (exigência do Angular 22)
- A `conecta-api` rodando em `http://localhost:3000`

## Como rodar

```powershell
npm install
npm start          # http://localhost:4200
```

Em outro terminal, na pasta `conecta-api`:

```powershell
npm run dev        # http://localhost:3000
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm start` | Servidor de desenvolvimento, com recarga automática |
| `npm test` | Testes (Vitest), uma vez |
| `npm run typecheck` | Confere os tipos sem gerar arquivos |
| `npm run build` | Build de produção em `dist/` |

## Como o site se conecta à API

- O endereço da API fica em `src/environments/`:
  - `environment.development.ts` → `http://localhost:3000/api/v1` (usado no `npm start`)
  - `environment.ts` → produção. **Pendente:** trocar pelo endereço do Cloud Run na Fase 5.
- A API só aceita chamadas dos endereços listados em `CORS_ORIGINS` (no `.env` da API). No ambiente local é `http://localhost:4200`.
- O site faz **uma** chamada, `GET /site`, em paralelo com a abertura. A primeira tela não depende dela: os textos do hero ficam no front-end.
- Se a API demorar, cair ou responder algo inesperado, cada seção mostra um aviso neutro com o botão "Tentar de novo". Nenhum detalhe técnico aparece para o visitante.

## Estrutura

```
src/app/
├── app.ts              Página única: controla a abertura e monta as seções
├── core/               Dados e regras
│   ├── site.service.ts   Chamada à API e estados (carregando, ok, erro)
│   ├── theme.service.ts  Cores de cada cartão da vitrine, com contraste WCAG AA
│   ├── quality.service.ts Níveis de qualidade (completo, médio, simplificado, reduzido)
│   ├── contact.ts        Links mailto e wa.me
│   ├── color.ts          Cálculo de contraste
│   └── textos.ts         Textos fixos do site
├── scene/              Abertura 3D
│   ├── logo-geometry.ts  Geometria e cores oficiais dos sete cubos (não redesenhar)
│   ├── scene-engine.ts   Motor Three.js (carregado sob demanda)
│   └── scene.service.ts  Porta de entrada da cena para o resto do site
├── sections/           Uma seção da página por arquivo
└── ui/                 Marca, ícones e peças reutilizáveis
public/
├── brand/              SVGs de referência do símbolo e da assinatura IN
└── fonts/              Fontes servidas junto do site
```

## Marca

- **Símbolo dos sete cubos:** geometria medida uma única vez a partir da referência aprovada, em `src/app/scene/logo-geometry.ts`. O SVG do cabeçalho e os cubos 3D usam os mesmos números e as mesmas cores (degradê verde-lima → menta, um tom por cubo).
- **Assinatura IN:** traçada uma única vez a partir de `image_7b488c4a.jpg`, em `public/brand/in-assinatura.svg`. Sempre monocromática (branco ou Graphite).

Nenhum dos dois deve ser redesenhado.

## Cena 3D e desempenho

O 3D aparece só na abertura (cerca de 1,6 s): os cubos formam o símbolo e vão para o cabeçalho. Depois o motor é descartado e o site segue em HTML normal, lido por leitores de tela mesmo sem 3D.

| Nível | Quando | O que muda |
|---|---|---|
| completo | Computadores e celulares potentes | Cena completa |
| medio | Celulares intermediários e telas estreitas | Resolução menor |
| simplificado | Sem WebGL ou com economia de dados | Sem cena 3D: símbolo estático |
| reduzido | Preferência de movimento reduzido | Sem animações contínuas nem abertura |

Para testar:

- `?fps` mostra os quadros por segundo e o nível em uso. Ex.: `http://localhost:4200/?fps`
- `?q=medio` (ou `completo`, `simplificado`, `reduzido`) força um nível
- `?nointro` pula a abertura

## Fontes

Cabinet Grotesk (títulos) e Switzer (textos), da [Fontshare](https://www.fontshare.com), sob a licença gratuita da Indian Type Foundry, que permite uso comercial na web. São servidas pelo próprio site, sem serviço externo.

## Pendências

- Vídeo e imagem da Amazônia para o hero, com licença de uso comercial (`HERO_MEDIA` em `core/textos.ts`)
- Imagem institucional (notebook e caneca) para a seção Sobre
- Endereço da API em produção (Fase 5)
