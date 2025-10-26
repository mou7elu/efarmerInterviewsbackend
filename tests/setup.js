// Configuration globale pour les tests
beforeAll(async () => {
  // Configuration de l'environnement de test
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'mongodb://localhost:27017/efarmer_test';
  process.env.JWT_SECRET = 'test_jwt_secret';
  
  console.log('🧪 Configuration des tests initialisée');
});

afterAll(async () => {
  console.log('🧪 Tests terminés');
});

// Configuration des timeouts pour les tests longs
jest.setTimeout(30000);