const BaseUseCase = require('../BaseUseCase');
const { VillageRepository } = require('../../../infrastructure/repositories/VillageRepository');

class CreateVillageUseCase extends BaseUseCase {
  constructor() {
    super();
    this.villageRepository = new VillageRepository();
  }

  async execute(villageData) {
    // Validation des données requises
    const { Lib_village, PaysId } = villageData;

    if (!Lib_village || !Lib_village.trim()) {
      throw new Error('Le libellé du village est requis');
    }

    if (!PaysId) {
      throw new Error('Le pays est requis');
    }

    // Création du village via le repository
    const village = await this.villageRepository.create({
      Lib_village: Lib_village.trim(),
      Coordonnee: villageData.Coordonnee || null,
      PaysId
    });

    return village;
  }
}

module.exports = { CreateVillageUseCase };