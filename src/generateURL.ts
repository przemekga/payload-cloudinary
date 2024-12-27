import type { GenerateURL } from '@payloadcms/plugin-cloud-storage/types'
import type { CloudinaryStorageOptions } from './index'

import path from 'path'

interface Args {
  config: CloudinaryStorageOptions['config']
  folder: string
}

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.m4v']
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff']
const RAW_EXTENSIONS = [
  // Documents
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt',
  // Archives
  '.zip', '.rar', '.7z', '.tar', '.gz',
  // Other
  '.csv', '.json', '.xml', '.md'
]

const getResourceType = (ext: string): string => {
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video'
  if (IMAGE_EXTENSIONS.includes(ext)) return 'image'
  if (RAW_EXTENSIONS.includes(ext)) return 'raw'
  return 'auto' // Default to auto for unknown types
}

export const getGenerateURL =
  ({ config, folder }: Args): GenerateURL =>
  ({ filename, prefix = '' }) => {
    const filePath = path.posix.join(folder, prefix, filename)
    const ext = path.extname(filename).toLowerCase()
    const resourceType = getResourceType(ext)
    if (resourceType === 'video') {
      return `https://res.cloudinary.com/${config.cloud_name}/video/upload/f_auto:video,q_auto/v1/payload-media/${filePath}`
    } else if (resourceType === 'image') {
      return `https://res.cloudinary.com/${config.cloud_name}/image/upload/f_auto,q_auto/v1/${filePath}`
    } else {
      return `https://res.cloudinary.com/${config.cloud_name}/raw/upload/v1/${filePath}`
    }
  }