const BaseUseCase = require('../BaseUseCase');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const District = require('../../../../models/district');

/**
 * Use Case pour supprimer un district
 */
class DeleteDistrictUseCase extends BaseUseCase {
  constructor() {
    super();
  }

  /**
   * Exécute la suppression d'un district
   * @param {string} id - ID du district
   * @returns {Promise<Object>}
   */
  async execute(id) {
    if (!id) {
      throw new ValidationError('L\'ID du district est requis');
    }

    // Vérifier que le district existe
    const existingDistrict = await District.findById(id);
    if (!existingDistrict) {
      throw new NotFoundError('District non trouvé');
    }

    // Supprimer le district
    await District.findByIdAndDelete(id);

    return { success: true, message: 'District supprimé avec succès' };
  }
}

module.exports = { DeleteDistrictUseCase };