# Payload CMS Cloudinary Plugin

A plugin for [Payload CMS](https://payloadcms.com/) that integrates Cloudinary as a storage adapter for media files. This plugin allows you to seamlessly store and manage your media files on Cloudinary while using Payload CMS.

## Features

- 🚀 Seamless integration with Payload CMS
- 📦 Automatic file upload to Cloudinary
- 🗑️ Automatic file deletion from Cloudinary
- 🔗 URL generation for stored files
- 📁 Customizable folder structure
- 🎛️ Static file handling
- 💾 Optional local storage disable

## Installation

```bash
bun install
```

## Configuration

Here's how to use the plugin in your Payload CMS configuration:

```typescript
import { cloudinaryStorage } from 'payload-cloudinary'

const config = buildConfig({
  // ... your payload config
  plugins: [
    cloudinaryStorage({
      config: {
        cloud_name: 'your-cloud-name',
        api_key: 'your-api-key',
        api_secret: 'your-api-secret'
      },
      collections: {
        'media': true, // Enable for media collection
        // Add more collections as needed
      },
      folder: 'your-folder-name', // Optional, defaults to 'payload-media'
      disableLocalStorage: true, // Optional, defaults to true
      enabled: true // Optional, defaults to true
    })
  ]
})
```

## Options

- `config`: Your Cloudinary configuration credentials
  - `cloud_name`: Your Cloudinary cloud name
  - `api_key`: Your Cloudinary API key
  - `api_secret`: Your Cloudinary API secret
- `collections`: Specify which collections should use Cloudinary storage
- `folder`: The folder path in Cloudinary where files will be uploaded (default: 'payload-media')
- `disableLocalStorage`: Whether to disable local storage (default: true)
- `enabled`: Whether to enable the plugin (default: true)

## Development

To run the project in development mode:

```bash
bun run src/index.ts
```

## Requirements

This project uses [Bun](https://bun.sh) as its JavaScript runtime. Make sure you have Bun installed (v1.1.38 or later).

## License

This project is open-source. See the LICENSE file for more details.
