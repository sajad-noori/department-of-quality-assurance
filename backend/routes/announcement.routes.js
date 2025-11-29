const express = require("express");
const router = express.Router();
const AnnouncementController = require("../controllers/announcement.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { upload } = require("../middleware/announcementUpload");

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new announcement
router.post(
  "/",
  upload.single("attachment"),
  AnnouncementController.createAnnouncement
);

// Get all announcements with pagination and filtering
router.get("/", AnnouncementController.getAnnouncements);

// Get all announcements (simple version without pagination)
router.get("/all", AnnouncementController.getAllAnnouncements);

// Get recipients by type
router.get("/recipients/list", AnnouncementController.getRecipients);

// Get announcement statistics
router.get("/stats/overview", AnnouncementController.getStats);

// Get available roles
router.get("/roles/available", AnnouncementController.getAvailableRoles);

// Get recipients count by role
router.get(
  "/recipients/count-by-role",
  AnnouncementController.getRecipientsCountByRole
);

// Get announcement by ID
router.get("/:id", AnnouncementController.getAnnouncementById);

// Update announcement
router.put(
  "/:id",
  upload.single("attachment"),
  AnnouncementController.updateAnnouncement
);

// Delete announcement
router.delete("/:id", AnnouncementController.deleteAnnouncement);

// Resend announcement emails
router.post("/:id/resend", AnnouncementController.resendEmails);

module.exports = router;
