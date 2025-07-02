const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Announcement = require('../models/Announcement');

// GET /api/announcements - Get all announcements
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return shared mock data when database is not connected
      const announcements = global.mockStorage?.announcements || [];
      
      return res.json({
        announcements: announcements,
        pagination: {
          page: 1,
          limit: 50,
          total: announcements.length,
          pages: 1
        }
      });
    }

    const { 
      sort = '-priority -createdAt',
      isActive,
      type,
      priority,
      targetPage,
      page = 1,
      limit = 50 
    } = req.query;

    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (type && type !== 'all') filter.type = type;
    if (priority && priority !== 'all') filter.priority = priority;
    if (targetPage && targetPage !== 'all') filter.targetPages = targetPage;

    const announcements = await Announcement.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Announcement.countDocuments(filter);

    res.json({
      announcements,
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

// GET /api/announcements/active/:page - Get active announcements for specific page
router.get('/active/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const now = new Date();
    
    const filter = {
      isActive: true,
      startDate: { $lte: now },
      $or: [
        { endDate: null },
        { endDate: { $gte: now } }
      ],
      $or: [
        { targetPages: page },
        { targetPages: 'all' }
      ]
    };

    const announcements = await Announcement.find(filter)
      .sort('-priority -createdAt')
      .select('title content type priority');
    
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/announcements/:id - Get single announcement
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/announcements - Create new announcement
router.post('/', async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/announcements/:id - Update announcement
router.put('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.json(announcement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/announcements/:id/toggle - Toggle announcement active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    announcement.isActive = !announcement.isActive;
    await announcement.save();
    
    res.json(announcement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/announcements/:id - Delete announcement
router.delete('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 