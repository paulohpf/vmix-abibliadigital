module.exports = {
  chainWebpack: config => {
    config.entry('app').clear().add('./src/main.ts');
    config.resolve.extensions.add('.ts').add('.tsx');

    // Disable eslint-loader for TypeScript files
    config.module
      .rule('eslint')
      .exclude.add(/\.(ts|tsx)$/)
      .end();

    // Update babel-loader to process TypeScript
    config.module
      .rule('babel')
      .test(/\.(js|jsx|ts|tsx)$/)
      .exclude.add(/node_modules/)
      .end();

    config.module
      .rule('ts')
      .test(/\.tsx?$/)
      .use('babel-loader')
      .loader('babel-loader')
      .end();
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/background.ts',
      preload: 'src/electron/preload.ts',
    },
  },
};
