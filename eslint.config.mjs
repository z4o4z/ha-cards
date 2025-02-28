import baseConfig from '@voiceflow/eslint-config/node';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  {
    rules: {
      'no-console': 'off',
      'no-await-in-loop': 'off',
      'no-secrets/no-secrets': 'off',
    },
  },
];
