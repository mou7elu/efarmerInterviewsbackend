const mongoose = require('mongoose');


const producteurSchema = new mongoose.Schema({
  Code: {
    type: String,
    required: true,
  },// Code du producteur
  Telephone1: {
    type: String,
  },// Téléphone 1 du producteur
  Telephone2: {
    type: String,
  },// Téléphone 2 du producteur
  Nom: {
    type: String,
  },// Nom du producteur
  Prenom: {
    type: String,
  },// Prénom du producteur
  Datnais: {
    type: Date,
  },// Date de naissance
  Lieunais: {
    type: String,
  },// Lieu de naissance
  Photo: {
    type: Buffer,
  },// Photo du producteur
  Signature: {
    type: Buffer,
  },// Signature du producteur  
  Genre: {
    type: Number,
  },// Genre du producteur
  sommeil: {
    type: Boolean,
    default: false,
  },// Indique si le producteur est actif ou inactif
  Date_signe: {
    type: Date,
  },// Date de signature

  CleProd_mobi: {
    type: String,
  },// Clé du producteur venant du mobile
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
producteurSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Code: this.Code,
    Adresse: this.Adresse,
    Telephone1: this.Telephone1,
    Telephone2: this.Telephone2,
    Nom: this.Nom,
    Prenom: this.Prenom,
    Datnais: this.Datnais,
    Lieunais: this.Lieunais,
    Photo: this.Photo,
    Signature: this.Signature,
    Genre: this.Genre,
    sommeil: this.sommeil,
    Date_signe: this.Date_signe,   
    CleProd_mobi: this.CleProd_mobi,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter les modèles
const Producteur = mongoose.model('Producteur', producteurSchema);

module.exports = Producteur;
