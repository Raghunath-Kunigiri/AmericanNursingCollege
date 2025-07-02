import { startOfWeek, endOfWeek, isWithinInterval, subWeeks, format, isToday, isYesterday } from 'date-fns';

// Calculate trend percentage between two time periods
export const calculateTrend = (currentData, compareData, timeFrame = 'week') => {
  const now = new Date();
  const currentPeriodStart = timeFrame === 'week' 
    ? startOfWeek(now) 
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const currentPeriodEnd = timeFrame === 'week'
    ? endOfWeek(now)
    : new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const previousPeriodStart = timeFrame === 'week'
    ? startOfWeek(subWeeks(now, 1))
    : new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousPeriodEnd = timeFrame === 'week'
    ? endOfWeek(subWeeks(now, 1))
    : new Date(now.getFullYear(), now.getMonth(), 0);

  const currentCount = currentData.filter(item => {
    const itemDate = new Date(item.created_date);
    return isWithinInterval(itemDate, { start: currentPeriodStart, end: currentPeriodEnd });
  }).length;

  const previousCount = currentData.filter(item => {
    const itemDate = new Date(item.created_date);
    return isWithinInterval(itemDate, { start: previousPeriodStart, end: previousPeriodEnd });
  }).length;

  if (previousCount === 0) return currentCount > 0 ? 100 : 0;
  return Math.round(((currentCount - previousCount) / previousCount) * 100);
};

// Get recent pending applications
export const getRecentPendingApplications = (applications, limit = 5) => {
  return applications
    .filter(app => app.status === 'pending')
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, limit);
};

// Get recent new messages
export const getRecentNewMessages = (contacts, limit = 5) => {
  return contacts
    .filter(contact => contact.status === 'new')
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, limit);
};

// Get applications data for the last 7 days
export const getApplicationsThisWeek = (applications) => {
  const weekData = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const dayApplications = applications.filter(app => {
      const appDate = new Date(app.created_date);
      return appDate.toDateString() === date.toDateString();
    }).length;

    weekData.push({
      date: format(date, 'MMM dd'),
      day: format(date, 'E'),
      applications: dayApplications,
      isToday: isToday(date),
      isYesterday: isYesterday(date)
    });
  }
  
  return weekData;
};

// Generate activity feed
export const generateActivityFeed = (applications, contacts) => {
  const activities = [];
  
  // Recent application status changes
  applications
    .filter(app => app.status !== 'pending')
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 3)
    .forEach(app => {
      activities.push({
        id: `app-${app.id}`,
        type: 'application',
        action: app.status,
        data: app,
        timestamp: app.created_date,
        message: `Application ${app.status} for ${app.full_name}`
      });
    });

  // Recent contact resolutions
  contacts
    .filter(contact => contact.status === 'resolved')
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 2)
    .forEach(contact => {
      activities.push({
        id: `contact-${contact.id}`,
        type: 'contact',
        action: 'resolved',
        data: contact,
        timestamp: contact.created_date,
        message: `Message resolved from ${contact.name}`
      });
    });

  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);
};

// Get time-based label for trends
export const getTrendLabel = (timeFrame = 'week') => {
  return timeFrame === 'week' ? 'vs last week' : 'vs last month';
}; 