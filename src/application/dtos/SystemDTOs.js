const Joi = require('joi');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * DTOs pour les entités système (Profile, Menu)
 */

// DTO pour créer un profil
class CreateProfileDTO {
  constructor(data) {
    this.name = data.name;
    this.permissions = data.permissions || [];
  }

  static fromRequest(req) {
    return new CreateProfileDTO(req.body);
  }

  validate() {
    const schema = Joi.object({
      name: Joi.string().required().max(50).messages({
        'string.empty': 'Le nom du profil est obligatoire',
        'string.max': 'Le nom du profil ne peut pas dépasser 50 caractères'
      }),
      permissions: Joi.array().items(
        Joi.object({
          menuId: Joi.string().required(),
          canAdd: Joi.boolean().default(false),
          canEdit: Joi.boolean().default(false),
          canDelete: Joi.boolean().default(false),
          canView: Joi.boolean().default(false)
        })
      ).default([])
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
  }
}

// DTO pour mettre à jour un profil
class UpdateProfileDTO extends CreateProfileDTO {
  static fromRequest(req) {
    return new UpdateProfileDTO(req.body);
  }
}

// DTO pour réponse profil
class ProfileResponseDTO {
  constructor(entity) {
    this.id = entity.id;
    this.name = entity.name;
    this.permissions = entity.permissions;
    this.isAdmin = entity.isAdmin();
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  static fromEntity(entity) {
    return new ProfileResponseDTO(entity);
  }

  static fromEntities(entities) {
    return entities.map(entity => new ProfileResponseDTO(entity));
  }
}

// DTO pour permissions spécifiques
class PermissionDTO {
  constructor(data) {
    this.menuId = data.menuId;
    this.canAdd = data.canAdd || false;
    this.canEdit = data.canEdit || false;
    this.canDelete = data.canDelete || false;
    this.canView = data.canView || false;
  }

  static fromRequest(req) {
    return new PermissionDTO(req.body);
  }

  validate() {
    const schema = Joi.object({
      menuId: Joi.string().required(),
      canAdd: Joi.boolean().default(false),
      canEdit: Joi.boolean().default(false),
      canDelete: Joi.boolean().default(false),
      canView: Joi.boolean().default(false)
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
  }
}

// DTO pour créer un menu
class CreateMenuDTO {
  constructor(data) {
    this.text = data.text;
    this.icon = data.icon || null;
    this.path = data.path || null;
    this.subMenu = data.subMenu || [];
    this.order = data.order || 0;
  }

  static fromRequest(req) {
    return new CreateMenuDTO(req.body);
  }

  validate() {
    const schema = Joi.object({
      text: Joi.string().required().max(100).messages({
        'string.empty': 'Le texte du menu est obligatoire',
        'string.max': 'Le texte du menu ne peut pas dépasser 100 caractères'
      }),
      icon: Joi.string().allow(null, '').optional(),
      path: Joi.string().allow(null, '').optional(),
      subMenu: Joi.array().items(
        Joi.object({
          text: Joi.string().required().max(100),
          path: Joi.string().required()
        })
      ).default([]),
      order: Joi.number().integer().default(0)
    });

    // Validation: un menu doit avoir soit un path soit un subMenu, pas les deux
    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    if (!this.path && this.subMenu.length === 0) {
      throw new ValidationError('Un menu doit avoir soit un chemin soit un sous-menu');
    }

    if (this.path && this.subMenu.length > 0) {
      throw new ValidationError('Un menu ne peut pas avoir à la fois un chemin et un sous-menu');
    }
  }
}

// DTO pour mettre à jour un menu
class UpdateMenuDTO extends CreateMenuDTO {
  static fromRequest(req) {
    return new UpdateMenuDTO(req.body);
  }
}

// DTO pour réponse menu
class MenuResponseDTO {
  constructor(entity) {
    this.id = entity.id;
    this.text = entity.text;
    this.icon = entity.icon;
    this.path = entity.path;
    this.subMenu = entity.subMenu;
    this.order = entity.order;
    this.isParentMenu = entity.isParentMenu();
    this.isLeafMenu = entity.isLeafMenu();
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  static fromEntity(entity) {
    return new MenuResponseDTO(entity);
  }

  static fromEntities(entities) {
    return entities.map(entity => new MenuResponseDTO(entity));
  }
}

// DTO pour sous-menu
class SubMenuDTO {
  constructor(data) {
    this.text = data.text;
    this.path = data.path;
  }

  static fromRequest(req) {
    return new SubMenuDTO(req.body);
  }

  validate() {
    const schema = Joi.object({
      text: Joi.string().required().max(100).messages({
        'string.empty': 'Le texte du sous-menu est obligatoire',
        'string.max': 'Le texte du sous-menu ne peut pas dépasser 100 caractères'
      }),
      path: Joi.string().required().messages({
        'string.empty': 'Le chemin du sous-menu est obligatoire'
      })
    });

    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
  }
}

// DTO pour recherche dans les profils et menus
class SystemSearchDTO {
  constructor(data) {
    this.searchTerm = data.searchTerm || '';
    this.type = data.type || null; // 'parent', 'leaf' pour les menus
    this.isAdmin = data.isAdmin || null; // pour les profils
    this.page = parseInt(data.page) || 1;
    this.limit = parseInt(data.limit) || 10;
  }

  static fromQuery(query) {
    return new SystemSearchDTO(query);
  }

  validate() {
    const schema = Joi.object({
      searchTerm: Joi.string().allow('').optional(),
      type: Joi.string().valid('parent', 'leaf').allow(null).optional(),
      isAdmin: Joi.boolean().allow(null).optional(),
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
  CreateProfileDTO,
  UpdateProfileDTO,
  ProfileResponseDTO,
  PermissionDTO,
  CreateMenuDTO,
  UpdateMenuDTO,
  MenuResponseDTO,
  SubMenuDTO,
  SystemSearchDTO
};