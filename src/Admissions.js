import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, FileText, Users, Calendar, Phone, Mail, User, GraduationCap, School, Heart, ExternalLink } from "lucide-react";

const programs = [
  { value: "general_nursing_midwifery", label: "General Nursing & Midwifery (GNM)", duration: "3.5 Years" },
  { value: "bachelor_nursing", label: "Bachelor of Science in Nursing (BSN)", duration: "4 Years" },
  { value: "paramedical_nursing", label: "Paramedical in Nursing (PMN)", duration: "2 Years" },
  { value: "medical_lab_technician", label: "Medical Lab Technician (MLT)", duration: "2 Years" },
  { value: "cardiology_technician", label: "Cardiology Technician (CT)", duration: "1.5 Years" },
  { value: "multipurpose_health_assistant", label: "Multipurpose Health Assistant (MPHA)", duration: "1 Year" }
];

const educationLevels = [
  { value: "10th_grade", label: "10th Grade/Secondary School" },
  { value: "12th_grade", label: "12th Grade/Higher Secondary (PCB)" },
  { value: "12th_grade_other", label: "12th Grade/Higher Secondary (Other Stream)" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "other", label: "Other" }
];

const steps = [
  { number: 1, title: "Submit Application", description: "Fill out the online application form with your details" },
  { number: 2, title: "Document Review", description: "Our admissions team reviews your application and documents" },
  { number: 3, title: "Interview", description: "Attend a personal interview with our faculty members" },
  { number: 4, title: "Admission Decision", description: "Receive your admission decision within 7-10 business days" }
];

export default function Admissions() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    selectedProgram: "",
    highestEducationLevel: "",
    gpa: "",
    previousInstitution: "",
    whyJoinProgram: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.selectedProgram) newErrors.selectedProgram = "Please select a program";
    if (!formData.whyJoinProgram.trim()) newErrors.whyJoinProgram = "Please tell us why you want to join";
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitToGoogleSheets = async (data) => {
    // Google Sheets Web App URL from environment variables
    const GOOGLE_SHEETS_URL = process.env.REACT_APP_GOOGLE_SHEETS_URL;
    
    // Validate environment variables
    if (!GOOGLE_SHEETS_URL) {
      throw new Error('Google Sheets URL not configured. Please check your environment variables.');
    }
    
    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      // Note: no-cors mode doesn't allow reading the response
      return { success: true };
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      return { success: false, error: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Generate admission ID (consistent with Google Sheets format)
    const prefix = process.env.REACT_APP_APPLICATION_PREFIX || 'ACN';
    const admissionId = `${prefix}${Date.now()}`;
    
    try {
      // Prepare data for Google Sheets (matching your sheet columns)
      const submissionData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dateOfBirth,
        address: formData.address,
        selectedProgram: programs.find(p => p.value === formData.selectedProgram)?.label || formData.selectedProgram,
        highestEducationLevel: educationLevels.find(e => e.value === formData.highestEducationLevel)?.label || formData.highestEducationLevel,
        gpa: formData.gpa,
        previousInstitution: formData.previousInstitution,
        whyJoinProgram: formData.whyJoinProgram,
        submissionDate: new Date().toISOString(),
        timestamp: new Date().toLocaleString()
      };
      
      // Add admission ID to submission data
      const finalSubmissionData = {
        ...submissionData,
        admissionId: admissionId
      };

      // Development logging (removed in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('Sending to Google Sheets:', finalSubmissionData);
        console.log('Admission ID being sent:', admissionId);
      }

      // Try to submit to Google Sheets
      const result = await submitToGoogleSheets(finalSubmissionData);
      
      if (result.success) {
        setApplicationId(admissionId);
        setIsSubmitted(true);
        
        // Also save locally as backup
        const savedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
        savedApplications.push({ ...finalSubmissionData, applicationId: admissionId });
        localStorage.setItem('applications', JSON.stringify(savedApplications));
      } else {
        throw new Error('Failed to submit to Google Sheets');
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      
      // Fallback: Save to localStorage with same admission ID
      const localApplication = {
        ...formData,
        applicationId: admissionId,
        submissionDate: new Date().toISOString(),
        status: 'pending'
      };
      
      const savedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      savedApplications.push(localApplication);
      localStorage.setItem('applications', JSON.stringify(savedApplications));
      
      setApplicationId(admissionId);
      setIsSubmitted(true);
    }
    
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in American College of Nursing. Your application has been successfully submitted.
          </p>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Your Application ID</p>
            <p className="text-lg font-bold text-blue-600">{applicationId}</p>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            You will receive an email confirmation shortly. Our admissions team will contact you within 3-5 business days.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Submit Another Application
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join Our Nursing Programs
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Take the first step towards a rewarding healthcare career. Apply now for our comprehensive nursing programs.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Form Header */}
              <div className="bg-blue-600 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FileText className="w-6 h-6" />
                  Student Application Form
                </h2>
                <p className="text-blue-100 mt-2">Please fill out all required fields marked with *</p>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="10-digit phone number"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Complete Address
                    </label>
                    <textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your complete address with city, state, and PIN code"
                    />
                  </div>
                </div>

                {/* Program Selection Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Program Selection</h3>
                  </div>
                  
                  <div>
                    <label htmlFor="selectedProgram" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Program *
                    </label>
                    <select
                      id="selectedProgram"
                      value={formData.selectedProgram}
                      onChange={(e) => handleInputChange('selectedProgram', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.selectedProgram ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Choose your preferred program</option>
                      {programs.map((program) => (
                        <option key={program.value} value={program.value}>
                          {program.label} - {program.duration}
                        </option>
                      ))}
                    </select>
                    {errors.selectedProgram && <p className="text-red-500 text-sm mt-1">{errors.selectedProgram}</p>}
                  </div>
                </div>

                {/* Educational Background Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <School className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Educational Background</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="highestEducationLevel" className="block text-sm font-medium text-gray-700 mb-2">
                        Highest Education Level
                      </label>
                      <select
                        id="highestEducationLevel"
                        value={formData.highestEducationLevel}
                        onChange={(e) => handleInputChange('highestEducationLevel', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select your education level</option>
                        {educationLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="gpa" className="block text-sm font-medium text-gray-700 mb-2">
                        GPA / Percentage
                      </label>
                      <input
                        type="text"
                        id="gpa"
                        value={formData.gpa}
                        onChange={(e) => handleInputChange('gpa', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., 3.8 or 85%"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="previousInstitution" className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Institution
                    </label>
                    <input
                      type="text"
                      id="previousInstitution"
                      value={formData.previousInstitution}
                      onChange={(e) => handleInputChange('previousInstitution', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Name of your previous school/college"
                    />
                  </div>
                </div>

                {/* Motivation Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Tell Us About Yourself</h3>
                  </div>
                  
                  <div>
                    <label htmlFor="whyJoinProgram" className="block text-sm font-medium text-gray-700 mb-2">
                      Why do you want to join this program? *
                    </label>
                    <textarea
                      id="whyJoinProgram"
                      value={formData.whyJoinProgram}
                      onChange={(e) => handleInputChange('whyJoinProgram', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.whyJoinProgram ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Tell us about your motivation, career goals, and why you chose nursing..."
                    />
                    {errors.whyJoinProgram && <p className="text-red-500 text-sm mt-1">{errors.whyJoinProgram}</p>}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        Submit Application
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-sm text-gray-500 mt-3">
                    By submitting this form, you agree to our terms and conditions
                  </p>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Google Sheets Integration Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-green-600" />
                Application Tracking
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                All applications are automatically saved to our secure database and Google Sheets for easy tracking and review.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  ✓ Automatic data backup<br/>
                  ✓ Real-time application tracking<br/>
                  ✓ Instant confirmation email
                </p>
              </div>
            </motion.div>

            {/* Admission Process */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Admission Process
              </h3>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                Need Help?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">+91 7013370612</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Americancollegeatp@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Mon-Fri: 9AM-5PM</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Our admissions counselors are available to help you with any questions about the application process.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}