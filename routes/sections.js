const express = require('express');
const Section = require('../models/Section');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

// GET /api/sections
// Récupérer toutes les sections
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find()
      .populate('voletId', 'titre ordre')
      .sort({ ordre: 1 });
    
    res.json(sections);
  } catch (error) {
    console.error('Erreur lors de la récupération des sections:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des sections',
      error: error.message 
    });
  }
});

// GET /api/sections/:id
// Récupérer une section par ID
router.get('/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id)
      .populate('voletId', 'titre ordre');
    
    if (!section) {
      return res.status(404).json({ message: 'Section non trouvée' });
    }
    
    res.json(section);
  } catch (error) {
    console.error('Erreur lors de la récupération de la section:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de section invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la section',
      error: error.message 
    });
  }
});

// POST /api/sections
// Créer une nouvelle section
router.post('/', async (req, res) => {
  try {
    const { titre, ordre, voletId } = req.body;
    
    // Validation des champs requis
    if (!titre || !ordre || !voletId) {
      return res.status(400).json({ 
        message: 'Les champs titre, ordre et voletId sont requis' 
      });
    }
    
    const section = new Section({
      titre,
      ordre,
      voletId
    });
    
    const savedSection = await section.save();
    const populatedSection = await Section.findById(savedSection._id)
      .populate('voletId', 'titre ordre');
    
    res.status(201).json(populatedSection);
  } catch (error) {
    console.error('Erreur lors de la création de la section:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la création de la section',
      error: error.message 
    });
  }
});

// PUT /api/sections/:id
// Mettre à jour une section
router.put('/:id', async (req, res) => {
  try {
    const { titre, ordre, voletId } = req.body;
    
    const section = await Section.findByIdAndUpdate(
      req.params.id,
      { titre, ordre, voletId },
      { new: true, runValidators: true }
    ).populate('voletId', 'titre ordre');
    
    if (!section) {
      return res.status(404).json({ message: 'Section non trouvée' });
    }
    
    res.json(section);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la section:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de section invalide' 
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la section',
      error: error.message 
    });
  }
});

// DELETE /api/sections/:id
// Supprimer une section
router.delete('/:id', async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    
    if (!section) {
      return res.status(404).json({ message: 'Section non trouvée' });
    }
    
    res.json({ message: 'Section supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la section:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de section invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la section',
      error: error.message 
    });
  }
});

// GET /api/sections/volet/:voletId
// Récupérer les sections par volet
router.get('/volet/:voletId', async (req, res) => {
  try {
    const sections = await Section.find({ voletId: req.params.voletId })
      .populate('voletId', 'titre ordre')
      .sort({ ordre: 1 });
    
    res.json(sections);
  } catch (error) {
    console.error('Erreur lors de la récupération des sections par volet:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de volet invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des sections',
      error: error.message 
    });
  }
});

module.exports = router;