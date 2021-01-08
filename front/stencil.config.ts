import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export const config: Config = {
  rollupPlugins: {
    after: [
      nodePolyfills(),
    ],
  },
  nodeResolve: {
    browser: true,
  },
  globalStyle: 'src/global/app.css',
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
