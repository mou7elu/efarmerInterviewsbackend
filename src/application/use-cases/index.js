/**
 * Central export point for all use cases
 * Organized by domain for clean imports
 */

// Geographic Use Cases
const PaysUseCases = require('./geographic/PaysUseCases');
const DistrictUseCases = require('./geographic/DistrictUseCases');
const RegionUseCases = require('./geographic/RegionUseCases');
const DepartementUseCases = require('./geographic/DepartementUseCases');
const VillageUseCases = require('./geographic/VillageUseCases');

// Administrative Use Cases
const SousprefUseCases = require('./administrative/SousprefUseCases');
const SecteurAdministratifUseCases = require('./administrative/SecteurAdministratifUseCases');
const ZonedenombreUseCases = require('./administrative/ZonedenombreUseCases');
const LocaliteUseCases = require('./administrative/LocaliteUseCases');
const MenageUseCases = require('./administrative/MenageUseCases');

// Reference Use Cases
const ReferenceUseCases = require('./reference/ReferenceUseCases');

// User Use Cases
const UserUseCases = require('./user/UserUseCases');
const ProfileUseCases = require('./user/ProfileUseCases');

// Agricultural Use Cases
const ProducteurUseCases = require('./agricultural/ProducteurUseCases');
const ParcelleUseCases = require('./agricultural/ParcelleUseCases');

// Other Use Cases
const ZoneInterditUseCases = require('./other/ZoneInterditUseCases');

module.exports = {
  // Geographic
  ...PaysUseCases,
  ...DistrictUseCases,
  ...RegionUseCases,
  ...DepartementUseCases,
  ...VillageUseCases,

  // Administrative
  ...SousprefUseCases,
  ...SecteurAdministratifUseCases,
  ...ZonedenombreUseCases,
  ...LocaliteUseCases,
  ...MenageUseCases,

  // Reference
  ...ReferenceUseCases,

  // User
  ...UserUseCases,
  ...ProfileUseCases,

  // Agricultural
  ...ProducteurUseCases,
  ...ParcelleUseCases,

  // Other
  ...ZoneInterditUseCases
};
