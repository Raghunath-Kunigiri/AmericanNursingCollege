export class Announcement {
  constructor(data = {}) {
    this.id = data.id || Date.now().toString();
    this.title = data.title || '';
    this.content = data.content || '';
    this.type = data.type || 'info'; // info, success, warning, error
    this.isActive = data.isActive !== undefined ? data.isActive : false;
    this.priority = data.priority || 'normal'; // low, normal, high, urgent
    this.startDate = data.startDate || new Date().toISOString();
    this.endDate = data.endDate || null;
    this.targetPages = data.targetPages || ['homepage']; // homepage, applications, programs, all
    this.created_date = data.created_date || new Date().toISOString();
    this.updated_date = data.updated_date || new Date().toISOString();
    this.created_by = data.created_by || 'Admin';
  }

  static getStorageKey() {
    return 'anc_announcements';
  }

  static async list() {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      const announcements = stored ? JSON.parse(stored) : this.getDefaultAnnouncements();
      return announcements.map(data => new Announcement(data))
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } catch (error) {
      console.error('Error loading announcements:', error);
      return this.getDefaultAnnouncements().map(data => new Announcement(data));
    }
  }

  static async getActive() {
    const announcements = await this.list();
    const now = new Date();
    
    return announcements.filter(announcement => {
      if (!announcement.isActive) return false;
      
      const startDate = new Date(announcement.startDate);
      if (startDate > now) return false;
      
      if (announcement.endDate) {
        const endDate = new Date(announcement.endDate);
        if (endDate < now) return false;
      }
      
      return true;
    }).sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  static async create(data) {
    const announcements = await this.list();
    const newAnnouncement = new Announcement(data);
    announcements.push(newAnnouncement);
    await this.saveAll(announcements);
    return newAnnouncement;
  }

  static async update(id, updates) {
    const announcements = await this.list();
    const index = announcements.findIndex(a => a.id === id);
    if (index !== -1) {
      announcements[index] = new Announcement({
        ...announcements[index],
        ...updates,
        updated_date: new Date().toISOString()
      });
      await this.saveAll(announcements);
      return announcements[index];
    }
    throw new Error('Announcement not found');
  }

  static async delete(id) {
    const announcements = await this.list();
    const filtered = announcements.filter(a => a.id !== id);
    await this.saveAll(filtered);
    return true;
  }

  static async activate(id) {
    return this.update(id, { isActive: true });
  }

  static async deactivate(id) {
    return this.update(id, { isActive: false });
  }

  static async saveAll(announcements) {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(announcements));
  }

  static getDefaultAnnouncements() {
    return [
      {
        id: '1',
        title: 'Fall 2025 Admissions Now Open!',
        content: 'Applications for our Fall 2025 semester are now being accepted. Early bird deadline is March 15th with reduced application fees.',
        type: 'success',
        isActive: true,
        priority: 'high',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        targetPages: ['homepage', 'applications'],
        created_date: '2024-01-01T10:00:00Z',
        created_by: 'Admin'
      },
      {
        id: '2',
        title: 'Virtual Campus Tour Available',
        content: 'Experience our state-of-the-art facilities from home! Join our virtual campus tours every Wednesday at 2 PM EST.',
        type: 'info',
        isActive: false,
        priority: 'normal',
        startDate: '2024-02-01T00:00:00Z',
        endDate: null,
        targetPages: ['homepage'],
        created_date: '2024-02-01T09:00:00Z',
        created_by: 'Admin'
      }
    ];
  }
} 