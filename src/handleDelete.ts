import type { HandleDelete } from '@payloadcms/plugin-cloud-storage/types'
import type { v2 as cloudinaryType } from 'cloudinary'

import path from 'path'

interface Args {
  cloudinary: typeof cloudinaryType
  folder: string
}

export const getHandleDelete =
  ({ cloudinary, folder }: Args): HandleDelete =>
  async ({ filename }) => {
    const filePath = path.posix.join(folder, filename)

    try {
      // Extract public_id without file extension
      const publicId = filePath.replace(/\.[^/.]+$/, '')
      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error)
      throw error
    }
  }
