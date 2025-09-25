import User from '../models/user.model.js';
import cloudinary from 'cloudinary';
import { uploadImageUtil } from '../utils/uploadFileUtil.js';
import ApiError from '../errors/ApiError.js';

const cloudinaryV2 = cloudinary.v2;

/**
 * Handles user signup logic.
 *
 * @param {Object} userDetails - User details including email, password, name, etc.
 * @returns {Object} The newly created user object.
 * @throws {Error} If a user with the provided email already exists.
 */
// const { name, username, bio, location, email, password } = req.body;

/**
 * Retrieves a user by their ID.
 *
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Object|null} The user object if found, or null if not found.
 */
const getUserService = async (userId) => {
  const user = await User.findById(userId);

  // console.log("user found successfully which is: ",user);

  return user;
};

const updateUserService = async ({ userId, userData }) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      ...userData
    },
    { new: true }
  );

  return updatedUser;
}

const deleteUser = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);

  console.log("deleted user- ", deleteUser);

}

const getAllUsersService = async (userId) => {
  // console.log("logged in user id: ",userId);

  const users = await User.find({ _id: { $ne: userId } }).select("-_id -password -__v");
  // console.log("all users are==> ", users);

  return users;
}

/**
 * Deletes a user by their ID.
 *
 * @param {string} userId - The ID of the user to delete.
 * @returns {Object|null} The deleted user object if found and deleted, or null if not found.
 */
const deleteUserService = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (user && user.avatar?.public_id) {
    try {
      await deleteImage(user.avatar.public_id);
    } catch (error) {
      console.error(`Failed to delete avatar for user ${userId}:`, error);
      // Optionally re-throw or handle the error differently
    }
  }

  return user;
};

/**
 * Uploads an image using the Cloudinary configuration.
 *
 * @param {string} filePath - The path to the image file.
 * @returns {Promise<Object>} An object containing the public_id and url of the uploaded image.
 */
const updateProfileImageService = async (filePath) => {
  return uploadImageUtil(filePath);
};

const getOneUserService = async (userId) => {
  const user = await User.findOne({ uid: userId }).select("-password  -__v -_id");

  return user;
}


const updateAvailabilityService = async ({ userId, availabilityData }) => {

  const availabilityArray = availabilityData.availability;

  const user = await User.findById(userId);

  availabilityArray.map(async (avObj) => {

    const existingDayIndex = user.availability.findIndex((a) => a.dayOfWeek === avObj.dayOfWeek);

    if (existingDayIndex !== -1) {
      console.log("if -1 here -> ");

      const existingDay = user.availability[existingDayIndex];

      for (const newSlot of avObj.timeSlots) {
        const duplicate = existingDay.timeSlots.some(
          (slot) => newSlot.startTime < slot.endTime && newSlot.endTime > slot.startTime
        )

        if (duplicate) {
          throw new ApiError(httpStatus.CONFLICT,`Time slot ${newSlot.startTime} - ${newSlot.endTime} already exists for ${avObj.dayOfWeek}`)
        }

        existingDay.timeSlots.push({ ...newSlot })
      }
      await user.save();
    }
    else {
      // updatedAvailabilityOfUser = await User.updateSearchIndex()
      console.log("else there");
      user.availability.push(avObj);
      user.save();
    }

  })

  console.log("new user availability: ", user.availability);

  return user;

};





export default {
  getUserService,
  updateUserService,
  deleteUserService,
  updateProfileImageService,
  getAllUsersService,
  getOneUserService,
  updateAvailabilityService,

}
