const BaseUseCase = require('../BaseUseCase');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const District = require('../../../../models/district');

/**
 * Use Case pour récupérer un district par son ID
 */
class GetDistrictUseCase extends BaseUseCase {
  constructor() {
    super();
  }

  /**
   * Exécute la récupération d'un district
   * @param {string} id - ID du district
   * @returns {Promise<Object>}
   */
  async execute(id) {
    if (!id) {
      throw new ValidationError('L\'ID du district est requis');
    }

    const district = await District.findById(id).populate('PaysId').lean();
    
    if (!district) {
      throw new NotFoundError('District non trouvé');
    }

    return {
      _id: district._id,
      Lib_district: district.Lib_district,
      Sommeil: district.Sommeil,
      PaysId: district.PaysId,
      createdAt: district.createdAt,
      updatedAt: district.updatedAt
    };
  }
}

module.exports = { GetDistrictUseCase };