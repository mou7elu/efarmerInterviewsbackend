const mongoose = require('mongoose');

const MenageSchema = new mongoose.Schema({
PaysId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pays',
        required: true,
      },// Référence au pays
    DistrictId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: true,
      },// Référence au district
    RegionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true,
    },// Identifiant de la région
    DepartementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Departement',
      required: true,
    },// Référence au departement
    SousprefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Souspref',
      required: true,
    },// Référence au sous-préfecture
     SecteurAdministratifId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SecteurAdministratif',
      required: true,
    },// Référence au secteur administratif    
    ZonedenombreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zonedenombre',
      required: true,
    },// Référence à la zone de dénombrement
  VillageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Village',
      required: true,
    },// Référence au village
  LocaliteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Localite',
      required: true,
    },// Référence à la localité
       EnqueteurId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },// Référence au enquêteur,
  Cod_menage: {
    type: String,
    required: true,
    unique: true,},// Code de la localité auto-généré (Code departement(3) + code souspref(2) + code zd(4) + ID Agent + N° ORD(2)) ex 023016090-MH-4WZ-SA8-01

    HasanacProducteur: {
      type: Boolean,
      default: false,
    },// Indique si le ménage a un exploitant d'anacarde
    NomChefMenage: {
      type: String,
    },// Nom du chef de ménage
    PrenomChefMenage: {
      type: String,
    },// Prénom du chef de ménage
    ContactChefMenage: {
      type: String,
    },// Contact du chef de ménage
    NombreExploitants: {
      type: Number,
      default: 0,
    },// Nombre d'exploitants dans le ménage
    ExploitantIsPresent: {
      type: Boolean,
      default: false,
    },// Indique si l'exploitant est présent dans le ménage
        RepresentantIsPresent: {
      type: Boolean,
      default: false,
    },// Indique si le représentant de l'exploitant est présent dans le ménage
    NomRepresentant: {
      type: String,
    },// Nom du représentant de l'exploitant
    PrenomRepresentant: {
      type: String,
    },// Prénom du représentant de l'exploitant
    ContactRepresentant: {
      type: String,
    },// Contact du représentant de l'exploitant
    CoordonneesGPS: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: []
      }
    },// Coordonnée du ménage geojson point
   MilieuResidence: {
      type: Number,
      default: 0,
      required: true,
    },// Milieu de résidence du ménage (3-rural ou 1-urbain ou 2-semi-urbain)
    
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
MenageSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Cod_menage: this.Cod_menage,
    HasanacProducteur: this.HasanacProducteur,
    NomChefMenage: this.NomChefMenage,
    PrenomChefMenage: this.PrenomChefMenage,
    ContactChefMenage: this.ContactChefMenage,
    NombreExploitants: this.NombreExploitants,
    ExploitantIsPresent: this.ExploitantIsPresent,
    RepresentantIsPresent: this.RepresentantIsPresent,
    NomRepresentant: this.NomRepresentant,
    PrenomRepresentant: this.PrenomRepresentant,
    ContactRepresentant: this.ContactRepresentant,
    CoordonneesGPS: this.CoordonneesGPS,
    MilieuResidence: this.MilieuResidence,
    PaysId: this.PaysId,
    DistrictId: this.DistrictId,
    RegionId: this.RegionId,
    DepartementId: this.DepartementId,
    SousprefId: this.SousprefId,
    SecteurAdministratifId: this.SecteurAdministratifId,
    ZonedenombreId: this.ZonedenombreId,
    VillageId: this.VillageId,
    LocaliteId: this.LocaliteId,
    EnqueteurId: this.EnqueteurId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter le modèle
const Menage = mongoose.model('Menage', MenageSchema);

module.exports = Menage;