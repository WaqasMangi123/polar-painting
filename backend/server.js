const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogroutes');
const contactFormRoute = require('./routes/contactformroute');
const quoteRoute = require('./routes/quoteroute'); // Import the new quote route
const analyticsRoute = require('./routes/analyticroute'); // Import the analytics route
const estimatorEmailRoute = require('./routes/estimatoremail');

dotenv.config();

const app = express();

// CORS options configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log(error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogroutes', blogRoutes);
app.use('/api/contact', contactFormRoute);
app.use('/api/quote', quoteRoute); // Link the new route
app.use('/api/analyticroute', analyticsRoute); // Analytics route
app.use('/api/estimatoremail', estimatorEmailRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
