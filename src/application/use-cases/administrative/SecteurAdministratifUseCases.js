const SecteurAdministratifRepository = require('../../../infrastructure/repositories/SecteurAdministratifRepository');
const SecteurAdministratif = require('../../../domain/entities/SecteurAdministratif');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

const repository = new SecteurAdministratifRepository();

/**
 * Create SecteurAdministratif Use Case
 */
class CreateSecteurAdministratifUseCase {
  async execute(data) {
    const entity = new SecteurAdministratif(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    const codeExists = await repository.codeExists(data.Cod_SecteurAdministratif);
    if (codeExists) {
      throw new ValidationError('Un secteur administratif avec ce code existe déjà');
    }

    const secteur = await repository.create(data);
    return secteur.toDTO();
  }
}

/**
 * Get SecteurAdministratif By ID Use Case
 */
class GetSecteurAdministratifUseCase {
  async execute(id) {
    const secteur = await repository.findById(id);
    if (!secteur) {
      throw new NotFoundError('Secteur administratif non trouvé');
    }
    return secteur.toDTO();
  }
}

/**
 * Get All SecteurAdministratif Use Case
 */
class GetAllSecteurAdministratifUseCase {
  async execute(queryParams = {}) {
    // Séparer les options de pagination des filtres
    const { limit, skip, sort, populate, ...filters } = queryParams;
    
    const options = {};
    if (limit) options.limit = parseInt(limit, 10);
    if (skip) options.skip = parseInt(skip, 10);
    if (sort) options.sort = sort;
    if (populate) options.populate = populate;
    
    const secteurs = await repository.findAll(filters, options);
    return secteurs.map(s => s.toDTO());
  }
}

/**
 * Get SecteurAdministratif By Souspref Use Case
 */
class GetSecteurAdministratifBySousprefUseCase {
  async execute(sousprefId) {
    const secteurs = await repository.findBySousprefId(sousprefId);
    return secteurs.map(s => s.toDTO());
  }
}

/**
 * Update SecteurAdministratif Use Case
 */
class UpdateSecteurAdministratifUseCase {
  async execute(id, data) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Secteur administratif non trouvé');
    }

    const entity = new SecteurAdministratif({ ...existing.toObject(), ...data });
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    if (data.Cod_SecteurAdministratif) {
      const codeExists = await repository.codeExists(data.Cod_SecteurAdministratif, id);
      if (codeExists) {
        throw new ValidationError('Un secteur administratif avec ce code existe déjà');
      }
    }

    const secteur = await repository.update(id, data);
    return secteur.toDTO();
  }
}

/**
 * Delete SecteurAdministratif Use Case
 */
class DeleteSecteurAdministratifUseCase {
  async execute(id) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Secteur administratif non trouvé');
    }

    await repository.delete(id);
    return { message: 'Secteur administratif supprimé avec succès' };
  }
}

module.exports = {
  CreateSecteurAdministratifUseCase,
  GetSecteurAdministratifUseCase,
  GetAllSecteurAdministratifUseCase,
  GetSecteurAdministratifBySousprefUseCase,
  UpdateSecteurAdministratifUseCase,
  DeleteSecteurAdministratifUseCase
};
