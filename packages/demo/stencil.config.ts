import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  devServer: {
    openBrowser: false,
  },
  outputTargets: [
    {
      type: 'www',
      dir: 'dist/www',
      // comment the following line to disable service workers in production
      serviceWorker: null,
      prerenderConfig: './prerender.config.ts',
      baseUrl: 'https://myapp.local/',
    },
  ],
};
