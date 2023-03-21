const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Get the authorization header from the request
  const authHeader = req.headers['authorization'];

  // Check if the authorization header is present and formatted correctly
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract the JWT from the authorization header
    const token = authHeader.split(' ')[1];

    try {
      // Verify the JWT and decode the payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the authenticated user to the request object
      req.user = { _id: decoded._id };
      
      // Call the next middleware in the chain
      next();
    } catch (error) {
      // If the JWT is invalid or expired, return an error response
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    // If the authorization header is missing or invalid, return an error response
    res.status(401).json({ message: 'Missing or invalid authorization header' });
  }
}

module.exports = authMiddleware;