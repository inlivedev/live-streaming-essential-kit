import { builtinModules } from 'module';
import { readFileSync } from 'fs';
import { globby } from 'globby';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete';
import { serve } from './src/scripts/reload-server.js';

const packageJson = JSON.parse(
  readFileSync(new URL('package.json', import.meta.url))
);

const serverFilePath = 'build/__server/server.js';

const external = [
  ...builtinModules,
  ...(packageJson.dependencies ? Object.keys(packageJson.dependencies) : []),
  ...(packageJson.devDependencies
    ? Object.keys(packageJson.devDependencies)
    : [])
];

const clientEntries = {};

const features = await globby('src/features/**/*.js');

const pages = await globby('src/pages/**/*.js');

const ssrClients = await globby('src/ssr/client/**.js');

features.forEach((input) => {
  clientEntries[input.replace('src/', '')] = input;
});

pages.forEach((input) => {
  clientEntries[input.replace('src/', '')] = input;
});

ssrClients.forEach((input) => {
  clientEntries[input.replace('src/', '')] = input;
});

export default [
  {
    input: clientEntries,
    output: {
      dir: 'build/__client',
      format: 'es',
      entryFileNames: '[name]'
    },
    plugins: [
      del({
        targets: 'build/__client'
      }),
      nodeResolve(),
      commonjs()
    ],
    watch: {
      chokidar: {},
      include: ['src/**'],
      exclude: ['node_modules/**'],
      clearScreen: false
    }
  },
  {
    input: 'src/scripts/server.js',
    output: {
      dir: 'build/__server',
      format: 'es'
    },
    external: external,
    plugins: [
      del({
        targets: 'build/__server'
      }),
      nodeResolve(),
      commonjs(),
      serve(serverFilePath, undefined, process.env)
    ],
    watch: {
      chokidar: {},
      include: ['src/**'],
      exclude: ['node_modules/**'],
      clearScreen: false
    }
  }
];
