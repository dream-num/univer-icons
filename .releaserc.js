module.exports = {
    plugins: [
      "@semantic-release/commit-analyzer",
      [
        "@semantic-release/release-notes-generator",
        {
          config: "conventional-changelog-cmyr-config",
        },
      ],
      "@semantic-release/npm",
      [
        "@semantic-release/git",
        {
          assets: ["package.json"],
        },
      ],
      "@semantic-release/github",
    ],
  };