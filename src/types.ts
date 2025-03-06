import type { Adapter, CollectionOptions } from '@payloadcms/plugin-cloud-storage/types'
import type { Plugin, UploadCollectionSlug } from 'payload'

export type CloudinaryConfig = {
  cloud_name: string
  api_key: string
  api_secret: string
}

export type CloudinaryStorageOptions = {
  /**
   * Collection options to apply the Cloudinary adapter to.
   */
  collections: Partial<Record<UploadCollectionSlug, Omit<CollectionOptions, 'adapter'> | true>>

  /**
   * Cloudinary configuration
   */
  config: CloudinaryConfig

  /**
   * Folder path in Cloudinary where files will be uploaded
   * @default 'payload-media'
   */
  folder?: string

  /**
   * Whether or not to disable local storage
   * @default true
   */
  disableLocalStorage?: boolean

  /**
   * Whether or not to enable the plugin
   * @default true
   */
  enabled?: boolean
}

export type CloudinaryStoragePlugin = (cloudinaryArgs: CloudinaryStorageOptions) => Plugin

export type CloudinaryMetadata = {
  public_id: string
  resource_type: string
  format: string
  secure_url: string
  bytes: number
  created_at: string
  duration?: number
  width?: number
  height?: number
  eager?: any[]
}

export type CloudinaryAdapter = Adapter