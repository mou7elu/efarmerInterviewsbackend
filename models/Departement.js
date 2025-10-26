const mongoose = require('mongoose');

const DepartementSchema = new mongoose.Schema({
  Lib_Departement: {
    type: String,
    required: true,
  },// Libellé du département
    RegionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Region',
      required: true,
    },// Identifiant de la région
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
DepartementSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_Departement: this.Lib_Departement,
    RegionId: this.RegionId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Exporter le modèle
const Departement = mongoose.model('Departement', DepartementSchema);

module.exports = Departement;
