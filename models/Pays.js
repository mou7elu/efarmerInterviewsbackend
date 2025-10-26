const mongoose = require('mongoose');

const paysSchema = new mongoose.Schema({
  Lib_pays: {
    type: String,
    required: true,
  },// Libellé du pays
  Coordonnee: {
    type: String, // Supporte GeoJSON et format texte
    default: null,
  },// Coordonnées GPS du pays geojson polygon
  Indicatif: {
    type: String,
    default: null,
  },
  Sommeil: {
    type: Boolean,
    default: false, // Par défaut désactivé, seul Godmode peut activer
  },
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
paysSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_pays: this.Lib_pays,
    Coordonnee: this.Coordonnee,
    Indicatif: this.Indicatif,
    Sommeil: this.Sommeil,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Index géospatial pour les coordonnées GeoJSON (optionnel)
paysSchema.index({ "Coordonnee": "2dsphere" });

// Exporter le modèle
const Pays = mongoose.model('Pays', paysSchema);

module.exports = Pays;
