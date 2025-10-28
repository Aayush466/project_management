import jwt from 'jsonwebtoken';
import environmentVariables from '../config/env.js';
import User from '../modules/user/user.model.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'Access token missing' });
    }

    const decoded = jwt.verify(token, environmentVariables.accessTokenSecret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default authMiddleware;
