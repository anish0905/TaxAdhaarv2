import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (fileUri: string, fileName: string) => {
  try {
    const res = await cloudinary.uploader.upload(fileUri, {
      public_id: fileName,
      resource_type: "auto",
      folder: "tax_portal_docs",
    });
    return res;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
