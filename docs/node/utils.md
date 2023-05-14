# Nodejs 工具函数

## runCommand
```ts
import { spawn } from 'child_process'
import type { StdioOptions } from 'child_process'

const { toString } = Object.prototype
function isNil(val: unknown): val is (undefined | null) {
  return val == null
}
function isNull(val: unknown): val is null {
  return toString.call(val) === '[object Null]'
}

interface RunCommandOptions {
  stdio?: StdioOptions | undefined | null;
  cwd?: string;
  beforeRun?: (command: string) => boolean | void;
}

export async function runCommand(
  command: string,
  {
    cwd = process.cwd(),
    stdio = 'inherit',
    beforeRun,
  }: RunCommandOptions = {
    cwd: process.cwd(),
    stdio: 'inherit'
  }
): Promise<string | undefined> {
  return new Promise<string | undefined>((resolve, reject) => {
    const shouldToRun = beforeRun?.(command)
    if (shouldToRun === false) {
      return
    }

    const [cmd, ...args] = command.split(' ')
    let data = ''

    const app = spawn(cmd, args, {
      cwd,
      stdio: isNull(stdio) ? undefined : stdio,
      shell: process.platform === 'win32',
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.stdout?.on('data', (message) => {
      if (isNil(stdio)) {
        data += message
      }
    })
    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)
      
      if (code === 0) resolve(isNil(stdio) ? data : undefined)
      else
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        )
    })
    process.on('exit', onProcessExit)
  })
}
```
