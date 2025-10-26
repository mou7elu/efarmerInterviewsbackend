const { ParcelleEntity } = require('../../../src/domain/entities/ParcelleEntity');
const { ValidationError } = require('../../../src/shared/errors/ValidationError');

describe('ParcelleEntity', () => {
  describe('création', () => {
    test('devrait créer une parcelle valide avec les données minimales', () => {
      const data = {
        numParcelle: 'P001',
        surface: 2.5
      };

      const parcelle = ParcelleEntity.create(data);

      expect(parcelle.numParcelle).toBe('P001');
      expect(parcelle.surface).toBe(2.5);
      expect(parcelle.codeProducteur).toBeNull();
      expect(parcelle.coordonnees).toBeNull();
      expect(parcelle.isValidForCreation()).toBe(true);
    });

    test('devrait créer une parcelle avec toutes les données', () => {
      const data = {
        numParcelle: 'P002',
        codeProducteur: 'PROD001',
        surface: 5.0,
        gpsLatitude: 14.7167,
        gpsLongitude: -17.4677
      };

      const parcelle = ParcelleEntity.create(data);

      expect(parcelle.numParcelle).toBe('P002');
      expect(parcelle.codeProducteur).toBe('PROD001');
      expect(parcelle.surface).toBe(5.0);
      expect(parcelle.coordonnees).toBeDefined();
      expect(parcelle.coordonnees.latitude).toBe(14.7167);
      expect(parcelle.coordonnees.longitude).toBe(-17.4677);
    });

    test('devrait échouer avec un numéro de parcelle invalide', () => {
      const data = {
        numParcelle: '',
        surface: 2.5
      };

      expect(() => ParcelleEntity.create(data)).toThrow(ValidationError);
    });

    test('devrait échouer avec une surface invalide', () => {
      const data = {
        numParcelle: 'P001',
        surface: -1
      };

      expect(() => ParcelleEntity.create(data)).toThrow(ValidationError);
    });

    test('devrait échouer avec une surface nulle', () => {
      const data = {
        numParcelle: 'P001',
        surface: 0
      };

      expect(() => ParcelleEntity.create(data)).toThrow(ValidationError);
    });
  });

  describe('mise à jour de la surface', () => {
    test('devrait mettre à jour la surface', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 2.5
      });

      const updated = parcelle.updateSurface(3.5);

      expect(updated.surface).toBe(3.5);
      expect(updated.updatedAt).toBeDefined();
      expect(updated.updatedAt.getTime()).toBeGreaterThan(parcelle.updatedAt.getTime());
    });

    test('devrait échouer avec une surface invalide', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 2.5
      });

      expect(() => parcelle.updateSurface(-1)).toThrow(ValidationError);
      expect(() => parcelle.updateSurface(0)).toThrow(ValidationError);
    });
  });

  describe('mise à jour des coordonnées', () => {
    test('devrait mettre à jour les coordonnées GPS', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 2.5
      });

      const updated = parcelle.updateCoordonnees(14.7167, -17.4677);

      expect(updated.coordonnees).toBeDefined();
      expect(updated.coordonnees.latitude).toBe(14.7167);
      expect(updated.coordonnees.longitude).toBe(-17.4677);
      expect(updated.updatedAt).toBeDefined();
    });

    test('devrait supprimer les coordonnées avec des valeurs null', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 2.5,
        gpsLatitude: 14.7167,
        gpsLongitude: -17.4677
      });

      const updated = parcelle.updateCoordonnees(null, null);

      expect(updated.coordonnees).toBeNull();
    });

    test('devrait échouer avec des coordonnées invalides', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 2.5
      });

      expect(() => parcelle.updateCoordonnees(91, 0)).toThrow(ValidationError); // Latitude > 90
      expect(() => parcelle.updateCoordonnees(-91, 0)).toThrow(ValidationError); // Latitude < -90
      expect(() => parcelle.updateCoordonnees(0, 181)).toThrow(ValidationError); // Longitude > 180
      expect(() => parcelle.updateCoordonnees(0, -181)).toThrow(ValidationError); // Longitude < -180
    });
  });

  describe('mise à jour du producteur', () => {
    test('devrait mettre à jour le code producteur', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 2.5
      });

      const updated = parcelle.updateProducteur('PROD001');

      expect(updated.codeProducteur).toBe('PROD001');
      expect(updated.updatedAt).toBeDefined();
    });

    test('devrait accepter null pour supprimer le producteur', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        codeProducteur: 'PROD001',
        surface: 2.5
      });

      const updated = parcelle.updateProducteur(null);

      expect(updated.codeProducteur).toBeNull();
    });
  });

  describe('catégorisation par taille', () => {
    test('devrait identifier une petite parcelle', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 0.8
      });

      expect(parcelle.getCategorieParTaille()).toBe('Petite');
      expect(parcelle.isPetite()).toBe(true);
      expect(parcelle.isMoyenne()).toBe(false);
      expect(parcelle.isGrande()).toBe(false);
    });

    test('devrait identifier une parcelle moyenne', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 2.5
      });

      expect(parcelle.getCategorieParTaille()).toBe('Moyenne');
      expect(parcelle.isPetite()).toBe(false);
      expect(parcelle.isMoyenne()).toBe(true);
      expect(parcelle.isGrande()).toBe(false);
    });

    test('devrait identifier une grande parcelle', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 8.0
      });

      expect(parcelle.getCategorieParTaille()).toBe('Grande');
      expect(parcelle.isPetite()).toBe(false);
      expect(parcelle.isMoyenne()).toBe(false);
      expect(parcelle.isGrande()).toBe(true);
    });
  });

  describe('validation GPS', () => {
    test('devrait valider des coordonnées GPS correctes', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 2.5,
        gpsLatitude: 14.7167,
        gpsLongitude: -17.4677
      });

      expect(parcelle.hasValidGPS()).toBe(true);
    });

    test('devrait invalider des coordonnées GPS manquantes', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 2.5
      });

      expect(parcelle.hasValidGPS()).toBe(false);
    });

    test('devrait invalider des coordonnées GPS partielles', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 2.5,
        gpsLatitude: 14.7167
      });

      expect(parcelle.hasValidGPS()).toBe(false);
    });
  });

  describe('informations de surface', () => {
    test('devrait retourner la surface en m²', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 2.5 // hectares
      });

      expect(parcelle.getSurfaceEnM2()).toBe(25000); // 2.5 * 10000
    });

    test('devrait formater la surface avec unité', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 2.5
      });

      expect(parcelle.getSurfaceFormatee()).toBe('2.5 ha');
    });
  });

  describe('association avec producteur', () => {
    test('devrait identifier si la parcelle a un producteur', () => {
      const parcelleAvecProducteur = ParcelleEntity.create({
        numParcelle: 'P001',
        codeProducteur: 'PROD001',
        surface: 2.5
      });

      const parcelleSansProducteur = ParcelleEntity.create({
        numParcelle: 'P002',
        surface: 2.5
      });

      expect(parcelleAvecProducteur.hasProducteur()).toBe(true);
      expect(parcelleSansProducteur.hasProducteur()).toBe(false);
    });
  });

  describe('persistance', () => {
    test('devrait convertir vers le format de persistance', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        codeProducteur: 'PROD001',
        surface: 2.5,
        gpsLatitude: 14.7167,
        gpsLongitude: -17.4677
      });

      const persistence = parcelle.toPersistence();

      expect(persistence.NumParcelle).toBe('P001');
      expect(persistence.CodeProducteur).toBe('PROD001');
      expect(persistence.Surface).toBe(2.5);
      expect(persistence.GPSLatitude).toBe(14.7167);
      expect(persistence.GPSLongitude).toBe(-17.4677);
    });

    test('devrait créer depuis le format de persistance', () => {
      const persistenceData = {
        _id: '507f1f77bcf86cd799439011',
        NumParcelle: 'P001',
        CodeProducteur: 'PROD001',
        Surface: 2.5,
        GPSLatitude: 14.7167,
        GPSLongitude: -17.4677,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const parcelle = ParcelleEntity.fromPersistence(persistenceData);

      expect(parcelle.id).toBe('507f1f77bcf86cd799439011');
      expect(parcelle.numParcelle).toBe('P001');
      expect(parcelle.codeProducteur).toBe('PROD001');
      expect(parcelle.surface).toBe(2.5);
      expect(parcelle.coordonnees.latitude).toBe(14.7167);
      expect(parcelle.coordonnees.longitude).toBe(-17.4677);
    });

    test('devrait gérer l\'absence de coordonnées GPS en persistance', () => {
      const persistenceData = {
        _id: '507f1f77bcf86cd799439011',
        NumParcelle: 'P001',
        CodeProducteur: 'PROD001',
        Surface: 2.5,
        GPSLatitude: null,
        GPSLongitude: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const parcelle = ParcelleEntity.fromPersistence(persistenceData);

      expect(parcelle.coordonnees).toBeNull();
    });
  });

  describe('immutabilité', () => {
    test('ne devrait pas permettre la modification directe des propriétés', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 2.5
      });

      expect(() => {
        parcelle.numParcelle = 'P002';
      }).toThrow();
    });

    test('devrait créer une nouvelle instance lors des mises à jour', () => {
      const parcelle = ParcelleEntity.create({
        numParcelle: 'P001',
        surface: 2.5
      });

      const updated = parcelle.updateSurface(3.5);

      expect(updated).not.toBe(parcelle);
      expect(parcelle.surface).toBe(2.5);
      expect(updated.surface).toBe(3.5);
    });
  });
});