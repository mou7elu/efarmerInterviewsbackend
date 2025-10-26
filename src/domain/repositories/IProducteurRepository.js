/**
 * Interface du repository pour les producteurs
 * Suit le pattern Repository du DDD
 */
class IProducteurRepository {
  /**
   * Créer un nouveau producteur
   * @param {ProducteurEntity} entity 
   * @returns {Promise<ProducteurEntity>}
   */
  async create(entity) {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver un producteur par ID
   * @param {string} id 
   * @returns {Promise<ProducteurEntity|null>}
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver tous les producteurs
   * @returns {Promise<ProducteurEntity[]>}
   */
  async findAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Mettre à jour un producteur
   * @param {string} id 
   * @param {ProducteurEntity} entity 
   * @returns {Promise<ProducteurEntity>}
   */
  async update(id, entity) {
    throw new Error('Method not implemented');
  }

  /**
   * Supprimer un producteur
   * @param {string} id 
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver un producteur par code
   * @param {string} code 
   * @returns {Promise<ProducteurEntity|null>}
   */
  async findByCode(code) {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver les producteurs par statut
   * @param {boolean} sommeil 
   * @returns {Promise<ProducteurEntity[]>}
   */
  async findByStatut(sommeil) {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver les producteurs par genre
   * @param {number} genre 
   * @returns {Promise<ProducteurEntity[]>}
   */
  async findByGenre(genre) {
    throw new Error('Method not implemented');
  }

  /**
   * Rechercher des producteurs par nom/prénom
   * @param {string} searchTerm 
   * @returns {Promise<ProducteurEntity[]>}
   */
  async searchByName(searchTerm) {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver les producteurs avec pagination
   * @param {number} page 
   * @param {number} limit 
   * @param {boolean} actifSeulement 
   * @returns {Promise<{items: ProducteurEntity[], total: number, page: number, pages: number}>}
   */
  async findPaginated(page = 1, limit = 10, actifSeulement = false) {
    throw new Error('Method not implemented');
  }

  /**
   * Compter le nombre total de producteurs
   * @returns {Promise<number>}
   */
  async count() {
    throw new Error('Method not implemented');
  }

  /**
   * Vérifier si un producteur existe
   * @param {string} id 
   * @returns {Promise<boolean>}
   */
  async exists(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver les producteurs par téléphone
   * @param {string} telephone 
   * @returns {Promise<ProducteurEntity[]>}
   */
  async findByTelephone(telephone) {
    throw new Error('Method not implemented');
  }

  /**
   * Mettre à jour le statut d'un producteur
   * @param {string} id 
   * @param {boolean} sommeil 
   * @returns {Promise<ProducteurEntity>}
   */
  async updateStatut(id, sommeil) {
    throw new Error('Method not implemented');
  }
}

module.exports = { IProducteurRepository };