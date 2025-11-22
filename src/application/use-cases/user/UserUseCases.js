const UserRepository = require('../../../infrastructure/repositories/UserRepository');
const User = require('../../../domain/entities/User');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const bcrypt = require('bcrypt');

const repository = new UserRepository();

/**
 * Helper function to convert user to DTO
 * Handles both Mongoose documents with toDTO method and plain objects
 */
const userToDTO = (u) => {
  if (!u) return null;
  
  // Si toDTO existe en tant que fonction, l'utiliser
  if (typeof u.toDTO === 'function') {
    return u.toDTO();
  }
  
  // Sinon créer le DTO manuellement - s'assurer que tous les champs sont présents
  return {
    id: u._id,
    email: u.email || '',
    code_ut: u.code_ut || '',
    Nom_ut: u.Nom_ut || '',
    Pren_ut: u.Pren_ut || '',
    Tel: u.Tel || '',
    Genre: u.Genre !== undefined ? u.Genre : 0,
    profileId: u.profileId || null,
    isGodMode: u.isGodMode || false,
    Sommeil: u.Sommeil !== undefined ? u.Sommeil : false,
    ResponsableId: u.ResponsableId || null,
    Photo: u.Photo || null,
    createdAt: u.createdAt || null,
    updatedAt: u.updatedAt || null
  };
};

/**
 * Create User Use Case
 */
class CreateUserUseCase {
  async execute(data) {
    const entity = new User(data);
    const validation = entity.validate();
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    // Check if email already exists
    const emailExists = await repository.emailExists(data.email);
    if (emailExists) {
      throw new ValidationError('Un utilisateur avec cet email existe déjà');
    }

    // Générer un code_ut unique si non fourni
    if (!data.code_ut) {
      const generateCodeUt = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 4; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
      };

      data.code_ut = generateCodeUt();
      // Vérifier l'unicité du code
      const UserModel = require('../../../models/User');
      while (await UserModel.findOne({ code_ut: data.code_ut })) {
        data.code_ut = generateCodeUt();
      }
    }

    const user = await repository.create(data);
    return userToDTO(user);
  }
}

/**
 * Get User By ID Use Case
 */
class GetUserUseCase {
  async execute(id) {
    const user = await repository.findById(id);
    if (!user) {
      throw new NotFoundError('Utilisateur non trouvé');
    }
    return userToDTO(user);
  }
}

/**
 * Get All Users Use Case
 */
class GetAllUsersUseCase {
  async execute(queryParams = {}) {
    // Séparer les paramètres de pagination/tri des filtres réels
    const { limit, skip, sort, populate, ...filters } = queryParams;
    
    const options = {};
    if (limit) options.limit = parseInt(limit, 10);
    if (skip) options.skip = parseInt(skip, 10);
    if (sort) options.sort = sort;
    if (populate) options.populate = populate;
    
    const users = await repository.findAll(filters, options);
    return users.map(u => userToDTO(u));
  }
}

/**
 * Get User By Email Use Case
 */
class GetUserByEmailUseCase {
  async execute(email) {
    const user = await repository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('Utilisateur non trouvé');
    }
    return userToDTO(user);
  }
}

/**
 * Get Active Users Use Case
 */
class GetActiveUsersUseCase {
  async execute() {
    const users = await repository.findActive();
    return users.map(u => userToDTO(u));
  }
}

/**
 * Get Inactive Users Use Case
 */
class GetInactiveUsersUseCase {
  async execute() {
    const users = await repository.findInactive();
    return users.map(u => userToDTO(u));
  }
}

/**
 * Get God Mode Users Use Case
 */
class GetGodModeUsersUseCase {
  async execute() {
    const users = await repository.findGodModeUsers();
    return users.map(u => userToDTO(u));
  }
}

/**
 * Get Users By Profile Use Case
 */
class GetUsersByProfileUseCase {
  async execute(profileId) {
    const users = await repository.findByProfileId(profileId);
    return users.map(u => userToDTO(u));
  }
}

/**
 * Get Users By Responsable Use Case
 */
class GetUsersByResponsableUseCase {
  async execute(responsableId) {
    const users = await repository.findByResponsableId(responsableId);
    return users.map(u => userToDTO(u));
  }
}

/**
 * Get Users With Profile Use Case
 */
class GetUsersWithProfileUseCase {
  async execute() {
    const users = await repository.getAllWithProfile();
    return users.map(u => userToDTO(u));
  }
}

/**
 * Update User Use Case
 */
class UpdateUserUseCase {
  async execute(id, data) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Utilisateur non trouvé');
    }

    // Don't allow password in regular update
    if (data.password) {
      delete data.password;
    }

    // Check if email already exists for another user
    if (data.email && data.email !== existing.email) {
      const emailExists = await repository.emailExists(data.email, id);
      if (emailExists) {
        throw new ValidationError('Un utilisateur avec cet email existe déjà');
      }
    }

    // Préparer les données de mise à jour
    // Note: BaseRepository.update() passe directement à MongoDB, donc on utilise les noms de champs MongoDB
    const updateData = {
      email: data.email || existing.email,
      Nom_ut: data.Nom_ut !== undefined ? data.Nom_ut : existing.Nom_ut,
      Pren_ut: data.Pren_ut !== undefined ? data.Pren_ut : existing.Pren_ut,
      Tel: data.Tel !== undefined ? data.Tel : existing.Tel,
      Genre: data.Genre !== undefined ? data.Genre : existing.Genre,
      profileId: data.profileId !== undefined ? data.profileId : existing.profileId,
      isGodMode: data.isGodMode !== undefined ? data.isGodMode : existing.isGodMode,
      Sommeil: data.Sommeil !== undefined ? data.Sommeil : existing.Sommeil,
      ResponsableId: data.ResponsableId !== undefined ? data.ResponsableId : existing.ResponsableId,
      Photo: data.Photo !== undefined ? data.Photo : existing.Photo
    };

    console.log('UpdateUserUseCase - data.Tel:', data.Tel);
    console.log('UpdateUserUseCase - existing.Tel:', existing.Tel);
    console.log('UpdateUserUseCase - updateData.Tel:', updateData.Tel);

    const user = await repository.update(id, updateData);
    return userToDTO(user);
  }
}

/**
 * Change Password Use Case
 */
class ChangePasswordUseCase {
  async execute(id, oldPassword, newPassword) {
    const user = await repository.findById(id);
    if (!user) {
      throw new NotFoundError('Utilisateur non trouvé');
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new ValidationError('Mot de passe actuel incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await repository.update(id, { password: hashedPassword });
    return { message: 'Mot de passe modifié avec succès' };
  }
}

/**
 * Toggle User Status Use Case (Activate/Deactivate)
 */
class ToggleUserStatusUseCase {
  async execute(id) {
    const user = await repository.findById(id);
    if (!user) {
      throw new NotFoundError('Utilisateur non trouvé');
    }

    const newStatus = !user.Sommeil;
    await repository.update(id, { Sommeil: newStatus });
    
    return { 
      message: newStatus ? 'Utilisateur désactivé' : 'Utilisateur activé',
      isActive: !newStatus
    };
  }
}

/**
 * Delete User Use Case
 */
class DeleteUserUseCase {
  async execute(id) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Utilisateur non trouvé');
    }

    await repository.delete(id);
    return { message: 'Utilisateur supprimé avec succès' };
  }
}

module.exports = {
  CreateUserUseCase,
  GetUserUseCase,
  GetAllUsersUseCase,
  GetUserByEmailUseCase,
  GetActiveUsersUseCase,
  GetInactiveUsersUseCase,
  GetGodModeUsersUseCase,
  GetUsersByProfileUseCase,
  GetUsersByResponsableUseCase,
  GetUsersWithProfileUseCase,
  UpdateUserUseCase,
  ChangePasswordUseCase,
  ToggleUserStatusUseCase,
  DeleteUserUseCase
};
