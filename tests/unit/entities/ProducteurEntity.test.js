const { ProducteurEntity } = require('../../../src/domain/entities/ProducteurEntity');
const { ValidationError } = require('../../../src/shared/errors/ValidationError');

describe('ProducteurEntity', () => {
  describe('création', () => {
    test('devrait créer un producteur valide avec les données minimales', () => {
      const data = {
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        sommeil: false
      };

      const producteur = ProducteurEntity.create(data);

      expect(producteur.code).toBe('PROD001');
      expect(producteur.nom.value).toBe('Dupont');
      expect(producteur.prenom.value).toBe('Jean');
      expect(producteur.genre).toBe(1);
      expect(producteur.sommeil).toBe(false);
      expect(producteur.isValidForCreation()).toBe(true);
    });

    test('devrait créer un producteur avec toutes les données', () => {
      const dateNaissance = new Date('1980-01-15');
      const data = {
        code: 'PROD002',
        nom: 'Martin',
        prenom: 'Marie',
        genre: 2,
        telephone1: '0123456789',
        telephone2: '0987654321',
        dateNaissance,
        sommeil: false
      };

      const producteur = ProducteurEntity.create(data);

      expect(producteur.code).toBe('PROD002');
      expect(producteur.nom.value).toBe('Martin');
      expect(producteur.prenom.value).toBe('Marie');
      expect(producteur.genre).toBe(2);
      expect(producteur.telephone1).toBe('0123456789');
      expect(producteur.telephone2).toBe('0987654321');
      expect(producteur.dateNaissance).toEqual(dateNaissance);
      expect(producteur.sommeil).toBe(false);
    });

    test('devrait échouer avec un code invalide', () => {
      const data = {
        code: '',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        sommeil: false
      };

      expect(() => ProducteurEntity.create(data)).toThrow(ValidationError);
    });

    test('devrait échouer avec un nom invalide', () => {
      const data = {
        code: 'PROD001',
        nom: '',
        prenom: 'Jean',
        genre: 1,
        sommeil: false
      };

      expect(() => ProducteurEntity.create(data)).toThrow(ValidationError);
    });

    test('devrait échouer avec un prénom invalide', () => {
      const data = {
        code: 'PROD001',
        nom: 'Dupont',
        prenom: '',
        genre: 1,
        sommeil: false
      };

      expect(() => ProducteurEntity.create(data)).toThrow(ValidationError);
    });

    test('devrait échouer avec un genre invalide', () => {
      const data = {
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 3, // Invalide
        sommeil: false
      };

      expect(() => ProducteurEntity.create(data)).toThrow(ValidationError);
    });
  });

  describe('mise à jour du nom', () => {
    test('devrait mettre à jour le nom et prénom', () => {
      const producteur = ProducteurEntity.create({
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        sommeil: false
      });

      const updated = producteur.updateNom('Martin', 'Pierre');

      expect(updated.nom.value).toBe('Martin');
      expect(updated.prenom.value).toBe('Pierre');
      expect(updated.updatedAt).toBeDefined();
      expect(updated.updatedAt.getTime()).toBeGreaterThan(producteur.updatedAt.getTime());
    });

    test('devrait échouer avec un nom vide', () => {
      const producteur = ProducteurEntity.create({
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        sommeil: false
      });

      expect(() => producteur.updateNom('', 'Pierre')).toThrow(ValidationError);
    });
  });

  describe('mise à jour du contact', () => {
    test('devrait mettre à jour les numéros de téléphone', () => {
      const producteur = ProducteurEntity.create({
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        sommeil: false
      });

      const updated = producteur.updateContact('0123456789', '0987654321');

      expect(updated.telephone1).toBe('0123456789');
      expect(updated.telephone2).toBe('0987654321');
      expect(updated.updatedAt).toBeDefined();
    });

    test('devrait accepter des numéros null ou undefined', () => {
      const producteur = ProducteurEntity.create({
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        sommeil: false
      });

      const updated = producteur.updateContact(null, undefined);

      expect(updated.telephone1).toBeNull();
      expect(updated.telephone2).toBeNull();
    });
  });

  describe('calcul de l\'âge', () => {
    test('devrait calculer l\'âge correctement', () => {
      const dateNaissance = new Date();
      dateNaissance.setFullYear(dateNaissance.getFullYear() - 30);

      const producteur = ProducteurEntity.create({
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        dateNaissance,
        sommeil: false
      });

      const age = producteur.getAge();
      expect(age).toBe(30);
    });

    test('devrait retourner null si pas de date de naissance', () => {
      const producteur = ProducteurEntity.create({
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        sommeil: false
      });

      const age = producteur.getAge();
      expect(age).toBeNull();
    });
  });

  describe('statut', () => {
    test('devrait mettre à jour le statut', () => {
      const producteur = ProducteurEntity.create({
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        sommeil: false
      });

      const updated = producteur.updateStatut(true);

      expect(updated.sommeil).toBe(true);
      expect(updated.isActif()).toBe(false);
    });

    test('devrait identifier un producteur actif', () => {
      const producteur = ProducteurEntity.create({
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        sommeil: false
      });

      expect(producteur.isActif()).toBe(true);
    });
  });

  describe('informations de genre', () => {
    test('devrait retourner les bonnes informations pour un homme', () => {
      const producteur = ProducteurEntity.create({
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        sommeil: false
      });

      expect(producteur.isHomme()).toBe(true);
      expect(producteur.isFemme()).toBe(false);
      expect(producteur.getGenreLibelle()).toBe('Homme');
    });

    test('devrait retourner les bonnes informations pour une femme', () => {
      const producteur = ProducteurEntity.create({
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jeanne',
        genre: 2,
        sommeil: false
      });

      expect(producteur.isHomme()).toBe(false);
      expect(producteur.isFemme()).toBe(true);
      expect(producteur.getGenreLibelle()).toBe('Femme');
    });
  });

  describe('persistance', () => {
    test('devrait convertir vers le format de persistance', () => {
      const dateNaissance = new Date('1980-01-15');
      const producteur = ProducteurEntity.create({
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        telephone1: '0123456789',
        telephone2: '0987654321',
        dateNaissance,
        sommeil: false
      });

      const persistence = producteur.toPersistence();

      expect(persistence.Code).toBe('PROD001');
      expect(persistence.Nom).toBe('Dupont');
      expect(persistence.Prenom).toBe('Jean');
      expect(persistence.Genre).toBe(1);
      expect(persistence.Telephone1).toBe('0123456789');
      expect(persistence.Telephone2).toBe('0987654321');
      expect(persistence.DateNaissance).toEqual(dateNaissance);
      expect(persistence.sommeil).toBe(false);
    });

    test('devrait créer depuis le format de persistance', () => {
      const dateNaissance = new Date('1980-01-15');
      const persistenceData = {
        _id: '507f1f77bcf86cd799439011',
        Code: 'PROD001',
        Nom: 'Dupont',
        Prenom: 'Jean',
        Genre: 1,
        Telephone1: '0123456789',
        Telephone2: '0987654321',
        DateNaissance: dateNaissance,
        sommeil: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const producteur = ProducteurEntity.fromPersistence(persistenceData);

      expect(producteur.id).toBe('507f1f77bcf86cd799439011');
      expect(producteur.code).toBe('PROD001');
      expect(producteur.nom.value).toBe('Dupont');
      expect(producteur.prenom.value).toBe('Jean');
      expect(producteur.genre).toBe(1);
      expect(producteur.telephone1).toBe('0123456789');
      expect(producteur.telephone2).toBe('0987654321');
      expect(producteur.dateNaissance).toEqual(dateNaissance);
      expect(producteur.sommeil).toBe(false);
    });
  });

  describe('immutabilité', () => {
    test('ne devrait pas permettre la modification directe des propriétés', () => {
      const producteur = ProducteurEntity.create({
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        sommeil: false
      });

      expect(() => {
        producteur.code = 'AUTRE';
      }).toThrow();
    });

    test('devrait créer une nouvelle instance lors des mises à jour', () => {
      const producteur = ProducteurEntity.create({
        code: 'PROD001',
        nom: 'Dupont',
        prenom: 'Jean',
        genre: 1,
        sommeil: false
      });

      const updated = producteur.updateNom('Martin', 'Pierre');

      expect(updated).not.toBe(producteur);
      expect(producteur.nom.value).toBe('Dupont');
      expect(updated.nom.value).toBe('Martin');
    });
  });
});