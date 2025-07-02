// Sample data for testing the admin dashboard
export const createSampleData = () => {
  // Helper to create realistic timestamps over the past weeks
  const getRandomDateInRange = (daysAgo, variance = 0) => {
    const baseDate = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);
    const randomOffset = variance > 0 ? (Math.random() - 0.5) * variance * 24 * 60 * 60 * 1000 : 0;
    return new Date(baseDate + randomOffset).toISOString();
  };

  // Sample applications with realistic distribution over time
  const sampleApplications = [
    // Recent applications (this week)
    {
      id: "1",
      application_id: "APP-1701234567890",
      full_name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1234567890",
      program: "bachelor_nursing",
      status: "pending",
      created_date: getRandomDateInRange(0.5), // Today
      date_of_birth: "1995-05-15",
      address: "123 Main St, Anytown, State 12345",
      education_level: "High School Graduate",
      gpa: "3.8",
      motivation: "I am passionate about helping others and want to make a difference in healthcare."
    },
    {
      id: "2", 
      application_id: "APP-1701234567891",
      full_name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+1234567891",
      program: "general_nursing_midwifery",
      status: "accepted",
      created_date: getRandomDateInRange(1), // Yesterday
      date_of_birth: "1992-08-22",
      address: "456 Oak Ave, Somewhere, State 67890",
      education_level: "Some College",
      gpa: "3.6",
      motivation: "Healthcare has always been my calling, especially maternal care."
    },
    {
      id: "3",
      application_id: "APP-1701234567892", 
      full_name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      phone: "+1234567892",
      program: "medical_lab_technician",
      status: "reviewing",
      created_date: getRandomDateInRange(2), // 2 days ago
      date_of_birth: "1998-12-03",
      address: "789 Pine St, Elsewhere, State 54321",
      education_level: "Bachelor's Degree",
      gpa: "3.9",
      motivation: "I love the precision and accuracy required in laboratory work."
    },
    {
      id: "4",
      application_id: "APP-1701234567893",
      full_name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "+1234567893",
      program: "cardiology_technician",
      status: "pending",
      created_date: getRandomDateInRange(3), // 3 days ago
      date_of_birth: "1990-07-12",
      address: "321 Elm St, Newtown, State 98765",
      education_level: "Associate Degree",
      gpa: "3.7",
      motivation: "Cardiac care is where I believe I can make the biggest impact."
    },
    {
      id: "5",
      application_id: "APP-1701234567894",
      full_name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "+1234567894",
      program: "bachelor_nursing",
      status: "pending",
      created_date: getRandomDateInRange(4), // 4 days ago
      date_of_birth: "1996-03-08",
      address: "654 Maple Dr, Oldtown, State 13579",
      education_level: "High School Graduate",
      gpa: "3.5",
      motivation: "I want to serve my community through quality healthcare."
    },
    // Last week's applications
    {
      id: "6",
      application_id: "APP-1701234567895",
      full_name: "David Kim",
      email: "david.kim@email.com",
      phone: "+1234567895",
      program: "general_nursing_midwifery",
      status: "rejected",
      created_date: getRandomDateInRange(8, 2), // Last week
      date_of_birth: "1993-11-20",
      address: "987 Oak Lane, Riverside, State 24680",
      education_level: "Some College",
      gpa: "2.9",
      motivation: "Healthcare is my passion and I'm ready to commit fully."
    },
    {
      id: "7",
      application_id: "APP-1701234567896",
      full_name: "Amanda Foster",
      email: "amanda.foster@email.com",
      phone: "+1234567896",
      program: "medical_lab_technician",
      status: "accepted",
      created_date: getRandomDateInRange(10, 1), // Last week
      date_of_birth: "1994-09-14",
      address: "147 Cedar Ave, Westfield, State 86420",
      education_level: "Bachelor's Degree",
      gpa: "3.8",
      motivation: "Laboratory science combines my love for accuracy and helping patients."
    }
  ];

  // Sample contacts with realistic distribution
  const sampleContacts = [
    {
      id: "MSG1701234567890",
      name: "John Doe",
      email: "john.doe@email.com", 
      phone: "+1234567893",
      subject: "Nursing Program Information",
      message: "I'm interested in learning more about your nursing programs. Could you send me detailed information about course structure and requirements?",
      inquiry_type: "program_info",
      status: "new",
      created_date: getRandomDateInRange(0.2) // Recent today
    },
    {
      id: "MSG1701234567891",
      name: "Lisa Wang",
      email: "lisa.wang@email.com",
      phone: "+1234567894", 
      subject: "BSN Admission Requirements",
      message: "What are the admission requirements for the BSN program? I have a Bachelor's degree in Biology and want to pursue nursing.",
      inquiry_type: "admissions",
      status: "in_progress",
      created_date: getRandomDateInRange(1) // Yesterday
    },
    {
      id: "MSG1701234567892",
      name: "Robert Taylor",
      email: "robert.taylor@email.com",
      phone: "+1234567895",
      subject: "Financial Aid Information",
      message: "Can you provide information about financial aid options? I'm a veteran and wondering about specific programs available.",
      inquiry_type: "financial_aid", 
      status: "resolved",
      created_date: getRandomDateInRange(2) // 2 days ago
    },
    {
      id: "MSG1701234567893",
      name: "Sophie Martinez",
      email: "sophie.martinez@email.com",
      phone: "+1234567897",
      subject: "Clinical Placement Question",
      message: "Hi, I wanted to ask about clinical placement opportunities. Are there partnerships with local hospitals?",
      inquiry_type: "program_info",
      status: "new",
      created_date: getRandomDateInRange(0.5) // Today
    },
    {
      id: "MSG1701234567894",
      name: "Kevin Brown",
      email: "kevin.brown@email.com",
      phone: "+1234567898",
      subject: "Transfer Credits",
      message: "I have some college credits from another institution. Can these be transferred to your nursing program?",
      inquiry_type: "admissions",
      status: "new",
      created_date: getRandomDateInRange(1.5) // Yesterday
    },
    {
      id: "MSG1701234567895",
      name: "Rachel Green",
      email: "rachel.green@email.com",
      phone: "+1234567899",
      subject: "Schedule Information",
      message: "Are there evening or weekend classes available? I work full-time and need flexible scheduling options.",
      inquiry_type: "program_info",
      status: "resolved",
      created_date: getRandomDateInRange(7, 1) // Last week
    }
  ];

  // Store in localStorage
  localStorage.setItem('applications', JSON.stringify(sampleApplications));
  localStorage.setItem('contacts', JSON.stringify(sampleContacts));
  
  console.log('Sample data created successfully!');
  console.log(`Created ${sampleApplications.length} sample applications`);
  console.log(`Created ${sampleContacts.length} sample contacts`);
};

// Clear all data
export const clearSampleData = () => {
  localStorage.removeItem('applications');
  localStorage.removeItem('contacts');
  console.log('Sample data cleared!');
}; 