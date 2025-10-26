const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  Lib_region: {
    type: String,
    required: true,
  },// Libellé de la région
  Coordonnee: {
    type: String,
    default: null, // Nullable property pour la géolocalisation
  },// Coordonnée de la région geojson polygon
  Sommeil: {
    type: Boolean,
    default: false, // Par défaut désactivé, seul Godmode peut activer
  },
  DistrictId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: true,
  },// Référence au district
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
regionSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_region: this.Lib_region,
    Coordonnee: this.Coordonnee,
    Sommeil: this.Sommeil,
    DistrictId: this.DistrictId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Exporter le modèle
const Region = mongoose.model('Region', regionSchema);

module.exports = Region;
