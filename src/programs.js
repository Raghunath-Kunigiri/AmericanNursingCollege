import React from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Clock, Users, Award, BookOpen, Stethoscope, Heart, ArrowLeft, Check, Calendar, UserCheck } from "lucide-react";

const programs = [
  {
    title: "General Nursing & Midwifery",
    code: "GNM",
    duration: "3.5 Years",
    intake: "60 Students",
    description: "Comprehensive program covering all aspects of nursing and midwifery care with extensive clinical rotations in hospitals and community health centers.",
    features: [
      "Clinical Rotations in Top Hospitals",
      "Midwifery Training & Certification",
      "Community Health Practice",
      "Emergency Care Training",
      "Pharmacology & Drug Administration",
      "Patient Care & Communication"
    ],
    eligibility: "10+2 with Physics, Chemistry, Biology",
    career: ["Staff Nurse", "Midwife", "Community Health Nurse", "ICU Nurse"],
    image: "/images/programs/GNM.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
    color: "from-blue-500 to-blue-600",
    icon: Stethoscope
  },
  {
    title: "Bachelor of Science in Nursing",
    code: "BSN",
    duration: "4 Years",
    intake: "80 Students",
    description: "Advanced nursing degree focusing on leadership, research, and evidence-based practice. Prepares students for supervisory roles in healthcare.",
    features: [
      "Advanced Clinical Practice",
      "Nursing Research & Evidence-Based Care",
      "Healthcare Leadership & Management",
      "Critical Care Nursing",
      "Psychiatric & Mental Health Nursing",
      "Nursing Education & Training"
    ],
    eligibility: "10+2 with PCB or GNM graduates",
    career: ["Nurse Manager", "Clinical Specialist", "Nursing Supervisor", "Nurse Educator"],
    image: "/images/programs/BSN.jpeg",
    fallbackImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
    color: "from-blue-500 to-blue-600",
    icon: BookOpen
  },
  {
    title: "Paramedical in Nursing",
    code: "PMN",
    duration: "2 Years",
    intake: "40 Students",
    description: "Focused program for students interested in paramedical services and emergency care. Includes ambulance care and first aid certification.",
    features: [
      "Emergency Medical Services",
      "Ambulance Care & Transport",
      "First Aid & CPR Certification",
      "Trauma Care Management",
      "Medical Equipment Operation",
      "Pre-Hospital Care"
    ],
    eligibility: "10+2 with any stream",
    career: ["Paramedic", "Emergency Medical Technician", "Ambulance Technician", "First Aid Instructor"],
    image: "/images/programs/Paramedical in Nursing.jpeg",
    fallbackImage: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&h=400&fit=crop",
    color: "from-red-500 to-red-600",
    icon: Heart
  },
  {
    title: "Medical Lab Technician",
    code: "MLT",
    duration: "2 Years",
    intake: "35 Students",
    description: "Specialized program for laboratory diagnostics and medical testing. Hands-on training with modern diagnostic equipment and quality control procedures.",
    features: [
      "Clinical Laboratory Procedures",
      "Diagnostic Testing & Analysis",
      "Quality Control & Assurance",
      "Medical Equipment Operation",
      "Pathology & Microbiology",
      "Blood Banking & Transfusion"
    ],
    eligibility: "10+2 with Physics, Chemistry, Biology",
    career: ["Lab Technician", "Medical Technologist", "Pathology Assistant", "Research Technician"],
    image: "/images/programs/Medical Lab technician.jpeg",
    fallbackImage: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop",
    color: "from-blue-500 to-blue-600",
    icon: Award
  },
  {
    title: "Cardiology Technician",
    code: "CT",
    duration: "1.5 Years",
    intake: "25 Students",
    description: "Specialized program focusing on cardiac care and cardiovascular diagnostic procedures. Training in ECG, echocardiography, and cardiac monitoring.",
    features: [
      "ECG & EKG Interpretation",
      "Echocardiography Training",
      "Cardiac Monitoring Systems",
      "Stress Testing Procedures",
      "Cardiac Catheterization Assistance",
      "Patient Care in Cardiac Units"
    ],
    eligibility: "10+2 with PCB or equivalent",
    career: ["Cardiology Technician", "ECG Technician", "Cardiac Monitor Technician", "Cath Lab Technician"],
    image: "/images/programs/Cardiology Technician.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&h=400&fit=crop",
    color: "from-blue-500 to-blue-600",
    icon: Heart
  },
  {
    title: "Multipurpose Health Assistant",
    code: "MPHA",
    duration: "1 Year",
    intake: "30 Students",
    description: "Comprehensive program for community health workers. Focus on primary healthcare, health education, and basic medical assistance in rural and urban settings.",
    features: [
      "Primary Healthcare Delivery",
      "Health Education & Promotion",
      "Basic Medical Procedures",
      "Community Health Assessment",
      "Maternal & Child Health",
      "Immunization Programs"
    ],
    eligibility: "10+2 with any stream",
    career: ["Health Assistant", "Community Health Worker", "Medical Assistant", "Health Educator"],
    image: "/images/programs/anatomy_lab1.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=400&fit=crop",
    color: "from-blue-500 to-blue-600",
    icon: Users
  }
];

// Program URL mapping
const programRoutes = {
  'general-nursing-midwifery': 0,
  'bsc-nursing': 1,
  'paramedical-nursing': 2,
  'medical-lab-technician': 3,
  'cardiology-technician': 4,
  'multipurpose-health-assistant': 5
};

export default function Programs() {
  const { programId } = useParams();
  
  // If programId exists, show individual program page
  if (programId && programRoutes[programId] !== undefined) {
    const program = programs[programRoutes[programId]];
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Individual Program Hero */}
        <section className="pt-32 pb-20 bg-blue-600 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={program.image} 
              alt={program.title}
              className="w-full h-full object-cover opacity-20"
              onError={(e) => {
                if (program.fallbackImage) {
                  e.target.src = program.fallbackImage;
                }
              }}
            />
            <div className="absolute inset-0 bg-blue-600/80"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link 
                to="/programs" 
                className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to All Programs
              </Link>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <program.icon className="w-12 h-12 text-white" />
                </div>
                <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-lg font-bold">
                  {program.code}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {program.title}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl">
                {program.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Program Details */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Program Features */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Highlights</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {program.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Career Opportunities */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Career Opportunities</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {program.career.map((career, index) => (
                      <div key={index} className="bg-blue-50 rounded-lg p-4">
                        <span className="text-blue-700 font-medium">{career}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Apply Now CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-blue-600 rounded-2xl p-8 text-white text-center"
                >
                  <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                  <p className="text-blue-100 mb-6">
                    Join thousands of successful healthcare professionals who started their career with us.
                  </p>
                  <Link 
                    to="/admissions" 
                    className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                  >
                    Apply Now
                  </Link>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Quick Info */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Program Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-500">Duration</div>
                        <div className="font-medium">{program.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-500">Annual Intake</div>
                        <div className="font-medium">{program.intake}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-500">Eligibility</div>
                        <div className="font-medium text-sm">{program.eligibility}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Download Brochure */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
                >
                  <h3 className="text-lg font-bold mb-4">Download Program Brochure</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Get detailed information about curriculum, fees, and admission process.
                  </p>
                  <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                    Download PDF
                  </button>
                </motion.div>

                {/* Contact */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Need More Information?</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Speak with our admissions counselor for personalized guidance.
                  </p>
                  <Link 
                    to="/contact" 
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors block text-center"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Default programs listing page
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
              Nursing Programs
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Choose from our comprehensive range of nursing and healthcare programs designed to launch your career in healthcare excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {programs.map((program, index) => {
              const programSlug = Object.keys(programRoutes).find(key => programRoutes[key] === index);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={program.image} 
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        if (program.fallbackImage) {
                          e.target.src = program.fallbackImage;
                        }
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${program.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3">
                        <program.icon className="w-8 h-8 text-gray-700" />
                      </div>
                    </div>
                    <div className="absolute top-6 right-6">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                        {program.code}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {program.title}
                    </h3>
                    
                    <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{program.intake}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {program.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {program.features.slice(0, 3).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                        {program.features.length > 3 && (
                          <li className="text-sm text-blue-600 font-medium">
                            +{program.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex gap-4">
                      <Link
                        to={`/programs/${programSlug}`}
                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors text-center"
                      >
                        View Details
                      </Link>
                      <Link
                        to="/admissions"
                        className="flex-1 border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-xl font-medium hover:bg-blue-50 transition-colors text-center"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose Our Programs?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">100%</div>
                <p className="text-blue-100">Practical Training</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">98%</div>
                <p className="text-blue-100">Placement Success</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">36+</div>
                <p className="text-blue-100">Years Experience</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}