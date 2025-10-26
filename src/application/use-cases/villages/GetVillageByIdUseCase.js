const BaseUseCase = require('../BaseUseCase');
const { VillageRepository } = require('../../../infrastructure/repositories/VillageRepository');

class GetVillageByIdUseCase extends BaseUseCase {
  constructor() {
    super();
    this.villageRepository = new VillageRepository();
  }

  async execute(villageId) {
    if (!villageId) {
      throw new Error('ID du village requis');
    }

    const village = await this.villageRepository.findById(villageId);
    
    if (!village) {
      throw new Error('Village introuvable');
    }

    return village;
  }
}

module.exports = { GetVillageByIdUseCase };