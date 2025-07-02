export class Testimonial {
  constructor(data = {}) {
    this.id = data.id || Date.now().toString();
    this.name = data.name || '';
    this.role = data.role || '';
    this.program = data.program || '';
    this.content = data.content || '';
    this.image = data.image || '';
    this.rating = data.rating || 5;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.created_date = data.created_date || new Date().toISOString();
    this.updated_date = data.updated_date || new Date().toISOString();
  }

  static getStorageKey() {
    return 'anc_testimonials';
  }

  static async list() {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      const testimonials = stored ? JSON.parse(stored) : this.getDefaultTestimonials();
      return testimonials.map(data => new Testimonial(data));
    } catch (error) {
      console.error('Error loading testimonials:', error);
      return this.getDefaultTestimonials().map(data => new Testimonial(data));
    }
  }

  static async create(data) {
    const testimonials = await this.list();
    const newTestimonial = new Testimonial(data);
    testimonials.push(newTestimonial);
    await this.saveAll(testimonials);
    return newTestimonial;
  }

  static async update(id, updates) {
    const testimonials = await this.list();
    const index = testimonials.findIndex(t => t.id === id);
    if (index !== -1) {
      testimonials[index] = new Testimonial({
        ...testimonials[index],
        ...updates,
        updated_date: new Date().toISOString()
      });
      await this.saveAll(testimonials);
      return testimonials[index];
    }
    throw new Error('Testimonial not found');
  }

  static async delete(id) {
    const testimonials = await this.list();
    const filtered = testimonials.filter(t => t.id !== id);
    await this.saveAll(filtered);
    return true;
  }

  static async saveAll(testimonials) {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(testimonials));
  }

  static getDefaultTestimonials() {
    return [
      {
        id: '1',
        name: 'Sarah Martinez',
        role: 'Graduate',
        program: 'Bachelor of Science in Nursing',
        content: 'The nursing program at American Nursing College gave me the foundation I needed to excel in my career. The hands-on training and supportive faculty made all the difference.',
        image: '/images/testimonials/sarah.jpg',
        rating: 5,
        isActive: true,
        created_date: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Michael Chen',
        role: 'Current Student',
        program: 'General Nursing & Midwifery',
        content: 'Amazing clinical experience and state-of-the-art facilities. The instructors are knowledgeable and always willing to help students succeed.',
        image: '/images/testimonials/michael.jpg',
        rating: 5,
        isActive: true,
        created_date: '2024-02-20T14:30:00Z'
      },
      {
        id: '3',
        name: 'Jessica Rodriguez',
        role: 'Working Professional',
        program: 'Medical Lab Technician',
        content: 'The flexibility of the program allowed me to work while studying. I\'m now working in a leading hospital thanks to the excellent training I received.',
        image: '/images/testimonials/jessica.jpg',
        rating: 5,
        isActive: true,
        created_date: '2024-03-10T09:15:00Z'
      }
    ];
  }
} 