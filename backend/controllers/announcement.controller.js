const Announcement = require('../models/announcement.model');
const { sendEmail, sendAnnouncementEmail } = require('../utils/emailService');
const path = require('path');
const fs = require('fs');

class AnnouncementController {
  // Create a new announcement
  static async createAnnouncement(req, res) {
    try {
      const { title, content, target_audience, recipients } = req.body;
      const created_by = req.user.id;

      // Validate required fields
      if (!title || !content || !target_audience) {
        return res.status(400).json({
          success: false,
          message: 'Title, content, and target audience are required'
        });
      }

      // Handle file upload if present
      let attachment_path = null;
      if (req.file) {
        attachment_path = req.file.path;
      }

      // Create announcement
      const announcementId = await Announcement.create({
        title,
        content,
        target_audience,
        created_by,
        attachment_path
      });

      // Get recipients based on target audience
      const recipientsList = await Announcement.getRecipientsByType(target_audience);

      // Send emails to recipients
      if (recipientsList.length > 0) {
        const emailPromises = recipientsList.map(recipient => {
          return sendAnnouncementEmail(recipient, { title, content }, attachment_path);
        });

        try {
          await Promise.all(emailPromises);
          
          // Mark announcement as sent
          await Announcement.markAsEmailSent(announcementId);
        } catch (emailError) {
          console.error('Email sending error:', emailError);
          // Continue even if email sending fails
        }
      }

      res.status(201).json({
        success: true,
        message: 'Announcement created and emails sent successfully',
        data: {
          id: announcementId,
          title,
          content,
          target_audience,
          recipients_count: recipientsList.length,
          email_sent: true
        }
      });

    } catch (error) {
      console.error('Error creating announcement:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating announcement',
        error: error.message
      });
    }
  }

  // Get all announcements with pagination
  static async getAnnouncements(req, res) {
    try {
      const { page = 1, limit = 10, target_audience, created_by } = req.query;
      const offset = (page - 1) * limit;

      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset)
      };

      if (target_audience) options.target_audience = target_audience;
      if (created_by) options.created_by = parseInt(created_by);

      const announcements = await Announcement.findAll(options);

      res.status(200).json({
        success: true,
        data: announcements,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: announcements.length
        }
      });

    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching announcements',
        error: error.message
      });
    }
  }

  // Get announcement by ID
  static async getAnnouncementById(req, res) {
    try {
      const { id } = req.params;
      const announcement = await Announcement.findById(id);

      if (!announcement) {
        return res.status(404).json({
          success: false,
          message: 'Announcement not found'
        });
      }

      res.status(200).json({
        success: true,
        data: announcement
      });

    } catch (error) {
      console.error('Error fetching announcement:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching announcement',
        error: error.message
      });
    }
  }

  // Update announcement
  static async updateAnnouncement(req, res) {
    try {
      const { id } = req.params;
      const { title, content, target_audience } = req.body;

      // Validate required fields
      if (!title || !content || !target_audience) {
        return res.status(400).json({
          success: false,
          message: 'Title, content, and target audience are required'
        });
      }

      // Handle file upload if present
      let attachment_path = null;
      if (req.file) {
        attachment_path = req.file.path;
      }

      const updateData = {
        title,
        content,
        target_audience,
        attachment_path
      };

      const updated = await Announcement.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Announcement not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Announcement updated successfully'
      });

    } catch (error) {
      console.error('Error updating announcement:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating announcement',
        error: error.message
      });
    }
  }

  // Delete announcement
  static async deleteAnnouncement(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Announcement.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Announcement not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Announcement deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting announcement:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting announcement',
        error: error.message
      });
    }
  }

  // Get recipients by type
  static async getRecipients(req, res) {
    try {
      const { target_audience = 'all' } = req.query;
      console.log('Fetching recipients for target_audience:', target_audience);
      
      const recipients = await Announcement.getRecipientsByType(target_audience);
      console.log('Recipients fetched:', recipients);

      res.status(200).json({
        success: true,
        data: recipients || [],
        count: (recipients || []).length
      });

    } catch (error) {
      console.error('Error fetching recipients:', error);
      res.status(200).json({
        success: true,
        data: [],
        count: 0
      });
    }
  }

  // Get announcement statistics
  static async getStats(req, res) {
    try {
      const stats = await Announcement.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching statistics',
        error: error.message
      });
    }
  }

  // Get available roles
  static async getAvailableRoles(req, res) {
    try {
      console.log('getAvailableRoles called');
      const roles = await Announcement.getAvailableRoles();
      console.log('Roles fetched:', roles);

      res.status(200).json({
        success: true,
        data: roles || []
      });

    } catch (error) {
      console.error('Error fetching available roles:', error);
      res.status(200).json({
        success: true,
        data: []
      });
    }
  }

  // Get recipients count by role
  static async getRecipientsCountByRole(req, res) {
    try {
      const roleCounts = await Announcement.getRecipientsCountByRole();

      res.status(200).json({
        success: true,
        data: roleCounts
      });

    } catch (error) {
      console.error('Error fetching recipients count by role:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching recipients count by role',
        error: error.message
      });
    }
  }

  // Resend announcement emails
  static async resendEmails(req, res) {
    try {
      const { id } = req.params;
      const announcement = await Announcement.findById(id);

      if (!announcement) {
        return res.status(404).json({
          success: false,
          message: 'Announcement not found'
        });
      }

      // Get recipients
      const recipients = await Announcement.getRecipientsByType(announcement.target_audience);

      if (recipients.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No recipients found for this announcement'
        });
      }

      // Send emails
      const emailPromises = recipients.map(recipient => {
        return sendAnnouncementEmail(recipient, announcement, announcement.attachment_path);
      });

      await Promise.all(emailPromises);

      // Mark as sent
      await Announcement.markAsEmailSent(id);

      res.status(200).json({
        success: true,
        message: 'Emails resent successfully',
        data: {
          recipients_count: recipients.length,
          email_sent: true
        }
      });

    } catch (error) {
      console.error('Error resending emails:', error);
      res.status(500).json({
        success: false,
        message: 'Error resending emails',
        error: error.message
      });
    }
  }
}

module.exports = AnnouncementController; 