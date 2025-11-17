const ProfileRepository = require('../../../infrastructure/repositories/ProfileRepository');
const Profile = require('../../../domain/entities/Profile');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

const repository = new ProfileRepository();

/**
 * Create Profile Use Case
 */
class CreateProfileUseCase {
  async execute(data) {
    const entity = new Profile(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    // Check if profile name already exists
    const nameExists = await repository.nameExists(data.name);
    if (nameExists) {
      throw new ValidationError('Un profil avec ce nom existe déjà');
    }

    const profile = await repository.create(data);
    return profile.toDTO();
  }
}

/**
 * Get Profile By ID Use Case
 */
class GetProfileUseCase {
  async execute(id) {
    const profile = await repository.findById(id);
    if (!profile) {
      throw new NotFoundError('Profil non trouvé');
    }
    return profile.toDTO();
  }
}

/**
 * Get All Profiles Use Case
 */
class GetAllProfilesUseCase {
  async execute() {
    const profiles = await repository.getAllSorted();
    return profiles.map(p => p.toDTO());
  }
}

/**
 * Get Profile By Name Use Case
 */
class GetProfileByNameUseCase {
  async execute(name) {
    const profile = await repository.findByName(name);
    if (!profile) {
      throw new NotFoundError('Profil non trouvé');
    }
    return profile.toDTO();
  }
}

/**
 * Update Profile Use Case
 */
class UpdateProfileUseCase {
  async execute(id, data) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Profil non trouvé');
    }

    const entity = new Profile({ ...existing.toObject(), ...data });
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    // Check if name already exists for another profile
    if (data.name) {
      const nameExists = await repository.nameExists(data.name, id);
      if (nameExists) {
        throw new ValidationError('Un profil avec ce nom existe déjà');
      }
    }

    const profile = await repository.update(id, data);
    return profile.toDTO();
  }
}

/**
 * Update Profile Permissions Use Case
 */
class UpdateProfilePermissionsUseCase {
  async execute(id, permissions) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Profil non trouvé');
    }

    // Validate permissions structure
    if (!Array.isArray(permissions)) {
      throw new ValidationError('Les permissions doivent être un tableau');
    }

    permissions.forEach((perm, index) => {
      if (!perm.menuId) {
        throw new ValidationError(`Permission ${index}: menuId est requis`);
      }
    });

    const profile = await repository.update(id, { permissions });
    return profile.toDTO();
  }
}

/**
 * Check Profile Permission Use Case
 */
class CheckProfilePermissionUseCase {
  async execute(profileId, menuId, action) {
    const profile = await repository.findById(profileId);
    if (!profile) {
      throw new NotFoundError('Profil non trouvé');
    }

    const entity = new Profile(profile.toObject());
    const hasPermission = entity.hasPermission(menuId, action);

    return {
      hasPermission,
      profileName: profile.name,
      menuId,
      action
    };
  }
}

/**
 * Delete Profile Use Case
 */
class DeleteProfileUseCase {
  async execute(id) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Profil non trouvé');
    }

    // Note: Should check if profile is in use by users before deleting
    // This can be added as a business rule

    await repository.delete(id);
    return { message: 'Profil supprimé avec succès' };
  }
}

module.exports = {
  CreateProfileUseCase,
  GetProfileUseCase,
  GetAllProfilesUseCase,
  GetProfileByNameUseCase,
  UpdateProfileUseCase,
  UpdateProfilePermissionsUseCase,
  CheckProfilePermissionUseCase,
  DeleteProfileUseCase
};
