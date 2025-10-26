const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const { DistrictEntity } = require('../../../src/domain/entities/DistrictEntity');
const { Libelle } = require('../../../src/domain/value-objects/Libelle');

describe('DistrictEntity', () => {
  let validDistrictData;

  beforeEach(() => {
    validDistrictData = {
      id: '507f1f77bcf86cd799439012',
      libDistrict: 'Dakar',
      paysId: '507f1f77bcf86cd799439011',
      sommeil: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    };
  });

  describe('Construction', () => {
    it('devrait créer une entité District valide', () => {
      const district = new DistrictEntity(validDistrictData);

      expect(district.id).toBe(validDistrictData.id);
      expect(district.libDistrict).toBeInstanceOf(Libelle);
      expect(district.libDistrict.value).toBe(validDistrictData.libDistrict);
      expect(district.paysId).toBe(validDistrictData.paysId);
      expect(district.sommeil).toBe(false);
      expect(district.createdAt).toEqual(validDistrictData.createdAt);
      expect(district.updatedAt).toEqual(validDistrictData.updatedAt);
    });

    it('devrait utiliser les valeurs par défaut pour les champs optionnels', () => {
      const minimalData = {
        libDistrict: 'Thiès',
        paysId: '507f1f77bcf86cd799439011'
      };

      const district = new DistrictEntity(minimalData);

      expect(district.sommeil).toBe(false);
      expect(district.createdAt).toBeInstanceOf(Date);
      expect(district.updatedAt).toBeInstanceOf(Date);
    });

    it('devrait lever une erreur pour un libellé invalide', () => {
      const invalidData = {
        ...validDistrictData,
        libDistrict: ''
      };

      expect(() => new DistrictEntity(invalidData)).toThrow('Le libellé ne peut pas être vide');
    });

    it('devrait lever une erreur pour un paysId manquant', () => {
      const invalidData = {
        ...validDistrictData,
        paysId: undefined
      };

      expect(() => new DistrictEntity(invalidData)).toThrow('L\'ID du pays est requis');
    });

    it('devrait lever une erreur pour un paysId invalide', () => {
      const invalidData = {
        ...validDistrictData,
        paysId: ''
      };

      expect(() => new DistrictEntity(invalidData)).toThrow('L\'ID du pays ne peut pas être vide');
    });

    it('devrait lever une erreur pour un sommeil non booléen', () => {
      const invalidData = {
        ...validDistrictData,
        sommeil: 'false'
      };

      expect(() => new DistrictEntity(invalidData)).toThrow('Le sommeil doit être un booléen');
    });
  });

  describe('Méthodes métier', () => {
    let district;

    beforeEach(() => {
      district = new DistrictEntity(validDistrictData);
    });

    describe('activer', () => {
      it('devrait activer un district en sommeil', () => {
        district.mettreDormir();
        const result = district.activer();

        expect(result.sommeil).toBe(false);
        expect(result.updatedAt.getTime()).toBeGreaterThan(district.createdAt.getTime());
      });

      it('devrait retourner le même district si déjà actif', () => {
        const result = district.activer();

        expect(result.sommeil).toBe(false);
        expect(result).toBe(district);
      });
    });

    describe('mettreDormir', () => {
      it('devrait mettre un district actif en sommeil', () => {
        const result = district.mettreDormir();

        expect(result.sommeil).toBe(true);
        expect(result.updatedAt.getTime()).toBeGreaterThan(district.createdAt.getTime());
      });

      it('devrait retourner le même district si déjà en sommeil', () => {
        district.mettreDormir();
        const result = district.mettreDormir();

        expect(result.sommeil).toBe(true);
        expect(result).toBe(district);
      });
    });

    describe('changerLibelle', () => {
      it('devrait changer le libellé du district', () => {
        const nouveauLibelle = 'Saint-Louis';
        const result = district.changerLibelle(nouveauLibelle);

        expect(result.libDistrict.value).toBe(nouveauLibelle);
        expect(result.updatedAt.getTime()).toBeGreaterThan(district.createdAt.getTime());
      });

      it('devrait lever une erreur pour un libellé invalide', () => {
        expect(() => district.changerLibelle('')).toThrow('Le libellé ne peut pas être vide');
      });

      it('devrait normaliser le libellé', () => {
        const result = district.changerLibelle('  saint-louis  ');

        expect(result.libDistrict.value).toBe('Saint-louis');
      });
    });

    describe('changerPays', () => {
      it('devrait changer le pays du district', () => {
        const nouveauPaysId = '507f1f77bcf86cd799439013';
        const result = district.changerPays(nouveauPaysId);

        expect(result.paysId).toBe(nouveauPaysId);
        expect(result.updatedAt.getTime()).toBeGreaterThan(district.createdAt.getTime());
      });

      it('devrait lever une erreur pour un paysId invalide', () => {
        expect(() => district.changerPays('')).toThrow('L\'ID du pays ne peut pas être vide');
      });

      it('devrait retourner le même district si même paysId', () => {
        const result = district.changerPays(validDistrictData.paysId);

        expect(result).toBe(district);
      });
    });

    describe('estActif', () => {
      it('devrait retourner true pour un district actif', () => {
        expect(district.estActif()).toBe(true);
      });

      it('devrait retourner false pour un district en sommeil', () => {
        district.mettreDormir();
        expect(district.estActif()).toBe(false);
      });
    });

    describe('estEnSommeil', () => {
      it('devrait retourner false pour un district actif', () => {
        expect(district.estEnSommeil()).toBe(false);
      });

      it('devrait retourner true pour un district en sommeil', () => {
        district.mettreDormir();
        expect(district.estEnSommeil()).toBe(true);
      });
    });

    describe('appartientAuPays', () => {
      it('devrait retourner true pour le bon pays', () => {
        expect(district.appartientAuPays(validDistrictData.paysId)).toBe(true);
      });

      it('devrait retourner false pour un autre pays', () => {
        expect(district.appartientAuPays('507f1f77bcf86cd799439013')).toBe(false);
      });

      it('devrait lever une erreur pour un paysId invalide', () => {
        expect(() => district.appartientAuPays('')).toThrow('L\'ID du pays ne peut pas être vide');
      });
    });
  });

  describe('Sérialisation', () => {
    let district;

    beforeEach(() => {
      district = new DistrictEntity(validDistrictData);
    });

    describe('toDTO', () => {
      it('devrait convertir vers un DTO', () => {
        const dto = district.toDTO();

        expect(dto).toEqual({
          id: validDistrictData.id,
          libDistrict: validDistrictData.libDistrict,
          paysId: validDistrictData.paysId,
          sommeil: false,
          statut: 'Actif',
          createdAt: validDistrictData.createdAt.toISOString(),
          updatedAt: validDistrictData.updatedAt.toISOString()
        });
      });

      it('devrait afficher le bon statut pour un district en sommeil', () => {
        district.mettreDormir();
        const dto = district.toDTO();

        expect(dto.statut).toBe('Inactif');
      });
    });

    describe('toPersistence', () => {
      it('devrait convertir vers le format de persistance', () => {
        const persistence = district.toPersistence();

        expect(persistence).toEqual({
          _id: validDistrictData.id,
          Lib_district: validDistrictData.libDistrict,
          PaysId: validDistrictData.paysId,
          Sommeil: false,
          createdAt: validDistrictData.createdAt,
          updatedAt: validDistrictData.updatedAt
        });
      });
    });

    describe('fromPersistence', () => {
      it('devrait créer une entité depuis les données de persistance', () => {
        const persistenceData = {
          _id: '507f1f77bcf86cd799439012',
          Lib_district: 'Kaolack',
          PaysId: '507f1f77bcf86cd799439011',
          Sommeil: true,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02')
        };

        const district = DistrictEntity.fromPersistence(persistenceData);

        expect(district.id).toBe(persistenceData._id);
        expect(district.libDistrict.value).toBe(persistenceData.Lib_district);
        expect(district.paysId).toBe(persistenceData.PaysId);
        expect(district.sommeil).toBe(true);
        expect(district.createdAt).toEqual(persistenceData.createdAt);
        expect(district.updatedAt).toEqual(persistenceData.updatedAt);
      });

      it('devrait gérer les champs optionnels manquants', () => {
        const minimalData = {
          _id: '507f1f77bcf86cd799439012',
          Lib_district: 'Fatick',
          PaysId: '507f1f77bcf86cd799439011'
        };

        const district = DistrictEntity.fromPersistence(minimalData);

        expect(district.sommeil).toBe(false);
        expect(district.createdAt).toBeInstanceOf(Date);
        expect(district.updatedAt).toBeInstanceOf(Date);
      });
    });
  });

  describe('Validation métier', () => {
    it('devrait accepter des caractères spéciaux dans le libellé', () => {
      const districtData = {
        ...validDistrictData,
        libDistrict: 'Saint-Louis'
      };

      const district = new DistrictEntity(districtData);
      expect(district.libDistrict.value).toBe('Saint-Louis');
    });

    it('devrait normaliser les espaces dans le libellé', () => {
      const districtData = {
        ...validDistrictData,
        libDistrict: '  Matam  Nord  '
      };

      const district = new DistrictEntity(districtData);
      expect(district.libDistrict.value).toBe('Matam Nord');
    });

    it('devrait préserver la casse du libellé', () => {
      const districtData = {
        ...validDistrictData,
        libDistrict: 'Kédougou'
      };

      const district = new DistrictEntity(districtData);
      expect(district.libDistrict.value).toBe('Kédougou');
    });

    it('devrait valider le format ObjectId pour paysId', () => {
      const validObjectId = '507f1f77bcf86cd799439011';
      const districtData = {
        ...validDistrictData,
        paysId: validObjectId
      };

      const district = new DistrictEntity(districtData);
      expect(district.paysId).toBe(validObjectId);
    });
  });

  describe('Immutabilité', () => {
    let district;

    beforeEach(() => {
      district = new DistrictEntity(validDistrictData);
    });

    it('devrait créer une nouvelle instance lors du changement de libellé', () => {
      const nouveauDistrict = district.changerLibelle('Nouveau District');

      expect(nouveauDistrict).not.toBe(district);
      expect(district.libDistrict.value).toBe('Dakar');
      expect(nouveauDistrict.libDistrict.value).toBe('Nouveau District');
    });

    it('devrait créer une nouvelle instance lors du changement de pays', () => {
      const nouveauDistrict = district.changerPays('507f1f77bcf86cd799439013');

      expect(nouveauDistrict).not.toBe(district);
      expect(district.paysId).toBe('507f1f77bcf86cd799439011');
      expect(nouveauDistrict.paysId).toBe('507f1f77bcf86cd799439013');
    });

    it('devrait créer une nouvelle instance lors de l\'activation', () => {
      district.mettreDormir();
      const districtActif = district.activer();

      expect(districtActif).not.toBe(district);
      expect(district.sommeil).toBe(true);
      expect(districtActif.sommeil).toBe(false);
    });
  });

  describe('Relations géographiques', () => {
    let district;

    beforeEach(() => {
      district = new DistrictEntity(validDistrictData);
    });

    it('devrait maintenir la relation avec le pays parent', () => {
      expect(district.paysId).toBe(validDistrictData.paysId);
      expect(district.appartientAuPays(validDistrictData.paysId)).toBe(true);
    });

    it('devrait permettre de changer de pays parent', () => {
      const nouveauPaysId = '507f1f77bcf86cd799439013';
      const nouveauDistrict = district.changerPays(nouveauPaysId);

      expect(nouveauDistrict.appartientAuPays(nouveauPaysId)).toBe(true);
      expect(nouveauDistrict.appartientAuPays(validDistrictData.paysId)).toBe(false);
    });
  });
});