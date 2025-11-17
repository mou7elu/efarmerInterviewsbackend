const mongoose = require('mongoose');

const professionSchema = new mongoose.Schema({
  Lib_Profession: {
    type: String,
    required: true,
  },// Libellé de la profession
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
professionSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Lib_Profession: this.Lib_Profession,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter le modèle
const Profession = mongoose.model('Profession', professionSchema);

module.exports = Profession;