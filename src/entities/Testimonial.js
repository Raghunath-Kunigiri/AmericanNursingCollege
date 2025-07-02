import { testimonialsAPI } from '../utils/api';

export class Testimonial {
  constructor(data = {}) {
    this.id = data._id || data.id;
    this.name = data.name || '';
    this.role = data.role || '';
    this.program = data.program || '';
    this.content = data.content || '';
    this.image = data.image || '';
    this.rating = data.rating || 5;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.featured = data.featured || false;
    this.order = data.order || 0;
    this.createdAt = data.createdAt || data.created_date;
    this.updatedAt = data.updatedAt || data.updated_date;
  }

  static async list(params = {}) {
    try {
      const result = await testimonialsAPI.getAll(params);
      return result.testimonials?.map(data => new Testimonial(data)) || [];
    } catch (error) {
      console.error('Error loading testimonials:', error);
      return [];
    }
  }

  static async getActive() {
    try {
      const testimonials = await testimonialsAPI.getActive();
      return testimonials.map(data => new Testimonial(data));
    } catch (error) {
      console.error('Error loading active testimonials:', error);
      return [];
    }
  }

  static async getById(id) {
    try {
      const data = await testimonialsAPI.getById(id);
      return new Testimonial(data);
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const result = await testimonialsAPI.create(data);
      return {
        success: true,
        data: new Testimonial(result)
      };
    } catch (error) {
      console.error('Error creating testimonial:', error);
      return {
        success: false,
        error: error.message || 'Failed to create testimonial'
      };
    }
  }

  static async update(id, updates) {
    try {
      const result = await testimonialsAPI.update(id, updates);
      return {
        success: true,
        data: new Testimonial(result)
      };
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return {
        success: false,
        error: error.message || 'Failed to update testimonial'
      };
    }
  }

  static async toggle(id) {
    try {
      const result = await testimonialsAPI.toggle(id);
      return {
        success: true,
        data: new Testimonial(result)
      };
    } catch (error) {
      console.error('Error toggling testimonial:', error);
      return {
        success: false,
        error: error.message || 'Failed to toggle testimonial'
      };
    }
  }

  static async toggleFeature(id) {
    try {
      const result = await testimonialsAPI.toggleFeature(id);
      return {
        success: true,
        data: new Testimonial(result)
      };
    } catch (error) {
      console.error('Error toggling testimonial feature:', error);
      return {
        success: false,
        error: error.message || 'Failed to toggle testimonial feature'
      };
    }
  }

  static async delete(id) {
    try {
      await testimonialsAPI.delete(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete testimonial'
      };
    }
  }

  // Bulk operations
  static async bulkDelete(ids) {
    try {
      const results = await Promise.allSettled(
        ids.map(id => testimonialsAPI.delete(id))
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
        ids.map(id => testimonialsAPI.toggle(id))
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
    return Testimonial.update(this.id, this);
  }

  static getDefaultTestimonials() {
    return [
      {
        name: 'Sarah Martinez',
        role: 'Graduate',
        program: 'Bachelor of Science in Nursing',
        content: 'The nursing program at American Nursing College gave me the foundation I needed to excel in my career. The hands-on training and supportive faculty made all the difference.',
        image: '/images/testimonials/sarah.jpg',
        rating: 5,
        isActive: true,
        featured: true,
        order: 1
      },
      {
        name: 'Michael Chen',
        role: 'Current Student',
        program: 'General Nursing & Midwifery',
        content: 'Amazing clinical experience and state-of-the-art facilities. The instructors are knowledgeable and always willing to help students succeed.',
        image: '/images/testimonials/michael.jpg',
        rating: 5,
        isActive: true,
        featured: false,
        order: 2
      },
      {
        name: 'Jessica Rodriguez',
        role: 'Working Professional',
        program: 'Medical Lab Technician',
        content: 'The flexibility of the program allowed me to work while studying. I\'m now working in a leading hospital thanks to the excellent training I received.',
        image: '/images/testimonials/jessica.jpg',
        rating: 5,
        isActive: true,
        featured: false,
        order: 3
      }
    ];
  }
} 