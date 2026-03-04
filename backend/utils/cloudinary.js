const cloudinary = require('cloudinary');
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImageOnCloud = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" })
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove  the local copy of the image after uploading to clodinary
        return null
    }
}

module.exports = uploadImageOnCloud
