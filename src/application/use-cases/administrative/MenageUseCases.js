const MenageRepository = require('../../../infrastructure/repositories/MenageRepository');
const Menage = require('../../../domain/entities/Menage');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

const repository = new MenageRepository();

/**
 * Create Menage Use Case
 */
class CreateMenageUseCase {
  async execute(data) {
    console.log('🚀 CreateMenageUseCase.execute - Début');
    console.log('📥 Données entrantes:', JSON.stringify(data, null, 2));
    
    // Générer automatiquement le Cod_menage s'il n'est pas fourni
    if (!data.Cod_menage || data.Cod_menage.trim() === '') {
      console.log('🔄 Génération automatique du Cod_menage...');
      data.Cod_menage = await this.generateCodMenage(data);
      console.log('✅ Cod_menage généré:', data.Cod_menage);
    }
    
    console.log('🔍 Création de l\'entité Menage...');
    const entity = new Menage(data);
    
    console.log('✔️ Validation de l\'entité...');
    const validation = entity.validate();
    
    if (!validation.isValid) {
      console.error('❌ Validation échouée:', validation.errors);
      throw new ValidationError(validation.errors.join(', '));
    }
    console.log('✅ Validation réussie');

    console.log('🔍 Vérification de l\'unicité du code...');
    const codeExists = await repository.codeExists(data.Cod_menage);
    if (codeExists) {
      console.error('❌ Code ménage déjà existant:', data.Cod_menage);
      throw new ValidationError('Un ménage avec ce code existe déjà');
    }
    console.log('✅ Code unique');

    console.log('💾 Sauvegarde en base de données...');
    const menage = await repository.create(data);
    console.log('✅ Ménage créé avec succès:', menage.id || menage._id);
    return menage.toDTO();
  }

  /**
   * Génère un code ménage unique
   * Format: Code dept(3) + souspref(2) + zd(4) + ID Agent(4 derniers) + N° ORD(2)
   * Exemple: 023-01-6090-CB24-01
   */
  async generateCodMenage(data) {
    console.log('🔢 generateCodMenage - Début');
    
    // Récupérer les codes nécessaires
    const Departement = require('../../../../models/Departement');
    const Souspref = require('../../../../models/Souspref');
    const Zonedenombre = require('../../../../models/Zonedenombre');
    
    const dept = await Departement.findById(data.DepartementId);
    const souspref = await Souspref.findById(data.SousprefId);
    const zd = await Zonedenombre.findById(data.ZonedenombreId);
    
    if (!dept || !souspref || !zd) {
      throw new ValidationError('Impossible de générer le code ménage: données administratives manquantes');
    }
    
    // Extraire les codes (en assumant qu'ils existent dans les modèles)
    const deptCode = dept.Cod_departement || '000';
    const sousprefCode = souspref.Cod_Souspref || '00';
    const zdCode = zd.Cod_ZD || '0000';
    
    // ID Agent: prendre les 4 derniers caractères de l'EnqueteurId
    const agentId = data.EnqueteurId ? data.EnqueteurId.toString().slice(-4).toUpperCase() : '0000';
    
    console.log('📍 Codes extraits:', { deptCode, sousprefCode, zdCode, agentId });
    
    // Trouver le prochain numéro ordinal disponible
    // Chercher tous les codes existants avec le même préfixe
    const prefix = `${deptCode}-${sousprefCode}-${zdCode}-${agentId}`;
    const MenageModel = require('../../../../models/Menage');
    
    // Utiliser une regex pour trouver tous les codes commençant par ce préfixe
    const existingMenages = await MenageModel.find({
      Cod_menage: { $regex: `^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-` }
    }).select('Cod_menage').lean();
    
    console.log('📊 Ménages existants avec ce préfixe:', existingMenages.length);
    
    // Extraire les numéros ordinaux existants
    const existingOrdinals = existingMenages.map(m => {
      const parts = m.Cod_menage.split('-');
      const ordinal = parts[parts.length - 1];
      return parseInt(ordinal, 10);
    }).filter(n => !isNaN(n));
    
    console.log('🔢 Ordinaux existants:', existingOrdinals);
    
    // Trouver le prochain numéro disponible
    let ordinal = 1;
    while (existingOrdinals.includes(ordinal)) {
      ordinal++;
    }
    
    const ordinalStr = String(ordinal).padStart(2, '0');
    const codeMenage = `${prefix}-${ordinalStr}`;
    
    console.log('✅ Code ménage généré:', codeMenage);
    
    return codeMenage;
  }
}

/**
 * Get Menage By ID Use Case
 */
class GetMenageUseCase {
  async execute(id) {
    const menage = await repository.findById(id);
    if (!menage) {
      throw new NotFoundError('Ménage non trouvé');
    }
    return menage.toDTO();
  }
}

/**
 * Get All Menage Use Case
 */
class GetAllMenageUseCase {
  async execute(queryParams = {}) {
    // Séparer les paramètres de pagination/tri des filtres de requête
    const { limit, skip, sort, populate, ...filters } = queryParams;
    
    // Construire les options de pagination
    const options = {};
    if (limit) options.limit = Number.parseInt(limit, 10);
    if (skip) options.skip = Number.parseInt(skip, 10);
    if (sort) options.sort = sort;
    if (populate) options.populate = populate;
    
    const menages = await repository.findAll(filters, options);
    return menages.map(m => m.toDTO());
  }
}

/**
 * Get Menage By Localite Use Case
 */
class GetMenageByLocaliteUseCase {
  async execute(localiteId) {
    const menages = await repository.findByLocaliteId(localiteId);
    return menages.map(m => m.toDTO());
  }
}

/**
 * Get Menage By Enqueteur Use Case
 */
class GetMenageByEnqueteurUseCase {
  async execute(enqueteurId) {
    const menages = await repository.findByEnqueteurId(enqueteurId);
    return menages.map(m => m.toDTO());
  }
}

/**
 * Get Menage With Anacarde Producteurs Use Case
 */
class GetMenageWithAnacardeProducteursUseCase {
  async execute() {
    const menages = await repository.findWithAnacardeProducteurs();
    return menages.map(m => m.toDTO());
  }
}

/**
 * Get Menage With Full Hierarchy Use Case
 */
class GetMenageWithFullHierarchyUseCase {
  async execute() {
    const menages = await repository.getAllWithFullHierarchy();
    return menages.map(m => m.toDTO());
  }
}

/**
 * Update Menage Use Case
 */
class UpdateMenageUseCase {
  async execute(id, data) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Ménage non trouvé');
    }

    const entity = new Menage({ ...existing.toObject(), ...data });
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    if (data.Cod_menage) {
      const codeExists = await repository.codeExists(data.Cod_menage, id);
      if (codeExists) {
        throw new ValidationError('Un ménage avec ce code existe déjà');
      }
    }

    const menage = await repository.update(id, data);
    return menage.toDTO();
  }
}

/**
 * Delete Menage Use Case
 */
class DeleteMenageUseCase {
  async execute(id) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Ménage non trouvé');
    }

    await repository.delete(id);
    return { message: 'Ménage supprimé avec succès' };
  }
}

module.exports = {
  CreateMenageUseCase,
  GetMenageUseCase,
  GetAllMenageUseCase,
  GetMenageByLocaliteUseCase,
  GetMenageByEnqueteurUseCase,
  GetMenageWithAnacardeProducteursUseCase,
  GetMenageWithFullHierarchyUseCase,
  UpdateMenageUseCase,
  DeleteMenageUseCase
};
