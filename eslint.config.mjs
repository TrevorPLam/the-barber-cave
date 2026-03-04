// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsdoc from "eslint-plugin-jsdoc";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // JSDoc Quality Gates Configuration - Fixed flat config syntax
  { ...jsdoc.configs['flat/recommended-typescript'], plugins: { jsdoc } },
  // TSDoc-First Rules Configuration
  {
    rules: {
      'jsdoc/require-jsdoc': ['error', {
        publicOnly: true,
        require: {
          FunctionDeclaration: true,
          ArrowFunctionExpression: true,
          ClassDeclaration: true,
          MethodDefinition: true,
        },
        contexts: [
          'VariableDeclaration',
          'TSInterfaceDeclaration',
          'TSTypeAliasDeclaration',
        ],
        checkConstructors: false,
        checkGetters: false,
        checkSetters: false,
      }],
      'jsdoc/require-param': ['warn', { checkDestructuredRoots: false }],
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-description': ['warn', {
        descriptionStyle: 'body',
        checkConstructors: false,
        checkGetters: false,
        checkSetters: false,
      }],
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-types': 'error',
      'jsdoc/no-undefined-types': 'error',
      'jsdoc/valid-types': 'error',
    },
    settings: {
      jsdoc: {
        mode: 'typescript',
        tagNamePreference: {
          returns: 'returns',
          param: 'param',
        },
      },
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Additional documentation and generated files
    "docs/api/**",
    "storybook-static/**",
    "**/*.stories.tsx",
  ]),
  // Disallow direct console.log / console.info / console.debug in source files.
  // Use src/lib/logger.ts (server) or src/lib/client-logger.ts (browser) instead.
  {
    rules: {
      'no-console': ['warn', { allow: ['error', 'warn'] }],
    },
  },
  // CLI scripts may use console.log freely for output.
  {
    files: ['src/data/seed.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  ...storybook.configs["flat/recommended"]
]);

export default eslintConfig;
