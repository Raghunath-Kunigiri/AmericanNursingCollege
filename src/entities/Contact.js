import { contactsAPI } from '../utils/api';

export class Contact {
  static async create(contactData) {
    try {
      console.log('Creating contact:', contactData);
      
      const result = await contactsAPI.create(contactData);
      
      return {
        success: true,
        id: result._id,
        data: result
      };
    } catch (error) {
      console.error('Error creating contact:', error);
      return {
        success: false,
        error: error.message || 'Failed to create contact'
      };
    }
  }

  static async list(params = {}) {
    try {
      const result = await contactsAPI.getAll(params);
      return result.contacts || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  }

  static async getById(id) {
    try {
      return await contactsAPI.getById(id);
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  static async update(id, contactData) {
    try {
      const result = await contactsAPI.update(id, contactData);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error updating contact:', error);
      return {
        success: false,
        error: error.message || 'Failed to update contact'
      };
    }
  }

  static async updateStatus(id, status) {
    try {
      const result = await contactsAPI.updateStatus(id, status);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error updating contact status:', error);
      return {
        success: false,
        error: error.message || 'Failed to update contact status'
      };
    }
  }

  static async assign(id, assigned_to) {
    try {
      const result = await contactsAPI.assign(id, assigned_to);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error assigning contact:', error);
      return {
        success: false,
        error: error.message || 'Failed to assign contact'
      };
    }
  }

  static async reply(id, message, sender) {
    try {
      const result = await contactsAPI.reply(id, message, sender);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error sending reply:', error);
      return {
        success: false,
        error: error.message || 'Failed to send reply'
      };
    }
  }

  static async delete(id) {
    try {
      await contactsAPI.delete(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting contact:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete contact'
      };
    }
  }

  static async getStats() {
    try {
      return await contactsAPI.getStats();
    } catch (error) {
      console.error('Error fetching contact stats:', error);
      return {
        total: 0,
        new: 0,
        in_progress: 0,
        resolved: 0
      };
    }
  }

  // Bulk operations
  static async bulkDelete(ids) {
    try {
      const results = await Promise.allSettled(
        ids.map(id => contactsAPI.delete(id))
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

  static async bulkUpdateStatus(ids, status) {
    try {
      const results = await Promise.allSettled(
        ids.map(id => contactsAPI.updateStatus(id, status))
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