const Pays = require('../../../../models/Pays');
const District = require('../../../../models/district');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');

/**
 * Use Case: Supprimer un pays
 */
class DeletePaysUseCase {
  /**
   * Exécute le use case
   * @param {string} id - ID du pays à supprimer
   * @returns {Promise<void>}
   */
  async execute(id) {
    // Trouver le pays
    const pays = await Pays.findById(id);

    if (!pays) {
      throw new NotFoundError(`Pays avec l'ID ${id} non trouvé`);
    }

    // Vérifier s'il y a des districts liés
    const districtsCount = await District.countDocuments({ PaysId: id });

    if (districtsCount > 0) {
      throw new ValidationError(
        `Impossible de supprimer le pays "${pays.Lib_pays}". ` +
        `Il contient ${districtsCount} district(s). Supprimez d'abord les districts.`
      );
    }

    // Supprimer le pays
    await pays.deleteOne();
  }
}

module.exports = { DeletePaysUseCase };
