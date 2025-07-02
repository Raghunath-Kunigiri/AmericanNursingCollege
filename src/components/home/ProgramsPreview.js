import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


import { Button } from "../ui/button";
import { Clock, Users, Award, ArrowRight, Eye, FileText, X } from "lucide-react";

const programs = [
  {
    title: "General Nursing & Midwifery",
    code: "GNM",
    duration: "3.5 years",
    students: "120+ enrolled",
    description: "Comprehensive program covering all aspects of nursing and midwifery care with hands-on clinical experience.",
    features: ["Clinical Rotations", "Midwifery Training", "Community Health"],
    image: "/images/programs/GNM.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Bachelor of Science in Nursing",
    code: "BSN",
    duration: "4 years",
    students: "200+ enrolled",
    description: "Advanced nursing degree with focus on leadership, research, and evidence-based practice.",
    features: ["Research Methods", "Leadership", "Advanced Clinical"],
    image: "/images/programs/BSN.jpeg",
    fallbackImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=300&fit=crop",
    color: "from-green-500 to-green-600"
  },
  {
    title: "Medical Lab Technician",
    code: "MLT",
    duration: "2 years",
    students: "80+ enrolled",
    description: "Specialized program for laboratory diagnostics and medical testing procedures.",
    features: ["Lab Diagnostics", "Quality Control", "Modern Equipment"],
    image: "/images/programs/Medical Lab technician.jpeg",
    fallbackImage: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500&h=300&fit=crop",
    color: "from-purple-500 to-purple-600"
  }
];

export default function ProgramsPreview() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProgram(null);
    setIsModalOpen(false);
  };
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Featured
            <span className="text-blue-600"> Programs</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive range of nursing and healthcare programs designed to launch your career in healthcare.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
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
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {program.code}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {program.title}
                </h3>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{program.students}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {program.description}
                </p>

                <div className="space-y-2 mb-6">
                  {program.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">Accredited</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-300"
                    onClick={() => openModal(program)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link to="/programs">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              View All Programs
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>

        {/* Course Details Modal */}
        {isModalOpen && selectedProgram && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProgram.title}</h3>
                  <p className="text-blue-600 font-semibold">{selectedProgram.code}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Program Image */}
                <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                  <img 
                    src={selectedProgram.image} 
                    alt={selectedProgram.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (selectedProgram.fallbackImage) {
                        e.target.src = selectedProgram.fallbackImage;
                      }
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${selectedProgram.color} opacity-20`}></div>
                </div>

                {/* Program Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Program Overview</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedProgram.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="text-sm text-gray-600">Duration</span>
                        <p className="font-semibold text-gray-900">{selectedProgram.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="text-sm text-gray-600">Students</span>
                        <p className="font-semibold text-gray-900">{selectedProgram.students}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h4>
                    <div className="grid gap-2">
                      {selectedProgram.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Syllabus Section - Placeholder for future PDF */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Course Syllabus</h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">Course syllabus PDF will be available here</p>
                      <p className="text-sm text-gray-500">PDF document coming soon</p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <Link to="/admissions" className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 font-semibold rounded-lg transition-all duration-300">
                      Apply Now
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 font-semibold rounded-lg transition-all duration-300"
                    onClick={closeModal}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}