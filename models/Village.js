const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema({
  Lib_village: {
    type: String,
    required: true,
  },// Libellé du village
  Coordonnee: {
    type: String,
    default: null,
  },// Coordonnée du village geojson point
    ZonedenombreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zonedenombre',
      required: true,
    },// Référence à la zone de dénombrement
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
villageSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_village: this.Lib_village,
    Coordonnee: this.Coordonnee,
    ZonedenombreId: this.ZonedenombreId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter le modèle
const Village = mongoose.model('Village', villageSchema);

module.exports = Village;
