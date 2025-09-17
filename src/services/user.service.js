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

  // const availabilityData = {...requestBody,start}
  // console.log("availability data: ", availabilityData);



  const updateAvailability = await User.findByIdAndUpdate(userId, [
    {
      $set: {
        availability: {
          $cond: [
            {
              $in: [availabilityData.dayOfWeek, "$availability.dayOfWeek"]
            },
            {
              $map: {
                input: "$availability",
                as: "day",
                in: {
                  $cond: [
                    { $eq: ["$$day.dayOfWeek", availabilityData.dayOfWeek] },
                    {
                      dayOfWeek: "$$day.dayOfWeek",
                      timeSlots: {
                        $concatArrays: [
                          "$$day.timeSlots", {
                            $filter: {
                              input: availabilityData.timeSlots,
                              as: "newSlot",
                              cond: {
                                $not: {
                                  $anyElementTrue: {
                                    $map: {
                                      input: "$$day.timeSlots",
                                      as: "existingSlot",
                                      in: {
                                        $and: [
                                          { $eq: ["$$existingSlot.startTime", "$$newSlot.startTime"] },
                                          { $eq: ["$$existingSlot.endTime", "$$newSlot.endTime"] }
                                        ]
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        ]
                      }
                    },
                    "$$day"
                  ]
                }
              }
            },
            {
              $concatArrays: [
                "$availability",
                [
                  {
                    dayOfWeek: availabilityData.dayOfWeek,
                    // timeSlots:availabilityData.timeSlots
                    timeSlots: {
                      $sortArray: {
                        input: availabilityData.timeSlots,
                        sortBy: { startMinutes: 1 }
                      }
                    }
                  }

                ]
              ]

            }
          ]
        }
      }
    }
  ], { new: true });

  await updateAvailability.save();

  return updateAvailability;

}

export default {
  getUserService,
  updateUserService,
  deleteUserService,
  updateProfileImageService,
  getAllUsersService,
  getOneUserService,
  updateAvailabilityService
}
