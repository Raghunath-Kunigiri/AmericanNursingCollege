// Local Storage API for Frontend-Only Operation
import { createSampleData } from './sampleData';

// Helper function to get data from localStorage
const getStorageData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper function to save data to localStorage
const setStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize sample data if not exists
const initializeData = () => {
  if (!localStorage.getItem('applications') || !localStorage.getItem('contacts')) {
    createSampleData();
  }
};

// Simulate API delay for realistic UX
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Authentication (simplified for demo)
export const api = {
  // Auth endpoints (mock)
  login: async (credentials) => {
    await simulateDelay();
    // Simple demo authentication
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const token = 'demo-auth-token-' + Date.now();
      localStorage.setItem('authToken', token);
      return { success: true, token, user: { username: 'admin', role: 'administrator' } };
    }
    throw new Error('Invalid credentials');
  },

  verifyToken: async () => {
    await simulateDelay(100);
    const token = localStorage.getItem('authToken');
    if (token) {
      return { valid: true, user: { username: 'admin', role: 'administrator' } };
    }
    throw new Error('Invalid token');
  },

  logout: async () => {
    await simulateDelay(100);
    localStorage.removeItem('authToken');
    return { success: true };
  },

  // Applications
  getApplications: async (filters = {}) => {
    await simulateDelay();
    initializeData();
    let applications = getStorageData('applications');
    
    // Apply filters
    if (filters.status) {
      applications = applications.filter(app => app.status === filters.status);
    }
    if (filters.program) {
      applications = applications.filter(app => app.program === filters.program);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      applications = applications.filter(app => 
        app.full_name.toLowerCase().includes(search) ||
        app.email.toLowerCase().includes(search) ||
        app.application_id.toLowerCase().includes(search)
      );
    }
    
    return { applications, total: applications.length };
  },

  getApplicationById: async (id) => {
    await simulateDelay();
    const applications = getStorageData('applications');
    const application = applications.find(app => app.id === id);
    if (!application) throw new Error('Application not found');
    return application;
  },

  createApplication: async (data) => {
    await simulateDelay();
    const applications = getStorageData('applications');
    const newApplication = {
      id: generateId(),
      application_id: `APP-${Date.now()}`,
      ...data,
      status: 'pending',
      created_date: new Date().toISOString()
    };
    applications.unshift(newApplication);
    setStorageData('applications', applications);
    return newApplication;
  },

  updateApplication: async (id, data) => {
    await simulateDelay();
    const applications = getStorageData('applications');
    const index = applications.findIndex(app => app.id === id);
    if (index === -1) throw new Error('Application not found');
    
    applications[index] = { ...applications[index], ...data, updated_date: new Date().toISOString() };
    setStorageData('applications', applications);
    return applications[index];
  },

  updateApplicationStatus: async (id, status) => {
    return api.updateApplication(id, { status });
  },

  addApplicationNote: async (id, note) => {
    await simulateDelay();
    const applications = getStorageData('applications');
    const index = applications.findIndex(app => app.id === id);
    if (index === -1) throw new Error('Application not found');
    
    if (!applications[index].notes) applications[index].notes = [];
    applications[index].notes.push({
      id: generateId(),
      ...note,
      created_date: new Date().toISOString()
    });
    
    setStorageData('applications', applications);
    return applications[index];
  },

  deleteApplication: async (id) => {
    await simulateDelay();
    const applications = getStorageData('applications');
    const filtered = applications.filter(app => app.id !== id);
    setStorageData('applications', filtered);
    return { success: true };
  },

  // Contacts
  getContacts: async (filters = {}) => {
    await simulateDelay();
    initializeData();
    let contacts = getStorageData('contacts');
    
    // Apply filters
    if (filters.status) {
      contacts = contacts.filter(contact => contact.status === filters.status);
    }
    if (filters.inquiry_type) {
      contacts = contacts.filter(contact => contact.inquiry_type === filters.inquiry_type);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      contacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.subject.toLowerCase().includes(search)
      );
    }
    
    return { contacts, total: contacts.length };
  },

  getContactById: async (id) => {
    await simulateDelay();
    const contacts = getStorageData('contacts');
    const contact = contacts.find(c => c.id === id);
    if (!contact) throw new Error('Contact not found');
    return contact;
  },

  createContact: async (data) => {
    await simulateDelay();
    const contacts = getStorageData('contacts');
    const newContact = {
      id: `MSG${Date.now()}`,
      ...data,
      status: 'new',
      created_date: new Date().toISOString()
    };
    contacts.unshift(newContact);
    setStorageData('contacts', contacts);
    return newContact;
  },

  updateContact: async (id, data) => {
    await simulateDelay();
    const contacts = getStorageData('contacts');
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    
    contacts[index] = { ...contacts[index], ...data, updated_date: new Date().toISOString() };
    setStorageData('contacts', contacts);
    return contacts[index];
  },

  updateContactStatus: async (id, status) => {
    return api.updateContact(id, { status });
  },

  addContactResponse: async (id, response) => {
    await simulateDelay();
    const contacts = getStorageData('contacts');
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    
    if (!contacts[index].responses) contacts[index].responses = [];
    contacts[index].responses.push({
      id: generateId(),
      ...response,
      created_date: new Date().toISOString()
    });
    
    setStorageData('contacts', contacts);
    return contacts[index];
  },

  deleteContact: async (id) => {
    await simulateDelay();
    const contacts = getStorageData('contacts');
    const filtered = contacts.filter(c => c.id !== id);
    setStorageData('contacts', filtered);
    return { success: true };
  },

  // Testimonials (mock data)
  getTestimonials: async (filters = {}) => {
    await simulateDelay();
    const testimonials = [
      {
        id: '1',
        name: 'Sarah Johnson',
        program: 'Bachelor of Science in Nursing',
        message: 'The nursing program at American Nursing College exceeded my expectations. The faculty is incredibly supportive and the hands-on clinical experience prepared me well for my career.',
        rating: 5,
        active: true,
        featured: true,
        created_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Michael Chen',
        program: 'General Nursing and Midwifery',
        message: 'Outstanding program with excellent clinical rotations. I felt confident and well-prepared when I graduated.',
        rating: 5,
        active: true,
        featured: false,
        created_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    return { testimonials, total: testimonials.length };
  },

  createTestimonial: async (data) => {
    await simulateDelay();
    return { id: generateId(), ...data, created_date: new Date().toISOString() };
  },

  updateTestimonial: async (id, data) => {
    await simulateDelay();
    return { id, ...data, updated_date: new Date().toISOString() };
  },

  deleteTestimonial: async (id) => {
    await simulateDelay();
    return { success: true };
  },

  // Announcements (mock data)
  getAnnouncements: async (filters = {}) => {
    await simulateDelay();
    const announcements = [
      {
        id: '1',
        title: 'Fall 2024 Registration Now Open',
        message: 'Registration for Fall 2024 semester is now open. Apply early to secure your spot!',
        type: 'info',
        active: true,
        created_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'New Clinical Partnership',
        message: 'We are excited to announce our new partnership with Regional Medical Center for enhanced clinical experiences.',
        type: 'success',
        active: true,
        created_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    return { announcements, total: announcements.length };
  },

  createAnnouncement: async (data) => {
    await simulateDelay();
    return { id: generateId(), ...data, created_date: new Date().toISOString() };
  },

  updateAnnouncement: async (id, data) => {
    await simulateDelay();
    return { id, ...data, updated_date: new Date().toISOString() };
  },

  deleteAnnouncement: async (id) => {
    await simulateDelay();
    return { success: true };
  },

  // Health check (always returns healthy for frontend-only)
  checkHealth: async () => {
    await simulateDelay(100);
    return { status: 'healthy', message: 'Frontend-only mode', timestamp: new Date().toISOString() };
  }
};

// Applications API
export const applicationsAPI = {
  getAll: (params = {}) => api.getApplications(params),
  getById: (id) => api.getApplicationById(id),
  create: (applicationData) => api.createApplication(applicationData),
  update: (id, applicationData) => api.updateApplication(id, applicationData),
  updateStatus: (id, status, note, updated_by) => api.updateApplication(id, { status, note, updated_by }),
  delete: (id) => api.deleteApplication(id),
  getStats: () => api.getApplications({ stats: true }),
};

// Contacts API
export const contactsAPI = {
  getAll: (params = {}) => api.getContacts(params),
  getById: (id) => api.getContactById(id),
  create: (contactData) => api.createContact(contactData),
  update: (id, contactData) => api.updateContact(id, contactData),
  updateStatus: (id, status) => api.updateContactStatus(id, status),
  assign: (id, assigned_to) => api.updateContact(id, { assigned_to }),
  reply: (id, message, sender) => api.addContactResponse(id, { message, sender }),
  delete: (id) => api.deleteContact(id),
  getStats: () => api.getContacts({ stats: true }),
};

// Testimonials API
export const testimonialsAPI = {
  getAll: (params = {}) => api.getTestimonials(params),
  getActive: () => api.getTestimonials({ active: true }),
  getById: (id) => api.getTestimonials({ id }),
  create: (testimonialData) => api.createTestimonial(testimonialData),
  update: (id, testimonialData) => api.updateTestimonial(id, testimonialData),
  toggle: (id) => api.updateTestimonial(id, { active: false }),
  toggleFeature: (id) => api.updateTestimonial(id, { featured: true }),
  delete: (id) => api.deleteTestimonial(id),
};

// Announcements API
export const announcementsAPI = {
  getAll: (params = {}) => api.getAnnouncements(params),
  getActive: (page) => api.getAnnouncements({ active: true, page }),
  getById: (id) => api.getAnnouncements({ id }),
  create: (announcementData) => api.createAnnouncement(announcementData),
  update: (id, announcementData) => api.updateAnnouncement(id, announcementData),
  toggle: (id) => api.updateAnnouncement(id, { active: false }),
  delete: (id) => api.deleteAnnouncement(id),
};

// Health check
export const healthCheck = () => api.checkHealth();

// Main API object
const API = {
  applications: applicationsAPI,
  contacts: contactsAPI,
  testimonials: testimonialsAPI,
  announcements: announcementsAPI,
  healthCheck,
};

export default API; 