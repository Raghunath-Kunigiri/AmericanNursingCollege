import { announcementsAPI } from '../utils/api';

export class Announcement {
  constructor(data = {}) {
    this.id = data._id || data.id;
    this.title = data.title || '';
    this.content = data.content || '';
    this.type = data.type || 'info'; // info, success, warning, error
    this.isActive = data.isActive !== undefined ? data.isActive : false;
    this.priority = data.priority || 'normal'; // low, normal, high, urgent
    this.startDate = data.startDate || new Date().toISOString();
    this.endDate = data.endDate || null;
    this.targetPages = data.targetPages || ['homepage']; // homepage, applications, programs, all
    this.createdAt = data.createdAt || data.created_date;
    this.updatedAt = data.updatedAt || data.updated_date;
    this.created_by = data.created_by || 'Admin';
  }

  static async list(params = {}) {
    try {
      const result = await announcementsAPI.getAll(params);
      return result.announcements?.map(data => new Announcement(data)) || [];
    } catch (error) {
      console.error('Error loading announcements:', error);
      return [];
    }
  }

  static async getActive(page = 'homepage') {
    try {
      const announcements = await announcementsAPI.getActive(page);
      return announcements.map(data => new Announcement(data));
    } catch (error) {
      console.error('Error loading active announcements:', error);
      return [];
    }
  }

  static async getById(id) {
    try {
      const data = await announcementsAPI.getById(id);
      return new Announcement(data);
    } catch (error) {
      console.error('Error fetching announcement:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const result = await announcementsAPI.create(data);
      return {
        success: true,
        data: new Announcement(result)
      };
    } catch (error) {
      console.error('Error creating announcement:', error);
      return {
        success: false,
        error: error.message || 'Failed to create announcement'
      };
    }
  }

  static async update(id, updates) {
    try {
      const result = await announcementsAPI.update(id, updates);
      return {
        success: true,
        data: new Announcement(result)
      };
    } catch (error) {
      console.error('Error updating announcement:', error);
      return {
        success: false,
        error: error.message || 'Failed to update announcement'
      };
    }
  }

  static async toggle(id) {
    try {
      const result = await announcementsAPI.toggle(id);
      return {
        success: true,
        data: new Announcement(result)
      };
    } catch (error) {
      console.error('Error toggling announcement:', error);
      return {
        success: false,
        error: error.message || 'Failed to toggle announcement'
      };
    }
  }

  static async delete(id) {
    try {
      await announcementsAPI.delete(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting announcement:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete announcement'
      };
    }
  }

  static async activate(id) {
    // Check current status first, then toggle if needed
    try {
      const announcement = await this.getById(id);
      if (!announcement.isActive) {
        return await this.toggle(id);
      }
      return { success: true, data: announcement };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to activate announcement'
      };
    }
  }

  static async deactivate(id) {
    // Check current status first, then toggle if needed
    try {
      const announcement = await this.getById(id);
      if (announcement.isActive) {
        return await this.toggle(id);
      }
      return { success: true, data: announcement };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to deactivate announcement'
      };
    }
  }

  // Bulk operations
  static async bulkDelete(ids) {
    try {
      const results = await Promise.allSettled(
        ids.map(id => announcementsAPI.delete(id))
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

  static async bulkToggle(ids) {
    try {
      const results = await Promise.allSettled(
        ids.map(id => announcementsAPI.toggle(id))
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
      console.error('Error in bulk toggle:', error);
      return {
        success: false,
        error: error.message || 'Bulk toggle failed'
      };
    }
  }

  // Utility methods
  save() {
    return Announcement.update(this.id, this);
  }

  static getDefaultAnnouncements() {
    return [
      {
        title: 'Fall 2025 Admissions Now Open!',
        content: 'Applications for our Fall 2025 semester are now being accepted. Early bird deadline is March 15th with reduced application fees.',
        type: 'success',
        isActive: true,
        priority: 'high',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        targetPages: ['homepage', 'applications'],
        created_by: 'Admin'
      },
      {
        title: 'Virtual Campus Tour Available',
        content: 'Experience our state-of-the-art facilities from home! Join our virtual campus tours every Wednesday at 2 PM EST.',
        type: 'info',
        isActive: false,
        priority: 'normal',
        startDate: '2024-02-01T00:00:00Z',
        endDate: null,
        targetPages: ['homepage'],
        created_by: 'Admin'
      }
    ];
  }
} 