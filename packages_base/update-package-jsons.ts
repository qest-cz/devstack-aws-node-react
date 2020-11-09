import shared from './package.shared.json'
import fs from 'fs'
import deepMerge from 'deepmerge'

type Info = { location: string }

let workspacePackagesInfo: Info[] = []
try {
    workspacePackagesInfo = JSON.parse(process.argv[2]) as Info[]
} catch (err) {
    throw new Error(`Error while parsing the package descriptors json...`)
}

const alteredJsons = workspacePackagesInfo.map((packageInfo) => {
    const path = `${packageInfo.location}/package.json`
    const fileContents = JSON.parse(fs.readFileSync(path).toString())

    return {
        path,
        content: deepMerge(shared, fileContents),
    }
})

alteredJsons.forEach((alteredJson) => {
    console.log(`Updating: ${alteredJson.path}`)
    fs.writeFileSync(alteredJson.path, JSON.stringify(alteredJson.content))
})
