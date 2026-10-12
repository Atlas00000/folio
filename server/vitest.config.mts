import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/**/*.spec.ts'],
        },
      },
      {
        test: {
          name: 'api',
          include: ['test/api/**/*.spec.ts'],
          testTimeout: 30000,
          hookTimeout: 60000,
          fileParallelism: false,
          sequence: { concurrent: false },
          pool: 'forks',
        },
      },
    ],
  },
});
