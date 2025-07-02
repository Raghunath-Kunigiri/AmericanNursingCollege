import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Announcement } from '../entities/Announcement';

const AnnouncementBanner = ({ targetPage = 'homepage' }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState(new Set());

  useEffect(() => {
    loadActiveAnnouncements();
  }, [targetPage]);

  const loadActiveAnnouncements = async () => {
    try {
      const active = await Announcement.getActive();
      // Filter announcements for the current page
      const filtered = active.filter(announcement => 
        announcement.targetPages.includes(targetPage) || 
        announcement.targetPages.includes('all')
      );
      setAnnouncements(filtered);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  };

  const handleDismiss = (announcementId) => {
    setDismissedAnnouncements(prev => new Set([...prev, announcementId]));
    // In a real app, you might want to store this in localStorage or send to backend
    const dismissed = JSON.parse(localStorage.getItem('dismissed_announcements') || '[]');
    dismissed.push(announcementId);
    localStorage.setItem('dismissed_announcements', JSON.stringify(dismissed));
  };

  const getTypeIcon = (type) => {
    const icons = {
      info: AlertCircle,
      success: CheckCircle,
      warning: AlertTriangle,
      error: XCircle
    };
    return icons[type] || AlertCircle;
  };

  const getTypeColors = (type) => {
    const colors = {
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-600'
      },
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: 'text-green-600'
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: 'text-yellow-600'
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: 'text-red-600'
      }
    };
    return colors[type] || colors.info;
  };

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(
    announcement => !dismissedAnnouncements.has(announcement.id)
  );

  if (visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {visibleAnnouncements.map((announcement) => {
        const Icon = getTypeIcon(announcement.type);
        const colors = getTypeColors(announcement.type);
        
        return (
          <div
            key={announcement.id}
            className={`${colors.bg} ${colors.border} border rounded-lg p-4 shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
                <div className="flex-1">
                  <h4 className={`font-semibold ${colors.text}`}>
                    {announcement.title}
                  </h4>
                  <p className={`mt-1 text-sm ${colors.text} opacity-90`}>
                    {announcement.content}
                  </p>
                  {announcement.priority === 'urgent' && (
                    <span className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDismiss(announcement.id)}
                className={`ml-4 flex-shrink-0 p-1 rounded-md hover:bg-white/50 transition-colors ${colors.text}`}
                aria-label="Dismiss announcement"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnnouncementBanner; 