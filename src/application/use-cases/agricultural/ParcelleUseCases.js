const ParcelleRepository = require('../../../infrastructure/repositories/ParcelleRepository');
const Parcelle = require('../../../domain/entities/Parcelle');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

const repository = new ParcelleRepository();

/**
 * Create Parcelle Use Case
 */
class CreateParcelleUseCase {
  async execute(data) {
    const entity = new Parcelle(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    // Check if code already exists
    const codeExists = await repository.codeExists(data.Code);
    if (codeExists) {
      throw new ValidationError('Une parcelle avec ce code existe déjà');
    }

    const parcelle = await repository.create(data);
    return parcelle.toDTO();
  }
}

/**
 * Get Parcelle By ID Use Case
 */
class GetParcelleUseCase {
  async execute(id) {
    const parcelle = await repository.findById(id);
    if (!parcelle) {
      throw new NotFoundError('Parcelle non trouvée');
    }
    return parcelle.toDTO();
  }
}

/**
 * Get All Parcelles Use Case
 */
class GetAllParcellesUseCase {
  async execute(filters = {}) {
    const parcelles = await repository.findAll(filters);
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Get Parcelle By Code Use Case
 */
class GetParcelleByCodeUseCase {
  async execute(code) {
    const parcelle = await repository.findByCode(code);
    if (!parcelle) {
      throw new NotFoundError('Parcelle non trouvée');
    }
    return parcelle.toDTO();
  }
}

/**
 * Get Parcelles By Producteur Use Case
 */
class GetParcellesByProducteurUseCase {
  async execute(producteurId) {
    const parcelles = await repository.findByProducteurId(producteurId);
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Get Parcelles By Menage Use Case
 */
class GetParcellesByMenageUseCase {
  async execute(menageId) {
    const parcelles = await repository.findByMenageId(menageId);
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Get Parcelles By Localite Use Case
 */
class GetParcellesByLocaliteUseCase {
  async execute(localiteId) {
    const parcelles = await repository.findByLocaliteId(localiteId);
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Get Parcelles In Same Locality Use Case
 */
class GetParcellesInSameLocalityUseCase {
  async execute() {
    const parcelles = await repository.findInSameLocality();
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Get Parcelles In Different Locality Use Case
 */
class GetParcellesInDifferentLocalityUseCase {
  async execute() {
    const parcelles = await repository.findInDifferentLocality();
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Get Certified Parcelles Use Case
 */
class GetCertifiedParcellesUseCase {
  async execute() {
    const parcelles = await repository.findCertified();
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Get Rehabilitated Parcelles Use Case
 */
class GetRehabilitatedParcellesUseCase {
  async execute() {
    const parcelles = await repository.findRehabilitees();
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Get Parcelles With Engrais Use Case
 */
class GetParcellesWithEngraisUseCase {
  async execute() {
    const parcelles = await repository.findWithEngrais();
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Get Parcelles With Phytosanitaire Use Case
 */
class GetParcellesWithPhytosanitaireUseCase {
  async execute() {
    const parcelles = await repository.findWithPhytosanitaire();
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Get Parcelles With Association Culturelle Use Case
 */
class GetParcellesWithAssociationCulturelleUseCase {
  async execute() {
    const parcelles = await repository.findWithAssociationCulturelle();
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Get Parcelles With Anacarde Principal Use Case
 */
class GetParcellesWithAnacardePrincipalUseCase {
  async execute() {
    const parcelles = await repository.findWithAnacardePrincipal();
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Get Parcelles By Year Of Creation Use Case
 */
class GetParcellesByYearOfCreationUseCase {
  async execute(year) {
    const parcelles = await repository.findByYearOfCreation(year);
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Get Parcelles By Production Start Year Use Case
 */
class GetParcellesByProductionStartYearUseCase {
  async execute(year) {
    const parcelles = await repository.findByProductionStartYear(year);
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Get Parcelles Statistics Use Case
 */
class GetParcellesStatisticsUseCase {
  async execute(criteria = {}) {
    const stats = await repository.getStatistics(criteria);
    return stats[0] || {
      totalParcelles: 0,
      totalSuperficie: 0,
      avgSuperficie: 0,
      totalSuperficieProductive: 0,
      totalSuperficieNonProductive: 0,
      totalTonnageLastYear: 0,
      avgPrixVente: 0
    };
  }
}

/**
 * Get Parcelles With References Use Case
 */
class GetParcellesWithReferencesUseCase {
  async execute() {
    const parcelles = await repository.getAllWithReferences();
    return parcelles.map(p => p.toDTO());
  }
}

/**
 * Update Parcelle Use Case
 */
class UpdateParcelleUseCase {
  async execute(id, data) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Parcelle non trouvée');
    }

    const entity = new Parcelle({ ...existing.toObject(), ...data });
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    // Check if code already exists for another parcelle
    if (data.Code) {
      const codeExists = await repository.codeExists(data.Code, id);
      if (codeExists) {
        throw new ValidationError('Une parcelle avec ce code existe déjà');
      }
    }

    const parcelle = await repository.update(id, data);
    return parcelle.toDTO();
  }
}

/**
 * Delete Parcelle Use Case
 */
class DeleteParcelleUseCase {
  async execute(id) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Parcelle non trouvée');
    }

    await repository.delete(id);
    return { message: 'Parcelle supprimée avec succès' };
  }
}

module.exports = {
  CreateParcelleUseCase,
  GetParcelleUseCase,
  GetAllParcellesUseCase,
  GetParcelleByCodeUseCase,
  GetParcellesByProducteurUseCase,
  GetParcellesByMenageUseCase,
  GetParcellesByLocaliteUseCase,
  GetParcellesInSameLocalityUseCase,
  GetParcellesInDifferentLocalityUseCase,
  GetCertifiedParcellesUseCase,
  GetRehabilitatedParcellesUseCase,
  GetParcellesWithEngraisUseCase,
  GetParcellesWithPhytosanitaireUseCase,
  GetParcellesWithAssociationCulturelleUseCase,
  GetParcellesWithAnacardePrincipalUseCase,
  GetParcellesByYearOfCreationUseCase,
  GetParcellesByProductionStartYearUseCase,
  GetParcellesStatisticsUseCase,
  GetParcellesWithReferencesUseCase,
  UpdateParcelleUseCase,
  DeleteParcelleUseCase
};
