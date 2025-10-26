const mongoose = require('mongoose');

const niveauScolaireSchema = new mongoose.Schema({
  Lib_NiveauScolaire: {
    type: String,
    required: true,
  },// Libellé du niveau scolaire
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
niveauScolaireSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_NiveauScolaire: this.Lib_NiveauScolaire,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter le modèle
const NiveauScolaire = mongoose.model('NiveauScolaire', niveauScolaireSchema);

module.exports = NiveauScolaire;
