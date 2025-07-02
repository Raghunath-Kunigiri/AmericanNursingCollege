const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// GET /api/testimonials - Get all testimonials
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return shared mock data when database is not connected
      const testimonials = global.mockStorage?.testimonials || [];
      
      return res.json({
        testimonials: testimonials,
        pagination: {
          page: 1,
          limit: 50,
          total: testimonials.length,
          pages: 1
        }
      });
    }

    const { 
      sort = 'order createdAt',
      isActive,
      featured,
      program,
      page = 1,
      limit = 50 
    } = req.query;

    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (featured !== undefined) filter.featured = featured === 'true';
    if (program && program !== 'all') filter.program = program;

    const testimonials = await Testimonial.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Testimonial.countDocuments(filter);

    res.json({
      testimonials,
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

// GET /api/testimonials/active - Get only active testimonials for public display
router.get('/active', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort('order createdAt')
      .select('name role program content image rating featured');
    
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/testimonials/:id - Get single testimonial
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/testimonials - Create new testimonial
router.post('/', async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/testimonials/:id - Update testimonial
router.put('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/testimonials/:id/toggle - Toggle testimonial active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();
    
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/testimonials/:id/feature - Toggle testimonial featured status
router.patch('/:id/feature', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    testimonial.featured = !testimonial.featured;
    await testimonial.save();
    
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/testimonials/:id - Delete testimonial
router.delete('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 