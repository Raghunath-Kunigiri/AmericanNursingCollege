import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Programs', path: '/programs' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const programs = [
    'General Nursing & Midwifery',
    'Bachelor of Science in Nursing',
    'Paramedical in Nursing',
    'Medical Lab Technician',
    'Cardiology Technician',
    'Multipurpose Health Assistant'
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Linkedin, href: '#', name: 'LinkedIn' },
    { icon: Youtube, href: '#', name: 'YouTube' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Logo and Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div>
                <img 
                  src="/images/Logo4.png" 
                  alt="ACN Logo" 
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="bg-blue-500 p-4 rounded-xl hidden">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">American College</h3>
                <p className="text-blue-300 text-sm">of Nursing</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Dedicated to excellence in healthcare education since 1987. Our mission is to prepare 
              compassionate, skilled, and ethical healthcare professionals for tomorrow's challenges.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="bg-white/10 hover:bg-blue-600 p-3 rounded-lg transition-all duration-300 group"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Programs Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <h3 className="text-xl font-bold text-white mb-6">Programs</h3>
            <ul className="space-y-3">
              {programs.map((program, index) => (
                <li key={index}>
                  <Link
                    to="/programs"
                    className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group text-sm"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {program}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <h3 className="text-xl font-bold text-white mb-6">Contact Info</h3>
            <div className="space-y-4">
              {/* Phone Numbers */}
              <a
                href="tel:+917013370612"
                className="flex items-center space-x-3 p-3 bg-white/5 hover:bg-blue-600/20 rounded-lg transition-all duration-300 group"
              >
                <Phone className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                <span className="text-gray-300 group-hover:text-white">+91 7013370612</span>
                <Phone className="w-4 h-4 text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              <a
                href="tel:+919989953273"
                className="flex items-center space-x-3 p-3 bg-white/5 hover:bg-blue-600/20 rounded-lg transition-all duration-300 group"
              >
                <Phone className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                <span className="text-gray-300 group-hover:text-white">+91 9989953273</span>
                <Phone className="w-4 h-4 text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* Email */}
              <a
                href="mailto:Schoolofnursing10@gmail.com"
                className="flex items-center space-x-3 p-3 bg-white/5 hover:bg-green-600/20 rounded-lg transition-all duration-300 group"
              >
                <Mail className="w-5 h-5 text-green-400 group-hover:text-green-300" />
                <span className="text-gray-300 group-hover:text-white text-sm">Schoolofnursing10@gmail.com</span>
                <Mail className="w-4 h-4 text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* Address */}
              <a
                href="https://maps.app.goo.gl/dd2vSjdpd3iEM7c77"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-3 p-3 bg-white/5 hover:bg-orange-600/20 rounded-lg transition-all duration-300 group"
              >
                <MapPin className="w-5 h-5 text-orange-400 group-hover:text-orange-300 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 group-hover:text-white text-sm leading-relaxed">
                  Balaji Villas, Kalyana Durgam Road, AP 515004
                </span>
                <ExternalLink className="w-4 h-4 text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border-t border-gray-700 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              &copy; {currentYear} American College of Nursing. All Rights Reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm"
              >
                Sitemap
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 