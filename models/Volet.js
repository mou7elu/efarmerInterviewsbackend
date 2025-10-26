const mongoose = require('mongoose');

const VoletSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  ordre: {
    type: Number,
    required: true
  },
  questionnaireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Questionnaire',
    required: true
  }
}, {
  timestamps: true
});

VoletSchema.methods.toDTO = function() {
  return {
    id: this._id,
    titre: this.titre,
    ordre: this.ordre,
    questionnaireId: this.questionnaireId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.models.Volet || mongoose.model('Volet', VoletSchema);
