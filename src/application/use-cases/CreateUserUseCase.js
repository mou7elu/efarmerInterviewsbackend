/**
 * Create User Use Case
 * Cas d'usage pour créer un utilisateur
 */

const BaseUseCase = require('./BaseUseCase');
const UserEntity = require('../../domain/entities/UserEntity');
const Email = require('../../domain/value-objects/Email');
const { ValidationError, DuplicateError } = require('../../shared/errors/DomainErrors');

class CreateUserUseCase extends BaseUseCase {
  constructor(userRepository, passwordService) {
    super();
    this.userRepository = userRepository;
    this.passwordService = passwordService;
  }

  async execute(input) {
    try {
      this.validateInput(input);
      
      const { email, password, nomUt, prenomUt, telephone, genre, profileId, isGodMode } = input;

      // Vérifier si l'email existe déjà
      const emailVO = new Email(email);
      const existingUser = await this.userRepository.findByEmail(emailVO.value);
      if (existingUser) {
        throw new DuplicateError('Utilisateur', 'email', email);
      }

      // Valider et hacher le mot de passe
      const hashedPassword = await this.passwordService.hashPassword(password);

      // Créer l'entité utilisateur
      const userEntity = new UserEntity({
        email: emailVO.value,
        password: hashedPassword,
        nomUt,
        prenomUt,
        telephone,
        genre,
        profileId,
        isGodMode: isGodMode || false,
        sommeil: false
      });

      // Sauvegarder en base
      const savedUser = await this.userRepository.create(userEntity);

      this.log('info', 'Utilisateur créé avec succès', { 
        userId: savedUser.id, 
        email: savedUser.email 
      });

      // Retourner sans le mot de passe
      return savedUser.toPlainObject();

    } catch (error) {
      this.handleError(error, { input: { ...input, password: '[REDACTED]' } });
    }
  }

  validateInput(input) {
    if (!input) {
      throw new ValidationError('Input requis');
    }

    const { email, password, nomUt, prenomUt } = input;

    if (!email) {
      throw new ValidationError('Email requis', 'email');
    }

    if (!password) {
      throw new ValidationError('Mot de passe requis', 'password');
    }

    if (!nomUt || nomUt.trim().length === 0) {
      throw new ValidationError('Nom requis', 'nomUt');
    }

    if (!prenomUt || prenomUt.trim().length === 0) {
      throw new ValidationError('Prénom requis', 'prenomUt');
    }

    return true;
  }
}

module.exports = CreateUserUseCase;