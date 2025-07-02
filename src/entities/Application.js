import { applicationsAPI } from '../utils/api';

// Helper function to format dates for the database
const formatDateForDB = (dateString) => {
  return dateString ? new Date(dateString).toISOString() : null;
};

// Helper function to format application data for API
const formatApplicationForAPI = (application) => {
  return {
    ...application,
    date_of_birth: formatDateForDB(application.date_of_birth),
    education: {
      ...application.education,
      year_completed: parseInt(application.education.year_completed),
      percentage: parseFloat(application.education.percentage)
    }
  };
};

export class Application {
  static async create(applicationData) {
    try {
      console.log('Creating application:', applicationData);
      
      // Format the data for the API
      const formattedData = formatApplicationForAPI(applicationData);
      
      const result = await applicationsAPI.create(formattedData);
      
      return {
        success: true,
        id: result.application_id,
        data: result
      };
    } catch (error) {
      console.error('Error creating application:', error);
      return {
        success: false,
        error: error.message || 'Failed to create application'
      };
    }
  }

  static async list(params = {}) {
    try {
      const result = await applicationsAPI.getAll(params);
      return result.applications || [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  }

  static async getById(id) {
    try {
      return await applicationsAPI.getById(id);
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  }

  static async update(id, applicationData) {
    try {
      const formattedData = formatApplicationForAPI(applicationData);
      const result = await applicationsAPI.update(id, formattedData);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error updating application:', error);
      return {
        success: false,
        error: error.message || 'Failed to update application'
      };
    }
  }

  static async updateStatus(id, status, note = '', updated_by = 'Admin') {
    try {
      const result = await applicationsAPI.updateStatus(id, status, note, updated_by);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error updating application status:', error);
      return {
        success: false,
        error: error.message || 'Failed to update application status'
      };
    }
  }

  static async delete(id) {
    try {
      await applicationsAPI.delete(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting application:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete application'
      };
    }
  }

  static async getStats() {
    try {
      return await applicationsAPI.getStats();
    } catch (error) {
      console.error('Error fetching application stats:', error);
      return {
        total: 0,
        pending: 0,
        reviewing: 0,
        accepted: 0,
        rejected: 0
      };
    }
  }

  // Bulk operations
  static async bulkDelete(ids) {
    try {
      const results = await Promise.allSettled(
        ids.map(id => applicationsAPI.delete(id))
      );
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      return {
        success: failed === 0,
        successful,
        failed,
        total: ids.length
      };
    } catch (error) {
      console.error('Error in bulk delete:', error);
      return {
        success: false,
        error: error.message || 'Bulk delete failed'
      };
    }
  }

  static async bulkUpdateStatus(ids, status, note = '', updated_by = 'Admin') {
    try {
      const results = await Promise.allSettled(
        ids.map(id => applicationsAPI.updateStatus(id, status, note, updated_by))
      );
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      return {
        success: failed === 0,
        successful,
        failed,
        total: ids.length
      };
    } catch (error) {
      console.error('Error in bulk status update:', error);
      return {
        success: false,
        error: error.message || 'Bulk status update failed'
      };
    }
  }
} 