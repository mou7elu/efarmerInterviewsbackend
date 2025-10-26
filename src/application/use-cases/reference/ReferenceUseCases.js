const { BaseUseCase } = require('../BaseUseCase');
const { NationaliteEntity } = require('../../domain/entities/NationaliteEntity');
const { NiveauScolaireEntity } = require('../../domain/entities/NiveauScolaireEntity');
const { PieceEntity } = require('../../domain/entities/PieceEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { DuplicateError } = require('../../shared/errors/DuplicateError');

/**
 * Use Cases pour la gestion des entités de référence
 */

// === NATIONALITÉ ===

class CreateNationaliteUseCase extends BaseUseCase {
  constructor(nationaliteRepository) {
    super();
    this.nationaliteRepository = nationaliteRepository;
  }

  async execute(input) {
    this.validateInput(input, ['libNation']);

    // Vérifier l'unicité
    const existing = await this.nationaliteRepository.findByLibelle(input.libNation);
    if (existing) {
      throw new DuplicateError('Une nationalité avec ce libellé existe déjà');
    }

    const nationaliteEntity = new NationaliteEntity({
      libNation: input.libNation
    });

    return await this.nationaliteRepository.create(nationaliteEntity);
  }
}

class ListNationalitesUseCase extends BaseUseCase {
  constructor(nationaliteRepository) {
    super();
    this.nationaliteRepository = nationaliteRepository;
  }

  async execute(input = {}) {
    if (input.searchTerm) {
      return await this.nationaliteRepository.searchByName(input.searchTerm);
    }

    if (input.prefix) {
      return await this.nationaliteRepository.findByPrefix(input.prefix);
    }

    return await this.nationaliteRepository.findAllSorted();
  }
}

class UpdateNationaliteUseCase extends BaseUseCase {
  constructor(nationaliteRepository) {
    super();
    this.nationaliteRepository = nationaliteRepository;
  }

  async execute(input) {
    this.validateInput(input, ['id', 'libNation']);

    // Vérifier que l'entité existe
    const existing = await this.nationaliteRepository.findById(input.id);
    if (!existing) {
      throw new NotFoundError('Nationalité non trouvée');
    }

    // Vérifier l'unicité (exclure l'ID actuel)
    const duplicateCheck = await this.nationaliteRepository.existsByLibelle(
      input.libNation, 
      input.id
    );
    if (duplicateCheck) {
      throw new DuplicateError('Une nationalité avec ce libellé existe déjà');
    }

    existing.updateLibelle(input.libNation);
    return await this.nationaliteRepository.update(input.id, existing);
  }
}

// === NIVEAU SCOLAIRE ===

class CreateNiveauScolaireUseCase extends BaseUseCase {
  constructor(niveauScolaireRepository) {
    super();
    this.niveauScolaireRepository = niveauScolaireRepository;
  }

  async execute(input) {
    this.validateInput(input, ['libNiveauScolaire']);

    // Vérifier l'unicité
    const existing = await this.niveauScolaireRepository.findByLibelle(input.libNiveauScolaire);
    if (existing) {
      throw new DuplicateError('Un niveau scolaire avec ce libellé existe déjà');
    }

    const niveauEntity = new NiveauScolaireEntity({
      libNiveauScolaire: input.libNiveauScolaire,
      ordre: input.ordre || 0
    });

    return await this.niveauScolaireRepository.create(niveauEntity);
  }
}

class ListNiveauxScolairesUseCase extends BaseUseCase {
  constructor(niveauScolaireRepository) {
    super();
    this.niveauScolaireRepository = niveauScolaireRepository;
  }

  async execute(input = {}) {
    if (input.searchTerm) {
      return await this.niveauScolaireRepository.searchByName(input.searchTerm);
    }

    if (input.type) {
      return await this.niveauScolaireRepository.findByType(input.type);
    }

    return await this.niveauScolaireRepository.findAllByOrder();
  }
}

class UpdateNiveauScolaireUseCase extends BaseUseCase {
  constructor(niveauScolaireRepository) {
    super();
    this.niveauScolaireRepository = niveauScolaireRepository;
  }

  async execute(input) {
    this.validateInput(input, ['id']);

    const existing = await this.niveauScolaireRepository.findById(input.id);
    if (!existing) {
      throw new NotFoundError('Niveau scolaire non trouvé');
    }

    if (input.libNiveauScolaire) {
      // Vérifier l'unicité
      const duplicateCheck = await this.niveauScolaireRepository.existsByLibelle(
        input.libNiveauScolaire, 
        input.id
      );
      if (duplicateCheck) {
        throw new DuplicateError('Un niveau scolaire avec ce libellé existe déjà');
      }
      existing.updateLibelle(input.libNiveauScolaire);
    }

    if (input.ordre !== undefined) {
      existing.updateOrdre(input.ordre);
    }

    return await this.niveauScolaireRepository.update(input.id, existing);
  }
}

class UpdateNiveauxScolairesOrderUseCase extends BaseUseCase {
  constructor(niveauScolaireRepository) {
    super();
    this.niveauScolaireRepository = niveauScolaireRepository;
  }

  async execute(input) {
    this.validateInput(input, ['updates']);

    if (!Array.isArray(input.updates) || input.updates.length === 0) {
      throw new ValidationError('La liste des mises à jour est requise');
    }

    // Valider chaque mise à jour
    for (const update of input.updates) {
      if (!update.id || typeof update.ordre !== 'number') {
        throw new ValidationError('Chaque mise à jour doit contenir un id et un ordre');
      }

      // Vérifier que l'entité existe
      const exists = await this.niveauScolaireRepository.exists(update.id);
      if (!exists) {
        throw new NotFoundError(`Niveau scolaire avec l'ID ${update.id} non trouvé`);
      }
    }

    await this.niveauScolaireRepository.updateOrders(input.updates);
    return { success: true, updated: input.updates.length };
  }
}

// === PIÈCE ===

class CreatePieceUseCase extends BaseUseCase {
  constructor(pieceRepository) {
    super();
    this.pieceRepository = pieceRepository;
  }

  async execute(input) {
    this.validateInput(input, ['nomPiece']);

    // Vérifier l'unicité
    const existing = await this.pieceRepository.findByLibelle(input.nomPiece);
    if (existing) {
      throw new DuplicateError('Une pièce avec ce nom existe déjà');
    }

    const pieceEntity = new PieceEntity({
      nomPiece: input.nomPiece,
      validiteDuree: input.validiteDuree,
      obligatoire: input.obligatoire || false
    });

    return await this.pieceRepository.create(pieceEntity);
  }
}

class ListPiecesUseCase extends BaseUseCase {
  constructor(pieceRepository) {
    super();
    this.pieceRepository = pieceRepository;
  }

  async execute(input = {}) {
    if (input.searchTerm) {
      return await this.pieceRepository.searchByName(input.searchTerm);
    }

    if (input.obligatoire === true) {
      return await this.pieceRepository.findObligatoires();
    }

    if (input.identitesOfficielles === true) {
      return await this.pieceRepository.findIdentitesOfficielles();
    }

    if (input.validiteDuree) {
      return await this.pieceRepository.findByValiditeDuree(input.validiteDuree);
    }

    return await this.pieceRepository.findAllSorted();
  }
}

class UpdatePieceUseCase extends BaseUseCase {
  constructor(pieceRepository) {
    super();
    this.pieceRepository = pieceRepository;
  }

  async execute(input) {
    this.validateInput(input, ['id']);

    const existing = await this.pieceRepository.findById(input.id);
    if (!existing) {
      throw new NotFoundError('Pièce non trouvée');
    }

    if (input.nomPiece) {
      // Vérifier l'unicité
      const duplicateCheck = await this.pieceRepository.existsByLibelle(
        input.nomPiece, 
        input.id
      );
      if (duplicateCheck) {
        throw new DuplicateError('Une pièce avec ce nom existe déjà');
      }
      existing.updateNom(input.nomPiece);
    }

    if (input.validiteDuree !== undefined) {
      existing.updateValiditeDuree(input.validiteDuree);
    }

    if (input.obligatoire === true) {
      existing.rendreObligatoire();
    } else if (input.obligatoire === false) {
      existing.rendreOptionnelle();
    }

    return await this.pieceRepository.update(input.id, existing);
  }
}

// === USE CASES GÉNÉRIQUES ===

class DeleteReferenceUseCase extends BaseUseCase {
  constructor(repository) {
    super();
    this.repository = repository;
  }

  async execute(input) {
    this.validateInput(input, ['id']);

    const exists = await this.repository.exists(input.id);
    if (!exists) {
      throw new NotFoundError('Entité non trouvée');
    }

    return await this.repository.delete(input.id);
  }
}

class GetReferenceStatsUseCase extends BaseUseCase {
  constructor(nationaliteRepo, niveauScolaireRepo, pieceRepo) {
    super();
    this.nationaliteRepo = nationaliteRepo;
    this.niveauScolaireRepo = niveauScolaireRepo;
    this.pieceRepo = pieceRepo;
  }

  async execute() {
    const [nationalitesCount, niveauxCount, piecesCount] = await Promise.all([
      this.nationaliteRepo.count(),
      this.niveauScolaireRepo.count(),
      this.pieceRepo.count()
    ]);

    return {
      nationalites: nationalitesCount,
      niveauxScolaires: niveauxCount,
      pieces: piecesCount,
      total: nationalitesCount + niveauxCount + piecesCount
    };
  }
}

module.exports = {
  // Nationalité
  CreateNationaliteUseCase,
  ListNationalitesUseCase,
  UpdateNationaliteUseCase,
  
  // Niveau Scolaire
  CreateNiveauScolaireUseCase,
  ListNiveauxScolairesUseCase,
  UpdateNiveauScolaireUseCase,
  UpdateNiveauxScolairesOrderUseCase,
  
  // Pièce
  CreatePieceUseCase,
  ListPiecesUseCase,
  UpdatePieceUseCase,
  
  // Génériques
  DeleteReferenceUseCase,
  GetReferenceStatsUseCase
};