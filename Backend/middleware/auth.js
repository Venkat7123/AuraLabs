const supabase = require('../supabase');

const requireAuth = async (req, res, next) => {
  try {
    // 1. Get the token from the Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // 3. Attach the user object to the request so your routes can use it
    req.user = user;
    
    // 4. Move to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

module.exports = requireAuth;