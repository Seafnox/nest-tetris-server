import { Config } from '@stencil/core';
import { Credentials } from '@stencil/core/internal';
import * as fs from 'fs';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import * as path from 'path';

export const config: Config = {
  rollupPlugins: {
    after: [
      nodePolyfills(),
    ],
  },
  nodeResolve: {
    browser: true,
  },
  devServer: {
    https: getCerts(),
    port: 4000
  },
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
// comment the following line to disable service workers in production
      dir: '../static',
      serviceWorker: false,
//      baseUrl: 'https://myapp.local/',
    },
  ],
};

function getCerts(): Credentials {
  const clientKeyPath = path.join(__dirname, 'server/certificates/clientKey.pem');
  const certificatePath = path.join(__dirname, 'server/certificates/certificate.pem');
  try {
    const clientKey = fs.readFileSync(clientKeyPath).toString();
    const certificate = fs.readFileSync(certificatePath).toString();

    return {
      key: clientKey,
      cert: certificate,
    }
  }
  catch (error) {
    console.warn(`Can't find some of cetificates: ${clientKeyPath} OR ${certificatePath}`)
    console.error(error);
  }
}
