# American Nursing College - Database Structure

## 📊 Database Configuration

**Database Name**: `AmericanCollege`
**MongoDB Atlas Cluster**: `acn.oa10h.mongodb.net`
**Connection Status**: ✅ Connected

## 🗂️ Collections Structure

### 1. 📋 Admissions Collection
- **Collection Name**: `Admissions`
- **Purpose**: Store all student application data
- **Model**: `Application.js`
- **API Endpoint**: `/api/applications`

**Data Structure:**
```json
{
  "application_id": "ANC20259531",
  "full_name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "555-1234",
  "program": "bachelor_nursing",
  "status": "pending",
  "date_of_birth": "1995-03-15",
  "address": "456 College Ave",
  "emergency_contact": {
    "name": "Jane Smith",
    "phone": "555-5678",
    "relationship": "Mother"
  },
  "education": {
    "highest_qualification": "Bachelor Degree",
    "institution": "City University",
    "year_completed": 2022,
    "percentage": 92
  },
  "documents": {
    "id_proof": "",
    "education_certificates": "",
    "medical_certificate": ""
  },
  "notes": "",
  "timeline": [
    {
      "status": "pending",
      "note": "Application submitted",
      "updated_by": "System",
      "date": "2025-07-02T22:37:13.894Z"
    }
  ],
  "createdAt": "2025-07-02T22:37:13.909Z",
  "updatedAt": "2025-07-02T22:37:13.909Z"
}
```

### 2. 👥 Students Collection
- **Collection Name**: `students` 
- **Purpose**: Store contact messages and inquiries
- **Model**: `Contact.js`
- **API Endpoint**: `/api/contacts`

**Data Structure:**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah.j@example.com",
  "phone": "555-9876",
  "subject": "Admission Inquiry",
  "message": "I would like to know more about the nursing programs available",
  "inquiry_type": "admissions",
  "status": "new",
  "assigned_to": null,
  "priority": "normal",
  "conversation": [
    {
      "message": "I would like to know more about the nursing programs available",
      "sender": "Sarah Johnson",
      "is_admin_reply": false,
      "timestamp": "2025-07-02T22:39:15.123Z"
    }
  ],
  "tags": [],
  "notes": "",
  "resolution_date": null,
  "createdAt": "2025-07-02T22:39:15.123Z",
  "updatedAt": "2025-07-02T22:39:15.123Z"
}
```

## 🚀 Current Data Summary

- **Total Applications**: 6 entries in `AmericanCollege.Admissions`
- **Total Contacts**: Multiple entries in `AmericanCollege.students`
- **Database Status**: Successfully connected and operational

## 📝 How Data Flows

1. **Student Admissions Form** → `AmericanCollege.Admissions` collection
2. **Contact/Message Form** → `AmericanCollege.students` collection
3. **Admin Dashboard** → Displays data from both collections
4. **API Endpoints** → Serve data from respective collections

## 🔧 Technical Details

- **Auto-generated Application IDs**: Format `ANC{YEAR}{4-digit-random}`
- **Timestamps**: Automatic creation and update timestamps
- **Validation**: Required fields enforced at database level
- **Relationships**: Collections are independent but can be linked by email
- **Backup**: Data persists in MongoDB Atlas cloud storage

## 🌐 Access Methods

1. **API Direct**: `http://localhost:5000/api/applications` and `http://localhost:5000/api/contacts`
2. **Admin Dashboard**: View and manage through web interface
3. **MongoDB Atlas**: Direct database access through Atlas console
4. **Form Submissions**: Automatic storage when students submit forms

---

✅ **Database successfully reorganized as requested:**
- Admissions data → `AmericanCollege > Admissions`
- Contact/Message data → `AmericanCollege > students` 