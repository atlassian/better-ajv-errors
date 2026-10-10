# Change intents

Each Markdown file here is a pending change: the version bump it needs and the summary that goes into `CHANGELOG.md`. Record one with `pnpm change`.

On `main`, the [Release workflow](../.github/workflows/release.yml) applies them with `pnpm version -r` in a release pull request, and publishes the package when that pull request is merged. `ledger.yaml` lists the intents each release consumed. See [Release management](https://pnpm.io/versioning) in the pnpm docs.
