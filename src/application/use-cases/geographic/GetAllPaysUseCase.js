const Pays = require('../../../../models/Pays');

/**
 * Use Case: Obtenir tous les pays avec filtres et pagination
 */
class GetAllPaysUseCase {
  /**
   * Exécute le use case
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise<Object>} Liste des pays avec pagination
   */
  async execute(filters = {}) {
    const {
      page = 1,
      limit = 10,
      actifSeulement = false,
      search = null
    } = filters;

    // Construction de la requête
    const query = {};

    // Filtre par statut actif/inactif
    if (actifSeulement) {
      query.Sommeil = false;
    }

    // Recherche par nom
    if (search) {
      query.Lib_pays = { $regex: search, $options: 'i' };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Exécution de la requête
    const [items, total] = await Promise.all([
      Pays.find(query)
        .sort({ Lib_pays: 1 })
        .skip(skip)
        .limit(limit),
      Pays.countDocuments(query)
    ]);

    return {
      items: items.map(pays => pays.toDTO()),
      page,
      pages: Math.ceil(total / limit),
      total
    };
  }
}

module.exports = { GetAllPaysUseCase };
