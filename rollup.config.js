import typescript from '@rollup/plugin-typescript';
const pkgJSON = require('./package.json');
export default {
  input: 'src/index.ts',
  plugins: [typescript()],
  output: [
    {
      file: pkgJSON.main,
      format: 'umd',
      name: 'parseGitDiff',
    },
    {
      file: pkgJSON.module,
      format: 'es',
    },
    {
      file: 'demo/parse-git-diff.js',
      format: 'umd',
      name: 'parseGitDiff',
    },
  ],
};
