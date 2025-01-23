import type { StaticHandler } from "@payloadcms/plugin-cloud-storage/types";
import type { CollectionConfig } from "payload";
import type { v2 as cloudinaryType } from "cloudinary";

import { getFilePrefix } from "@payloadcms/plugin-cloud-storage/utilities";
import path from "path";
import { getResourceType } from "./utils";

interface Args {
  cloudinary: typeof cloudinaryType;
  collection: CollectionConfig;
  folder: string;
}

export const getHandler =
  ({ cloudinary, collection, folder }: Args): StaticHandler =>
  async (req, { params: { filename } }) => {
    try {
      const prefix = await getFilePrefix({ collection, filename, req });
      const filePath = path.posix.join(folder, prefix, filename);

      // Determine resource type based on file extension
      const fileExt = path.extname(filename).toLowerCase();
      const resourceType = getResourceType(fileExt);

      const result = await cloudinary.api.resource(
        filePath.replace(/\.[^/.]+$/, ""),
        {
          resource_type: resourceType,
        }
      );

      if (!result || !result.secure_url) {
        return new Response(null, { status: 404, statusText: "Not Found" });
      }

      const response = await fetch(result.secure_url);

      if (!response.ok) {
        return new Response(null, { status: 404, statusText: "Not Found" });
      }

      const blob = await response.blob();

      const etagFromHeaders =
        req.headers.get("etag") || req.headers.get("if-none-match");
      const objectEtag = req.headers.get("etag") as string;

      if (etagFromHeaders && etagFromHeaders === objectEtag) {
        return new Response(null, {
          headers: new Headers({
            "Content-Type": blob.type,
            "Content-Length": String(blob.size),
            ETag: objectEtag,
          }),
          status: 304,
        });
      }

      // Redirect to Cloudinary URL
      return new Response(blob, {
        headers: new Headers({
          "Content-Type": blob.type,
          "Content-Length": String(blob.size),
          ETag: objectEtag,
        }),
        status: 200,
      });
      
    } catch (error) {
      req.payload.logger.error({ error, message: "Error in statichandler" });
      return new Response("Internal Server Error", { status: 500 });
    }
  };
