require('dotenv').config();
const { ExpressServer } = require('./src/infrastructure/web/server');
const mongoose = require('mongoose');

/**
 * Point d'entrée principal de l'application eFarmer Backend
 */
class Application {
  constructor() {
    this.server = null;
    this.expressServer = null;
  }

  /**
   * Initialise et démarre l'application
   */
  async start() {
    try {
      console.log('🚀 Démarrage de l\'application eFarmer Backend...');
      
      // Connexion à la base de données
      await this.connectDatabase();
      
      // Initialisation du serveur Express
      this.expressServer = new ExpressServer();
      
      // Démarrage du serveur
      const port = process.env.PORT || 3001;
      this.server = await this.expressServer.start(port);
      
      console.log('✅ Application eFarmer Backend démarrée avec succès');
      console.log(`📍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API disponible sur: http://localhost:${port}/api`);
      
    } catch (error) {
      console.error('❌ Erreur lors du démarrage de l\'application:', error);
      await this.shutdown();
      process.exit(1);
    }
  }

  /**
   * Connexion à la base de données MongoDB
   */
  async connectDatabase() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer';
      
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      
      console.log('✅ Connexion à MongoDB établie');
      console.log(`📊 Base de données: ${mongoose.connection.name}`);
      
      // Gestion des événements de connexion
      mongoose.connection.on('error', (error) => {
        console.error('❌ Erreur MongoDB:', error);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB déconnecté');
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnecté');
      });
      
    } catch (error) {
      console.error('❌ Erreur de connexion à MongoDB:', error);
      throw error;
    }
  }

  /**
   * Arrêt propre de l'application
   */
  async shutdown() {
    console.log('🛑 Arrêt de l\'application...');
    
    try {
      // Fermeture du serveur Express
      if (this.server && this.expressServer) {
        await this.expressServer.stop(this.server);
      }
      
      // Fermeture de la connexion MongoDB
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('✅ Connexion MongoDB fermée');
      }
      
      console.log('✅ Application arrêtée proprement');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'arrêt:', error);
    }
  }
}

// Initialisation de l'application
const app = new Application();

// Gestion des signaux d'arrêt
process.on('SIGTERM', async () => {
  console.log('📨 Signal SIGTERM reçu');
  await app.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📨 Signal SIGINT reçu');
  await app.shutdown();
  process.exit(0);
});

// Gestion des erreurs non capturées
process.on('uncaughtException', async (error) => {
  console.error('💥 Exception non capturée:', error);
  await app.shutdown();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('💥 Promesse rejetée non gérée:', reason);
  console.error('💥 Promise:', promise);
  await app.shutdown();
  process.exit(1);
});

// Démarrage de l'application
if (require.main === module) {
  app.start().catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
}

module.exports = { Application };