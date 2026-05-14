const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const validApiToken = process.env.API_TOKEN || 'notif-demo-token';

  if (!token || token !== validApiToken) {
    res.status(401);
    throw new Error('Unauthorized access to notification API');
  }

  next();
};

module.exports = protect;
