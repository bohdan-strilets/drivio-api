module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'app',
        'api',
        'auth',
        'session',
        'user',
        'db',
        'config',
        'common',
        'prisma',
      ],
    ],
    'header-max-length': [2, 'always', 100],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
  },
};
