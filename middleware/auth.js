const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protéger les routes avec JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extraire le token
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur (sans le password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user || req.user.Sommeil) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non autorisé'
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé, token manquant'
    });
  }
};

// Autoriser certains rôles
const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.isGodMode ? 'admin' : 'user';
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Rôle ${userRole} non autorisé pour cette action`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };