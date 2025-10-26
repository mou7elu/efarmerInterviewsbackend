const BaseUseCase = require('../BaseUseCase');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const Departement = require('../../../../models/Departement');

/**
 * Use Case pour récupérer tous les départements avec filtres et pagination
 */
class GetAllDepartementsUseCase extends BaseUseCase {
  constructor() {
    super();
  }

  /**
   * Exécute la récupération de tous les départements
   * @param {Object} filters - Filtres de recherche
   * @returns {Object} Liste paginée des départements
   */
  async execute(filters = {}) {
    const {
      page = 1,
      limit = 10,
      actifSeulement = false,
      search = null,
      regionId = null
    } = filters;

    // Construction de la requête
    const query = {};

    // Filtre par statut
    if (actifSeulement) {
      query.Sommeil = false;
    }

    // Filtre par région
    if (regionId) {
      query.RegionId = regionId;
    }

    // Filtre de recherche textuelle
    if (search) {
      query.Lib_Departement = { $regex: search, $options: 'i' };
    }

    // Calcul de la pagination
    const skip = (page - 1) * limit;

    // Exécution des requêtes en parallèle
    const [departements, total] = await Promise.all([
      Departement.find(query)
        .populate('RegionId')
        .sort({ Lib_Departement: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Departement.countDocuments(query)
    ]);

    // Transformation en DTO
    const items = departements.map(departement => ({
      _id: departement._id,
      Lib_Departement: departement.Lib_Departement,
      Sommeil: departement.Sommeil,
      RegionId: departement.RegionId,
      createdAt: departement.createdAt,
      updatedAt: departement.updatedAt
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

module.exports = { GetAllDepartementsUseCase };