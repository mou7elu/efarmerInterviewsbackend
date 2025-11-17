const mongoose = require('mongoose');

const SousprefSchema = new mongoose.Schema({
  Lib_Souspref: {
    type: String,
    required: true,
  },// Libellé de la sous-préfecture
  Cod_Souspref: {
    type: String,
    required: true,
    unique: true,},// Code de la sous-préfecture
  DepartementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Departement',
      required: true,
    },// Référence au département
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

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
