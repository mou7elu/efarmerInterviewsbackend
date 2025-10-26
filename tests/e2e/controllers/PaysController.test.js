const request = require('supertest');
const { describe, it, expect, beforeEach, afterEach, jest } = require('@jest/globals');
const { ExpressServer } = require('../../../src/infrastructure/web/server');

// Mock des use cases
const mockCreatePaysUseCase = {
  execute: jest.fn()
};

const mockGetPaysUseCase = {
  execute: jest.fn()
};

const mockGetAllPaysUseCase = {
  execute: jest.fn()
};

const mockUpdatePaysUseCase = {
  execute: jest.fn()
};

const mockDeletePaysUseCase = {
  execute: jest.fn()
};

// Mock des modules de use cases
jest.mock('../../../src/application/use-cases/geographic/CreatePaysUseCase', () => ({
  CreatePaysUseCase: jest.fn().mockImplementation(() => mockCreatePaysUseCase)
}));

jest.mock('../../../src/application/use-cases/geographic/GetPaysUseCase', () => ({
  GetPaysUseCase: jest.fn().mockImplementation(() => mockGetPaysUseCase)
}));

jest.mock('../../../src/application/use-cases/geographic/GetAllPaysUseCase', () => ({
  GetAllPaysUseCase: jest.fn().mockImplementation(() => mockGetAllPaysUseCase)
}));

jest.mock('../../../src/application/use-cases/geographic/UpdatePaysUseCase', () => ({
  UpdatePaysUseCase: jest.fn().mockImplementation(() => mockUpdatePaysUseCase)
}));

jest.mock('../../../src/application/use-cases/geographic/DeletePaysUseCase', () => ({
  DeletePaysUseCase: jest.fn().mockImplementation(() => mockDeletePaysUseCase)
}));

describe('PaysController E2E Tests', () => {
  let app;
  let server;

  beforeEach(() => {
    server = new ExpressServer();
    app = server.getApp();
    
    // Reset tous les mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (server) {
      server.stop();
    }
  });

  describe('POST /api/geographic/pays', () => {
    it('devrait créer un pays avec succès', async () => {
      const paysData = {
        libPays: 'Sénégal',
        sommeil: false
      };

      const expectedResult = {
        id: '507f1f77bcf86cd799439011',
        libPays: 'Sénégal',
        sommeil: false,
        statut: 'Actif',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      mockCreatePaysUseCase.execute.mockResolvedValue(expectedResult);

      const response = await request(app)
        .post('/api/geographic/pays')
        .send(paysData)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        message: 'Pays créé avec succès',
        data: expectedResult
      });

      expect(mockCreatePaysUseCase.execute).toHaveBeenCalledWith(paysData);
    });

    it('devrait retourner une erreur 400 pour des données invalides', async () => {
      const paysData = {
        libPays: '' // Libellé vide
      };

      mockCreatePaysUseCase.execute.mockRejectedValue(
        new (require('../../../src/shared/errors/ValidationError'))('Le libellé ne peut pas être vide')
      );

      const response = await request(app)
        .post('/api/geographic/pays')
        .send(paysData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Le libellé ne peut pas être vide',
        details: null
      });
    });

    it('devrait retourner une erreur 409 pour un doublon', async () => {
      const paysData = {
        libPays: 'Sénégal'
      };

      mockCreatePaysUseCase.execute.mockRejectedValue(
        new (require('../../../src/shared/errors/DuplicateError'))('Un pays avec ce libellé existe déjà')
      );

      const response = await request(app)
        .post('/api/geographic/pays')
        .send(paysData)
        .expect(409);

      expect(response.body).toEqual({
        success: false,
        error: 'DUPLICATE_ERROR',
        message: 'Un pays avec ce libellé existe déjà'
      });
    });
  });

  describe('GET /api/geographic/pays/:id', () => {
    it('devrait retourner un pays par ID', async () => {
      const paysId = '507f1f77bcf86cd799439011';
      const expectedResult = {
        id: paysId,
        libPays: 'Sénégal',
        sommeil: false,
        statut: 'Actif',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      mockGetPaysUseCase.execute.mockResolvedValue(expectedResult);

      const response = await request(app)
        .get(`/api/geographic/pays/${paysId}`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: expectedResult
      });

      expect(mockGetPaysUseCase.execute).toHaveBeenCalledWith(paysId);
    });

    it('devrait retourner une erreur 404 si le pays n\'existe pas', async () => {
      const paysId = '507f1f77bcf86cd799439999';

      mockGetPaysUseCase.execute.mockRejectedValue(
        new (require('../../../src/shared/errors/NotFoundError'))('Pays non trouvé')
      );

      const response = await request(app)
        .get(`/api/geographic/pays/${paysId}`)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'NOT_FOUND',
        message: 'Pays non trouvé'
      });
    });
  });

  describe('GET /api/geographic/pays', () => {
    it('devrait retourner tous les pays avec pagination', async () => {
      const expectedResult = {
        items: [
          {
            id: '507f1f77bcf86cd799439011',
            libPays: 'Sénégal',
            sommeil: false,
            statut: 'Actif'
          },
          {
            id: '507f1f77bcf86cd799439012',
            libPays: 'Mali',
            sommeil: false,
            statut: 'Actif'
          }
        ],
        total: 2,
        page: 1,
        pages: 1
      };

      mockGetAllPaysUseCase.execute.mockResolvedValue(expectedResult);

      const response = await request(app)
        .get('/api/geographic/pays')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: expectedResult.items,
        pagination: {
          page: 1,
          pages: 1,
          total: 2,
          limit: 10
        }
      });
    });

    it('devrait supporter les paramètres de filtrage', async () => {
      const expectedResult = {
        items: [],
        total: 0,
        page: 2,
        pages: 0
      };

      mockGetAllPaysUseCase.execute.mockResolvedValue(expectedResult);

      const response = await request(app)
        .get('/api/geographic/pays?page=2&limit=5&actifSeulement=true')
        .expect(200);

      expect(mockGetAllPaysUseCase.execute).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        actifSeulement: true,
        search: null
      });
    });

    it('devrait valider les paramètres de pagination', async () => {
      const response = await request(app)
        .get('/api/geographic/pays?page=0')
        .expect(400);

      expect(response.body.error).toBe('VALIDATION_ERROR');
      expect(response.body.message).toContain('Le numéro de page doit être un entier positif');
    });
  });

  describe('PUT /api/geographic/pays/:id', () => {
    it('devrait mettre à jour un pays avec succès', async () => {
      const paysId = '507f1f77bcf86cd799439011';
      const updateData = {
        libPays: 'République du Sénégal'
      };

      const expectedResult = {
        id: paysId,
        libPays: 'République du Sénégal',
        sommeil: false,
        statut: 'Actif',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z'
      };

      mockUpdatePaysUseCase.execute.mockResolvedValue(expectedResult);

      const response = await request(app)
        .put(`/api/geographic/pays/${paysId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Pays mis à jour avec succès',
        data: expectedResult
      });

      expect(mockUpdatePaysUseCase.execute).toHaveBeenCalledWith(paysId, updateData);
    });
  });

  describe('PATCH /api/geographic/pays/:id/statut', () => {
    it('devrait changer le statut d\'un pays', async () => {
      const paysId = '507f1f77bcf86cd799439011';
      const statutData = { sommeil: true };

      const expectedResult = {
        id: paysId,
        libPays: 'Sénégal',
        sommeil: true,
        statut: 'Inactif'
      };

      mockUpdatePaysUseCase.execute.mockResolvedValue(expectedResult);

      const response = await request(app)
        .patch(`/api/geographic/pays/${paysId}/statut`)
        .send(statutData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Pays désactivé avec succès',
        data: expectedResult
      });
    });

    it('devrait valider le type booléen du statut', async () => {
      const paysId = '507f1f77bcf86cd799439011';
      const statutData = { sommeil: 'true' }; // String au lieu de boolean

      const response = await request(app)
        .patch(`/api/geographic/pays/${paysId}/statut`)
        .send(statutData)
        .expect(400);

      expect(response.body.error).toBe('VALIDATION_ERROR');
      expect(response.body.message).toContain('Le statut sommeil doit être un booléen');
    });
  });

  describe('DELETE /api/geographic/pays/:id', () => {
    it('devrait supprimer un pays avec succès', async () => {
      const paysId = '507f1f77bcf86cd799439011';

      mockDeletePaysUseCase.execute.mockResolvedValue(true);

      const response = await request(app)
        .delete(`/api/geographic/pays/${paysId}`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Pays supprimé avec succès'
      });

      expect(mockDeletePaysUseCase.execute).toHaveBeenCalledWith(paysId);
    });
  });

  describe('GET /api/geographic/pays/stats', () => {
    it('devrait retourner les statistiques des pays', async () => {
      // Mock pour tous les pays
      mockGetAllPaysUseCase.execute.mockResolvedValueOnce({
        total: 10,
        items: []
      });

      // Mock pour les pays actifs
      mockGetAllPaysUseCase.execute.mockResolvedValueOnce({
        total: 8,
        items: []
      });

      const response = await request(app)
        .get('/api/geographic/pays/stats')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          total: 10,
          actifs: 8,
          inactifs: 2
        }
      });
    });
  });

  describe('GET /api/geographic/pays/search/:term', () => {
    it('devrait rechercher des pays par terme', async () => {
      const searchTerm = 'Sén';
      const expectedResult = {
        items: [
          {
            id: '507f1f77bcf86cd799439011',
            libPays: 'Sénégal',
            sommeil: false,
            statut: 'Actif'
          }
        ]
      };

      mockGetAllPaysUseCase.execute.mockResolvedValue(expectedResult);

      const response = await request(app)
        .get(`/api/geographic/pays/search/${searchTerm}`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: expectedResult.items
      });

      expect(mockGetAllPaysUseCase.execute).toHaveBeenCalledWith({
        search: searchTerm,
        actifSeulement: false
      });
    });

    it('devrait valider la longueur du terme de recherche', async () => {
      const response = await request(app)
        .get('/api/geographic/pays/search/S')
        .expect(400);

      expect(response.body.error).toBe('VALIDATION_ERROR');
      expect(response.body.message).toContain('Le terme de recherche doit contenir au moins 2 caractères');
    });
  });

  describe('Gestion des erreurs', () => {
    it('devrait gérer les erreurs de format JSON invalide', async () => {
      const response = await request(app)
        .post('/api/geographic/pays')
        .set('Content-Type', 'application/json')
        .send('{"libPays": invalid json}')
        .expect(400);

      expect(response.body.error).toBe('INVALID_JSON');
    });

    it('devrait gérer les erreurs internes du serveur', async () => {
      mockCreatePaysUseCase.execute.mockRejectedValue(new Error('Erreur interne'));

      const response = await request(app)
        .post('/api/geographic/pays')
        .send({ libPays: 'Test' })
        .expect(500);

      expect(response.body.error).toBe('INTERNAL_SERVER_ERROR');
    });
  });
});