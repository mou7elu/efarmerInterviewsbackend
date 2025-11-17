const BaseRepository = require('./BaseRepository');
const LocaliteModel = require('../../../models/Localite');

/**
 * LocaliteRepository
 * Repository for Localite entity with specific methods
 */
class LocaliteRepository extends BaseRepository {
  constructor() {
    super(LocaliteModel);
  }

  /**
   * Find localite by code
   * @param {string} code - Localite code
   * @returns {Promise<Object|null>} Found localite or null
   */
  async findByCode(code) {
    return await this.findOne({ Cod_localite: code });
  }

  /**
   * Find all localites by village ID
   * @param {string} villageId - Village ID
   * @returns {Promise<Array>} Array of localites
   */
  async findByVillageId(villageId) {
    return await this.findAll({ VillageId: villageId });
  }

  /**
   * Check if localite code exists
   * @param {string} code - Localite code
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExists(code, excludeId = null) {
    const filters = { Cod_localite: code };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Get all localites with populated village
   * @returns {Promise<Array>} Array of localites with populated village
   */
  async getAllWithVillage() {
    return await this.findAll({}, { populate: 'VillageId' });
  }
}

module.exports = LocaliteRepository;
