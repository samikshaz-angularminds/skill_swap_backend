import {v2 as cloudinary} from 'cloudinary';


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

export const uploadAudioUtil = async (filePath) => {
    // console.log("filepath coming here");

    const response = await cloudinary.uploader.upload(filePath, {
        folder: "SkillSwap/Audios",
        resource_type: "video"
    });

    // console.log("cloudinary audio response--> ", response);

    return {
        public_id: response.public_id,
        url: response.url,
    };
};


export const uploadVideoUtil = async (filePath) => {
    const response = await cloudinary.uploader.upload(filePath, {
        folder: "SkillSwap/Videos",
        resource_type: "video"
    });

    // console.log("cloudinary video response--> ", response);

    return {
        public_id: response.public_id,
        url: response.url,
    };
};

export const uploadImageMessage = async (filePath) => {
    const response = await cloudinary.uploader.upload(filePath, {
        folder: "SkillSwap/Messages",

    });

    // console.log("upload image response--> ", response);

    return {
        public_id: response.public_id,
        url: response.url,
    };
};