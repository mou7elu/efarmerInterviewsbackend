const Pays = require('../../../../models/Pays');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

/**
 * Use Case: Obtenir un pays par son ID
 */
class GetPaysUseCase {
  /**
   * Exécute le use case
   * @param {string} id - ID du pays
   * @returns {Promise<Object>} Le pays trouvé
   */
  async execute(id) {
    const pays = await Pays.findById(id);

    if (!pays) {
      throw new NotFoundError(`Pays avec l'ID ${id} non trouvé`);
    }

    return pays.toDTO();
  }
}

module.exports = { GetPaysUseCase };
