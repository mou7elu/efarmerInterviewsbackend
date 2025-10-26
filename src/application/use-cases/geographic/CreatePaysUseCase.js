const BaseUseCase = require('../BaseUseCase');
const { PaysEntity } = require('../../../domain/entities/PaysEntity');
const { PaysRepository } = require('../../../infrastructure/repositories/PaysRepository');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { DuplicateError } = require('../../../shared/errors/DuplicateError');

/**
 * Use Case pour créer un pays
 */
class CreatePaysUseCase extends BaseUseCase {
  constructor() {
    super();
    this.paysRepository = new PaysRepository();
  }

  async execute(input) {
    this.validateInput(input, ['libPays']);

    // Vérifier l'unicité du libellé
    const existing = await this.paysRepository.findByLibelle(input.libPays);
    if (existing) {
      throw new DuplicateError('Un pays avec ce libellé existe déjà');
    }

    const paysEntity = new PaysEntity({
      libPays: input.libPays,
      coordonnee: input.coordonnee,
      sommeil: input.sommeil || false
    });

    return await this.paysRepository.create(paysEntity);
  }
}

module.exports = { CreatePaysUseCase };