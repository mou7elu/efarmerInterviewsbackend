const SousprefRepository = require('../../../infrastructure/repositories/SousprefRepository');
const Souspref = require('../../../domain/entities/Souspref');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

const repository = new SousprefRepository();

/**
 * Create Souspref Use Case
 */
class CreateSousprefUseCase {
  async execute(data) {
    // Create entity to validate
    const entity = new Souspref(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    // Check if code already exists
    const codeExists = await repository.codeExists(data.Cod_Souspref);
    if (codeExists) {
      throw new ValidationError('Une sous-préfecture avec ce code existe déjà');
    }

    const souspref = await repository.create(data);
    return souspref.toDTO();
  }
}

/**
 * Get Souspref By ID Use Case
 */
class GetSousprefUseCase {
  async execute(id) {
    const souspref = await repository.findById(id);
    if (!souspref) {
      throw new NotFoundError('Sous-préfecture non trouvée');
    }
    return souspref.toDTO();
  }
}

/**
 * Get All Souspref Use Case
 */
class GetAllSousprefUseCase {
  async execute(queryParams = {}) {
    // Séparer les options de pagination des filtres
    const { limit, skip, sort, populate, ...filters } = queryParams;
    
    const options = {};
    if (limit) options.limit = parseInt(limit, 10);
    if (skip) options.skip = parseInt(skip, 10);
    if (sort) options.sort = sort;
    if (populate) options.populate = populate;
    
    const souspref = await repository.findAll(filters, options);
    return souspref.map(s => s.toDTO());
  }
}

/**
 * Get Souspref By Departement Use Case
 */
class GetSousprefByDepartementUseCase {
  async execute(departementId) {
    const souspref = await repository.findByDepartementId(departementId);
    return souspref.map(s => s.toDTO());
  }
}

/**
 * Update Souspref Use Case
 */
class UpdateSousprefUseCase {
  async execute(id, data) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Sous-préfecture non trouvée');
    }

    // Validate update data
    const entity = new Souspref({ ...existing.toObject(), ...data });
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    // Check if code already exists for another souspref
    if (data.Cod_Souspref) {
      const codeExists = await repository.codeExists(data.Cod_Souspref, id);
      if (codeExists) {
        throw new ValidationError('Une sous-préfecture avec ce code existe déjà');
      }
    }

    const souspref = await repository.update(id, data);
    return souspref.toDTO();
  }
}

/**
 * Delete Souspref Use Case
 */
class DeleteSousprefUseCase {
  async execute(id) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Sous-préfecture non trouvée');
    }

    await repository.delete(id);
    return { message: 'Sous-préfecture supprimée avec succès' };
  }
}

module.exports = {
  CreateSousprefUseCase,
  GetSousprefUseCase,
  GetAllSousprefUseCase,
  GetSousprefByDepartementUseCase,
  UpdateSousprefUseCase,
  DeleteSousprefUseCase
};
