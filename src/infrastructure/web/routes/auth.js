const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const router = express.Router();

// Modèle User temporaire - plus tard on utilisera le vrai modèle
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

/**
 * POST /api/auth/login
 * Authentification de l'utilisateur
 */
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Tentative de connexion:', req.body);
    
    const { email, password } = req.body;

    // Validation des données
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Email et mot de passe requis'
      });
    }

    // Recherche de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email);
      return res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_ERROR',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_ERROR',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérification que l'utilisateur est actif
    if (!user.isActive) {
      console.log('❌ Utilisateur inactif:', email);
      return res.status(401).json({
        success: false,
        error: 'ACCOUNT_INACTIVE',
        message: 'Compte utilisateur désactivé'
      });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    console.log('✅ Connexion réussie pour:', email);

    // Réponse réussie
    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive
        }
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Erreur interne du serveur'
    });
  }
});

/**
 * POST /api/auth/register
 * Enregistrement d'un nouvel utilisateur
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Validation des données
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Email et mot de passe requis'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'USER_EXISTS',
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'user',
      isActive: true
    });

    await user.save();

    console.log('✅ Nouvel utilisateur créé:', email);

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive
        }
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Erreur interne du serveur'
    });
  }
});

/**
 * GET /api/auth/me
 * Récupération des informations de l'utilisateur connecté
 */
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'NO_TOKEN',
        message: 'Token d\'authentification requis'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive
        }
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Token invalide'
    });
  }
});

module.exports = router;