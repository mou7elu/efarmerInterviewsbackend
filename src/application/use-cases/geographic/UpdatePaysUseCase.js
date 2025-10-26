const BaseUseCase = require('../BaseUseCase');
const { PaysRepository } = require('../../../infrastructure/repositories/PaysRepository');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { DuplicateError } = require('../../../shared/errors/DuplicateError');

/**
 * Use Case pour mettre à jour un pays
 */
class UpdatePaysUseCase extends BaseUseCase {
  constructor() {
    super();
    this.paysRepository = new PaysRepository();
  }

  async execute(id, input) {
    if (!id) {
      throw new ValidationError('L\'ID du pays est requis');
    }

    this.validateInput(input, ['libPays']);

    // Vérifier que le pays existe
    const existingPays = await this.paysRepository.findById(id);
    if (!existingPays) {
      throw new NotFoundError('Pays non trouvé');
    }

    // Vérifier l'unicité du libellé (exclure l'ID actuel)
    const duplicateCheck = await this.paysRepository.findByLibelle(input.libPays);
    if (duplicateCheck && duplicateCheck.id !== parseInt(id)) {
      throw new DuplicateError('Un pays avec ce libellé existe déjà');
    }

    // Mettre à jour l'entité
    const updateData = {
      libPays: input.libPays,
      coordonnee: input.coordonnee,
      sommeil: input.sommeil
    };

    return await this.paysRepository.update(id, updateData);
  }
}

module.exports = { UpdatePaysUseCase };