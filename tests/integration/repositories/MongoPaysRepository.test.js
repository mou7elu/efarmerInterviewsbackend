const { describe, it, expect, beforeEach, afterEach, jest } = require('@jest/globals');
const { MongoPaysRepository } = require('../../../src/infrastructure/repositories/MongoPaysRepository');
const { PaysEntity } = require('../../../src/domain/entities/PaysEntity');
const { NotFoundError } = require('../../../src/shared/errors/NotFoundError');
const { DuplicateError } = require('../../../src/shared/errors/DuplicateError');

// Mock du modèle Mongoose
const mockPaysModel = {
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn()
};

// Mock du require du modèle
jest.mock('../../../../models/pays', () => mockPaysModel, { virtual: true });

describe('MongoPaysRepository', () => {
  let repository;
  let validPaysData;
  let mockDoc;

  beforeEach(() => {
    repository = new MongoPaysRepository();
    
    validPaysData = {
      _id: '507f1f77bcf86cd799439011',
      Lib_pays: 'Sénégal',
      Sommeil: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    };

    mockDoc = {
      toObject: jest.fn().mockReturnValue(validPaysData),
      ...validPaysData
    };

    // Reset tous les mocks
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('devrait créer un pays avec succès', async () => {
      const entity = PaysEntity.fromPersistence(validPaysData);
      
      mockPaysModel.findOne.mockResolvedValue(null); // Pas de doublon
      mockPaysModel.create.mockResolvedValue(mockDoc);

      const result = await repository.create(entity);

      expect(mockPaysModel.findOne).toHaveBeenCalledWith({ Lib_pays: 'Sénégal' });
      expect(mockPaysModel.create).toHaveBeenCalledWith(entity.toPersistence());
      expect(result).toBeInstanceOf(PaysEntity);
      expect(result.libPays.value).toBe('Sénégal');
    });

    it('devrait lever une DuplicateError si le libellé existe déjà', async () => {
      const entity = PaysEntity.fromPersistence(validPaysData);
      
      mockPaysModel.findOne.mockResolvedValue(mockDoc); // Doublon trouvé

      await expect(repository.create(entity)).rejects.toThrow(DuplicateError);
      expect(mockPaysModel.findOne).toHaveBeenCalledWith({ Lib_pays: 'Sénégal' });
      expect(mockPaysModel.create).not.toHaveBeenCalled();
    });

    it('devrait gérer les erreurs MongoDB de doublon', async () => {
      const entity = PaysEntity.fromPersistence(validPaysData);
      
      mockPaysModel.findOne.mockResolvedValue(null);
      const mongoError = new Error('Duplicate key');
      mongoError.code = 11000;
      mockPaysModel.create.mockRejectedValue(mongoError);

      await expect(repository.create(entity)).rejects.toThrow(DuplicateError);
    });
  });

  describe('findById', () => {
    it('devrait trouver un pays par ID', async () => {
      mockPaysModel.findById.mockResolvedValue(mockDoc);

      const result = await repository.findById('507f1f77bcf86cd799439011');

      expect(mockPaysModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toBeInstanceOf(PaysEntity);
      expect(result.libPays.value).toBe('Sénégal');
    });

    it('devrait retourner null si le pays n\'existe pas', async () => {
      mockPaysModel.findById.mockResolvedValue(null);

      const result = await repository.findById('507f1f77bcf86cd799439999');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('devrait retourner tous les pays triés par libellé', async () => {
      const mockDocs = [mockDoc, { ...mockDoc, toObject: () => ({ ...validPaysData, Lib_pays: 'France' }) }];
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockDocs)
      };
      
      mockPaysModel.find.mockReturnValue(mockFind);

      const result = await repository.findAll();

      expect(mockPaysModel.find).toHaveBeenCalledWith();
      expect(mockFind.sort).toHaveBeenCalledWith({ Lib_pays: 1 });
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(PaysEntity);
    });

    it('devrait retourner un tableau vide si aucun pays', async () => {
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      };
      
      mockPaysModel.find.mockReturnValue(mockFind);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un pays avec succès', async () => {
      const entity = PaysEntity.fromPersistence({ ...validPaysData, Lib_pays: 'Mali' });
      
      mockPaysModel.findOne.mockResolvedValue(null); // Pas de doublon
      mockPaysModel.findByIdAndUpdate.mockResolvedValue(mockDoc);

      const result = await repository.update('507f1f77bcf86cd799439011', entity);

      expect(mockPaysModel.findOne).toHaveBeenCalledWith({
        Lib_pays: 'Mali',
        _id: { $ne: '507f1f77bcf86cd799439011' }
      });
      expect(mockPaysModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        entity.toPersistence(),
        { new: true, runValidators: true }
      );
      expect(result).toBeInstanceOf(PaysEntity);
    });

    it('devrait lever une NotFoundError si le pays n\'existe pas', async () => {
      const entity = PaysEntity.fromPersistence(validPaysData);
      
      mockPaysModel.findOne.mockResolvedValue(null);
      mockPaysModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(repository.update('507f1f77bcf86cd799439999', entity))
        .rejects.toThrow(NotFoundError);
    });

    it('devrait lever une DuplicateError si le nouveau libellé existe déjà', async () => {
      const entity = PaysEntity.fromPersistence({ ...validPaysData, Lib_pays: 'Mali' });
      
      mockPaysModel.findOne.mockResolvedValue(mockDoc); // Doublon trouvé

      await expect(repository.update('507f1f77bcf86cd799439011', entity))
        .rejects.toThrow(DuplicateError);
    });
  });

  describe('delete', () => {
    it('devrait supprimer un pays avec succès', async () => {
      mockPaysModel.findByIdAndDelete.mockResolvedValue(mockDoc);

      const result = await repository.delete('507f1f77bcf86cd799439011');

      expect(mockPaysModel.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toBe(true);
    });

    it('devrait lever une NotFoundError si le pays n\'existe pas', async () => {
      mockPaysModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(repository.delete('507f1f77bcf86cd799439999'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('findByLibelle', () => {
    it('devrait trouver un pays par libellé', async () => {
      mockPaysModel.findOne.mockResolvedValue(mockDoc);

      const result = await repository.findByLibelle('Sénégal');

      expect(mockPaysModel.findOne).toHaveBeenCalledWith({ Lib_pays: 'Sénégal' });
      expect(result).toBeInstanceOf(PaysEntity);
    });

    it('devrait retourner null si le pays n\'existe pas', async () => {
      mockPaysModel.findOne.mockResolvedValue(null);

      const result = await repository.findByLibelle('Inexistant');

      expect(result).toBeNull();
    });
  });

  describe('findByStatut', () => {
    it('devrait trouver les pays actifs', async () => {
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockDoc])
      };
      
      mockPaysModel.find.mockReturnValue(mockFind);

      const result = await repository.findByStatut(false);

      expect(mockPaysModel.find).toHaveBeenCalledWith({ Sommeil: false });
      expect(mockFind.sort).toHaveBeenCalledWith({ Lib_pays: 1 });
      expect(result).toHaveLength(1);
    });

    it('devrait trouver les pays en sommeil', async () => {
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      };
      
      mockPaysModel.find.mockReturnValue(mockFind);

      const result = await repository.findByStatut(true);

      expect(mockPaysModel.find).toHaveBeenCalledWith({ Sommeil: true });
      expect(result).toHaveLength(0);
    });
  });

  describe('updateStatut', () => {
    it('devrait mettre à jour le statut d\'un pays', async () => {
      mockPaysModel.findByIdAndUpdate.mockResolvedValue(mockDoc);

      const result = await repository.updateStatut('507f1f77bcf86cd799439011', true);

      expect(mockPaysModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { Sommeil: true, updatedAt: expect.any(Date) },
        { new: true, runValidators: true }
      );
      expect(result).toBeInstanceOf(PaysEntity);
    });

    it('devrait lever une NotFoundError si le pays n\'existe pas', async () => {
      mockPaysModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(repository.updateStatut('507f1f77bcf86cd799439999', true))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('count', () => {
    it('devrait compter tous les pays', async () => {
      mockPaysModel.countDocuments.mockResolvedValue(5);

      const result = await repository.count();

      expect(mockPaysModel.countDocuments).toHaveBeenCalledWith();
      expect(result).toBe(5);
    });
  });

  describe('exists', () => {
    it('devrait retourner true si le pays existe', async () => {
      mockPaysModel.countDocuments.mockResolvedValue(1);

      const result = await repository.exists('507f1f77bcf86cd799439011');

      expect(mockPaysModel.countDocuments).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439011' });
      expect(result).toBe(true);
    });

    it('devrait retourner false si le pays n\'existe pas', async () => {
      mockPaysModel.countDocuments.mockResolvedValue(0);

      const result = await repository.exists('507f1f77bcf86cd799439999');

      expect(result).toBe(false);
    });
  });

  describe('searchByName', () => {
    it('devrait rechercher des pays par nom partiel', async () => {
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockDoc])
      };
      
      mockPaysModel.find.mockReturnValue(mockFind);

      const result = await repository.searchByName('Sén');

      expect(mockPaysModel.find).toHaveBeenCalledWith({
        Lib_pays: { $regex: 'Sén', $options: 'i' }
      });
      expect(mockFind.sort).toHaveBeenCalledWith({ Lib_pays: 1 });
      expect(result).toHaveLength(1);
    });
  });

  describe('findPaginated', () => {
    it('devrait retourner des pays avec pagination', async () => {
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockDoc])
      };
      
      mockPaysModel.find.mockReturnValue(mockFind);
      mockPaysModel.countDocuments.mockResolvedValue(10);

      const result = await repository.findPaginated(2, 5, true);

      expect(mockPaysModel.find).toHaveBeenCalledWith({ Sommeil: false });
      expect(mockFind.skip).toHaveBeenCalledWith(5);
      expect(mockFind.limit).toHaveBeenCalledWith(5);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(10);
      expect(result.page).toBe(2);
      expect(result.pages).toBe(2);
    });

    it('devrait utiliser les valeurs par défaut', async () => {
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      };
      
      mockPaysModel.find.mockReturnValue(mockFind);
      mockPaysModel.countDocuments.mockResolvedValue(0);

      const result = await repository.findPaginated();

      expect(mockFind.skip).toHaveBeenCalledWith(0);
      expect(mockFind.limit).toHaveBeenCalledWith(10);
      expect(result.page).toBe(1);
    });
  });
});