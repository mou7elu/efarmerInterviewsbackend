/**
 * Base Entity Class
 * Implémente les principes SOLID - Single Responsibility
 */

class BaseEntity {
  constructor(id = null) {
    this._id = id;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  // Méthode pour mettre à jour le timestamp
  updateTimestamp() {
    this._updatedAt = new Date();
  }

  // Méthode pour valider l'entité
  validate() {
    // Méthode de base - peut être surchargée par les entités filles
    return true;
  }

  // Méthode d'égalité basée sur l'ID
  equals(other) {
    if (!other || !(other instanceof BaseEntity)) {
      return false;
    }
    return this._id === other._id;
  }

  // Conversion en objet simple (sans méthodes)
  toPlainObject() {
    return {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}

module.exports = { BaseEntity };