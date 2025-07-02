import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Phone, Mail, MapPin, Calendar, Save, RefreshCw } from 'lucide-react';

const KeyInfoManager = () => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [contactInfo, setContactInfo] = useState({
    phone: '(555) 123-4567',
    email: 'admissions@americannursingcollege.edu',
    address: '123 Healthcare Drive, Medical City, MC 12345',
    emergencyPhone: '(555) 987-6543',
    fax: '(555) 123-4568'
  });

  const [admissionInfo, setAdmissionInfo] = useState({
    fallDeadline: '2024-08-15',
    springDeadline: '2024-12-15',
    summerDeadline: '2024-04-15',
    applicationFee: '50',
    earlyBirdDiscount: '25'
  });

  const [programInfo, setProgramInfo] = useState({
    bsnDuration: '4 years',
    gnmDuration: '3 years',
    mltDuration: '2 years',
    ctDuration: '18 months',
    pmhaDuration: '1 year',
    paramedicalDuration: '2.5 years'
  });

  useEffect(() => {
    loadKeyInfo();
  }, []);

  const loadKeyInfo = () => {
    // Load from localStorage if available
    const savedContactInfo = localStorage.getItem('anc_contact_info');
    const savedAdmissionInfo = localStorage.getItem('anc_admission_info');
    const savedProgramInfo = localStorage.getItem('anc_program_info');

    if (savedContactInfo) {
      setContactInfo(JSON.parse(savedContactInfo));
    }
    if (savedAdmissionInfo) {
      setAdmissionInfo(JSON.parse(savedAdmissionInfo));
    }
    if (savedProgramInfo) {
      setProgramInfo(JSON.parse(savedProgramInfo));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('anc_contact_info', JSON.stringify(contactInfo));
      localStorage.setItem('anc_admission_info', JSON.stringify(admissionInfo));
      localStorage.setItem('anc_program_info', JSON.stringify(programInfo));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving key info:', error);
    }
    setLoading(false);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all information to defaults?')) {
      localStorage.removeItem('anc_contact_info');
      localStorage.removeItem('anc_admission_info');
      localStorage.removeItem('anc_program_info');
      loadKeyInfo();
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Main Phone</label>
              <Input
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Emergency Phone</label>
              <Input
                value={contactInfo.emergencyPhone}
                onChange={(e) => setContactInfo({ ...contactInfo, emergencyPhone: e.target.value })}
                placeholder="(555) 987-6543"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                placeholder="admissions@college.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fax</label>
              <Input
                value={contactInfo.fax}
                onChange={(e) => setContactInfo({ ...contactInfo, fax: e.target.value })}
                placeholder="(555) 123-4568"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <Textarea
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                placeholder="123 Healthcare Drive, Medical City, MC 12345"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admission Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Admission Deadlines & Fees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fall Semester Deadline</label>
              <Input
                type="date"
                value={admissionInfo.fallDeadline}
                onChange={(e) => setAdmissionInfo({ ...admissionInfo, fallDeadline: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Spring Semester Deadline</label>
              <Input
                type="date"
                value={admissionInfo.springDeadline}
                onChange={(e) => setAdmissionInfo({ ...admissionInfo, springDeadline: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Summer Semester Deadline</label>
              <Input
                type="date"
                value={admissionInfo.summerDeadline}
                onChange={(e) => setAdmissionInfo({ ...admissionInfo, summerDeadline: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Application Fee ($)</label>
              <Input
                type="number"
                value={admissionInfo.applicationFee}
                onChange={(e) => setAdmissionInfo({ ...admissionInfo, applicationFee: e.target.value })}
                placeholder="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Early Bird Discount ($)</label>
              <Input
                type="number"
                value={admissionInfo.earlyBirdDiscount}
                onChange={(e) => setAdmissionInfo({ ...admissionInfo, earlyBirdDiscount: e.target.value })}
                placeholder="25"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Duration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Program Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bachelor of Science in Nursing</label>
              <Input
                value={programInfo.bsnDuration}
                onChange={(e) => setProgramInfo({ ...programInfo, bsnDuration: e.target.value })}
                placeholder="4 years"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">General Nursing & Midwifery</label>
              <Input
                value={programInfo.gnmDuration}
                onChange={(e) => setProgramInfo({ ...programInfo, gnmDuration: e.target.value })}
                placeholder="3 years"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Medical Lab Technician</label>
              <Input
                value={programInfo.mltDuration}
                onChange={(e) => setProgramInfo({ ...programInfo, mltDuration: e.target.value })}
                placeholder="2 years"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cardiology Technician</label>
              <Input
                value={programInfo.ctDuration}
                onChange={(e) => setProgramInfo({ ...programInfo, ctDuration: e.target.value })}
                placeholder="18 months"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Multipurpose Health Assistant</label>
              <Input
                value={programInfo.pmhaDuration}
                onChange={(e) => setProgramInfo({ ...programInfo, pmhaDuration: e.target.value })}
                placeholder="1 year"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Paramedical in Nursing</label>
              <Input
                value={programInfo.paramedicalDuration}
                onChange={(e) => setProgramInfo({ ...programInfo, paramedicalDuration: e.target.value })}
                placeholder="2.5 years"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reset to Defaults
        </Button>
        
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-green-600 text-sm font-medium">
              ✓ Changes saved successfully
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Info Panel */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Integration Info</h4>
              <p className="text-sm text-blue-700">
                Changes made here will be reflected across the website including the contact page, 
                application forms, and program pages. The information is automatically synchronized 
                when you save changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyInfoManager; 