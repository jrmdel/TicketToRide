const path = require('path');

module.exports = {
  transpileDependencies: ['vuetify'],

  publicPath: '/TicketToRide/',

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'fr',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
};
