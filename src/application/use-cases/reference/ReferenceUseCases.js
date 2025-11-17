const ProfessionRepository = require('../../../infrastructure/repositories/ProfessionRepository');
const NationaliteRepository = require('../../../infrastructure/repositories/NationaliteRepository');
const NiveauScolaireRepository = require('../../../infrastructure/repositories/NiveauScolaireRepository');
const PieceRepository = require('../../../infrastructure/repositories/PieceRepository');

const Profession = require('../../../domain/entities/Profession');
const Nationalite = require('../../../domain/entities/Nationalite');
const NiveauScolaire = require('../../../domain/entities/NiveauScolaire');
const Piece = require('../../../domain/entities/Piece');

const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

// ===== PROFESSION USE CASES =====

const professionRepository = new ProfessionRepository();

class CreateProfessionUseCase {
  async execute(data) {
    const entity = new Profession(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    const profession = await professionRepository.create(data);
    return profession.toDTO();
  }
}

class GetProfessionUseCase {
  async execute(id) {
    const profession = await professionRepository.findById(id);
    if (!profession) {
      throw new NotFoundError('Profession non trouvée');
    }
    return profession.toDTO();
  }
}

class GetAllProfessionUseCase {
  async execute() {
    const professions = await professionRepository.getAllSorted();
    return professions.map(p => p.toDTO());
  }
}

class UpdateProfessionUseCase {
  async execute(id, data) {
    const existing = await professionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Profession non trouvée');
    }

    const entity = new Profession({ ...existing.toObject(), ...data });
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    const profession = await professionRepository.update(id, data);
    return profession.toDTO();
  }
}

class DeleteProfessionUseCase {
  async execute(id) {
    const existing = await professionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Profession non trouvée');
    }

    await professionRepository.delete(id);
    return { message: 'Profession supprimée avec succès' };
  }
}

// ===== NATIONALITE USE CASES =====

const nationaliteRepository = new NationaliteRepository();

class CreateNationaliteUseCase {
  async execute(data) {
    const entity = new Nationalite(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    const nationalite = await nationaliteRepository.create(data);
    return nationalite.toDTO();
  }
}

class GetNationaliteUseCase {
  async execute(id) {
    const nationalite = await nationaliteRepository.findById(id);
    if (!nationalite) {
      throw new NotFoundError('Nationalité non trouvée');
    }
    return nationalite.toDTO();
  }
}

class GetAllNationaliteUseCase {
  async execute() {
    const nationalites = await nationaliteRepository.getAllSorted();
    return nationalites.map(n => n.toDTO());
  }
}

class UpdateNationaliteUseCase {
  async execute(id, data) {
    const existing = await nationaliteRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Nationalité non trouvée');
    }

    const entity = new Nationalite({ ...existing.toObject(), ...data });
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    const nationalite = await nationaliteRepository.update(id, data);
    return nationalite.toDTO();
  }
}

class DeleteNationaliteUseCase {
  async execute(id) {
    const existing = await nationaliteRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Nationalité non trouvée');
    }

    await nationaliteRepository.delete(id);
    return { message: 'Nationalité supprimée avec succès' };
  }
}

// ===== NIVEAU SCOLAIRE USE CASES =====

const niveauScolaireRepository = new NiveauScolaireRepository();

class CreateNiveauScolaireUseCase {
  async execute(data) {
    const entity = new NiveauScolaire(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    const niveauScolaire = await niveauScolaireRepository.create(data);
    return niveauScolaire.toDTO();
  }
}

class GetNiveauScolaireUseCase {
  async execute(id) {
    const niveauScolaire = await niveauScolaireRepository.findById(id);
    if (!niveauScolaire) {
      throw new NotFoundError('Niveau scolaire non trouvé');
    }
    return niveauScolaire.toDTO();
  }
}

class GetAllNiveauScolaireUseCase {
  async execute() {
    const niveaux = await niveauScolaireRepository.getAllSorted();
    return niveaux.map(n => n.toDTO());
  }
}

class UpdateNiveauScolaireUseCase {
  async execute(id, data) {
    const existing = await niveauScolaireRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Niveau scolaire non trouvé');
    }

    const entity = new NiveauScolaire({ ...existing.toObject(), ...data });
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    const niveauScolaire = await niveauScolaireRepository.update(id, data);
    return niveauScolaire.toDTO();
  }
}

class DeleteNiveauScolaireUseCase {
  async execute(id) {
    const existing = await niveauScolaireRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Niveau scolaire non trouvé');
    }

    await niveauScolaireRepository.delete(id);
    return { message: 'Niveau scolaire supprimé avec succès' };
  }
}

// ===== PIECE USE CASES =====

const pieceRepository = new PieceRepository();

class CreatePieceUseCase {
  async execute(data) {
    const entity = new Piece(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    const piece = await pieceRepository.create(data);
    return piece.toDTO();
  }
}

class GetPieceUseCase {
  async execute(id) {
    const piece = await pieceRepository.findById(id);
    if (!piece) {
      throw new NotFoundError('Pièce non trouvée');
    }
    return piece.toDTO();
  }
}

class GetAllPieceUseCase {
  async execute() {
    const pieces = await pieceRepository.getAllSorted();
    return pieces.map(p => p.toDTO());
  }
}

class UpdatePieceUseCase {
  async execute(id, data) {
    const existing = await pieceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Pièce non trouvée');
    }

    const entity = new Piece({ ...existing.toObject(), ...data });
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    const piece = await pieceRepository.update(id, data);
    return piece.toDTO();
  }
}

class DeletePieceUseCase {
  async execute(id) {
    const existing = await pieceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Pièce non trouvée');
    }

    await pieceRepository.delete(id);
    return { message: 'Pièce supprimée avec succès' };
  }
}

// Export all use cases
module.exports = {
  // Profession
  CreateProfessionUseCase,
  GetProfessionUseCase,
  GetAllProfessionUseCase,
  UpdateProfessionUseCase,
  DeleteProfessionUseCase,
  
  // Nationalite
  CreateNationaliteUseCase,
  GetNationaliteUseCase,
  GetAllNationaliteUseCase,
  UpdateNationaliteUseCase,
  DeleteNationaliteUseCase,
  
  // NiveauScolaire
  CreateNiveauScolaireUseCase,
  GetNiveauScolaireUseCase,
  GetAllNiveauScolaireUseCase,
  UpdateNiveauScolaireUseCase,
  DeleteNiveauScolaireUseCase,
  
  // Piece
  CreatePieceUseCase,
  GetPieceUseCase,
  GetAllPieceUseCase,
  UpdatePieceUseCase,
  DeletePieceUseCase
};
