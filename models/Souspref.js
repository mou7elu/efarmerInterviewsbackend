const mongoose = require('mongoose');

const SousprefSchema = new mongoose.Schema({
  Lib_Souspref: {
    type: String,
    required: true,
  },// Libellé de la sous-préfecture
  Cod_Souspref: {
    type: String,
    required: true,},// Code de la sous-préfecture
  DepartementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Departement',
      required: true,
    },// Référence au département
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Index composé pour garantir l'unicité du code par département
SousprefSchema.index({ Cod_Souspref: 1, DepartementId: 1 }, { unique: true });

// Méthode pour convertir en DTO (Data Transfer Object)
SousprefSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_Souspref: this.Lib_Souspref,
    Cod_Souspref: this.Cod_Souspref,
    DepartementId: this.DepartementId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter le modèle
const Souspref = mongoose.model('Souspref', SousprefSchema);

module.exports = Souspref;
