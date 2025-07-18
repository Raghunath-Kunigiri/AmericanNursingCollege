import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// Entity imports removed - now using Google Sheets directly
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { StatCard } from "./components/ui/stat-card";
import { MiniChart } from "./components/ui/mini-chart";
import { SlideOver } from "./components/ui/slide-over";
import { ApplicationDetailsPanel } from "./components/ApplicationDetailsPanel";
import { BulkActionsBar } from "./components/BulkActionsBar";
import { AdvancedFilters } from "./components/AdvancedFilters";
import { ConversationView } from "./components/ConversationView";
import { CannedResponsesManager } from "./components/CannedResponsesManager";
// Advanced Analytics Components
import ApplicationFunnelChart from "./components/analytics/ApplicationFunnelChart";
import ProgramPopularityChart from "./components/analytics/ProgramPopularityChart";
import GeographicDistributionChart from "./components/analytics/GeographicDistributionChart";
import TimeToDecisionChart from "./components/analytics/TimeToDecisionChart";
// Content Management Components
import TestimonialsManager from "./components/content/TestimonialsManager";
import AnnouncementsManager from "./components/content/AnnouncementsManager";
import KeyInfoManager from "./components/content/KeyInfoManager";

import { 
  FileText, Users, Mail, TrendingUp, Eye, MessageSquare,
  Search, Download, Settings, UserPlus, Edit, Image, Star,
  CheckCircle, XCircle, Clock, RefreshCw, Plus, AlertCircle, 
  Zap, Activity, FileBarChart, Megaphone, Globe, LogOut
} from "lucide-react";
import { format } from "date-fns";
import { createSampleData } from './utils/sampleData';
import { 
  calculateTrend, 
  getRecentPendingApplications, 
  getRecentNewMessages,
  getApplicationsThisWeek,
  generateActivityFeed,
  getTrendLabel
} from './utils/adminUtils';
import "./Admin.css";
import AdminLogin from "./components/AdminLogin";
import { api } from './utils/api';

// Make createSampleData available globally for testing
window.createSampleData = createSampleData;

// Safe date formatting function
const safeFormatDate = (dateValue, formatString = 'MMM d, yyyy') => {
  if (!dateValue) return 'N/A';
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

// Safe date accessor function
const getCreatedDate = (item) => {
  return item.createdAt || item.created_date || item.updatedAt || item.updated_date;
};

// Safe ID accessor function
const getId = (item) => {
  return item._id || item.id;
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Enhanced Applications Tab State
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [detailsApplication, setDetailsApplication] = useState(null);
  const [selectedApplications, setSelectedApplications] = useState(new Set());
  const [filters, setFilters] = useState({
    status: 'all',
    program: 'all',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  });

  // Enhanced Messages Tab State
  const [showConversationView, setShowConversationView] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [error, setError] = useState(null);

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
      
      // Ensure applications is always an array
      setApplications(Array.isArray(applicationsData) ? applicationsData : []);
      setContacts(Array.isArray(contactsData) ? contactsData : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
      // Initialize with empty arrays on error
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

  const loadData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Load from localStorage (no longer using database API)
      const applicationsData = JSON.parse(localStorage.getItem('applications') || '[]');
      const contactsData = JSON.parse(localStorage.getItem('contacts') || '[]');
      
      // Load offline applications from localStorage
      const offlineApplications = JSON.parse(localStorage.getItem('offline_applications') || '[]');
      
      // Merge API applications with offline applications
      const allApplications = [...applicationsData, ...offlineApplications];
      
      // Sort by creation date (newest first)
      allApplications.sort((a, b) => {
        const dateA = new Date(getCreatedDate(a));
        const dateB = new Date(getCreatedDate(b));
        return dateB - dateA;
      });
      
      setApplications(allApplications);
      setContacts(contactsData);
      
      // Log for debugging
      if (offlineApplications.length > 0) {
        console.log(`📱 Loaded ${offlineApplications.length} offline applications`);
        console.log(`📊 Total applications: ${allApplications.length} (${applicationsData.length} from API + ${offlineApplications.length} offline)`);
      }
      
    } catch (error) {
      console.error("Error loading data:", error);
      if (error.status === 401) {
        // Handle unauthorized access
        setIsAuthenticated(false);
        localStorage.removeItem('adminToken');
      }
      
      // Fallback: If API fails completely, only show offline applications
      const offlineApplications = JSON.parse(localStorage.getItem('offline_applications') || '[]');
      setApplications(offlineApplications);
      setContacts([]);
      
      if (offlineApplications.length > 0) {
        console.log(`📱 API failed, showing ${offlineApplications.length} offline applications only`);
      }
    }
    setLoading(false);
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      // Update application status in localStorage
      const savedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const updatedApplications = savedApplications.map(app => 
        app.applicationId === applicationId ? { ...app, status: newStatus } : app
      );
      localStorage.setItem('applications', JSON.stringify(updatedApplications));
      await loadData(); // Refresh data
      // Update selected application if it's the one being changed
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication({...selectedApplication, status: newStatus});
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const updateContactStatus = async (contactId, newStatus) => {
    try {
      // Update contact status in localStorage
      const savedContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
      const updatedContacts = savedContacts.map(contact => 
        contact.id === contactId ? { ...contact, status: newStatus } : contact
      );
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
      await loadData(); // Refresh data
      if (selectedContact?.id === contactId) {
        setSelectedContact({...selectedContact, status: newStatus});
      }
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewing: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      new: "bg-gray-100 text-gray-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getProgramName = (program) => {
    const programs = {
      general_nursing_midwifery: "General Nursing & Midwifery",
      bachelor_nursing: "Bachelor of Science in Nursing",
      paramedical_nursing: "Paramedical in Nursing",
      medical_lab_technician: "Medical Lab Technician",
      cardiology_technician: "Cardiology Technician",
      multipurpose_health_assistant: "Multipurpose Health Assistant"
    };
    return programs[program] || program;
  };

  // Advanced filtering function for the enhanced Applications tab
  const applyAdvancedFilters = (apps) => {
    if (!Array.isArray(apps)) return [];
    
    return apps.filter(app => {
      if (filters.status !== 'all' && app.status !== filters.status) return false;
      if (filters.program !== 'all' && app.program !== filters.program) return false;
      
      if (filters.dateFrom || filters.dateTo) {
        const appDate = new Date(app.submittedAt || app.createdAt);
        if (filters.dateFrom && new Date(filters.dateFrom) > appDate) return false;
        if (filters.dateTo && new Date(filters.dateTo) < appDate) return false;
      }
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          app.name?.toLowerCase().includes(searchLower) ||
          app.email?.toLowerCase().includes(searchLower) ||
          app.program?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  };

  // Enhanced filtering for the Applications tab
  const filteredApplicationsEnhanced = applyAdvancedFilters(applications);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = (contact.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (contact.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (contact.message?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Enhanced stats with trends
  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    acceptedApplications: applications.filter(app => app.status === 'accepted').length,
    rejectedApplications: applications.filter(app => app.status === 'rejected').length,
    totalContacts: contacts.length,
    newContacts: contacts.filter(contact => contact.status === 'new').length,
    resolvedContacts: contacts.filter(contact => contact.status === 'resolved').length
  };

  // Calculate trends
  const applicationsTrend = calculateTrend(applications, applications, 'week');
  const contactsTrend = calculateTrend(contacts, contacts, 'week');

  // Get data for enhanced dashboard
  const recentPendingApplications = getRecentPendingApplications(applications);
  const recentNewMessages = getRecentNewMessages(contacts);
  const weeklyApplicationsData = getApplicationsThisWeek(applications);
  const activityFeed = generateActivityFeed(applications, contacts);

  const exportData = (type) => {
    const data = type === 'applications' ? applications : contacts;
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(data[0] || {}).join(",") + "\n" +
      data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${type}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Enhanced Applications Tab Handlers
  const handleApplicationView = (application) => {
    setDetailsApplication(application);
    setShowApplicationDetails(true);
  };

  const handleApplicationSelection = (applicationId, selected) => {
    const newSelected = new Set(selectedApplications);
    if (selected) {
      newSelected.add(applicationId);
    } else {
      newSelected.delete(applicationId);
    }
    setSelectedApplications(newSelected);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedApplications(new Set(filteredApplicationsEnhanced.map(app => getId(app))));
    } else {
      setSelectedApplications(new Set());
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    try {
      // Update selected applications status in localStorage
      const savedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const updatedApplications = savedApplications.map(app => 
        selectedApplications.has(app.applicationId) ? { ...app, status: newStatus } : app
      );
      localStorage.setItem('applications', JSON.stringify(updatedApplications));
      await loadData();
      setSelectedApplications(new Set());
    } catch (error) {
      console.error("Error updating bulk status:", error);
    }
  };

  const handleBulkExport = () => {
    const selectedData = applications.filter(app => selectedApplications.has(getId(app)));
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(selectedData[0] || {}).join(",") + "\n" +
      selectedData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `selected-applications-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedApplications.size} applications? This action cannot be undone.`)) {
      try {
        // In a real app, you'd have a delete method
        console.log("Bulk delete:", Array.from(selectedApplications));
        setSelectedApplications(new Set());
      } catch (error) {
        console.error("Error deleting applications:", error);
      }
    }
  };

  // Enhanced Messages Tab Handlers
  const handleMessageView = (contact) => {
    setSelectedConversation(contact);
    setShowConversationView(true);
  };

  const handleAssignChange = async (contactId, assignedTo) => {
    try {
      // Update the contact assignment (in a real app, this would be an API call)
      const updatedContacts = contacts.map(contact =>
        getId(contact) === contactId
          ? { ...contact, assigned_to: assignedTo }
          : contact
      );
      setContacts(updatedContacts);
      
      // Update selected conversation if it's the one being modified
      if (getId(selectedConversation) === contactId) {
        setSelectedConversation({...selectedConversation, assigned_to: assignedTo});
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  const handleSendReply = async (contactId, reply) => {
    try {
      // Save reply to localStorage (replace with your preferred reply handling)
      const replyData = {
        contactId,
        content: reply.content,
        sender: reply.sender,
        timestamp: new Date().toISOString()
      };
      
      const savedReplies = JSON.parse(localStorage.getItem('contact_replies') || '[]');
      savedReplies.push(replyData);
      localStorage.setItem('contact_replies', JSON.stringify(savedReplies));
      await loadData(); // Refresh data after sending reply
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  // Sync offline applications with server
  const syncOfflineApplications = async () => {
    try {
      const offlineApplications = JSON.parse(localStorage.getItem('offline_applications') || '[]');
      
      if (offlineApplications.length === 0) {
        alert('No offline applications to sync.');
        return;
      }

      // No longer using database API - offline applications are already in localStorage
      // Move offline applications to main applications storage
      const savedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const mergedApplications = [...savedApplications, ...offlineApplications];
      localStorage.setItem('applications', JSON.stringify(mergedApplications));
      
      const successful = offlineApplications.length;
      const failed = 0;

      if (successful > 0) {
        // Clear successfully synced applications
        localStorage.removeItem('offline_applications');
        await loadData(); // Refresh the admin panel
        
        alert(`✅ Successfully synced ${successful} applications!${failed > 0 ? ` (${failed} failed)` : ''}`);
      } else {
        alert(`❌ Failed to sync applications. Please check server connection.`);
      }

    } catch (error) {
      console.error('Error syncing offline applications:', error);
      alert('Error syncing applications: ' + error.message);
    }
  };

  // Check if there are offline applications
  const offlineCount = JSON.parse(localStorage.getItem('offline_applications') || '[]').length;

  // Helper function to clear broken offline applications
  const clearOfflineApplications = () => {
    localStorage.removeItem('offline_applications');
    loadData(); // Refresh the admin panel
    alert('✅ Offline applications cleared successfully!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Applications Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Applications</h2>
            <AdvancedFilters filters={filters} setFilters={setFilters} />
          </div>
          
          {filteredApplicationsEnhanced.length > 0 ? (
            <div className="space-y-4">
              {filteredApplicationsEnhanced.map((app) => (
                <div key={app._id} className="border-b pb-4">
                  <h3 className="font-medium">{app.name}</h3>
                  <p className="text-gray-600">Program: {app.program}</p>
                  <p className="text-gray-600">Status: {app.status}</p>
                  <p className="text-gray-600">Email: {app.email}</p>
                  <p className="text-gray-600">Phone: {app.phone}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No applications found.</p>
          )}
        </div>

        {/* Messages Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          {contacts.length > 0 ? (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact._id} className="border-b pb-4">
                  <h3 className="font-medium">{contact.name}</h3>
                  <p className="text-gray-600">Email: {contact.email}</p>
                  <p className="text-gray-600">Subject: {contact.subject}</p>
                  <p className="text-gray-600">{contact.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No messages found.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={fetchData}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default Admin;