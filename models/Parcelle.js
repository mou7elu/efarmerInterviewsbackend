const mongoose = require('mongoose');

const parcelleSchema = new mongoose.Schema({
  Superficie: {
    type: Number,
    required: true,
	default: 0,
  },// Superficie selon les coordonnées GPS
  Coordonnee: {
    type: String,
    default: null, // Nullable property pour la géolocalisation
  },// Coordonnées GPS de la parcelle geojson polygon
  ProducteurId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producteur',
      required: true,
    },// Identifiant du producteur
  CleProd_mobi: {
    type: String,
    default: null,
  },// Clé du producteur venant du mobile
  Code: {
    type: String,
    default: null,
  },// Code de la parcelle
  ClePlant_mobi: {
    type: String,
    default: null,
  },// Clé du plantation venant du mobile
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
parcelleSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Superficie: this.Superficie,
    Coordonnee: this.Coordonnee,
    ProducteurId: this.ProducteurId,
    CleProd_mobi: this.CleProd_mobi,
    Code: this.Code,
    ClePlant_mobi: this.ClePlant_mobi,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter les modèles

const Parcelle = mongoose.model('Parcelle', parcelleSchema);

module.exports = Parcelle;
