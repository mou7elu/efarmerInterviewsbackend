const BaseUseCase = require('../BaseUseCase');
const { PaysRepository } = require('../../../infrastructure/repositories/PaysRepository');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

/**
 * Use Case pour supprimer un pays
 */
class DeletePaysUseCase extends BaseUseCase {
  constructor() {
    super();
    this.paysRepository = new PaysRepository();
  }

  async execute(id) {
    if (!id) {
      throw new ValidationError('L\'ID du pays est requis');
    }

    // Vérifier que le pays existe
    const existingPays = await this.paysRepository.findById(id);
    if (!existingPays) {
      throw new NotFoundError('Pays non trouvé');
    }

    // TODO: Vérifier s'il y a des dépendances (districts, régions, etc.)
    // avant de supprimer

    return await this.paysRepository.delete(id);
  }
}

module.exports = { DeletePaysUseCase };