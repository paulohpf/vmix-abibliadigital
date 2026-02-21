# vMix Bíblia Live

Aplicativo desktop para selecionar passagens bíblicas e publicar o conteúdo em JSON para exibição em transmissões ao vivo (vMix/overlay).

## O que o app faz
- Permite selecionar versão, livro, capítulo e faixa de versículos.
- Monta uma lista de passagens para operação ao vivo.
- Atualiza um arquivo JSON consumido pelo fluxo de exibição da transmissão.

## Para quem é
- Equipes de mídia de igrejas e eventos ao vivo.
- Operadores que precisam trocar textos bíblicos com rapidez e segurança durante a transmissão.

## Requisitos
- Node.js 16.x (recomendado para compatibilidade com Electron Builder).
- Yarn 1.x (`npm i -g yarn`) ou npm.
- Windows para geração do instalador `.exe`.

## Uso rápido (usuário)
1. Abra o aplicativo.
2. Selecione **Versão**, **Livro** e **Capítulo**.
3. (Opcional) Informe **Versículos** no formato `5` ou `5-10`.
4. Clique em **Buscar** para visualizar os versos.
5. Clique em **Adicionar** para enviar a passagem para a lista operacional.
6. Marque **Exibir** na lista para publicar no JSON da transmissão.

## Desenvolvimento local

### Instalação
```bash
yarn install
```

### Executar em modo desenvolvimento (web)
```bash
yarn serve
```

### Executar app Electron em desenvolvimento
```bash
yarn electron:serve
```

### Build web
```bash
yarn build
```

### Build desktop (Electron)
```bash
yarn electron:build
```

### Testes unitários
```bash
yarn test:unit
```

### Lint
```bash
yarn lint
```

## Estrutura do projeto (resumo)
- `src/components`: componentes de UI (ex.: barra de filtros e tabelas).
- `src/views`: telas principais do aplicativo.
- `src/providers`: regras de dados e integração (bíblias, escrita de JSON).
- `src/store`: estado global (Vuex).
- `src/background.js` e `src/electron/preload.js`: processo principal e bridge do Electron.
- `tests/unit`: testes unitários.

## Como contribuir
1. Faça um fork ou crie uma branch a partir de `main`.
2. Crie uma branch descritiva: `feat/nome-da-melhoria` ou `fix/nome-do-ajuste`.
3. Faça alterações pequenas e focadas.
4. Rode localmente:
	- `yarn lint`
	- `yarn test:unit`
	- `yarn build`
5. Abra um Pull Request com:
	- contexto do problema,
	- o que foi alterado,
	- como validar,
	- prints/gifs para mudanças visuais.

## Boas práticas para PR
- Evite misturar refactor grande com correção funcional.
- Mantenha consistência de idioma (PT-BR na UI).
- Preserve compatibilidade do `electron:build`.

## Licença
Definir licença do projeto (ex.: MIT) caso haja distribuição pública.
