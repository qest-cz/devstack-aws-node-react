import { spawn } from 'child_process'

interface Options {
    cwd?: string
    isPrintEnabled?: boolean
}

export const execAsync = (command: string, args: string[], options: Options) => {
    const { cwd = process.cwd(), isPrintEnabled = true } = options
    let output = ''
    return new Promise<string>((resolve, reject) => {
        const spawnedCommand = spawn(command, args, {
            ...process.env,
            cwd: cwd,
        })

        if (isPrintEnabled) {
            spawnedCommand.stdout.pipe(process.stdout)
            spawnedCommand.stderr.pipe(process.stderr)
        }
        process.stdin.pipe(spawnedCommand.stdin)

        spawnedCommand.stdout.on('data', (data) => {
            output += data.toString()
        })

        spawnedCommand.on('error', (err) => {
            console.error(err)
            reject(err)
            process.exit(1)
        })

        spawnedCommand.on('exit', (code) => {
            console.log('Child process exited with code ' + code?.toString())
            if (code !== 0) {
                process.exit(code || -1)
            }
            resolve(output)
        })
    })
}
