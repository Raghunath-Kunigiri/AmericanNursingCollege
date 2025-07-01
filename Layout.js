import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, GraduationCap, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Home", path: "Home" },
    { name: "About", path: "About" },
    { name: "Programs", path: "Programs" },
    { name: "Admissions", path: "Admissions" },
    { name: "Contact", path: "Contact" },
    { name: "Admin", path: "Admin" }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --primary-blue: #003087;
          --secondary-blue: #1E90FF;
          --accent-green: #28A745;
          --highlight-yellow: #FFC107;
          --gradient-primary: linear-gradient(135deg, #003087 0%, #1E90FF 100%);
          --gradient-secondary: linear-gradient(135deg, #28A745 0%, #20c997 100%);
          --gradient-hero: linear-gradient(135deg, #003087 0%, #1E90FF 70%, #28A745 100%);
        }
        
        .glass-nav {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .mobile-menu-overlay {
          backdrop-filter: blur(20px);
          background: linear-gradient(135deg, rgba(0, 48, 135, 0.95) 0%, rgba(30, 144, 255, 0.95) 100%);
        }
        
        .nav-link {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--accent-green);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .gradient-text {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-nav rounded-2xl px-6 py-4 shadow-lg">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to={createPageUrl("Home")} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold gradient-text">American College</h1>
                  <p className="text-sm text-gray-600">of Nursing</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.path)}
                    className={`nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                      location.pathname === createPageUrl(item.path) ? 'active text-blue-600' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="mobile-menu-overlay min-h-screen flex flex-col justify-center items-center">
            <div className="text-center space-y-8">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.path)}
                  className="block text-2xl font-semibold text-white hover:text-green-300 transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">American College of Nursing</h2>
                  <p className="text-gray-400">Excellence in Healthcare Education</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Empowering the next generation of healthcare professionals with 36+ years of excellence in nursing education.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-500" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-500" />
                  <span>info@americancollegeofnursing.edu</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <span>123 Healthcare Drive, Medical City, MC 12345</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {navigationItems.slice(0, 5).map((item) => (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.path)}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Programs</h3>
              <div className="space-y-2 text-gray-300">
                <p>General Nursing & Midwifery</p>
                <p>Bachelor of Science in Nursing</p>
                <p>Paramedical in Nursing</p>
                <p>Medical Lab Technician</p>
                <p>Cardiology Technician</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 American College of Nursing. All rights reserved. | 
              <span className="text-green-500"> Accredited by NLNAC</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}