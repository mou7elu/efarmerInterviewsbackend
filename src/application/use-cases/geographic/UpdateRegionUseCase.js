const BaseUseCase = require('../BaseUseCase');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const Region = require('../../../../models/Region');
const District = require('../../../../models/district');

/**
 * Use Case pour mettre à jour une région
 */
class UpdateRegionUseCase extends BaseUseCase {
  constructor() {
    super();
    this.allowedFields = ['libRegion', 'coordonnee', 'sommeil', 'districtId'];
  }

  /**
   * Exécute la mise à jour d'une région
   * @param {string} regionId - ID de la région à mettre à jour
   * @param {Object} updateData - Données de mise à jour
   * @returns {Object} Région mise à jour
   */
  async execute(regionId, updateData) {
    if (!regionId) {
      throw new ValidationError('L\'ID de la région est requis');
    }

    // Validation des données d'entrée
    this.validateUpdateData(updateData);

    // Vérifier que la région existe
    const existingRegion = await Region.findById(regionId);
    if (!existingRegion) {
      throw new NotFoundError('Région non trouvée');
    }

    // Si le district change, vérifier qu'il existe
    if (updateData.districtId && updateData.districtId !== existingRegion.DistrictId.toString()) {
      const district = await District.findById(updateData.districtId);
      if (!district) {
        throw new NotFoundError('District non trouvé');
      }
    }

    // Vérifier l'unicité du nom si modifié
    if (updateData.libRegion && updateData.libRegion !== existingRegion.Lib_region) {
      const districtId = updateData.districtId || existingRegion.DistrictId;
      const duplicateRegion = await Region.findOne({
        _id: { $ne: regionId },
        Lib_region: updateData.libRegion,
        DistrictId: districtId
      });

      if (duplicateRegion) {
        throw new ValidationError('Une région avec ce nom existe déjà dans ce district');
      }
    }

    // Préparer les données de mise à jour
    const updateFields = {};
    if (updateData.libRegion !== undefined) updateFields.Lib_region = updateData.libRegion;
    if (updateData.coordonnee !== undefined) updateFields.Coordonnee = updateData.coordonnee;
    if (updateData.sommeil !== undefined) updateFields.Sommeil = updateData.sommeil;
    if (updateData.districtId !== undefined) updateFields.DistrictId = updateData.districtId;

    // Effectuer la mise à jour
    const updatedRegion = await Region.findByIdAndUpdate(
      regionId,
      updateFields,
      { new: true, runValidators: true }
    ).populate('DistrictId');

    if (!updatedRegion) {
      throw new NotFoundError('Région non trouvée');
    }

    return {
      _id: updatedRegion._id,
      libRegion: updatedRegion.Lib_region,
      coordonnee: updatedRegion.Coordonnee,
      sommeil: updatedRegion.Sommeil,
      districtId: updatedRegion.DistrictId,
      _createdAt: updatedRegion.createdAt,
      _updatedAt: updatedRegion.updatedAt
    };
  }

  /**
   * Validation spécifique pour les données de mise à jour
   * @param {Object} data - Données à valider
   */
  validateUpdateData(data) {
    if (!data || Object.keys(data).length === 0) {
      throw new ValidationError('Aucune donnée de mise à jour fournie');
    }

    // Validation du libellé
    if (data.libRegion !== undefined) {
      if (!data.libRegion || typeof data.libRegion !== 'string' || data.libRegion.trim().length === 0) {
        throw new ValidationError('Le nom de la région doit être une chaîne non vide');
      }
      if (data.libRegion.length > 100) {
        throw new ValidationError('Le nom de la région ne peut pas dépasser 100 caractères');
      }
    }



    // Validation du sommeil
    if (data.sommeil !== undefined && typeof data.sommeil !== 'boolean') {
      throw new ValidationError('Le statut sommeil doit être un booléen');
    }
  }
}

module.exports = { UpdateRegionUseCase };