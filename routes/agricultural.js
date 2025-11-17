const express = require('express');
const { protect } = require('../middleware/auth');
const { ProducteurController, ParcelleController } = require('../src/infrastructure/web/controllers');

const router = express.Router();

// Toutes les routes nécessitent l'authentification (désactivé pour le développement)
// IMPORTANT: Réactiver en production!
// router.use(protect);

// ==================== PRODUCTEUR ROUTES ====================

// POST /api/agricultural/producteur - Créer un producteur
router.post('/producteur', ProducteurController.create);

// GET /api/agricultural/producteur - Liste tous les producteurs
router.get('/producteur', ProducteurController.getAll);

// GET /api/agricultural/producteur/statistics - Statistiques des producteurs
router.get('/producteur/statistics', ProducteurController.getStatistics);

// GET /api/agricultural/producteur/mobile-money - Producteurs avec mobile money
router.get('/producteur/mobile-money', ProducteurController.getWithMobileMoney);

// GET /api/agricultural/producteur/exploitants - Producteurs exploitants
router.get('/producteur/exploitants', ProducteurController.getExploitants);

// GET /api/agricultural/producteur/:id - Obtenir un producteur par ID
router.get('/producteur/:id', ProducteurController.getById);

// GET /api/agricultural/producteur/menage/:menageId - Producteurs par ménage
router.get('/producteur/menage/:menageId', ProducteurController.getByMenage);

// GET /api/agricultural/producteur/age-range - Producteurs par tranche d'âge (query: minAge, maxAge)
router.get('/producteur/age-range', ProducteurController.getByAgeRange);

// GET /api/agricultural/producteur/gender/:gender - Producteurs par genre
router.get('/producteur/gender/:gender', ProducteurController.getByGender);

// GET /api/agricultural/producteur/nationalite/:nationaliteId - Producteurs par nationalité
router.get('/producteur/nationalite/:nationaliteId', ProducteurController.getByNationalite);

// GET /api/agricultural/producteur/profession/:professionId - Producteurs par profession
router.get('/producteur/profession/:professionId', ProducteurController.getByProfession);

// PUT /api/agricultural/producteur/:id - Mettre à jour un producteur
router.put('/producteur/:id', ProducteurController.update);

// PUT /api/agricultural/producteur/:id/coordinates - Mettre à jour les coordonnées
router.put('/producteur/:id/coordinates', ProducteurController.updateCoordinates);

// PUT /api/agricultural/producteur/:id/contact - Mettre à jour les informations de contact
router.put('/producteur/:id/contact', ProducteurController.updateContact);

// PATCH /api/agricultural/producteur/:id/toggle-status - Activer/Désactiver
router.patch('/producteur/:id/toggle-status', ProducteurController.toggleStatus);

// DELETE /api/agricultural/producteur/:id - Supprimer un producteur
router.delete('/producteur/:id', ProducteurController.delete);

// ==================== PARCELLE ROUTES ====================

// POST /api/agricultural/parcelle - Créer une parcelle
router.post('/parcelle', ParcelleController.create);

// GET /api/agricultural/parcelle - Liste toutes les parcelles
router.get('/parcelle', ParcelleController.getAll);

// GET /api/agricultural/parcelle/statistics - Statistiques des parcelles
router.get('/parcelle/statistics', ParcelleController.getStatistics);

// GET /api/agricultural/parcelle/certified - Parcelles certifiées
router.get('/parcelle/certified', ParcelleController.getCertified);

// GET /api/agricultural/parcelle/varieties - Parcelles avec variétés
router.get('/parcelle/varieties', ParcelleController.getWithVarieties);

// GET /api/agricultural/parcelle/orangers - Parcelles avec orangers
router.get('/parcelle/orangers', ParcelleController.getWithOrangers);

// GET /api/agricultural/parcelle/oldest - Parcelles les plus anciennes (query: limit)
router.get('/parcelle/oldest', ParcelleController.getOldest);

// GET /api/agricultural/parcelle/recent - Parcelles récentes (query: limit)
router.get('/parcelle/recent', ParcelleController.getRecent);

// GET /api/agricultural/parcelle/:id - Obtenir une parcelle par ID
router.get('/parcelle/:id', ParcelleController.getById);

// GET /api/agricultural/parcelle/producteur/:producteurId - Parcelles par producteur
router.get('/parcelle/producteur/:producteurId', ParcelleController.getByProducteur);

// GET /api/agricultural/parcelle/village/:villageId - Parcelles par village
router.get('/parcelle/village/:villageId', ParcelleController.getByVillage);

// GET /api/agricultural/parcelle/zone/:zoneId - Parcelles par zone
router.get('/parcelle/zone/:zoneId', ParcelleController.getByZone);

// GET /api/agricultural/parcelle/type/:type - Parcelles par type
router.get('/parcelle/type/:type', ParcelleController.getByType);

// GET /api/agricultural/parcelle/year/:year - Parcelles par année
router.get('/parcelle/year/:year', ParcelleController.getByYear);

// GET /api/agricultural/parcelle/size-range - Parcelles par superficie (query: minSize, maxSize)
router.get('/parcelle/size-range', ParcelleController.getBySizeRange);

// PUT /api/agricultural/parcelle/:id - Mettre à jour une parcelle
router.put('/parcelle/:id', ParcelleController.update);

// PUT /api/agricultural/parcelle/:id/coordinates - Mettre à jour les coordonnées
router.put('/parcelle/:id/coordinates', ParcelleController.updateCoordinates);

// PUT /api/agricultural/parcelle/:id/production - Mettre à jour la production
router.put('/parcelle/:id/production', ParcelleController.updateProduction);

// PUT /api/agricultural/parcelle/:id/expenses - Mettre à jour les dépenses
router.put('/parcelle/:id/expenses', ParcelleController.updateExpenses);

// PATCH /api/agricultural/parcelle/:id/toggle-certification - Basculer certification
router.patch('/parcelle/:id/toggle-certification', ParcelleController.toggleCertification);

// DELETE /api/agricultural/parcelle/:id - Supprimer une parcelle
router.delete('/parcelle/:id', ParcelleController.delete);

// DELETE /api/agricultural/parcelle/producteur/:producteurId - Supprimer toutes les parcelles d'un producteur
router.delete('/parcelle/producteur/:producteurId', ParcelleController.deleteByProducteur);

module.exports = router;
