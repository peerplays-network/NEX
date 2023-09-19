module.exports = {
    branches: ['feature/release-automation-changelogs'],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      '@semantic-release/changelog',
      '@semantic-release/npm',
      '@semantic-release/gitlab'
    ],
  };