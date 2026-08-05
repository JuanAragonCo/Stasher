# Stasher

`stasher` is a small Node.js CLI for managing named Git stashes. It wraps `git stash` with a configurable prefix so you can save, list, restore, and delete a subset of stashes that belong to this tool.

The package installs two command names:

- `sts`
- `stasher`

## Requirements

Before using this package, make sure you have:

- Node.js installed
- npm installed
- Git installed and available in your shell
- A Git repository to run the CLI inside

This project is written in TypeScript and bundled with `rolldown`.

## Setup

Install from the public npm registry:

```bash
npm install --global stasher
```

## Configuration

On first run, Stasher creates a config file using `env-paths` under your user config directory for the `stasher` app.

The generated file is:

```text
config.tml
```

Its default content is:

```toml
prefix = "stasher-"
```

That prefix is important:

- `save` automatically prepends it when missing
- `list` only shows stashes whose message starts with that prefix
- `restore` and `drop` resolve names using that prefix

## Usage

## Commands

### Global options

Available options:

- `--help`: Show CLI help.
- `--version`: Show the installed version.

Example:

```bash
sts --help
sts --version
```

### `list`

Usage:

```bash
sts list
```

Parameters:

- None.

Available options:

- No command-specific options.

Example:

```bash
sts list
```

Shows only stashes whose names start with the configured prefix.

### `save [name]`

Usage:

```bash
sts save [name]
```

Parameters:

- `name` (optional): Name for the stash. If omitted, the CLI prompts you to select an existing stash name or create a new one.

Available options:

- No command-specific options.

Example:

```bash
sts save feature-wip
```

Behavior:

- If you omit the name, the CLI prompts you to choose an existing stash name or create a new one.
- Whitespace in the final stash name is converted to `-`.
- If the name does not already include the configured prefix, the prefix is added automatically.
- If a stash with the same prefixed name already exists, the CLI asks whether it should override it.
- Saving stages all files with `git add .` before creating the stash.

Example result:

```text
stasher-feature-wip
```

### `restore [name]`

Usage:

```bash
sts restore [name]
```

Parameters:

- `name` (optional): Name of the stash to restore. If omitted, the CLI prompts you to select one.

Available options:

- No command-specific options.

Example:

```bash
sts restore feature-wip
```

Behavior:

- If no name is provided, the CLI prompts you to select one.
- The configured prefix is added automatically when missing.
- The command applies the stash and then runs `git restore --staged .` to unstage restored files.

### `drop [name]`

Usage:

```bash
sts drop [name]
```

Parameters:

- `name` (optional): Name of the stash to delete. If omitted, the CLI prompts you to select one.

Available options:

- No command-specific options.

Example:

```bash
sts drop feature-wip
```

Behavior:

- If no name is provided, the CLI prompts you to select one.
- The configured prefix is added automatically when missing.
- The CLI asks for confirmation before deleting the stash.

### `completion <shell>`

Usage:

```bash
sts completion <shell>
```

Parameters:

- `shell` (required): Target shell for completion output. Currently supported: `bash`.

Available options:

- No command-specific options.

Example:

```bash
sts completion bash
```

To load it for the current shell session:

```bash
eval "$(sts completion bash)"
```

To persist it for Bash, append that line to your shell startup file such as `~/.bashrc`.

## Notes and limitations

- This tool operates on Git stashes, so run it inside a valid Git working tree.
- `list` only recognizes stash entries formatted like standard `git stash list` output.
- The save flow uses `git add .` before stashing, which stages tracked and untracked changes in the current directory tree.

## Development

Useful commands for local development:

```bash
yarn build
yarn start
```

`yarn start` builds the project and then runs `dist/main.js`.

## License

MIT License.

Copyright (c) Juan Aragon
