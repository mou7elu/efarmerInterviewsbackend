const express = require('express');
const Volet = require('../models/Volet');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

// GET /api/volets
// Récupérer tous les volets
router.get('/', async (req, res) => {
  try {
    const volets = await Volet.find()
      .populate('questionnaireId', 'titre')
      .sort({ ordre: 1 });
    
    res.json(volets);
  } catch (error) {
    console.error('Erreur lors de la récupération des volets:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des volets',
      error: error.message 
    });
  }
});

// GET /api/volets/:id
// Récupérer un volet par ID
router.get('/:id', async (req, res) => {
  try {
    const volet = await Volet.findById(req.params.id)
      .populate('questionnaireId', 'titre');
    
    if (!volet) {
      return res.status(404).json({ message: 'Volet non trouvé' });
    }
    
    res.json(volet);
  } catch (error) {
    console.error('Erreur lors de la récupération du volet:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de volet invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du volet',
      error: error.message 
    });
  }
});

// POST /api/volets
// Créer un nouveau volet
router.post('/', async (req, res) => {
  try {
    const { titre, ordre, questionnaireId } = req.body;
    
    // Validation des champs requis
    if (!titre || !ordre || !questionnaireId) {
      return res.status(400).json({ 
        message: 'Les champs titre, ordre et questionnaireId sont requis' 
      });
    }
    
    const volet = new Volet({
      titre,
      ordre,
      questionnaireId
    });
    
    const savedVolet = await volet.save();
    const populatedVolet = await Volet.findById(savedVolet._id)
      .populate('questionnaireId', 'titre');
    
    res.status(201).json(populatedVolet);
  } catch (error) {
    console.error('Erreur lors de la création du volet:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la création du volet',
      error: error.message 
    });
  }
});

// PUT /api/volets/:id
// Mettre à jour un volet
router.put('/:id', async (req, res) => {
  try {
    const { titre, ordre, questionnaireId } = req.body;
    
    const volet = await Volet.findByIdAndUpdate(
      req.params.id,
      { titre, ordre, questionnaireId },
      { new: true, runValidators: true }
    ).populate('questionnaireId', 'titre');
    
    if (!volet) {
      return res.status(404).json({ message: 'Volet non trouvé' });
    }
    
    res.json(volet);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du volet:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de volet invalide' 
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du volet',
      error: error.message 
    });
  }
});

// DELETE /api/volets/:id
// Supprimer un volet
router.delete('/:id', async (req, res) => {
  try {
    const volet = await Volet.findByIdAndDelete(req.params.id);
    
    if (!volet) {
      return res.status(404).json({ message: 'Volet non trouvé' });
    }
    
    res.json({ message: 'Volet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du volet:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de volet invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du volet',
      error: error.message 
    });
  }
});

// GET /api/volets/questionnaire/:questionnaireId
// Récupérer les volets par questionnaire
router.get('/questionnaire/:questionnaireId', async (req, res) => {
  try {
    const volets = await Volet.find({ questionnaireId: req.params.questionnaireId })
      .populate('questionnaireId', 'titre')
      .sort({ ordre: 1 });
    
    res.json(volets);
  } catch (error) {
    console.error('Erreur lors de la récupération des volets par questionnaire:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de questionnaire invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des volets',
      error: error.message 
    });
  }
});

module.exports = router;