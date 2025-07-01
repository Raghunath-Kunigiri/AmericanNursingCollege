import React from "react";
import { motion } from "framer-motion";
import { Home, Utensils, Bus, Gamepad2, Shield, Users } from "lucide-react";

const facilities = [
  {
    icon: Home,
    title: "On-Campus Hostel",
    description: "Modern dormitory facilities with comfortable rooms and study areas",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    icon: Utensils,
    title: "Dining Facilities",
    description: "Nutritious meals prepared by professional chefs in hygienic conditions",
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    icon: Bus,
    title: "Transportation",
    description: "Safe and reliable transport services for clinical rotations and field visits",
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    icon: Gamepad2,
    title: "Sports & Recreation",
    description: "Well-equipped gymnasium and recreational facilities for student wellness",
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description: "Round-the-clock security with CCTV surveillance for student safety",
    color: "text-red-600",
    bgColor: "bg-red-100"
  },
  {
    icon: Users,
    title: "Expert Faculty",
    description: "Experienced nursing professionals with advanced degrees and certifications",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100"
  }
];

export default function FacilitiesPreview() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            World-Class
            <span className="text-blue-600"> Facilities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our state-of-the-art campus provides everything students need for a comprehensive and comfortable learning experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${facility.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <facility.icon className={`w-8 h-8 ${facility.color}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {facility.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {facility.description}
              </p>

              {/* Decorative Elements */}
                      <div className="absolute top-4 right-4 w-20 h-20 bg-blue-100 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 bg-blue-100 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
            </motion.div>
          ))}
        </div>

        {/* Campus Tour CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 bg-blue-600 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Our Campus?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Schedule a personalized campus tour and see our world-class facilities firsthand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Schedule Campus Tour
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Download Brochure
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}