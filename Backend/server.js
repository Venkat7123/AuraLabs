require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');
const requireAuth = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors()); // Allows your Next.js frontend to make requests
app.use(express.json());

// --- ROUTES ---

// Example Protected Route: Get Dashboard Subjects
app.get('/api/subjects', requireAuth, async (req, res) => {
  try {
    // Because we used requireAuth, req.user is guaranteed to exist here
    const userId = req.user.id;

    // Fetch from Supabase. 
    // RLS will automatically ensure they only get their own subjects, 
    // but we can explicitly filter by user_id as well for good measure.
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AuraLab Backend running on port ${PORT}`);
});