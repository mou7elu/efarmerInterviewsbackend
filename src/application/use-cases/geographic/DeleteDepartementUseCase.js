const BaseUseCase = require('../BaseUseCase');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const Departement = require('../../../../models/Departement');

/**
 * Use Case pour supprimer un département
 */
class DeleteDepartementUseCase extends BaseUseCase {
  constructor() {
    super();
  }

  /**
   * Exécute la suppression d'un département
   * @param {string} id - ID du département
   * @returns {Promise<Object>}
   */
  async execute(id) {
    if (!id) {
      throw new ValidationError('L\'ID du département est requis');
    }

    // Vérifier que le département existe
    const existingDepartement = await Departement.findById(id);
    if (!existingDepartement) {
      throw new NotFoundError('Département non trouvé');
    }

    // Supprimer le département
    await Departement.findByIdAndDelete(id);

    return { success: true, message: 'Département supprimé avec succès' };
  }
}

module.exports = { DeleteDepartementUseCase };