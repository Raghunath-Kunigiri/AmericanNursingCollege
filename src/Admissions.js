import React, { useState } from "react";
import { motion } from "framer-motion";
import { Application } from "./entities/Application";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { CheckCircle, FileText, Users, Calendar, Phone, Mail, MapPin } from "lucide-react";

const programs = [
  { value: "general_nursing_midwifery", label: "General Nursing & Midwifery (GNM)" },
  { value: "bachelor_nursing", label: "Bachelor of Science in Nursing (BSN)" },
  { value: "paramedical_nursing", label: "Paramedical in Nursing" },
  { value: "medical_lab_technician", label: "Medical Lab Technician" },
  { value: "cardiology_technician", label: "Cardiology Technician" },
  { value: "multipurpose_health_assistant", label: "Multipurpose Health Assistant" }
];

const steps = [
  { number: 1, title: "Submit Application", description: "Fill out the online application form with your details" },
  { number: 2, title: "Document Review", description: "Our admissions team reviews your application and documents" },
  { number: 3, title: "Interview", description: "Attend a personal interview with our faculty members" },
  { number: 4, title: "Admission Decision", description: "Receive your admission decision within 7-10 business days" }
];

export default function Admissions() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",
    program: "",
    education_level: "",
    previous_institution: "",
    gpa: "",
    motivation: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format data to match the API schema
      const applicationData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        program: formData.program,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
        emergency_contact: {
          name: "Not provided",
          phone: "Not provided", 
          relationship: "Not provided"
        },
        education: {
          highest_qualification: formData.education_level || "Not specified",
          institution: formData.previous_institution || "Not specified",
          year_completed: new Date().getFullYear(), // Default to current year
          percentage: formData.gpa ? parseFloat(formData.gpa) : 0
        },
        documents: {
          id_proof: "",
          education_certificates: "",
          medical_certificate: ""
        },
        notes: formData.motivation || ""
      };

      const result = await Application.create(applicationData);
      
      if (result.success) {
        setApplicationId(result.id);
        setIsSubmitted(true);
      } else {
        console.error("Application creation failed:", result.error);
        alert("Failed to submit application: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in American College of Nursing. Your application has been successfully submitted.
          </p>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Your Application ID</p>
            <p className="text-lg font-bold text-blue-600">{applicationId}</p>
          </div>
          <p className="text-sm text-gray-500">
            You will receive an email confirmation shortly. Our admissions team will contact you within 3-5 business days.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Admissions
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Take the first step towards your healthcare career. Apply now for our comprehensive nursing programs.
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
            >
              <Card className="shadow-2xl border-0">
                <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-3 text-white">
                    <FileText className="w-6 h-6 text-white" />
                    Application Form
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                        <Input
                          id="date_of_birth"
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    {/* Program Selection */}
                    <div>
                      <Label htmlFor="program">Selected Program *</Label>
                      <Select onValueChange={(value) => handleInputChange('program', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose your program" />
                        </SelectTrigger>
                        <SelectContent>
                          {programs.map((program) => (
                            <SelectItem key={program.value} value={program.value}>
                              {program.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Educational Background */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="education_level">Highest Education Level</Label>
                        <Select onValueChange={(value) => handleInputChange('education_level', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high_school">High School</SelectItem>
                            <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                            <SelectItem value="master">Master's Degree</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="gpa">GPA / Percentage</Label>
                        <Input
                          id="gpa"
                          type="number"
                          step="0.01"
                          value={formData.gpa}
                          onChange={(e) => handleInputChange('gpa', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="previous_institution">Previous Institution</Label>
                      <Input
                        id="previous_institution"
                        value={formData.previous_institution}
                        onChange={(e) => handleInputChange('previous_institution', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="motivation">Why do you want to join this program?</Label>
                      <Textarea
                        id="motivation"
                        value={formData.motivation}
                        onChange={(e) => handleInputChange('motivation', e.target.value)}
                        className="mt-1"
                        rows={4}
                        placeholder="Tell us about your motivation and career goals..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg font-semibold"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Admission Process */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Admission Process
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    Need Help?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">admissions@acn.edu</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">123 Healthcare Drive</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Mon-Fri: 9AM-5PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}