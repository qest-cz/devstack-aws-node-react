import { runBundler } from '../src/bundler/index'

const packageLocation = process.argv[2]

if (!packageLocation) {
    throw new Error(`The first positional argument has to be the package location`)
}

runBundler(packageLocation, {
    bundledDependenciesLocation: '__bundled__',
    relativePathToWorkspaceRoot: '../../..',
})
