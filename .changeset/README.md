# Change intents

Each Markdown file here is a pending change: the version bump it needs and the summary that goes into `CHANGELOG.md`. Record one with `pnpm change`.

On `main` and `next`, the [Release workflow](../.github/workflows/release.yml) applies them with `pnpm version -r` in a release pull request, and publishes the package when that pull request is merged. `ledger.yaml` lists the intents each release consumed. See [Release management](https://pnpm.io/versioning) in the pnpm docs.

For prereleases, put `next` on the `next` [lane](https://pnpm.io/cli/lane) with `pnpm lane next --filter better-ajv-errors`, which sets `versioning.lanes` in `pnpm-workspace.yaml`. Its releases are then prereleases such as `4.0.0-next.0`, published under the `next` dist-tag, and intents stay here until the lane ends. End the lane with `pnpm lane main --filter better-ajv-errors` in the pull request that merges `next` into `main`, and only once the last prerelease is on npm, or `pnpm version -r` folds the intents into it and deletes them. `pnpm lane` drops the comments in `pnpm-workspace.yaml` when it rewrites the file, so edit `versioning.lanes` by hand or restore them.
