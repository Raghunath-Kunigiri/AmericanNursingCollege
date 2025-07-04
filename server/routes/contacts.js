const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Contact = require('../models/Contact');

// GET /api/contacts - Get all contacts
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Contacts endpoint called, connection state:', mongoose.connection.readyState);
    
    // Check if MongoDB is connected - Use more robust check
    if (mongoose.connection.readyState !== 1) {
      console.log('📝 Using mock contacts data (DB not connected)');
      // Return shared mock data when database is not connected
      const contacts = global.mockStorage?.contacts || [];
      
      return res.json({
        contacts: contacts,
        pagination: {
          page: 1,
          limit: 50,
          total: contacts.length,
          pages: 1
        }
      });
    }

    const { 
      sort = '-createdAt', 
      status, 
      priority,
      assigned_to,
      page = 1,
      limit = 50 
    } = req.query;

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (assigned_to && assigned_to !== 'all') filter.assigned_to = assigned_to;

    const contacts = await Contact.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Contact.countDocuments(filter);

    res.json({
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.log('❌ Contacts endpoint error, falling back to mock data:', error.message);
    // Fallback to mock data on any error
    const contacts = global.mockStorage?.contacts || [];
    
    res.json({
      contacts: contacts,
      pagination: {
        page: 1,
        limit: 50,
        total: contacts.length,
        pages: 1
      }
    });
  }
});

// GET /api/contacts/stats/summary - Get contact statistics (MOVED BEFORE /:id)
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const summary = {
      total: 0,
      new: 0,
      in_progress: 0,
      resolved: 0
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

// GET /api/contacts/:id - Get single contact
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/contacts - Create new contact
router.post('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Create and store mock contact when database is not connected
      const mockContact = {
        _id: Date.now().toString(),
        ...req.body,
        status: 'new',
        conversation: [
          {
            message: req.body.message || req.body.inquiry,
            sender: req.body.name,
            is_admin_reply: false,
            timestamp: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Store in shared mock storage
      if (!global.mockStorage) {
        global.mockStorage = { contacts: [] };
      }
      if (!global.mockStorage.contacts) {
        global.mockStorage.contacts = [];
      }
      
      global.mockStorage.contacts.push(mockContact);
      
      console.log('📝 Mock contact created and stored (DB not connected):', mockContact.name);
      console.log('📊 Total mock contacts:', global.mockStorage.contacts.length);
      
      return res.status(201).json(mockContact);
    }

    const contact = new Contact(req.body);
    await contact.save();
    
    console.log('✅ Contact created in MongoDB:', contact.name);
    res.status(201).json(contact);
  } catch (error) {
    console.error('❌ Contact creation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/contacts/:id - Update contact
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/contacts/:id/status - Update contact status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const updateData = { status };
    if (status === 'resolved') {
      updateData.resolution_date = new Date();
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/contacts/:id/assign - Assign contact to admin
router.patch('/:id/assign', async (req, res) => {
  try {
    const { assigned_to } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        assigned_to,
        status: assigned_to ? 'in_progress' : 'new'
      },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/contacts/:id/reply - Add reply to conversation
router.post('/:id/reply', async (req, res) => {
  try {
    const { message, sender } = req.body;
    
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    contact.conversation.push({
      message,
      sender,
      is_admin_reply: true
    });

    // Update status to in_progress if it was new
    if (contact.status === 'new') {
      contact.status = 'in_progress';
    }

    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/contacts/:id - Delete contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;