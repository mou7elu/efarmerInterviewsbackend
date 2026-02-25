const ParcelleRepository = require('../../../infrastructure/repositories/ParcelleRepository');
const Parcelle = require('../../../domain/entities/Parcelle');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const ProducteurModel = require('../../../../models/Producteur');
const ParcelleModel = require('../../../../models/Parcelle');

const repository = new ParcelleRepository();

/**
 * Generate unique Parcelle code based on Producteur Code + ordinal
 * Format: ProducteurCode-XX (e.g., "023-01-6090-CB24-01-01")
 */
async function generateParcelleCode(producteurId) {
  console.log('🔢 generateParcelleCode - ProducteurId:', producteurId);
  
  // Get Producteur to retrieve its Code
  const producteur = await ProducteurModel.findById(producteurId).lean();
  if (!producteur) {
    console.error('❌ generateParcelleCode - producteur not found');
    throw new ValidationError('Producteur non trouvé');
  }
  
  console.log('📦 generateParcelleCode - Producteur Code:', producteur.Code);
  
  // Find all parcelles with codes that start with this producteur's code
  const prefix = producteur.Code;
  const existingParcelles = await ParcelleModel.find({
    Code: new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-`, 'i')
  }).lean();
  
  console.log('📊 generateParcelleCode - existing parcelles count:', existingParcelles.length);
  
  // Extract ordinals from existing codes
  const ordinals = existingParcelles
    .map(p => {
      const match = p.Code.match(/-(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(n => !isNaN(n));
  
  console.log('🔢 generateParcelleCode - existing ordinals:', ordinals);
  
  // Find next available ordinal
  let nextOrdinal = 1;
  if (ordinals.length > 0) {
    const maxOrdinal = Math.max(...ordinals);
    nextOrdinal = maxOrdinal + 1;
  }
  
  const newCode = `${prefix}-${String(nextOrdinal).padStart(2, '0')}`;
  console.log('✅ generateParcelleCode - generated code:', newCode);
  
  return newCode;
}

/**
 * Create Parcelle Use Case
 */
class CreateParcelleUseCase {
  async execute(data) {
    console.log('🚀 CreateParcelleUseCase.execute - start');
    console.log('📥 CreateParcelleUseCase.execute - input:', JSON.stringify(data, null, 2));
    
    // Generate Code if not provided
    if (!data.Code || data.Code.trim() === '') {
      console.log('🔄 CreateParcelleUseCase - generating Code...');
      data.Code = await generateParcelleCode(data.ProducteurId);
      console.log('✅ CreateParcelleUseCase - generated Code:', data.Code);
    }
    
    // Clean geographic fields when IsSameLocalitethanExploitant is true
    if (data.IsSameLocalitethanExploitant === true) {
      console.log('🧹 CreateParcelleUseCase - cleaning geographic fields (same locality as exploitant)');
      delete data.RegionId;
      delete data.DepartementId;
      delete data.SousprefId;
      delete data.SecteurAdministratifId;
      delete data.ZonedenombreId;
      delete data.LocaliteId;
    } else {
      // Convert empty strings to undefined for ObjectId fields
      const geoFields = ['RegionId', 'DepartementId', 'SousprefId', 'SecteurAdministratifId', 'ZonedenombreId', 'LocaliteId'];
      geoFields.forEach(field => {
        if (data[field] === '' || data[field] === null) {
          delete data[field];
        }
      });
    }
    
    const entity = new Parcelle(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      console.error('❌ CreateParcelleUseCase.execute - validation errors:', validation.errors);
      throw new ValidationError(validation.errors.join(', '));
    }
    console.log('✅ CreateParcelleUseCase.execute - validation passed');

    // Check if code already exists
    const codeExists = await repository.codeExists(data.Code);
    if (codeExists) {
      console.error('❌ CreateParcelleUseCase.execute - code exists:', data.Code);
      throw new ValidationError('Une parcelle avec ce code existe déjà');
    }

    console.log('💾 CreateParcelleUseCase.execute - creating in DB...');
    const parcelle = await repository.create(data);
    console.log('✅ CreateParcelleUseCase.execute - created:', parcelle?.id || parcelle?._id || parcelle?.Code);
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
