const mongoose = require('mongoose');

const DepartementSchema = new mongoose.Schema({
  Lib_Departement: {
    type: String,
    required: true,
  },// Libellé du département
  Cod_departement: {
    type: String,
    required: true,},// Code du département
    RegionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Region',
      required: true,
    },// Identifiant de la région
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Index composé pour garantir l'unicité du code par région
DepartementSchema.index({ Cod_departement: 1, RegionId: 1 }, { unique: true });

// Méthode pour convertir en DTO (Data Transfer Object)
DepartementSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_Departement: this.Lib_Departement,
    Cod_departement: this.Cod_departement,
    RegionId: this.RegionId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Exporter le modèle
const Departement = mongoose.model('Departement', DepartementSchema);

module.exports = Departement;
