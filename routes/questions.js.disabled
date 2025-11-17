const express = require('express');
const Question = require('../models/Question');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

// GET /api/questions
// Récupérer toutes les questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('sectionId', 'titre ordre')
      .populate('voletId', 'titre ordre')
      .sort({ 'voletId.ordre': 1, 'sectionId.ordre': 1 });
    
    res.json(questions);
  } catch (error) {
    console.error('Erreur lors de la récupération des questions:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des questions',
      error: error.message 
    });
  }
});

// GET /api/questions/:id
// Récupérer une question par ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('sectionId', 'titre ordre')
      .populate('voletId', 'titre ordre');
    
    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée' });
    }
    
    res.json(question);
  } catch (error) {
    console.error('Erreur lors de la récupération de la question:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de question invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la question',
      error: error.message 
    });
  }
});

// POST /api/questions
// Créer une nouvelle question
router.post('/', async (req, res) => {
  try {
    const { 
      code, 
      texte, 
      type, 
      obligatoire, 
      unite, 
      automatique, 
      options, 
      sectionId, 
      voletId, 
      referenceTable, 
      referenceField 
    } = req.body;
    
    // Validation des champs requis
    if (!code || !texte || !type || !sectionId || !voletId) {
      return res.status(400).json({ 
        message: 'Les champs code, texte, type, sectionId et voletId sont requis' 
      });
    }
    
    const question = new Question({
      code,
      texte,
      type,
      obligatoire: obligatoire || false,
      unite,
      automatique: automatique || false,
      options: options || [],
      sectionId,
      voletId,
      referenceTable: referenceTable || '',
      referenceField: referenceField || ''
    });
    
    const savedQuestion = await question.save();
    const populatedQuestion = await Question.findById(savedQuestion._id)
      .populate('sectionId', 'titre ordre')
      .populate('voletId', 'titre ordre');
    
    res.status(201).json(populatedQuestion);
  } catch (error) {
    console.error('Erreur lors de la création de la question:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Ce code de question existe déjà' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la création de la question',
      error: error.message 
    });
  }
});

// PUT /api/questions/:id
// Mettre à jour une question
router.put('/:id', async (req, res) => {
  try {
    const { 
      code, 
      texte, 
      type, 
      obligatoire, 
      unite, 
      automatique, 
      options, 
      sectionId, 
      voletId, 
      referenceTable, 
      referenceField 
    } = req.body;
    
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        code,
        texte,
        type,
        obligatoire,
        unite,
        automatique,
        options,
        sectionId,
        voletId,
        referenceTable,
        referenceField
      },
      { new: true, runValidators: true }
    ).populate('sectionId', 'titre ordre')
     .populate('voletId', 'titre ordre');
    
    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée' });
    }
    
    res.json(question);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la question:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de question invalide' 
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Ce code de question existe déjà' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la question',
      error: error.message 
    });
  }
});

// DELETE /api/questions/:id
// Supprimer une question
router.delete('/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée' });
    }
    
    res.json({ message: 'Question supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la question:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de question invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la question',
      error: error.message 
    });
  }
});

// GET /api/questions/section/:sectionId
// Récupérer les questions par section
router.get('/section/:sectionId', async (req, res) => {
  try {
    const questions = await Question.find({ sectionId: req.params.sectionId })
      .populate('sectionId', 'titre ordre')
      .populate('voletId', 'titre ordre')
      .sort({ createdAt: 1 });
    
    res.json(questions);
  } catch (error) {
    console.error('Erreur lors de la récupération des questions par section:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de section invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des questions',
      error: error.message 
    });
  }
});

// GET /api/questions/volet/:voletId
// Récupérer les questions par volet
router.get('/volet/:voletId', async (req, res) => {
  try {
    const questions = await Question.find({ voletId: req.params.voletId })
      .populate('sectionId', 'titre ordre')
      .populate('voletId', 'titre ordre')
      .sort({ 'sectionId.ordre': 1, createdAt: 1 });
    
    res.json(questions);
  } catch (error) {
    console.error('Erreur lors de la récupération des questions par volet:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de volet invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des questions',
      error: error.message 
    });
  }
});

// GET /api/questions/:id/options
// Récupérer une question avec ses options détaillées
router.get('/:id/options', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('sectionId', 'titre ordre')
      .populate('voletId', 'titre ordre');
    
    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée' });
    }
    
    res.json(question);
  } catch (error) {
    console.error('Erreur lors de la récupération de la question avec options:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de question invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la question',
      error: error.message 
    });
  }
});

module.exports = router;