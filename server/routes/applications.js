const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Application = require('../models/Application');

// GET /api/applications - Get all applications with sorting and filtering
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return shared mock data when database is not connected
      const applications = global.mockStorage?.applications || [];
      
      return res.json({
        applications: applications,
        pagination: {
          page: 1,
          limit: 50,
          total: applications.length,
          pages: 1
        }
      });
    }

    const { 
      sort = '-createdAt', 
      status, 
      program,
      page = 1,
      limit = 50 
    } = req.query;

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (program && program !== 'all') filter.program = program;

    const applications = await Application.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Application.countDocuments(filter);

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/applications/stats/summary - Get application statistics (MOVED BEFORE /:id)
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const summary = {
      total: 0,
      pending: 0,
      reviewing: 0,
      accepted: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      summary[stat._id] = stat.count;
      summary.total += stat.count;
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/applications/:id - Get single application
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/applications - Create new application
router.post('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Create and store mock application when database is not connected
      const mockApplication = {
        _id: Date.now().toString(),
        application_id: `ANC${Date.now()}`,
        ...req.body,
        status: 'pending',
        timeline: [
          {
            status: 'pending',
            note: 'Application submitted',
            updated_by: 'System',
            timestamp: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Store in shared mock storage
      if (!global.mockStorage) {
        global.mockStorage = { applications: [] };
      }
      if (!global.mockStorage.applications) {
        global.mockStorage.applications = [];
      }
      
      global.mockStorage.applications.push(mockApplication);
      
      console.log('📝 Mock application created and stored (DB not connected):', mockApplication.application_id);
      console.log('📊 Total mock applications:', global.mockStorage.applications.length);
      
      return res.status(201).json(mockApplication);
    }

    // Generate application_id before creating the document
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const application_id = `ANC${year}${random}`;

    // Create application data with generated ID
    const applicationData = {
      ...req.body,
      application_id: application_id,
      timeline: [
        {
          status: 'pending',
          note: 'Application submitted',
          updated_by: 'System',
          date: new Date()
        }
      ]
    };

    const application = new Application(applicationData);
    await application.save();
    
    console.log('✅ Application created in MongoDB:', application.application_id);
    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Application ID already exists' });
    } else {
      console.error('❌ Application creation error:', error);
      res.status(400).json({ error: error.message });
    }
  }
});

// PUT /api/applications/:id - Update application
router.put('/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/applications/:id/status - Update application status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, note, updated_by } = req.body;
    
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Add to timeline
    application.timeline.push({
      status,
      note,
      updated_by: updated_by || 'Admin'
    });

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/applications/:id - Delete application
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;