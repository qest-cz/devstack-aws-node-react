import fs from 'fs-extra'

export const copyToDest = async (fileLocation: string, destination: string) => {
    console.info(`Copying ${fileLocation} to ${destination}`)
    try {
        await fs.copy(fileLocation, destination, {
            overwrite: true,
            recursive: true,
            dereference: true,
        })
    } catch (e) {
        console.error(e)
        console.error(`Error copying file from: "${fileLocation}" to "${destination}"`)
        process.exit(1)
    }
    console.info(`Copying done`)
}
