// Utility functions for handling offline applications

export const getOfflineApplications = () => {
  try {
    const applications = localStorage.getItem('offline_applications');
    return applications ? JSON.parse(applications) : [];
  } catch (error) {
    console.error('Error retrieving offline applications:', error);
    return [];
  }
};

export const saveOfflineApplication = (application) => {
  try {
    const applications = getOfflineApplications();
    applications.push(application);
    localStorage.setItem('offline_applications', JSON.stringify(applications));
    return true;
  } catch (error) {
    console.error('Error saving offline application:', error);
    return false;
  }
};

export const clearOfflineApplications = () => {
  try {
    localStorage.removeItem('offline_applications');
    return true;
  } catch (error) {
    console.error('Error clearing offline applications:', error);
    return false;
  }
};

export const getOfflineApplicationById = (id) => {
  try {
    const applications = getOfflineApplications();
    return applications.find(app => app.id === id) || null;
  } catch (error) {
    console.error('Error retrieving offline application:', error);
    return null;
  }
};

export const updateOfflineApplication = (id, updates) => {
  try {
    const applications = getOfflineApplications();
    const index = applications.findIndex(app => app.id === id);
    
    if (index !== -1) {
      applications[index] = { ...applications[index], ...updates };
      localStorage.setItem('offline_applications', JSON.stringify(applications));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating offline application:', error);
    return false;
  }
};

export const deleteOfflineApplication = (id) => {
  try {
    const applications = getOfflineApplications();
    const filteredApplications = applications.filter(app => app.id !== id);
    localStorage.setItem('offline_applications', JSON.stringify(filteredApplications));
    return true;
  } catch (error) {
    console.error('Error deleting offline application:', error);
    return false;
  }
};

// Sync offline applications with server when API is available
export const syncOfflineApplications = async () => {
  try {
    const offlineApplications = getOfflineApplications();
    
    if (offlineApplications.length === 0) {
      return { success: true, synced: 0, failed: 0 };
    }

    const results = await Promise.allSettled(
      offlineApplications.map(async (app) => {
        // Remove temporary ID and sync data
        const { id, ...appData } = app;
        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appData)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to sync application: ${response.statusText}`);
        }
        
        return response.json();
      })
    );

    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    if (successful > 0) {
      // Clear successfully synced applications
      clearOfflineApplications();
    }

    return {
      success: failed === 0,
      synced: successful,
      failed: failed,
      total: offlineApplications.length
    };
  } catch (error) {
    console.error('Error syncing offline applications:', error);
    return {
      success: false,
      error: error.message,
      synced: 0,
      failed: 0
    };
  }
}; 