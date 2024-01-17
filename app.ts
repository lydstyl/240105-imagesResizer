import readline from 'readline'
import { listImageFilesInFolder, createSubfolder, resizeImage } from './utils'

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
