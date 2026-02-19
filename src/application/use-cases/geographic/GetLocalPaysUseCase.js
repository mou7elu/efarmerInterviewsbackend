const Pays = require('../../../../models/Pays');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

/**
 * Use Case: Obtenir le pays local (Islocal = true)
 */
class GetLocalPaysUseCase {
  /**
   * Exécute le use case
   * @returns {Promise<Object>} Le pays local
   */
  async execute() {
    // Rechercher le pays avec Islocal = true
    const pays = await Pays.findOne({ Islocal: true });

    if (!pays) {
      throw new NotFoundError('Aucun pays local n\'a été défini');
    }

    return pays.toDTO();
  }
}

module.exports = { GetLocalPaysUseCase };
