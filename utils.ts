import path from 'path'
import fs from 'fs/promises'
import sharp from 'sharp'

const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'] // Add more if needed

export async function listImageFilesInFolder(
  folderPath: string
): Promise<string[]> {
  try {
    const files = await fs.readdir(folderPath)
    const imageFiles: string[] = []

    for (const file of files) {
      const filePath = path.join(folderPath, file)
      const stats = await fs.stat(filePath)

      if (stats.isFile()) {
        const ext = path.extname(file).toLowerCase()
        if (imageExtensions.includes(ext)) {
          imageFiles.push(file)
        }
      }
    }

    return imageFiles
  } catch (error) {
    console.error('Error reading folder:', error)
    return []
  }
}

async function folderExists(folderPath: string): Promise<boolean> {
  try {
    await fs.access(folderPath)
    return true
  } catch (error) {
    return false
  }
}

export async function createSubfolder(
  folderPath: string,
  subfolderName: string
): Promise<void> {
  try {
    const subfolderPath = path.join(folderPath, subfolderName)

    if (await folderExists(subfolderPath)) {
      return
    }

    await fs.mkdir(subfolderPath)
    console.log(
      `Subfolder '${subfolderName}' created successfully in '${folderPath}'.`
    )
  } catch (error) {
    console.error('Error creating subfolder:', error)
  }
}

export const resizeImage = async (
  image: string,
  width: number,
  subFolder: string
) => {
  sharp(image)
    .resize({ width })
    .toFile(subFolder, function (err) {
      if (err) {
        console.log('🚀 ~ file: app.ts:7 ~ err:', err)
      } else {
        console.log(`Image ${subFolder} created.`)
      }
    })
}
