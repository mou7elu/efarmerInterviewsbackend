const express = require('express');
const authRoutes = require('./auth');
const geographicRoutes = require('./geographic');
const agriculturalRoutes = require('./agricultural');
const questionnaireRoutes = require('./questionnaire');
const interviewsRoutes = require('./interviews');
const sigRoutes = require('../../../../routes/sig');

const router = express.Router();

// Middleware global pour les APIs
router.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes géographiques (Pays, Districts, Régions)
router.use('/geographic', geographicRoutes);

// Routes agricoles (Producteurs, Parcelles)
router.use('/agricultural', agriculturalRoutes);

// Routes de questionnaire (Volets, Sections, Questions)
router.use('/questionnaire', questionnaireRoutes);

// Routes d'entretiens et autres
router.use('/', interviewsRoutes);

// Route SIG (Système d'Information Géographique)
router.use('/sig', sigRoutes);

// Route de santé pour l'API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API eFarmer Clean Architecture est opérationnelle',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Route pour obtenir la documentation des endpoints
router.get('/endpoints', (req, res) => {
  res.json({
    success: true,
    message: 'Documentation des endpoints disponibles',
    endpoints: {
      health: 'GET /api/health',
      geographic: {
        pays: {
          list: 'GET /api/geographic/pays',
          create: 'POST /api/geographic/pays',
          get: 'GET /api/geographic/pays/:id',
          update: 'PUT /api/geographic/pays/:id',
          updateStatus: 'PATCH /api/geographic/pays/:id/statut',
          delete: 'DELETE /api/geographic/pays/:id',
          stats: 'GET /api/geographic/pays/stats',
          search: 'GET /api/geographic/pays/search/:term'
        },
        districts: {
          list: 'GET /api/geographic/districts',
          create: 'POST /api/geographic/districts',
          get: 'GET /api/geographic/districts/:id',
          update: 'PUT /api/geographic/districts/:id',
          updateStatus: 'PATCH /api/geographic/districts/:id/statut',
          delete: 'DELETE /api/geographic/districts/:id',
          stats: 'GET /api/geographic/districts/stats',
          search: 'GET /api/geographic/districts/search/:term',
          byCountry: 'GET /api/geographic/pays/:paysId/districts',
          countByCountry: 'GET /api/geographic/pays/:paysId/districts/count'
        },
        villages: {
          list: 'GET /api/geographic/villages',
          create: 'POST /api/geographic/villages',
          get: 'GET /api/geographic/villages/:id',
          update: 'PUT /api/geographic/villages/:id',
          delete: 'DELETE /api/geographic/villages/:id',
          stats: 'GET /api/geographic/villages/stats',
          search: 'GET /api/geographic/villages/search/:term'
        }
      },
      agricultural: {
        producteurs: {
          list: 'GET /api/agricultural/producteurs',
          create: 'POST /api/agricultural/producteurs',
          get: 'GET /api/agricultural/producteurs/:id',
          update: 'PUT /api/agricultural/producteurs/:id',
          updateStatus: 'PATCH /api/agricultural/producteurs/:id/status',
          delete: 'DELETE /api/agricultural/producteurs/:id',
          byCode: 'GET /api/agricultural/producteurs/code/:code',
          search: 'GET /api/agricultural/producteurs/search',
          statistics: 'GET /api/agricultural/producteurs/statistics'
        },
        parcelles: {
          list: 'GET /api/agricultural/parcelles',
          create: 'POST /api/agricultural/parcelles',
          get: 'GET /api/agricultural/parcelles/:id',
          update: 'PUT /api/agricultural/parcelles/:id',
          updateGPS: 'PATCH /api/agricultural/parcelles/:id/gps',
          delete: 'DELETE /api/agricultural/parcelles/:id',
          byProducteur: 'GET /api/agricultural/parcelles/producteur/:codeProducteur',
          byLocation: 'GET /api/agricultural/parcelles/location',
          search: 'GET /api/agricultural/parcelles/search',
          statistics: 'GET /api/agricultural/parcelles/statistics'
        }
      },
      questionnaire: {
        volets: {
          list: 'GET /api/questionnaire/volets',
          create: 'POST /api/questionnaire/volets',
          get: 'GET /api/questionnaire/volets/:id',
          update: 'PUT /api/questionnaire/volets/:id',
          delete: 'DELETE /api/questionnaire/volets/:id'
        },
        sections: {
          list: 'GET /api/questionnaire/sections',
          create: 'POST /api/questionnaire/sections',
          get: 'GET /api/questionnaire/sections/:id',
          update: 'PUT /api/questionnaire/sections/:id',
          delete: 'DELETE /api/questionnaire/sections/:id',
          byVolet: 'GET /api/questionnaire/sections/volet/:voletId'
        },
        questions: {
          list: 'GET /api/questionnaire/questions',
          create: 'POST /api/questionnaire/questions',
          get: 'GET /api/questionnaire/questions/:id',
          update: 'PUT /api/questionnaire/questions/:id',
          delete: 'DELETE /api/questionnaire/questions/:id',
          bySection: 'GET /api/questionnaire/questions/section/:sectionId',
          byVolet: 'GET /api/questionnaire/questions/volet/:voletId'
        }
      },
      interviews: {
        list: 'GET /api/interviews',
        create: 'POST /api/interviews',
        get: 'GET /api/interviews/:id',
        update: 'PUT /api/interviews/:id',
        delete: 'DELETE /api/interviews/:id'
          ,
          exportPdf: 'GET /api/interviews/:id/pdf'
      },
      questionnaires: {
        list: 'GET /api/questionnaires',
        get: 'GET /api/questionnaires/:id'
      },
      other: {
        zonesInterdites: {
          list: 'GET /api/zones-interdites',
          get: 'GET /api/zones-interdites/:id',
          create: 'POST /api/zones-interdites',
          update: 'PUT /api/zones-interdites/:id',
          delete: 'DELETE /api/zones-interdites/:id'
        },
        nationalites: {
          list: 'GET /api/nationalites',
          get: 'GET /api/nationalites/:id',
          create: 'POST /api/nationalites',
          update: 'PUT /api/nationalites/:id',
          delete: 'DELETE /api/nationalites/:id'
        },
        niveauxScolaires: {
          list: 'GET /api/niveaux-scolaires',
          get: 'GET /api/niveaux-scolaires/:id',
          create: 'POST /api/niveaux-scolaires',
          update: 'PUT /api/niveaux-scolaires/:id',
          delete: 'DELETE /api/niveaux-scolaires/:id'
        },
        pieces: {
          list: 'GET /api/pieces',
          get: 'GET /api/pieces/:id',
          create: 'POST /api/pieces',
          update: 'PUT /api/pieces/:id',
          delete: 'DELETE /api/pieces/:id'
        },
        users: {
          list: 'GET /api/users',
          get: 'GET /api/users/:id',
          create: 'POST /api/users',
          update: 'PUT /api/users/:id',
          delete: 'DELETE /api/users/:id'
        }
      }
    }
  });
});

// Gestion des routes non trouvées
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint non trouvé',
    path: req.originalUrl,
    availableEndpoints: '/api/endpoints'
  });
});

module.exports = router;