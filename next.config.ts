import {NextConfig} from 'next';

const allowdOrigins = ['https://studio.datachain.ai'];

const allowdOriginsStr = allowdOrigins.join(' ');

const cspValue = `frame-ancestors 'self' ${allowdOriginsStr};`;

const config: NextConfig = {
  reactStrictMode: true,
  headers: async () =>
    await Promise.resolve([
      {
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspValue,
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
        source: '/(.*)',
      },
    ]),
};

export default config;
