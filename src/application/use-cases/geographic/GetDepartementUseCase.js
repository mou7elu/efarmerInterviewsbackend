const BaseUseCase = require('../BaseUseCase');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const Departement = require('../../../../models/Departement');

/**
 * Use Case pour récupérer un département par son ID
 */
class GetDepartementUseCase extends BaseUseCase {
  constructor() {
    super();
  }

  /**
   * Exécute la récupération d'un département
   * @param {string} id - ID du département
   * @returns {Promise<Object>}
   */
  async execute(id) {
    if (!id) {
      throw new ValidationError('L\'ID du département est requis');
    }

    const departement = await Departement.findById(id).populate('RegionId').lean();
    
    if (!departement) {
      throw new NotFoundError('Département non trouvé');
    }

    return {
      _id: departement._id,
      Lib_Departement: departement.Lib_Departement,
      Sommeil: departement.Sommeil,
      RegionId: departement.RegionId,
      createdAt: departement.createdAt,
      updatedAt: departement.updatedAt
    };
  }
}

module.exports = { GetDepartementUseCase };