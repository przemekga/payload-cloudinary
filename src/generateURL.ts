import type { GenerateURL } from "@payloadcms/plugin-cloud-storage/types";
import type { CloudinaryStorageOptions } from "./index";

import path from "path";
import { IMAGE_EXTENSIONS, RAW_EXTENSIONS, VIDEO_EXTENSIONS } from "./constants";

interface Args {
  config: CloudinaryStorageOptions["config"];
  folder: string;
}

const getResourceType = (ext: string): string => {
  if (VIDEO_EXTENSIONS.includes(ext)) return "video";
  if (IMAGE_EXTENSIONS.includes(ext)) return "image";
  if (RAW_EXTENSIONS.includes(ext)) return "raw";
  return "auto"; // Default to auto for unknown types
};

export const getGenerateURL =
  ({ config, folder }: Args): GenerateURL =>
  ({ filename, prefix = "" }) => {
    // Construct the folder path with proper handling of prefix
    const folderPath = prefix ? path.posix.join(folder, prefix) : folder;
    const filePath = path.posix.join(folderPath, filename);
    const ext = path.extname(filename).toLowerCase();
    const resourceType = getResourceType(ext);
    const baseUrl = `https://res.cloudinary.com/${config.cloud_name}`;

    switch (resourceType) {
      case "video":
        return `${baseUrl}/video/upload/f_auto,q_auto/${filePath}`;
      case "image":
        return `${baseUrl}/image/upload/f_auto,q_auto/${filePath}`;
      case "raw":
        return `${baseUrl}/raw/upload/${filePath}`;
      default:
        return `${baseUrl}/auto/upload/${filePath}`;
    }
  };


