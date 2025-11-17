/**
 * Domain Entities Index
 * Central export point for all domain entities
 */

// Geographic entities
const Pays = require('./Pays');
const District = require('./District');
const Region = require('./Region');
const Departement = require('./Departement');
const Village = require('./Village');

// Administrative entities
const Souspref = require('./Souspref');
const SecteurAdministratif = require('./SecteurAdministratif');
const Zonedenombre = require('./Zonedenombre');
const Localite = require('./Localite');
const Menage = require('./Menage');

// Reference entities
const Profession = require('./Profession');
const Nationalite = require('./Nationalite');
const NiveauScolaire = require('./NiveauScolaire');
const Piece = require('./Piece');

// User entities
const User = require('./User');
const Profile = require('./Profile');

// Agricultural entities
const Producteur = require('./Producteur');
const Parcelle = require('./Parcelle');

// Other entities
const ZoneInterdit = require('./ZoneInterdit');

module.exports = {
  // Geographic
  Pays,
  District,
  Region,
  Departement,
  Village,
  
  // Administrative
  Souspref,
  SecteurAdministratif,
  Zonedenombre,
  Localite,
  Menage,
  
  // Reference
  Profession,
  Nationalite,
  NiveauScolaire,
  Piece,
  
  // User
  User,
  Profile,
  
  // Agricultural
  Producteur,
  Parcelle,
  
  // Other
  ZoneInterdit
};
