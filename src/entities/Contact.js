export class Contact {
  static async create(contactData) {
    // In a real app, this would make an API call
    // For now, we'll just simulate success
    console.log('Contact form submitted:', contactData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      id: `MSG${Date.now()}`
    };
  }
} 