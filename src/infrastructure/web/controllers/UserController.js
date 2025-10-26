/**
 * User Controller
 * Contrôleur pour la gestion des utilisateurs
 */

const BaseController = require('./BaseController');
const { CreateUserDTO, UpdateUserDTO, UserResponseDTO, ChangePasswordDTO } = require('../../../application/dtos/UserDTOs');

class UserController extends BaseController {
  constructor(createUserUseCase, getUserUseCase, updateUserUseCase, deleteUserUseCase, changePasswordUseCase, listUsersUseCase) {
    super();
    this.createUserUseCase = createUserUseCase;
    this.getUserUseCase = getUserUseCase;
    this.updateUserUseCase = updateUserUseCase;
    this.deleteUserUseCase = deleteUserUseCase;
    this.changePasswordUseCase = changePasswordUseCase;
    this.listUsersUseCase = listUsersUseCase;
  }

  /**
   * Créer un nouvel utilisateur
   * POST /api/users
   */
  create = this.asyncHandler(async (req, res) => {
    // Validation des champs requis
    this.validateRequiredParams(req, ['email', 'password', 'nomUt', 'prenomUt']);

    // Créer le DTO à partir de la requête
    const createUserDTO = CreateUserDTO.fromRequest(req);
    
    // Exécuter le cas d'usage
    const user = await this.createUserUseCase.execute(createUserDTO);
    
    // Nettoyer et renvoyer la réponse
    const responseDTO = UserResponseDTO.fromEntity(user);
    const sanitizedUser = this.sanitizeOutput(responseDTO);
    
    return this.handleSuccess(res, sanitizedUser, 'Utilisateur créé avec succès', 201);
  });

  /**
   * Récupérer un utilisateur par ID
   * GET /api/users/:id
   */
  getById = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('ID utilisateur requis');
    }

    const user = await this.getUserUseCase.execute({ id });
    const responseDTO = UserResponseDTO.fromEntity(user);
    const sanitizedUser = this.sanitizeOutput(responseDTO);
    
    return this.handleSuccess(res, sanitizedUser, 'Utilisateur récupéré avec succès');
  });

  /**
   * Mettre à jour un utilisateur
   * PUT /api/users/:id
   */
  update = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('ID utilisateur requis');
    }

    // Vérifier les permissions (un utilisateur ne peut modifier que son propre profil sauf admin)
    const currentUserId = this.getCurrentUserId(req);
    if (currentUserId !== id && !req.user.isGodMode) {
      throw new AuthorizationError('Vous ne pouvez modifier que votre propre profil');
    }

    const updateUserDTO = UpdateUserDTO.fromRequest(req);
    
    const user = await this.updateUserUseCase.execute({ id, ...updateUserDTO });
    const responseDTO = UserResponseDTO.fromEntity(user);
    const sanitizedUser = this.sanitizeOutput(responseDTO);
    
    return this.handleSuccess(res, sanitizedUser, 'Utilisateur mis à jour avec succès');
  });

  /**
   * Supprimer un utilisateur
   * DELETE /api/users/:id
   */
  delete = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('ID utilisateur requis');
    }

    // Vérifier les permissions (seuls les admin peuvent supprimer)
    this.checkPermission(req, 'DELETE_USER');

    await this.deleteUserUseCase.execute({ id });
    
    return this.handleSuccess(res, null, 'Utilisateur supprimé avec succès', 204);
  });

  /**
   * Lister les utilisateurs avec pagination et filtres
   * GET /api/users
   */
  list = this.asyncHandler(async (req, res) => {
    const { page, limit, offset } = this.getPaginationParams(req);
    const { search, profileId, active } = req.query;

    const filters = {};
    if (search) filters.search = search;
    if (profileId) filters.profileId = profileId;
    if (active !== undefined) filters.active = active === 'true';

    const result = await this.listUsersUseCase.execute({
      filters,
      pagination: { page, limit, offset }
    });

    const responseData = {
      users: UserResponseDTO.fromEntityArray(result.users).map(user => this.sanitizeOutput(user)),
      total: result.total
    };

    return this.handlePaginatedSuccess(
      res, 
      responseData.users, 
      { page, limit, total: result.total },
      'Utilisateurs récupérés avec succès'
    );
  });

  /**
   * Changer le mot de passe
   * POST /api/users/:id/change-password
   */
  changePassword = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('ID utilisateur requis');
    }

    // Vérifier les permissions
    const currentUserId = this.getCurrentUserId(req);
    if (currentUserId !== id && !req.user.isGodMode) {
      throw new AuthorizationError('Vous ne pouvez changer que votre propre mot de passe');
    }

    this.validateRequiredParams(req, ['currentPassword', 'newPassword', 'confirmPassword']);
    
    const changePasswordDTO = ChangePasswordDTO.fromRequest(req);
    changePasswordDTO.validate(); // Vérifier que les mots de passe correspondent

    await this.changePasswordUseCase.execute({
      userId: id,
      currentPassword: changePasswordDTO.currentPassword,
      newPassword: changePasswordDTO.newPassword
    });
    
    return this.handleSuccess(res, null, 'Mot de passe changé avec succès');
  });

  /**
   * Activer un utilisateur
   * POST /api/users/:id/activate
   */
  activate = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('ID utilisateur requis');
    }

    // Vérifier les permissions
    this.checkPermission(req, 'MANAGE_USERS');

    const user = await this.activateUserUseCase.execute({ id });
    const responseDTO = UserResponseDTO.fromEntity(user);
    const sanitizedUser = this.sanitizeOutput(responseDTO);
    
    return this.handleSuccess(res, sanitizedUser, 'Utilisateur activé avec succès');
  });

  /**
   * Désactiver un utilisateur
   * POST /api/users/:id/deactivate
   */
  deactivate = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('ID utilisateur requis');
    }

    // Vérifier les permissions
    this.checkPermission(req, 'MANAGE_USERS');

    const user = await this.deactivateUserUseCase.execute({ id });
    const responseDTO = UserResponseDTO.fromEntity(user);
    const sanitizedUser = this.sanitizeOutput(responseDTO);
    
    return this.handleSuccess(res, sanitizedUser, 'Utilisateur désactivé avec succès');
  });

  /**
   * Récupérer le profil de l'utilisateur connecté
   * GET /api/users/me
   */
  getProfile = this.asyncHandler(async (req, res) => {
    const currentUserId = this.getCurrentUserId(req);
    
    const user = await this.getUserUseCase.execute({ id: currentUserId });
    const responseDTO = UserResponseDTO.fromEntity(user);
    const sanitizedUser = this.sanitizeOutput(responseDTO);
    
    return this.handleSuccess(res, sanitizedUser, 'Profil récupéré avec succès');
  });
}

module.exports = UserController;