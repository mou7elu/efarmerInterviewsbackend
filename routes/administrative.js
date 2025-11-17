const express = require('express');
const { protect } = require('../middleware/auth');
const {
  SousprefController,
  SecteurAdministratifController,
  ZonedenombreController,
  LocaliteController,
  MenageController
} = require('../src/infrastructure/web/controllers');

const router = express.Router();

// Toutes les routes nécessitent l'authentification (désactivé pour le développement)
// IMPORTANT: Réactiver en production!
// router.use(protect);

// ==================== SOUS-PREFECTURE ROUTES ====================

// POST /api/administrative/souspref - Créer une sous-préfecture
router.post('/souspref', SousprefController.create);

// GET /api/administrative/souspref - Liste toutes les sous-préfectures
router.get('/souspref', SousprefController.getAll);

// GET /api/administrative/souspref/:id - Obtenir une sous-préfecture par ID
router.get('/souspref/:id', SousprefController.getById);

// GET /api/administrative/souspref/departement/:departementId - Sous-préfectures par département
router.get('/souspref/departement/:departementId', SousprefController.getByDepartement);

// PUT /api/administrative/souspref/:id - Mettre à jour une sous-préfecture
router.put('/souspref/:id', SousprefController.update);

// DELETE /api/administrative/souspref/:id - Supprimer une sous-préfecture
router.delete('/souspref/:id', SousprefController.delete);

// ==================== SECTEUR ADMINISTRATIF ROUTES ====================

// POST /api/administrative/secteur - Créer un secteur administratif
router.post('/secteur', SecteurAdministratifController.create);

// GET /api/administrative/secteur - Liste tous les secteurs
router.get('/secteur', SecteurAdministratifController.getAll);

// GET /api/administrative/secteur/:id - Obtenir un secteur par ID
router.get('/secteur/:id', SecteurAdministratifController.getById);

// GET /api/administrative/secteur/souspref/:sousprefId - Secteurs par sous-préfecture
router.get('/secteur/souspref/:sousprefId', SecteurAdministratifController.getBySouspref);

// PUT /api/administrative/secteur/:id - Mettre à jour un secteur
router.put('/secteur/:id', SecteurAdministratifController.update);

// DELETE /api/administrative/secteur/:id - Supprimer un secteur
router.delete('/secteur/:id', SecteurAdministratifController.delete);

// ==================== ZONE DE DENOMBREMENT ROUTES ====================

// POST /api/administrative/zone - Créer une zone de dénombrement
router.post('/zone', ZonedenombreController.create);

// GET /api/administrative/zone - Liste toutes les zones
router.get('/zone', ZonedenombreController.getAll);

// GET /api/administrative/zone/:id - Obtenir une zone par ID
router.get('/zone/:id', ZonedenombreController.getById);

// GET /api/administrative/zone/secteur/:secteurId - Zones par secteur administratif
router.get('/zone/secteur/:secteurId', ZonedenombreController.getBySecteurAdministratif);

// PUT /api/administrative/zone/:id - Mettre à jour une zone
router.put('/zone/:id', ZonedenombreController.update);

// DELETE /api/administrative/zone/:id - Supprimer une zone
router.delete('/zone/:id', ZonedenombreController.delete);

// ==================== LOCALITE ROUTES ====================

// POST /api/administrative/localite - Créer une localité
router.post('/localite', LocaliteController.create);

// GET /api/administrative/localite - Liste toutes les localités
router.get('/localite', LocaliteController.getAll);

// GET /api/administrative/localite/:id - Obtenir une localité par ID
router.get('/localite/:id', LocaliteController.getById);

// GET /api/administrative/localite/village/:villageId - Localités par village
router.get('/localite/village/:villageId', LocaliteController.getByVillage);

// PUT /api/administrative/localite/:id - Mettre à jour une localité
router.put('/localite/:id', LocaliteController.update);

// DELETE /api/administrative/localite/:id - Supprimer une localité
router.delete('/localite/:id', LocaliteController.delete);

// ==================== MENAGE ROUTES ====================

// POST /api/administrative/menage - Créer un ménage
router.post('/menage', MenageController.create);

// GET /api/administrative/menage - Liste tous les ménages
router.get('/menage', MenageController.getAll);

// GET /api/administrative/menage/:id - Obtenir un ménage par ID
router.get('/menage/:id', MenageController.getById);

// GET /api/administrative/menage/localite/:localiteId - Ménages par localité
router.get('/menage/localite/:localiteId', MenageController.getByLocalite);

// GET /api/administrative/menage/enqueteur/:enqueteurId - Ménages par enquêteur
router.get('/menage/enqueteur/:enqueteurId', MenageController.getByEnqueteur);

// GET /api/administrative/menage/anacarde - Ménages avec producteurs d'anacarde
router.get('/menage/anacarde', MenageController.getWithAnacardeProducteurs);

// GET /api/administrative/menage/hierarchy - Ménages avec hiérarchie complète
router.get('/menage/hierarchy', MenageController.getWithFullHierarchy);

// PUT /api/administrative/menage/:id - Mettre à jour un ménage
router.put('/menage/:id', MenageController.update);

// DELETE /api/administrative/menage/:id - Supprimer un ménage
router.delete('/menage/:id', MenageController.delete);

module.exports = router;
