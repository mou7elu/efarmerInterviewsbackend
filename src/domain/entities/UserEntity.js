/**
 * User Entity - Domain Layer
 * Représente un utilisateur dans le domaine métier
 */

const BaseEntity = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/DomainErrors');

class UserEntity extends BaseEntity {
  constructor({
    id,
    email,
    password,
    nomUt,
    prenomUt,
    telephone,
    genre,
    profileId,
    isGodMode = false,
    sommeil = false,
    responsableId = null,
    photo = null,
    createdAt,
    updatedAt
  }) {
    super(id);
    
    this._email = email;
    this._password = password;
    this._nomUt = nomUt || '';
    this._prenomUt = prenomUt || '';
    this._telephone = telephone || '';
    this._genre = genre || 0;
    this._profileId = profileId;
    this._isGodMode = isGodMode;
    this._sommeil = sommeil;
    this._responsableId = responsableId;
    this._photo = photo;
    
    if (createdAt) this._createdAt = createdAt;
    if (updatedAt) this._updatedAt = updatedAt;
    
    this.validate();
  }

  // Getters
  get email() { return this._email; }
  get password() { return this._password; }
  get nomUt() { return this._nomUt; }
  get prenomUt() { return this._prenomUt; }
  get fullName() { return `${this._prenomUt} ${this._nomUt}`.trim(); }
  get telephone() { return this._telephone; }
  get genre() { return this._genre; }
  get profileId() { return this._profileId; }
  get isGodMode() { return this._isGodMode; }
  get sommeil() { return this._sommeil; }
  get responsableId() { return this._responsableId; }
  get photo() { return this._photo; }

  // Méthodes métier
  updateProfile(nomUt, prenomUt, telephone, genre) {
    this._nomUt = nomUt || this._nomUt;
    this._prenomUt = prenomUt || this._prenomUt;
    this._telephone = telephone || this._telephone;
    this._genre = genre !== undefined ? genre : this._genre;
    this.updateTimestamp();
  }

  changePassword(newPassword) {
    if (!newPassword || newPassword.length < 6) {
      throw new ValidationError('Le mot de passe doit contenir au moins 6 caractères');
    }
    this._password = newPassword;
    this.updateTimestamp();
  }

  activate() {
    this._sommeil = false;
    this.updateTimestamp();
  }

  deactivate() {
    this._sommeil = true;
    this.updateTimestamp();
  }

  assignProfile(profileId) {
    this._profileId = profileId;
    this.updateTimestamp();
  }

  // Validation
  validate() {
    super.validate();
    
    if (!this._email) {
      throw new ValidationError('Email est obligatoire');
    }
    
    if (!this._email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      throw new ValidationError('Format d\'email invalide');
    }
    
    if (!this._password) {
      throw new ValidationError('Mot de passe est obligatoire');
    }
  }

  // Conversion vers objet simple
  toPlainObject() {
    return {
      ...super.toPlainObject(),
      email: this._email,
      nomUt: this._nomUt,
      prenomUt: this._prenomUt,
      fullName: this.fullName,
      telephone: this._telephone,
      genre: this._genre,
      profileId: this._profileId,
      isGodMode: this._isGodMode,
      sommeil: this._sommeil,
      responsableId: this._responsableId,
      // Note: On n'expose pas le mot de passe
    };
  }
}

module.exports = UserEntity;