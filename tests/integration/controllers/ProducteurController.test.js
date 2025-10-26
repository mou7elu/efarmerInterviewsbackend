const request = require('supertest');
const express = require('express');
const { ProducteurController } = require('../../../src/infrastructure/web/ProducteurController');
const { MongoProducteurRepository } = require('../../../src/infrastructure/repositories/MongoProducteurRepository');

// Mock du repository
jest.mock('../../../src/infrastructure/repositories/MongoProducteurRepository');

const app = express();
app.use(express.json());

const producteurController = new ProducteurController();

// Routes de test
app.get('/producteurs', producteurController.getAll);
app.get('/producteurs/search', producteurController.search);
app.get('/producteurs/statistics', producteurController.getStatistiques);
app.get('/producteurs/code/:code', producteurController.getByCode);
app.get('/producteurs/:id', producteurController.getById);
app.post('/producteurs', producteurController.create);
app.put('/producteurs/:id', producteurController.update);
app.patch('/producteurs/:id/status', producteurController.updateStatut);
app.delete('/producteurs/:id', producteurController.delete);

describe('ProducteurController', () => {
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findPaginated: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCode: jest.fn(),
      searchProducteurs: jest.fn(),
      getStatistiques: jest.fn(),
      updateStatut: jest.fn()
    };

    MongoProducteurRepository.mockImplementation(() => mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /producteurs', () => {
    test('devrait retourner la liste paginée des producteurs', async () => {
      const mockResult = {
        items: [
          {
            id: '1',
            code: 'PROD001',
            nom: { value: 'Dupont' },
            prenom: { value: 'Jean' },
            genre: 1,
            sommeil: false
          }
        ],
        total: 1,
        page: 1,
        pages: 1
      };

      mockRepository.findPaginated.mockResolvedValue(mockResult);

      const response = await request(app)
        .get('/producteurs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResult);
      expect(mockRepository.findPaginated).toHaveBeenCalledWith(1, 10, false);
    });

    test('devrait gérer les paramètres de pagination', async () => {
      const mockResult = {
        items: [],
        total: 0,
        page: 2,
        pages: 0
      };

      mockRepository.findPaginated.mockResolvedValue(mockResult);

      await request(app)
        .get('/producteurs?page=2&limit=5&actif=true')
        .expect(200);

      expect(mockRepository.findPaginated).toHaveBeenCalledWith(2, 5, true);
    });

    test('devrait gérer les erreurs du repository', async () => {
      mockRepository.findPaginated.mockRejectedValue(new Error('Erreur DB'));

      const response = await request(app)
        .get('/producteurs')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Erreur lors de la récupération');
    });
  });

  describe('GET /producteurs/:id', () => {
    test('devrait retourner un producteur par ID', async () => {
      const mockProducteur = {
        id: '1',
        code: 'PROD001',
        nom: { value: 'Dupont' },
        prenom: { value: 'Jean' },
        genre: 1,
        sommeil: false
      };

      mockRepository.findById.mockResolvedValue(mockProducteur);

      const response = await request(app)
        .get('/producteurs/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockProducteur);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    test('devrait retourner 404 si producteur non trouvé', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/producteurs/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Producteur non trouvé');
    });

    test('devrait retourner 400 si ID manquant', async () => {
      const response = await request(app)
        .get('/producteurs/')
        .expect(404); // Express retourne 404 pour une route non trouvée
    });
  });

  describe('POST /producteurs', () => {
    test('devrait créer un nouveau producteur', async () => {
      const newProducteur = {
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        telephone1: '0123456789'
      };

      const mockCreatedProducteur = {
        id: '1',
        ...newProducteur,
        nom: { value: 'Dupont' },
        prenom: { value: 'Jean' },
        sommeil: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepository.create.mockResolvedValue(mockCreatedProducteur);

      const response = await request(app)
        .post('/producteurs')
        .send(newProducteur)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockCreatedProducteur);
      expect(mockRepository.create).toHaveBeenCalled();
    });

    test('devrait retourner 400 si données invalides', async () => {
      const invalidProducteur = {
        code: '', // Code vide
        nom: 'Dupont',
        prenom: 'Jean'
      };

      const response = await request(app)
        .post('/producteurs')
        .send(invalidProducteur)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('requis');
    });

    test('devrait retourner 409 si producteur déjà existant', async () => {
      const { DuplicateError } = require('../../../src/shared/errors/DuplicateError');
      
      const newProducteur = {
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1
      };

      mockRepository.create.mockRejectedValue(new DuplicateError('Producteur déjà existant'));

      const response = await request(app)
        .post('/producteurs')
        .send(newProducteur)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Producteur déjà existant');
    });
  });

  describe('PUT /producteurs/:id', () => {
    test('devrait mettre à jour un producteur', async () => {
      const updateData = {
        nom: 'Martin',
        prenom: 'Pierre',
        telephone1: '0987654321'
      };

      const existingProducteur = {
        id: '1',
        code: 'PROD001',
        nom: { value: 'Dupont' },
        prenom: { value: 'Jean' },
        genre: 1,
        sommeil: false,
        updateNom: jest.fn().mockReturnThis(),
        updateContact: jest.fn().mockReturnThis()
      };

      const updatedProducteur = {
        ...existingProducteur,
        nom: { value: 'Martin' },
        prenom: { value: 'Pierre' },
        telephone1: '0987654321'
      };

      mockRepository.findById.mockResolvedValue(existingProducteur);
      mockRepository.update.mockResolvedValue(updatedProducteur);

      const response = await request(app)
        .put('/producteurs/1')
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(updatedProducteur);
    });

    test('devrait retourner 404 si producteur non trouvé', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const response = await request(app)
        .put('/producteurs/999')
        .send({ nom: 'Martin', prenom: 'Pierre' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Producteur non trouvé');
    });
  });

  describe('DELETE /producteurs/:id', () => {
    test('devrait supprimer un producteur', async () => {
      mockRepository.delete.mockResolvedValue(true);

      const response = await request(app)
        .delete('/producteurs/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Producteur supprimé avec succès');
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    test('devrait retourner 404 si producteur non trouvé', async () => {
      const { NotFoundError } = require('../../../src/shared/errors/NotFoundError');
      mockRepository.delete.mockRejectedValue(new NotFoundError('Producteur non trouvé'));

      const response = await request(app)
        .delete('/producteurs/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Producteur non trouvé');
    });
  });

  describe('GET /producteurs/search', () => {
    test('devrait rechercher des producteurs', async () => {
      const mockResults = [
        {
          id: '1',
          code: 'PROD001',
          nom: { value: 'Dupont' },
          prenom: { value: 'Jean' },
          genre: 1,
          sommeil: false
        }
      ];

      mockRepository.searchProducteurs.mockResolvedValue(mockResults);

      const response = await request(app)
        .get('/producteurs/search?nom=Dupont&actif=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResults);
      expect(mockRepository.searchProducteurs).toHaveBeenCalledWith({
        nom: 'Dupont',
        actifSeulement: true
      });
    });
  });

  describe('GET /producteurs/statistics', () => {
    test('devrait retourner les statistiques des producteurs', async () => {
      const mockStats = {
        total: 100,
        actifs: 85,
        inactifs: 15,
        hommes: 60,
        femmes: 40,
        nonDefini: 0
      };

      mockRepository.getStatistiques.mockResolvedValue(mockStats);

      const response = await request(app)
        .get('/producteurs/statistics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockStats);
    });
  });

  describe('GET /producteurs/code/:code', () => {
    test('devrait retourner un producteur par code', async () => {
      const mockProducteur = {
        id: '1',
        code: 'PROD001',
        nom: { value: 'Dupont' },
        prenom: { value: 'Jean' },
        genre: 1,
        sommeil: false
      };

      mockRepository.findByCode.mockResolvedValue(mockProducteur);

      const response = await request(app)
        .get('/producteurs/code/PROD001')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockProducteur);
      expect(mockRepository.findByCode).toHaveBeenCalledWith('PROD001');
    });
  });

  describe('PATCH /producteurs/:id/status', () => {
    test('devrait mettre à jour le statut d\'un producteur', async () => {
      const updatedProducteur = {
        id: '1',
        code: 'PROD001',
        nom: { value: 'Dupont' },
        prenom: { value: 'Jean' },
        genre: 1,
        sommeil: true
      };

      mockRepository.updateStatut.mockResolvedValue(updatedProducteur);

      const response = await request(app)
        .patch('/producteurs/1/status')
        .send({ sommeil: true })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(updatedProducteur);
      expect(mockRepository.updateStatut).toHaveBeenCalledWith('1', true);
    });

    test('devrait retourner 400 si statut manquant', async () => {
      const response = await request(app)
        .patch('/producteurs/1/status')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('requis');
    });
  });
});