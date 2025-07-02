import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Send, ChevronDown, User, Users, Calendar, Clock, 
  Reply, MessageSquare, Paperclip, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';

export function ConversationView({ 
  contact, 
  onStatusChange, 
  onAssignChange, 
  onSendReply,
  currentAdmin = "Current Admin"
}) {
  const [replyContent, setReplyContent] = useState('');
  const [selectedCannedResponse, setSelectedCannedResponse] = useState('');
  const [cannedResponses, setCannedResponses] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [assignedTo, setAssignedTo] = useState(contact?.assigned_to || '');

  useEffect(() => {
    loadCannedResponses();
    loadConversation();
  }, [contact?.id]);

  const loadCannedResponses = () => {
    const saved = localStorage.getItem('cannedResponses');
    if (saved) {
      setCannedResponses(JSON.parse(saved));
    }
  };

  const loadConversation = () => {
    if (!contact?.id) return;
    
    const saved = localStorage.getItem(`conversation-${contact.id}`);
    if (saved) {
      setConversation(JSON.parse(saved));
    } else {
      // Initialize with the original message
      const initialConversation = [{
        id: 'original',
        type: 'message',
        content: contact.message,
        sender: contact.name,
        senderEmail: contact.email,
        timestamp: contact.created_date,
        isOriginal: true
      }];
      setConversation(initialConversation);
      localStorage.setItem(`conversation-${contact.id}`, JSON.stringify(initialConversation));
    }
  };

  const handleCannedResponseSelect = (responseId) => {
    const response = cannedResponses.find(r => r.id === parseInt(responseId));
    if (response) {
      setReplyContent(response.content);
    }
    setSelectedCannedResponse('');
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;

    const reply = {
      id: Date.now(),
      type: 'reply',
      content: replyContent,
      sender: currentAdmin,
      senderEmail: 'admin@americannursingcollege.com',
      timestamp: new Date().toISOString(),
      isOriginal: false
    };

    const updatedConversation = [...conversation, reply];
    setConversation(updatedConversation);
    localStorage.setItem(`conversation-${contact.id}`, JSON.stringify(updatedConversation));
    
    // Update contact status to in_progress if it's new
    if (contact.status === 'new') {
      await onStatusChange(contact.id, 'in_progress');
    }

    if (onSendReply) {
      onSendReply(contact.id, reply);
    }

    setReplyContent('');
  };

  const handleAssignmentChange = (newAssignee) => {
    setAssignedTo(newAssignee);
    onAssignChange(contact.id, newAssignee);
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-gray-100 text-gray-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Mock admin list for assignment
  const adminList = [
    { id: '', name: 'Unassigned' },
    { id: 'admin1', name: 'Sarah Johnson' },
    { id: 'admin2', name: 'Michael Chen' },
    { id: 'admin3', name: 'Emily Rodriguez' },
    { id: 'current', name: currentAdmin }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Conversation Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{contact.name}</h3>
            <p className="text-blue-600 font-medium">{contact.subject}</p>
            <p className="text-sm text-gray-500">{contact.email}</p>
          </div>
          <Badge className={`${getStatusColor(contact.status)} border`}>
            {contact.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* Contact Info & Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Received: {format(new Date(contact.created_date), 'PPp')}</span>
            </div>
            {contact.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <span>📞</span>
                <span>{contact.phone}</span>
              </div>
            )}
            {contact.inquiry_type && (
              <div className="flex items-center gap-2 text-gray-600">
                <MessageSquare className="w-4 h-4" />
                <span className="capitalize">{contact.inquiry_type.replace('_', ' ')}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Assigned to</Label>
            <select
              value={assignedTo}
              onChange={(e) => handleAssignmentChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            >
              {adminList.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {conversation.map((message, index) => (
          <div key={message.id} className={`flex ${message.type === 'reply' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-4xl w-full ${message.type === 'reply' ? 'ml-8' : 'mr-8'}`}>
              <div className={`rounded-lg p-4 ${
                message.type === 'reply' 
                  ? 'bg-blue-50 border-l-4 border-blue-500' 
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                {/* Message Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      message.type === 'reply' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getInitials(message.sender)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{message.sender}</p>
                      <p className="text-xs text-gray-500">{message.senderEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {message.isOriginal && (
                      <Badge variant="outline" className="text-xs">Original</Badge>
                    )}
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(message.timestamp), 'MMM d, h:mm a')}</span>
                  </div>
                </div>

                {/* Message Content */}
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>

                {/* Message Actions */}
                {message.isOriginal && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Reply className="w-3 h-3" />
                      <span>{conversation.length - 1} {conversation.length === 2 ? 'reply' : 'replies'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Section */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="space-y-4">
          {/* Canned Responses Dropdown */}
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Quick Reply:</Label>
            <select
              value={selectedCannedResponse}
              onChange={(e) => handleCannedResponseSelect(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            >
              <option value="">Select a canned response...</option>
              {cannedResponses.map((response) => (
                <option key={response.id} value={response.id}>
                  {response.title} ({response.category})
                </option>
              ))}
            </select>
          </div>

          {/* Reply Textarea */}
          <div className="space-y-2">
            <Label htmlFor="reply">Your Reply</Label>
            <textarea
              id="reply"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply here..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Reply Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(contact.id, 'resolved')}
                className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
              >
                <CheckCircle className="w-4 h-4" />
                Mark Resolved
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => setReplyContent('')}
                disabled={!replyContent.trim()}
              >
                Clear
              </Button>
              <Button 
                onClick={handleSendReply}
                disabled={!replyContent.trim()}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 