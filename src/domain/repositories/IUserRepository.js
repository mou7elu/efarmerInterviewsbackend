/**
 * User Repository Interface
 * Étend le repository de base avec des méthodes spécifiques aux utilisateurs
 */

const IBaseRepository = require('./IBaseRepository');

class IUserRepository extends IBaseRepository {
  async findByEmail(email) {
    throw new Error('findByEmail method must be implemented');
  }

  async findByProfile(profileId) {
    throw new Error('findByProfile method must be implemented');
  }

  async findActiveUsers() {
    throw new Error('findActiveUsers method must be implemented');
  }

  async findByResponsable(responsableId) {
    throw new Error('findByResponsable method must be implemented');
  }

  async updatePassword(userId, hashedPassword) {
    throw new Error('updatePassword method must be implemented');
  }

  async activateUser(userId) {
    throw new Error('activateUser method must be implemented');
  }

  async deactivateUser(userId) {
    throw new Error('deactivateUser method must be implemented');
  }
}

module.exports = IUserRepository;