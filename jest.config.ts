import type { Config } from 'jest'
import { createDefaultPreset } from 'ts-jest'

const { transform } = createDefaultPreset()

export default {
  testEnvironment: 'jsdom',
  transform,
} satisfies Config
