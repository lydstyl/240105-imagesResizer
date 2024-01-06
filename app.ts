import readline from 'readline'
import path from 'path'
import fs from 'fs/promises'
import sharp from 'sharp'

const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'] // Add more if needed

async function listImageFilesInFolder(folderPath: string): Promise<string[]> {
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

async function createSubfolder(
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

const resizeImage = async (image: string, width: number, subFolder: string) => {
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function askQuestions(cb: (folder: string, width: number) => Promise<void>) {
  rl.question(
    'Entrez le chemin du dossier, exemple : /my/image/folder : ',
    (folderPath) => {
      rl.question(
        'Quelle largeur souhaitez-vous, exemple : 1280 ? ',
        (width) => {
          console.log(`Vous avez choisi le dossier : ${folderPath}`)
          console.log(`Vous avez choisi une largeur de ${width}`)

          rl.question('Confirmez-vous (oui/non) ? ', (confirmation) => {
            if (confirmation.toLowerCase() === 'oui') {
              cb(folderPath, +width)

              rl.question('Un autre folder (oui/non) ? ', (confirmation) => {
                if (confirmation.toLowerCase() === 'non') {
                  rl.close()
                } else if (confirmation.toLowerCase() === 'oui') {
                  console.log('Recommencez...')
                  askQuestions(cb)
                } else {
                  rl.close()
                }
              })
            } else if (confirmation.toLowerCase() === 'non') {
              console.log('Recommencez...')
              askQuestions(cb)
            } else {
              console.log('Réponse invalide. Recommencez.')
              askQuestions(cb)
            }
          })
        }
      )
    }
  )
}

const launchApp = async (folder: string, width: number) => {
  const subFolder = width + 'pxResized'
  const images = await listImageFilesInFolder(folder)
  createSubfolder(folder, subFolder)
  images.forEach(async (image) => {
    const imagePath = `${folder}/${image}`
    await resizeImage(
      imagePath,
      width,
      `${folder}/${subFolder}/${width}px-${image}`
    )
  })
}

askQuestions(launchApp)
