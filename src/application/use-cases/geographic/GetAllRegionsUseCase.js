const BaseUseCase = require('../BaseUseCase');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const Region = require('../../../../models/Region');

/**
 * Use Case pour récupérer toutes les régions avec filtres et pagination
 */
class GetAllRegionsUseCase extends BaseUseCase {
  constructor() {
    super();
  }

  /**
   * Exécute la récupération de toutes les régions
   * @param {Object} filters - Filtres de recherche
   * @returns {Object} Liste paginée des régions
   */
  async execute(filters = {}) {
    const {
      page = 1,
      limit = 10,
      actifSeulement = false,
      search = null,
      districtId = null
    } = filters;

    // Construction de la requête
    const query = {};

    // Filtre par statut
    if (actifSeulement) {
      query.Sommeil = false;
    }

    // Filtre par district
    if (districtId) {
      query.DistrictId = districtId;
    }

    // Filtre de recherche textuelle
    if (search) {
      query.Lib_region = { $regex: search, $options: 'i' };
    }

    // Calcul de la pagination
    const skip = (page - 1) * limit;

    // Exécution des requêtes en parallèle
    const [regions, total] = await Promise.all([
      Region.find(query)
        .populate('DistrictId')
        .sort({ Lib_region: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Region.countDocuments(query)
    ]);

    // Transformation en DTO
    const items = regions.map(region => ({
      _id: region._id,
      Lib_region: region.Lib_region,
      Coordonnee: region.Coordonnee,
      Sommeil: region.Sommeil,
      DistrictId: region.DistrictId,
      createdAt: region.createdAt,
      updatedAt: region.updatedAt
    }));

    return {
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    };
  }
}

module.exports = { GetAllRegionsUseCase };