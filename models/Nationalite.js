const mongoose = require('mongoose');

const nationaliteSchema = new mongoose.Schema({
  Lib_Nation: {
    type: String,
    required: true,
  },// Libellé de la nationalité
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
nationaliteSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_Nation: this.Lib_Nation,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter le modèle
const Nationalite = mongoose.model('Nationalite', nationaliteSchema);

module.exports = Nationalite;
