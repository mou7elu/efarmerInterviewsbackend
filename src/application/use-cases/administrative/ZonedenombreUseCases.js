const ZonedenombreRepository = require('../../../infrastructure/repositories/ZonedenombreRepository');
const Zonedenombre = require('../../../domain/entities/Zonedenombre');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

const repository = new ZonedenombreRepository();

/**
 * Create Zonedenombre Use Case
 */
class CreateZonedenombreUseCase {
  async execute(data) {
    const entity = new Zonedenombre(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    const codeExists = await repository.codeExists(data.Cod_ZD);
    if (codeExists) {
      throw new ValidationError('Une zone de dénombrement avec ce code existe déjà');
    }

    const zone = await repository.create(data);
    return zone.toDTO();
  }
}

/**
 * Get Zonedenombre By ID Use Case
 */
class GetZonedenombreUseCase {
  async execute(id) {
    const zone = await repository.findById(id);
    if (!zone) {
      throw new NotFoundError('Zone de dénombrement non trouvée');
    }
    return zone.toDTO();
  }
}

/**
 * Get All Zonedenombre Use Case
 */
class GetAllZonedenombreUseCase {
  async execute(queryParams = {}) {
    // Séparer les options de pagination des filtres
    const { limit, skip, sort, populate, ...filters } = queryParams;
    
    const options = {};
    if (limit) options.limit = parseInt(limit, 10);
    if (skip) options.skip = parseInt(skip, 10);
    if (sort) options.sort = sort;
    if (populate) options.populate = populate;
    
    const zones = await repository.findAll(filters, options);
    return zones.map(z => z.toDTO());
  }
}

/**
 * Get Zonedenombre By SecteurAdministratif Use Case
 */
class GetZonedenombreBySecteurAdministratifUseCase {
  async execute(secteurId) {
    const zones = await repository.findBySecteurAdministratifId(secteurId);
    return zones.map(z => z.toDTO());
  }
}

/**
 * Update Zonedenombre Use Case
 */
class UpdateZonedenombreUseCase {
  async execute(id, data) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Zone de dénombrement non trouvée');
    }

    const entity = new Zonedenombre({ ...existing.toObject(), ...data });
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    if (data.Cod_ZD) {
      const codeExists = await repository.codeExists(data.Cod_ZD, id);
      if (codeExists) {
        throw new ValidationError('Une zone de dénombrement avec ce code existe déjà');
      }
    }

    const zone = await repository.update(id, data);
    return zone.toDTO();
  }
}

/**
 * Delete Zonedenombre Use Case
 */
class DeleteZonedenombreUseCase {
  async execute(id) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Zone de dénombrement non trouvée');
    }

    await repository.delete(id);
    return { message: 'Zone de dénombrement supprimée avec succès' };
  }
}

module.exports = {
  CreateZonedenombreUseCase,
  GetZonedenombreUseCase,
  GetAllZonedenombreUseCase,
  GetZonedenombreBySecteurAdministratifUseCase,
  UpdateZonedenombreUseCase,
  DeleteZonedenombreUseCase
};
