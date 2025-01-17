const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const PolarPaintingBlog = require('../models/polarpaintingblog'); // Import the schema model
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Serve static files from the uploads directory
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Create a new blog
router.post('/blogs', upload.single('media'), async (req, res) => {
  try {
    const { title, content, author, subheadings } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and Content are required.' });
    }

    const parsedSubheadings = subheadings ? JSON.parse(subheadings) : [];
    const enrichedSubheadings = parsedSubheadings.map((subheading) => ({
      title: subheading.title || '',
      content: subheading.content || '',
      media: subheading.media || '', // Optional subheading media
    }));

    const blog = new PolarPaintingBlog({
      title,
      content,
      author: author || 'Anonymous', // Default author if not provided
      subheadings: enrichedSubheadings,
      media: req.file ? req.file.path.replace(/\\/g, '/') : '', // Normalize path
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      views: 0,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ error: 'Failed to create blog.' });
  }
});

// Update an existing blog
router.put('/blogs/:id', upload.single('media'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author, subheadings } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and Content are required.' });
    }

    const parsedSubheadings = subheadings ? JSON.parse(subheadings) : [];
    const enrichedSubheadings = parsedSubheadings.map((subheading) => ({
      title: subheading.title || '',
      content: subheading.content || '',
      media: subheading.media || '', // Optional subheading media
    }));

    const updatedData = {
      title,
      content,
      author: author || 'Anonymous', // Default author if not provided
      subheadings: enrichedSubheadings,
      updatedAt: new Date(),
    };

    if (req.file) {
      updatedData.media = req.file.path.replace(/\\/g, '/'); // Normalize path
    }

    const blog = await PolarPaintingBlog.findByIdAndUpdate(id, updatedData, { new: true });

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    res.status(200).json(blog);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ error: 'Failed to update blog.' });
  }
});

// Get all blogs
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await PolarPaintingBlog.find();
    res.status(200).json(blogs.map((blog) => ({
      ...blog.toObject(),
      media: blog.media ? `http://localhost:5000/${blog.media}` : '',
    })));
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ error: 'Failed to fetch blogs.' });
  }
});

// Get a single blog by ID and increment views
router.get('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await PolarPaintingBlog.findById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    blog.views += 1;
    await blog.save();

    res.status(200).json({
      ...blog.toObject(),
      media: blog.media ? `http://localhost:5000/${blog.media}` : '',
    });
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ error: 'Failed to fetch blog.' });
  }
});

// Add a subheading to an existing blog
router.put('/blogs/:id/subheading', upload.single('media'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: 'Subheading Title and Content are required.' });
    }

    const newSubheading = {
      title,
      content,
      media: req.file ? req.file.path.replace(/\\/g, '/') : '',
    };

    const blog = await PolarPaintingBlog.findByIdAndUpdate(
      id,
      {
        $push: { subheadings: newSubheading },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    res.status(200).json(blog);
  } catch (err) {
    console.error('Error adding subheading:', err);
    res.status(500).json({ error: 'Failed to add subheading.' });
  }
});

// Like a blog
router.put('/blogs/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await PolarPaintingBlog.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    res.status(200).json(blog);
  } catch (err) {
    console.error('Error liking blog:', err);
    res.status(500).json({ error: 'Failed to like blog.' });
  }
});

// Delete a blog
router.delete('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await PolarPaintingBlog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    res.status(200).json({ message: 'Blog deleted successfully.' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ error: 'Failed to delete blog.' });
  }
});

module.exports = router;