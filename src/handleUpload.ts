import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'
import type { v2 as cloudinaryType } from 'cloudinary'

import path from 'path'
import stream from 'stream'

interface Args {
  cloudinary: typeof cloudinaryType
  collection: CollectionConfig
  folder: string
  prefix?: string
}

export const getHandleUpload =
  ({ cloudinary, folder, prefix = '' }: Args): HandleUpload =>
  async ({ data, file }) => {
    const filePath = path.posix.join(folder, data.prefix || prefix, file.filename)

    try {
      // Create upload stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: filePath.replace(/\.[^/.]+$/, ''), // Remove file extension
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error)
            throw error
          }
        },
      )

      // Create readable stream from buffer or file
      const readableStream = new stream.Readable()
      readableStream.push(file.buffer)
      readableStream.push(null)

      // Pipe the readable stream to the upload stream
      readableStream.pipe(uploadStream)

      return data
    } catch (error) {
      console.error('Error in upload process:', error)
      throw error
    }
  }
