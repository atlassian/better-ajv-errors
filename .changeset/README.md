# Change intents

Each Markdown file here is a pending change: the version bump it needs and the summary that goes into `CHANGELOG.md`. Record one with `pnpm change`.

On `main` and `next`, the [Release workflow](../.github/workflows/release.yml) applies them with `pnpm version -r` in a release pull request, and publishes the package when that pull request is merged. `ledger.yaml` lists the intents each release consumed. See [Release management](https://pnpm.io/versioning) in the pnpm docs.

`next` is on the `next` [lane](https://pnpm.io/cli/lane), set in `pnpm-workspace.yaml`, so its releases are prereleases such as `4.0.0-next.0`, published under the `next` dist-tag. Intents stay here until the lane ends. When `next` merges into `main`, end the lane in the same pull request with `pnpm lane main --filter better-ajv-errors`, and the next release is 4.0.0.
