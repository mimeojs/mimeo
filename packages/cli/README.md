---
some: value
---

# mimeojs-cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mimeojs-cli.svg)](https://npmjs.org/package/mimeojs-cli)
[![Downloads/week](https://img.shields.io/npm/dw/mimeojs-cli.svg)](https://npmjs.org/package/mimeojs-cli)
[![License](https://img.shields.io/npm/l/mimeojs-cli.svg)](https://github.com/mikaelkaron/mimeojs-cli/blob/master/package.json)

<!-- toc -->
* [mimeojs-cli](#mimeojs-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @mimeojs/cli
$ mimeo COMMAND
running command...
$ mimeo (-v|--version|version)
@mimeojs/cli/0.0.0 win32-x64 node-v15.5.1
$ mimeo --help [COMMAND]
USAGE
  $ mimeo COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`mimeo help [COMMAND]`](#mimeo-help-command)
* [`mimeo list [...PATTERN]`](#mimeo-list-pattern)
* [`mimeo plugins`](#mimeo-plugins)
* [`mimeo plugins:install PLUGIN...`](#mimeo-pluginsinstall-plugin)
* [`mimeo plugins:link PLUGIN`](#mimeo-pluginslink-plugin)
* [`mimeo plugins:uninstall PLUGIN...`](#mimeo-pluginsuninstall-plugin)
* [`mimeo plugins:update`](#mimeo-pluginsupdate)
* [`mimeo read [...PATH]`](#mimeo-read-path)
* [`mimeo rename`](#mimeo-rename)
* [`mimeo transform`](#mimeo-transform)
* [`mimeo write`](#mimeo-write)

## `mimeo help [COMMAND]`

display help for mimeo

```
USAGE
  $ mimeo help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `mimeo list [...PATTERN]`

lists files matching a glob pattern

```
USAGE
  $ mimeo list [...PATTERN]

ARGUMENTS
  PATTERN  glob pattern of files to match

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/list.ts](https://github.com/mikaelkaron/mimeojs-cli/blob/v0.0.0/src/commands/list.ts)_

## `mimeo plugins`

list installed plugins

```
USAGE
  $ mimeo plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ mimeo plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/index.ts)_

## `mimeo plugins:install PLUGIN...`

installs a plugin into the CLI

```
USAGE
  $ mimeo plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command 
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in 
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ mimeo plugins:add

EXAMPLES
  $ mimeo plugins:install myplugin 
  $ mimeo plugins:install https://github.com/someuser/someplugin
  $ mimeo plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/install.ts)_

## `mimeo plugins:link PLUGIN`

links a plugin into the CLI for development

```
USAGE
  $ mimeo plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello' 
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLE
  $ mimeo plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/link.ts)_

## `mimeo plugins:uninstall PLUGIN...`

removes a plugin from the CLI

```
USAGE
  $ mimeo plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ mimeo plugins:unlink
  $ mimeo plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/uninstall.ts)_

## `mimeo plugins:update`

update installed plugins

```
USAGE
  $ mimeo plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/update.ts)_

## `mimeo read [...PATH]`

reads files to vfile

```
USAGE
  $ mimeo read [...PATH]

ARGUMENTS
  PATH  file paths

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/read.ts](https://github.com/mikaelkaron/mimeojs-cli/blob/v0.0.0/src/commands/read.ts)_

## `mimeo rename`

renames vfiles

```
USAGE
  $ mimeo rename

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/rename.ts](https://github.com/mikaelkaron/mimeojs-cli/blob/v0.0.0/src/commands/rename.ts)_

## `mimeo transform`

transforms markdown vfiles to html vfiles

```
USAGE
  $ mimeo transform

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/transform.ts](https://github.com/mikaelkaron/mimeojs-cli/blob/v0.0.0/src/commands/transform.ts)_

## `mimeo write`

writes files to vfile

```
USAGE
  $ mimeo write

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/write.ts](https://github.com/mikaelkaron/mimeojs-cli/blob/v0.0.0/src/commands/write.ts)_
<!-- commandsstop -->
