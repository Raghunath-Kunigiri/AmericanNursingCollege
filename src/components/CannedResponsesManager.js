import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, MessageSquare, Tag, Clock 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

export function CannedResponsesManager() {
  const [responses, setResponses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingResponse, setEditingResponse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    tags: ''
  });

  useEffect(() => {
    loadCannedResponses();
  }, []);

  const loadCannedResponses = () => {
    const saved = localStorage.getItem('cannedResponses');
    if (saved) {
      setResponses(JSON.parse(saved));
    } else {
      // Initialize with some default responses
      const defaultResponses = [
        {
          id: 1,
          title: 'Admission Deadlines',
          category: 'Admissions',
          content: 'Thank you for your inquiry about admission deadlines. Our application deadline for the upcoming semester is [DATE]. We encourage you to apply early as spots fill up quickly. Please visit our website or contact our admissions office for the most current information.',
          tags: ['admissions', 'deadlines', 'dates'],
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Scholarship Information',
          category: 'Financial Aid',
          content: 'We offer various scholarship opportunities for qualified students. Our merit-based scholarships range from partial to full tuition coverage. To learn more about eligibility requirements and application procedures, please visit our financial aid page or schedule a meeting with our financial aid advisor.',
          tags: ['scholarships', 'financial aid', 'funding'],
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Program Requirements',
          category: 'Academic',
          content: 'Thank you for your interest in our nursing programs. Each program has specific prerequisites and requirements. For detailed information about course requirements, clinical hours, and graduation criteria, please refer to our academic catalog or schedule an appointment with an academic advisor.',
          tags: ['requirements', 'programs', 'academic'],
          createdAt: new Date().toISOString()
        }
      ];
      setResponses(defaultResponses);
      localStorage.setItem('cannedResponses', JSON.stringify(defaultResponses));
    }
  };

  const saveCannedResponses = (updatedResponses) => {
    setResponses(updatedResponses);
    localStorage.setItem('cannedResponses', JSON.stringify(updatedResponses));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const responseData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: editingResponse?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingResponse) {
      const updatedResponses = responses.map(response =>
        response.id === editingResponse.id
          ? { ...responseData, id: editingResponse.id }
          : response
      );
      saveCannedResponses(updatedResponses);
    } else {
      const newResponse = {
        ...responseData,
        id: Date.now()
      };
      saveCannedResponses([...responses, newResponse]);
    }

    resetForm();
  };

  const handleEdit = (response) => {
    setEditingResponse(response);
    setFormData({
      title: response.title,
      category: response.category,
      content: response.content,
      tags: response.tags.join(', ')
    });
    setIsEditing(true);
  };

  const handleDelete = (responseId) => {
    if (window.confirm('Are you sure you want to delete this canned response?')) {
      const updatedResponses = responses.filter(response => response.id !== responseId);
      saveCannedResponses(updatedResponses);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', category: '', content: '', tags: '' });
    setEditingResponse(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Canned Responses</h3>
          <p className="text-gray-600">Manage pre-written responses for common inquiries</p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Response
        </Button>
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingResponse ? 'Edit Response' : 'Add New Response'}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Admission Deadlines"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Admissions, Financial Aid"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Response Content</Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your response here..."
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., admissions, deadlines, dates"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingResponse ? 'Update' : 'Save'} Response
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {responses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Response
              </Button>
            </CardContent>
          </Card>
        ) : (
          responses.map((response) => (
            <Card key={response.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{response.title}</h4>
                      <Badge variant="outline">{response.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {response.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {response.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(response)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(response.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  Created {new Date(response.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 