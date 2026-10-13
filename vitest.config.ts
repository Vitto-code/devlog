import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts', 'scripts/**/*.ts'],
      exclude: ['scripts/build-search-index.ts'],
      reporter: ['text', 'lcov'],
      thresholds: {
        lines: 70,
        functions: 70,
        statements: 70,
        branches: 70,
      },
    },
  },
});
