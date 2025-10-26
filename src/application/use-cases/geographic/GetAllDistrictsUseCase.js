const BaseUseCase = require('../BaseUseCase');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const District = require('../../../../models/district');

/**
 * Use Case pour récupérer tous les districts avec filtres et pagination
 */
class GetAllDistrictsUseCase extends BaseUseCase {
  constructor() {
    super();
  }

  /**
   * Exécute la récupération de tous les districts
   * @param {Object} filters - Filtres de recherche
   * @returns {Object} Liste paginée des districts
   */
  async execute(filters = {}) {
    const {
      page = 1,
      limit = 10,
      actifSeulement = false,
      search = null,
      paysId = null
    } = filters;

    // Construction de la requête
    const query = {};

    // Filtre par statut
    if (actifSeulement) {
      query.Sommeil = false;
    }

    // Filtre par pays
    if (paysId) {
      query.PaysId = paysId;
    }

    // Filtre de recherche textuelle
    if (search) {
      query.Lib_district = { $regex: search, $options: 'i' };
    }

    // Calcul de la pagination
    const skip = (page - 1) * limit;

    // Exécution des requêtes en parallèle
    const [districts, total] = await Promise.all([
      District.find(query)
        .populate('PaysId')
        .sort({ Lib_district: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      District.countDocuments(query)
    ]);

    // Transformation en DTO
    const items = districts.map(district => ({
      _id: district._id,
      libDistrict: district.Lib_district,
      sommeil: district.Sommeil,
      paysId: district.PaysId,
      _createdAt: district.createdAt,
      _updatedAt: district.updatedAt
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

module.exports = { GetAllDistrictsUseCase };