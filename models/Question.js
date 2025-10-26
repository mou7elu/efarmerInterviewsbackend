const mongoose = require('mongoose');
const OptionSchema = require('./Option');

const QuestionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  }, // ex: "Q27"
  texte: {
    type: String,
    required: true
  }, // libellé de la question
  type: {
    type: String,
    enum: ['text', 'number', 'date', 'single_choice', 'multi_choice', 'boolean'],
    required: true
  },
  obligatoire: {
    type: Boolean,
    default: false
  },
  unite: {
    type: String,
    default: null
  }, // ex: "FCFA", "personnes"
  automatique: {
    type: Boolean,
    default: false
  },
  options: [OptionSchema], // liste d'options si applicable
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  voletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volet',
    required: true
  },
  // Références aux tables de données de référence
  referenceTable: {
    type: String,
    enum: ['District', 'Region', 'Departement', 'Souspref', 'Village', 'Pays', 'Nationalite', 'NiveauScolaire', 'Piece','Producteur','Parcelle', ''],
    default: ''
  }, // Table de référence liée à cette question
  referenceField: {
    type: String,
    default: ''
  } // Champ de la table de référence à utiliser
}, {
  timestamps: true
});

// DTO
QuestionSchema.methods.toDTO = function() {
  return {
    id: this._id,
    code: this.code,
    texte: this.texte,
    type: this.type,
    obligatoire: this.obligatoire,
    unite: this.unite,
    automatique: this.automatique,
    options: this.options,
    sectionId: this.sectionId,
    voletId: this.voletId,
    referenceTable: this.referenceTable,
    referenceField: this.referenceField,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.models.Question || mongoose.model('Question', QuestionSchema);
