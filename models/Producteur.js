const mongoose = require('mongoose');
const Menage = require('./Menage');

const OutillageExploitationSchema = new mongoose.Schema({
  Rubrique: {
    type: String,
    required: true,
  }, // Valeur stockée (ex: "Sécateur", "Scie de recépage ","Ébancheur,émondoir","Autres outillage")
  NombreTotalEquipement: {
    type: Number,
    default: 0,
  }, // nombre total d'équipements
  NombreTotalEquipementPropriete: {
    type: Number,
    default: 0,
  } // nombre d'équipements dont le producteur est propriétaire
}, { _id: false }); // pas d'identifiant propre, inclus dans la question

module.exports = OutillageExploitationSchema;

const OtherSpeculationSchema = new mongoose.Schema({
  Speculation: {
    type: String,
    required: true,
  }, // Valeur stockée (ex: "Coton", "Café","Palmier à huile","Hévéa","Mangue","Autre","Aucune")
  Superficie: {
    type: Number,
    default: 0,
  }, // surface en hectares
  Tonnage: {
    type: Number,
    default: 0,
  }, // tonnage produit en tonnes
  PrixKiloVente: {
    type: Number,
    default: 0,
  } // prix de vente au kilo en FCFA
}, { _id: false }); // pas d'identifiant propre, inclus dans la question

module.exports = OtherSpeculationSchema;

const CultureVivrierSchema = new mongoose.Schema({
  Speculation: {
    type: String,
    required: true,
  }, // Valeur stockée (ex: "Igname", "Maraîchère","Maïs","Manioc","Arachide","Banane","Ananas","Riz","Taro","Elevage","Autre","Aucune")
  Tonnage: {
    type: Number,
    default: 0,
  }, // tonnage produit en tonnes
  PrixKiloVente: {
    type: Number,
    default: 0,
  } // prix de vente au kilo en FCFA
}, { _id: false }); // pas d'identifiant propre, inclus dans la question

module.exports = CultureVivrierSchema;

const petitOutillageExploitationSchema = new mongoose.Schema({
  Rubrique: {
    type: String,
    required: true,
  }, // Valeur stockée (ex: "Brouette", "Machettes","Limes","Atomiseur","Pulvérisateur","Bascule","Tronçonneuse","Autre")
    NombreTotalEquipement: {
    type: Number,
    default: 0,
  }, // nombre total d'équipements
  NombreTotalEquipementPropriete: {
    type: Number,
    default: 0,
  } // nombre d'équipements dont le producteur est propriétaire
}, { _id: false }); // pas d'identifiant propre, inclus dans la question

module.exports = petitOutillageExploitationSchema;

const MaterielTransportExploitationSchema = new mongoose.Schema({
  Rubrique: {
    type: String,
    required: true,
  }, // Valeur stockée (ex: "Automobile", "Motocyclette","Bicyclette","Tricycle","Animaux de trait","Charrette",,"Autre matériels de transport")
   NombreTotalEquipement: {
    type: Number,
    default: 0,
  }, // nombre total d'équipements
  NombreTotalEquipementPropriete: {
    type: Number,
    default: 0,
  } // nombre d'équipements dont le producteur est propriétaire
}, { _id: false }); // pas d'identifiant propre, inclus dans la question

module.exports = MaterielTransportExploitationSchema;

const TypeElevageSchema = new mongoose.Schema({
  Espece: {
    type: String,
    required: true,
  }, // Valeur stockée (ex: "Volaille", "Bovin","Ovin","Caprin","Porcin","Autre espèce")
   NombreTeteVendu: {
    type: Number,
    default: 0,
  }, // Nombre de têtes vendues les 12 derniers mois
  PrixTeteVente: {
    type: Number,
    default: 0,
  } ,// prix de vente par tête en FCFA
  NombreTeteDispo: {
    type: Number,
    default: 0,
  } // nombre de têtes disponible actuellement
}, { _id: false }); // pas d'identifiant propre, inclus dans la question

module.exports = TypeElevageSchema;

const producteurSchema = new mongoose.Schema({
      MenageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menage',
      required: true,
    },// Référence au ménage
     EnqueteurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },// Référence au enquêteur
  Code: {
    type: String,
    required: true,
  },// Code du producteur auto-généré (Code menage (14 position)+ numero d'ordre (2 positions) ex 023016090-MH-4WZ-SA8-01-01)
  IsExploitant: {
    type: Boolean,
    default: false,
    required: true,
  },// Indique si le producteur est un exploitant
  //bloc informations representant exploitant si IsExploitant est false
  LienRepresentExploitant: {
    type: Number,
    required: true,
  },// Lien avec l'exploitant (1-Familial, 2-professionnel)
   NomRepresentant: {
      type: String,
    },// Nom du représentant de l'exploitant
    PrenomRepresentant: {
      type: String,
    },// Prénom du représentant de l'exploitant
    DateNaissRepresentant: {
      type: Date,
    },// Date de naissance du représentant de l'exploitant
    PaysNaissRepresentant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pays',
          },// Référence au pays
    LieuNaissRepresentant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Souspref',
          },// Référence au Souspref
GenreRepresentant: {
      type: Number,
    },// Genre du représentant de l'exploitant
    NiveauScolaireRepresentant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NiveauScolaire',
      },// Référence au niveau scolaire
      HasFormationAgricole: {
        type: Boolean,
        default: false,
      },// Indique si le représentant a une formation agricole
          ProfessionRepresentant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profession',
      },// Référence à la profession
      NatioliteRepresentant: {type:Number,},// Nationalité du représentant de l'exploitant (1-Ivoirienne, 2-étrangère)
      PaysdorigineRepresentant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pays',
          },// Référence au pays d'origine si étrangère
  ContactPrincipalRepresentant: {
      type: String,
    },// Contact du représentant de l'exploitant
    ContactSecondaireRepresentant: {
      type: String,
    },// Contact secondaire du représentant de l'exploitant
   //fin bloc informations representant exploitant   
   //bloc informations exploitant si IsExploitant est true
   NomExploitant: {
      type: String,
    },// Nom de l'exploitant
    PrenomExploitant: {
      type: String,
    },// Prénom de l'exploitant
    DateNaissExploitant: {
      type: Date,
    },// Date de naissance de l'exploitant
    PaysNaissExploitant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pays',
          },// Référence au pays
    LieuNaissExploitant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Souspref',
          },// Référence au Souspref
GenreExploitant: {
      type: Number,
    },// Genre de l'exploitant
    NiveauScolaireExploitant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NiveauScolaire',
      },// Référence au niveau scolaire
      HasFormationAgricole: {
        type: Boolean,
        default: false,
      },// Indique si l'exploitant a une formation agricole
          ProfessionExploitant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profession',
      },// Référence à la profession
      NationaliteExploitant: {type:Number,},// Nationalité de l'exploitant (1-Ivoirienne, 2-étrangère)
      PaysdorigineExploitant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pays',
          },// Référence au pays d'origine si étrangère
  ContactPrincipalExploitant: {
      type: String,
    },// Contact de l'exploitant
    ContactSecondaireExploitant: {
      type: String,
    },// Contact secondaire de l'exploitant
    PhotoExploitant: {
    type: Buffer,
  },// Photo de l'exploitant
    PhotoJustificative: {
    type: Buffer,
  },// Photo justificative de l'identité de l'exploitant
   PieceExploitant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Piece',
          },// Référence au piece Justificatif d’identité
          NumeroPieceExploitant: {
    type: String,
  },// Numéro du piece justificatif d’identité
  SituationMatrimonialeExploitant: {
    type: Number,
  },// Situation matrimoniale de l'exploitant (1. Célibataire,2. Marié(e) (Traditionnel, Civil, Religieux) 3. Veuf(ve)  4. Divorcé(e) 5. Concubinage (vivent ensemble sans être mariés)6. Autre (préciser))
  PrecisionSituationMatrimoniale: {
    type: String,
  },// Précision sur la situation matrimoniale si autre
   //fin bloc informations exploitant
 //bloc composition du menage de l'exploitant
 NombreMembresMenage: {
    type: Number,
    default: 0,
  },// Nombre de membres dans le ménage de l'exploitant
  NombreEnfants: {
    type: Number,
    default: 0,
  },// Nombre d'enfants dans le ménage de l'exploitant
  NombreEnfantsScolarisés: {
    type: Number,
    default: 0,
  },// Nombre d'enfants scolarisés dans le ménage de l'exploitant
  NombrePersonnesChargeHorMenage: {
    type: Number,
    default: 0,
  },// Nombre de personnes à charge hors ménage de l'exploitant
  NombreEpouse: {
    type: Number,
    default: 0,
  },// Nombre d'épouse 
 //fin bloc composition du menage de l'exploitant
 //bloc caratéristiques du menage de l'exploitant
 TypeBatimentResidence: {
    type: [Number],
    default: [],
  },// (choix multiple) Type de bâtiment de résidence du ménage de l'exploitant (1. Villa 2. Maison simple  3. Logement en bande… 4. Appartement dans un immeuble 5. Concession 6. Case traditionnelle 8. Autre à préciser )
  PreciserTypeBatiment: {
    type: String,
  },// Préciser le type de bâtiment si autre
  PrincipalMateriauBatiment: {
    type: Number,
    default: 0,
  },// Matériau principal du bâtiment de résidence du ménage de l'exploitant (1. Bois,2. Tôle ,3. Banco ou terre battue ,4. Semi-dur ,5. Géobéton ,6. Dur ,7. Plastique (bâche) ,8. Autre à préciser)
  PreciserMateriauBatiment: {
    type: String,
  },// Préciser le matériau du bâtiment si autre
  PrincipalMateriauToit: {
    type: Number,
    default: 0,
  },// Matériau principal du toit du bâtiment de résidence du ménage de l'exploitant (1. Fibre végétale (paille, papot…),2. Tôle ,3. Béton (ciment, dalle),4. Tuile / Everite (imitation de tuile),5. Toile en plastique,6. Autre à préciser)
  PreciserMateriauToit: {
    type: String,
  },// Préciser le matériau du toit si autre
  PrincipaleSourceEclairage: {
    type: Number,
    default: 0,
  },// Principale source d'éclairage du ménage de l'exploitant (1. Electricité (CIE),2. Groupe électrogène,3. Panneau solaire,4. Lampe (à pétrole, à gaz, à huile),5. Bois de chauffe,6. Torche,7. Autre à préciser)
  PreciserSourceEclairage: {
    type: String,
  },// Préciser la source d'éclairage si autre
  PrincipaleSourceEau: {
    type: Number,
    default: 0,
  },// Principale source d'eau du ménage de l'exploitant (1. Eau de robinet dans le logement,2. Eau de robinet dans la cour,3. Robinet public / borne fontaine,4. Puit à pompe / forage,5. Puit creusé protégé,6. Puit creusé pas protégé,7. Source d’eau protégée,8. Source d’eau non protégée,9. Eau de surface ,10. Eau conditionnée en bouteille ou en sachet,11. Autre à préciser)
  PreciserSourceEau: {
    type: String,
  },// Préciser la source d'eau si autre
  PrincipaleInstallationSanitaire: {
    type: Number,
    default: 0,
  },// Principale sanitaire utilisé par ménage de l'exploitant (1. Chasse d’eau reliée à un système d’égouts ,2. Chasse d’eau reliée à une fosse septique ,3. Chasse d’eau reliée à l’air libre ,4. Chasse d’eau reliée à un lieu inconnu ,5. Latrine à fosse améliorée ventilée ,6. Latrine à fosse non ventilée ,7. Toilette à compostage ,8. Toilettes suspendues / latrines suspendues,9.  Pas de toilettes / nature / champs,10.  Autre (préciser))
  PreciserInstallationSanitaire: {
    type: String,
  },// Préciser l'installation sanitaire si autre
  PrincipaleSourceCombustible: {
    type: Number,
    default: 0,
  },// Principale source de combustible pour la cuisine du ménage de l'exploitant (1. Bois de chauffe,2. Gaz ,3. Charbon ,4. Electricité ,5. Autre à préciser )
  PreciserSourceCombustible: {
    type: String,
  },// Préciser la source d'énergie pour la cuisine si autre
  PrincipalMoyenMobilite: {
    type: Number,
    default: 0,},// Principal moyen de mobilité du ménage de l'exploitant (1. Vélo/Bicyclette,2. Moto/mobylette ,3. Véhicule,4. Pirogue ,5. Hors-bord ,6. Charrette )
 //fin bloc caratéristiques du menage de l'exploitant
 //bloc infrastructure et équipement  de l'exploitant
 HasStockageBatimentAgricole: {
    type: Boolean,
    default: false,
  },// Indique si l'exploitant a un bâtiment de stockage agricole
  CapaciteStockageKg: {
    type: Number,
    default: 0,
  },// Capacité de stockage en kg si HasStockageBatimentAgricole est true
  HasMachineAgricole: {
    type: Boolean,
    default: false,
  },// Indique si l'exploitant a des machines agricoles
  MachineAgricole: {
    type: Number,
    default: 0,
  },//  Type de machines agricoles possédées par l'exploitant (1. Tracteur,2. Pulvérisateur / Atomiseur ,3. Épandeur d’engrais ,4. Désherbeur mécanique / Débroussailleuse ,5. Équipement de traitement post récolte ,6. Autre à préciser ) si HasMachineAgricole est true
  PreciserMachineAgricole: {
    type: String,
  },// Préciser le type de machine agricole si autre
  EquipementSechageAgricole: {
    type: Number,
    default: 0,
  },//  Type d'équipement de séchage agricole possédées par l'exploitant (1. Claie de séchage,2. Bâches,3. Autres (précisez))
  PreciserEquipementSechage: {
    type: String,
  },// Préciser le type d'équipement de séchage si autre
 //fin bloc infrastructure et équipement  de l'exploitant
 //bloc acces aux services de l'exploitant
 ReseauxMobile: {
    type: [Number],
    default: [],
  },// (choix multiple) Réseaux mobiles auxquels l'exploitant a accès (1. Orange ,2. MTN,3. Moov ,4. Aucun)
  HasInternet: {
    type: Boolean,
    default: false,
  },// Indique si l'exploitant a accès à internet
  HasInfastructureSante: {
    type: Boolean,
    default: false,
  },// Indique si l'exploitant a accès à une infrastructure de santé
  distanceInfastructureSanteKm: {
    type: Number,
    default: 0,
  },// Distance en km jusqu'à l'infrastructure de santé la plus proche si HasInfastructureSante est true
  PraticienSante: {
    type: Number,
    default: 0,
  },// Type de praticien de santé consultez vous prioritairement (1. Tradipraticien ,2. Aide-soignant ,3. Infirmier,4. Médecin) 
  DepenseSanteAnnuel: {
    type: Number,
    default: 0,
  },// Dépense annuelle en santé en FCFA
  InfrastructueEducation: {
    type: [Number],
    default: [],
  },// (choix multiple) Infrastructures éducatives auxquelles l'exploitant a accès (1. École primaire ,2. Collège de proximité ,3. Aucun)
  DistanceInfrastructureEducationKm: {
    type: [Number],
    default: [],
  },// Distance en km jusqu'à l'infrastructure éducative  (école primaire, collège de proximité) si InfrastructueEducation n'est pas aucun
  HasCompteBancaire: {
    type: Boolean,
    default: false,
  },// Indique si l'exploitant a un compte bancaire
  StructureBancaire: {
    type: [Number],
    default: [],
  },// (choix multiple)Type de structure bancaire où l'exploitant a son compte (1. Banque commerciale) si HasCompteBancaire est true
WhyPasCompteBancaire: {
    type: [Number],
    default: [],
  },// (choix multiple) Raisons pour lesquelles l'exploitant n'a pas de compte bancaire (1. Manque de confiance,2. Pas intéressé,3. Trop éloigné ,4. Pas informé ,5. Préférence pour les transactions en espèces,6. Faible revenu ) si HasCompteBancaire est false
HasMobileMoney: {
    type: Boolean,
    default: false,
  },// Indique si l'exploitant a un compte Mobile Money
 StructureMobileMoney: {
    type: [Number],
    default: [],
  },// (choix multiple)Type de structure Mobile Money où l'exploitant a son compte (2. Orange Money ,1. MTN Mobile Money ,3. Moov Money,4. Wave,5. Autres ) si HasMobileMoney is true
WhyPasMobileMoney: {
    type: [Number],
    default: [],
  },// (choix multiple) Raisons pour lesquelles l'exploitant n'a pas de compte Mobile Money (1. Manque de confiance,2. Pas intéressé,3. Trop éloigné ,4. Pas informé ,5. Préférence pour les transactions en espèces,6. Faible revenu ) si HasMobileMoney is false
  HasUseMobileMoneyService: {
    type: Boolean,
    default: false,
  },// Indique si l'exploitant utilise les services de Mobile Money
  TypeServiceMobileMoney: {
    type: [Number],
    default: [],
  },// (choix multiple) Types de services Mobile Money utilisés par l'exploitant (1. Dépôt,2. Retrait,3. Achat de services (Facture, …) ,4. Dépenses d’exploitation ) si HasUseMobileMoneyService is true
  MontantMensuelMobileMoney: {
    type: Number,
    default: 0,
  },// Montant mensuel moyen des transactions Mobile Money en FCFA si HasUseMobileMoneyService is true
  MontantMaximumTransaction: {
    type: Number,
    default: 0,
  },// Montant maximum pour une seule transaction Mobile Money en FCFA si HasUseMobileMoneyService is true
 //fin bloc acces aux services de l'exploitant
 //bloc aspects sociaux et culturels de l'exploitant
 HasAppartenanceGroupe: {
    type: Boolean,
    default: false,
  },// Indique si l'exploitant appartient à un groupe social/culturel
  TypeGroupe: {
    type: Number,
    default: 0,
  },// Type de groupe social/culturel auquel l'exploitant appartient (1. Coopérative agricole,2. Groupement informel ,3. Association  ) si HasAppartenanceGroupe is true
  SpecialiteGroupe: {
    type: String,
  },// spécialisation de l’organisatio auquel l'exploitant appartient si HasAppartenanceGroupe is true
  HasAppartenanceTontine: {
    type: Boolean,
    default: false,
  },// Indique si l'exploitant appartient à une tontine
  TypeTontine: {
    type: [Number],
    default: [],
  },// (choix multiple) Raisons pour lesquelles l'exploitant appartient à une tontine (1. Financière ,2. en nature) si HasAppartenanceTontine is true
  MontantTontine: {
    type: Number,
    default: 0,
  },// Montant mensuel versé à la tontine en FCFA si HasAppartenanceTontine is true et TypeTontine contient 1 (financière)
  BienNatureTontine: {
    type: [Number],
    default: [],
  },// Bien en nature versé à la tontine (1. Vivre,2. Non vivre) si HasAppartenanceTontine is true et TypeTontine contient 2 (en nature)
 //fin bloc aspects sociaux et culturels de l'exploitant
 //bloc surface agricole de l'exploitant
  SurfaceAgricoleTotaleUseHa: {
    type: Number,
    default: 0,
  },// Surface agricole totale utilisée en hectares
  SurfaceAgricoleTotaleJachèreHa: {
    type: Number,
    default: 0,
  },// Surface agricole totale jachère en hectares
  SurfaceAgricoleTotaleHa: {
    type: Number,
    default: 0,
  },// Surface agricole totale  en hectares (utilisée + jachère)
 //fin bloc surface agricole de l'exploitant
//bloc exploitation anacarde de l'exploitant
NombreParcellesAnacarde: {
    type: Number,
    default: 1,
  },// Nombre de parcelles d'anacarde de l'exploitant
  OutillageExploitationAnacarde: {
    type: [OutillageExploitationSchema],
    default: [],
  },// Outillage de l'exploitation anacarde de l'exploitant
  PetitOutillageExploitationAnacarde: {
    type: [petitOutillageExploitationSchema],
    default: [],
  },// Petit outillage de l'exploitation anacarde de l'exploitant
  MaterielTransportExploitationAnacarde: {
    type: [MaterielTransportExploitationSchema],
    default: [],
  },// Matériel de transport de l'exploitation anacarde de l'exploitant
  HasPratiqueOtherSpeculation: {
    type: Boolean,
    default: false,
  },// Indique si l'exploitant pratique d'autres spéculations en plus de l'anacarde
//fin bloc exploitation anacarde de l'exploitant
//bloc autres spéculations de l'exploitant
  OtherSpeculations: {
    type: [OtherSpeculationSchema],
    default: [],
  },// Autres spéculations pratiquées par l'exploitant si HasPratiqueOtherSpeculation est true
  HasPratiqueCulturesVivrier: {
    type: Boolean,
    default: false,
  },// Indique si l'exploitant pratique des cultures vivrières
  CultureVivriers: {
    type: [CultureVivrierSchema],
    default: [],
  },// Cultures vivrières pratiquées par l'exploitant si HasPratiqueCulturesVivrier is true
  TypeElevages: {
    type: [TypeElevageSchema],
    default: [],
  },// Types d'élevages pratiqués par l'exploitant 
//fin bloc autres spéculations de l'exploitant

}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Méthode pour convertir en DTO (Data Transfer Object)
producteurSchema.methods.toDTO = function() {
  return {
    id: this._id,
    Code: this.Code,
    IsExploitant: this.IsExploitant,
    LienRepresentExploitant: this.LienRepresentExploitant,
    NomRepresentant: this.NomRepresentant,
    PrenomRepresentant: this.PrenomRepresentant,
    DateNaissRepresentant: this.DateNaissRepresentant,
    PaysNaissRepresentant: this.PaysNaissRepresentant,
    LieuNaissRepresentant: this.LieuNaissRepresentant,
    GenreRepresentant: this.GenreRepresentant,
    NiveauScolaireRepresentant: this.NiveauScolaireRepresentant,
    HasFormationAgricole: this.HasFormationAgricole,
    ProfessionRepresentant: this.ProfessionRepresentant,
    NatioliteRepresentant: this.NatioliteRepresentant,
    PaysdorigineRepresentant: this.PaysdorigineRepresentant,
    ContactPrincipalRepresentant: this.ContactPrincipalRepresentant,
    ContactSecondaireRepresentant: this.ContactSecondaireRepresentant,
    NomExploitant: this.NomExploitant,
    PrenomExploitant: this.PrenomExploitant,
    DateNaissExploitant: this.DateNaissExploitant,
    PaysNaissExploitant: this.PaysNaissExploitant,
    LieuNaissExploitant: this.LieuNaissExploitant,
    GenreExploitant: this.GenreExploitant,
    NiveauScolaireExploitant: this.NiveauScolaireExploitant,
    ProfessionExploitant: this.ProfessionExploitant,
    NationaliteExploitant: this.NationaliteExploitant,
    PaysdorigineExploitant: this.PaysdorigineExploitant,
    ContactPrincipalExploitant: this.ContactPrincipalExploitant,
    ContactSecondaireExploitant: this.ContactSecondaireExploitant,
    SituationMatrimonialeExploitant: this.SituationMatrimonialeExploitant,
    PrecisionSituationMatrimoniale: this.PrecisionSituationMatrimoniale,
    NombreMembresMenage: this.NombreMembresMenage,
    NombreEnfants: this.NombreEnfants,
    NombreEnfantsScolarisés: this.NombreEnfantsScolarisés,
    NombrePersonnesChargeHorMenage: this.NombrePersonnesChargeHorMenage,
    NombreEpouse: this.NombreEpouse,
    TypeBatimentResidence: this.TypeBatimentResidence,
    PreciserTypeBatiment: this.PreciserTypeBatiment,
    PrincipalMateriauBatiment: this.PrincipalMateriauBatiment,
    PreciserMateriauBatiment: this.PreciserMateriauBatiment,
    PrincipalMateriauToit: this.PrincipalMateriauToit,
    PreciserMateriauToit: this.PreciserMateriauToit,
    PrincipaleSourceEclairage: this.PrincipaleSourceEclairage,
    PreciserSourceEclairage: this.PreciserSourceEclairage,
    PrincipaleSourceEau: this.PrincipaleSourceEau,
    PreciserSourceEau: this.PreciserSourceEau,
    PrincipaleInstallationSanitaire: this.PrincipaleInstallationSanitaire,
    PreciserInstallationSanitaire: this.PreciserInstallationSanitaire,
    PrincipaleSourceCombustible: this.PrincipaleSourceCombustible,
    PreciserSourceCombustible: this.PreciserSourceCombustible,
    PrincipalMoyenMobilite: this.PrincipalMoyenMobilite,
    HasStockageBatimentAgricole: this.HasStockageBatimentAgricole,
    CapaciteStockageKg: this.CapaciteStockageKg,
    HasMachineAgricole: this.HasMachineAgricole,
    MachineAgricole: this.MachineAgricole,
    PreciserMachineAgricole: this.PreciserMachineAgricole,
    EquipementSechageAgricole: this.EquipementSechageAgricole,
    PreciserEquipementSechage: this.PreciserEquipementSechage,
    ReseauxMobile: this.ReseauxMobile,
    HasInternet: this.HasInternet,
    HasInfastructureSante: this.HasInfastructureSante,
    distanceInfastructureSanteKm: this.distanceInfastructureSanteKm,
    PraticienSante: this.PraticienSante,
    DepenseSanteAnnuel: this.DepenseSanteAnnuel,
    InfrastructueEducation: this.InfrastructueEducation,
    DistanceInfrastructureEducationKm: this.DistanceInfrastructureEducationKm,
    HasCompteBancaire: this.HasCompteBancaire,
    StructureBancaire: this.StructureBancaire,
    WhyPasCompteBancaire: this.WhyPasCompteBancaire,
    HasMobileMoney: this.HasMobileMoney,
    StructureMobileMoney: this.StructureMobileMoney,
    WhyPasMobileMoney: this.WhyPasMobileMoney,
    HasUseMobileMoneyService: this.HasUseMobileMoneyService,
    TypeServiceMobileMoney: this.TypeServiceMobileMoney,
    MontantMensuelMobileMoney: this.MontantMensuelMobileMoney,
    MontantMaximumTransaction: this.MontantMaximumTransaction,
    HasAppartenanceGroupe: this.HasAppartenanceGroupe,
    TypeGroupe: this.TypeGroupe,
    SpecialiteGroupe: this.SpecialiteGroupe,
    HasAppartenanceTontine: this.HasAppartenanceTontine,
    TypeTontine: this.TypeTontine,
    MontantTontine: this.MontantTontine,
    BienNatureTontine: this.BienNatureTontine,
    SurfaceAgricoleTotaleUseHa: this.SurfaceAgricoleTotaleUseHa,
    SurfaceAgricoleTotaleJachèreHa: this.SurfaceAgricoleTotaleJachèreHa,
    SurfaceAgricoleTotaleHa: this.SurfaceAgricoleTotaleHa,
    NombreParcellesAnacarde: this.NombreParcellesAnacarde,
    OutillageExploitationAnacarde: this.OutillageExploitationAnacarde,
    PetitOutillageExploitationAnacarde: this.PetitOutillageExploitationAnacarde,
    MaterielTransportExploitationAnacarde: this.MaterielTransportExploitationAnacarde,
    HasPratiqueOtherSpeculation: this.HasPratiqueOtherSpeculation,
    OtherSpeculations: this.OtherSpeculations,
    HasPratiqueCulturesVivrier: this.HasPratiqueCulturesVivrier,
    CultureVivriers: this.CultureVivriers,
    TypeElevages: this.TypeElevages,
    MenageId: this.MenageId,
    EnqueteurId: this.EnqueteurId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};


// Exporter les modèles
const Producteur = mongoose.model('Producteur', producteurSchema);

module.exports = Producteur;
