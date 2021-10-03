module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/electron/preload.js', // make sure you have this line added
    },
  },
};
