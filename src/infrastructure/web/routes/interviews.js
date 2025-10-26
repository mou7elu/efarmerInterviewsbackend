const express = require('express');
const mongoose = require('mongoose');
const { Interview } = require('../../../../models');

const router = express.Router();

// ===========================================
const Reponse = require('../../../../models/Reponse');
// ROUTES POUR LES INTERVIEWS
// ===========================================

// GET /api/interviews
router.get('/interviews', async (req, res) => {
  try {
    // Nouvelle logique : retourner toutes les réponses d'interview
    const reponses = await Reponse.find();
    // Si la méthode toDTO existe, l'utiliser
    const reponsesDTO = reponses.map(r => typeof r.toDTO === 'function' ? r.toDTO() : r);
    res.json(reponsesDTO);
  } catch (error) {
    console.error('Erreur lors de la récupération des réponses:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des réponses',
      error: error.message 
    });
  }
});

// GET /api/interviews/:id
router.get('/interviews/:id', async (req, res) => {
  try {
    // Nouvelle logique : récupérer une réponse d'interview par son id
    const reponse = await Reponse.findById(req.params.id);
    if (!reponse) {
      return res.status(404).json({ message: 'Réponse non trouvée' });
    }
    res.json(reponse.toDTO());
  } catch (error) {
    console.error('Erreur lors de la récupération de la réponse:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de réponse invalide' });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la réponse',
      error: error.message 
    });
  }
});

// PUT /api/interviews/:id
router.put('/interviews/:id', async (req, res) => {
  try {
    const updateData = req.body;
    
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('interviewer', 'nom email')
     .populate('createdBy', 'nom email');

    if (!interview) {
      return res.status(404).json({ message: 'Interview non trouvée' });
    }

    res.json(interview);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'interview:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID d\'interview invalide' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de l\'interview',
      error: error.message 
    });
  }
});

// DELETE /api/interviews/:id
router.delete('/interviews/:id', async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview non trouvée' });
    }

    res.json({ message: 'Interview supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'interview:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID d\'interview invalide' });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de l\'interview',
      error: error.message 
    });
  }
});

// ===========================================
// ROUTES POUR LES QUESTIONNAIRES (compatibilité)
// ===========================================

// GET /api/questionnaires
router.get('/questionnaires', async (req, res) => {
  try {
    const { Questionnaire } = require('../../../../models');
    const questionnaires = await Questionnaire.find()
      .sort({ createdAt: -1 });
    
    res.json(questionnaires);
  } catch (error) {
    console.error('Erreur lors de la récupération des questionnaires:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des questionnaires',
      error: error.message 
    });
  }
});

// GET /api/questionnaires/:id
router.get('/questionnaires/:id', async (req, res) => {
  try {
    const { Questionnaire } = require('../../../../models');
    const questionnaire = await Questionnaire.findById(req.params.id);
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }
    
    res.json(questionnaire);
  } catch (error) {
    console.error('Erreur lors de la récupération du questionnaire:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de questionnaire invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du questionnaire',
      error: error.message 
    });
  }
});

// ===========================================
// ROUTES POUR LES ZONES INTERDITES
// ===========================================

// GET /api/zones-interdites
router.get('/zones-interdites', async (req, res) => {
  try {
    console.log('🔍 Récupération des zones interdites...');
    const Zone_interdit = require('../../../../models/Zone_interdit');
    
    // D'abord, compter toutes les zones
    const totalZones = await Zone_interdit.countDocuments();
    console.log(`📊 Total zones dans la base: ${totalZones}`);
    
    // Ensuite, compter les zones non dormantes
    const activeZones = await Zone_interdit.countDocuments({ Sommeil: false });
    console.log(`📊 Zones actives (non dormantes): ${activeZones}`);
    
    // Récupérer toutes les zones interdites (inclure toutes les zones, le frontend fera le filtrage)
    const zones = await Zone_interdit.find()
      .populate('PaysId', 'libPays')
      .sort({ Lib_zi: 1 });
    
    console.log(`✅ Zones récupérées: ${zones.length}`);
    
    // Convertir en DTO
    const zonesDTO = zones.map(zone => ({
      id: zone._id,
      Lib_zi: zone.Lib_zi,
      Coordonnee: zone.Coordonnee,
      Sommeil: zone.Sommeil,
      Pays: zone.PaysId ? {
        id: zone.PaysId._id,
        libPays: zone.PaysId.libPays
      } : null,
      createdAt: zone.createdAt,
      updatedAt: zone.updatedAt
    }));
    
    console.log(`📤 Retour de ${zonesDTO.length} zones`);
    res.json(zonesDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des zones interdites:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des zones interdites',
      error: error.message 
    });
  }
});

// GET /api/zones-interdites/:id - Récupérer une zone spécifique
// GET /api/zones-interdites/:id - Récupérer une zone spécifique
router.get('/zones-interdites/:id', async (req, res) => {
  try {
    const Zone_interdit = require('../../../../models/Zone_interdit');
    const zone = await Zone_interdit.findById(req.params.id).populate('PaysId', 'libPays');
    if (!zone) {
      return res.status(404).json({ message: 'Zone interdite non trouvée' });
    }
    const zoneDTO = {
      id: zone._id,
      Lib_zi: zone.Lib_zi,
      Coordonnee: zone.Coordonnee,
      Sommeil: zone.Sommeil,
      Pays: zone.PaysId ? {
        id: zone.PaysId._id,
        libPays: zone.PaysId.libPays
      } : null,
      createdAt: zone.createdAt,
      updatedAt: zone.updatedAt
    };
    res.json(zoneDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la zone interdite:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la zone interdite',
      error: error.message 
    });
  }
});

// POST /api/zones-interdites - Créer une nouvelle zone interdite
router.post('/zones-interdites', async (req, res) => {
  try {
    const Zone_interdit = require('../../../../models/Zone_interdit');
    const { Lib_zi, Coordonnee, Sommeil, PaysId } = req.body;

    const newZone = new Zone_interdit({
      Lib_zi,
      Coordonnee,
      Sommeil: Sommeil || false,
      PaysId
    });

    const zone = await newZone.save();
    await zone.populate('PaysId', 'libPays');

    const zoneDTO = {
      id: zone._id,
      Lib_zi: zone.Lib_zi,
      Coordonnee: zone.Coordonnee,
      Sommeil: zone.Sommeil,
      Pays: zone.PaysId ? {
        id: zone.PaysId._id,
        libPays: zone.PaysId.libPays
      } : null,
      createdAt: zone.createdAt,
      updatedAt: zone.updatedAt
    };

    res.status(201).json(zoneDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la création de la zone interdite:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de la zone interdite',
      error: error.message 
    });
  }
});

// DELETE /api/zones-interdites/:id - Supprimer une zone interdite
router.delete('/zones-interdites/:id', async (req, res) => {
  try {
    const Zone_interdit = require('../../../../models/Zone_interdit');
    const zone = await Zone_interdit.findByIdAndDelete(req.params.id);

    if (!zone) {
      return res.status(404).json({ message: 'Zone interdite non trouvée' });
    }

    res.json({ message: 'Zone interdite supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la zone interdite:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la zone interdite',
      error: error.message 
    });
  }
});

// ==================== ROUTES NATIONALITÉS ====================

// GET /api/nationalites - Récupérer toutes les nationalités
router.get('/nationalites', async (req, res) => {
  try {
    console.log('🔍 Récupération des nationalités...');
    const Nationalite = require('../../../../models/Nationalite');
    
    const { search, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Construire le filtre de recherche
    let filter = {};
    if (search && search.trim()) {
      filter.Lib_Nation = { $regex: search.trim(), $options: 'i' };
    }
    
    // Récupérer les nationalités avec pagination
    const [nationalites, total] = await Promise.all([
      Nationalite.find(filter)
        .sort({ Lib_Nation: 1 })
        .skip(skip)
        .limit(limitNum),
      Nationalite.countDocuments(filter)
    ]);
    
    console.log(`✅ Nationalités récupérées: ${nationalites.length}/${total}`);
    
    // Convertir en DTO
    const nationalitesDTO = nationalites.map(nationalite => ({
      id: nationalite._id,
      Lib_Nation: nationalite.Lib_Nation,
      createdAt: nationalite.createdAt,
      updatedAt: nationalite.updatedAt
    }));
    
    res.json({
      items: nationalitesDTO,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des nationalités:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des nationalités',
      error: error.message 
    });
  }
});

// GET /api/nationalites/:id - Récupérer une nationalité spécifique
router.get('/nationalites/:id', async (req, res) => {
  try {
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de nationalité invalide' });
    }

    const Nationalite = require('../../../../models/Nationalite');
    const nationalite = await Nationalite.findById(req.params.id);
    
    if (!nationalite) {
      return res.status(404).json({ message: 'Nationalité non trouvée' });
    }

    const nationaliteDTO = {
      id: nationalite._id,
      Lib_Nation: nationalite.Lib_Nation,
      createdAt: nationalite.createdAt,
      updatedAt: nationalite.updatedAt
    };

    res.json(nationaliteDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la nationalité:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la nationalité',
      error: error.message 
    });
  }
});

// POST /api/nationalites - Créer une nouvelle nationalité
router.post('/nationalites', async (req, res) => {
  try {
    const Nationalite = require('../../../../models/Nationalite');
    const { Lib_Nation } = req.body;

    if (!Lib_Nation || !Lib_Nation.trim()) {
      return res.status(400).json({ message: 'Le libellé de la nationalité est requis' });
    }

    // Vérifier si la nationalité existe déjà
    const existingNationalite = await Nationalite.findOne({ 
      Lib_Nation: { $regex: `^${Lib_Nation.trim()}$`, $options: 'i' }
    });
    
    if (existingNationalite) {
      return res.status(409).json({ message: 'Cette nationalité existe déjà' });
    }

    const newNationalite = new Nationalite({
      Lib_Nation: Lib_Nation.trim()
    });

    const nationalite = await newNationalite.save();

    const nationaliteDTO = {
      id: nationalite._id,
      Lib_Nation: nationalite.Lib_Nation,
      createdAt: nationalite.createdAt,
      updatedAt: nationalite.updatedAt
    };

    res.status(201).json(nationaliteDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la création de la nationalité:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de la nationalité',
      error: error.message 
    });
  }
});

// PUT /api/nationalites/:id - Mettre à jour une nationalité
router.put('/nationalites/:id', async (req, res) => {
  try {
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de nationalité invalide' });
    }

    const Nationalite = require('../../../../models/Nationalite');
    const { Lib_Nation } = req.body;

    if (!Lib_Nation || !Lib_Nation.trim()) {
      return res.status(400).json({ message: 'Le libellé de la nationalité est requis' });
    }

    // Vérifier si une autre nationalité avec le même nom existe
    const existingNationalite = await Nationalite.findOne({ 
      _id: { $ne: req.params.id },
      Lib_Nation: { $regex: `^${Lib_Nation.trim()}$`, $options: 'i' }
    });
    
    if (existingNationalite) {
      return res.status(409).json({ message: 'Cette nationalité existe déjà' });
    }

    const nationalite = await Nationalite.findByIdAndUpdate(
      req.params.id,
      { Lib_Nation: Lib_Nation.trim() },
      { new: true, runValidators: true }
    );

    if (!nationalite) {
      return res.status(404).json({ message: 'Nationalité non trouvée' });
    }

    const nationaliteDTO = {
      id: nationalite._id,
      Lib_Nation: nationalite.Lib_Nation,
      createdAt: nationalite.createdAt,
      updatedAt: nationalite.updatedAt
    };

    res.json(nationaliteDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de la nationalité:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la nationalité',
      error: error.message 
    });
  }
});

// DELETE /api/nationalites/:id - Supprimer une nationalité
router.delete('/nationalites/:id', async (req, res) => {
  try {
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de nationalité invalide' });
    }

    const Nationalite = require('../../../../models/Nationalite');
    const nationalite = await Nationalite.findByIdAndDelete(req.params.id);

    if (!nationalite) {
      return res.status(404).json({ message: 'Nationalité non trouvée' });
    }

    res.json({ message: 'Nationalité supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la nationalité:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la nationalité',
      error: error.message 
    });
  }
});

// ==================== ROUTES NIVEAUX SCOLAIRES ====================

// GET /api/niveaux-scolaires - Récupérer tous les niveaux scolaires
router.get('/niveaux-scolaires', async (req, res) => {
  try {
    console.log('🔍 Récupération des niveaux scolaires...');
    const NiveauScolaire = require('../../../../models/NiveauScolaire');
    
    const { search, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Construire le filtre de recherche
    let filter = {};
    if (search && search.trim()) {
      filter.Lib_NiveauScolaire = { $regex: search.trim(), $options: 'i' };
    }
    
    // Récupérer les niveaux scolaires avec pagination
    const [niveauxScolaires, total] = await Promise.all([
      NiveauScolaire.find(filter)
        .sort({ Lib_NiveauScolaire: 1 })
        .skip(skip)
        .limit(limitNum),
      NiveauScolaire.countDocuments(filter)
    ]);
    
    console.log(`✅ Niveaux scolaires récupérés: ${niveauxScolaires.length}/${total}`);
    
    // Convertir en DTO
    const niveauxScolairesDTO = niveauxScolaires.map(niveau => ({
      id: niveau._id,
      Lib_NiveauScolaire: niveau.Lib_NiveauScolaire,
      createdAt: niveau.createdAt,
      updatedAt: niveau.updatedAt
    }));
    
    res.json({
      items: niveauxScolairesDTO,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des niveaux scolaires:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des niveaux scolaires',
      error: error.message 
    });
  }
});

// GET /api/niveaux-scolaires/:id - Récupérer un niveau scolaire spécifique
router.get('/niveaux-scolaires/:id', async (req, res) => {
  try {
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de niveau scolaire invalide' });
    }

    const NiveauScolaire = require('../../../../models/NiveauScolaire');
    const niveauScolaire = await NiveauScolaire.findById(req.params.id);
    
    if (!niveauScolaire) {
      return res.status(404).json({ message: 'Niveau scolaire non trouvé' });
    }

    const niveauScolaireDTO = {
      id: niveauScolaire._id,
      Lib_NiveauScolaire: niveauScolaire.Lib_NiveauScolaire,
      createdAt: niveauScolaire.createdAt,
      updatedAt: niveauScolaire.updatedAt
    };

    res.json(niveauScolaireDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du niveau scolaire:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du niveau scolaire',
      error: error.message 
    });
  }
});

// POST /api/niveaux-scolaires - Créer un nouveau niveau scolaire
router.post('/niveaux-scolaires', async (req, res) => {
  try {
    const NiveauScolaire = require('../../../../models/NiveauScolaire');
    const { Lib_NiveauScolaire } = req.body;

    if (!Lib_NiveauScolaire || !Lib_NiveauScolaire.trim()) {
      return res.status(400).json({ message: 'Le libellé du niveau scolaire est requis' });
    }

    // Vérifier si le niveau scolaire existe déjà
    const existingNiveau = await NiveauScolaire.findOne({ 
      Lib_NiveauScolaire: { $regex: `^${Lib_NiveauScolaire.trim()}$`, $options: 'i' }
    });
    
    if (existingNiveau) {
      return res.status(409).json({ message: 'Ce niveau scolaire existe déjà' });
    }

    const newNiveauScolaire = new NiveauScolaire({
      Lib_NiveauScolaire: Lib_NiveauScolaire.trim()
    });

    const niveauScolaire = await newNiveauScolaire.save();

    const niveauScolaireDTO = {
      id: niveauScolaire._id,
      Lib_NiveauScolaire: niveauScolaire.Lib_NiveauScolaire,
      createdAt: niveauScolaire.createdAt,
      updatedAt: niveauScolaire.updatedAt
    };

    res.status(201).json(niveauScolaireDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la création du niveau scolaire:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du niveau scolaire',
      error: error.message 
    });
  }
});

// PUT /api/niveaux-scolaires/:id - Mettre à jour un niveau scolaire
router.put('/niveaux-scolaires/:id', async (req, res) => {
  try {
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de niveau scolaire invalide' });
    }

    const NiveauScolaire = require('../../../../models/NiveauScolaire');
    const { Lib_NiveauScolaire } = req.body;

    if (!Lib_NiveauScolaire || !Lib_NiveauScolaire.trim()) {
      return res.status(400).json({ message: 'Le libellé du niveau scolaire est requis' });
    }

    // Vérifier si un autre niveau scolaire avec le même nom existe
    const existingNiveau = await NiveauScolaire.findOne({ 
      _id: { $ne: req.params.id },
      Lib_NiveauScolaire: { $regex: `^${Lib_NiveauScolaire.trim()}$`, $options: 'i' }
    });
    
    if (existingNiveau) {
      return res.status(409).json({ message: 'Ce niveau scolaire existe déjà' });
    }

    const niveauScolaire = await NiveauScolaire.findByIdAndUpdate(
      req.params.id,
      { Lib_NiveauScolaire: Lib_NiveauScolaire.trim() },
      { new: true, runValidators: true }
    );

    if (!niveauScolaire) {
      return res.status(404).json({ message: 'Niveau scolaire non trouvé' });
    }

    const niveauScolaireDTO = {
      id: niveauScolaire._id,
      Lib_NiveauScolaire: niveauScolaire.Lib_NiveauScolaire,
      createdAt: niveauScolaire.createdAt,
      updatedAt: niveauScolaire.updatedAt
    };

    res.json(niveauScolaireDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du niveau scolaire:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du niveau scolaire',
      error: error.message 
    });
  }
});

// DELETE /api/niveaux-scolaires/:id - Supprimer un niveau scolaire
router.delete('/niveaux-scolaires/:id', async (req, res) => {
  try {
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de niveau scolaire invalide' });
    }

    const NiveauScolaire = require('../../../../models/NiveauScolaire');
    const niveauScolaire = await NiveauScolaire.findByIdAndDelete(req.params.id);

    if (!niveauScolaire) {
      return res.status(404).json({ message: 'Niveau scolaire non trouvé' });
    }

    res.json({ message: 'Niveau scolaire supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du niveau scolaire:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du niveau scolaire',
      error: error.message 
    });
  }
});

// ==================== ROUTES PIÈCES ====================

// GET /api/pieces - Récupérer toutes les pièces
router.get('/pieces', async (req, res) => {
  try {
    console.log('🔍 Récupération des pièces...');
    const Piece = require('../../../../models/Piece');
    
    const { search, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Construire le filtre de recherche
    let filter = {};
    if (search && search.trim()) {
      filter.Nom_piece = { $regex: search.trim(), $options: 'i' };
    }
    
    // Récupérer les pièces avec pagination
    const [pieces, total] = await Promise.all([
      Piece.find(filter)
        .sort({ Nom_piece: 1 })
        .skip(skip)
        .limit(limitNum),
      Piece.countDocuments(filter)
    ]);
    
    console.log(`✅ Pièces récupérées: ${pieces.length}/${total}`);
    
    // Convertir en DTO
    const piecesDTO = pieces.map(piece => ({
      id: piece._id,
      Nom_piece: piece.Nom_piece,
      createdAt: piece.createdAt,
      updatedAt: piece.updatedAt
    }));
    
    res.json({
      items: piecesDTO,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des pièces:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des pièces',
      error: error.message 
    });
  }
});

// GET /api/pieces/:id - Récupérer une pièce spécifique
router.get('/pieces/:id', async (req, res) => {
  try {
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de pièce invalide' });
    }

    const Piece = require('../../../../models/Piece');
    const piece = await Piece.findById(req.params.id);
    
    if (!piece) {
      return res.status(404).json({ message: 'Pièce non trouvée' });
    }

    const pieceDTO = {
      id: piece._id,
      Nom_piece: piece.Nom_piece,
      createdAt: piece.createdAt,
      updatedAt: piece.updatedAt
    };

    res.json(pieceDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la pièce:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la pièce',
      error: error.message 
    });
  }
});

// POST /api/pieces - Créer une nouvelle pièce
router.post('/pieces', async (req, res) => {
  try {
    const Piece = require('../../../../models/Piece');
    const { Nom_piece } = req.body;

    if (!Nom_piece || !Nom_piece.trim()) {
      return res.status(400).json({ message: 'Le nom de la pièce est requis' });
    }

    // Vérifier si la pièce existe déjà
    const existingPiece = await Piece.findOne({ 
      Nom_piece: { $regex: `^${Nom_piece.trim()}$`, $options: 'i' }
    });
    
    if (existingPiece) {
      return res.status(409).json({ message: 'Cette pièce existe déjà' });
    }

    const newPiece = new Piece({
      Nom_piece: Nom_piece.trim()
    });

    const piece = await newPiece.save();

    const pieceDTO = {
      id: piece._id,
      Nom_piece: piece.Nom_piece,
      createdAt: piece.createdAt,
      updatedAt: piece.updatedAt
    };

    res.status(201).json(pieceDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la création de la pièce:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de la pièce',
      error: error.message 
    });
  }
});

// PUT /api/pieces/:id - Mettre à jour une pièce
router.put('/pieces/:id', async (req, res) => {
  try {
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de pièce invalide' });
    }

    const Piece = require('../../../../models/Piece');
    const { Nom_piece } = req.body;

    if (!Nom_piece || !Nom_piece.trim()) {
      return res.status(400).json({ message: 'Le nom de la pièce est requis' });
    }

    // Vérifier si une autre pièce avec le même nom existe
    const existingPiece = await Piece.findOne({ 
      _id: { $ne: req.params.id },
      Nom_piece: { $regex: `^${Nom_piece.trim()}$`, $options: 'i' }
    });
    
    if (existingPiece) {
      return res.status(409).json({ message: 'Cette pièce existe déjà' });
    }

    const piece = await Piece.findByIdAndUpdate(
      req.params.id,
      { Nom_piece: Nom_piece.trim() },
      { new: true, runValidators: true }
    );

    if (!piece) {
      return res.status(404).json({ message: 'Pièce non trouvée' });
    }

    const pieceDTO = {
      id: piece._id,
      Nom_piece: piece.Nom_piece,
      createdAt: piece.createdAt,
      updatedAt: piece.updatedAt
    };

    res.json(pieceDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de la pièce:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la pièce',
      error: error.message 
    });
  }
});

// DELETE /api/pieces/:id - Supprimer une pièce
router.delete('/pieces/:id', async (req, res) => {
  try {
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de pièce invalide' });
    }

    const Piece = require('../../../../models/Piece');
    const piece = await Piece.findByIdAndDelete(req.params.id);

    if (!piece) {
      return res.status(404).json({ message: 'Pièce non trouvée' });
    }

    res.json({ message: 'Pièce supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la pièce:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la pièce',
      error: error.message 
    });
  }
});

// ===========================================
// ROUTES POUR LES UTILISATEURS
// ===========================================

// GET /api/users - Récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    console.log('🔍 Récupération des utilisateurs...');
    const User = require('../../../../models/User');
    
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
    
    // Convertir en DTO (sans mot de passe) - Utilisation de toJSON()
    const usersDTO = users.map((user, index) => {
      const userJson = user.toJSON();
      console.log(`👤 User toJSON() ${index + 1}:`, JSON.stringify(userJson, null, 2));
      
      // Créer le DTO en excluant le mot de passe et en normalisant les champs
      const dto = {
        id: userJson._id,
        email: userJson.email || '',
        Nom_ut: userJson.Nom_ut || '',
        Pren_ut: userJson.Pren_ut || '',
        Tel: userJson.Tel || '',
        Genre: userJson.Genre !== undefined ? userJson.Genre : 0,
        profileId: userJson.profileId || null,
        isGodMode: userJson.isGodMode || false,
        Sommeil: userJson.Sommeil !== undefined ? userJson.Sommeil : false,
        createdAt: userJson.createdAt,
        updatedAt: userJson.updatedAt
      };
      
      console.log(`✅ DTO final ${index + 1}:`, JSON.stringify(dto, null, 2));
      return dto;
    });
    
    console.log(`📤 Retour de ${usersDTO.length} utilisateurs`);
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
router.get('/users/:id', async (req, res) => {
  try {
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    const User = require('../../../../models/User');
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const userJson = user.toJSON();
    const userDTO = {
      id: userJson._id,
      email: userJson.email,
      Nom_ut: userJson.Nom_ut,
      Pren_ut: userJson.Pren_ut,
      Tel: userJson.Tel,
      Genre: userJson.Genre,
      profileId: userJson.profileId,
      isGodMode: userJson.isGodMode,
      Sommeil: userJson.Sommeil,
      createdAt: userJson.createdAt,
      updatedAt: userJson.updatedAt
    };

    res.json(userDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de l\'utilisateur',
      error: error.message 
    });
  }
});

// POST /api/users - Créer un nouvel utilisateur
router.post('/users', async (req, res) => {
  try {
    const User = require('../../../../models/User');
    const { email, password, Nom_ut, Pren_ut, Tel, Genre, profileId } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà' });
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
    const userJson = user.toJSON();

    const userDTO = {
      id: userJson._id,
      email: userJson.email,
      Nom_ut: userJson.Nom_ut,
      Pren_ut: userJson.Pren_ut,
      Tel: userJson.Tel,
      Genre: userJson.Genre,
      profileId: userJson.profileId,
      isGodMode: userJson.isGodMode,
      Sommeil: userJson.Sommeil,
      createdAt: userJson.createdAt,
      updatedAt: userJson.updatedAt
    };

    res.status(201).json(userDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message 
    });
  }
});

// PUT /api/users/:id - Mettre à jour un utilisateur
router.put('/users/:id', async (req, res) => {
  try {
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    const User = require('../../../../models/User');
    const { email, Nom_ut, Pren_ut, Tel, Genre, profileId, Sommeil } = req.body;

    // Vérifier si un autre utilisateur avec le même email existe
    if (email) {
      const existingUser = await User.findOne({ 
        _id: { $ne: req.params.id },
        email 
      });
      
      if (existingUser) {
        return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà' });
      }
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (Nom_ut !== undefined) updateData.Nom_ut = Nom_ut;
    if (Pren_ut !== undefined) updateData.Pren_ut = Pren_ut;
    if (Tel !== undefined) updateData.Tel = Tel;
    if (Genre !== undefined) updateData.Genre = Genre;
    if (profileId !== undefined) updateData.profileId = profileId;
    if (Sommeil !== undefined) updateData.Sommeil = Sommeil;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const userJson = user.toJSON();
    const userDTO = {
      id: userJson._id,
      email: userJson.email,
      Nom_ut: userJson.Nom_ut,
      Pren_ut: userJson.Pren_ut,
      Tel: userJson.Tel,
      Genre: userJson.Genre,
      profileId: userJson.profileId,
      isGodMode: userJson.isGodMode,
      Sommeil: userJson.Sommeil,
      createdAt: userJson.createdAt,
      updatedAt: userJson.updatedAt
    };

    res.json(userDTO);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de l\'utilisateur',
      error: error.message 
    });
  }
});

// DELETE /api/users/:id - Supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  try {
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    const User = require('../../../../models/User');
    const user = await User.findByIdAndDelete(req.params.id);

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

// POST /api/users/:id/photo - Upload photo utilisateur
router.post('/users/:id/photo', async (req, res) => {
  try {
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    const User = require('../../../../models/User');
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Pour l'instant, on simule l'upload réussi
    // TODO: Implémenter le vrai upload avec multer et stockage fichier
    console.log(`📷 Upload photo simulé pour utilisateur ${req.params.id}`);
    
    res.json({ 
      message: 'Photo uploadée avec succès',
      photoUrl: `/api/users/${req.params.id}/photo`
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload de photo:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'upload de photo',
      error: error.message 
    });
  }
});

// GET /api/users/:id/photo - Récupérer photo utilisateur
router.get('/users/:id/photo', async (req, res) => {
  try {
    // Validation de l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    // Pour l'instant, retourner une image par défaut ou 404
    // TODO: Implémenter la récupération de vraie photo
    res.status(404).json({ message: 'Photo non trouvée' });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de photo:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de photo',
      error: error.message 
    });
  }
});

module.exports = router;

// ==================== ROUTE EXPORT PDF ====================
const path = require('path');
const fs = require('fs');
const { fillDocxTemplate } = require('../../../../utils/docxTemplate');
const { convertDocxToPdf } = require('../../../../utils/docxToPdf');


router.get('/interviews/:id/pdf', async (req, res) => {
  try {
    const reponseId = req.params.id;
    const Reponse = require('../../../../models/Reponse');
    const reponse = await Reponse.findById(reponseId).lean();
    if (!reponse) {
      return res.status(404).json({ error: 'Reponse not found' });
    }

    // Remplir le template DOCX
    const templatePath = path.join(__dirname, '../../../../Questionnaire_IEEA.docx');
    const filledDocxPath = path.join(__dirname, `../../../../tmp/reponse_${reponseId}.docx`);
    await fillDocxTemplate(templatePath, filledDocxPath, reponse);

    // Convertir en PDF
    const pdfPath = path.join(__dirname, `../../../../tmp/reponse_${reponseId}.pdf`);
    await convertDocxToPdf(filledDocxPath, pdfPath);

    // Envoyer le PDF
    res.download(pdfPath, `entretien_${reponseId}.pdf`, (err) => {
      // Nettoyage des fichiers temporaires
      fs.unlink(filledDocxPath, () => {});
      fs.unlink(pdfPath, () => {});
    });
  } catch (err) {
  console.error('Erreur génération PDF:', err);
  res.status(500).json({ error: 'Erreur génération PDF', details: err.message, stack: err.stack });
  }
});