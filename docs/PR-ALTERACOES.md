# PR: Estabilização técnica, UX operacional e suporte mobile

## Contexto
Esta PR consolida melhorias técnicas e de usabilidade no projeto vMix Bíblia Live, com foco em:

- estabilidade de build (web e Electron)
- evolução do código para TypeScript no renderer
- melhorias de operação para uso ao vivo
- ganho de performance no carregamento dos dados bíblicos
- hardening de segurança no fluxo de gravação de JSON
- documentação e branding do produto

## Escopo principal

### 1) Migração e padronização TypeScript (renderer)
- Migração de módulos centrais em `src/store` para TypeScript.
- Criação/organização de interfaces por domínio (`interface.ts` em pastas relevantes).
- Ajustes de `tsconfig`, Babel e ESLint para convivência Vue 2 + TS.
- Manutenção de `background/preload` em JavaScript para garantir compatibilidade com o pipeline Electron atual.

### 2) Estabilidade de build
- Correções de configuração para build web e empacotamento Electron.
- Ajuste do local de configuração do electron-builder em `vue.config.js` (`builderOptions`) para evitar falhas de empacotamento.
- Validação de build concluída com sucesso (`yarn run build` e `yarn electron:build`).

### 3) Performance
- Refatoração do provider de Bíblia JSON para lazy-load por versão com cache em memória.
- Redução de custo de carregamento inicial e melhor responsividade nas trocas de versão/livro/capítulo.
- Ajustes de paginação em tabelas para melhor fluidez operacional.

### 4) Segurança
- Hardening de IPC no Electron com:
  - validação de origem do emissor
  - validação de payload (estrutura e limites)
  - proteção adicional antes da escrita de arquivo JSON

### 5) UX e operação (desktop + mobile)
- Melhorias no fluxo de filtros em `Navbar`:
  - carregamento assíncrono de livros/capítulos
  - feedback de quantidade de versículos do capítulo
  - melhor espaçamento e toque em telas pequenas
- Ajustes de copy para linguagem operacional (menos termos técnicos).
- Ajuda rápida revisada:
  - botão no desktop permanece fora do menu
  - botão no mobile foi integrado ao menu superior
- Correção da exibição da tabela de versículos no mobile (remoção de modo empilhado indesejado).
- Inclusão de atalho mobile para lista de selecionados (`Lista (N)`), com abertura e rolagem automática até a lista para evitar navegação longa em capítulos extensos.

### 6) Testes
- Inclusão de testes unitários para store e provider de Bíblia JSON.
- Suíte base validada com sucesso na sessão.

### 7) Branding e documentação
- Nome oficial do produto atualizado para **vMix Bíblia Live**.
- Atualizações de metadados do app e textos públicos.
- README reestruturado para usuários e contribuidores.
- Inclusão de FAQ operacional e agradecimentos da fonte de dados bíblicos.

## Arquivos impactados (resumo)
- `src/store/**`
- `src/providers/biblejson.ts`
- `src/components/Navbar.vue`
- `src/views/Home.vue`
- `src/plugins/vuetify.ts`
- `src/background.js`
- `src/electron/preload.js`
- `src/providers/electron.js`
- `vue.config.js`
- `babel.config.js`
- `tsconfig.json`
- `package.json`
- `public/index.html`
- `README.md`
- `tests/unit/**`

## Riscos e observações
- O projeto segue em Vue 2 + Electron; o suporte a TS no processo principal Electron não foi expandido nesta etapa para preservar estabilidade.
- Persistem warnings não bloqueantes de Sass/asset size em build, sem impacto funcional para o objetivo desta PR.

## Validação executada
- Build web: `yarn run build` concluído com sucesso.
- Build Electron: `yarn electron:build` concluído com sucesso.
- Testes unitários da suíte adicionada executados com sucesso durante a sessão.

## Resultado
Entrega focada em confiabilidade de operação ao vivo, melhor experiência mobile, base técnica mais sustentável e documentação pronta para evolução contínua do produto.
