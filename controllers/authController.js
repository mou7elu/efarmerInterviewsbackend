const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Générer le token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Inscription utilisateur
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, Nom_ut, Pren_ut, Tel, Genre, profileId, isGodMode, ResponsableId } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Générer un code_ut unique (4 caractères alphanumériques)
    const generateCodeUt = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let code_ut = generateCodeUt();
    // Vérifier l'unicité du code
    while (await User.findOne({ code_ut })) {
      code_ut = generateCodeUt();
    }

    // Créer l'utilisateur
    const user = await User.create({
      email,
      code_ut,
      password,
      Nom_ut: Nom_ut || '',
      Pren_ut: Pren_ut || '',
      Tel: Tel || '',
      Genre: Genre || 0,
      profileId: profileId || null,
      isGodMode: isGodMode || false,
      ResponsableId: ResponsableId || null
    });

    const token = generateToken(user._id);
    const userDTO = user.toDTO();

    res.status(201).json({
      success: true,
      data: {
        user: userDTO,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
};

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Vérifier l'utilisateur et inclure le password
    const user = await User.findOne({ email });
    if (!user || user.Sommeil) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Mettre à jour l'utilisateur si nécessaire
    // Note: lastLogin n'existe plus dans le schéma actuel
    await user.save();

    const token = generateToken(user._id);

    // Utiliser toDTO pour inclure toutes les propriétés nécessaires
    const userDTO = user.toDTO();

    res.json({
      success: true,
      data: {
        user: userDTO,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
};

// @desc    Obtenir profil utilisateur
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: user.toDTO()
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};