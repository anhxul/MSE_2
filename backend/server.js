const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const dns = require('dns').promises;
const path = require("path");

const app = express();

// DNS fix
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Middleware
app.use(cors());
app.use(express.json());

// ✅ API routes FIRST
app.use('/api', authRoutes);

// ✅ Static serve AFTER API
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ✅ React routing FIX (Express v5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });