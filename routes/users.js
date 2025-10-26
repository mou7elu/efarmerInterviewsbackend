const express = require('express');
const { protect } = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Middleware d'authentification pour toutes les routes (désactivé pour le développement)
// router.use(protect);

// GET /api/users - Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Récupération des utilisateurs...');
    const User = require('../models/User');
    
    const { search, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Construire le filtre de recherche
    let filter = {};
    if (search && search.trim()) {
      filter.$or = [
        { email: { $regex: search.trim(), $options: 'i' } },
        { Nom_ut: { $regex: search.trim(), $options: 'i' } },
        { Pren_ut: { $regex: search.trim(), $options: 'i' } }
      ];
    }
    
    // Récupérer les utilisateurs avec pagination
    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter)
    ]);
    
    console.log(`✅ Utilisateurs récupérés: ${users.length}/${total}`);
    console.log(`✅ Données utilisateurs:`, users);
    
    // Convertir en DTO (sans mot de passe) - Utilisation de toJSON()
    const usersDTO = users.map((user, index) => {
      const userJson = user.toJSON();
      console.log(`\n👤 User toJSON() ${index + 1}:`, JSON.stringify(userJson, null, 2));
      
      // Créer le DTO en excluant le mot de passe et en normalisant les champs
      const dto = {
        id: userJson._id,
        email: userJson.email || '',
        Nom_ut: userJson.Nom_ut || '',
        Pren_ut: userJson.Pren_ut || '',
        Tel: userJson.Tel || '',
        Genre: userJson.Genre !== undefined ? userJson.Genre : 0,
        profileId: userJson.profileId || null,
        isGodMode: userJson.isGodMode !== undefined ? userJson.isGodMode : false,
        Sommeil: userJson.Sommeil !== undefined ? userJson.Sommeil : false,
        createdAt: userJson.createdAt,
        updatedAt: userJson.updatedAt
      };
      
      console.log(`\n✅ DTO final ${index + 1}:`, JSON.stringify(dto, null, 2));
      return dto;
    });
    
    console.log(`🔍 DTO créé:`, JSON.stringify(usersDTO, null, 2));
    
    res.json({
      items: usersDTO,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message 
    });
  }
});

// GET /api/users/:id - Récupérer un utilisateur spécifique
router.get('/:id', async (req, res) => {
  try {
    const User = require('../models/User');
    const { id } = req.params;
    
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({
      id: user._id,
      email: user.email,
      Nom_ut: user.Nom_ut,
      Pren_ut: user.Pren_ut,
      Tel: user.Tel,
      Genre: user.Genre,
      profileId: user.profileId,
      isGodMode: user.isGodMode,
      Sommeil: user.Sommeil,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de l\'utilisateur',
      error: error.message 
    });
  }
});

// POST /api/users - Créer un nouvel utilisateur
router.post('/', async (req, res) => {
  try {
    const User = require('../models/User');
    const { email, password, Nom_ut, Pren_ut, Tel, Genre, profileId } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }

    const newUser = new User({
      email,
      password,
      Nom_ut: Nom_ut || '',
      Pren_ut: Pren_ut || '',
      Tel: Tel || '',
      Genre: Genre || 0,
      profileId: profileId || null
    });

    const user = await newUser.save();

    res.status(201).json({
      id: user._id,
      email: user.email,
      Nom_ut: user.Nom_ut,
      Pren_ut: user.Pren_ut,
      Tel: user.Tel,
      Genre: user.Genre,
      profileId: user.profileId,
      isGodMode: user.isGodMode,
      Sommeil: user.Sommeil,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message 
    });
  }
});

// PUT /api/users/:id - Mettre à jour un utilisateur 
router.put('/:id', async (req, res) => {
  try {
    const User = require('../models/User');
    const { id } = req.params;
    
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    
    const { email, Nom_ut, Pren_ut, Tel, Genre, profileId, Sommeil } = req.body;
    
    // Construire l'objet de mise à jour
    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (Nom_ut !== undefined) updateData.Nom_ut = Nom_ut;
    if (Pren_ut !== undefined) updateData.Pren_ut = Pren_ut;
    if (Tel !== undefined) updateData.Tel = Tel;
    if (Genre !== undefined) updateData.Genre = Genre;
    if (profileId !== undefined) updateData.profileId = profileId;
    if (Sommeil !== undefined) updateData.Sommeil = Sommeil;
    
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      id: user._id,
      email: user.email,
      Nom_ut: user.Nom_ut,
      Pren_ut: user.Pren_ut,
      Tel: user.Tel,
      Genre: user.Genre,
      profileId: user.profileId,
      isGodMode: user.isGodMode,
      Sommeil: user.Sommeil,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de l\'utilisateur',
      error: error.message 
    });
  }
});

// DELETE /api/users/:id - Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  try {
    const User = require('../models/User');
    const { id } = req.params;
    
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: error.message 
    });
  }
});

module.exports = router;