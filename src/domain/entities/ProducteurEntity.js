const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');
const { Libelle } = require('../value-objects/Libelle');

/**
 * Entité représentant un producteur (agriculteur) dans le système
 */
class ProducteurEntity extends BaseEntity {
  constructor(data) {
    const {
      id,
      code,
      nom,
      prenom,
      telephone1,
      telephone2,
      dateNaissance,
      lieuNaissance,
      genre,
      photo = null,
      signature = null,
      dateSigne = null,
      cleProdMobi = null,
      sommeil = false,
      createdAt,
      updatedAt
    } = data;

    super(id);
    
    // Validation des champs obligatoires
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      throw new ValidationError('Le code du producteur est requis');
    }

    // Validation du genre (supposé être 1=Homme, 2=Femme, etc.)
    if (genre !== undefined && (typeof genre !== 'number' || genre < 1)) {
      throw new ValidationError('Le genre doit être un nombre valide');
    }

    // Validation des téléphones
    if (telephone1 && typeof telephone1 !== 'string') {
      throw new ValidationError('Le téléphone 1 doit être une chaîne de caractères');
    }

    if (telephone2 && typeof telephone2 !== 'string') {
      throw new ValidationError('Le téléphone 2 doit être une chaîne de caractères');
    }

    // Validation du type sommeil
    if (typeof sommeil !== 'boolean') {
      throw new ValidationError('Le sommeil doit être un booléen');
    }

    this.code = code.trim();
    this.nom = nom ? new Libelle(nom) : null;
    this.prenom = prenom ? new Libelle(prenom) : null;
    this.telephone1 = telephone1;
    this.telephone2 = telephone2;
    this.dateNaissance = dateNaissance ? new Date(dateNaissance) : null;
    this.lieuNaissance = lieuNaissance ? new Libelle(lieuNaissance) : null;
    this.genre = genre;
    this.photo = photo;
    this.signature = signature;
    this.dateSigne = dateSigne ? new Date(dateSigne) : null;
    this.cleProdMobi = cleProdMobi;
    this.sommeil = sommeil;
    
    if (createdAt) this._createdAt = new Date(createdAt);
    if (updatedAt) this._updatedAt = new Date(updatedAt);
  }

  /**
   * Active le producteur
   */
  activer() {
    if (!this.sommeil) {
      return this;
    }

    return new ProducteurEntity({
      id: this.id,
      code: this.code,
      nom: this.nom?.value,
      prenom: this.prenom?.value,
      telephone1: this.telephone1,
      telephone2: this.telephone2,
      dateNaissance: this.dateNaissance,
      lieuNaissance: this.lieuNaissance?.value,
      genre: this.genre,
      photo: this.photo,
      signature: this.signature,
      dateSigne: this.dateSigne,
      cleProdMobi: this.cleProdMobi,
      sommeil: false,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Met en sommeil le producteur
   */
  mettreDormir() {
    if (this.sommeil) {
      return this;
    }

    return new ProducteurEntity({
      id: this.id,
      code: this.code,
      nom: this.nom?.value,
      prenom: this.prenom?.value,
      telephone1: this.telephone1,
      telephone2: this.telephone2,
      dateNaissance: this.dateNaissance,
      lieuNaissance: this.lieuNaissance?.value,
      genre: this.genre,
      photo: this.photo,
      signature: this.signature,
      dateSigne: this.dateSigne,
      cleProdMobi: this.cleProdMobi,
      sommeil: true,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Change le nom du producteur
   */
  changerNom(nouveauNom) {
    const nouveauNomObj = nouveauNom ? new Libelle(nouveauNom) : null;
    
    if (this.nom?.equals(nouveauNomObj)) {
      return this;
    }

    return new ProducteurEntity({
      id: this.id,
      code: this.code,
      nom: nouveauNom,
      prenom: this.prenom?.value,
      telephone1: this.telephone1,
      telephone2: this.telephone2,
      dateNaissance: this.dateNaissance,
      lieuNaissance: this.lieuNaissance?.value,
      genre: this.genre,
      photo: this.photo,
      signature: this.signature,
      dateSigne: this.dateSigne,
      cleProdMobi: this.cleProdMobi,
      sommeil: this.sommeil,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Met à jour les informations de contact
   */
  changerContact(telephone1, telephone2) {
    if (telephone1 && typeof telephone1 !== 'string') {
      throw new ValidationError('Le téléphone 1 doit être une chaîne de caractères');
    }

    if (telephone2 && typeof telephone2 !== 'string') {
      throw new ValidationError('Le téléphone 2 doit être une chaîne de caractères');
    }

    return new ProducteurEntity({
      id: this.id,
      code: this.code,
      nom: this.nom?.value,
      prenom: this.prenom?.value,
      telephone1: telephone1 || this.telephone1,
      telephone2: telephone2 || this.telephone2,
      dateNaissance: this.dateNaissance,
      lieuNaissance: this.lieuNaissance?.value,
      genre: this.genre,
      photo: this.photo,
      signature: this.signature,
      dateSigne: this.dateSigne,
      cleProdMobi: this.cleProdMobi,
      sommeil: this.sommeil,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Obtient le nom complet du producteur
   */
  getNomComplet() {
    const nom = this.nom?.value || '';
    const prenom = this.prenom?.value || '';
    return `${prenom} ${nom}`.trim();
  }

  /**
   * Calcule l'âge du producteur
   */
  getAge() {
    if (!this.dateNaissance) return null;
    
    const today = new Date();
    const birthDate = new Date(this.dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Vérifie si le producteur est actif
   */
  estActif() {
    return !this.sommeil;
  }

  /**
   * Vérifie si le producteur est en sommeil
   */
  estEnSommeil() {
    return this.sommeil;
  }

  /**
   * Obtient le genre sous forme de texte
   */
  getGenreTexte() {
    switch (this.genre) {
      case 1: return 'Homme';
      case 2: return 'Femme';
      default: return 'Non défini';
    }
  }

  /**
   * Convertit vers un DTO
   */
  toDTO() {
    return {
      id: this.id,
      code: this.code,
      nom: this.nom?.value || null,
      prenom: this.prenom?.value || null,
      nomComplet: this.getNomComplet(),
      telephone1: this.telephone1,
      telephone2: this.telephone2,
      dateNaissance: this.dateNaissance?.toISOString() || null,
      lieuNaissance: this.lieuNaissance?.value || null,
      age: this.getAge(),
      genre: this.genre,
      genreTexte: this.getGenreTexte(),
      photo: this.photo ? 'Présente' : null,
      signature: this.signature ? 'Présente' : null,
      dateSigne: this.dateSigne?.toISOString() || null,
      cleProdMobi: this.cleProdMobi,
      sommeil: this.sommeil,
      statut: this.sommeil ? 'Inactif' : 'Actif',
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  /**
   * Convertit vers le format de persistance
   */
  toPersistence() {
    return {
      _id: this.id,
      Code: this.code,
      Nom: this.nom?.value || null,
      Prenom: this.prenom?.value || null,
      Telephone1: this.telephone1,
      Telephone2: this.telephone2,
      Datnais: this.dateNaissance,
      Lieunais: this.lieuNaissance?.value || null,
      Genre: this.genre,
      Photo: this.photo,
      Signature: this.signature,
      Date_signe: this.dateSigne,
      CleProd_mobi: this.cleProdMobi,
      sommeil: this.sommeil,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une nouvelle entité producteur
   */
  static create(data) {
    return new ProducteurEntity({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  /**
   * Crée une entité depuis les données de persistance
   */
  static fromPersistence(data) {
    return new ProducteurEntity({
      id: data._id?.toString() || data.id,
      code: data.Code,
      nom: data.Nom,
      prenom: data.Prenom,
      telephone1: data.Telephone1,
      telephone2: data.Telephone2,
      dateNaissance: data.Datnais,
      lieuNaissance: data.Lieunais,
      genre: data.Genre,
      photo: data.Photo,
      signature: data.Signature,
      dateSigne: data.Date_signe,
      cleProdMobi: data.CleProd_mobi,
      sommeil: data.sommeil || false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { ProducteurEntity };