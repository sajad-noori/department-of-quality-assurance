const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const questionnairesAPI = {
  // Get all questionnaires
  getAllQuestionnaires: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/questionnaires`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
      throw error;
    }
  },

  // Create a new questionnaire (admin only)
  createQuestionnaire: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/questionnaires`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating questionnaire:', error);
      throw error;
    }
  },

  // Update a questionnaire (admin only)
  updateQuestionnaire: async (id, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/questionnaires/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating questionnaire:', error);
      throw error;
    }
  },

  // Delete a questionnaire (admin only)
  deleteQuestionnaire: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/questionnaires/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting questionnaire:', error);
      throw error;
    }
  },

  // Upload filled questionnaire
  uploadFilledQuestionnaire: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/questionnaires/filled`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading filled questionnaire:', error);
      throw error;
    }
  },

  // Get all filled questionnaires for a questionnaire
  getFilledQuestionnaires: async (questionnaireId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/questionnaires/${questionnaireId}/filled`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching filled questionnaires:', error);
      throw error;
    }
  },

  // Mark a filled questionnaire as checked (read)
  checkFilledQuestionnaire: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/questionnaires/filled/${id}/check`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error checking filled questionnaire:', error);
      throw error;
    }
  },
}; 