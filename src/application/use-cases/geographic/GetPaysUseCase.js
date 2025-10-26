const BaseUseCase = require('../BaseUseCase');
const { PaysRepository } = require('../../../infrastructure/repositories/PaysRepository');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');

/**
 * Use Case pour obtenir un pays par ID
 */
class GetPaysUseCase extends BaseUseCase {
  constructor() {
    super();
    this.paysRepository = new PaysRepository();
  }

  async execute(id) {
    if (!id) {
      throw new ValidationError('L\'ID du pays est requis');
    }

    const pays = await this.paysRepository.findById(id);
    if (!pays) {
      throw new NotFoundError('Pays non trouvé');
    }

    return pays;
  }
}

module.exports = { GetPaysUseCase };