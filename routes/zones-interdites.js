const express = require('express');
const { protect } = require('../middleware/auth');
const { ZoneInterditController } = require('../src/infrastructure/web/controllers');

const router = express.Router();

// Toutes les routes nécessitent l'authentification (désactivé pour le développement)
// IMPORTANT: Réactiver en production!
// router.use(protect);

// ==================== ZONE INTERDIT ROUTES ====================

// POST /api/zones-interdites - Créer une zone interdite
router.post('/', ZoneInterditController.create);

// GET /api/zones-interdites - Liste toutes les zones interdites
router.get('/', ZoneInterditController.getAll);

// GET /api/zones-interdites/active - Zones interdites actives
router.get('/active', ZoneInterditController.getActive);

// GET /api/zones-interdites/inactive - Zones interdites inactives
router.get('/inactive', ZoneInterditController.getInactive);

// GET /api/zones-interdites/with-coordinates - Zones avec coordonnées
router.get('/with-coordinates', ZoneInterditController.getWithCoordinates);

// GET /api/zones-interdites/with-pays - Zones avec informations pays
router.get('/with-pays', ZoneInterditController.getWithPays);

// GET /api/zones-interdites/:id - Obtenir une zone interdite par ID
router.get('/:id', ZoneInterditController.getById);

// GET /api/zones-interdites/pays/:paysId - Zones interdites par pays
router.get('/pays/:paysId', ZoneInterditController.getByPays);

// PUT /api/zones-interdites/:id - Mettre à jour une zone interdite
router.put('/:id', ZoneInterditController.update);

// PATCH /api/zones-interdites/:id/toggle-status - Activer/Désactiver
router.patch('/:id/toggle-status', ZoneInterditController.toggleStatus);

// DELETE /api/zones-interdites/:id - Supprimer une zone interdite
router.delete('/:id', ZoneInterditController.delete);

module.exports = router;
