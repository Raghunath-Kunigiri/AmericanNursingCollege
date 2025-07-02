export class Contact {
  static async create(contactData) {
    // In a real app, this would make an API call
    // For now, we'll just simulate success
    console.log('Contact form submitted:', contactData);
    
    // Store in localStorage for demo purposes
    const existingContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    const newContact = {
      ...contactData,
      id: `MSG${Date.now()}`,
      status: 'new',
      created_date: new Date().toISOString()
    };
    existingContacts.push(newContact);
    localStorage.setItem('contacts', JSON.stringify(existingContacts));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      id: newContact.id
    };
  }

  static async list(sortBy = '-created_date') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get from localStorage for demo purposes
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    
    // Sort contacts
    if (sortBy === '-created_date') {
      contacts.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
    
    return contacts;
  }

  static async updateStatus(id, status) {
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    const contactIndex = contacts.findIndex(contact => contact.id === id);
    
    if (contactIndex !== -1) {
      contacts[contactIndex].status = status;
      localStorage.setItem('contacts', JSON.stringify(contacts));
      return { success: true };
    }
    
    return { success: false, error: 'Contact not found' };
  }
} 