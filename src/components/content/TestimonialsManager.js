import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Star, Plus, Edit, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { Testimonial } from '../../entities/Testimonial';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    program: '',
    content: '',
    image: '',
    rating: 5,
    isActive: true
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await Testimonial.list();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    }
    setLoading(false);
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      program: testimonial.program,
      content: testimonial.content,
      image: testimonial.image,
      rating: testimonial.rating,
      isActive: testimonial.isActive
    });
    setIsEditing(true);
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      role: '',
      program: '',
      content: '',
      image: '',
      rating: 5,
      isActive: true
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (editingTestimonial) {
        await Testimonial.update(editingTestimonial.id, formData);
      } else {
        await Testimonial.create(formData);
      }
      await loadTestimonials();
      setIsEditing(false);
      setEditingTestimonial(null);
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await Testimonial.delete(id);
        await loadTestimonials();
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  const handleToggleActive = async (testimonial) => {
    try {
      await Testimonial.update(testimonial.id, { isActive: !testimonial.isActive });
      await loadTestimonials();
    } catch (error) {
      console.error('Error toggling testimonial:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingTestimonial(null);
  };

  const programs = [
    'General Nursing & Midwifery',
    'Bachelor of Science in Nursing',
    'Paramedical in Nursing',
    'Medical Lab Technician',
    'Cardiology Technician',
    'Multipurpose Health Assistant'
  ];

  const roles = [
    'Current Student',
    'Graduate',
    'Working Professional',
    'Recent Graduate',
    'Alumni'
  ];

  if (loading) {
    return <div className="flex justify-center py-8">Loading testimonials...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Testimonials Management
          </CardTitle>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-4">
              {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Student name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select role</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Program</label>
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select program</option>
                  {programs.map(program => (
                    <option key={program} value={program}>{program}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded-md"
                >
                  {[1, 2, 3, 4, 5].map(rating => (
                    <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Testimonial Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Share your experience with our programs..."
                  rows={4}
                />
              </div>
              <div className="md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Show on website
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
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`p-4 border rounded-lg ${
                testimonial.isActive ? 'bg-white' : 'bg-gray-50 opacity-75'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role} • {testimonial.program}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Badge className={testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {testimonial.isActive ? 'Active' : 'Hidden'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{testimonial.content}</p>
                  {testimonial.image && (
                    <p className="text-xs text-gray-500">Image: {testimonial.image}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(testimonial)}
                    className="flex items-center gap-1"
                  >
                    {testimonial.isActive ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(testimonial)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(testimonial.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No testimonials yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Add your first testimonial to showcase student experiences
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestimonialsManager; 