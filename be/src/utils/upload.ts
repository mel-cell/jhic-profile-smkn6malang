import { promises as fs } from 'fs'
import path from 'path'

export interface UploadResult {
  fileName: string
  filePath: string
  fileSize: number
}

export async function saveFile(file: File, uploadDir: string = 'uploads'): Promise<UploadResult> {
  // Create upload directory if it doesn't exist
  const uploadPath = path.join(process.cwd(), uploadDir)
  await fs.mkdir(uploadPath, { recursive: true })

  // Generate unique filename
  const timestamp = Date.now()
  const originalName = file.name
  const extension = path.extname(originalName)
  const baseName = path.basename(originalName, extension)
  // Sanitize baseName: remove non-alphanumeric, spaces to hyphens, lowercase
  const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()
  const fileName = `${timestamp}-${sanitizedBaseName}${extension}`
  const filePath = path.join(uploadPath, fileName)

  // Convert File to Buffer and save
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  await fs.writeFile(filePath, buffer)

  return {
    fileName,
    filePath: path.join(uploadDir, fileName),
    fileSize: buffer.length
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    await fs.unlink(fullPath)
  } catch (error) {
    // File might not exist, ignore error
    console.warn(`Failed to delete file ${filePath}:`, error)
  }
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  const fileType = file.type.toLowerCase()
  return allowedTypes.some(type => fileType.includes(type))
}

export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}
