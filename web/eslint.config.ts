import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  // Typed linting for TS files only
  {
    name: 'typed-ts',
    files: ['**/*.{ts,mts,tsx}'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
      },
    },
  },

  // Disable typed linting for .vue SFCs to avoid tsconfig include warnings
  {
    name: 'vue-untyped',
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        // Do not set `project` here so .vue files are not type-checked by ESLint
      },
    },
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
)
