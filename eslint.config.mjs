import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsdoc from "eslint-plugin-jsdoc";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // JSDoc Quality Gates Configuration
  jsdoc({
    config: 'flat/recommended',
    rules: {
      'jsdoc/require-description': ['error', {
        descriptionStyle: 'body',
        checkConstructors: false,
        checkGetters: false,
        checkSetters: false,
      }],
      'jsdoc/require-param-description': ['error'],
      'jsdoc/require-returns-description': ['error'],
      'jsdoc/require-jsdoc': ['error', {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false,
        },
        contexts: [
          'TSMethodSignature',
          'TSPropertySignature',
          'TSInterfaceDeclaration',
          'TSTypeAliasDeclaration',
        ],
        checkConstructors: false,
        checkGetters: false,
        checkSetters: false,
      }],
      'jsdoc/check-param-names': ['error'],
      'jsdoc/check-tag-names': ['error'],
      'jsdoc/check-types': ['error'],
      'jsdoc/no-undefined-types': ['error'],
      'jsdoc/valid-types': ['error'],
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
  }),
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
]);

export default eslintConfig;
