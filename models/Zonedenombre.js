const mongoose = require('mongoose');

const ZonedenombreSchema = new mongoose.Schema({
  Lib_ZD: {
    type: String,
    required: true,
  },// Libellé de la zone de dénombrement 
  Cod_ZD: {
    type: String,
    required: true,
    unique: true,},// Code de la zone de dénombrement 
  SecteurAdministratifId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SecteurAdministratif',
      required: true,
    },// Référence à la secteur administratif
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
ZonedenombreSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_ZD: this.Lib_ZD,
    Cod_ZD: this.Cod_ZD,
    SecteurAdministratifId: this.SecteurAdministratifId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter le modèle
const Zonedenombre = mongoose.model('Zonedenombre', ZonedenombreSchema);

module.exports = Zonedenombre;