const BaseUseCase = require('../BaseUseCase');
const { VillageRepository } = require('../../../infrastructure/repositories/VillageRepository');

/**
 * Use Case pour obtenir tous les villages avec filtres et pagination
 */
class GetAllVillagesUseCase extends BaseUseCase {
  constructor() {
    super();
    this.villageRepository = new VillageRepository();
  }

  async execute(filters = {}) {
    const {
      page = 1,
      limit = 10,
      search = null
    } = filters;

    if (search) {
      const items = await this.villageRepository.searchByName(search);
      return {
        items,
        total: items.length,
        page: 1,
        pages: 1
      };
    }

    if (page && limit) {
      return await this.villageRepository.findPaginated(page, limit);
    }

    const items = await this.villageRepository.findAll();
    return {
      items,
      total: items.length,
      page: 1,
      pages: 1
    };
  }
}

module.exports = { GetAllVillagesUseCase };