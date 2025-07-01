import React, { useState, useEffect } from "react";
import { Application } from "@/entities/Application";
import { Contact } from "@/entities/Contact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Users, Mail, TrendingUp, Eye, Phone, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function Admin() {
  const [applications, setApplications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);

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

  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    acceptedApplications: applications.filter(app => app.status === 'accepted').length,
    totalContacts: contacts.length,
    newContacts: contacts.filter(contact => contact.status === 'new').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage applications and communications</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.acceptedApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="w-8 h-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">New Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.newContacts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="contacts">Contact Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Applications List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <div
                          key={application.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{application.full_name}</h3>
                              <p className="text-sm text-gray-600">{getProgramName(application.program)}</p>
                            </div>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{application.email}</span>
                            <span>•</span>
                            <span>{format(new Date(application.created_date), 'MMM d, yyyy')}</span>
                            <span>•</span>
                            <span>ID: {application.application_id}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Application Details */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Application Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedApplication ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{selectedApplication.full_name}</h3>
                          <Badge className={getStatusColor(selectedApplication.status)}>
                            {selectedApplication.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{selectedApplication.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{selectedApplication.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{selectedApplication.date_of_birth}</span>
                          </div>
                          {selectedApplication.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{selectedApplication.address}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Program</h4>
                          <p className="text-sm text-gray-600">{getProgramName(selectedApplication.program)}</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Education</h4>
                          <p className="text-sm text-gray-600">
                            {selectedApplication.education_level} 
                            {selectedApplication.gpa && ` - GPA: ${selectedApplication.gpa}`}
                          </p>
                          {selectedApplication.previous_institution && (
                            <p className="text-sm text-gray-600">{selectedApplication.previous_institution}</p>
                          )}
                        </div>

                        {selectedApplication.motivation && (
                          <div>
                            <h4 className="font-medium mb-2">Motivation</h4>
                            <p className="text-sm text-gray-600">{selectedApplication.motivation}</p>
                          </div>
                        )}

                        <div className="pt-4 border-t">
                          <p className="text-xs text-gray-500">
                            Applied: {format(new Date(selectedApplication.created_date), 'PPP')}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {selectedApplication.application_id}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Select an application to view details
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.subject}</p>
                        </div>
                        <Badge className={getStatusColor(contact.status)}>
                          {contact.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{contact.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{contact.email}</span>
                        {contact.phone && (
                          <>
                            <span>•</span>
                            <span>{contact.phone}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{format(new Date(contact.created_date), 'MMM d, yyyy')}</span>
                        {contact.inquiry_type && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{contact.inquiry_type}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}