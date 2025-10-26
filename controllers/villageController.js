const GetAllVillagesUseCase = require('../src/application/use-cases/villages/GetAllVillagesUseCase');
const GetVillageByIdUseCase = require('../src/application/use-cases/villages/GetVillageByIdUseCase');
const CreateVillageUseCase = require('../src/application/use-cases/villages/CreateVillageUseCase');
const UpdateVillageUseCase = require('../src/application/use-cases/villages/UpdateVillageUseCase');
const DeleteVillageUseCase = require('../src/application/use-cases/villages/DeleteVillageUseCase');

class VillageController {
  constructor() {
    this.getAllVillagesUseCase = new GetAllVillagesUseCase();
    this.getVillageByIdUseCase = new GetVillageByIdUseCase();
    this.createVillageUseCase = new CreateVillageUseCase();
    this.updateVillageUseCase = new UpdateVillageUseCase();
    this.deleteVillageUseCase = new DeleteVillageUseCase();
  }

  async getAll(req, res) {
    try {
      const { page, limit, search, sortBy, sortOrder } = req.query;
      const result = await this.getAllVillagesUseCase.execute({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search,
        sortBy,
        sortOrder
      });

      if (!result.success) {
        return res.status(result.statusCode || 500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Villages récupérés avec succès',
        data: result.data
      });
    } catch (error) {
      console.error('Erreur dans VillageController.getAll:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await this.getVillageByIdUseCase.execute(id);

      if (!result.success) {
        return res.status(result.statusCode || 500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Village récupéré avec succès',
        data: result.data
      });
    } catch (error) {
      console.error('Erreur dans VillageController.getById:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      });
    }
  }

  async create(req, res) {
    try {
      const result = await this.createVillageUseCase.execute(req.body);

      if (!result.success) {
        return res.status(result.statusCode || 500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }

      res.status(result.statusCode || 201).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      console.error('Erreur dans VillageController.create:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await this.updateVillageUseCase.execute(id, req.body);

      if (!result.success) {
        return res.status(result.statusCode || 500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      console.error('Erreur dans VillageController.update:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await this.deleteVillageUseCase.execute(id);

      if (!result.success) {
        return res.status(result.statusCode || 500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Erreur dans VillageController.delete:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      });
    }
  }
}

module.exports = VillageController;