const express = require('express');
const helmet = require('helmet');
const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler, validateJsonContent } = require('./middleware/errorHandler');

/**
 * Serveur Express avec Clean Architecture et CORS fonctionnel
 */
class ExpressServer {
  constructor() {
    this.app = express();
    this.allowedOrigins = [
      'https://efarmerinterviews.netlify.app', // Production
      'http://localhost:3000' // Développement
    ];

    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Configuration des middlewares globaux
   */
  setupMiddleware() {
    // Sécurité HTTP
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"]
          }
        }
      })
    );

    // Parsing du JSON et URL-encoded
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // CORS avec gestion des préflights
const allowedOrigins = [
  'https://efarmerinterviews.netlify.app',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Autorise les requêtes sans origin (ex: Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS non autorisé pour cet origin'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Pour les OPTIONS préflight
app.options('*', cors(corsOptions));

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

    // Headers personnalisés
    this.app.use((req, res, next) => {
      res.setHeader('X-API-Version', '1.0.0');
      res.setHeader('X-Powered-By', 'eFarmer Clean Architecture');
      next();
    });
  }

  /**
   * Routes
   */
  setupRoutes() {
    // Health check
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

    // API routes
    this.app.use('/api', apiRoutes);

    // Root
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
   * Gestion des erreurs
   */
  setupErrorHandling() {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);

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
   * Démarrer le serveur
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
   * Arrêter le serveur
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
   * Instance Express
   */
  getApp() {
    return this.app;
  }
}

module.exports = { ExpressServer };
