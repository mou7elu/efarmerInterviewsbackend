/**
 * Question Repository Interface
 * Étend le repository de base avec des méthodes spécifiques aux questions
 */

const IBaseRepository = require('./IBaseRepository');

class IQuestionRepository extends IBaseRepository {
  async findByCode(code) {
    throw new Error('findByCode method must be implemented');
  }

  async findBySection(sectionId) {
    throw new Error('findBySection method must be implemented');
  }

  async findByVolet(voletId) {
    throw new Error('findByVolet method must be implemented');
  }

  async findByType(type) {
    throw new Error('findByType method must be implemented');
  }

  async findObligatoires() {
    throw new Error('findObligatoires method must be implemented');
  }

  async findWithOptions() {
    throw new Error('findWithOptions method must be implemented');
  }

  async findWithGotoLogic() {
    throw new Error('findWithGotoLogic method must be implemented');
  }

  async findByReferenceTable(referenceTable) {
    throw new Error('findByReferenceTable method must be implemented');
  }

  async findAutomatiques() {
    throw new Error('findAutomatiques method must be implemented');
  }

  async getNextCode() {
    throw new Error('getNextCode method must be implemented');
  }

  async searchByText(searchTerm) {
    throw new Error('searchByText method must be implemented');
  }

  async findInCodeRange(startCode, endCode) {
    throw new Error('findInCodeRange method must be implemented');
  }
}

module.exports = IQuestionRepository;