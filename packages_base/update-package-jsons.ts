import shared from './package.shared.json'
import fs from 'fs'

type Info = { location: string }

let packageJsons: Info[] = []
try {
    packageJsons = JSON.parse(process.argv[2]) as Info[]
} catch (err) {
    throw new Error(`Error while parsing the package descriptors json...`)
}

const alteredJsons = packageJsons.map((packageJson) => {
    const path = `${packageJson.location}/package.json`
    const fileContents = JSON.parse(fs.readFileSync(path).toString())

    return {
        path,
        content: {
            ...shared,
            ...fileContents,
            scripts: {
                ...shared.scripts,
                ...(fileContents.scripts || {}),
            },
        },
    }
})

alteredJsons.forEach((alteredJson) => {
    console.log(`Updating: ${alteredJson.path}`)
    fs.writeFileSync(alteredJson.path, JSON.stringify(alteredJson.content))
})
