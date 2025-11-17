const ProducteurRepository = require('../../../infrastructure/repositories/ProducteurRepository');
const Producteur = require('../../../domain/entities/Producteur');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

const repository = new ProducteurRepository();

/**
 * Create Producteur Use Case
 */
class CreateProducteurUseCase {
  async execute(data) {
    const entity = new Producteur(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    // Check if code already exists
    const codeExists = await repository.codeExists(data.Code);
    if (codeExists) {
      throw new ValidationError('Un producteur avec ce code existe déjà');
    }

    const producteur = await repository.create(data);
    return producteur.toDTO();
  }
}

/**
 * Get Producteur By ID Use Case
 */
class GetProducteurUseCase {
  async execute(id) {
    const producteur = await repository.findById(id);
    if (!producteur) {
      throw new NotFoundError('Producteur non trouvé');
    }
    return producteur.toDTO();
  }
}

/**
 * Get All Producteurs Use Case
 */
class GetAllProducteursUseCase {
  async execute(filters = {}) {
    const producteurs = await repository.findAll(filters);
    return producteurs.map(p => p.toDTO());
  }
}

/**
 * Get Producteur By Code Use Case
 */
class GetProducteurByCodeUseCase {
  async execute(code) {
    const producteur = await repository.findByCode(code);
    if (!producteur) {
      throw new NotFoundError('Producteur non trouvé');
    }
    return producteur.toDTO();
  }
}

/**
 * Get Producteurs By Menage Use Case
 */
class GetProducteursByMenageUseCase {
  async execute(menageId) {
    const producteurs = await repository.findByMenageId(menageId);
    return producteurs.map(p => p.toDTO());
  }
}

/**
 * Get Producteurs By Enqueteur Use Case
 */
class GetProducteursByEnqueteurUseCase {
  async execute(enqueteurId) {
    const producteurs = await repository.findByEnqueteurId(enqueteurId);
    return producteurs.map(p => p.toDTO());
  }
}

/**
 * Get Exploitants Use Case
 */
class GetExploitantsUseCase {
  async execute() {
    const producteurs = await repository.findExploitants();
    return producteurs.map(p => p.toDTO());
  }
}

/**
 * Get Represented Producteurs Use Case
 */
class GetRepresentedProducteursUseCase {
  async execute() {
    const producteurs = await repository.findRepresented();
    return producteurs.map(p => p.toDTO());
  }
}

/**
 * Get Producteurs With Other Speculations Use Case
 */
class GetProducteursWithOtherSpeculationsUseCase {
  async execute() {
    const producteurs = await repository.findWithOtherSpeculations();
    return producteurs.map(p => p.toDTO());
  }
}

/**
 * Get Producteurs With Cultures Vivrier Use Case
 */
class GetProducteursWithCulturesVivrierUseCase {
  async execute() {
    const producteurs = await repository.findWithCulturesVivrier();
    return producteurs.map(p => p.toDTO());
  }
}

/**
 * Get Producteurs With Mobile Money Use Case
 */
class GetProducteursWithMobileMoneyUseCase {
  async execute() {
    const producteurs = await repository.findWithMobileMoney();
    return producteurs.map(p => p.toDTO());
  }
}

/**
 * Get Producteurs With Bank Account Use Case
 */
class GetProducteursWithBankAccountUseCase {
  async execute() {
    const producteurs = await repository.findWithBankAccount();
    return producteurs.map(p => p.toDTO());
  }
}

/**
 * Get Producteurs Statistics Use Case
 */
class GetProducteursStatisticsUseCase {
  async execute(criteria = {}) {
    const stats = await repository.getStatistics(criteria);
    return stats[0] || {
      totalProducteurs: 0,
      avgSurfaceAgricole: 0,
      avgMembresMenage: 0,
      totalExploitants: 0
    };
  }
}

/**
 * Get Producteurs With References Use Case
 */
class GetProducteursWithReferencesUseCase {
  async execute() {
    const producteurs = await repository.getAllWithReferences();
    return producteurs.map(p => p.toDTO());
  }
}

/**
 * Update Producteur Use Case
 */
class UpdateProducteurUseCase {
  async execute(id, data) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Producteur non trouvé');
    }

    const entity = new Producteur({ ...existing.toObject(), ...data });
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    // Check if code already exists for another producteur
    if (data.Code) {
      const codeExists = await repository.codeExists(data.Code, id);
      if (codeExists) {
        throw new ValidationError('Un producteur avec ce code existe déjà');
      }
    }

    const producteur = await repository.update(id, data);
    return producteur.toDTO();
  }
}

/**
 * Delete Producteur Use Case
 */
class DeleteProducteurUseCase {
  async execute(id) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Producteur non trouvé');
    }

    await repository.delete(id);
    return { message: 'Producteur supprimé avec succès' };
  }
}

module.exports = {
  CreateProducteurUseCase,
  GetProducteurUseCase,
  GetAllProducteursUseCase,
  GetProducteurByCodeUseCase,
  GetProducteursByMenageUseCase,
  GetProducteursByEnqueteurUseCase,
  GetExploitantsUseCase,
  GetRepresentedProducteursUseCase,
  GetProducteursWithOtherSpeculationsUseCase,
  GetProducteursWithCulturesVivrierUseCase,
  GetProducteursWithMobileMoneyUseCase,
  GetProducteursWithBankAccountUseCase,
  GetProducteursStatisticsUseCase,
  GetProducteursWithReferencesUseCase,
  UpdateProducteurUseCase,
  DeleteProducteurUseCase
};
