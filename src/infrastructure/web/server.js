const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler, validateJsonContent } = require('./middleware/errorHandler');

/**
 * Configuration et initialisation du serveur Express avec Clean Architecture
 */
class ExpressServer {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Configuration des middlewares globaux
   */
  setupMiddleware() {
    // Sécurité
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"]
        }
      }
    }));

    // CORS
    // this.app.use(cors({
    //   origin: true,
    //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    //   credentials: true
    // }));
    this.app.use(cors());
// For preflight requests
this.app.options('*', cors());
    // Rate limiting - Désactivé pour le développement
    // const limiter = rateLimit({
    //   windowMs: 15 * 60 * 1000, // 15 minutes
    //   max: 100, // Limite chaque IP à 100 requêtes par windowMs
    //   message: {
    //     success: false,
    //     error: 'RATE_LIMIT_EXCEEDED',
    //     message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
    //   },
    //   standardHeaders: true,
    //   legacyHeaders: false
    // });
    // this.app.use('/api/', limiter);

    // Parsing du JSON
    this.app.use(express.json({ 
      limit: '10mb',
      verify: (req, res, buf, encoding) => {
        try {
          JSON.parse(buf);
        } catch (e) {
          const error = new SyntaxError('Invalid JSON');
          error.status = 400;
          error.body = buf;
          throw error;
        }
      }
    }));

    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Validation du contenu JSON
    this.app.use(validateJsonContent);

    // Logging des requêtes en développement
    if (process.env.NODE_ENV === 'development') {
      this.app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
        if (req.body && Object.keys(req.body).length > 0) {
          console.log('Body:', JSON.stringify(req.body, null, 2));
        }
        next();
      });
    }

    // Headers de réponse personnalisés
    this.app.use((req, res, next) => {
      res.setHeader('X-API-Version', '1.0.0');
      res.setHeader('X-Powered-By', 'eFarmer Clean Architecture');
      next();
    });
  }

  /**
   * Configuration des routes
   */
  setupRoutes() {
    // Route de santé du serveur
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'Serveur eFarmer opérationnel',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
      });
    });

    // Routes API principales
    this.app.use('/api', apiRoutes);

    // Route racine
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Bienvenue sur l\'API eFarmer avec Clean Architecture',
        documentation: '/api/endpoints',
        health: '/health',
        version: '1.0.0'
      });
    });
  }

  /**
   * Configuration de la gestion des erreurs
   */
  setupErrorHandling() {
    // Gestion des routes non trouvées
    this.app.use(notFoundHandler);

    // Gestion globale des erreurs
    this.app.use(errorHandler);

    // Gestion des erreurs non capturées
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }

  /**
   * Démarre le serveur
   */
  start(port = process.env.PORT || 3001) {
    return new Promise((resolve, reject) => {
      try {
        const server = this.app.listen(port, () => {
          console.log(`🚀 Serveur eFarmer démarré sur le port ${port}`);
          console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
          console.log(`🏥 Health check: http://localhost:${port}/health`);
          console.log(`📖 Documentation: http://localhost:${port}/api/endpoints`);
          console.log(`🌐 API Base URL: http://localhost:${port}/api`);
          resolve(server);
        });

        server.on('error', (error) => {
          if (error.code === 'EADDRINUSE') {
            console.error(`❌ Le port ${port} est déjà utilisé`);
          } else {
            console.error('❌ Erreur du serveur:', error);
          }
          reject(error);
        });

      } catch (error) {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        reject(error);
      }
    });
  }

  /**
   * Arrête le serveur proprement
   */
  stop(server) {
    return new Promise((resolve) => {
      if (server) {
        server.close(() => {
          console.log('🛑 Serveur arrêté proprement');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Obtient l'instance Express
   */
  getApp() {
    return this.app;
  }
}

module.exports = { ExpressServer };