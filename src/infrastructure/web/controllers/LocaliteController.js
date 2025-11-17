const {
  CreateLocaliteUseCase,
  GetLocaliteUseCase,
  GetAllLocaliteUseCase,
  GetLocaliteByVillageUseCase,
  UpdateLocaliteUseCase,
  DeleteLocaliteUseCase
} = require('../../../application/use-cases/administrative/LocaliteUseCases');

/**
 * Localite Controller
 */
class LocaliteController {
  /**
   * Create a new localité
   */
  async create(req, res) {
    try {
      const useCase = new CreateLocaliteUseCase();
      const localite = await useCase.execute(req.body);
      res.status(201).json(localite);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get localité by ID
   */
  async getById(req, res) {
    try {
      const useCase = new GetLocaliteUseCase();
      const localite = await useCase.execute(req.params.id);
      res.json(localite);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all localités
   */
  async getAll(req, res) {
    try {
      const useCase = new GetAllLocaliteUseCase();
      const localites = await useCase.execute(req.query);
      res.json(localites);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get localités by village
   */
  async getByVillage(req, res) {
    try {
      const useCase = new GetLocaliteByVillageUseCase();
      const localites = await useCase.execute(req.params.villageId);
      res.json(localites);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Update localité
   */
  async update(req, res) {
    try {
      const useCase = new UpdateLocaliteUseCase();
      const localite = await useCase.execute(req.params.id, req.body);
      res.json(localite);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Delete localité
   */
  async delete(req, res) {
    try {
      const useCase = new DeleteLocaliteUseCase();
      const result = await useCase.execute(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new LocaliteController();
