import type { StaticHandler } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'
import type { v2 as cloudinaryType } from 'cloudinary'

import { getFilePrefix } from '@payloadcms/plugin-cloud-storage/utilities'
import path from 'path'

interface Args {
  cloudinary: typeof cloudinaryType
  collection: CollectionConfig
  folder: string
}

export const getHandler =
  ({ cloudinary, collection, folder }: Args): StaticHandler =>
  async (req, { params: { filename } }) => {
    try {
      const prefix = await getFilePrefix({ collection, filename, req })
      const filePath = path.posix.join(folder, prefix, filename)

      // Get the resource details from Cloudinary
      const result = await cloudinary.api.resource(filePath.replace(/\.[^/.]+$/, ''))

      if (!result || !result.secure_url) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }

      // Redirect to Cloudinary URL
      return new Response(null, {
        status: 302,
        headers: {
          Location: result.secure_url,
        },
      })
    } catch (error) {
      console.error('Error serving file from Cloudinary:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }
