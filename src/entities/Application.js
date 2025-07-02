export class Application {
  static async create(applicationData) {
    // In a real app, this would make an API call
    // For now, we'll just simulate success
    console.log('Application submitted:', applicationData);
    
    // Store in localStorage for demo purposes
    const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    const newApplication = {
      ...applicationData,
      id: Date.now().toString(),
      status: 'pending',
      created_date: new Date().toISOString(),
      application_id: `APP-${Date.now()}`
    };
    existingApplications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(existingApplications));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      id: newApplication.application_id
    };
  }

  static async list(sortBy = '-created_date') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get from localStorage for demo purposes
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    // Sort applications
    if (sortBy === '-created_date') {
      applications.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
    
    return applications;
  }

  static async updateStatus(id, status) {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const applicationIndex = applications.findIndex(app => app.id === id);
    
    if (applicationIndex !== -1) {
      applications[applicationIndex].status = status;
      localStorage.setItem('applications', JSON.stringify(applications));
      return { success: true };
    }
    
    return { success: false, error: 'Application not found' };
  }
} 