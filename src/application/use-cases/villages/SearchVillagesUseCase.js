const BaseUseCase = require('../BaseUseCase');
const { VillageRepository } = require('../../../infrastructure/repositories/VillageRepository');

/**
 * Use case pour rechercher des villages
 */
class SearchVillagesUseCase extends BaseUseCase {
  constructor() {
    super();
    this.villageRepository = new VillageRepository();
  }

  async execute(filters = {}) {
    const { searchTerm, page = 1, limit = 10 } = filters;

    if (!searchTerm) {
      throw new Error('Le terme de recherche est requis');
    }

    const result = await this.villageRepository.findPaginated(page, limit, searchTerm);
    
    return {
      items: result.items,
      total: result.total,
      page: result.page,
      pages: result.pages
    };
  }
}

module.exports = { SearchVillagesUseCase };