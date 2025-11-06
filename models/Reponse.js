const mongoose = require('mongoose');

const ReponseSchema = new mongoose.Schema({
  exploitantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producteur',
    required: true
  },
  questionnaireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Questionnaire',
    required: true
  },
   Coordonnee: {
    type: String,
    default: null,
  },// Coordonnée de la reponse en geojson point
  reponses: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    valeur: mongoose.Schema.Types.Mixed // String | Number | [String] selon le type de question
  }]
}, {
  timestamps: true
});

ReponseSchema.methods.toDTO = function() {
  return {
    id: this._id,
    exploitantId: this.exploitantId,
    questionnaireId: this.questionnaireId,
    reponses: this.reponses,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

const Reponse = mongoose.model('Reponse', ReponseSchema);
module.exports = Reponse;
