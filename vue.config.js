module.exports = {
  chainWebpack: (config) => {
    // Desabilitar ESLint
    try {
      config.module.rules.delete('eslint');
    } catch (e) {}

    // Remove thread-loader
    config.module.rule('js').uses.delete('thread-loader');

    // Adicionar babel-loader para script blocks lang="ts" em .vue
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.loaders = options.loaders || {};
        options.loaders.ts = [
          {
            loader: 'babel-loader',
            options: {
              presets: [require.resolve('@babel/preset-typescript')],
            },
          },
        ];
        return options;
      });

    // Resolver .ts e .tsx
    config.resolve.extensions.add('.ts').add('.tsx');
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/electron/preload.ts',
    },
  },
};
