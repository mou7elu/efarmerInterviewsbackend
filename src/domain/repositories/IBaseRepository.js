/**
 * Base Repository Interface
 * Définit les opérations CRUD de base (Interface Segregation Principle)
 */

class IBaseRepository {
  async findById(id) {
    throw new Error('findById method must be implemented');
  }

  async findAll(criteria = {}) {
    throw new Error('findAll method must be implemented');
  }

  async create(entity) {
    throw new Error('create method must be implemented');
  }

  async update(id, entity) {
    throw new Error('update method must be implemented');
  }

  async delete(id) {
    throw new Error('delete method must be implemented');
  }

  async exists(id) {
    throw new Error('exists method must be implemented');
  }

  async count(criteria = {}) {
    throw new Error('count method must be implemented');
  }
}

module.exports = IBaseRepository;