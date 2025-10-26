const BaseUseCase = require('../BaseUseCase');
const { VillageRepository } = require('../../../infrastructure/repositories/VillageRepository');

/**
 * Use case pour récupérer les statistiques des villages
 */
class GetVillageStatsUseCase extends BaseUseCase {
  constructor() {
    super();
    this.villageRepository = new VillageRepository();
  }

  async execute() {
    const [
      totalVillages,
      villagesWithCoordinates,
      villagesByCountry,
      recentVillages,
      coordinateStats
    ] = await Promise.all([
      this.villageRepository.count(),
      this.villageRepository.countWithCoordinates(),
      this.villageRepository.getDistributionByCountry(),
      this.villageRepository.countRecent(30),
      this.villageRepository.getCoordinateStats()
    ]);

    const percentageWithCoordinates = totalVillages > 0 
      ? Math.round((villagesWithCoordinates / totalVillages) * 100) 
      : 0;

    return {
      general: {
        totalVillages,
        villagesWithCoordinates,
        percentageWithCoordinates,
        recentVillages,
        villagesWithoutCoordinates: totalVillages - villagesWithCoordinates
      },
      distribution: {
        byCountry: villagesByCountry,
        coordinates: coordinateStats
      },
      growth: {
        recentAdditions: recentVillages,
        completionRate: percentageWithCoordinates
      }
    };
  }
}

module.exports = { GetVillageStatsUseCase };