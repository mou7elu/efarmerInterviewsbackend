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
  PaysId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pays',
    required: true,
  },// Référence au pays
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
villageSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_village: this.Lib_village,
    Coordonnee: this.Coordonnee,
    PaysId: this.PaysId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter le modèle
const Village = mongoose.model('Village', villageSchema);

module.exports = Village;
