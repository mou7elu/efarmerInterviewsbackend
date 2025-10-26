/**
 * Question Code Value Object
 * Assure l'immutabilité et la validation des codes de questions
 */

const { ValidationError } = require('../../shared/errors/DomainErrors');

class QuestionCode {
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
      throw new ValidationError('Code de question ne peut pas être vide');
    }

    // Format: Q001, Q002, etc.
    const codeRegex = /^Q\d{3}$/;
    if (!codeRegex.test(this._value)) {
      throw new ValidationError('Format de code de question invalide (attendu: Q001, Q002, etc.)');
    }
  }

  getNumericPart() {
    return parseInt(this._value.substring(1));
  }

  getNext() {
    const currentNumber = this.getNumericPart();
    const nextNumber = currentNumber + 1;
    const nextCode = `Q${nextNumber.toString().padStart(3, '0')}`;
    return new QuestionCode(nextCode);
  }

  getPrevious() {
    const currentNumber = this.getNumericPart();
    if (currentNumber <= 1) {
      throw new ValidationError('Pas de question précédente pour Q001');
    }
    const prevNumber = currentNumber - 1;
    const prevCode = `Q${prevNumber.toString().padStart(3, '0')}`;
    return new QuestionCode(prevCode);
  }

  equals(other) {
    if (!(other instanceof QuestionCode)) {
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

module.exports = QuestionCode;