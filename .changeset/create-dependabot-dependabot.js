const process = require('process');
const write = require('@changesets/write').default;

const [, , summary, packageName] = process.argv;

if (!summary || !packageName) {
  console.error(
    'node .changeset/create-dependabot-dependabot.js "<SUMMARY>" "<PACKAGE_NAME>"'
  );
}

const changeset = {
  summary,
  releases: [{ name: packageName, type: 'patch' }],
};

const cwd = process.cwd();

write(changeset, cwd).then(uniqueId =>
  console.log(`.changeset/${uniqueId}.md`)
);
