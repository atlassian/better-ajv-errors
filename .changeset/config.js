require('dotenv').config();
const { getInfo } = require('@changesets/get-github-info');

const changesetOptions = {
  // If true, we will automatically commit the changeset when the command is run
  commit: false,
};

// This function takes information about a changeset to generate an entry for it in your
// changelog. We provide the full changeset object as well as the version.
// It may be a good idea to replace the commit hash with a link to the commit.

/* the default shape is:
### Bump Type

- GIT_HASH: A summary message you wrote, indented?
*/

const getReleaseLine = async (changeset, type) => {
  const [firstLine, ...futureLines] = changeset.summary
    .split('\n')
    .map(l => l.trimRight());
  // getInfo exposes the GH username and PR number if you want them directly
  // but it also exposes a set of links for the commit, PR and GH username
  let { user, pull, links } = await getInfo({
    repo: process.env.GITHUB_REPOSITORY,
    commit: changeset.commit,
  });
  return `- ${links.commit}${links.pull === null ? '' : ` ${links.pull}`}${
    links.user === null ? '' : ` Thanks ${links.user}!`
  }: ${firstLine}\n${futureLines.map(l => `  ${l}`).join('\n')}`;
};

// This function takes information about what dependencies we are updating in the package.
// It provides an array of related changesets, as well as the dependencies updated.

/*
- Updated dependencies: [ABCDEFG]:
- Updated dependencies: [HIJKLMN]:
  - dependencyA@1.0.1
  - dependencyb@1.2.0
*/
const getDependencyReleaseLine = async (changesets, dependenciesUpdated) => {
  if (dependenciesUpdated.length === 0) return '';

  const changesetLinks = changesets.map(
    changeset => `- Updated dependencies [${changeset.commit}]:`
  );

  const updatedDepenenciesList = dependenciesUpdated.map(
    dependency => `  - ${dependency.name}@${dependency.version}`
  );

  return [...changesetLinks, ...updatedDepenenciesList].join('\n');
};

const versionOptions = {
  // If true, we will automatically commit the version updating when the command is run
  commit: false,
  // Adds a skipCI flag to the commit - only valid if `commit` is also true.
  skipCI: false,
  // Do not modify the `changelog.md` files for packages that are updated
  updateChangelog: true,
  // A function that returns a string. It takes in options about a change. This allows you to customise your changelog entries
  getReleaseLine,
  // A function that returns a string. It takes in options about when a pacakge is updated because
  getDependencyReleaseLine,
  // An array of arrays that defines packages that are linked.
  // Linked packages are packages that should be at the same version when they're released.
  // If you've used Lerna to version packages before, this is very similar.
  linked: [[]],
};

const publishOptions = {
  // This sets whether unpublished packages are public by default. We err on the side of caution here.
  public: true,
};

module.exports = {
  versionOptions,
  changesetOptions,
  publishOptions,
};
