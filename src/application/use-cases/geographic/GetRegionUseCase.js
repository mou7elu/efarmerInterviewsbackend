const BaseUseCase = require('../BaseUseCase');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const Region = require('../../../../models/Region');

/**
 * Use Case pour récupérer une région par ID
 */
class GetRegionUseCase extends BaseUseCase {
  constructor() {
    super();
  }

  /**
   * Exécute la récupération d'une région par ID
   * @param {string} regionId - ID de la région
   * @returns {Object} Région trouvée
   */
  async execute(regionId) {
    if (!regionId) {
      throw new ValidationError('L\'ID de la région est requis');
    }

    const region = await Region.findById(regionId).populate('DistrictId');

    if (!region) {
      throw new NotFoundError('Région non trouvée');
    }

    return {
      _id: region._id,
      libRegion: region.Lib_region,
      coordonnee: region.Coordonnee,
      sommeil: region.Sommeil,
      districtId: region.DistrictId,
      _createdAt: region.createdAt,
      _updatedAt: region.updatedAt
    };
  }
}

module.exports = { GetRegionUseCase };