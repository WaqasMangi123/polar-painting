const mongoose = require('mongoose');

// Schema for subheadings
const subheadingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Subheading title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Subheading content is required'],
    trim: true,
  },
  media: {
    type: String,
    default: null, // Path for media file (e.g., image, PDF)
  },
});

// Schema for the blog
const polarPaintingBlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
    trim: true,
  },
  author: {
    type: String,
    default: 'Anonymous', // Default author if not provided
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  media: {
    type: String,
    default: null, // Path for main blog media (e.g., image, PDF)
  },
  subheadings: {
    type: [subheadingSchema],
    default: [],
  },
});

// Model creation
const PolarPaintingBlog = mongoose.model('PolarPaintingBlog', polarPaintingBlogSchema);

module.exports = PolarPaintingBlog;
