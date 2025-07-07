import fs from 'fs/promises'
import path from 'path'
import config from '../config'

export const saveAudioFile = async (id: string, filename: string, buffer: Buffer) => {
  const ext = path.extname(filename)
  const outputName = `${id}${ext}`
  const outputPath = path.join(config.storage.uploadsDir, outputName)

  await fs.mkdir(config.storage.uploadsDir, { recursive: true })
  await fs.writeFile(outputPath, buffer)

  return outputName
}
