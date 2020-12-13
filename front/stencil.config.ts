import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/normalize.css',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      // comment the following line to disable service workers in production
//      serviceWorker: false,
//      baseUrl: 'https://myapp.local/',
    },
  ],
};
