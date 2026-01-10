import fs from "fs";
import cloudinary from "../config/cloudinary.js";

export const uploadOnCloudinary = async (localFilePath: string) => {
    if (!localFilePath) return null;

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        return response; // contains secure_url, public_id, etc.
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return null;
    } finally {
        // always delete local file
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    }
};
