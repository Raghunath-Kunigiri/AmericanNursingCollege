import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Phone, Mail, ChevronDown } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [programsDropdown, setProgramsDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs', hasDropdown: true },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Contact', path: '/contact' },
  ];

  const programItems = [
    { name: 'General Nursing & Midwifery', path: '/programs/general-nursing-midwifery' },
    { name: 'Bachelor of Science in Nursing', path: '/programs/bsc-nursing' },
    { name: 'Paramedical in Nursing', path: '/programs/paramedical-nursing' },
    { name: 'Medical Lab Technician', path: '/programs/medical-lab-technician' },
    { name: 'Cardiology Technician', path: '/programs/cardiology-technician' },
    { name: 'Multipurpose Health Assistant', path: '/programs/multipurpose-health-assistant' },
  ];

  const isActive = (path) => {
    return location.pathname === path || (path === '/' && location.pathname === '/home') ||
           (path === '/programs' && location.pathname.startsWith('/programs'));
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/10 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="group-hover:scale-110 transition-transform">
              <img 
                src="/images/Logo4.png" 
                alt="ACN Logo" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="bg-blue-600 p-3 rounded-xl hidden">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
            </div>
            <div>
              <div className={`font-bold text-xl ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                American College
              </div>
              <div className={`text-sm ${scrolled ? 'text-blue-600' : 'text-blue-200'}`}>
                of Nursing
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => setProgramsDropdown(true)}
                    onMouseLeave={() => setProgramsDropdown(false)}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActive(item.path)
                          ? scrolled
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/20 text-white'
                          : scrolled
                          ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${programsDropdown ? 'rotate-180' : ''}`} />
                    </Link>
                    
                    {/* Programs Dropdown */}
                    {programsDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50">
                        <div className="py-2">
                          {programItems.map((program) => (
                            <Link
                              key={program.path}
                              to={program.path}
                              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                            >
                              {program.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? scrolled
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/20 text-white'
                        : scrolled
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${scrolled ? 'text-gray-600' : 'text-white/90'}`}>
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+91 7013370612</span>
            </div>
            <div className={`flex items-center space-x-2 ${scrolled ? 'text-gray-600' : 'text-white/90'}`}>
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Schoolofnursing10@gmail.com</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg ${
              scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => !item.hasDropdown && setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${programsDropdown ? 'rotate-180' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setProgramsDropdown(!programsDropdown);
                        }}
                      />
                    )}
                  </Link>
                  {item.hasDropdown && programsDropdown && (
                    <div className="ml-4 mt-2 space-y-2">
                      {programItems.map((program) => (
                        <Link
                          key={program.path}
                          to={program.path}
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          {program.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+91 7013370612</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Schoolofnursing10@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 