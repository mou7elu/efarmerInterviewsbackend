const LocaliteRepository = require('../../../infrastructure/repositories/LocaliteRepository');
const Localite = require('../../../domain/entities/Localite');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const mongoose = require('mongoose');
const Village = require('../../../../models/Village');

const repository = new LocaliteRepository();

/**
 * Create Localite Use Case
 */
class CreateLocaliteUseCase {
  async execute(data) {
    // Validate VillageId is a valid ObjectId
    if (!data.VillageId) {
      throw new ValidationError('VillageId est requis');
    }

    if (!mongoose.Types.ObjectId.isValid(data.VillageId)) {
      throw new ValidationError(`VillageId invalide: "${data.VillageId}" n'est pas un identifiant valide`);
    }

    const entity = new Localite(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    const codeExists = await repository.codeExistsInVillage(data.Cod_localite, data.VillageId);
    if (codeExists) {
      const village = await Village.findById(data.VillageId).select('Lib_village').lean();
      const villageName = village?.Lib_village || data.VillageId;
      throw new ValidationError(`Le code "${data.Cod_localite}" existe déjà dans cette localité (${villageName})`);
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

    // Validate VillageId if provided
    if (data.VillageId && !mongoose.Types.ObjectId.isValid(data.VillageId)) {
      throw new ValidationError(`VillageId invalide: "${data.VillageId}" n'est pas un identifiant valide`);
    }

    const entity = new Localite({ ...existing.toObject(), ...data });
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    if (data.Cod_localite || data.VillageId) {
      const checkCode = data.Cod_localite || existing.Cod_localite;
      const checkVillageId = data.VillageId || existing.VillageId;
      
      const codeExists = await repository.codeExistsInVillage(checkCode, checkVillageId, id);
      if (codeExists) {
        const village = await Village.findById(checkVillageId).select('Lib_village').lean();
        const villageName = village?.Lib_village || checkVillageId;
        throw new ValidationError(`Le code "${checkCode}" existe déjà dans cette localité (${villageName})`);
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
