import React, { useState, useEffect } from "react";
import { Application } from "./entities/Application";
import { Contact } from "./entities/Contact";
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
  Zap, Activity, FileBarChart, Megaphone, Globe
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

// Make createSampleData available globally for testing
window.createSampleData = createSampleData;

export default function Admin() {
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [applicationsData, contactsData] = await Promise.all([
        Application.list('-created_date'),
        Contact.list('-created_date')
      ]);
      setApplications(applicationsData);
      setContacts(contactsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await Application.updateStatus(applicationId, newStatus);
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
      await Contact.updateStatus(contactId, newStatus);
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
  const applyAdvancedFilters = (applications, filters) => {
    return applications.filter(app => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          app.full_name.toLowerCase().includes(searchLower) ||
          app.email.toLowerCase().includes(searchLower) ||
          app.application_id.toLowerCase().includes(searchLower) ||
          getProgramName(app.program).toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && app.status !== filters.status) {
        return false;
      }

      // Program filter
      if (filters.program !== 'all' && app.program !== filters.program) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const appDate = new Date(app.created_date);
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (appDate < fromDate) return false;
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          toDate.setHours(23, 59, 59, 999); // End of day
          if (appDate > toDate) return false;
        }
      }

      return true;
    });
  };

  // Enhanced filtering for the Applications tab
  const filteredApplicationsEnhanced = applyAdvancedFilters(applications, filters);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase());
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
      setSelectedApplications(new Set(filteredApplicationsEnhanced.map(app => app.id)));
    } else {
      setSelectedApplications(new Set());
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    try {
      const promises = Array.from(selectedApplications).map(id => 
        Application.updateStatus(id, newStatus)
      );
      await Promise.all(promises);
      await loadData();
      setSelectedApplications(new Set());
    } catch (error) {
      console.error("Error updating bulk status:", error);
    }
  };

  const handleBulkExport = () => {
    const selectedData = applications.filter(app => selectedApplications.has(app.id));
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
        contact.id === contactId
          ? { ...contact, assigned_to: assignedTo }
          : contact
      );
      setContacts(updatedContacts);
      
      // Update selected conversation if it's the one being modified
      if (selectedConversation?.id === contactId) {
        setSelectedConversation({...selectedConversation, assigned_to: assignedTo});
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  const handleSendReply = async (contactId, reply) => {
    try {
      // In a real app, this would save the reply to the backend
      console.log('Reply sent:', { contactId, reply });
      
      // Update contact's last activity timestamp
      const updatedContacts = contacts.map(contact =>
        contact.id === contactId
          ? { ...contact, last_activity: new Date().toISOString() }
          : contact
      );
      setContacts(updatedContacts);
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  if (loading) {
    return (
      <div className="admin-main-wrapper bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-main-wrapper bg-gray-50">
      <div className="admin-container container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="admin-breadcrumb mb-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <div className="flex">
                  <a href="/" className="text-gray-400 hover:text-gray-500">
                    Home
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-blue-600">Admin Dashboard</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Header */}
        <div className="admin-header">
          <div className="flex justify-between items-center">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage applications, contacts, and system settings</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => loadData()} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button onClick={() => createSampleData()} variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Sample Data
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="contacts">Messages</TabsTrigger>
                          <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Enhanced Dashboard Tab */}
          <TabsContent value="dashboard" className="w-full">
            {/* Multi-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1: Enhanced Key Metrics */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
                <div className="space-y-4">
                  <StatCard
                    title="Total Applications"
                    value={stats.totalApplications}
                    icon={FileText}
                    trend={applicationsTrend}
                    trendLabel={getTrendLabel('week')}
                    color="blue"
                  />
                  <StatCard
                    title="Pending"
                    value={stats.pendingApplications}
                    icon={Clock}
                    color="yellow"
                  />
                  <StatCard
                    title="Accepted"
                    value={stats.acceptedApplications}
                    icon={CheckCircle}
                    color="green"
                  />
                  <StatCard
                    title="Rejected"
                    value={stats.rejectedApplications}
                    icon={XCircle}
                    color="red"
                  />
                  <StatCard
                    title="Total Messages"
                    value={stats.totalContacts}
                    icon={Mail}
                    trend={contactsTrend}
                    trendLabel={getTrendLabel('week')}
                    color="purple"
                  />
                  <StatCard
                    title="New Messages"
                    value={stats.newContacts}
                    icon={AlertCircle}
                    color="orange"
                  />
                  <StatCard
                    title="Resolved"
                    value={stats.resolvedContacts}
                    icon={TrendingUp}
                    color="green"
                  />
                </div>
              </div>

              {/* Column 2: Action Center */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Center</h3>
                
                {/* Needs Attention Panel */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        Needs Attention
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Recent Pending Applications */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Pending Applications</h4>
                        {recentPendingApplications.length === 0 ? (
                          <p className="text-sm text-gray-500">No pending applications</p>
                        ) : (
                          <div className="space-y-2">
                            {recentPendingApplications.slice(0, 3).map((app) => (
                              <div key={app.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{app.full_name}</p>
                                  <p className="text-xs text-gray-500">{getProgramName(app.program)}</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedApplication(app)}
                                  className="ml-2"
                                >
                                  Review
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Recent New Messages */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent New Messages</h4>
                        {recentNewMessages.length === 0 ? (
                          <p className="text-sm text-gray-500">No new messages</p>
                        ) : (
                          <div className="space-y-2">
                            {recentNewMessages.slice(0, 3).map((contact) => (
                              <div key={contact.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                                  <p className="text-xs text-gray-500 truncate">{contact.subject}</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedContact(contact)}
                                  className="ml-2"
                                >
                                  View
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Zap className="w-5 h-5 text-blue-500" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-2">
                        <Button className="justify-start" variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          New Announcement
                        </Button>
                        <Button 
                          className="justify-start" 
                          variant="outline"
                          onClick={() => exportData('applications')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export Applications
                        </Button>
                        <Button className="justify-start" variant="outline">
                          <FileBarChart className="w-4 h-4 mr-2" />
                          Generate Report
                        </Button>
                        <Button 
                          className="justify-start" 
                          variant="outline"
                          onClick={() => createSampleData()}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Generate Sample Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Column 3: Quick Insights & Activity */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
                <div className="space-y-6">
                  
                  {/* Weekly Applications Chart */}
                  <MiniChart 
                    data={weeklyApplicationsData}
                    title="Applications This Week"
                    height={140}
                  />

                  {/* Recent Activity Feed */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Activity className="w-5 h-5 text-green-500" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activityFeed.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                      ) : (
                        <div className="space-y-3">
                          {activityFeed.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                activity.type === 'application' 
                                  ? activity.action === 'accepted' 
                                    ? 'bg-green-500' 
                                    : activity.action === 'rejected' 
                                      ? 'bg-red-500' 
                                      : 'bg-blue-500'
                                  : 'bg-purple-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900">{activity.message}</p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Enhanced Applications Tab */}
          <TabsContent value="applications" className="w-full">
            {/* Advanced Filters */}
            <AdvancedFilters 
              onFiltersChange={setFilters}
              initialFilters={filters}
            />

            {/* Applications Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Applications ({filteredApplicationsEnhanced.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedApplications.size === filteredApplicationsEnhanced.length && filteredApplicationsEnhanced.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">Select All</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredApplicationsEnhanced.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your search criteria or filters
                    </p>
                    <Button 
                      onClick={() => setFilters({
                        status: 'all',
                        program: 'all',
                        dateFrom: '',
                        dateTo: '',
                        searchTerm: ''
                      })}
                      variant="outline"
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    {/* Table Header */}
                    <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-50 border-b text-sm font-medium text-gray-700">
                      <div className="col-span-1 flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedApplications.size === filteredApplicationsEnhanced.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="col-span-3">Applicant</div>
                      <div className="col-span-2">Program</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Applied</div>
                      <div className="col-span-2">Actions</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                      {filteredApplicationsEnhanced.map((application) => (
                        <div key={application.id} className="p-4 hover:bg-gray-50 transition-colors">
                          {/* Mobile Layout */}
                          <div className="md:hidden space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={selectedApplications.has(application.id)}
                                  onChange={(e) => handleApplicationSelection(application.id, e.target.checked)}
                                  className="rounded border-gray-300 mt-1"
                                />
                                <div>
                                  <h3 className="font-semibold text-gray-900">{application.full_name}</h3>
                                  <p className="text-sm text-gray-600">{getProgramName(application.program)}</p>
                                  <p className="text-xs text-gray-500">{application.email}</p>
                                </div>
                              </div>
                              <Badge className={getStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {format(new Date(application.created_date), 'MMM d, yyyy')}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => handleApplicationView(application)}
                                className="flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </Button>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                            <div className="col-span-1">
                              <input
                                type="checkbox"
                                checked={selectedApplications.has(application.id)}
                                onChange={(e) => handleApplicationSelection(application.id, e.target.checked)}
                                className="rounded border-gray-300"
                              />
                            </div>
                            <div className="col-span-3">
                              <div>
                                <p className="font-semibold text-gray-900">{application.full_name}</p>
                                <p className="text-xs text-gray-500">{application.email}</p>
                                <p className="text-xs text-gray-500">ID: {application.application_id}</p>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm text-gray-900">{getProgramName(application.program)}</p>
                            </div>
                            <div className="col-span-2">
                              <Badge className={getStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm text-gray-600">
                                {format(new Date(application.created_date), 'MMM d, yyyy')}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <Button
                                size="sm"
                                onClick={() => handleApplicationView(application)}
                                className="flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bulk Actions Bar */}
            <BulkActionsBar
              selectedCount={selectedApplications.size}
              onClearSelection={() => setSelectedApplications(new Set())}
              onBulkStatusChange={handleBulkStatusChange}
              onBulkExport={handleBulkExport}
              onBulkDelete={handleBulkDelete}
            />

            {/* Application Details Slide-over */}
            <SlideOver
              isOpen={showApplicationDetails}
              onClose={() => setShowApplicationDetails(false)}
              title={detailsApplication?.full_name || "Application Details"}
              width="max-w-4xl"
            >
              {detailsApplication && (
                <ApplicationDetailsPanel
                  application={detailsApplication}
                  onStatusChange={updateApplicationStatus}
                  onClose={() => setShowApplicationDetails(false)}
                />
              )}
            </SlideOver>
          </TabsContent>

          {/* Enhanced Messages Tab */}
          <TabsContent value="contacts" className="w-full">
            {/* Search and Filters */}
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md bg-white">
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => exportData('contacts')} variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Messages Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Messages & Conversations ({filteredContacts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your search criteria or filters
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    {/* Table Header - Desktop */}
                    <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-50 border-b text-sm font-medium text-gray-700">
                      <div className="col-span-3">Contact</div>
                      <div className="col-span-3">Subject</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Assigned</div>
                      <div className="col-span-2">Actions</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                      {filteredContacts.map((contact) => (
                        <div key={contact.id} className="p-4 hover:bg-gray-50 transition-colors">
                          {/* Mobile Layout */}
                          <div className="md:hidden space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                                <p className="text-sm text-gray-600">{contact.subject}</p>
                                <p className="text-xs text-gray-500">{contact.email}</p>
                              </div>
                              <Badge className={getStatusColor(contact.status)}>
                                {contact.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2">{contact.message}</p>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-500">
                                {format(new Date(contact.created_date), 'MMM d, yyyy')}
                                {contact.assigned_to && (
                                  <span className="ml-2">• Assigned to {contact.assigned_to || 'Unassigned'}</span>
                                )}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleMessageView(contact)}
                                className="flex items-center gap-2"
                              >
                                <MessageSquare className="w-4 h-4" />
                                View Conversation
                              </Button>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                            <div className="col-span-3">
                              <div>
                                <p className="font-semibold text-gray-900">{contact.name}</p>
                                <p className="text-xs text-gray-500">{contact.email}</p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(contact.created_date), 'MMM d, h:mm a')}
                                </p>
                              </div>
                            </div>
                            <div className="col-span-3">
                              <div>
                                <p className="font-medium text-gray-900">{contact.subject}</p>
                                <p className="text-sm text-gray-600 line-clamp-1">{contact.message}</p>
                                {contact.inquiry_type && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 mt-1">
                                    {contact.inquiry_type.replace('_', ' ')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <Badge className={getStatusColor(contact.status)}>
                                {contact.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm text-gray-600">
                                {contact.assigned_to || 'Unassigned'}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <Button
                                size="sm"
                                onClick={() => handleMessageView(contact)}
                                className="flex items-center gap-2"
                              >
                                <MessageSquare className="w-4 h-4" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conversation View Slide-over */}
            <SlideOver
              isOpen={showConversationView}
              onClose={() => setShowConversationView(false)}
              title={selectedConversation?.subject || "Message Conversation"}
              width="max-w-4xl"
            >
              {selectedConversation && (
                <ConversationView
                  contact={selectedConversation}
                  onStatusChange={updateContactStatus}
                  onAssignChange={handleAssignChange}
                  onSendReply={handleSendReply}
                  currentAdmin="Current Admin"
                />
              )}
            </SlideOver>
          </TabsContent>

          {/* Analytics Tab - Strategic Insights Dashboard */}
          <TabsContent value="analytics" className="w-full">
            <div className="space-y-6">
              {/* Header with Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  title="Total Applications"
                  value={stats.totalApplications.toLocaleString()}
                  change={applicationsTrend}
                  icon={FileText}
                  color="blue"
                />
                <StatCard
                  title="Acceptance Rate"
                  value={`${stats.totalApplications > 0 
                    ? Math.round((stats.acceptedApplications / stats.totalApplications) * 100)
                    : 0}%`}
                  change={"+2.5"}
                  icon={CheckCircle}
                  color="green"
                />
                <StatCard
                  title="Avg Processing Time"
                  value="9.2 days"
                  change={"-1.3"}
                  icon={Clock}
                  color="yellow"
                />
                <StatCard
                  title="Enrollment Rate"
                  value="79.2%"
                  change={"+5.1"}
                  icon={TrendingUp}
                  color="purple"
                />
              </div>

              {/* Application Funnel Chart */}
              <ApplicationFunnelChart 
                data={{
                  submitted: stats.totalApplications,
                  reviewing: stats.pendingApplications + applications.filter(app => app.status === 'reviewing').length,
                  accepted: stats.acceptedApplications,
                  enrolled: Math.floor(stats.acceptedApplications * 0.79) // 79% enrollment rate
                }}
              />

              {/* Two-Column Layout for Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Program Popularity Chart */}
                <ProgramPopularityChart applications={applications} />

                {/* Geographic Distribution Chart */}
                <GeographicDistributionChart applications={applications} />
              </div>

              {/* Time-to-Decision Analytics */}
              <TimeToDecisionChart applications={applications} />

              {/* Strategic Insights Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Strategic Insights & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">🎯 Conversion Optimization</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Your acceptance rate of {stats.totalApplications > 0 
                          ? Math.round((stats.acceptedApplications / stats.totalApplications) * 100)
                          : 0}% is strong, but enrollment conversion could improve.
                      </p>
                      <p className="text-xs text-blue-600">
                        <strong>Action:</strong> Implement follow-up sequences for accepted students to boost enrollment.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">⚡ Processing Efficiency</h4>
                      <p className="text-sm text-green-700 mb-3">
                        Average processing time is below target. Great work maintaining efficiency!
                      </p>
                      <p className="text-xs text-green-600">
                        <strong>Opportunity:</strong> Share best practices with admission teams at other institutions.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2">🌍 Geographic Expansion</h4>
                      <p className="text-sm text-yellow-700 mb-3">
                        Strong domestic presence with opportunities for international growth.
                      </p>
                      <p className="text-xs text-yellow-600">
                        <strong>Strategy:</strong> Consider targeted marketing in underrepresented regions with nursing shortages.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="w-full">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
                  <p className="text-gray-600">Manage website content without developer help</p>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Live Website Updates</span>
                </div>
              </div>

              {/* Tabbed Content Management */}
              <Tabs defaultValue="testimonials" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="testimonials" className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Testimonials
                  </TabsTrigger>
                  <TabsTrigger value="keyinfo" className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Key Information
                  </TabsTrigger>
                  <TabsTrigger value="programs" className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Programs
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="testimonials" className="mt-6">
                  <TestimonialsManager />
                </TabsContent>

                <TabsContent value="keyinfo" className="mt-6">
                  <KeyInfoManager />
                </TabsContent>

                <TabsContent value="programs" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Image className="w-5 h-5" />
                        Program Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Program content management</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Edit program descriptions, images, and details shown on the programs page
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="w-full">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Site Announcements</h2>
                  <p className="text-gray-600">Create and manage site-wide announcements and banners</p>
                </div>
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-gray-600">Live Banner System</span>
                </div>
              </div>

              <AnnouncementsManager />
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">User management functionality</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Add admin users, set permissions, and manage access levels
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Settings Tab */}
          <TabsContent value="settings" className="w-full">
            <div className="space-y-6">
              {/* Canned Responses Management */}
              <CannedResponsesManager />
              
              {/* Other Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Additional system configuration</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Configure notifications, preferences, and other system settings
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}