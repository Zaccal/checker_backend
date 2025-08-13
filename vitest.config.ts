import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 20000, // 10 seconds
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'],
  },
})
