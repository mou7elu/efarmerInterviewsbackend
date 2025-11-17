const LocaliteRepository = require('../../../infrastructure/repositories/LocaliteRepository');
const Localite = require('../../../domain/entities/Localite');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

const repository = new LocaliteRepository();

/**
 * Create Localite Use Case
 */
class CreateLocaliteUseCase {
  async execute(data) {
    const entity = new Localite(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    const codeExists = await repository.codeExists(data.Cod_localite);
    if (codeExists) {
      throw new ValidationError('Une localité avec ce code existe déjà');
    }

    const localite = await repository.create(data);
    return localite.toDTO();
  }
}

/**
 * Get Localite By ID Use Case
 */
class GetLocaliteUseCase {
  async execute(id) {
    const localite = await repository.findById(id);
    if (!localite) {
      throw new NotFoundError('Localité non trouvée');
    }
    return localite.toDTO();
  }
}

/**
 * Get All Localite Use Case
 */
class GetAllLocaliteUseCase {
  async execute(queryParams = {}) {
    // Séparer les paramètres de pagination/tri des filtres de requête
    const { limit, skip, sort, populate, ...filters } = queryParams;
    
    // Construire les options de pagination
    const options = {};
    if (limit) options.limit = Number.parseInt(limit, 10);
    if (skip) options.skip = Number.parseInt(skip, 10);
    if (sort) options.sort = sort;
    if (populate) options.populate = populate;
    
    const localites = await repository.findAll(filters, options);
    return localites.map(l => l.toDTO());
  }
}

/**
 * Get Localite By Village Use Case
 */
class GetLocaliteByVillageUseCase {
  async execute(villageId) {
    const localites = await repository.findByVillageId(villageId);
    return localites.map(l => l.toDTO());
  }
}

/**
 * Update Localite Use Case
 */
class UpdateLocaliteUseCase {
  async execute(id, data) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Localité non trouvée');
    }

    const entity = new Localite({ ...existing.toObject(), ...data });
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    if (data.Cod_localite) {
      const codeExists = await repository.codeExists(data.Cod_localite, id);
      if (codeExists) {
        throw new ValidationError('Une localité avec ce code existe déjà');
      }
    }

    const localite = await repository.update(id, data);
    return localite.toDTO();
  }
}

/**
 * Delete Localite Use Case
 */
class DeleteLocaliteUseCase {
  async execute(id) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Localité non trouvée');
    }

    await repository.delete(id);
    return { message: 'Localité supprimée avec succès' };
  }
}

module.exports = {
  CreateLocaliteUseCase,
  GetLocaliteUseCase,
  GetAllLocaliteUseCase,
  GetLocaliteByVillageUseCase,
  UpdateLocaliteUseCase,
  DeleteLocaliteUseCase
};
