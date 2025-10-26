const { BaseUseCase } = require('../BaseUseCase');
const { PaysEntity } = require('../../domain/entities/PaysEntity');
const { DistrictEntity } = require('../../domain/entities/DistrictEntity');
const { RegionEntity } = require('../../domain/entities/RegionEntity');
const { VillageEntity } = require('../../domain/entities/VillageEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { DuplicateError } = require('../../shared/errors/DuplicateError');

/**
 * Use Cases pour la gestion des entités géographiques
 */

// Use Case pour créer un pays
class CreatePaysUseCase extends BaseUseCase {
  constructor(paysRepository) {
    super();
    this.paysRepository = paysRepository;
  }

  async execute(input) {
    this.validateInput(input, ['libPays']);

    // Vérifier l'unicité du libellé
    const existing = await this.paysRepository.findByLibelle(input.libPays);
    if (existing) {
      throw new DuplicateError('Un pays avec ce libellé existe déjà');
    }

    const paysEntity = new PaysEntity({
      libPays: input.libPays,
      coordonnee: input.coordonnee,
      sommeil: input.sommeil || false
    });

    return await this.paysRepository.create(paysEntity);
  }
}

// Use Case pour obtenir un pays
class GetPaysUseCase extends BaseUseCase {
  constructor(paysRepository) {
    super();
    this.paysRepository = paysRepository;
  }

  async execute(input) {
    this.validateInput(input, ['id']);

    const pays = await this.paysRepository.findById(input.id);
    if (!pays) {
      throw new NotFoundError('Pays non trouvé');
    }

    return pays;
  }
}

// Use Case pour lister les pays
class ListPaysUseCase extends BaseUseCase {
  constructor(paysRepository) {
    super();
    this.paysRepository = paysRepository;
  }

  async execute(input = {}) {
    if (input.actifSeulement) {
      return await this.paysRepository.findActifs();
    }

    if (input.searchTerm) {
      return await this.paysRepository.searchByName(input.searchTerm);
    }

    if (input.page && input.limit) {
      return await this.paysRepository.findPaginated(
        input.page, 
        input.limit, 
        input.actifSeulement
      );
    }

    return await this.paysRepository.findAll();
  }
}

// Use Case pour mettre à jour un pays
class UpdatePaysUseCase extends BaseUseCase {
  constructor(paysRepository) {
    super();
    this.paysRepository = paysRepository;
  }

  async execute(input) {
    this.validateInput(input, ['id', 'libPays']);

    // Vérifier que le pays existe
    const existingPays = await this.paysRepository.findById(input.id);
    if (!existingPays) {
      throw new NotFoundError('Pays non trouvé');
    }

    // Vérifier l'unicité du libellé (exclure l'ID actuel)
    const duplicateCheck = await this.paysRepository.findByLibelle(input.libPays);
    if (duplicateCheck && duplicateCheck.id !== input.id) {
      throw new DuplicateError('Un pays avec ce libellé existe déjà');
    }

    // Mettre à jour l'entité
    existingPays.updateLibelle(input.libPays);
    if (input.coordonnee !== undefined) {
      existingPays.updateCoordonnees(input.coordonnee);
    }

    return await this.paysRepository.update(input.id, existingPays);
  }
}

// Use Case pour changer le statut d'un pays
class TogglePaysStatusUseCase extends BaseUseCase {
  constructor(paysRepository) {
    super();
    this.paysRepository = paysRepository;
  }

  async execute(input) {
    this.validateInput(input, ['id']);

    const pays = await this.paysRepository.findById(input.id);
    if (!pays) {
      throw new NotFoundError('Pays non trouvé');
    }

    if (input.activer) {
      pays.activer();
    } else {
      pays.desactiver();
    }

    return await this.paysRepository.updateStatut(input.id, pays.sommeil);
  }
}

// Use Case pour créer un district
class CreateDistrictUseCase extends BaseUseCase {
  constructor(districtRepository, paysRepository) {
    super();
    this.districtRepository = districtRepository;
    this.paysRepository = paysRepository;
  }

  async execute(input) {
    this.validateInput(input, ['libDistrict', 'paysId']);

    // Vérifier que le pays existe
    const pays = await this.paysRepository.findById(input.paysId);
    if (!pays) {
      throw new NotFoundError('Pays non trouvé');
    }

    // Vérifier l'unicité du libellé
    const existing = await this.districtRepository.findByLibelle(input.libDistrict);
    if (existing) {
      throw new DuplicateError('Un district avec ce libellé existe déjà');
    }

    const districtEntity = new DistrictEntity({
      libDistrict: input.libDistrict,
      coordonnee: input.coordonnee,
      sommeil: input.sommeil || false,
      paysId: input.paysId
    });

    return await this.districtRepository.create(districtEntity);
  }
}

// Use Case pour lister les districts d'un pays
class ListDistrictsByPaysUseCase extends BaseUseCase {
  constructor(districtRepository) {
    super();
    this.districtRepository = districtRepository;
  }

  async execute(input) {
    this.validateInput(input, ['paysId']);

    if (input.actifSeulement) {
      return await this.districtRepository.findActifsByPays(input.paysId);
    }

    return await this.districtRepository.findByPaysId(input.paysId);
  }
}

// Use Case pour créer une région
class CreateRegionUseCase extends BaseUseCase {
  constructor(regionRepository, districtRepository) {
    super();
    this.regionRepository = regionRepository;
    this.districtRepository = districtRepository;
  }

  async execute(input) {
    this.validateInput(input, ['libRegion', 'districtId']);

    // Vérifier que le district existe
    const district = await this.districtRepository.findById(input.districtId);
    if (!district) {
      throw new NotFoundError('District non trouvé');
    }

    // Vérifier l'unicité du libellé
    const existing = await this.regionRepository.findByLibelle(input.libRegion);
    if (existing) {
      throw new DuplicateError('Une région avec ce libellé existe déjà');
    }

    const regionEntity = new RegionEntity({
      libRegion: input.libRegion,
      coordonnee: input.coordonnee,
      sommeil: input.sommeil || false,
      districtId: input.districtId
    });

    return await this.regionRepository.create(regionEntity);
  }
}

// Use Case pour créer un village
class CreateVillageUseCase extends BaseUseCase {
  constructor(villageRepository, paysRepository) {
    super();
    this.villageRepository = villageRepository;
    this.paysRepository = paysRepository;
  }

  async execute(input) {
    this.validateInput(input, ['libVillage', 'paysId']);

    // Vérifier que le pays existe
    const pays = await this.paysRepository.findById(input.paysId);
    if (!pays) {
      throw new NotFoundError('Pays non trouvé');
    }

    const villageEntity = new VillageEntity({
      libVillage: input.libVillage,
      coordonnee: input.coordonnee,
      paysId: input.paysId
    });

    return await this.villageRepository.create(villageEntity);
  }
}

// Use Case pour recherche géographique hiérarchique
class GeographicHierarchySearchUseCase extends BaseUseCase {
  constructor(paysRepository, districtRepository, regionRepository, villageRepository) {
    super();
    this.paysRepository = paysRepository;
    this.districtRepository = districtRepository;
    this.regionRepository = regionRepository;
    this.villageRepository = villageRepository;
  }

  async execute(input) {
    const result = {
      pays: [],
      districts: [],
      regions: [],
      villages: []
    };

    // Recherche pays
    if (!input.paysId) {
      result.pays = await this.paysRepository.findActifs();
    }

    // Recherche districts
    if (input.paysId && !input.districtId) {
      result.districts = await this.districtRepository.findActifsByPays(input.paysId);
    }

    // Recherche régions
    if (input.districtId && !input.regionId) {
      result.regions = await this.regionRepository.findActivesByDistrict(input.districtId);
    }

    // Recherche villages
    if (input.paysId) {
      result.villages = await this.villageRepository.findByPaysId(input.paysId);
    }

    return result;
  }
}

module.exports = {
  CreatePaysUseCase,
  GetPaysUseCase,
  ListPaysUseCase,
  UpdatePaysUseCase,
  TogglePaysStatusUseCase,
  CreateDistrictUseCase,
  ListDistrictsByPaysUseCase,
  CreateRegionUseCase,
  CreateVillageUseCase,
  GeographicHierarchySearchUseCase
};