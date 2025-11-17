const ZoneInterditRepository = require('../../../infrastructure/repositories/ZoneInterditRepository');
const ZoneInterdit = require('../../../domain/entities/ZoneInterdit');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

const repository = new ZoneInterditRepository();

/**
 * Create ZoneInterdit Use Case
 */
class CreateZoneInterditUseCase {
  async execute(data) {
    const entity = new ZoneInterdit(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    const zoneInterdit = await repository.create(data);
    return zoneInterdit.toDTO();
  }
}

/**
 * Get ZoneInterdit By ID Use Case
 */
class GetZoneInterditUseCase {
  async execute(id) {
    const zoneInterdit = await repository.findById(id);
    if (!zoneInterdit) {
      throw new NotFoundError('Zone interdite non trouvée');
    }
    return zoneInterdit.toDTO();
  }
}

/**
 * Get All ZoneInterdit Use Case
 */
class GetAllZoneInterditUseCase {
  async execute(queryParams = {}) {
    // Séparer les paramètres de pagination/tri des filtres de requête
    const { limit, skip, sort, populate, ...filters } = queryParams;
    
    // Construire les options de pagination
    const options = {};
    if (limit) options.limit = Number.parseInt(limit, 10);
    if (skip) options.skip = Number.parseInt(skip, 10);
    if (sort) options.sort = sort;
    if (populate) options.populate = populate;
    
    const zones = await repository.findAll(filters, options);
    return zones.map(z => z.toDTO());
  }
}

/**
 * Get ZoneInterdit By Pays Use Case
 */
class GetZoneInterditByPaysUseCase {
  async execute(paysId) {
    const zones = await repository.findByPaysId(paysId);
    return zones.map(z => z.toDTO());
  }
}

/**
 * Get Active ZoneInterdit Use Case
 */
class GetActiveZoneInterditUseCase {
  async execute() {
    const zones = await repository.findActive();
    return zones.map(z => z.toDTO());
  }
}

/**
 * Get Inactive ZoneInterdit Use Case
 */
class GetInactiveZoneInterditUseCase {
  async execute() {
    const zones = await repository.findInactive();
    return zones.map(z => z.toDTO());
  }
}

/**
 * Get ZoneInterdit With Coordinates Use Case
 */
class GetZoneInterditWithCoordinatesUseCase {
  async execute() {
    const zones = await repository.findWithCoordinates();
    return zones.map(z => z.toDTO());
  }
}

/**
 * Get ZoneInterdit With Pays Use Case
 */
class GetZoneInterditWithPaysUseCase {
  async execute() {
    const zones = await repository.getAllWithPays();
    return zones.map(z => z.toDTO());
  }
}

/**
 * Update ZoneInterdit Use Case
 */
class UpdateZoneInterditUseCase {
  async execute(id, data) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Zone interdite non trouvée');
    }

    const entity = new ZoneInterdit({ ...existing.toObject(), ...data });
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    const zoneInterdit = await repository.update(id, data);
    return zoneInterdit.toDTO();
  }
}

/**
 * Toggle ZoneInterdit Status Use Case
 */
class ToggleZoneInterditStatusUseCase {
  async execute(id) {
    const zone = await repository.findById(id);
    if (!zone) {
      throw new NotFoundError('Zone interdite non trouvée');
    }

    const newStatus = !zone.Sommeil;
    await repository.update(id, { Sommeil: newStatus });
    
    return { 
      message: newStatus ? 'Zone désactivée' : 'Zone activée',
      isActive: !newStatus
    };
  }
}

/**
 * Delete ZoneInterdit Use Case
 */
class DeleteZoneInterditUseCase {
  async execute(id) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Zone interdite non trouvée');
    }

    await repository.delete(id);
    return { message: 'Zone interdite supprimée avec succès' };
  }
}

module.exports = {
  CreateZoneInterditUseCase,
  GetZoneInterditUseCase,
  GetAllZoneInterditUseCase,
  GetZoneInterditByPaysUseCase,
  GetActiveZoneInterditUseCase,
  GetInactiveZoneInterditUseCase,
  GetZoneInterditWithCoordinatesUseCase,
  GetZoneInterditWithPaysUseCase,
  UpdateZoneInterditUseCase,
  ToggleZoneInterditStatusUseCase,
  DeleteZoneInterditUseCase
};
