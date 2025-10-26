const mongoose = require('mongoose');

const zone_interditSchema = new mongoose.Schema({
  Lib_zi: {
    type: String,
    required: true,
  },// Libellé de la zone interdite
  Coordonnee: {
    type: String,
    default: null, // Nullable property pour la géolocalisation
  },// Coordonnée de la zone interdite geojson polygon
  Sommeil: {
    type: Boolean,
    default: false, // Par défaut désactivé, seul Godmode peut activer
  },
  PaysId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pays',
    required: true,
  },// Référence au pays
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
zone_interditSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_zi: this.Lib_zi,
    Coordonnee: this.Coordonnee,
    Sommeil: this.Sommeil,
    PaysId: this.PaysId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Exporter le modèle
const Zone_interdit = mongoose.model('Zone_interdit', zone_interditSchema);

module.exports = Zone_interdit;
