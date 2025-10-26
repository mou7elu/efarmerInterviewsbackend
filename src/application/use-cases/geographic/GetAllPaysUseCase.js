const BaseUseCase = require('../BaseUseCase');
const { PaysRepository } = require('../../../infrastructure/repositories/PaysRepository');

/**
 * Use Case pour obtenir tous les pays avec filtres et pagination
 */
class GetAllPaysUseCase extends BaseUseCase {
  constructor() {
    super();
    this.paysRepository = new PaysRepository();
  }

  async execute(filters = {}) {
    const {
      page = 1,
      limit = 10,
      actifSeulement = false,
      search = null
    } = filters;

    if (search) {
      const items = await this.paysRepository.searchByName(search, actifSeulement);
      return {
        items,
        total: items.length,
        page: 1,
        pages: 1
      };
    }

    if (page && limit) {
      return await this.paysRepository.findPaginated(page, limit, actifSeulement);
    }

    const items = actifSeulement 
      ? await this.paysRepository.findActifs()
      : await this.paysRepository.findAll();

    return {
      items,
      total: items.length,
      page: 1,
      pages: 1
    };
  }
}

module.exports = { GetAllPaysUseCase };