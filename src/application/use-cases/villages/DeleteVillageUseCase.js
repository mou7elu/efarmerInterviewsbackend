const BaseUseCase = require('../BaseUseCase');
const { VillageRepository } = require('../../../infrastructure/repositories/VillageRepository');

class DeleteVillageUseCase extends BaseUseCase {
  constructor() {
    super();
    this.villageRepository = new VillageRepository();
  }

  async execute(id) {
    // Validation de l'ID
    if (!id) {
      throw new Error('ID du village requis');
    }

    // Vérification de l'existence du village
    const village = await this.villageRepository.findById(id);
    if (!village) {
      throw new Error('Village non trouvé');
    }

    // Suppression du village via le repository
    await this.villageRepository.delete(id);

    return { message: 'Village supprimé avec succès' };
  }
}

module.exports = { DeleteVillageUseCase };