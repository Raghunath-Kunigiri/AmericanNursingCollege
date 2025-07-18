import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Contact <span className="text-blue-600">Information</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get in touch with American Nursing College - we're here to help you start your healthcare journey
          </p>
        </motion.div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-16 sm:mb-20">
          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-2 xl:col-span-1"
          >
            <Card className="shadow-lg h-full hover:shadow-xl transition-all duration-300 border-0">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Our Address</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-6 pb-8">
                <div className="space-y-3">
                  <p className="text-gray-700 font-semibold text-lg">Main Campus</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed font-medium">
                      Balaji villas, Kalyana Durgam ROAD<br />
                      Anantapur, Andhra Pradesh 515004<br />
                      India
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="shadow-lg h-full hover:shadow-xl transition-all duration-300 border-0">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Phone Number</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-6 pb-8">
                <div className="space-y-3">
                  <p className="text-gray-700 font-semibold text-lg">Call Us</p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <a 
                      href="tel:+919989953273" 
                      className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors duration-200 block"
                    >
                      +91 9989953273
                    </a>
                    <p className="text-gray-600 text-sm mt-2">Available during office hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="shadow-lg h-full hover:shadow-xl transition-all duration-300 border-0">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-10 h-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Email Address</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-6 pb-8">
                <div className="space-y-3">
                  <p className="text-gray-700 font-semibold text-lg">Send us an Email</p>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <a 
                      href="mailto:Americancollegeatp@gmail.com" 
                      className="text-lg font-bold text-purple-600 hover:text-purple-700 transition-colors duration-200 break-all block"
                    >
                      Americancollegeatp@gmail.com
                    </a>
                    <p className="text-gray-600 text-sm mt-2">We'll respond within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Call-to-Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Card className="shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 overflow-hidden">
            <CardContent className="py-12 px-6 sm:px-8">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Start Your Nursing Career?</h3>
              <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Contact us today to learn more about our nursing programs and how we can help you achieve your healthcare career goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <a 
                  href="tel:+919989953273" 
                  className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 text-center"
                >
                  📞 Call Now
                </a>
                <a 
                  href="mailto:Americancollegeatp@gmail.com" 
                  className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 text-center"
                >
                  ✉️ Send Email
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}