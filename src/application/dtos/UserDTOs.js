/**
 * User DTOs
 * Objets de transfert de données pour les utilisateurs
 */

class CreateUserDTO {
  constructor({ email, password, nomUt, prenomUt, telephone, genre, profileId, isGodMode }) {
    this.email = email;
    this.password = password;
    this.nomUt = nomUt;
    this.prenomUt = prenomUt;
    this.telephone = telephone;
    this.genre = genre;
    this.profileId = profileId;
    this.isGodMode = isGodMode;
  }

  static fromRequest(req) {
    return new CreateUserDTO({
      email: req.body.email,
      password: req.body.password,
      nomUt: req.body.nomUt,
      prenomUt: req.body.prenomUt,
      telephone: req.body.telephone,
      genre: req.body.genre,
      profileId: req.body.profileId,
      isGodMode: req.body.isGodMode
    });
  }
}

class UpdateUserDTO {
  constructor({ nomUt, prenomUt, telephone, genre, profileId }) {
    this.nomUt = nomUt;
    this.prenomUt = prenomUt;
    this.telephone = telephone;
    this.genre = genre;
    this.profileId = profileId;
  }

  static fromRequest(req) {
    return new UpdateUserDTO({
      nomUt: req.body.nomUt,
      prenomUt: req.body.prenomUt,
      telephone: req.body.telephone,
      genre: req.body.genre,
      profileId: req.body.profileId
    });
  }
}

class UserResponseDTO {
  constructor({ id, email, nomUt, prenomUt, fullName, telephone, genre, profileId, isGodMode, sommeil, createdAt, updatedAt, profile }) {
    this.id = id;
    this.email = email;
    this.nomUt = nomUt;
    this.prenomUt = prenomUt;
    this.fullName = fullName;
    this.telephone = telephone;
    this.genre = genre;
    this.profileId = profileId;
    this.isGodMode = isGodMode;
    this.sommeil = sommeil;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.profile = profile;
  }

  static fromEntity(userEntity) {
    const plainObject = userEntity.toPlainObject();
    return new UserResponseDTO(plainObject);
  }

  static fromEntityArray(userEntities) {
    return userEntities.map(entity => UserResponseDTO.fromEntity(entity));
  }
}

class ChangePasswordDTO {
  constructor({ currentPassword, newPassword, confirmPassword }) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
    this.confirmPassword = confirmPassword;
  }

  static fromRequest(req) {
    return new ChangePasswordDTO({
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword
    });
  }

  validate() {
    if (this.newPassword !== this.confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas');
    }
    return true;
  }
}

module.exports = {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
  ChangePasswordDTO
};