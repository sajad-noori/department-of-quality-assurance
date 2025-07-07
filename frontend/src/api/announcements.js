const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AnnouncementsAPI {
  static async getAuthHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  // Create a new announcement
  static async createAnnouncement(announcementData) {
    try {
      const formData = new FormData();
      formData.append('title', announcementData.subject);
      formData.append('content', announcementData.message);
      formData.append('target_audience', announcementData.recipientType);
      
      if (announcementData.attachment) {
        formData.append('attachment', announcementData.attachment);
      }

      const response = await fetch(`${API_BASE_URL}/announcements`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  }

  // Get all announcements
  static async getAnnouncements(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.target_audience) queryParams.append('target_audience', params.target_audience);
      if (params.created_by) queryParams.append('created_by', params.created_by);

      const response = await fetch(`${API_BASE_URL}/announcements?${queryParams}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  }

  // Get announcement by ID
  static async getAnnouncementById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching announcement:', error);
      throw error;
    }
  }

  // Update announcement
  static async updateAnnouncement(id, announcementData) {
    try {
      const formData = new FormData();
      formData.append('title', announcementData.subject);
      formData.append('content', announcementData.message);
      formData.append('target_audience', announcementData.recipientType);
      
      if (announcementData.attachment) {
        formData.append('attachment', announcementData.attachment);
      }

      const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  }

  // Delete announcement
  static async deleteAnnouncement(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  }

  // Get recipients by type
  static async getRecipients(targetAudience = 'all') {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/recipients/list?target_audience=${targetAudience}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching recipients:', error);
      throw error;
    }
  }

  // Get announcement statistics
  static async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/stats/overview`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  // Get available roles
  static async getAvailableRoles() {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/roles/available`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching available roles:', error);
      throw error;
    }
  }

  // Get recipients count by role
  static async getRecipientsCountByRole() {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/recipients/count-by-role`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching recipients count by role:', error);
      throw error;
    }
  }

  // Resend announcement emails
  static async resendEmails(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/${id}/resend`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error resending emails:', error);
      throw error;
    }
  }
}

export default AnnouncementsAPI; 