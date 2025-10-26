const Joi = require('joi');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * DTOs pour les entités de référence
 */

// DTO pour créer une nationalité
class CreateNationaliteDTO {
  constructor(data) {
    this.libNation = data.libNation || data.Lib_Nation;
  }

  static fromRequest(req) {
    return new CreateNationaliteDTO(req.body);
  }

  validate() {
    const schema = Joi.object({
      libNation: Joi.string().required().max(50).messages({
        'string.empty': 'Le libellé de la nationalité est obligatoire',
        'string.max': 'Le libellé de la nationalité ne peut pas dépasser 50 caractères'
      })
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
  }
}

// DTO pour réponse nationalité
class NationaliteResponseDTO {
  constructor(entity) {
    this.id = entity.id;
    this.libNation = entity.libNation;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  static fromEntity(entity) {
    return new NationaliteResponseDTO(entity);
  }

  static fromEntities(entities) {
    return entities.map(entity => new NationaliteResponseDTO(entity));
  }
}

// DTO pour créer un niveau scolaire
class CreateNiveauScolaireDTO {
  constructor(data) {
    this.libNiveauScolaire = data.libNiveauScolaire || data.Lib_NiveauScolaire;
    this.ordre = data.ordre || 0;
  }

  static fromRequest(req) {
    return new CreateNiveauScolaireDTO(req.body);
  }

  validate() {
    const schema = Joi.object({
      libNiveauScolaire: Joi.string().required().max(100).messages({
        'string.empty': 'Le libellé du niveau scolaire est obligatoire',
        'string.max': 'Le libellé du niveau scolaire ne peut pas dépasser 100 caractères'
      }),
      ordre: Joi.number().integer().min(0).default(0)
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
  }
}

// DTO pour réponse niveau scolaire
class NiveauScolaireResponseDTO {
  constructor(entity) {
    this.id = entity.id;
    this.libNiveauScolaire = entity.libNiveauScolaire;
    this.ordre = entity.ordre;
    this.isNiveauSuperieur = entity.isNiveauSuperieur();
    this.isNiveauProfessionnel = entity.isNiveauProfessionnel();
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  static fromEntity(entity) {
    return new NiveauScolaireResponseDTO(entity);
  }

  static fromEntities(entities) {
    return entities.map(entity => new NiveauScolaireResponseDTO(entity));
  }
}

// DTO pour créer une pièce
class CreatePieceDTO {
  constructor(data) {
    this.nomPiece = data.nomPiece || data.Nom_piece;
    this.validiteDuree = data.validiteDuree || null;
    this.obligatoire = data.obligatoire || false;
  }

  static fromRequest(req) {
    return new CreatePieceDTO(req.body);
  }

  validate() {
    const schema = Joi.object({
      nomPiece: Joi.string().required().max(100).messages({
        'string.empty': 'Le nom de la pièce est obligatoire',
        'string.max': 'Le nom de la pièce ne peut pas dépasser 100 caractères'
      }),
      validiteDuree: Joi.number().integer().min(1).allow(null).optional(),
      obligatoire: Joi.boolean().default(false)
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
  }
}

// DTO pour réponse pièce
class PieceResponseDTO {
  constructor(entity) {
    this.id = entity.id;
    this.nomPiece = entity.nomPiece;
    this.validiteDuree = entity.validiteDuree;
    this.obligatoire = entity.obligatoire;
    this.hasValiditeLimitee = entity.hasValiditeLimitee();
    this.isIdentiteOfficielle = entity.isIdentiteOfficielle();
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  static fromEntity(entity) {
    return new PieceResponseDTO(entity);
  }

  static fromEntities(entities) {
    return entities.map(entity => new PieceResponseDTO(entity));
  }
}

// DTO pour recherche dans les tables de référence
class ReferenceSearchDTO {
  constructor(data) {
    this.searchTerm = data.searchTerm || '';
    this.prefix = data.prefix || '';
    this.type = data.type || null; // pour niveau scolaire
    this.obligatoire = data.obligatoire || null; // pour pièces
    this.page = parseInt(data.page) || 1;
    this.limit = parseInt(data.limit) || 10;
  }

  static fromQuery(query) {
    return new ReferenceSearchDTO(query);
  }

  validate() {
    const schema = Joi.object({
      searchTerm: Joi.string().allow('').optional(),
      prefix: Joi.string().allow('').optional(),
      type: Joi.string().allow(null).optional(),
      obligatoire: Joi.boolean().allow(null).optional(),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10)
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
  }
}

// DTO pour mise à jour des ordres
class UpdateOrderDTO {
  constructor(data) {
    this.updates = data.updates || [];
  }

  static fromRequest(req) {
    return new UpdateOrderDTO(req.body);
  }

  validate() {
    const schema = Joi.object({
      updates: Joi.array().items(
        Joi.object({
          id: Joi.string().required(),
          ordre: Joi.number().integer().min(0).required()
        })
      ).required().min(1)
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
  }
}

module.exports = {
  CreateNationaliteDTO,
  NationaliteResponseDTO,
  CreateNiveauScolaireDTO,
  NiveauScolaireResponseDTO,
  CreatePieceDTO,
  PieceResponseDTO,
  ReferenceSearchDTO,
  UpdateOrderDTO
};