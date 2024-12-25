import type { GenerateURL } from '@payloadcms/plugin-cloud-storage/types'
import type { CloudinaryStorageOptions } from './index'

import path from 'path'

interface Args {
  config: CloudinaryStorageOptions['config']
  folder: string
}

export const getGenerateURL =
  ({ config, folder }: Args): GenerateURL =>
  ({ filename, prefix = '' }) => {
    const filePath = path.posix.join(folder, prefix, filename)
    return `https://res.cloudinary.com/${config.cloud_name}/image/upload/${filePath}`
  }
