const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const { PaysEntity } = require('../../../src/domain/entities/PaysEntity');
const { Libelle } = require('../../../src/domain/value-objects/Libelle');

describe('PaysEntity', () => {
  let validPaysData;

  beforeEach(() => {
    validPaysData = {
      id: '507f1f77bcf86cd799439011',
      libPays: 'France',
      sommeil: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    };
  });

  describe('Construction', () => {
    it('devrait créer une entité Pays valide', () => {
      const pays = new PaysEntity(validPaysData);

      expect(pays.id).toBe(validPaysData.id);
      expect(pays.libPays).toBeInstanceOf(Libelle);
      expect(pays.libPays.value).toBe(validPaysData.libPays);
      expect(pays.sommeil).toBe(false);
      expect(pays.createdAt).toEqual(validPaysData.createdAt);
      expect(pays.updatedAt).toEqual(validPaysData.updatedAt);
    });

    it('devrait utiliser les valeurs par défaut pour les champs optionnels', () => {
      const minimalData = {
        libPays: 'Sénégal'
      };

      const pays = new PaysEntity(minimalData);

      expect(pays.sommeil).toBe(false);
      expect(pays.createdAt).toBeInstanceOf(Date);
      expect(pays.updatedAt).toBeInstanceOf(Date);
    });

    it('devrait lever une erreur pour un libellé invalide', () => {
      const invalidData = {
        ...validPaysData,
        libPays: ''
      };

      expect(() => new PaysEntity(invalidData)).toThrow('Le libellé ne peut pas être vide');
    });

    it('devrait lever une erreur pour un libellé trop long', () => {
      const invalidData = {
        ...validPaysData,
        libPays: 'A'.repeat(101)
      };

      expect(() => new PaysEntity(invalidData)).toThrow('Le libellé ne peut pas dépasser 100 caractères');
    });

    it('devrait lever une erreur pour un sommeil non booléen', () => {
      const invalidData = {
        ...validPaysData,
        sommeil: 'false'
      };

      expect(() => new PaysEntity(invalidData)).toThrow('Le sommeil doit être un booléen');
    });
  });

  describe('Méthodes métier', () => {
    let pays;

    beforeEach(() => {
      pays = new PaysEntity(validPaysData);
    });

    describe('activer', () => {
      it('devrait activer un pays en sommeil', () => {
        pays.mettreDormir();
        const result = pays.activer();

        expect(result.sommeil).toBe(false);
        expect(result.updatedAt.getTime()).toBeGreaterThan(pays.createdAt.getTime());
      });

      it('devrait retourner le même pays si déjà actif', () => {
        const result = pays.activer();

        expect(result.sommeil).toBe(false);
        expect(result).toBe(pays);
      });
    });

    describe('mettreDormir', () => {
      it('devrait mettre un pays actif en sommeil', () => {
        const result = pays.mettreDormir();

        expect(result.sommeil).toBe(true);
        expect(result.updatedAt.getTime()).toBeGreaterThan(pays.createdAt.getTime());
      });

      it('devrait retourner le même pays si déjà en sommeil', () => {
        pays.mettreDormir();
        const result = pays.mettreDormir();

        expect(result.sommeil).toBe(true);
        expect(result).toBe(pays);
      });
    });

    describe('changerLibelle', () => {
      it('devrait changer le libellé du pays', () => {
        const nouveauLibelle = 'Burkina Faso';
        const result = pays.changerLibelle(nouveauLibelle);

        expect(result.libPays.value).toBe(nouveauLibelle);
        expect(result.updatedAt.getTime()).toBeGreaterThan(pays.createdAt.getTime());
      });

      it('devrait lever une erreur pour un libellé invalide', () => {
        expect(() => pays.changerLibelle('')).toThrow('Le libellé ne peut pas être vide');
      });

      it('devrait normaliser le libellé', () => {
        const result = pays.changerLibelle('  burkina faso  ');

        expect(result.libPays.value).toBe('Burkina faso');
      });
    });

    describe('estActif', () => {
      it('devrait retourner true pour un pays actif', () => {
        expect(pays.estActif()).toBe(true);
      });

      it('devrait retourner false pour un pays en sommeil', () => {
        pays.mettreDormir();
        expect(pays.estActif()).toBe(false);
      });
    });

    describe('estEnSommeil', () => {
      it('devrait retourner false pour un pays actif', () => {
        expect(pays.estEnSommeil()).toBe(false);
      });

      it('devrait retourner true pour un pays en sommeil', () => {
        pays.mettreDormir();
        expect(pays.estEnSommeil()).toBe(true);
      });
    });
  });

  describe('Sérialisation', () => {
    let pays;

    beforeEach(() => {
      pays = new PaysEntity(validPaysData);
    });

    describe('toDTO', () => {
      it('devrait convertir vers un DTO', () => {
        const dto = pays.toDTO();

        expect(dto).toEqual({
          id: validPaysData.id,
          libPays: validPaysData.libPays,
          sommeil: false,
          statut: 'Actif',
          createdAt: validPaysData.createdAt.toISOString(),
          updatedAt: validPaysData.updatedAt.toISOString()
        });
      });

      it('devrait afficher le bon statut pour un pays en sommeil', () => {
        pays.mettreDormir();
        const dto = pays.toDTO();

        expect(dto.statut).toBe('Inactif');
      });
    });

    describe('toPersistence', () => {
      it('devrait convertir vers le format de persistance', () => {
        const persistence = pays.toPersistence();

        expect(persistence).toEqual({
          _id: validPaysData.id,
          Lib_pays: validPaysData.libPays,
          Sommeil: false,
          createdAt: validPaysData.createdAt,
          updatedAt: validPaysData.updatedAt
        });
      });
    });

    describe('fromPersistence', () => {
      it('devrait créer une entité depuis les données de persistance', () => {
        const persistenceData = {
          _id: '507f1f77bcf86cd799439011',
          Lib_pays: 'Côte d\'Ivoire',
          Sommeil: true,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02')
        };

        const pays = PaysEntity.fromPersistence(persistenceData);

        expect(pays.id).toBe(persistenceData._id);
        expect(pays.libPays.value).toBe(persistenceData.Lib_pays);
        expect(pays.sommeil).toBe(true);
        expect(pays.createdAt).toEqual(persistenceData.createdAt);
        expect(pays.updatedAt).toEqual(persistenceData.updatedAt);
      });

      it('devrait gérer les champs optionnels manquants', () => {
        const minimalData = {
          _id: '507f1f77bcf86cd799439011',
          Lib_pays: 'Mali'
        };

        const pays = PaysEntity.fromPersistence(minimalData);

        expect(pays.sommeil).toBe(false);
        expect(pays.createdAt).toBeInstanceOf(Date);
        expect(pays.updatedAt).toBeInstanceOf(Date);
      });
    });
  });

  describe('Validation métier', () => {
    it('devrait accepter des caractères spéciaux dans le libellé', () => {
      const paysData = {
        ...validPaysData,
        libPays: 'Côte d\'Ivoire'
      };

      const pays = new PaysEntity(paysData);
      expect(pays.libPays.value).toBe('Côte d\'Ivoire');
    });

    it('devrait normaliser les espaces dans le libellé', () => {
      const paysData = {
        ...validPaysData,
        libPays: '  Burkina  Faso  '
      };

      const pays = new PaysEntity(paysData);
      expect(pays.libPays.value).toBe('Burkina Faso');
    });

    it('devrait préserver la casse du libellé', () => {
      const paysData = {
        ...validPaysData,
        libPays: 'États-Unis'
      };

      const pays = new PaysEntity(paysData);
      expect(pays.libPays.value).toBe('États-Unis');
    });
  });

  describe('Immutabilité', () => {
    let pays;

    beforeEach(() => {
      pays = new PaysEntity(validPaysData);
    });

    it('devrait créer une nouvelle instance lors du changement de libellé', () => {
      const nouveauPays = pays.changerLibelle('Nouveau Pays');

      expect(nouveauPays).not.toBe(pays);
      expect(pays.libPays.value).toBe('France');
      expect(nouveauPays.libPays.value).toBe('Nouveau Pays');
    });

    it('devrait créer une nouvelle instance lors de l\'activation', () => {
      pays.mettreDormir();
      const paysActif = pays.activer();

      expect(paysActif).not.toBe(pays);
      expect(pays.sommeil).toBe(true);
      expect(paysActif.sommeil).toBe(false);
    });
  });
});