// API Configuration
const API_CONFIG = {
    // For Vercel deployment (recommended setup)
    BASE_URL: '', // Empty for relative URLs - both frontend and API on same domain
    
    // Other deployment options:
    // For local development: 'http://localhost:5000'
    // For production on different domain: 'https://your-api-domain.com'
    
    // Request timeout in milliseconds
    TIMEOUT: 30000
};

// API Helper Functions
class CollegeAPI {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    // Generic API call method
    async apiCall(endpoint, options = {}) {
        const url = `${this.baseUrl}/api${endpoint}`;
        
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Add timeout handling
            signal: AbortSignal.timeout ? AbortSignal.timeout(this.timeout) : undefined
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API call failed:', error);
            // Add more specific error messages
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please check your connection');
            } else if (error.message.includes('Failed to fetch')) {
                throw new Error('Unable to connect to server - please check if the server is running');
            }
            throw error;
        }
    }

    // Student API Methods
    async submitApplication(applicationData) {
        return await this.apiCall('/students/apply', {
            method: 'POST',
            body: JSON.stringify(applicationData)
        });
    }

    async getApplicationStatus(applicationId) {
        return await this.apiCall(`/students/application/${applicationId}`);
    }

    async checkEmailExists(email) {
        return await this.apiCall(`/students/check-email/${encodeURIComponent(email)}`);
    }

    async checkPhoneExists(phone) {
        return await this.apiCall(`/students/check-phone/${encodeURIComponent(phone)}`);
    }

    async getPrograms() {
        return await this.apiCall('/students/programs');
    }

    async getStudentStats() {
        return await this.apiCall('/students/stats');
    }

    // Contact API Methods
    async submitContact(contactData) {
        return await this.apiCall('/contact/submit', {
            method: 'POST',
            body: JSON.stringify(contactData)
        });
    }

    async getInquiryTypes() {
        return await this.apiCall('/contact/inquiry-types');
    }

    async getContactStats() {
        return await this.apiCall('/contact/stats');
    }

    // Health Check
    async healthCheck() {
        return await this.apiCall('/health');
    }
}

// Create global API instance
const api = new CollegeAPI();

// Form Handlers
class FormHandler {
    constructor() {
        this.initializeForms();
    }

    initializeForms() {
        // Initialize admission form
        const admissionForm = document.getElementById('admissionForm');
        if (admissionForm) {
            this.setupAdmissionForm(admissionForm);
        }

        // Initialize contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            this.setupContactForm(contactForm);
        }

        // Load programs dropdown
        this.loadPrograms();
        
        // Load inquiry types
        this.loadInquiryTypes();
    }

    async setupAdmissionForm(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            
            // Prevent multiple submissions
            if (submitBtn.disabled) {
                console.log('Form submission already in progress');
                return;
            }
            
            let data = null; // Declare data variable outside try block
            
            try {
                // Validate required fields
                const name = form.querySelector('input[name="name"]').value.trim();
                const phone = form.querySelector('input[name="phone"]').value.trim();
                const course = form.querySelector('select[name="course"]').value;
                
                // Clear any existing error messages
                this.clearAllErrors(form);
                
                let hasErrors = false;
                
                if (!name) {
                    this.showFieldError(form.querySelector('input[name="name"]'), 'Full Name is required');
                    hasErrors = true;
                }
                
                if (!phone) {
                    this.showFieldError(form.querySelector('input[name="phone"]'), 'Phone Number is required');
                    hasErrors = true;
                } else {
                    // Clean phone number for validation
                    const cleanedPhone = phone.replace(/\D/g, '');
                    if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
                        this.showFieldError(form.querySelector('input[name="phone"]'), 'Please enter a valid phone number (10-15 digits)');
                        hasErrors = true;
                    }
                }
                
                if (!course) {
                    this.showFieldError(form.querySelector('select[name="course"]'), 'Please select a course');
                    hasErrors = true;
                }
                
                
                
                if (hasErrors) {
                    return;
                }
                
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

                // Collect form data
                const formData = new FormData(form);
                
                // Clean and validate phone number
                const cleanPhone = (phone) => {
                    return phone.replace(/\D/g, ''); // Remove all non-digits
                };
                
                // Generate Application ID: ANC + Course Initials + Year + Last 5 Phone Digits
                const generateApplicationId = (course, phone) => {
                    // Course initials mapping
                    const courseInitials = {
                        'General Nursing': 'GNM',
                        'General Nursing & Midwifery': 'GNM',
                        'Bachelor in Nursing': 'BSN',
                        'Bachelor of Science in Nursing': 'BSN',
                        'Paramedical Nursing': 'PMN',
                        'Paramedical in Nursing': 'PMN',
                        'Medical Lab Technician': 'MLT',
                        'Cardiology Technician': 'CTN',
                        'Multipurpose Health Assistant': 'MHA'
                    };
                    
                    const courseCode = courseInitials[course] || 'GEN';
                    const year = new Date().getFullYear() + 1; // Next year for admission (2025)
                    const last5Digits = phone.slice(-5);
                    
                    return `ANC${courseCode}${year}${last5Digits}`;
                };
                
                const cleanedPhone = cleanPhone(formData.get('phone'));
                const selectedCourse = formData.get('course');
                const fullName = formData.get('name').trim();
                
                // Split full name into first and last name
                const nameParts = fullName.split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';
                
                data = {
                    firstName: firstName,
                    lastName: lastName,
                    email: formData.get('email') ? formData.get('email').trim() : '',
                    phone: cleanedPhone,
                    program: selectedCourse,
                    course: selectedCourse, // Keep for backwards compatibility
                    message: formData.get('message') ? formData.get('message').trim() : '',
                    applicationId: generateApplicationId(selectedCourse, cleanedPhone),
                    
                    // Required fields with default values
                    dateOfBirth: new Date(new Date().getFullYear() - 18, 0, 1).toISOString().split('T')[0], // 18 years ago
                    gender: 'Other', // Default gender, should be updated when we add gender field
                    admissionYear: new Date().getFullYear() + 1 // 2025
                };

                console.log('Submitting application data:', data);

                // Submit application
                const response = await api.submitApplication(data);

                // Show success message and application card
                this.showMessage('success', 'Application submitted successfully!');
                this.showApplicationCard(response.data);

                // Reset form
                form.reset();
                
                // Scroll to the success message
                setTimeout(() => {
                    const alertMessage = document.querySelector('.alert-success');
                    if (alertMessage) {
                        alertMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);

            } catch (error) {
                console.error('Application submission failed:', error);
                if (data) {
                    console.error('Submitted data:', data);
                }
                
                // Get phone number for duplicate error handling
                const phoneNumber = form.querySelector('input[name="phone"]')?.value || 'your phone number';
                
                // Handle specific error types
                let errorMessage = 'Failed to submit application. Please try again.';
                
                if (error.message.includes('Validation failed')) {
                    errorMessage = `
                        <div class="validation-error">
                            <h5><i class="fas fa-exclamation-triangle"></i> Validation Error</h5>
                            <p>Please check that all required information is provided correctly.</p>
                            <p><small>The system requires basic information to process your application. If this error persists, please contact our support team.</small></p>
                            <div class="error-actions">
                                <button class="btn btn-sm btn-secondary" onclick="contactSupport()">
                                    <i class="fas fa-phone"></i> Contact Support
                                </button>
                            </div>
                        </div>
                    `;
                } else if (error.message.includes('phone number already exists')) {
                    errorMessage = `
                        <div class="duplicate-error">
                            <h5><i class="fas fa-exclamation-triangle"></i> Phone Number Already Used</h5>
                            <p>This phone number is already used. Please use a different number.</p>
                            <div class="error-actions">
                                <button class="btn btn-sm btn-secondary" onclick="contactSupport()">
                                    <i class="fas fa-phone"></i> Contact Support
                                </button>
                            </div>
                        </div>
                    `;
                } else if (error.message.includes('email already exists')) {
                    errorMessage = `
                        <div class="duplicate-error">
                            <h5><i class="fas fa-exclamation-triangle"></i> Email Already Registered</h5>
                            <p>An application with this email address already exists in our system.</p>
                            <div class="error-actions">
                                <button class="btn btn-sm btn-info" onclick="showTrackingOption('${phoneNumber}')">
                                    <i class="fas fa-search"></i> Track Your Application
                                </button>
                                <button class="btn btn-sm btn-secondary" onclick="contactSupport()">
                                    <i class="fas fa-phone"></i> Contact Support
                                </button>
                            </div>
                        </div>
                    `;
                } else if (error.message.includes('network')) {
                    errorMessage = 'Network error. Please check your internet connection and try again.';
                }
                
                this.showMessage('error', errorMessage);
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });

        // Email validation
        const emailInput = form.querySelector('input[name="email"]');
        if (emailInput) {
            emailInput.addEventListener('blur', async (e) => {
                const email = e.target.value.trim();
                if (email) {
                    try {
                        const response = await api.checkEmailExists(email);
                        if (response.exists) {
                            this.showFieldError(emailInput, 'This email is already registered');
                        } else {
                            this.clearFieldError(emailInput);
                        }
                    } catch (error) {
                        console.error('Email check failed:', error);
                    }
                }
            });
        }

        // Phone validation
        const phoneInput = form.querySelector('input[name="phone"]');
        if (phoneInput) {
            phoneInput.addEventListener('blur', async (e) => {
                const phone = e.target.value.trim().replace(/\D/g, ''); // Clean phone number
                if (phone && phone.length >= 10) {
                    try {
                        const response = await api.checkPhoneExists(phone);
                        if (response.exists) {
                            this.showFieldError(phoneInput, 'This phone number is already used. Please use a different number.');
                        } else {
                            this.clearFieldError(phoneInput);
                        }
                    } catch (error) {
                        console.error('Phone check failed:', error);
                    }
                }
            });
        }
    }

    async setupContactForm(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                // Collect form data
                const formData = new FormData(form);
                const contactData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    subject: formData.get('subject'),
                    message: formData.get('message'),
                    inquiryType: formData.get('inquiryType') || 'General Inquiry',
                    programInterest: formData.get('programInterest') || 'Not Specified'
                };

                // Submit contact form
                const response = await api.submitContact(contactData);

                // Show success message
                this.showMessage('success', response.message);

                // Reset form
                form.reset();

            } catch (error) {
                console.error('Contact submission failed:', error);
                this.showMessage('error', error.message || 'Failed to send message. Please try again.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    async loadPrograms() {
        try {
            const response = await api.getPrograms();
            const programSelects = document.querySelectorAll('select[name="program"], select[name="programInterest"]');
            
            programSelects.forEach(select => {
                // Clear existing options except the first one
                const firstOption = select.querySelector('option');
                select.innerHTML = '';
                if (firstOption) {
                    select.appendChild(firstOption);
                }

                // Add program options
                response.data.forEach(program => {
                    const option = document.createElement('option');
                    option.value = program.name;
                    option.textContent = `${program.name} (${program.duration})`;
                    select.appendChild(option);
                });
            });
        } catch (error) {
            console.error('Failed to load programs:', error);
        }
    }

    async loadInquiryTypes() {
        try {
            const response = await api.getInquiryTypes();
            const inquirySelect = document.querySelector('select[name="inquiryType"]');
            
            if (inquirySelect) {
                // Clear existing options except the first one
                const firstOption = inquirySelect.querySelector('option');
                inquirySelect.innerHTML = '';
                if (firstOption) {
                    inquirySelect.appendChild(firstOption);
                }

                // Add inquiry type options
                response.data.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type.value;
                    option.textContent = type.label;
                    option.title = type.description;
                    inquirySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Failed to load inquiry types:', error);
        }
    }

    showApplicationCard(applicationData) {
        // Remove any existing messages or cards
        const existingMessages = document.querySelectorAll('.alert, .application-card');
        existingMessages.forEach(msg => msg.remove());

        // Format the application date properly
        const formatDate = (dateString) => {
            if (!dateString) return 'Not available';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (error) {
                return dateString;
            }
        };

        const cardDiv = document.createElement('div');
        cardDiv.className = 'application-card';
        cardDiv.innerHTML = `
            <div class="card shadow-lg border-0" style="max-width: 600px; margin: 20px auto;">
                <div class="card-header bg-success text-white text-center">
                    <h4 class="mb-0"><i class="fas fa-check-circle"></i> Application Submitted Successfully!</h4>
                </div>
                <div class="card-body">
                    <div class="text-center mb-4">
                        <div class="alert alert-info">
                            <strong>Application ID: ${applicationData.applicationId || 'Not available'}</strong><br>
                            <small class="text-muted">(Please save this ID for future reference)</small>
                        </div>
                    </div>
                    
                    <h5 class="card-title text-center mb-4">Application Details</h5>
                    
                    <div class="application-details-table">
                        <table class="table table-bordered">
                            <tbody>
                                <tr>
                                    <th style="width: 35%; background-color: #f8f9fa;">Full Name</th>
                                    <td>${applicationData.fullName || applicationData.name || 'Not provided'}</td>
                                </tr>
                                <tr>
                                    <th style="background-color: #f8f9fa;">Email Address</th>
                                    <td>${applicationData.email || 'Not provided'}</td>
                                </tr>
                                <tr>
                                    <th style="background-color: #f8f9fa;">Phone Number</th>
                                    <td>${applicationData.phone || 'Not provided'}</td>
                                </tr>
                                <tr>
                                    <th style="background-color: #f8f9fa;">Course Applied</th>
                                    <td>${applicationData.program || applicationData.course || 'Not provided'}</td>
                                </tr>
                                <tr>
                                    <th style="background-color: #f8f9fa;">Submission Date</th>
                                    <td>${formatDate(applicationData.applicationDate || applicationData.submissionDate)}</td>
                                </tr>
                                <tr>
                                    <th style="background-color: #f8f9fa;">Application Status</th>
                                    <td><span class="badge bg-primary">${applicationData.applicationStatus || 'Pending'}</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="text-center mt-4">
                        <button type="button" class="btn btn-primary me-2" onclick="printApplicationCard()">
                            <i class="fas fa-print"></i> Print Details
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closeApplicationCard()">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                    
                    <div class="alert alert-warning mt-4">
                        <i class="fas fa-info-circle"></i>
                        <strong>Important:</strong> Our admissions team will contact you within 24-48 hours. Please keep your Application ID safe for future reference.
                    </div>
                </div>
            </div>
        `;
        
        const form = document.getElementById('admissionForm');
        form.parentNode.insertBefore(cardDiv, form);
        
        // Scroll to the card
        setTimeout(() => {
            cardDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    showMessage(type, message) {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.alert');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'error'}`;
        messageDiv.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        const form = document.getElementById('admissionForm');
        form.parentNode.insertBefore(messageDiv, form);
        
        // Remove message after 8 seconds for success (to give time to copy ID)
        // and 5 seconds for error
        setTimeout(() => {
            messageDiv.remove();
        }, type === 'success' ? 8000 : 5000);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-danger small mt-1';
        errorDiv.textContent = message;
        
        field.classList.add('is-invalid');
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    clearAllErrors(form) {
        // Remove all error styling
        const errorFields = form.querySelectorAll('.is-invalid');
        errorFields.forEach(field => field.classList.remove('is-invalid'));
        
        // Remove all error messages
        const errorMessages = form.querySelectorAll('.field-error');
        errorMessages.forEach(msg => msg.remove());
    }
}

// Statistics Display
class StatsDisplay {
    constructor() {
        this.loadStats();
    }

    async loadStats() {
        try {
            // Load student stats
            const studentStats = await api.getStudentStats();
            this.updateStudentStats(studentStats.data);

            // Load contact stats
            const contactStats = await api.getContactStats();
            this.updateContactStats(contactStats.data);

        } catch (error) {
            console.error('Failed to load statistics:', error);
        }
    }

    updateStudentStats(data) {
        // Update student count in about section
        const studentCountElement = document.querySelector('.stat-number[data-stat="students"]');
        if (studentCountElement && data.overview) {
            this.animateCounter(studentCountElement, data.overview.approvedStudents || 0);
        }

        // Update applications count
        const applicationsElement = document.querySelector('.stat-number[data-stat="applications"]');
        if (applicationsElement && data.overview) {
            this.animateCounter(applicationsElement, data.overview.totalApplications || 0);
        }
    }

    updateContactStats(data) {
        // Update contact stats if needed
        const contactCountElement = document.querySelector('.stat-number[data-stat="contacts"]');
        if (contactCountElement && data.overview) {
            this.animateCounter(contactCountElement, data.overview.totalContacts || 0);
        }
    }

    animateCounter(element, targetValue) {
        const startValue = 0;
        const duration = 1000; // 1 second (faster)
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            element.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }
}

// Application Status Checker
class ApplicationTracker {
    constructor() {
        this.setupTracker();
    }

    setupTracker() {
        // Check if there's a stored application ID
        const applicationId = localStorage.getItem('applicationId');
        if (applicationId) {
            this.showTrackingOption(applicationId);
        }

        // Setup tracking form if exists
        const trackingForm = document.getElementById('trackingForm');
        if (trackingForm) {
            this.setupTrackingForm(trackingForm);
        }
    }

    showTrackingOption(applicationId) {
        // Create tracking notification
        const trackingDiv = document.createElement('div');
        trackingDiv.className = 'application-tracker alert alert-info';
        trackingDiv.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Track Your Application:</strong> Application ID: ${applicationId}
                </div>
                <button class="btn btn-sm btn-primary" onclick="applicationTracker.checkStatus('${applicationId}')">
                    Check Status
                </button>
            </div>
        `;

        // Insert after header
        const header = document.querySelector('.header');
        if (header && header.nextSibling) {
            header.parentNode.insertBefore(trackingDiv, header.nextSibling);
        }
    }

    setupTrackingForm(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const applicationId = form.querySelector('input[name="applicationId"]').value.trim();
            if (applicationId) {
                await this.checkStatus(applicationId);
            }
        });
    }

    async checkStatus(applicationId) {
        try {
            const response = await api.getApplicationStatus(applicationId);
            this.displayStatus(response.data);
        } catch (error) {
            console.error('Failed to check application status:', error);
            
            // Provide specific messages based on Application ID format
            if (applicationId.startsWith('ANC')) {
                formHandler.showMessage('error', `Application ID ${applicationId} not found. Please verify the format (e.g., ANCGNM202556789).`);
            } else if (/^\d+$/.test(applicationId)) {
                formHandler.showMessage('error', 'Phone number-based tracking is deprecated. Please use your Application ID starting with ANC.');
            } else {
                formHandler.showMessage('error', 'Invalid Application ID format. Use format: ANCXXX202XXXXX');
            }
        }
    }

    displayStatus(data) {
        const statusModal = this.createStatusModal(data);
        document.body.appendChild(statusModal);
        
        // Show modal (assuming Bootstrap is available)
        if (window.bootstrap) {
            const modal = new bootstrap.Modal(statusModal);
            modal.show();
        }
    }

    createStatusModal(data) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Application Status</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <strong>Name:</strong> ${data.fullName}
                            </div>
                            <div class="col-md-6">
                                <strong>Email:</strong> ${data.email}
                            </div>
                            <div class="col-md-6">
                                <strong>Program:</strong> ${data.program}
                            </div>
                            <div class="col-md-6">
                                <strong>Status:</strong> 
                                <span class="badge bg-${this.getStatusColor(data.applicationStatus)}">
                                    ${data.applicationStatus}
                                </span>
                            </div>
                            <div class="col-md-6">
                                <strong>Applied:</strong> ${new Date(data.applicationDate).toLocaleDateString()}
                            </div>
                            <div class="col-md-6">
                                <strong>Admission Year:</strong> ${data.admissionYear}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    getStatusColor(status) {
        const colors = {
            'Pending': 'warning',
            'Under Review': 'info',
            'Approved': 'success',
            'Rejected': 'danger',
            'Waitlisted': 'secondary'
        };
        return colors[status] || 'secondary';
    }
}

// Print application card function
function printApplicationCard() {
    try {
        const applicationCard = document.querySelector('.application-card');
        if (!applicationCard) {
            alert('No application details found to print.');
            return;
        }
        
        // Get the application data from the card
        const table = applicationCard.querySelector('table');
        const rows = table.querySelectorAll('tbody tr');
        const applicationId = applicationCard.querySelector('.alert-info strong').textContent.replace('Application ID: ', '');
        
        const applicationData = {
            applicationId: applicationId,
            name: rows[0].querySelector('td').textContent,
            email: rows[1].querySelector('td').textContent,
            phone: rows[2].querySelector('td').textContent,
            course: rows[3].querySelector('td').textContent,
            submissionDate: rows[4].querySelector('td').textContent
        };
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Application Details - American College of Nursing</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        line-height: 1.6;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #2c5aa0;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: #2c5aa0;
                        margin-bottom: 10px;
                    }
                    .college-name {
                        font-size: 20px;
                        color: #333;
                        margin-bottom: 5px;
                    }
                    .address {
                        font-size: 14px;
                        color: #666;
                    }
                    .application-title {
                        text-align: center;
                        font-size: 22px;
                        font-weight: bold;
                        color: #2c5aa0;
                        margin: 30px 0;
                        text-transform: uppercase;
                    }
                    .details-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .details-table th,
                    .details-table td {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: left;
                    }
                    .details-table th {
                        background-color: #f8f9fa;
                        font-weight: bold;
                        color: #2c5aa0;
                        width: 30%;
                    }
                    .application-id {
                        background-color: #e3f2fd;
                        font-weight: bold;
                        font-size: 16px;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        text-align: center;
                        font-size: 12px;
                        color: #666;
                    }
                    .important-note {
                        background-color: #fff3cd;
                        border: 1px solid #ffeaa7;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 5px;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">🏥 ACN</div>
                    <div class="college-name">American College of Nursing</div>
                    <div class="address">
                        Balaji Villas, Kalyana Durgam Road<br>
                        Anantapur, Andhra Pradesh 515004<br>
                        Phone: +91 70133 70612, +91 99899 53273<br>
                        Email: Americancollegeatp@gmail.com
                    </div>
                </div>
                
                <div class="application-title">Admission Application Receipt</div>
                
                <table class="details-table">
                    <tr>
                        <th>Application ID</th>
                        <td class="application-id">${applicationData.applicationId}</td>
                    </tr>
                    <tr>
                        <th>Full Name</th>
                        <td>${applicationData.name}</td>
                    </tr>
                    <tr>
                        <th>Email Address</th>
                        <td>${applicationData.email}</td>
                    </tr>
                    <tr>
                        <th>Phone Number</th>
                        <td>${applicationData.phone}</td>
                    </tr>
                    <tr>
                        <th>Course Applied</th>
                        <td>${applicationData.course}</td>
                    </tr>
                    <tr>
                        <th>Submission Date</th>
                        <td>${applicationData.submissionDate}</td>
                    </tr>
                </table>
                
                <div class="important-note">
                    <strong>Important:</strong> Please keep this receipt for your records. Your Application ID is required for tracking your application status. Our admissions team will contact you within 24-48 hours.
                </div>
                
                <div class="footer">
                    <p>This is a computer-generated receipt. No signature required.</p>
                    <p>© 2024 American College of Nursing. All rights reserved.</p>
                    <p>Printed on: ${new Date().toLocaleString('en-IN')}</p>
                </div>
                
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        
    } catch (error) {
        console.error('Error printing application details:', error);
        alert('Error preparing print document. Please try again.');
    }
}

// Close application card function
function closeApplicationCard() {
    const applicationCard = document.querySelector('.application-card');
    if (applicationCard) {
        applicationCard.remove();
    }
}

// Support functions for error handling
function showTrackingOption(applicationId) {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.alert');
    existingMessages.forEach(msg => msg.remove());
    
    // Create tracking form
    const trackingDiv = document.createElement('div');
    trackingDiv.className = 'alert alert-info tracking-form';
    trackingDiv.innerHTML = `
        <h5><i class="fas fa-search"></i> Track Your Application</h5>
        <p>Enter your application ID (phone number) to check the status:</p>
        <div class="input-group mb-3">
            <input type="tel" class="form-control" id="trackApplicationId" placeholder="Enter your phone number" value="${applicationId}">
            <button class="btn btn-primary" onclick="trackApplication()">
                <i class="fas fa-search"></i> Track
            </button>
        </div>
    `;
    
    // Insert after the form
    const form = document.getElementById('admissionForm');
    if (form) {
        form.parentNode.insertBefore(trackingDiv, form.nextSibling);
    }
}

function contactSupport() {
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Pre-fill contact form with support inquiry
    setTimeout(() => {
        const inquirySelect = document.querySelector('select[name="inquiry"]');
        const messageField = document.querySelector('#contact-message');
        
        if (inquirySelect) {
            inquirySelect.value = 'other';
        }
        
        if (messageField) {
            messageField.value = 'I need assistance with my application submission. I received an error that my phone number already exists in the system.';
            messageField.focus();
        }
    }, 1000);
}

async function trackApplication() {
    const applicationId = document.getElementById('trackApplicationId').value.trim();
    if (!applicationId) {
        alert('Please enter your application ID (phone number)');
        return;
    }
    
    try {
        const tracker = new ApplicationTracker();
        await tracker.checkStatus(applicationId);
    } catch (error) {
        console.error('Failed to track application:', error);
        alert('Failed to track application. Please contact support.');
    }
}

// Testimonial Slider Class
class TestimonialSlider {
    constructor() {
        this.currentIndex = 0;
        this.testimonials = [];
        this.slider = null;
        this.dots = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        this.slider = document.querySelector('.testimonials-slider');
        if (!this.slider) return;
        
        this.testimonials = Array.from(this.slider.querySelectorAll('.testimonial-card'));
        this.prevBtn = document.getElementById('prevTestimonial');
        this.nextBtn = document.getElementById('nextTestimonial');
        this.dotsContainer = document.getElementById('testimonialDots');
        
        if (this.testimonials.length === 0) return;
        
        this.createDots();
        this.setupEventListeners();
        this.showTestimonial(0);
        this.startAutoPlay();
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        this.testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'testimonial-dot';
            dot.addEventListener('click', () => this.goToTestimonial(index));
            this.dotsContainer.appendChild(dot);
        });
        
        this.dots = Array.from(this.dotsContainer.querySelectorAll('.testimonial-dot'));
    }
    
    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousTestimonial());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextTestimonial());
        }
        
        // Pause autoplay on hover
        if (this.slider) {
            this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousTestimonial();
            if (e.key === 'ArrowRight') this.nextTestimonial();
        });
    }
    
    showTestimonial(index) {
        // Remove active class from all testimonials
        this.testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Remove active class from all dots
        if (this.dots) {
            this.dots.forEach(dot => {
                dot.classList.remove('active');
            });
        }
        
        // Show current testimonial
        if (this.testimonials[index]) {
            this.testimonials[index].classList.add('active');
        }
        
        // Highlight current dot
        if (this.dots && this.dots[index]) {
            this.dots[index].classList.add('active');
        }
        
        // Update button states
        this.updateButtonStates();
        
        this.currentIndex = index;
    }
    
    updateButtonStates() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.testimonials.length - 1;
        }
    }
    
    nextTestimonial() {
        const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.goToTestimonial(nextIndex);
    }
    
    previousTestimonial() {
        const prevIndex = this.currentIndex === 0 ? this.testimonials.length - 1 : this.currentIndex - 1;
        this.goToTestimonial(prevIndex);
    }
    
    goToTestimonial(index) {
        if (index >= 0 && index < this.testimonials.length) {
            this.showTestimonial(index);
            this.restartAutoPlay();
        }
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextTestimonial();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    restartAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize form handlers
    const formHandler = new FormHandler();
    
    // Initialize stats display
    const statsDisplay = new StatsDisplay();
    
    // Initialize application tracker
    const applicationTracker = new ApplicationTracker();
    
    // Initialize testimonial slider
    const testimonialSlider = new TestimonialSlider();

    // Health check
    api.healthCheck().then(response => {
        console.log('API Health Check:', response.message);
    }).catch(error => {
        console.error('API Health Check Failed:', error);
    });
});

// Export for global access
window.api = api; 