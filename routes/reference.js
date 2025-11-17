const express = require('express');
const { protect } = require('../middleware/auth');
const { ReferenceController } = require('../src/infrastructure/web/controllers');

const router = express.Router();

// Toutes les routes nécessitent l'authentification (désactivé pour le développement)
// IMPORTANT: Réactiver en production!
// router.use(protect);

// ==================== PROFESSION ROUTES ====================

// POST /api/reference/profession - Créer une profession
router.post('/profession', ReferenceController.createProfession);

// GET /api/reference/profession - Liste toutes les professions
router.get('/profession', ReferenceController.getAllProfessions);

// GET /api/reference/profession/:id - Obtenir une profession par ID
router.get('/profession/:id', ReferenceController.getProfessionById);

// PUT /api/reference/profession/:id - Mettre à jour une profession
router.put('/profession/:id', ReferenceController.updateProfession);

// DELETE /api/reference/profession/:id - Supprimer une profession
router.delete('/profession/:id', ReferenceController.deleteProfession);

// ==================== NATIONALITE ROUTES ====================

// POST /api/reference/nationalite - Créer une nationalité
router.post('/nationalite', ReferenceController.createNationalite);

// GET /api/reference/nationalite - Liste toutes les nationalités
router.get('/nationalite', ReferenceController.getAllNationalites);

// GET /api/reference/nationalite/:id - Obtenir une nationalité par ID
router.get('/nationalite/:id', ReferenceController.getNationaliteById);

// PUT /api/reference/nationalite/:id - Mettre à jour une nationalité
router.put('/nationalite/:id', ReferenceController.updateNationalite);

// DELETE /api/reference/nationalite/:id - Supprimer une nationalité
router.delete('/nationalite/:id', ReferenceController.deleteNationalite);

// ==================== NIVEAU SCOLAIRE ROUTES ====================

// POST /api/reference/niveau-scolaire - Créer un niveau scolaire
router.post('/niveau-scolaire', ReferenceController.createNiveauScolaire);

// GET /api/reference/niveau-scolaire - Liste tous les niveaux scolaires
router.get('/niveau-scolaire', ReferenceController.getAllNiveauxScolaires);

// GET /api/reference/niveau-scolaire/:id - Obtenir un niveau scolaire par ID
router.get('/niveau-scolaire/:id', ReferenceController.getNiveauScolaireById);

// PUT /api/reference/niveau-scolaire/:id - Mettre à jour un niveau scolaire
router.put('/niveau-scolaire/:id', ReferenceController.updateNiveauScolaire);

// DELETE /api/reference/niveau-scolaire/:id - Supprimer un niveau scolaire
router.delete('/niveau-scolaire/:id', ReferenceController.deleteNiveauScolaire);

// ==================== PIECE ROUTES ====================

// POST /api/reference/piece - Créer un type de pièce
router.post('/piece', ReferenceController.createPiece);

// GET /api/reference/piece - Liste tous les types de pièces
router.get('/piece', ReferenceController.getAllPieces);

// GET /api/reference/piece/:id - Obtenir un type de pièce par ID
router.get('/piece/:id', ReferenceController.getPieceById);

// PUT /api/reference/piece/:id - Mettre à jour un type de pièce
router.put('/piece/:id', ReferenceController.updatePiece);

// DELETE /api/reference/piece/:id - Supprimer un type de pièce
router.delete('/piece/:id', ReferenceController.deletePiece);

module.exports = router;
