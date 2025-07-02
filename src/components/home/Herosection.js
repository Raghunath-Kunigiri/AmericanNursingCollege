import React from "react";
import { Button } from "../ui/button";

import { ArrowRight, Play, Star, Users, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-blue-900/80 z-10"></div>
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/Video1.mp4" type="video/mp4" />
          {/* Fallback for when custom video is not available */}
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            American College
            <br />
            <span className="text-blue-400">
              of Nursing
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Empowering the next generation of healthcare professionals with comprehensive nursing education, 
            state-of-the-art facilities, and 99% placement success rate.
          </motion.p>

                     {/* Established Badge */}
           <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2, duration: 0.6 }}
             className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6"
           >
             <Award className="w-5 h-5 text-yellow-400" />
             <span className="text-white font-medium">Established 1987 • 36+ Years of Excellence</span>
           </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            <div className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold">3,240+</span>
              <span className="text-gray-300">Alumni</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Star className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold">99%</span>
              <span className="text-gray-300">Placement</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold">25+</span>
              <span className="text-gray-300">Expert Faculty</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/admissions"> 
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Apply Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 group"
            >
              <Play className="mr-2 w-5 h-5" />
              Explore Programs
            </Button>
          </motion.div>

          {/* Accreditation Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-300 text-sm mb-2">Accredited by</p>
            <div className="inline-flex flex-wrap justify-center items-center gap-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-2 py-1 text-sm">
              <span className="text-white font-semibold">APNMC</span>
              <span className="text-gray-300">•</span>
              <span className="text-white font-semibold">INC</span>
              <span className="text-gray-300">•</span>
              {/* Link to DRNTRUHS college list: https://drntr.uhsap.in/index/Academics_colleges#nursing2 */}
              <a 
                href="https://drntr.uhsap.in/index/Academics_colleges#nursing2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white font-semibold hover:text-blue-300 transition-colors"
              >
                DRNTRUHS
              </a>
              <span className="text-gray-300">•</span>
              <span className="text-white font-semibold">AISHE</span>
            </div>
            
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
    </section>
  );
}