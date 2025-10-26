const mongoose = require('mongoose');

const pieceSchema = new mongoose.Schema({
  Nom_piece: {
    type: String,
    required: true,
  },// Libellé de la pièce
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
pieceSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Nom_piece: this.Nom_piece,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter le modèle
const Piece = mongoose.model('Piece', pieceSchema);

module.exports = Piece;
