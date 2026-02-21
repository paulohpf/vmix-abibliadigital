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

## FAQ operacional

### 1) Qual formato posso usar no campo **Versículos**?
- Versículo único: `5`
- Intervalo: `5-10`
- Se deixar vazio, o app retorna o capítulo inteiro.

### 2) Onde o JSON é gerado/atualizado?
- Em produção (app empacotado), o JSON é salvo no caminho relativo da aplicação para consumo do fluxo de transmissão.
- Em desenvolvimento, o arquivo é gerado no contexto local de execução do Electron.

### 3) O texto não atualizou na transmissão. O que verificar primeiro?
1. Confirme se a passagem foi adicionada na lista.
2. Clique em **Exibir** na passagem desejada.
3. Verifique se o software de transmissão está lendo o arquivo JSON correto.
4. Confira permissões de escrita/leitura da pasta do JSON.

### 4) O que acontece quando clico em **Exibir** em outra passagem?
- A nova passagem passa a ser a ativa e o JSON é atualizado com o conteúdo selecionado.

### 5) Posso preparar várias passagens antes da live?
- Sim. Use **Adicionar** para montar a lista antecipadamente e acione **Exibir** durante a transmissão.

### 6) Como limpar a seleção atual rapidamente?
- Use o botão de **limpar filtros** na barra superior para resetar versão, livro, capítulo e versículos.

### 7) Quais versões bíblicas estão disponíveis atualmente?
- As versões disponíveis dependem dos arquivos JSON carregados no projeto (atualmente AA, ACF e NVI).

### 8) O app funciona offline?
- Sim, para as versões locais em JSON. Se houver integração com API externa, essa parte depende de conexão.

### 9) O que fazer se aparecer erro ao gerar instalador (`electron:build`)?
- Feche instâncias abertas do app.
- Tente novamente com terminal em modo administrador.
- Verifique se nenhum antivírus está bloqueando escrita em `dist_electron`.

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

## Agradecimentos
- Agradecimento especial ao projeto Bíblia em JSON, que fornece a base dos arquivos de versões bíblicas utilizados neste aplicativo:
	https://github.com/thiagobodruk/biblia
