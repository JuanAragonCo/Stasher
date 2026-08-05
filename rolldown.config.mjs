import { defineConfig } from 'rolldown';
import { builtinModules } from 'node:module';

export default defineConfig({
  input: 'src/main.ts',
  resolve: {
    conditionNames: ['node']
  },
  external: [
    ...builtinModules,
    ...builtinModules.map((m) => `node:${m}`),
  ],
  output: {
    dir: 'dist',
    format: 'cjs',
  }
})
