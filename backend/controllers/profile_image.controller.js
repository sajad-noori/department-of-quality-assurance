const ProfileImage = require("../models/profile_image.model");
const fs = require("fs").promises;
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "../uploads/profile");

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};

// Generate unique filename for profile image
const generateUniqueFilename = (originalFilename) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalFilename);
  return `profile_${timestamp}_${randomString}${ext}`;
};

// Validate image file
const validateImageFile = (file) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
    );
  }

  if (file.size > maxSize) {
    throw new Error("File size too large. Maximum size is 5MB.");
  }

  return true;
};

/**
 * Upload profile image
 * @route POST /api/upload-profile-image
 */
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    // Validate the uploaded file
    try {
      validateImageFile(req.file);
    } catch (error) {
      // Delete the uploaded file if validation fails
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Failed to delete invalid file:", unlinkError);
      }
      return res.status(400).json({
        success: false,
        message: "Invalid image upload",
      });
    }

    await ensureUploadDir();

    const userId = req.user.id;
    const uniqueFilename = generateUniqueFilename(req.file.originalname);
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    // Move the uploaded file to the profile directory
    await fs.rename(req.file.path, filePath);

    // Get the relative path for database storage
    const relativePath = path.relative(path.join(__dirname, ".."), filePath);

    // Check if user already has a profile image and delete the old one
    const existingImage = await ProfileImage.findByUserId(userId);
    if (existingImage) {
      try {
        const oldFilePath = path.join(__dirname, "..", existingImage.file_path);
        await fs.unlink(oldFilePath);
        console.log("Deleted old profile image:", oldFilePath);
      } catch (error) {
        console.error("Failed to delete old profile image:", error);
      }
    }

    // Save image data to database
    const imageData = {
      file_name: uniqueFilename,
      original_name: req.file.originalname,
      file_path: relativePath.replace(/\\/g, "/"),
      file_type: req.file.mimetype,
      file_size: req.file.size,
    };

    const profileImage = await ProfileImage.upsert(userId, imageData);

    // Return the image URL
    const imageUrl = `/uploads/profile/${uniqueFilename}`;

    res.json({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl: imageUrl,
      data: profileImage,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading profile image",
    });
  }
};

/**
 * Get user's profile image
 * @route GET /api/profile-image
 */
exports.getProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileImage = await ProfileImage.findByUserId(userId);

    if (!profileImage) {
      return res.status(404).json({
        success: false,
        message: "No profile image found",
      });
    }

    const imageUrl = `/uploads/profile/${profileImage.file_name}`;

    res.json({
      success: true,
      imageUrl: imageUrl,
      data: profileImage,
    });
  } catch (error) {
    console.error("Error fetching profile image:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile image",
    });
  }
};

/**
 * Delete user's profile image
 * @route DELETE /api/profile-image
 */
exports.deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileImage = await ProfileImage.findByUserId(userId);

    if (!profileImage) {
      return res.status(404).json({
        success: false,
        message: "No profile image found",
      });
    }

    // Delete the file from filesystem
    try {
      const filePath = path.join(__dirname, "..", profileImage.file_path);
      await fs.unlink(filePath);
      console.log("Deleted profile image file:", filePath);
    } catch (error) {
      console.error("Failed to delete profile image file:", error);
    }

    // Delete the database record
    await ProfileImage.deleteByUserId(userId);

    res.json({
      success: true,
      message: "Profile image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting profile image:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting profile image",
    });
  }
};
