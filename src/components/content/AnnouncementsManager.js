import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Megaphone, Plus, Edit, Trash2, Eye, EyeOff, Save, X, Calendar, AlertCircle } from 'lucide-react';
import { Announcement } from '../../entities/Announcement';
import { format } from 'date-fns';

const AnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    priority: 'normal',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    targetPages: ['homepage'],
    isActive: false
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await Announcement.list();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
    setLoading(false);
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      startDate: announcement.startDate.split('T')[0],
      endDate: announcement.endDate ? announcement.endDate.split('T')[0] : '',
      targetPages: announcement.targetPages,
      isActive: announcement.isActive
    });
    setIsEditing(true);
  };

  const handleAdd = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      content: '',
      type: 'info',
      priority: 'normal',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      targetPages: ['homepage'],
      isActive: false
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const saveData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
      };

      if (editingAnnouncement) {
        await Announcement.update(editingAnnouncement.id, saveData);
      } else {
        await Announcement.create(saveData);
      }
      await loadAnnouncements();
      setIsEditing(false);
      setEditingAnnouncement(null);
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await Announcement.delete(id);
        await loadAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  const handleToggleActive = async (announcement) => {
    try {
      if (announcement.isActive) {
        await Announcement.deactivate(announcement.id);
      } else {
        await Announcement.activate(announcement.id);
      }
      await loadAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingAnnouncement(null);
  };

  const handleTargetPageChange = (page, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        targetPages: [...formData.targetPages, page]
      });
    } else {
      setFormData({
        ...formData,
        targetPages: formData.targetPages.filter(p => p !== page)
      });
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[type] || colors.info;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.normal;
  };

  const isExpired = (announcement) => {
    if (!announcement.endDate) return false;
    return new Date(announcement.endDate) < new Date();
  };

  const targetPageOptions = [
    { value: 'homepage', label: 'Homepage' },
    { value: 'applications', label: 'Applications Page' },
    { value: 'programs', label: 'Programs Page' },
    { value: 'all', label: 'All Pages' }
  ];

  if (loading) {
    return <div className="flex justify-center py-8">Loading announcements...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            Announcements Management
          </CardTitle>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Announcement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-4">
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Announcement title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Announcement message"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">End Date (Optional)</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Pages</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {targetPageOptions.map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.targetPages.includes(option.value)}
                        onChange={(e) => handleTargetPageChange(option.value, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Activate immediately
                </label>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`p-4 border rounded-lg ${
                announcement.isActive && !isExpired(announcement) 
                  ? 'bg-white border-l-4 border-l-blue-500' 
                  : 'bg-gray-50 opacity-75'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{announcement.title}</h4>
                    <Badge className={getTypeColor(announcement.type)}>
                      {announcement.type}
                    </Badge>
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                    <Badge className={
                      announcement.isActive && !isExpired(announcement)
                        ? 'bg-green-100 text-green-800' 
                        : isExpired(announcement)
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }>
                      {announcement.isActive && !isExpired(announcement) 
                        ? 'Active' 
                        : isExpired(announcement)
                        ? 'Expired'
                        : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{announcement.content}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(announcement.startDate), 'MMM d, yyyy')}
                      {announcement.endDate && (
                        <> - {format(new Date(announcement.endDate), 'MMM d, yyyy')}</>
                      )}
                    </span>
                    <span>Pages: {announcement.targetPages.join(', ')}</span>
                  </div>
                  
                  {isExpired(announcement) && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      This announcement has expired
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(announcement)}
                    className="flex items-center gap-1"
                  >
                    {announcement.isActive ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(announcement)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(announcement.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-8">
            <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No announcements yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Create your first announcement to communicate with website visitors
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementsManager; 