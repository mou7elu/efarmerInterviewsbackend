const mongoose = require('mongoose');

const SecteurAdministratifSchema = new mongoose.Schema({
  Lib_SecteurAdministratif: {
    type: String,
    required: true,
  },// Libellé du secteur administratif
  Cod_SecteurAdministratif: {
    type: String,
    required: true,
    unique: true,},// Code du secteur administratif
  SousprefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Souspref',
      required: true,
    },// Référence à la sous-préfecture
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
SecteurAdministratifSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_SecteurAdministratif: this.Lib_SecteurAdministratif,
    Cod_SecteurAdministratif: this.Cod_SecteurAdministratif,
    SousprefId: this.SousprefId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter le modèle
const SecteurAdministratif = mongoose.model('SecteurAdministratif', SecteurAdministratifSchema);

module.exports = SecteurAdministratif;