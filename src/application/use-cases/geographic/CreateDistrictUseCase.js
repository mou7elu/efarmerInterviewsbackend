const BaseUseCase = require('../BaseUseCase');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const District = require('../../../../models/district');

/**
 * Use Case pour créer un district
 */
class CreateDistrictUseCase extends BaseUseCase {
  constructor() {
    super();
  }

  /**
   * Exécute la création d'un district
   * @param {Object} districtData - Données du district
   * @returns {Promise<Object>}
   */
  async execute(districtData) {
    // Validation des données d'entrée
    this.validateInput(districtData);

    // Vérifier si le district existe déjà
    const existingDistrict = await District.findOne({ 
      Lib_district: districtData.Lib_district || districtData.libDistrict 
    });
    if (existingDistrict) {
      throw new ValidationError('Un district avec ce libellé existe déjà');
    }

    // Transformer les données pour correspondre au modèle
    const districtToCreate = {
      Lib_district: districtData.Lib_district || districtData.libDistrict,
      Sommeil: districtData.Sommeil || districtData.sommeil || false,
      PaysId: districtData.PaysId || districtData.paysId
    };

    // Créer le district
    const district = await District.create(districtToCreate);

    return {
      _id: district._id,
      Lib_district: district.Lib_district,
      Sommeil: district.Sommeil,
      PaysId: district.PaysId,
      createdAt: district.createdAt,
      updatedAt: district.updatedAt
    };
  }

  /**
   * Valide les données d'entrée
   * @param {Object} data - Données à valider
   */
  validateInput(data) {
    if (!data) {
      throw new ValidationError('Les données du district sont requises');
    }

    const libDistrict = data.Lib_district || data.libDistrict;
    if (!libDistrict || libDistrict.trim() === '') {
      throw new ValidationError('Le libellé du district est requis');
    }

    if (libDistrict.length > 100) {
      throw new ValidationError('Le libellé du district ne peut pas dépasser 100 caractères');
    }

    if (!data.PaysId && !data.paysId) {
      throw new ValidationError('Le pays est requis');
    }
  }
}

module.exports = { CreateDistrictUseCase };