const {
  CreateMenageUseCase,
  GetMenageUseCase,
  GetAllMenageUseCase,
  GetMenageByLocaliteUseCase,
  GetMenageByEnqueteurUseCase,
  GetMenageWithAnacardeProducteursUseCase,
  GetMenageWithFullHierarchyUseCase,
  UpdateMenageUseCase,
  DeleteMenageUseCase
} = require('../../../application/use-cases/administrative/MenageUseCases');

/**
 * Menage Controller
 */
class MenageController {
  /**
   * Create a new ménage
   */
  async create(req, res) {
    try {
      const useCase = new CreateMenageUseCase();
      const menage = await useCase.execute(req.body);
      res.status(201).json(menage);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get ménage by ID
   */
  async getById(req, res) {
    try {
      const useCase = new GetMenageUseCase();
      const menage = await useCase.execute(req.params.id);
      res.json(menage);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all ménages
   */
  async getAll(req, res) {
    try {
      const useCase = new GetAllMenageUseCase();
      const menages = await useCase.execute(req.query);
      res.json(menages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get ménages by localité
   */
  async getByLocalite(req, res) {
    try {
      const useCase = new GetMenageByLocaliteUseCase();
      const menages = await useCase.execute(req.params.localiteId);
      res.json(menages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get ménages by enquêteur
   */
  async getByEnqueteur(req, res) {
    try {
      const useCase = new GetMenageByEnqueteurUseCase();
      const menages = await useCase.execute(req.params.enqueteurId);
      res.json(menages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get ménages with anacarde producteurs
   */
  async getWithAnacardeProducteurs(req, res) {
    try {
      const useCase = new GetMenageWithAnacardeProducteursUseCase();
      const menages = await useCase.execute();
      res.json(menages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get ménages with full hierarchy
   */
  async getWithFullHierarchy(req, res) {
    try {
      const useCase = new GetMenageWithFullHierarchyUseCase();
      const menages = await useCase.execute();
      res.json(menages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Update ménage
   */
  async update(req, res) {
    try {
      const useCase = new UpdateMenageUseCase();
      const menage = await useCase.execute(req.params.id, req.body);
      res.json(menage);
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
   * Delete ménage
   */
  async delete(req, res) {
    try {
      const useCase = new DeleteMenageUseCase();
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

module.exports = new MenageController();
