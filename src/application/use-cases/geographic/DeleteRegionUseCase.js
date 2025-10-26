const BaseUseCase = require('../BaseUseCase');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const Region = require('../../../../models/Region');

/**
 * Use Case pour supprimer une région
 */
class DeleteRegionUseCase extends BaseUseCase {
  constructor() {
    super();
  }

  /**
   * Exécute la suppression d'une région
   * @param {string} regionId - ID de la région à supprimer
   * @returns {Object} Confirmation de suppression
   */
  async execute(regionId) {
    if (!regionId) {
      throw new ValidationError('L\'ID de la région est requis');
    }

    // Vérifier que la région existe
    const region = await Region.findById(regionId);
    if (!region) {
      throw new NotFoundError('Région non trouvée');
    }

    // TODO: Vérifier les contraintes de référence
    // - Vérifier qu'aucune commune n'est rattachée à cette région
    // - Vérifier qu'aucun producteur n'est rattaché à cette région
    // - etc.

    // Supprimer la région
    await Region.findByIdAndDelete(regionId);

    return {
      message: 'Région supprimée avec succès',
      deletedId: regionId
    };
  }
}

module.exports = { DeleteRegionUseCase };