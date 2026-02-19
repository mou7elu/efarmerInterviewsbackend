const mongoose = require('mongoose');

const LocaliteSchema = new mongoose.Schema({
  Lib_localite: {
    type: String,
    required: true,
  },// Libellé de la localité 
  Cod_localite: {
    type: String,
    required: true,},// Code de la localité 
  VillageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Village',
      required: true,
    },// Référence à la zone de dénombrement
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Index composé pour garantir l'unicité du code par village
LocaliteSchema.index({ Cod_localite: 1, VillageId: 1 }, { unique: true });

// Méthode pour convertir en DTO (Data Transfer Object)
LocaliteSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_localite: this.Lib_localite,
    Cod_localite: this.Cod_localite,
    VillageId: this.VillageId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter le modèle
const Localite = mongoose.model('Localite', LocaliteSchema);

module.exports = Localite;