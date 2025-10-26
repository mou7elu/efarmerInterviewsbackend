const BaseUseCase = require('../BaseUseCase');
const { VillageRepository } = require('../../../infrastructure/repositories/VillageRepository');

class UpdateVillageUseCase extends BaseUseCase {
  constructor() {
    super();
    this.villageRepository = new VillageRepository();
  }

  async execute(id, updateData) {
    // Validation de l'ID
    if (!id) {
      throw new Error('ID du village requis');
    }

    // Vérification de l'existence du village
    const existingVillage = await this.villageRepository.findById(id);
    if (!existingVillage) {
      throw new Error('Village non trouvé');
    }

    // Validation des données
    if (updateData.Lib_village && !updateData.Lib_village.trim()) {
      throw new Error('Le libellé du village ne peut pas être vide');
    }

    // Préparation des données de mise à jour
    const dataToUpdate = {};
    if (updateData.Lib_village) dataToUpdate.Lib_village = updateData.Lib_village.trim();
    if (updateData.Coordonnee !== undefined) dataToUpdate.Coordonnee = updateData.Coordonnee;
    if (updateData.PaysId) dataToUpdate.PaysId = updateData.PaysId;

    // Mise à jour du village via le repository
    const updatedVillage = await this.villageRepository.update(id, dataToUpdate);
    
    return updatedVillage;
  }
}

module.exports = { UpdateVillageUseCase };