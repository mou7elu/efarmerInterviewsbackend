const BaseUseCase = require('../BaseUseCase');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const Region = require('../../../../models/Region');
const District = require('../../../../models/district');

/**
 * Use Case pour créer une nouvelle région
 */
class CreateRegionUseCase extends BaseUseCase {
  constructor() {
    super();
    this.requiredFields = ['libRegion', 'districtId'];
    this.optionalFields = ['coordonnee', 'sommeil'];
  }

  /**
   * Exécute la création d'une région
   * @param {Object} regionData - Données de la région à créer
   * @returns {Object} Région créée
   */
  async execute(regionData) {
    // Validation des données d'entrée
    this.validateInput(regionData);

    // Vérifier que le district existe
    const district = await District.findById(regionData.districtId);
    if (!district) {
      throw new NotFoundError('District non trouvé');
    }

    // Vérifier que le libellé est unique pour ce district
    const existingRegion = await Region.findOne({
      Lib_region: regionData.libRegion,
      DistrictId: regionData.districtId
    });

    if (existingRegion) {
      throw new ValidationError('Une région avec ce nom existe déjà dans ce district');
    }

    // Créer la nouvelle région
    const newRegion = new Region({
      Lib_region: regionData.libRegion,
      Coordonnee: regionData.coordonnee || null,
      Sommeil: regionData.sommeil || false,
      DistrictId: regionData.districtId
    });

    // Sauvegarder en base
    const savedRegion = await newRegion.save();

    // Peupler les références pour la réponse
    await savedRegion.populate('DistrictId');

    return {
      _id: savedRegion._id,
      libRegion: savedRegion.Lib_region,
      coordonnee: savedRegion.Coordonnee,
      sommeil: savedRegion.Sommeil,
      districtId: savedRegion.DistrictId,
      _createdAt: savedRegion.createdAt,
      _updatedAt: savedRegion.updatedAt
    };
  }

  /**
   * Validation spécifique pour les données de région
   * @param {Object} data - Données à valider
   */
  validateInput(data) {
    super.validateInput(data);

    // Validation du libellé
    if (!data.libRegion || typeof data.libRegion !== 'string' || data.libRegion.trim().length === 0) {
      throw new ValidationError('Le nom de la région est requis et doit être une chaîne non vide');
    }

    if (data.libRegion.length > 100) {
      throw new ValidationError('Le nom de la région ne peut pas dépasser 100 caractères');
    }



    // Validation du district ID
    if (!data.districtId) {
      throw new ValidationError('L\'ID du district est requis');
    }

    // Validation du sommeil
    if (data.sommeil !== undefined && typeof data.sommeil !== 'boolean') {
      throw new ValidationError('Le statut sommeil doit être un booléen');
    }
  }
}

module.exports = { CreateRegionUseCase };