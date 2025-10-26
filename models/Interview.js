const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: [true, 'Le nom du candidat est obligatoire'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  candidateEmail: {
    type: String,
    required: [true, 'L\'email du candidat est obligatoire'],
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Format d\'email invalide'
    ]
  },
  candidatePhone: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Le poste est obligatoire'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Le département est obligatoire'],
    trim: true
  },
  scheduledDate: {
    type: Date,
    required: [true, 'La date d\'entretien est obligatoire']
  },
  duration: {
    type: Number, // en minutes
    default: 60
  },
  status: {
    type: String,
    enum: [
      'planifie',
      'en_cours',
      'termine',
      'annule',
      'reporte'
    ],
    default: 'planifie'
  },
  type: {
    type: String,
    enum: ['presentiel', 'visio', 'telephonique'],
    default: 'presentiel'
  },
  location: {
    type: String,
    trim: true
  },
  meetingLink: {
    type: String,
    trim: true
  },
  interviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    answer: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  overallRating: {
    type: Number,
    min: 1,
    max: 5
  },
  recommendation: {
    type: String,
    enum: ['recommande', 'pas_recommande', 'reserve'],
    default: null
  },
  notes: {
    type: String,
    trim: true
  },
  cv: {
    filename: String,
    path: String,
    uploadDate: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index pour la recherche
interviewSchema.index({ candidateName: 'text', position: 'text', department: 'text' });

module.exports = mongoose.model('Interview', interviewSchema);