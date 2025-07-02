const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add body if it's not a GET request
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Applications API
export const applicationsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/applications${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/applications/${id}`),
  
  create: (applicationData) => apiRequest('/applications', {
    method: 'POST',
    body: applicationData,
  }),
  
  update: (id, applicationData) => apiRequest(`/applications/${id}`, {
    method: 'PUT',
    body: applicationData,
  }),
  
  updateStatus: (id, status, note, updated_by) => apiRequest(`/applications/${id}/status`, {
    method: 'PATCH',
    body: { status, note, updated_by },
  }),
  
  delete: (id) => apiRequest(`/applications/${id}`, {
    method: 'DELETE',
  }),
  
  getStats: () => apiRequest('/applications/stats/summary'),
};

// Contacts API
export const contactsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/contacts${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/contacts/${id}`),
  
  create: (contactData) => apiRequest('/contacts', {
    method: 'POST',
    body: contactData,
  }),
  
  update: (id, contactData) => apiRequest(`/contacts/${id}`, {
    method: 'PUT',
    body: contactData,
  }),
  
  updateStatus: (id, status) => apiRequest(`/contacts/${id}/status`, {
    method: 'PATCH',
    body: { status },
  }),
  
  assign: (id, assigned_to) => apiRequest(`/contacts/${id}/assign`, {
    method: 'PATCH',
    body: { assigned_to },
  }),
  
  reply: (id, message, sender) => apiRequest(`/contacts/${id}/reply`, {
    method: 'POST',
    body: { message, sender },
  }),
  
  delete: (id) => apiRequest(`/contacts/${id}`, {
    method: 'DELETE',
  }),
  
  getStats: () => apiRequest('/contacts/stats/summary'),
};

// Testimonials API
export const testimonialsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/testimonials${queryString ? `?${queryString}` : ''}`);
  },
  
  getActive: () => apiRequest('/testimonials/active'),
  
  getById: (id) => apiRequest(`/testimonials/${id}`),
  
  create: (testimonialData) => apiRequest('/testimonials', {
    method: 'POST',
    body: testimonialData,
  }),
  
  update: (id, testimonialData) => apiRequest(`/testimonials/${id}`, {
    method: 'PUT',
    body: testimonialData,
  }),
  
  toggle: (id) => apiRequest(`/testimonials/${id}/toggle`, {
    method: 'PATCH',
  }),
  
  toggleFeature: (id) => apiRequest(`/testimonials/${id}/feature`, {
    method: 'PATCH',
  }),
  
  delete: (id) => apiRequest(`/testimonials/${id}`, {
    method: 'DELETE',
  }),
};

// Announcements API
export const announcementsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/announcements${queryString ? `?${queryString}` : ''}`);
  },
  
  getActive: (page) => apiRequest(`/announcements/active/${page}`),
  
  getById: (id) => apiRequest(`/announcements/${id}`),
  
  create: (announcementData) => apiRequest('/announcements', {
    method: 'POST',
    body: announcementData,
  }),
  
  update: (id, announcementData) => apiRequest(`/announcements/${id}`, {
    method: 'PUT',
    body: announcementData,
  }),
  
  toggle: (id) => apiRequest(`/announcements/${id}/toggle`, {
    method: 'PATCH',
  }),
  
  delete: (id) => apiRequest(`/announcements/${id}`, {
    method: 'DELETE',
  }),
};

// Health check
export const healthCheck = () => apiRequest('/health');

export default {
  applications: applicationsAPI,
  contacts: contactsAPI,
  testimonials: testimonialsAPI,
  announcements: announcementsAPI,
  healthCheck,
}; 