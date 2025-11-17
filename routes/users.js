const express = require('express');
const { protect } = require('../middleware/auth');
const { UserController, ProfileController } = require('../src/infrastructure/web/controllers');

const router = express.Router();

// Middleware d'authentification pour toutes les routes (désactivé pour le développement)
// router.use(protect);

// ==================== USER ROUTES ====================

// GET /api/users - Récupérer tous les utilisateurs
router.get('/', UserController.getAll);

// GET /api/users/active - Récupérer les utilisateurs actifs
router.get('/active', UserController.getActive);

// GET /api/users/inactive - Récupérer les utilisateurs inactifs
router.get('/inactive', UserController.getInactive);

// GET /api/users/:id - Récupérer un utilisateur spécifique
router.get('/:id', UserController.getById);

// GET /api/users/profile/:profileId - Récupérer les utilisateurs par profil
router.get('/profile/:profileId', UserController.getByProfile);

// GET /api/users/responsable/:responsableId - Récupérer les utilisateurs par responsable
router.get('/responsable/:responsableId', UserController.getByResponsable);

// POST /api/users - Créer un nouvel utilisateur
router.post('/', UserController.create);

// PUT /api/users/:id - Mettre à jour un utilisateur 
router.put('/:id', UserController.update);

// PUT /api/users/:id/password - Mettre à jour le mot de passe (admin)
router.put('/:id/password', UserController.updatePassword);

// PUT /api/users/:id/profile - Changer le profil d'un utilisateur
router.put('/:id/profile', UserController.updateProfile);

// PATCH /api/users/:id/toggle-status - Activer/Désactiver un utilisateur
router.patch('/:id/toggle-status', UserController.toggleStatus);

// POST /api/users/:id/change-password - Changer son propre mot de passe
router.post('/:id/change-password', UserController.changePassword);

// DELETE /api/users/:id - Supprimer un utilisateur
router.delete('/:id', UserController.delete);

// DELETE /api/users/profile/:profileId - Supprimer tous les utilisateurs d'un profil
router.delete('/profile/:profileId', UserController.deleteByProfile);

// ==================== PROFILE ROUTES ====================

// GET /api/users/profiles - Récupérer tous les profils
router.get('/profiles', ProfileController.getAll);

// GET /api/users/profiles/:id - Récupérer un profil spécifique
router.get('/profiles/:id', ProfileController.getById);

// GET /api/users/profiles/permission/:permission - Profils avec une permission spécifique
router.get('/profiles/permission/:permission', ProfileController.getWithPermission);

// GET /api/users/profiles/:id/check/:permission - Vérifier si un profil a une permission
router.get('/profiles/:id/check/:permission', ProfileController.checkPermission);

// POST /api/users/profiles - Créer un nouveau profil
router.post('/profiles', ProfileController.create);

// PUT /api/users/profiles/:id - Mettre à jour un profil
router.put('/profiles/:id', ProfileController.update);

// PUT /api/users/profiles/:id/permissions - Mettre à jour les permissions
router.put('/profiles/:id/permissions', ProfileController.updatePermissions);

// DELETE /api/users/profiles/:id - Supprimer un profil
router.delete('/profiles/:id', ProfileController.delete);

module.exports = router;