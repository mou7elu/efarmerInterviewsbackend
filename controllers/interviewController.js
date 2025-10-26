const Interview = require('../models/Interview');
const Question = require('../models/Question');

// @desc    Obtenir tous les entretiens
// @route   GET /api/interviews
// @access  Private
const getInterviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    
    // Filtres
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.department) {
      query.department = req.query.department;
    }

    if (req.query.interviewer) {
      query.interviewer = req.query.interviewer;
    }

    // Si l'utilisateur n'est pas admin, il ne voit que ses entretiens
    if (req.user.role !== 'admin') {
      query.interviewer = req.user.id;
    }

    const interviews = await Interview.find(query)
      .populate('interviewer', 'name email')
      .populate('questions.question', 'title category')
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Interview.countDocuments(query);

    res.json({
      success: true,
      data: interviews,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir un entretien par ID
// @route   GET /api/interviews/:id
// @access  Private
const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('interviewer', 'name email')
      .populate('questions.question', 'title content category expectedAnswer')
      .populate('createdBy', 'name email');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Entretien non trouvé'
      });
    }

    // Vérification des permissions
    if (req.user.role !== 'admin' && interview.interviewer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    res.json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Créer un nouvel entretien
// @route   POST /api/interviews
// @access  Private
const createInterview = async (req, res) => {
  try {
    const interviewData = {
      ...req.body,
      createdBy: req.user.id
    };

    const interview = await Interview.create(interviewData);

    const populatedInterview = await Interview.findById(interview._id)
      .populate('interviewer', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedInterview
    });
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'entretien'
    });
  }
};

// @desc    Mettre à jour un entretien
// @route   PUT /api/interviews/:id
// @access  Private
const updateInterview = async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Entretien non trouvé'
      });
    }

    // Vérification des permissions
    if (req.user.role !== 'admin' && interview.interviewer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('interviewer', 'name email')
    .populate('questions.question', 'title category');

    res.json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'entretien'
    });
  }
};

// @desc    Supprimer un entretien
// @route   DELETE /api/interviews/:id
// @access  Private (Admin only)
const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Entretien non trouvé'
      });
    }

    // Seuls les admins peuvent supprimer
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    await Interview.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Entretien supprimé avec succès'
    });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'entretien'
    });
  }
};

module.exports = {
  getInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview
};