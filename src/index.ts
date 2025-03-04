import type {
  Adapter,
  PluginOptions as CloudStoragePluginOptions,
  CollectionOptions,
  GeneratedAdapter,
} from '@payloadcms/plugin-cloud-storage/types'
import type { Config, Plugin, UploadCollectionSlug } from 'payload'

import { v2 as cloudinary } from 'cloudinary'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'

import { getGenerateURL } from './generateURL'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { getHandler } from './staticHandler'

export type CloudinaryStorageOptions = {
  /**
   * Collection options to apply the Cloudinary adapter to.
   */
  collections: Partial<Record<UploadCollectionSlug, Omit<CollectionOptions, 'adapter'> | true>>

  /**
   * Cloudinary configuration
   */
  config: {
    cloud_name: string
    api_key: string
    api_secret: string
  }

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

type CloudinaryStoragePlugin = (cloudinaryArgs: CloudinaryStorageOptions) => Plugin

export const cloudinaryStorage: CloudinaryStoragePlugin =
  (cloudinaryOptions: CloudinaryStorageOptions) =>
  (incomingConfig: Config): Config => {
    if (cloudinaryOptions.enabled === false) {
      return incomingConfig
    }

    const adapter = cloudinaryStorageInternal(cloudinaryOptions)

    // Add adapter to each collection option object
    const collectionsWithAdapter: CloudStoragePluginOptions['collections'] = Object.entries(
      cloudinaryOptions.collections,
    ).reduce(
      (acc, [slug, collOptions]) => ({
        ...acc,
        [slug]: {
          ...(collOptions === true ? {} : collOptions),
          adapter,
        },
      }),
      {} as Record<string, CollectionOptions>,
    )

    // Set disableLocalStorage: true for collections specified in the plugin options
    const config = {
      ...incomingConfig,
      collections: (incomingConfig.collections || []).map((collection) => {
        if (!collectionsWithAdapter[collection.slug as keyof typeof collectionsWithAdapter]) {
          return collection
        }

        return {
          ...collection,
          upload: {
            ...(typeof collection.upload === 'object' ? collection.upload : {}),
            disableLocalStorage: true,
          },
        }
      }),
    }

    return cloudStoragePlugin({
      collections: collectionsWithAdapter,
    })(config)
  }

function cloudinaryStorageInternal({
  config,
  folder = 'payload-media',
}: CloudinaryStorageOptions): Adapter {
  return ({ collection, prefix }): GeneratedAdapter => {
    // Configure cloudinary
    cloudinary.config({
      cloud_name: config.cloud_name,
      api_key: config.api_key,
      api_secret: config.api_secret,
    })

    return {
      name: 'cloudinary',
      generateURL: getGenerateURL({ config, folder }),
      handleDelete: getHandleDelete({ cloudinary, folder }),
      handleUpload: getHandleUpload({
        cloudinary,
        collection,
        folder,
        prefix,
      }),
      staticHandler: getHandler({ cloudinary, collection, folder }),   
    }
  }
}
