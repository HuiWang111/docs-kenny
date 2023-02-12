# 脚手架开发

## 依赖工具

### 核心工具
1. [git-clone](https://github.com/jaz303/git-clone) Clone a git repository via git shell command.
2. [has-yarn](https://github.com/sindresorhus/has-yarn) Useful for tools that needs to know whether to use yarn or npm to install dependencies.
3. [is-installed-globally](https://github.com/sindresorhus/is-installed-globally) Check if your package was installed globally
4. [is-yarn-global](https://github.com/LitoMore/is-yarn-global) Check if installed by yarn globally without any fs calls
5. [minimist](https://github.com/minimistjs/minimist) parse argument options
6. [picocolors](https://github.com/alexeyraspopov/picocolors) The tiniest and the fastest library for terminal output formatting with ANSI colors.
7. [prompts](https://github.com/terkelg/prompts) Lightweight, beautiful and user-friendly interactive prompts
8. [rimraf](https://github.com/isaacs/rimraf) The UNIX command rm -rf for node.
9. [semver-diff](https://github.com/sindresorhus/semver-diff) Get the diff type of two semver versions: 0.0.1 0.0.2 → patch
10. [signale](https://github.com/klaudiosinani/signale) Highly configurable logging utility
11. [through2](https://github.com/rvagg/through2) A tiny wrapper around Node.js streams.Transform (Streams2/3) to avoid explicit subclassing noise
12. [vinyl-fs](https://github.com/gulpjs/vinyl-fs) Vinyl adapter for the file system.

### 点缀工具
1. [figlet](https://github.com/patorjk/figlet.js) This project aims to fully implement the FIGfont spec in JavaScript.
2. [boxen](https://github.com/sindresorhus/boxen) Create boxes in the terminal

## 脚手架版本更新提示
```ts
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import isInstalledGlobally from 'is-installed-globally'
import hasYarn from 'has-yarn'
// eslint-disable-next-line node/no-missing-import
import isYarnGlobal from 'is-yarn-global'
import type { Options as BoxenOptions } from 'boxen';
import boxen from 'boxen'
import picocolors from 'picocolors'
import semverDiff from 'semver-diff'
import type { Difference } from 'semver-diff'
import { services } from '../services'
import { getDirname } from './utils'
import { renderContext } from './pure-utils'
import { DoubleBraceReg } from './regs'

const { green, dim, reset, cyan } = picocolors
const ONE_DAY = 1000 * 60 * 60 * 24;
const __dirname = getDirname(import.meta.url)

interface Pkg {
  name: string;
  version: string;
  [key: string | symbol]: unknown;
}

interface Options {
  pkg?: Pkg;
  updateCheckInterval?: number;
}

interface Update {
  current: string;
  latest: string;
  type: Difference | undefined;
}

interface Config {
  lastUpdateCheck?: number;
}

export class UpdateNotifier {
  private _packageName: string;
  private _packageVersion: string;
  private _updateCheckInterval: number
  private _config: UpdateConfig

  public update: Update

  constructor(options: Options = {}) {
    const pkg = options.pkg || { name: '', version: '' }
    const packageName = pkg.name
    const packageVersion = pkg.version

    if (!packageName || !packageVersion) {
      throw new Error('pkg.name and pkg.version required');
    }

    this._packageName = packageName
    this._packageVersion = packageVersion
    this._updateCheckInterval = typeof options.updateCheckInterval === 'number'
      ? options.updateCheckInterval
      : ONE_DAY
    this._config = new UpdateConfig()
  }

  public async fetchInfo(): Promise<void> {
    const info = await services.fetchPackage(this._packageName)
    this.update = {
      latest: info.latest.version,
      current: this._packageVersion,
      type: semverDiff(this._packageVersion, info.latest.version)
    }
  }

  public async notify(): Promise<void> {
    const config = this._config.get()
    const now = Date.now()

    // 固定时间内只检查一次
    if (config.lastUpdateCheck && (now - config.lastUpdateCheck < this._updateCheckInterval)) {
      return
    }

    this._config.set(now)
    await this.fetchInfo()

    // if type is not undefined, should to show update message
    if (this.update.type) {
      this._showMessage()
    }
  }

  private _showMessage() {
    const options = {
      isGlobal: isInstalledGlobally,
			isYarnGlobal: isYarnGlobal(),
    }

    let installCommand: string;
		if (options.isYarnGlobal) {
			installCommand = `yarn global add ${this._packageName}`;
		} else if (options.isGlobal) {
			installCommand = `npm i -g ${this._packageName}`;
		} else if (hasYarn()) {
			installCommand = `yarn add ${this._packageName}`;
		} else {
			installCommand = `npm i ${this._packageName}`;
		}

    const template = 'Update available '
			+ dim('{{currentVersion}}')
			+ reset(' → ')
			+ green('{{latestVersion}}')
			+ ' \nRun ' + cyan('{{updateCommand}}') + ' to update';

    const boxenOptions: BoxenOptions = {
      padding: 1,
			margin: 1,
			textAlignment: 'center',
			borderColor: 'yellow',
			borderStyle: 'round',
    }

    const message = boxen(
      renderContext(template, {
				packageName: this._packageName,
				currentVersion: this.update.current,
				latestVersion: this.update.latest,
				updateCommand: installCommand,
			}, DoubleBraceReg),
			boxenOptions,
		);

    process.on('exit', () => {
      console.error(message);
    });

    process.on('SIGINT', () => {
      console.error('');
      process.exit();
    });
  }
}

class UpdateConfig {
  private _configFile: string
  private _storageDir: string

  constructor() {
    this._storageDir = join(__dirname, '../../storage')
    this._configFile = join(this._storageDir, 'update-check.json')
    this._ensureDir(this._storageDir)
    this._ensure()
  }

  private _ensureDir(dir: string) {
    if (!existsSync(dir)) {
      mkdirSync(dir)
    }
  }

  private _ensure() {
    if (existsSync(this._configFile)) return

    writeFileSync(this._configFile, JSON.stringify({}, null, 2))
  }

  get(): Config {
    return JSON.parse(readFileSync(this._configFile, 'utf8'))
  }

  set(lastUpdateCheck: number) {
    const config: Config = { lastUpdateCheck }
    writeFileSync(this._configFile, JSON.stringify(config, null, 2))
  }
}
```

## nodejs 运行 linux 命令工具
```ts
import { spawn } from 'child_process'
import chalk from 'chalk'
import consola from 'consola'

export const run = async (command: string, cwd: string = process.cwd()) =>
  new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    consola.info(`run: ${chalk.green(`${cmd} ${args.join(' ')}`)}`)
    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)

      if (code === 0) resolve()
      else
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        )
    })
    process.on('exit', onProcessExit)
  })
```