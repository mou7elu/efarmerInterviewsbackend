/**
 * Email Value Object
 * Assure l'immutabilité et la validation des emails
 */

const { ValidationError } = require('../../shared/errors/DomainErrors');

class Email {
  constructor(value) {
    this._value = value;
    this._validate();
    Object.freeze(this); // Immutabilité
  }

  get value() {
    return this._value;
  }

  _validate() {
    if (!this._value) {
      throw new ValidationError('Email ne peut pas être vide');
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(this._value)) {
      throw new ValidationError('Format d\'email invalide');
    }
  }

  equals(other) {
    if (!(other instanceof Email)) {
      return false;
    }
    return this._value === other._value;
  }

  toString() {
    return this._value;
  }

  toJSON() {
    return this._value;
  }
}

module.exports = Email;