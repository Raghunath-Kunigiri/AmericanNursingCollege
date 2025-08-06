import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { createSampleData } from './utils/sampleData';
import "./Admin.css";
import AdminLogin from "./components/AdminLogin";
import { api } from './utils/api';
import PDFExtractor from './components/admin/PDFExtractor';

// Make createSampleData available globally for testing
window.createSampleData = createSampleData;

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const response = await api.verifyToken();
      setIsAuthenticated(response.valid);
      if (response.valid) {
        fetchData();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [applicationsData, contactsData] = await Promise.all([
        api.getApplications(),
        api.getContacts()
      ]);
      
      setApplications(Array.isArray(applicationsData) ? applicationsData : []);
      setContacts(Array.isArray(contactsData) ? contactsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setApplications([]);
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'pdf-extractor', name: 'PDF Extractor', icon: '📄' },
    { id: 'applications', name: 'Applications', icon: '📝' },
    { id: 'contacts', name: 'Contacts', icon: '📞' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">📝</div>
                  <div>
                    <p className="text-sm text-blue-600">Total Applications</p>
                    <p className="text-2xl font-bold text-blue-900">{applications.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">📞</div>
                  <div>
                    <p className="text-sm text-green-600">Total Contacts</p>
                    <p className="text-2xl font-bold text-green-900">{contacts.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">📄</div>
                  <div>
                    <p className="text-sm text-purple-600">PDF Extractor</p>
                    <p className="text-2xl font-bold text-purple-900">Ready</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('pdf-extractor')}
                  className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📄</span>
                    <div>
                      <p className="font-medium">Extract PDF Data</p>
                      <p className="text-sm text-gray-500">Upload and process PDF files</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📝</span>
                    <div>
                      <p className="font-medium">View Applications</p>
                      <p className="text-sm text-gray-500">Manage student applications</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'pdf-extractor':
        return <PDFExtractor />;
      
      case 'applications':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Applications</h2>
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No applications found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.program}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      
      case 'contacts':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Messages</h2>
            {contacts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No contact messages found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      </div>
                      <span className="text-xs text-gray-400">{format(new Date(contact.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <p className="mt-2 text-gray-700">{contact.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Account Settings</h3>
                <p className="text-sm text-gray-500">Manage your admin account settings</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">System Settings</h3>
                <p className="text-sm text-gray-500">Configure system preferences</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, Administrator</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        {renderTabContent()}
      </div>
    </div>
  );
}