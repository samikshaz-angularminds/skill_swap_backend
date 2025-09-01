import cloudinary from 'cloudinary';


// Upload Image Utility
export const uploadImageUtil = async (filePath) => {
    const response = await cloudinary.uploader.upload(filePath, {
        folder: "SkillSwap",
    });

    return {
        public_id: response.public_id,
        url: response.url,
    };
};


export const uploadImageMessage = async (filePath) => {
    console.log("filepath: ",filePath);
    
    const response = await cloudinary.uploader.upload(filePath, {
        folder: "SkillSwap-Message",
    });

    return {
        public_id: response.public_id,
        url: response.url,
    };
};