const Joi = require('joi');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * DTOs pour les entités géographiques
 */

// DTO pour créer un pays
class CreatePaysDTO {
  constructor(data) {
    this.libPays = data.libPays || data.Lib_pays;
    this.coordonnee = data.coordonnee || data.Coordonnee || null;
    this.sommeil = data.sommeil || data.Sommeil || false;
  }

  static fromRequest(req) {
    return new CreatePaysDTO(req.body);
  }

  validate() {
    const schema = Joi.object({
      libPays: Joi.string().required().max(100).messages({
        'string.empty': 'Le libellé du pays est obligatoire',
        'string.max': 'Le libellé du pays ne peut pas dépasser 100 caractères'
      }),
      coordonnee: Joi.string().allow(null, '').optional(),
      sommeil: Joi.boolean().default(false)
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
  }
}

// DTO pour mettre à jour un pays
class UpdatePaysDTO extends CreatePaysDTO {
  static fromRequest(req) {
    return new UpdatePaysDTO(req.body);
  }
}

// DTO pour réponse pays
class PaysResponseDTO {
  constructor(entity) {
    this.id = entity.id;
    this.libPays = entity.libPays;
    this.coordonnee = entity.coordonnee;
    this.sommeil = entity.sommeil;
    this.isActif = entity.isActif();
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  static fromEntity(entity) {
    return new PaysResponseDTO(entity);
  }

  static fromEntities(entities) {
    return entities.map(entity => new PaysResponseDTO(entity));
  }
}

// DTO pour créer un district
class CreateDistrictDTO {
  constructor(data) {
    this.libDistrict = data.libDistrict || data.Lib_district;
    this.coordonnee = data.coordonnee || data.Coordonnee || null;
    this.sommeil = data.sommeil || data.Sommeil || false;
    this.paysId = data.paysId || data.PaysId;
  }

  static fromRequest(req) {
    return new CreateDistrictDTO(req.body);
  }

  validate() {
    const schema = Joi.object({
      libDistrict: Joi.string().required().max(100).messages({
        'string.empty': 'Le libellé du district est obligatoire',
        'string.max': 'Le libellé du district ne peut pas dépasser 100 caractères'
      }),
      coordonnee: Joi.string().allow(null, '').optional(),
      sommeil: Joi.boolean().default(false),
      paysId: Joi.string().required().messages({
        'string.empty': 'L\'identifiant du pays est obligatoire'
      })
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
  }
}

// DTO pour réponse district
class DistrictResponseDTO {
  constructor(entity) {
    this.id = entity.id;
    this.libDistrict = entity.libDistrict;
    this.coordonnee = entity.coordonnee;
    this.sommeil = entity.sommeil;
    this.paysId = entity.paysId;
    this.isActif = entity.isActif();
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  static fromEntity(entity) {
    return new DistrictResponseDTO(entity);
  }

  static fromEntities(entities) {
    return entities.map(entity => new DistrictResponseDTO(entity));
  }
}

// DTO pour créer une région
class CreateRegionDTO {
  constructor(data) {
    this.libRegion = data.libRegion || data.Lib_region;
    this.coordonnee = data.coordonnee || data.Coordonnee || null;
    this.sommeil = data.sommeil || data.Sommeil || false;
    this.districtId = data.districtId || data.DistrictId;
  }

  static fromRequest(req) {
    return new CreateRegionDTO(req.body);
  }

  validate() {
    const schema = Joi.object({
      libRegion: Joi.string().required().max(100).messages({
        'string.empty': 'Le libellé de la région est obligatoire',
        'string.max': 'Le libellé de la région ne peut pas dépasser 100 caractères'
      }),
      coordonnee: Joi.string().allow(null, '').optional(),
      sommeil: Joi.boolean().default(false),
      districtId: Joi.string().required().messages({
        'string.empty': 'L\'identifiant du district est obligatoire'
      })
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
  }
}

// DTO pour réponse région
class RegionResponseDTO {
  constructor(entity) {
    this.id = entity.id;
    this.libRegion = entity.libRegion;
    this.coordonnee = entity.coordonnee;
    this.sommeil = entity.sommeil;
    this.districtId = entity.districtId;
    this.isActive = entity.isActive();
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  static fromEntity(entity) {
    return new RegionResponseDTO(entity);
  }

  static fromEntities(entities) {
    return entities.map(entity => new RegionResponseDTO(entity));
  }
}

// DTO pour créer un village
class CreateVillageDTO {
  constructor(data) {
    this.libVillage = data.libVillage || data.Lib_village;
    this.coordonnee = data.coordonnee || data.Coordonnee || null;
    this.paysId = data.paysId || data.PaysId;
  }

  static fromRequest(req) {
    return new CreateVillageDTO(req.body);
  }

  validate() {
    const schema = Joi.object({
      libVillage: Joi.string().required().max(100).messages({
        'string.empty': 'Le libellé du village est obligatoire',
        'string.max': 'Le libellé du village ne peut pas dépasser 100 caractères'
      }),
      coordonnee: Joi.string().allow(null, '').optional(),
      paysId: Joi.string().required().messages({
        'string.empty': 'L\'identifiant du pays est obligatoire'
      })
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
  }
}

// DTO pour réponse village
class VillageResponseDTO {
  constructor(entity) {
    this.id = entity.id;
    this.libVillage = entity.libVillage;
    this.coordonnee = entity.coordonnee;
    this.paysId = entity.paysId;
    this.hasCoordinates = entity.hasCoordinates();
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  static fromEntity(entity) {
    return new VillageResponseDTO(entity);
  }

  static fromEntities(entities) {
    return entities.map(entity => new VillageResponseDTO(entity));
  }
}

// DTO pour recherche géographique
class GeographicSearchDTO {
  constructor(data) {
    this.searchTerm = data.searchTerm || '';
    this.paysId = data.paysId || null;
    this.districtId = data.districtId || null;
    this.regionId = data.regionId || null;
    this.actifSeulement = data.actifSeulement || false;
    this.page = parseInt(data.page) || 1;
    this.limit = parseInt(data.limit) || 10;
  }

  static fromQuery(query) {
    return new GeographicSearchDTO(query);
  }

  validate() {
    const schema = Joi.object({
      searchTerm: Joi.string().allow('').optional(),
      paysId: Joi.string().allow(null).optional(),
      districtId: Joi.string().allow(null).optional(),
      regionId: Joi.string().allow(null).optional(),
      actifSeulement: Joi.boolean().default(false),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10)
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
  }
}

module.exports = {
  CreatePaysDTO,
  UpdatePaysDTO,
  PaysResponseDTO,
  CreateDistrictDTO,
  DistrictResponseDTO,
  CreateRegionDTO,
  RegionResponseDTO,
  CreateVillageDTO,
  VillageResponseDTO,
  GeographicSearchDTO
};