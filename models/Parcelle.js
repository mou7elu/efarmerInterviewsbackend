const mongoose = require('mongoose');

const DepenseSchema = new mongoose.Schema({
  TypeDepense: {
    type: String,
    required: true,
  }, // Valeur stockée (ex: "Engrais", "Entretien","Pesticides","Matériel agricole","M.O Ramassage et séparation des pommes","Sac de jutes","Transport")
  Montant: {
    type: Number,
    default: 0,
  } ,// Montant en FCFA

}, { _id: false }); // pas d'identifiant propre, inclus dans la question
module.exports = DepenseSchema;

const MainOeuvreSchema = new mongoose.Schema({
  TypeMainOeuvre: {
    type: String,
    required: true,
  }, // Valeur stockée (ex: "Familiale", "Journaliere","Pesticides","Permanente,"Contractuelle","Autre")
  Frequence: {
    type: Number,
    default: 0,
  } ,// frequence par an
  Effectif: {
    type: Number,
    default: 0,
  } ,// nombre de personne

}, { _id: false }); // pas d'identifiant propre, inclus dans la question
module.exports = MainOeuvreSchema;

const parcelleSchema = new mongoose.Schema({
  Superficie: {
    type: Number,
	default: 0,
  },// Superficie selon les coordonnées GPS
  Coordonnee: {
    type: String,
    default: null, // Nullable property pour la géolocalisation
  },// Coordonnées GPS de la parcelle geojson polygon
  MenageId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Menage',
  required: true,
},// Référence au ménage
  ProducteurId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producteur',
      required: true,
    },// Identifiant du producteur
  Code: {
    type: String,
    required: true,
  },// Code de la parcelle auto-généré (Code producteur + numero d'ordre (2 positions) ex 023016090-MH-4WZ-SA8-01-01-01)
  IsSameLocalitethanExploitant: {
    type: Boolean,
    default: true,
  },// Indique si la parcelle est dans la même localité que l'exploitant
  RegionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Region',
          required: true,
      },// Identifiant de la région si IsSameLocalitethanExploitant est false
      DepartementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Departement',
        required: true,
      },// Référence au departement si IsSameLocalitethanExploitant est false
      SousprefId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Souspref',
        required: true,
      },// Référence au sous-préfecture si IsSameLocalitethanExploitant est false
       SecteurAdministratifId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SecteurAdministratif',
        required: true,
      },// Référence au secteur administratif   si IsSameLocalitethanExploitant est false  
      ZonedenombreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zonedenombre',
        required: true,
      },// Référence à la zone de dénombrement si IsSameLocalitethanExploitant est false
    LocaliteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Localite',
        required: true,
      },// Référence à la localité si IsSameLocalitethanExploitant est false
       MilieuResidence: {
    type: Number,
    default: 0,
    required: true,
  },// Milieu de résidence du ménage (3-rural ou 1-urbain ou 2-semi-urbain) si IsSameLocalitethanExploitant est false
  yearofcreationParcelle: {
    type: Number,
    required: true,
  },// Année de mise en place de la parcelle
  yearofProductionStart: {
    type: Number,
    required: true,
  },// Année d'entrée en production de la parcelle
  SuperficieProductive: {
    type: Number,
    default: 0,
  },// Superficie en production de la parcelle
  SuperficieNonProductive: {
    type: Number,
    default: 0,
  },// Superficie non en production de la parcelle
  TypeFaitValoirParcelle: {
    type: Number,
    required: true,
  },// Type de fait valoir de la parcelle (1.Propriétaire, 2.Fermage, 3.Métayage, 4.Planter-Partager, 5.Autre)
  TonnageLastYear: {
    type: Number,
    default: 0,
  },// Tonnage récolté l'année dernière sur la parcelle
  PrixVenteLastYear: {
    type: Number,
    default: 0,
  },// Prix de vente/Kg en FCFA l'année dernière sur la parcelle
  NombreEntretien: {
    type: Number,
    default: 0,
  },// Nombre d'entretien/an sur la parcelle
  ProvenanceDesPlants: {
    type: [Number],
    default: [],
  },//la provenance du matériel végétal (1. Tout venant,2. CNRA,3. ANADER,4. Pépiniériste privé,5. Je ne sais pas,6. Autre à préciser )
  HasCertificationProgramme: {
    type: Boolean,
    default: false,
  },// Indique si la parcelle est sous un programme de certification
  HasRecoursServicesConseils: {
    type: Boolean,
    default: false,
  },// Indique si la parcelle a recours aux services conseils
  RecoursServices: {
    type: Number,
    default: 0,
  },// Type de services conseils utilisés (1. Agent ANADER,2. Particulier,(Agronome),3. Coopérative,4. Autre à préciser ) si HasRecoursServicesConseils est true
  HasParcelleRehabilitee: {
    type: Boolean,
    default: false,
  },// Indique si la parcelle a été réhabilitée
  SuperficieRehabilitee: {
    type: Number,
    default: 0,
  },// Superficie réhabilitée si HasParcelleRehabilitee est true
  HasUseEngrais: {
    type: Boolean,
    default: false,
  },// Indique si la parcelle utilise des engrais sur 2 dernieres années
  HasUsePhytosanitaire: {
    type: Boolean,
    default: false,
  },// Indique si la parcelle utilise des produits phytosanitaires sur 2 dernieres années
  Depenses: {
    type: [DepenseSchema],
    default: [],
  },// Liste des dépenses effectuées sur la parcelle
  HasAssociationCulturelle: {
    type: Boolean,
    default: false,
  },// Indique si la parcelle fait l'objet d'une association culturale
  AssociationCulturelle: {
    type: [Number],
    default: [],
  },// choix multiple Détails de l'association culturale (1. Maïs,2. Igname,3. Soja,4. Arachide,5. Coton,6. Roucou,7. Cacao,8. Café,9. Palmier,10. Hévéa,11. Autre à préciser ) si HasAssociationCulturelle est true
  HasAnarcadePrincipaleCulture: {
    type: Boolean,
    default: false,
  },// Indique si l'anarcade est la principale culture de la parcelle
  MainOeuvre: {
    type: [MainOeuvreSchema],
    default: [],
  },// Liste des types de main d'oeuvre utilisés sur la parcelle
  SalaireMainOeuvre: {
    type: Number,
    default: 0,
  },// Salaire moyen Permanente en FCFA de la main d'oeuvre utilisée sur la parcelle
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
parcelleSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Superficie: this.Superficie,
    Coordonnee: this.Coordonnee,
    ProducteurId: this.ProducteurId,
    Code: this.Code,
    IsSameLocalitethanExploitant: this.IsSameLocalitethanExploitant,
    RegionId: this.RegionId,
    DepartementId: this.DepartementId,
    SousprefId: this.SousprefId,
    SecteurAdministratifId: this.SecteurAdministratifId,
    ZonedenombreId: this.ZonedenombreId,
    LocaliteId: this.LocaliteId,
    MilieuResidence: this.MilieuResidence,
    yearofcreationParcelle: this.yearofcreationParcelle,
    yearofProductionStart: this.yearofProductionStart,
    SuperficieProductive: this.SuperficieProductive,
    SuperficieNonProductive: this.SuperficieNonProductive,
    TypeFaitValoirParcelle: this.TypeFaitValoirParcelle,
    TonnageLastYear: this.TonnageLastYear,
    PrixVenteLastYear: this.PrixVenteLastYear,
    NombreEntretien: this.NombreEntretien,
    ProvenanceDesPlants: this.ProvenanceDesPlants,
    HasCertificationProgramme: this.HasCertificationProgramme,
    HasRecoursServicesConseils: this.HasRecoursServicesConseils,
    RecoursServices: this.RecoursServices,
    HasParcelleRehabilitee: this.HasParcelleRehabilitee,
    SuperficieRehabilitee: this.SuperficieRehabilitee,
    HasUseEngrais: this.HasUseEngrais,
    HasUsePhytosanitaire: this.HasUsePhytosanitaire,
    Depenses: this.Depenses,
    HasAssociationCulturelle: this.HasAssociationCulturelle,
    AssociationCulturelle: this.AssociationCulturelle,
    HasAnarcadePrincipaleCulture: this.HasAnarcadePrincipaleCulture,
    MainOeuvre: this.MainOeuvre,
    SalaireMainOeuvre: this.SalaireMainOeuvre,
     MenageId: this.MenageId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter les modèles

const Parcelle = mongoose.model('Parcelle', parcelleSchema);

module.exports = Parcelle;
