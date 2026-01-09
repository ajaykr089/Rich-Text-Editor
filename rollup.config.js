import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, 'packages/core') === process.cwd() 
  ? join(__dirname, '..', '..') 
  : __dirname;

const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'react',
  'react-dom',
  'react/jsx-runtime'
];

const createConfig = (input, output) => [
  {
    input,
    external,
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true
      }),
      commonjs(),
      typescript({
        tsconfig: join(rootDir, 'tsconfig.json'),
        declaration: false,
        declarationMap: false
      })
    ],
    output: [
      {
        file: output.replace('.js', '.cjs.js'),
        format: 'cjs',
        sourcemap: true
      },
      {
        file: output.replace('.js', '.esm.js'),
        format: 'esm',
        sourcemap: true
      }
    ]
  },
  {
    input: output.replace('.js', '.d.ts'),
    plugins: [dts()],
    output: {
      file: output.replace('.js', '.d.ts'),
      format: 'esm'
    }
  }
];

export default (input) => {
  const pkgName = process.env.PACKAGE || 'core';
  const output = `packages/${pkgName}/dist/index.js`;

  return createConfig(join(rootDir, output), output);
};