const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const { protect } = require("../middleware/auth.middleware");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @route   POST /api/upload/image
 * @desc    Upload an image to Cloudinary
 * @access  Private
 */
router.post(
  "/image",
  protect,
  upload("nexus_tech/uploads").single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "Please upload an image file");
    }

    return res.status(200).json(
      new ApiResponse(
        200, 
        { 
          imageUrl: req.file.path, // This is the Cloudinary secure URL
          publicId: req.file.filename 
        }, 
        "Image uploaded successfully"
      )
    );
  })
);

module.exports = router;
