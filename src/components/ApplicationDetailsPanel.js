import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  User, Mail, Phone, MapPin, Calendar, GraduationCap, FileText, 
  Clock, CheckCircle, XCircle, Eye, Save, MessageSquare, Award
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

export function ApplicationDetailsPanel({ application, onStatusChange, onClose }) {
  const [activeTab, setActiveTab] = useState('details');
  const [internalNote, setInternalNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Load existing notes from localStorage
    const savedNotes = localStorage.getItem(`notes-${application.id}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [application.id]);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      reviewing: "bg-blue-100 text-blue-800 border-blue-200",
      accepted: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'reviewing': return <Eye className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
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

  const handleStatusChange = async (newStatus) => {
    await onStatusChange(application.id, newStatus);
    // Add to timeline
    const timelineEntry = {
      id: Date.now(),
      status: newStatus,
      timestamp: new Date().toISOString(),
      admin: 'Current Admin',
      note: `Status changed to ${newStatus}`
    };
    
    // Save timeline entry
    const existingTimeline = JSON.parse(localStorage.getItem(`timeline-${application.id}`) || '[]');
    existingTimeline.push(timelineEntry);
    localStorage.setItem(`timeline-${application.id}`, JSON.stringify(existingTimeline));
  };

  const saveInternalNote = () => {
    if (!internalNote.trim()) return;

    const newNote = {
      id: Date.now(),
      content: internalNote,
      timestamp: new Date().toISOString(),
      admin: 'Current Admin'
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem(`notes-${application.id}`, JSON.stringify(updatedNotes));
    setInternalNote('');
  };

  const getTimeline = () => {
    const savedTimeline = localStorage.getItem(`timeline-${application.id}`);
    const timeline = savedTimeline ? JSON.parse(savedTimeline) : [];
    
    // Add initial submission if timeline is empty
    if (timeline.length === 0) {
      timeline.push({
        id: 'initial',
        status: 'submitted',
        timestamp: application.created_date,
        admin: 'System',
        note: 'Application submitted'
      });
    }

    return timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start gap-4">
          {/* Avatar Placeholder */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{application.full_name}</h3>
                <p className="text-blue-600 font-medium">{getProgramName(application.program)}</p>
                <p className="text-sm text-gray-500">ID: {application.application_id}</p>
              </div>
              <Badge className={`${getStatusColor(application.status)} border`}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(application.status)}
                  <span className="capitalize">{application.status}</span>
                </div>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="notes">Internal Notes</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                  <p className="text-gray-900">{application.full_name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Date of Birth</Label>
                  <p className="text-gray-900">{application.date_of_birth}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{application.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{application.phone}</p>
                  </div>
                </div>
                {application.address && (
                  <div className="col-span-2 space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Address</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{application.address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Educational Background */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Educational Background
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Education Level</Label>
                    <p className="text-gray-900">{application.education_level}</p>
                  </div>
                  {application.gpa && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">GPA</Label>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900">{application.gpa}</p>
                      </div>
                    </div>
                  )}
                </div>
                {application.previous_institution && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Previous Institution</Label>
                    <p className="text-gray-900">{application.previous_institution}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Program & Motivation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Program & Motivation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Selected Program</Label>
                  <p className="text-gray-900 font-medium">{getProgramName(application.program)}</p>
                </div>
                {application.motivation && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Motivation Statement</Label>
                    <p className="text-gray-900 leading-relaxed">{application.motivation}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Application Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{format(new Date(application.created_date), 'PPP')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="flex-1 overflow-y-auto p-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getTimeline().map((entry, index) => (
                    <div key={entry.id} className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        entry.status === 'accepted' ? 'bg-green-500' :
                        entry.status === 'rejected' ? 'bg-red-500' :
                        entry.status === 'reviewing' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium capitalize">{entry.status === 'submitted' ? 'Application Submitted' : `Status: ${entry.status}`}</span>
                          <span className="text-xs text-gray-500">by {entry.admin}</span>
                        </div>
                        <p className="text-sm text-gray-600">{entry.note}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(new Date(entry.timestamp), 'PPp')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Internal Notes Tab */}
          <TabsContent value="notes" className="flex-1 overflow-y-auto p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Internal Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add New Note */}
                <div className="space-y-4 mb-6">
                  <Label htmlFor="internal-note">Add Internal Note</Label>
                  <div className="space-y-2">
                    <textarea
                      id="internal-note"
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      placeholder="Add a note for other admins (e.g., 'Spoke with applicant, very promising candidate')"
                      className="w-full p-3 border border-gray-300 rounded-md resize-none"
                      rows={3}
                    />
                    <Button 
                      onClick={saveInternalNote}
                      disabled={!internalNote.trim()}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Note
                    </Button>
                  </div>
                </div>

                {/* Existing Notes */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Previous Notes</h4>
                  {notes.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No internal notes yet</p>
                  ) : (
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-900 mb-2">{note.content}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{note.admin}</span>
                            <span>•</span>
                            <span>{format(new Date(note.timestamp), 'PPp')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleStatusChange('reviewing')}
            disabled={application.status === 'reviewing'}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Set to Reviewing
          </Button>
          <Button 
            onClick={() => handleStatusChange('accepted')}
            disabled={application.status === 'accepted'}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Accept
          </Button>
          <Button 
            onClick={() => handleStatusChange('rejected')}
            disabled={application.status === 'rejected'}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
} 