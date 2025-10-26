const mongoose = require('mongoose');

const QuestionnaireSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  version: {
    type: String,
    default: '1.0'
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

QuestionnaireSchema.methods.toDTO = function() {
  return {
    id: this._id,
    titre: this.titre,
    version: this.version,
    description: this.description,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.models.Questionnaire || mongoose.model('Questionnaire', QuestionnaireSchema);
