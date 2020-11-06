import fs from 'fs-extra'

interface PackageJsonContents {
    name: string
    version: string
    scripts: Record<string, string>
    dependencies: Record<string, string>
    devDependencies: Record<string, string>
    bundledDependencies: string[]
}

export function getPackageName(packageLocation: string) {
    const packageJsonContents = getPackageJsonContents(packageLocation)
    const packageName = packageJsonContents.name
    if (!packageName) {
        throw new Error(
            `Error reading package.json for: "${packageLocation}". The name of the package is invalid.`,
        )
    }
    return packageName
}

export function getPackageJsonContents(packageLocation: string): PackageJsonContents {
    const packageJsonLocation = getPackageJsonLocation(packageLocation)
    let packageJsonContents = {}
    try {
        packageJsonContents = fs.readJsonSync(packageJsonLocation)
    } catch (e) {
        console.error(e)
        console.error(
            `The package.json file was not found in the package directory: "${packageLocation}"`,
        )
        process.exit(1)
    }
    return packageJsonContents as PackageJsonContents
}

export function writePackageJsonContents(packageLocation: string, contents: PackageJsonContents) {
    const packageJsonLocation = getPackageJsonLocation(packageLocation)
    try {
        fs.writeJsonSync(packageJsonLocation, contents)
    } catch (e) {
        console.error(e)
        console.error(`Could not write to package.json file in: "${packageLocation}"`)
        process.exit(1)
    }
}

export function getPackageJsonLocation(packageLocation: string) {
    return `${packageLocation}/package.json`
}
