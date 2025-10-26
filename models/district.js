const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  Lib_district: {
    type: String,
    required: true,
  },// Libellé du district
 // Coordonnée du district geojson polygon
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
districtSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_district: this.Lib_district,
    Sommeil: this.Sommeil,
    PaysId: this.PaysId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Exporter le modèle
const District = mongoose.model('District', districtSchema);

module.exports = District;
