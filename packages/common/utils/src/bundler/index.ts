import fs from 'fs-extra'
import { execAsync } from './command-utils'
import { copyToDest } from './fs-utils'
import { getPackageJsonContents, getPackageName, writePackageJsonContents } from './package-utils'

interface BundlerOptions {
    bundledDependenciesLocation: string
    relativePathToWorkspaceRoot: string
}

export async function runBundler(packageWithDependenciesLocation: string, options: BundlerOptions) {
    return bundleLocalDependencies(
        packageWithDependenciesLocation,
        new Set<string>(),
        packageWithDependenciesLocation,
        options,
    )
}

async function bundleLocalDependencies(
    packageWithDependenciesLocation: string,
    alreadyProcessedPackagesByParent = new Set<string>(),
    packageToBundleTheDependenciesTo: string | null = null,
    options: BundlerOptions,
) {
    console.log()
    console.log(
        `${'='.repeat(
            10,
        )} Bundling dependencies for: "${packageWithDependenciesLocation}" ${'='.repeat(10)}`,
    )
    console.log()

    const alreadyProcessedPackages = protectFromRecursionLoops(
        packageWithDependenciesLocation,
        alreadyProcessedPackagesByParent,
    )

    const dependenciesToBundle = await getDependenciesToBundle(packageWithDependenciesLocation)
    const localPackages = await getLocalPackages()

    for (const dependencyToBundleName of dependenciesToBundle) {
        const dependencyToBundle = localPackages[dependencyToBundleName]

        const bundledDependenciesDestinationPackage =
            packageToBundleTheDependenciesTo || packageWithDependenciesLocation

        await bundleDependency(
            dependencyToBundle,
            dependencyToBundleName,
            packageWithDependenciesLocation,
            bundledDependenciesDestinationPackage,
            options,
        )

        await recursivelyBundleNestedPackages(
            dependencyToBundleName,
            alreadyProcessedPackages,
            bundledDependenciesDestinationPackage,
            options,
        )
    }

    console.log()
    console.log(
        `${'='.repeat(
            10,
        )} All dependencies for: "${packageWithDependenciesLocation}" have been bundled ${'='.repeat(
            10,
        )}`,
    )
    console.log()
}

function protectFromRecursionLoops(
    packageWithDependenciesLocation: string,
    alreadyProcessedPackagesByParent: Set<string>,
) {
    const packageName = getPackageName(packageWithDependenciesLocation)
    const alreadyProcessedPackages = alreadyProcessedPackagesByParent
    if (alreadyProcessedPackages.has(packageName)) {
        throw new Error(
            `A loop or redundancy was found when bundling dependencies. Make sure that no dependency is listed twice or recursively. The loop or redundancy has occurred at dependency: "${packageName}".`,
        )
    }
    alreadyProcessedPackages.add(packageName)
    return alreadyProcessedPackages
}

async function getDependenciesToBundle(packageWithDependenciesLocation: string) {
    const packageJsonContents = getPackageJsonContents(packageWithDependenciesLocation)

    const bundledDependencies = packageJsonContents.bundledDependencies
    if (!bundledDependencies) {
        const message = `There were no bundledDependencies found in the package.json file in: "${packageWithDependenciesLocation}"`
        console.error(`-`.repeat(message.length))
        console.error(message)
        console.error()
        console.error('Continuing without bundling any dependencies')
        console.error(`-`.repeat(message.length))
    }

    return bundledDependencies || []
}

async function getLocalPackages() {
    const workspaceInfo = await execAsync('yarn', ['workspaces', 'info', '--json'], {
        isPrintEnabled: false,
    })
    try {
        return JSON.parse(workspaceInfo)
    } catch (e) {
        console.error(e)
        console.error(
            'Could not parse yarn workspace info output. This means that yarn has probably changed its CLI output format.',
        )
        process.exit(1)
    }
}

async function recursivelyBundleNestedPackages(
    dependencyName: string,
    alreadyProcessedPackages: Set<string>,
    bundledDependenciesDestinationPackage: string,
    options: BundlerOptions,
) {
    const bundledDependencyLocation = getDependencyDestination(
        dependencyName,
        bundledDependenciesDestinationPackage,
        options,
    )
    return bundleLocalDependencies(
        bundledDependencyLocation,
        alreadyProcessedPackages,
        bundledDependenciesDestinationPackage,
        options,
    )
}

async function bundleDependency(
    dependencyToBundle: {
        location: string
    },
    dependencyName: string,
    packageWithDependencyLocation: string,
    packageToBundleTheDependenciesTo: string,
    options: BundlerOptions,
) {
    if (!dependencyToBundle) {
        console.error(
            `Dependency: "${dependencyName}" was not found in the local packages. Be sure to depend only on packages available in the workspace.`,
        )
        process.exit(1)
    }

    const message = `Bundling dependency: "${dependencyName}" for the package: "${packageWithDependencyLocation}"`
    console.log(`-`.repeat(message.length))
    console.log(message)
    console.log(`-`.repeat(message.length))

    const location = `${options.relativePathToWorkspaceRoot}/${dependencyToBundle.location}`
    const dependencyDestination = getDependencyDestination(
        dependencyName,
        packageToBundleTheDependenciesTo,
        options,
    )

    fs.removeSync(dependencyDestination)
    await copyToDest(location, dependencyDestination)
    removeNodeModulesFromDependency(dependencyDestination)
    rewritePackageDependencyToLocal(packageWithDependencyLocation, dependencyName, options)
    return dependencyDestination
}

function removeNodeModulesFromDependency(dependencyDestination: string) {
    const nodeModulesLocation = `${dependencyDestination}/node_modules`
    console.log(`Removing node modules: ${nodeModulesLocation}`)
    fs.removeSync(nodeModulesLocation)
}

function rewritePackageDependencyToLocal(
    packageLocation: string,
    dependencyName: string,
    options: BundlerOptions,
) {
    const packageJsonContents = getPackageJsonContents(packageLocation)
    if (
        !packageJsonContents.dependencies ||
        !(dependencyName in packageJsonContents.dependencies)
    ) {
        console.error(
            `The dependency: "${dependencyName}" is not in the "dependencies" entry in the package.json file of the application: "${packageLocation}"`,
        )
        process.exit(1)
    }
    packageJsonContents.dependencies[
        dependencyName
    ] = `./${options.bundledDependenciesLocation}/${dependencyName}`
    writePackageJsonContents(packageLocation, packageJsonContents)
}

function getDependencyDestination(
    dependencyName: string,
    destinationPackage: string,
    options: BundlerOptions,
) {
    const bundledModulesDestination = `${destinationPackage}/${options.bundledDependenciesLocation}`
    const dependencyDestination = `${bundledModulesDestination}/${dependencyName}`
    return dependencyDestination
}
