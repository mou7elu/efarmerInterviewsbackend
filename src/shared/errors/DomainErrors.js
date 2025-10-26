/**
 * Custom Domain Errors
 * Hiérarchie d'erreurs pour le domaine métier
 */

class DomainError extends Error {
  constructor(message, code = 'DOMAIN_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date().toISOString();
    
    // Capture la stack trace si disponible
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp
    };
  }
}

class ValidationError extends DomainError {
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR');
    this.field = field;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      field: this.field
    };
  }
}

class BusinessLogicError extends DomainError {
  constructor(message) {
    super(message, 'BUSINESS_LOGIC_ERROR');
  }
}

class NotFoundError extends DomainError {
  constructor(resource, identifier = null) {
    const message = identifier 
      ? `${resource} avec l'identifiant '${identifier}' non trouvé`
      : `${resource} non trouvé`;
    super(message, 'NOT_FOUND_ERROR');
    this.resource = resource;
    this.identifier = identifier;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      resource: this.resource,
      identifier: this.identifier
    };
  }
}

class DuplicateError extends DomainError {
  constructor(resource, field, value) {
    super(`${resource} avec ${field} '${value}' existe déjà`, 'DUPLICATE_ERROR');
    this.resource = resource;
    this.field = field;
    this.value = value;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      resource: this.resource,
      field: this.field,
      value: this.value
    };
  }
}

class AuthorizationError extends DomainError {
  constructor(message = 'Action non autorisée') {
    super(message, 'AUTHORIZATION_ERROR');
  }
}

class AuthenticationError extends DomainError {
  constructor(message = 'Authentification requise') {
    super(message, 'AUTHENTICATION_ERROR');
  }
}

module.exports = {
  DomainError,
  ValidationError,
  BusinessLogicError,
  NotFoundError,
  DuplicateError,
  AuthorizationError,
  AuthenticationError
};