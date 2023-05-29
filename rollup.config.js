import typescript from '@rollup/plugin-typescript';
const pkgJSON = require('./package.json');
export default {
  input: 'src/index.ts',
  plugins: [typescript()],
  output: [
    {
      file: pkgJSON.main,
      format: 'cjs',
    },
    {
      file: pkgJSON.module,
      format: 'es',
    },
  ],
};
